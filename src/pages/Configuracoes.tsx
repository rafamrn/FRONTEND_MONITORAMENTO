import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Save, Sun, User, Settings, Bell, Lock, Globe, Clock } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import AppearanceSettings from "../components/settings/AppearanceSettings";

const Configuracoes = () => {
  const {
    theme,
    setTheme
  } = useTheme();
  const {
    toast
  } = useToast();
  const [fontSize, setFontSize] = useState(16);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [language, setLanguage] = useState("pt-BR");
  const [timezone, setTimezone] = useState("America/Sao_Paulo");
  const [sessionTimeout, setSessionTimeout] = useState("30");

  // Set font size for the entire application
  React.useEffect(() => {
    // Aplica dinamicamente enquanto o usuário ajusta o slider
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);
  
  useEffect(() => {
    // Aplica valor salvo no primeiro carregamento
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize !== null) {
      setFontSize(Number(savedFontSize)); // isso atualiza o estado e o efeito acima aplica
    }
  }, []);

  // Effect for applying animations
  useEffect(() => {
    if (animationsEnabled) {
      document.body.classList.remove('no-animations');
    } else {
      document.body.classList.add('no-animations');
    }
  }, [animationsEnabled]);

  // Effect for compact mode
  useEffect(() => {
    if (compactMode) {
      document.body.classList.add('compact-mode');
    } else {
      document.body.classList.remove('compact-mode');
    }
  }, [compactMode]);
  const avatarOptions = [{
    src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
    alt: "Avatar 1"
  }, {
    src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user2",
    alt: "Avatar 2"
  }, {
    src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user3",
    alt: "Avatar 3"
  }, {
    src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user4",
    alt: "Avatar 4"
  }, {
    src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user5",
    alt: "Avatar 5"
  }, {
    src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user6",
    alt: "Avatar 6"
  }];
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.avatar || avatarOptions[0].src;
    }
    return avatarOptions[0].src;
  });
  const handleSaveSettings = () => {
    // Apply the settings
    document.documentElement.style.fontSize = `${fontSize}px`;

    // Save user preferences to localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      userData.avatar = selectedAvatar;
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      // If no user exists yet, create one with basic info
      const newUser = {
        name: "Administrador Solar",
        email: "admin@exemplo.com",
        avatar: selectedAvatar
      };
      localStorage.setItem('user', JSON.stringify(newUser));
    }

    // Save animation and compact mode preferences
    localStorage.setItem('animationsEnabled', String(animationsEnabled));
    localStorage.setItem('compactMode', String(compactMode));
    localStorage.setItem('fontSize', String(fontSize));
    localStorage.setItem('language', language);
    localStorage.setItem('timezone', timezone);
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso."
    });
  };

  // Load saved preferences on component mount
  useEffect(() => {
    const savedAnimations = localStorage.getItem('animationsEnabled');
    const savedCompactMode = localStorage.getItem('compactMode');
    const savedFontSize = localStorage.getItem('fontSize');
    const savedLanguage = localStorage.getItem('language');
    const savedTimezone = localStorage.getItem('timezone');
    if (savedAnimations !== null) setAnimationsEnabled(savedAnimations === 'true');
    if (savedCompactMode !== null) setCompactMode(savedCompactMode === 'true');
    if (savedFontSize !== null) setFontSize(Number(savedFontSize));
    if (savedLanguage !== null) setLanguage(savedLanguage);
    if (savedTimezone !== null) setTimezone(savedTimezone);
  }, []);
  return <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-solar-blue dark:text-white">Configurações</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Gerencie suas preferências e configure o sistema.
        </p>
      </div>

      <Tabs defaultValue="aparencia" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="geral" className="flex items-center justify-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Geral</span>
          </TabsTrigger>
          <TabsTrigger value="aparencia" className="flex items-center justify-center gap-2">
            <Sun className="h-4 w-4" />
            <span className="hidden sm:inline">Aparência</span>
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center justify-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="conta" className="flex items-center justify-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Conta</span>
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          
        </TabsList>
        
        <TabsContent value="aparencia" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência do sistema conforme suas preferências.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="theme-toggle">Tema</Label>
                    <div className="text-sm text-muted-foreground">
                      Escolha entre tema claro ou escuro.
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <Switch id="theme-toggle" checked={theme === "dark"} onCheckedChange={checked => setTheme(checked ? "dark" : "light")} />
                    <Moon className="h-4 w-4" />
                  </div>
                </div>
                
                
                
                {/* Font Size Selection */}
                <div className="space-y-2">
                  <Label htmlFor="font-size">Tamanho da Fonte: {fontSize}px</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">A</span>
                    <Slider id="font-size" defaultValue={[fontSize]} min={12} max={24} step={1} onValueChange={value => setFontSize(value[0])} className="flex-grow" />
                    <span className="text-xl">A</span>
                  </div>
                  
                  <div className="mt-4 border rounded-md p-4 bg-muted/10">
                    <p className="mb-2">Prévia:</p>
                    <p className="text-xs mb-1">Texto pequeno</p>
                    <p className="mb-1">Texto normal</p>
                    <p className="text-lg mb-1">Texto grande</p>
                    <p className="text-xl">Texto muito grande</p>
                  </div>
                </div>
                
                {/* Animations and Compact Mode */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="animations">Animações</Label>
                      <p className="text-sm text-muted-foreground">Ativar animações da interface</p>
                    </div>
                    <Switch id="animations" checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compact-mode">Modo compacto</Label>
                      <p className="text-sm text-muted-foreground">Reduzir espaçamento entre elementos</p>
                    </div>
                    <Switch id="compact-mode" checked={compactMode} onCheckedChange={setCompactMode} />
                  </div>
                </div>
                
                {/* Avatar Selection */}
                <div className="space-y-2 pt-2">
                  <Label>Avatar</Label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-2">
                    {avatarOptions.map((avatar, index) => <div key={index} className={`cursor-pointer p-1 rounded-full transition-all hover:scale-110 ${selectedAvatar === avatar.src ? 'ring-2 ring-solar-orange' : ''}`} onClick={() => setSelectedAvatar(avatar.src)}>
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={avatar.src} alt={avatar.alt} />
                          <AvatarFallback>U{index + 1}</AvatarFallback>
                        </Avatar>
                      </div>)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  
                  
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-solar-orange hover:bg-solar-orange/90 animate-pulse-slow" onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Preferências
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notificacoes" className="mt-6 space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure como e quando deseja receber notificações do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email de Alertas Críticos</Label>
                    <div className="text-sm text-muted-foreground">
                      Receber notificações por email em caso de alertas críticos.
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de Manutenção</Label>
                    <div className="text-sm text-muted-foreground">
                      Notificações sobre manutenção programada.
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Relatórios Semanais</Label>
                    <div className="text-sm text-muted-foreground">
                      Receber relatórios semanais por email.
                    </div>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações Push</Label>
                    <div className="text-sm text-muted-foreground">
                      Habilitar notificações no navegador.
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-solar-orange hover:bg-solar-orange/90" onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Notificações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="conta" className="mt-6 space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e de contato.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" defaultValue="Administrador Solar" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@exemplo.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" defaultValue="Radiant Power Insight" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" defaultValue="(11) 99999-9999" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Input id="role" defaultValue="Gerente de Energia" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Alterar Senha</Button>
              <Button className="bg-solar-orange hover:bg-solar-orange/90" onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Informações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* New Security Tab */}
        <TabsContent value="seguranca" className="mt-6 space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Ajuste as configurações de segurança da sua conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Timeout de Sessão</Label>
                  <p className="text-sm text-muted-foreground">
                    Defina o tempo de inatividade antes do encerramento automático da sessão.
                  </p>
                  <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tempo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutos</SelectItem>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                      <SelectItem value="0">Nunca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="2fa">Autenticação de dois fatores</Label>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Requer uma etapa adicional de verificação ao fazer login.
                    </p>
                    <Switch id="2fa" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Histórico de login</Label>
                  <div className="border rounded-md p-4 space-y-3 bg-muted/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">São Paulo, Brasil</p>
                        <p className="text-xs text-muted-foreground">Chrome • Windows • 30/04/2025 09:45</p>
                      </div>
                      <Badge>Atual</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Rio de Janeiro, Brasil</p>
                        <p className="text-xs text-muted-foreground">Safari • macOS • 29/04/2025 14:22</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Brasília, Brasil</p>
                        <p className="text-xs text-muted-foreground">Firefox • Windows • 28/04/2025 10:15</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-solar-orange hover:bg-solar-orange/90" onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações de Segurança
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* New General Tab */}
        <TabsContent value="geral" className="mt-6 space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Ajuste as configurações gerais do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Selection */}
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="flex items-center">
                    <Globe className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Selecione o idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                    <SelectItem value="fr-FR">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Timezone Selection */}
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Selecione o fuso horário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                    <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                    <SelectItem value="America/Rio_Branco">Rio Branco (GMT-5)</SelectItem>
                    <SelectItem value="America/Noronha">Fernando de Noronha (GMT-2)</SelectItem>
                    <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                    <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tóquio (GMT+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Atualizações automáticas</Label>
                    <p className="text-sm text-muted-foreground">Instalar atualizações do sistema automaticamente</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enviar dados de diagnóstico</Label>
                    <p className="text-sm text-muted-foreground">Ajudar a melhorar o sistema</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Formato de data</Label>
                    <p className="text-sm text-muted-foreground">Escolha como as datas são exibidas</p>
                  </div>
                  <Select defaultValue="dd/MM/yyyy">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                      <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                      <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-solar-orange hover:bg-solar-orange/90" onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações Gerais
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default Configuracoes;