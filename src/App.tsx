
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Usinas from "./pages/Usinas";
import UsinaDetalhe from "./pages/UsinaDetalhe";
import Relatorios from "./pages/Relatorios";
import Alertas from "./pages/Alertas";
import Integracoes from "./pages/Integracoes";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
  }, []);

  // Show nothing until we've checked authentication status
  if (isAuthenticated === null) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              <Route path="/esqueci-senha" element={<ForgotPassword />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="usinas" element={<Usinas />} />
                <Route path="usina/:id" element={<UsinaDetalhe />} />
                <Route path="relatorios" element={<Relatorios />} />
                <Route path="alertas" element={<Alertas />} />
                <Route path="integracoes" element={<Integracoes />} />
                <Route path="configuracoes" element={<Configuracoes />} />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
