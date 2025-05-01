
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, BellOff, Check, Clock } from "lucide-react";

// Mock data for demonstration
const alerts = [
  {
    id: 1,
    plantId: 1,
    plantName: "Usina Solar Central",
    type: "error",
    message: "Queda brusca na geração de energia",
    timestamp: "2025-04-29T14:23:00",
    status: "active",
  },
  {
    id: 2,
    plantId: 3,
    plantName: "Fazenda Solar Sul",
    type: "warning",
    message: "Eficiência abaixo do esperado",
    timestamp: "2025-04-29T10:15:00",
    status: "active",
  },
  {
    id: 3,
    plantId: 2,
    plantName: "Parque Solar Norte",
    type: "info",
    message: "Manutenção preventiva agendada",
    timestamp: "2025-04-28T16:45:00",
    status: "active",
  },
  {
    id: 4,
    plantId: 4,
    plantName: "Usina Solar Vale Verde",
    type: "error",
    message: "Falha na comunicação com inversores",
    timestamp: "2025-04-28T09:30:00",
    status: "resolved",
  },
  {
    id: 5,
    plantId: 5,
    plantName: "Parque Solar Oeste",
    type: "warning",
    message: "Temperatura elevada em painéis solares",
    timestamp: "2025-04-27T13:20:00",
    status: "resolved",
  },
];

// Alert type badge component
const AlertTypeBadge = ({ type }: { type: string }) => {
  switch (type) {
    case 'error':
      return <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle size={14} />
        Crítico
      </Badge>;
    case 'warning':
      return <Badge className="bg-yellow-500 flex items-center gap-1">
        <Clock size={14} />
        Atenção
      </Badge>;
    case 'info':
      return <Badge className="bg-blue-500 flex items-center gap-1">
        <Check size={14} />
        Informativo
      </Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

const Alertas = () => {
  const [activeTab, setActiveTab] = useState("active");
  
  const activeAlerts = alerts.filter(alert => alert.status === "active");
  const resolvedAlerts = alerts.filter(alert => alert.status === "resolved");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-solar-blue dark:text-white">Alertas</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Monitore e gerencie todos os alertas das usinas solares.
        </p>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active" className="relative">
            Ativos
            {activeAlerts.length > 0 && (
              <Badge className="ml-2 bg-solar-orange">{activeAlerts.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6 space-y-4">
          {activeAlerts.length > 0 ? (
            activeAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          ) : (
            <EmptyAlerts message="Não há alertas ativos no momento." />
          )}
        </TabsContent>
        
        <TabsContent value="resolved" className="mt-6 space-y-4">
          {resolvedAlerts.length > 0 ? (
            resolvedAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} isResolved />
            ))
          ) : (
            <EmptyAlerts message="Não há alertas resolvidos para exibir." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface AlertCardProps {
  alert: typeof alerts[0];
  isResolved?: boolean;
}

const AlertCard = ({ alert, isResolved = false }: AlertCardProps) => {
  const formattedTime = new Date(alert.timestamp).toLocaleString('pt-BR');

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{alert.plantName}</CardTitle>
          <AlertTypeBadge type={alert.type} />
        </div>
        <CardDescription>{formattedTime}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{alert.message}</p>
      </CardContent>
      {!isResolved && (
        <CardFooter className="flex justify-end pt-2">
          <Button variant="outline" size="sm">Marcar como Resolvido</Button>
        </CardFooter>
      )}
    </Card>
  );
};

const EmptyAlerts = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
      <BellOff size={48} className="mb-4 opacity-30" />
      <p>{message}</p>
    </div>
  );
};

export default Alertas;
