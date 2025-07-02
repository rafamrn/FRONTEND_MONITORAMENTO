import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

console.log("API URL:", import.meta.env.VITE_API_URL);

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: string;
  status: 'active' | 'inactive' | 'pending';
  paymentStatus: 'up-to-date' | 'overdue' | 'cancelled';
  lastPayment: string;
  createdAt: string;
}

interface Integration {
  id: number;
  cliente_id: number;
  nome?: string;
  plataforma: string;
  username: string;
  senha: string;
  appkey: string | null;
  x_access_key: string | null;
  status: string;
  ultima_sincronizacao?: string;
}




const salvarChaves = async (id: number, appkey: string, xAccessKey: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/integracoes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ appkey, x_access_key: xAccessKey }),
    });

    if (!res.ok) {
      throw new Error("Erro ao salvar chaves.");
    }

    toast({
      title: "Chaves salvas com sucesso!",
      description: "As credenciais foram atualizadas.",
    });

  } catch (error: any) {
    toast({
      title: "Erro ao salvar",
      description: error.message || "Falha ao atualizar as chaves.",
      variant: "destructive",
    });
  }
};

const handleUpdateKeys = async (id: string, appkey: string, x_access_key: string) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/integracoes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ appkey, x_access_key }),
    });

    if (!res.ok) throw new Error("Erro ao atualizar as chaves.");

    toast({
      title: "Chaves atualizadas",
      description: "As credenciais foram atualizadas com sucesso.",
    });
  } catch (error: any) {
    toast({
      title: "Erro",
      description: error.message || "Não foi possível atualizar as chaves.",
      variant: "destructive",
    });
  }
};

const handleCreateClient = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newClient),
    });

    if (!res.ok) throw new Error("Erro ao criar cliente");

    const data = await res.json();
    setClients([...clients, data]);
    toast({ title: "Cliente criado", description: "Novo cliente adicionado com sucesso." });

    // 🔁 Cria convite automaticamente após o cliente
    const conviteRes = await fetch(`${import.meta.env.VITE_API_URL}/convites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        email: newClient.email,
        cliente_id: data.id, // <-- ID retornado do novo cliente
      }),
    });

    if (!conviteRes.ok) throw new Error("Cliente criado, mas erro ao gerar convite");

    const conviteData = await conviteRes.json();
    toast({
      title: "Convite gerado",
      description: `Token: ${conviteData.token}`,
    });

    setNewClient({ name: "", email: "", password: "", company: "", plan: "" });

  } catch (err: any) {
    toast({
      title: "Erro",
      description: err.message || "Erro ao criar cliente",
      variant: "destructive",
    });
  }
};




const Admin = () => {
  const { toast } = useToast();
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [convites, setConvites] = useState<{ email: string; token: string; utilizado: boolean }[]>([]);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [clients, setClients] = useState<Client[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch(`${import.meta.env.VITE_API_URL}/admin/convites`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setConvites(data))
    .catch((err) => console.error("Erro ao buscar convites:", err));
}, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/clientes`)
      .then(res => res.json())
      .then(setClients)
      .catch(err => console.error("Erro ao buscar clientes:", err));
  }, []);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch(`${import.meta.env.VITE_API_URL}/admin/integracoes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Erro ao buscar integrações.");
      }
      return res.json();
    })
    .then((data) => {
      setIntegrations(data);
      console.log("🔍 Integrações recebidas:", data);
    })
    .catch((err) => {
      console.error("Erro ao buscar integrações:", err);
    });
}, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants = {
      'up-to-date': 'bg-green-100 text-green-800',
      'overdue': 'bg-red-100 text-red-800',
      'cancelled': 'bg-gray-100 text-gray-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const handleDeleteClient = async (clientId: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/clientes/${clientId}`, {
      method: "DELETE",
    });
    setClients(clients.filter(client => client.id !== clientId));

    toast({
      title: "Cliente removido",
      description: "O cliente foi removido com sucesso.",
    });
  } catch (err: any) {
    toast({
      title: "Erro",
      description: err.message || "Erro ao excluir cliente.",
      variant: "destructive",
    });
  }
};

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

const payload = {
  name: formData.get('name'),
  email: formData.get('email'),
  password: formData.get('password'), // ✅ ADICIONAR ISSO
  company: formData.get('company'),
  plan: formData.get('plan'),
  status: 'active',
  payment_status: 'up-to-date',
  last_payment: new Date().toISOString().split('T')[0],
  created_at: new Date().toISOString().split('T')[0]
};

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || "Erro ao criar cliente.");
      }

      setClients([...clients, {
        id: data.id,
        name: data.name,
        email: data.email,
        company: data.company,
        plan: data.plan,
        status: data.status,
        paymentStatus: data.payment_status,
        lastPayment: data.last_payment,
        createdAt: data.created_at,
      }]);

      setIsNewClientDialogOpen(false);
      (e.target as HTMLFormElement).reset();

      toast({
        title: "Cliente criado",
        description: "Novo cliente foi adicionado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar o cliente.",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = (integrationId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-solar-blue dark:text-white">Administração</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Gerencie clientes, pagamentos e integrações da plataforma.
        </p>
      </div>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clients">Gestão de Clientes</TabsTrigger>
          <TabsTrigger value="integrations">Solicitações de Integração</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Clientes Cadastrados
                  </CardTitle>
                  <CardDescription>
                    Gerencie todos os clientes da plataforma, seus planos e status de pagamento.
                  </CardDescription>
                </div>
                <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-solar-blue hover:bg-solar-blue/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Cliente
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Novo Cliente</DialogTitle>
                      <DialogDescription>
                        Adicione um novo cliente à plataforma.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateClient}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Nome</Label>
                          <Input id="name" name="name" placeholder="Nome completo" required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" type="email" placeholder="email@exemplo.com" required />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" name="password" type="password" placeholder="Senha de acesso"/>
                      </div>
                        <div className="grid gap-2">
                          <Label htmlFor="company">Empresa</Label>
                          <Input id="company" name="company" placeholder="Nome da empresa" required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="plan">Plano</Label>
                          <select id="plan" name="plan" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required>
                            <option value="Basic">Basic</option>
                            <option value="Professional">Professional</option>
                            <option value="Enterprise">Enterprise</option>
                          </select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Criar Cliente</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Último Pagamento</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
<TableBody>
  {clients.map((client) => {
    const convite = convites.find(c => c.email === client.email);
    const token = convite?.token || "—";
    const status = convite?.utilizado ? 'active' : 'pending';

    return (
      <TableRow key={client.id}>
        <TableCell>
          <div>
            <div className="font-medium">{client.name}</div>
            <div className="text-sm text-muted-foreground">{client.email}</div>
          </div>
        </TableCell>
        <TableCell>{client.company}</TableCell>
        <TableCell>
          <Badge variant="outline">{client.plan}</Badge>
        </TableCell>
        <TableCell>{convite?.token || "—"}</TableCell>
        <TableCell>
          <Badge className={getStatusBadge(convite?.utilizado ? 'active' : 'pending')}>
            {convite?.utilizado ? 'Ativo' : 'Pendente'}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge className={getPaymentStatusBadge(client.paymentStatus)}>
            {client.paymentStatus === 'up-to-date' ? 'Em dia' : 
             client.paymentStatus === 'overdue' ? 'Atrasado' : 'Cancelado'}
          </Badge>
        </TableCell>
        <TableCell>{client.lastPayment || "—"}</TableCell>
        <TableCell>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja remover o cliente {client.name}? 
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteClient(client.id)}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TableCell>
      </TableRow>
    );
  })}
</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados de Autenticação das Integrações</CardTitle>
              <CardDescription>
                Visualize as credenciais de autenticação dos clientes para suas integrações.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
<TableHeader>
  <TableRow>
    <TableHead>ID Integração</TableHead>
    <TableHead>Cliente</TableHead>
    <TableHead>Plataforma</TableHead>
    <TableHead>Usuário</TableHead>
    <TableHead>Senha</TableHead>
    <TableHead>X-Access-Key</TableHead>
    <TableHead>AppKey</TableHead>
    <TableHead>Ações</TableHead>
    <TableHead>Status</TableHead>
    <TableHead>Última Sincronização</TableHead>
  </TableRow>
</TableHeader>
<TableBody>
  {integrations.map((integration) => (
    <TableRow key={integration.id}>
      <TableCell>{integration.id}</TableCell>
      <TableCell>
        <div className="font-medium">
          {integration.nome ||
            clients.find((c) => c.id === integration.cliente_id)?.name ||
            "—"}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{integration.plataforma}</Badge>
      </TableCell>
      <TableCell>{integration.username}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">
            {showPasswords[integration.id] ? integration.senha : "••••••••"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => togglePasswordVisibility(String(integration.id))}
          >
            {showPasswords[integration.id] ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <Input
          value={integration.x_access_key || ""}
          onChange={(e) => {
            const newValue = e.target.value;
            setIntegrations((prev) =>
              prev.map((i) =>
                i.id === integration.id
                  ? { ...i, x_access_key: newValue }
                  : i
              )
            );
          }}
          placeholder="x-access-key"
          className="w-40"
        />
      </TableCell>
      <TableCell>
        <Input
          value={integration.appkey || ""}
          onChange={(e) => {
            const newValue = e.target.value;
            setIntegrations((prev) =>
              prev.map((i) =>
                i.id === integration.id ? { ...i, appkey: newValue } : i
              )
            );
          }}
          placeholder="appkey"
          className="w-40"
        />
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            handleUpdateKeys(
              integration.id.toString(),
              integration.appkey || "",
              integration.x_access_key || ""
            )
          }
        >
          Salvar
        </Button>
      </TableCell>
      <TableCell>
        <Badge className={getStatusBadge(integration.status)}>
          {integration.status === "active" ? "Ativo" : "Inativo"}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {integration.ultima_sincronizacao
          ? new Date(integration.ultima_sincronizacao).toLocaleString("pt-BR")
          : "—"}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
