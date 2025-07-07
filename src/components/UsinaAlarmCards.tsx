import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle, History } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Alarm {
  id: number;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

interface UsinaAlarmsCardProps {
  usinaId: number;
  usinaName: string;
}

const AlarmTypeBadge = ({ type }: { type: string }) => {
  switch (type) {
    case 'error':
      return <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle size={12} />
        Crítico
      </Badge>;
    case 'warning':
      return <Badge className="bg-yellow-500 flex items-center gap-1">
        <Clock size={12} />
        Atenção
      </Badge>;
    case 'info':
      return <Badge className="bg-blue-500 flex items-center gap-1">
        <CheckCircle size={12} />
        Info
      </Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

const AlarmItem = ({ alarm }: { alarm: Alarm }) => {
  const formattedTime = new Date(alarm.timestamp).toLocaleString('pt-BR');

  return (
    <div className={`p-3 border rounded-lg ${
      alarm.status === 'active' ? 'border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20' : 
      'border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <AlarmTypeBadge type={alarm.type} />
        <span className="text-xs text-muted-foreground">{formattedTime}</span>
      </div>
      <p className="text-sm font-medium">{alarm.message}</p>
    </div>
  );
};

const UsinaAlarmsCard: React.FC<UsinaAlarmsCardProps> = ({ usinaId, usinaName }) => {
  const [activeAlarms, setActiveAlarms] = useState<Alarm[]>([]);
  const [resolvedAlarms, setResolvedAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const [atuaisRes, historicoRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/alarmes_atuais?plant_id=${usinaId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/alarmes_historico?plant_id=${usinaId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

    const formatAlarm = (item: any): Alarm => ({
      id: item.fault_code || Math.random(),
      type: item.fault_level === 1 ? "error" : item.fault_level === 2 ? "warning" : "info",
      message: item.fault_name || "Sem descrição",
      timestamp: item.create_time || new Date().toISOString(),
      status: item.process_status === 8 || item.process_status === 1 ? "active" : "resolved"
    });

        const ativos = (atuaisRes.data.alarmes_atuais || []).map(formatAlarm);
        const historicos = (historicoRes.data.alarmes_historicos || []).map(formatAlarm);

        setActiveAlarms(ativos);
        setResolvedAlarms(historicos);
      } catch (error) {
        console.error("Erro ao carregar alarmes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlarms();
  }, [usinaId]);

return (
  <Card className="animate-fade-in">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        Alarmes e Histórico de Falhas
      </CardTitle>
      <p className="text-sm text-muted-foreground">
        Status de alertas e histórico de problemas para {usinaName}
      </p>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="py-10 text-center text-muted-foreground">
          <div className="mb-4">
            <svg className="animate-spin h-6 w-6 text-solar-orange mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>
          <p className="text-sm">Carregando alarmes da usina...</p>
        </div>
      ) : (
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="relative">
              Alarmes Ativos
              {activeAlarms.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-xs px-1.5 py-0.5">
                  {activeAlarms.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4 space-y-3">
            {activeAlarms.length > 0 ? (
              <>
                {activeAlarms.map((alarm) => (
                  <AlarmItem key={alarm.id} alarm={alarm} />
                ))}
                <div className="flex justify-end pt-2">
                  <Button variant="outline" size="sm">
                    Ver Todos os Alarmes
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <p>Nenhum alarme ativo no momento</p>
                <p className="text-sm">Sistema operando normalmente</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-3">
            {resolvedAlarms.length > 0 ? (
              <>
                {resolvedAlarms.map((alarm) => (
                  <AlarmItem key={alarm.id} alarm={alarm} />
                ))}
                <div className="flex justify-end pt-2">
                  <Button variant="outline" size="sm">
                    Ver Histórico Completo
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-3" />
                <p>Nenhum histórico disponível</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </CardContent>
  </Card>
);

};

export default UsinaAlarmsCard;
