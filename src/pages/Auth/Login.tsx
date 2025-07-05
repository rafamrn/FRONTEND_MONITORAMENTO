import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

const form = useForm<LoginFormValues>({
  resolver: zodResolver(loginSchema),
  mode: "onChange", // <- garante que a validação seja reativa
  defaultValues: {
    email: "",
    password: "",
  },
});

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://backendmonitoramento-production.up.railway.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Erro ao fazer login");
      }

      // Armazenar token
      localStorage.setItem("token", result.access_token);

      // Opcional: simular dados do usuário com o e-mail
      const mockUser = {
        name: "Usuário",
        email: data.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
      };
      localStorage.setItem("user", JSON.stringify(mockUser));

      toast({
        title: "Login bem-sucedido",
        description: "Você foi autenticado com sucesso",
      });

      navigate("/"); // ou diretamente para /usinas se preferir
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center justify-center w-50 h-20 mb-4">
            <img src="/favicon2.ico" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-right text-sm">
                <Link to="/esqueci-senha" className="text-solar-orange hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
                className={`w-full transition-all duration-300 ${
                  form.formState.isValid
                    ? "bg-solar-orange hover:bg-solar-orange/90 hover:shadow-[0_0_12px_rgba(255,123,0,0.8)]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
  <p className="text-sm text-gray-500">
    Ainda não tem uma conta?{" "}
    <Link to="/cadastro" className="text-solar-orange hover:underline ml-1">
      Cadastre-se
    </Link>
  </p>
</CardFooter>

      </Card>
    </div>
  );
};

export default Login;
