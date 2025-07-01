import React from 'react';
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter as DialogFormFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Mock data
const manufacturers = [
  { id: 1, name: "Huawei", logo: "/logos/huawei.png", description: "Inversores inteligentes e soluções de monitoramento" },
  { id: 2, name: "Sungrow", logo: "/logos/isolarcloud.png", description: "Inversores residenciais e comerciais" },
  { id: 3, name: "Growatt", logo: "/logos/growatt.png", description: "Inversores e soluções de armazenamento de energia" },
  { id: 6, name: "Hypontech", logo: "/logos/hyponcloud.png", description: "Inversores string e centrais" },
  { id: 7, name: "Deye", logo: "/logos/deye.png", description: "Inversores string e centrais" },
];

const getApiUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL;
  return rawUrl?.replace(/^http:\/\//, "https://").replace(/\/+$/, "");
};

const LoginDialog = ({ manufacturer, integracao }: { manufacturer: any, integracao?: any }) => {
  const { toast } = useToast();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const url = `${getApiUrl()}/integracoes/`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plataforma: manufacturer.name,
          username: username,
          senha: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || "Erro ao integrar com a plataforma.");
      }

      toast({
        title: "Dados enviados",
        description: `Aguardando integração com ${manufacturer.name}`,
      });

      setOpen(false);
      setShowConfirm(true);
    } catch (error: any) {
      console.error("Erro ao conectar:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao tentar integrar",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {!integracao ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-solar-orange hover:bg-solar-orange/90">
              <ArrowRight className="mr-2 h-4 w-4" /> Acessar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Login - {manufacturer.name}</DialogTitle>
              <DialogDescription>
                Insira suas credenciais para integrar com {manufacturer.name}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Usuário</Label>
                  <Input
                    id="username"
                    placeholder="Seu nome de usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <DialogFormFooter>
                <Button type="submit" className="bg-solar-blue hover:bg-solar-blue/90">
                  Conectar
                </Button>
              </DialogFormFooter>
            </form>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="text-sm text-muted-foreground italic">
          Em processo de integração
        </div>
      )}

      {/* Dialog de confirmação */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dados enviados com sucesso</AlertDialogTitle>
            <AlertDialogDescription>
              Os dados foram enviados para integração com {manufacturer.name}. Em até 48h a integração será realizada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => window.location.reload()}>OK</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const Integracoes = () => {
  const [integracoes, setIntegracoes] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchIntegracoes = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${getApiUrl()}/integracoes/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setIntegracoes(data);
      } catch (err) {
        console.error("Erro ao buscar integrações:", err);
      }
    };

    fetchIntegracoes();
  }, []);

  const getIntegracaoByPlataforma = (plataforma: string) =>
    integracoes.find((i) => i.plataforma === plataforma);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-solar-blue dark:text-white">Integrações</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Conecte-se com plataformas de fabricantes de inversores e outros dispositivos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {manufacturers.map((manufacturer) => (
          <Card key={manufacturer.id}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
                  <img src={manufacturer.logo} alt={manufacturer.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <CardTitle>{manufacturer.name}</CardTitle>
                  <CardDescription>{manufacturer.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Integre seus dispositivos {manufacturer.name} para monitoramento em tempo real e relatórios detalhados.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
              <LoginDialog
                manufacturer={manufacturer}
                integracao={getIntegracaoByPlataforma(manufacturer.name)}
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Integracoes;
