import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, Factory, FileText, LayoutDashboard, Menu, Settings, Puzzle } from "lucide-react";
import { Button } from "./ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarSeparator, SidebarTrigger } from "./ui/sidebar";
import Header from "./Header";

// Menu items for the sidebar
const menuItems = [{
  title: "Dashboard",
  icon: LayoutDashboard,
  path: "/"
}, {
  title: "Usinas",
  icon: Factory,
  path: "/usinas"
}, {
  title: "Relatórios",
  icon: FileText,
  path: "/relatorios"
}, {
  title: "Alertas",
  icon: Bell,
  path: "/alertas"
}, {
  title: "Integrações",
  icon: Puzzle,
  path: "/integracoes"
}, {
  title: "Configurações",
  icon: Settings,
  path: "/configuracoes"
}];
const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  // Check if the current path matches the menu item's path
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // If not logged in and not on auth pages, redirect to login
      const authRoutes = ['/login', '/cadastro', '/esqueci-senha'];
      if (!authRoutes.includes(location.pathname)) {
        navigate('/login');
      }
    }
  }, [location.pathname, navigate]);
  return <Sidebar>
      <SidebarHeader className="flex items-center p-4">
      <div className="flex items-center gap-2">
        <img src="/favicon2.ico" alt="Logo" className="w-15 h-16 object-contain" />

      </div>
    </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={item.title}>
                    <Link to={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
};

// Main layout component that includes the sidebar and content area
export default function AppLayout() {
  return <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with menu button */}
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2">
    <img src="/RMS2.png" alt="Logo" className="h-14" /> {/* ajuste a altura conforme necessário */}
  </div>
            <Header />
          </header>
          
          {/* Main content area */}
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>;
}