import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, BellOff, Check, Clock } from "lucide-react";

const AlertTypeBadge = ({ type }: { type: string }) => {
  switch (type) {
    case 'error':
      return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle size={14} />Crítico</Badge>;
    case 'warning':
      return <Badge className="bg-yellow-500 flex items-center gap-1"><Clock size={14} />Atenção</Badge>;
    case 'info':
      return <Badge className="bg-blue-500 flex items-center gap-1"><Check size={14} />Informativo</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

const Alertas = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [resolvedAlerts, setResolvedAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const [atuaisRes, historicoRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/alarmes_atuais/todos`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${import.meta.env.VITE_API_URL}/alarmes_historico/todos`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const atuaisData = await atuaisRes.json();
        const historicoData = await historicoRes.json();

        setActiveAlerts(atuaisData.alarmes || []);
        setResolvedAlerts(historicoData.historico || []);
      } catch (err) {
        console.error("Erro ao buscar alertas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

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
          {loading ? (
            <div className="flex justify-center py-10">
  <div className="w-6 h-6 border-4 border-solar-orange border-t-transparent rounded-full animate-spin"></div>
</div>
          ) : activeAlerts.length > 0 ? (
            activeAlerts.map((alert, idx) => (
              <AlertCard key={idx} alert={alert} />
            ))
          ) : (
            <EmptyAlerts message="Não há alertas ativos no momento." />
          )}
        </TabsContent>

        <TabsContent value="resolved" className="mt-6 space-y-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando alertas...</p>
          ) : resolvedAlerts.length > 0 ? (
            resolvedAlerts.map((alert, idx) => (
              <AlertCard key={idx} alert={alert} isResolved />
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
  alert: any;
  isResolved?: boolean;
}

const AlertCard = ({ alert, isResolved = false }: AlertCardProps) => {
  const formattedTime = new Date(alert.create_time).toLocaleString('pt-BR');

  const type = alert.fault_level === 1
    ? 'error'
    : alert.fault_level === 2
    ? 'warning'
    : 'info';

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{alert.ps_name || "Usina"}</CardTitle>
          <AlertTypeBadge type={type} />
        </div>
        <CardDescription>{formattedTime}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{alert.fault_name || alert.message || "Sem descrição disponível."}</p>
      </CardContent>
    </Card>
  );
};

const EmptyAlerts = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
    <BellOff size={48} className="mb-4 opacity-30" />
    <p>{message}</p>
  </div>
);

export default Alertas;
