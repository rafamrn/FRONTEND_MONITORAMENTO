
import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { 
  Maximize, 
  Minimize, 
  Settings, 
  Sun, 
  Moon,
  LogOut
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(null);

  // Effect for loading user data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Effect for updating current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Effect for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // remove o JWT
    localStorage.removeItem('user');  // se ainda usar para o nome/avatar
    navigate('/login');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Date and Time - Larger as requested */}
      <div className="hidden md:flex flex-col items-end animate-pulse-slow">
        <span className="font-medium text-xl">{formatTime(currentDateTime)}</span>
        <span className="text-sm text-muted-foreground">{formatDate(currentDateTime)}</span>
      </div>

      {/* Quick Settings */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-muted/60 transition-colors">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Configurações rápidas</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 animate-scale-in">
          <DropdownMenuLabel>Configurações rápidas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="cursor-pointer">
            {theme === 'dark' ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/configuracoes')} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Todas as Configurações</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Fullscreen Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleFullscreen}
        className="hover:bg-muted/60 transition-colors"
      >
        {isFullscreen ? (
          <Minimize className="h-5 w-5" />
        ) : (
          <Maximize className="h-5 w-5" />
        )}
        <span className="sr-only">Tela Cheia</span>
      </Button>

      {/* User Menu */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-muted/60 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 animate-scale-in" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/configuracoes')} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="ghost" onClick={() => navigate('/login')}>
          Entrar
        </Button>
      )}
    </div>
  );
};

export default Header;
