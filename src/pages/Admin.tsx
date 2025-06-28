import React, { useState } from 'react';
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
  id: string;
  clientId: string;
  clientName: string;
  platform: string;
  username: string;
  password: string;
  status: 'active' | 'inactive';
  lastSync: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  
  // Mock data for clients
  const [clients, setClients] = useState<Client[]>([]);

  // Mock data for integrations
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      clientId: '1',
      clientName: 'João Silva',
      platform: 'SolarEdge',
      username: 'joao.solaredge',
      password: '********',
      status: 'active',
      lastSync: '2024-01-20 10:30'
    },
    {
      id: '2',
      clientId: '2',
      clientName: 'Maria Santos',
      platform: 'Huawei',
      username: 'maria.huawei',
      password: '********',
      status: 'active',
      lastSync: '2024-01-19 15:45'
    }
  ]);

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

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter(client => client.id !== clientId));
    toast({
      title: "Cliente removido",
      description: "O cliente foi removido com sucesso.",
    });
  };

const handleCreateClient = async (e: React.FormEvent) => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);

  const payload = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // ✅ Evita erro se a resposta não for JSON
      let data = null;
      try {
        data = await res.json();
      } catch {
        // resposta vazia, mantém `data` como null
      }

      if (!res.ok) {
        throw new Error(data?.detail || "Erro ao criar usuário.");
      }

    // ✅ Se tudo deu certo, adiciona localmente à tabela da interface
    const newClient: Client = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      plan: formData.get('plan') as string,
      status: 'active',
      paymentStatus: 'up-to-date',
      lastPayment: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setClients([...clients, newClient]);
    setIsNewClientDialogOpen(false);

    toast({
      title: "Cliente criado",
      description: "Novo cliente foi adicionado com sucesso.",
    });

    (e.target as HTMLFormElement).reset();

  } catch (error: any) {
    toast({
      title: "Erro",
      description: error.message || "Não foi possível criar o usuário.",
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
          <TabsTrigger value="integrations">Dados de Integração</TabsTrigger>
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
                        <Input id="password" name="password" type="password" placeholder="Senha de acesso" required />
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
                    <TableHead>Status</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Último Pagamento</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
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
                      <TableCell>
                        <Badge className={getStatusBadge(client.status)}>
                          {client.status === 'active' ? 'Ativo' : client.status === 'inactive' ? 'Inativo' : 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusBadge(client.paymentStatus)}>
                          {client.paymentStatus === 'up-to-date' ? 'Em dia' : 
                           client.paymentStatus === 'overdue' ? 'Atrasado' : 'Cancelado'}
                        </Badge>
                      </TableCell>
                      <TableCell>{client.lastPayment}</TableCell>
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
                  ))}
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
                    <TableHead>Cliente</TableHead>
                    <TableHead>Plataforma</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Senha</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Última Sincronização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {integrations.map((integration) => (
                    <TableRow key={integration.id}>
                      <TableCell>
                        <div className="font-medium">{integration.clientName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{integration.platform}</Badge>
                      </TableCell>
                      <TableCell>{integration.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {showPasswords[integration.id] ? 'senhaSecreta123' : '••••••••••••'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePasswordVisibility(integration.id)}
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
                        <Badge className={getStatusBadge(integration.status)}>
                          {integration.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {integration.lastSync}
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
