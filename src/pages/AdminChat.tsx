
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  Phone, 
  Search, 
  MessageCircle, 
  Plus,
  ChevronDown,
  Archive,
  Trash2,
  Edit,
  MoreVertical,
  Copy,
  Reply,
  Pin
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

interface ChatContact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

interface ChatMessage {
  id: string;
  contactId: string;
  message: string;
  type: 'received' | 'sent';
  timestamp: string;
  status: 'delivered' | 'read' | 'pending';
}

const AdminChat = () => {
  const { toast } = useToast();
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for contacts
  const [contacts] = useState<ChatContact[]>([
    {
      id: '1',
      name: 'João Silva',
      phone: '+55 11 99999-9999',
      lastMessage: 'Quando será processado meu pagamento?',
      lastMessageTime: '14:30',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      name: 'Maria Santos',
      phone: '+55 11 88888-8888',
      lastMessage: 'Obrigada pelo esclarecimento!',
      lastMessageTime: '13:45',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '3',
      name: 'Pedro Costa',
      phone: '+55 11 77777-7777',
      lastMessage: 'Gostaria de saber sobre o plano Enterprise',
      lastMessageTime: '12:20',
      unreadCount: 1,
      isOnline: true
    }
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      contactId: '1',
      message: 'Olá! Tudo bem?',
      type: 'received',
      timestamp: '14:28',
      status: 'read'
    },
    {
      id: '2',
      contactId: '1',
      message: 'Quando será processado meu pagamento?',
      type: 'received',
      timestamp: '14:30',
      status: 'read'
    },
    {
      id: '3',
      contactId: '1',
      message: 'Olá João! Seu pagamento será processado em até 24 horas. Obrigado pela paciência!',
      type: 'sent',
      timestamp: '14:35',
      status: 'delivered'
    }
  ]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const selectedContactData = contacts.find(contact => contact.id === selectedContact);
  const contactMessages = messages.filter(message => message.contactId === selectedContact);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return;

    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      contactId: selectedContact,
      message: messageInput,
      type: 'sent',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');


  };

  const handleNewConversation = () => {
    toast({
      title: "Nova conversa",
      description: "Funcionalidade de nova conversa será implementada em breve.",
    });
  };

  const handleArchiveChat = (contactId: string) => {
    toast({
      title: "Chat arquivado",
      description: "A conversa foi arquivada com sucesso.",
    });
  };

  const handleDeleteChat = (contactId: string) => {
    toast({
      title: "Chat excluído",
      description: "A conversa foi excluída permanentemente.",
      variant: "destructive"
    });
  };

  const handleEditMessage = (messageId: string) => {
    toast({
      title: "Editar mensagem",
      description: "Funcionalidade de edição será implementada em breve.",
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(msg => msg.id !== messageId));
    toast({
      title: "Mensagem excluída",
      description: "A mensagem foi excluída com sucesso.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      case 'pending':
        return '⏳';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">


      <Card className="shadow-lg border-0">
        <CardContent className="p-0">
          <div className="flex h-[1150px] text-solar-blue rounded-lg overflow-hidden">
            {/* Lista de Contatos */}
            <div className="w-1/8 border-r bg-gray-50/50">
              <div className="p-4 border-b text-solar-blue">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-solar-blue">Conversas</h3>
                  <Button 
                    size="sm" 
                    onClick={handleNewConversation}
                    className="bg-green-500 hover:bg-green-600 text-solar-blue"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar conversa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200"
                  />
                </div>
              </div>
              
              <ScrollArea className="h-full">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`group relative p-4 border-b cursor-pointer hover:bg-blue-50/50 transition-all duration-200 ${
                      selectedContact === contact.id ? 'bg-blue-50 border-l-4 border-l-solar-blue shadow-sm' : ''
                    }`}
                  >
                    <div 
                      onClick={() => setSelectedContact(contact.id)}
                      className="flex items-center gap-3"
                    >
                      <div className="relative">
                        <Avatar className="w-12 h-12 ring-2 ring-gray-100">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback className="bg-solar-blue text-white font-medium">
                            {contact.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {contact.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 truncate">{contact.name}</h4>
                          <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-0.5">{contact.lastMessage}</p>
                        <p className="text-xs text-gray-400 mt-1">{contact.phone}</p>
                      </div>
                      
                      {contact.unreadCount > 0 && (
                        <Badge className="bg-green-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                          {contact.unreadCount}
                        </Badge>
                      )}
                    </div>

                    {/* Dropdown de opções do chat */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleArchiveChat(contact.id)}>
                            <Archive className="w-4 h-4 mr-2" />
                            Arquivar conversa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pin className="w-4 h-4 mr-2" />
                            Fixar conversa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteChat(contact.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir conversa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>

            {/* Área da Conversa */}
            <div className="flex-1 flex flex-col">
              {selectedContactData ? (
                <>
                  {/* Header da Conversa */}
                  <div className="p-4 border-b bg-white flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 ring-2 ring-gray-100">
                        <AvatarImage src={selectedContactData.avatar} />
                        <AvatarFallback className="bg-solar-blue text-white">
                          {selectedContactData.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedContactData.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                      {selectedContactData.phone}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Mensagens */}
                  <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-gray-50/30 to-gray-100/30">
                    <div className="space-y-4">
                      {contactMessages.map((message) => (
                        <ContextMenu key={message.id}>
                          <ContextMenuTrigger>
                            <div
                              className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                                  message.type === 'sent'
                                    ? 'bg-solar-blue text-white rounded-br-md'
                                    : 'bg-white text-gray-900 border border-gray-100 rounded-bl-md'
                                }`}
                              >
                                <p className="text-sm leading-relaxed">{message.message}</p>
                                <div className={`flex items-center justify-end gap-1 mt-2 text-xs ${
                                  message.type === 'sent' ? 'text-green-100' : 'text-gray-500'
                                }`}>
                                  <span>{message.timestamp}</span>
                                  {message.type === 'sent' && (
                                    <span className={message.status === 'read' ? 'text-blue-200' : ''}>
                                      {getStatusIcon(message.status)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </ContextMenuTrigger>
                          <ContextMenuContent className="w-56">
                            <ContextMenuItem onClick={() => navigator.clipboard.writeText(message.message)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Copiar mensagem
                            </ContextMenuItem>
                            <ContextMenuItem>
                              <Reply className="w-4 h-4 mr-2" />
                              Responder
                            </ContextMenuItem>
                            {message.type === 'sent' && (
                              <>
                                <ContextMenuSeparator />
                                <ContextMenuItem onClick={() => handleEditMessage(message.id)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar mensagem
                                </ContextMenuItem>
                              </>
                            )}
                            <ContextMenuSeparator />
                            <ContextMenuItem 
                              onClick={() => handleDeleteMessage(message.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir mensagem
                            </ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Input de Mensagem */}
                  <div className="p-4 border-t bg-white">
                    <div className="flex items-center gap-3">
                      <Input
                        placeholder="Digite sua mensagem..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 border-gray-200 focus:border-green-400 focus:ring-green-400/20 text-white placeholder:text-gray-400"

                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 shadow-md hover:shadow-lg transition-all"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50/30 to-gray-100/30">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Selecione uma conversa</h3>
                    <p className="text-gray-500 max-w-sm">Escolha um contato da lista para começar a conversar via WhatsApp</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminChat;
