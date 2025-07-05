
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sun } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }), // ⬅️ AQUI
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string(),
  token: z.string().uuid({ message: "Token inválido" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

const form = useForm<RegisterFormValues>({
  resolver: zodResolver(registerSchema),
  defaultValues: {
    name: "",
    email: "", // ⬅️ AQUI
    password: "",
    confirmPassword: "",
    token: "",
  },
});

const onSubmit = async (data: RegisterFormValues) => {
  setIsLoading(true);
  try {
    console.log("Payload enviado:", data); // 👈 Verifique o formato

    const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

if (!response.ok) {
  const error = await response.json();
  console.log("Erro detalhado do backend:", error); // <-- Aqui está o log
  throw new Error(error.detail || "Erro ao registrar");
}

    toast({
      title: "Registro realizado",
      description: "Sua conta foi criada com sucesso",
    });

    navigate("/login");
  } catch (error: any) {
    toast({
      title: "Erro no registro",
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
          <CardTitle className="text-2xl font-bold text-center">Cadastro</CardTitle>
<CardDescription>
  Informe seu nome, defina uma senha e use o token de acesso enviado por e-mail.
</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

  {/* TOKEN */}
  <FormField
    control={form.control}
    name="token"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Token</FormLabel>
        <FormControl>
          <Input placeholder="Cole o token recebido por e-mail" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  {/* NOME */}
  <FormField
    control={form.control}
    name="name"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Nome</FormLabel>
        <FormControl>
          <Input placeholder="Seu nome completo" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  {/* EMAIL */}
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>E-mail</FormLabel>
        <FormControl>
          <Input type="email" placeholder="seuemail@exemplo.com" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  {/* SENHA */}
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

  {/* CONFIRMAR SENHA */}
  <FormField
    control={form.control}
    name="confirmPassword"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Confirmar Senha</FormLabel>
        <FormControl>
          <Input type="password" placeholder="******" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  <Button 
    type="submit" 
    className="w-full bg-solar-blue hover:bg-solar-blue/90"
    disabled={isLoading}
  >
    {isLoading ? "Cadastrando..." : "Cadastrar"}
  </Button>
</form>

          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-solar-orange hover:underline">
              Faça login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
