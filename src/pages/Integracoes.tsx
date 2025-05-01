
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Mock data for manufacturers
const manufacturers = [
  {
    id: 1,
    name: "SolarEdge",
    logo: "public/lovable-uploads/495a966f-2f87-4603-b2ea-6a11b4d4490a.png",
    description: "Inversores e otimizadores de potência",
  },
  {
    id: 2,
    name: "Huawei",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Huawei",
    description: "Inversores inteligentes e soluções de monitoramento",
  },
  {
    id: 3,
    name: "SMA Solar",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=SMA",
    description: "Inversores residenciais e comerciais",
  },
  {
    id: 4,
    name: "Growatt",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Growatt",
    description: "Inversores e soluções de armazenamento de energia",
  },
  {
    id: 5,
    name: "Fronius",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Fronius",
    description: "Inversores e sistemas de monitoramento",
  },
  {
    id: 6,
    name: "ABB",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=ABB",
    description: "Inversores string e centrais",
  },
];

// Login Dialog Component
const LoginDialog = ({ manufacturer }: { manufacturer: any }) => {
  const { toast } = useToast();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Integração iniciada",
      description: `Conectando com ${manufacturer.name}...`,
    });
  };
  
  return (
    <Dialog>
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
              <Input id="username" placeholder="Seu nome de usuário" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="Sua senha" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-solar-blue hover:bg-solar-blue/90">
              Conectar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main Integrations Page
const Integracoes = () => {
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
                  <img 
                    src={manufacturer.logo} 
                    alt={`${manufacturer.name} logo`} 
                    className="w-full h-full object-cover"
                  />
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
            <CardFooter>
              <LoginDialog manufacturer={manufacturer} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Integracoes;
