import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Save, Sun } from "lucide-react";
import { useTheme } from "../../components/ThemeProvider";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AppearanceSettingsProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  compactMode: boolean;
  setCompactMode: (enabled: boolean) => void;
  selectedAvatar: string;
  setSelectedAvatar: (avatar: string) => void;
  handleSaveSettings: () => void;
}

const avatarOptions = [
  { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1", alt: "Avatar 1" },
  { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user2", alt: "Avatar 2" },
  { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user3", alt: "Avatar 3" },
  { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user4", alt: "Avatar 4" },
  { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user5", alt: "Avatar 5" },
  { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=user6", alt: "Avatar 6" }
];

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  fontSize,
  setFontSize,
  animationsEnabled,
  setAnimationsEnabled,
  compactMode,
  setCompactMode,
  selectedAvatar,
  setSelectedAvatar,
  handleSaveSettings
}) => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const saveAndApplySettings = () => {
    handleSaveSettings();
    
    // Apply font size immediately
    document.documentElement.style.fontSize = `${fontSize}px`;
    
    // Show toast and reload page after a short delay
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso."
    });
    
    // Reload the current page to apply changes
    setTimeout(() => {
      navigate(0); // This will force a refresh
    }, 1000);
  };

  return (
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
              {avatarOptions.map((avatar, index) => (
                <div 
                  key={index} 
                  className={`cursor-pointer p-1 rounded-full transition-all hover:scale-110 ${selectedAvatar === avatar.src ? 'ring-2 ring-solar-orange' : ''}`} 
                  onClick={() => setSelectedAvatar(avatar.src)}
                >
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={avatar.src} alt={avatar.alt} />
                    <AvatarFallback>U{index + 1}</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2"></div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="bg-solar-orange hover:bg-solar-orange/90 animate-pulse-slow" onClick={saveAndApplySettings}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Preferências
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppearanceSettings;