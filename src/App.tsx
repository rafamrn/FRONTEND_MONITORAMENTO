import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/ThemeProvider";
import AppLayout from "./components/AppLayout";
import RequireAuth from "./components/RequireAuth";
import Dashboard from "./pages/Dashboard";
import Usinas from "./pages/Usinas";
import UsinaDetalhe from "./pages/UsinaDetalhe";
import Relatorios from "./pages/Relatorios";
import Alertas from "./pages/Alertas";
import Integracoes from "./pages/Integracoes";
import Configuracoes from "./pages/Configuracoes";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/Auth/AdminLogin"
import Admin from "./pages/Admin"
import AdminLayout from "./components/AdminLayout";
import AdminChat from "./pages/AdminChat";
import AdminConfiguracoes from "./pages/AdminConfiguracoes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useGlobalFontSize } from "@/hooks/useGlobalFontSize";

const savedFontSize = localStorage.getItem('fontSize');
if (savedFontSize) {
  document.documentElement.style.fontSize = `${Number(savedFontSize)}px`;
}

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
  const checkToken = () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  };

  checkToken();

  // Ouvinte para atualizações futuras (ex: outro tab ou login novo)
  window.addEventListener("storage", checkToken);
  return () => window.removeEventListener("storage", checkToken);
}, []);

  if (isAuthenticated === null) {
    return null; // ou um spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              <Route path="/esqueci-senha" element={<ForgotPassword />} />
              <Route path="/dashboard/:userId" element={<Dashboard />} />

              {/* Admin Auth Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Admin />} />
                <Route path="chat" element={<AdminChat />} />
                <Route path="configuracoes" element={<AdminConfiguracoes />} />
              </Route>

              {/* Rotas protegidas */}
              <Route element={<RequireAuth />}>
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="usinas" element={<Usinas />} />
                  <Route path="usina/:id" element={<UsinaDetalhe />} />
                  <Route path="relatorios" element={<Relatorios />} />
                  <Route path="alertas" element={<Alertas />} />
                  <Route path="integracoes" element={<Integracoes />} />
                  <Route path="configuracoes" element={<Configuracoes />} />
                </Route>
              </Route>

              {/* Rota 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
