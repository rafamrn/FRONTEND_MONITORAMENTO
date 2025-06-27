
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Settings, Database, Mail, Shield, MessageCircle, Phone, Plus } from 'lucide-react';

interface WhatsAppTemplate {
  id: string;
  name: string;
  type: 'cobranca' | 'novidade' | 'geral';
  message: string;
}

const AdminConfiguracoes = () => {
  const { toast } = useToast();
  const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false);
  const [whatsappApiKey, setWhatsappApiKey] = useState('');
  
  // Mock data for WhatsApp templates  
  const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsAppTemplate[]>([
    {
      id: '1',
      name: 'Cobrança Padrão',
      type: 'cobranca',
      message: 'Olá {nome}, seu pagamento no valor de {valor} está em atraso. Por favor, regularize sua situação.'
    },
    {
      id: '2',
      name: 'Nova Funcionalidade',
      type: 'novidade',
      message: 'Olá {nome}! Temos uma nova funcionalidade disponível na sua dashboard. Acesse e confira!'
    }
  ]);

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const newTemplate: WhatsAppTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      type: formData.get('type') as 'cobranca' | 'novidade' | 'geral',
      message: formData.get('message') as string
    };

    setWhatsappTemplates([...whatsappTemplates, newTemplate]);
    setIsNewTemplateDialogOpen(false);
    
    toast({
      title: "Template criado",
      description: "Novo template de mensagem foi adicionado.",
    });
  };

  const getTemplateTypeBadge = (type: string) => {
    const variants = {
      'cobranca': 'bg-red-100 text-red-800',
      'novidade': 'bg-blue-100 text-blue-800',
      'geral': 'bg-gray-100 text-gray-800'
    };
    return variants[type as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold white-600">Configurações Administrativas</h1>
        <p className="text-gray-500">
          Configure as definições gerais do sistema e plataforma.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Configurações do Sistema
            </CardTitle>
            <CardDescription>
              Configurações gerais da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nome da Empresa</Label>
              <Input id="company-name" defaultValue="RMS Monitoramento" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Email de Suporte</Label>
              <Input id="support-email" type="email" defaultValue="contato@rms7energia.com" />
            </div>
            <Button className="w-full">Salvar Configurações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Configurações de Email
            </CardTitle>
            <CardDescription>
              Configure o servidor de email para notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">Servidor SMTP</Label>
              <Input id="smtp-host" placeholder="smtp.gmail.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">Porta SMTP</Label>
              <Input id="smtp-port" placeholder="587" />
            </div>
            <Button className="w-full">Salvar Email</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Configuração WhatsApp
            </CardTitle>
            <CardDescription>
              Configure a integração com WhatsApp Business API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp-token">Token da API WhatsApp</Label>
              <Input 
                id="whatsapp-token" 
                type="password"
                placeholder="Digite o token da API"
                value={whatsappApiKey}
                onChange={(e) => setWhatsappApiKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone-number">Número do WhatsApp Business</Label>
              <Input 
                id="phone-number" 
                placeholder="+55 11 99999-9999"
              />
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Phone className="w-4 h-4 mr-2" />
              Conectar WhatsApp
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Segurança
            </CardTitle>
            <CardDescription>
              Configurações de segurança e autenticação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Timeout de Sessão (minutos)</Label>
              <Input id="session-timeout" type="number" defaultValue="60" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-login-attempts">Máximo de Tentativas de Login</Label>
              <Input id="max-login-attempts" type="number" defaultValue="5" />
            </div>
            <Button className="w-full">Salvar Segurança</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Templates de Mensagem WhatsApp</CardTitle>
              <CardDescription>
                Gerencie templates para cobrança e comunicação
              </CardDescription>
            </div>
            <Dialog open={isNewTemplateDialogOpen} onOpenChange={setIsNewTemplateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Template</DialogTitle>
                  <DialogDescription>
                    Crie um novo template de mensagem
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTemplate}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="template-name">Nome do Template</Label>
                      <Input id="template-name" name="name" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="template-type">Tipo</Label>
                      <select id="template-type" name="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                        <option value="cobranca">Cobrança</option>
                        <option value="novidade">Novidade</option>
                        <option value="geral">Geral</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="template-message">Mensagem</Label>
                      <textarea 
                        id="template-message" 
                        name="message"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="Use {nome}, {valor}, {data} como variáveis"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Criar Template</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {whatsappTemplates.map((template) => (
              <div key={template.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{template.name}</h4>
                  <Badge className={getTemplateTypeBadge(template.type)}>
                    {template.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{template.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminConfiguracoes;
