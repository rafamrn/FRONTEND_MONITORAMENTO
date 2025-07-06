import React from 'react';
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

// Mock data baseado na usina selecionada
const getAlarmsForUsina = (usinaId: number): Alarm[] => {
  const allAlarms: Record<number, Alarm[]> = {
    1: [
      {
        id: 1,
        type: "error",
        message: "Queda brusca na geração de energia",
        timestamp: "2025-04-29T14:23:00",
        status: "active",
      },
      {
        id: 2,
        type: "warning",
        message: "Temperatura elevada no Inversor 1",
        timestamp: "2025-04-29T11:45:00",
        status: "active",
      },
      {
        id: 3,
        type: "error",
        message: "String 4 desconectada",
        timestamp: "2025-04-28T16:20:00",
        status: "resolved",
      },
      {
        id: 4,
        type: "info",
        message: "Manutenção preventiva realizada",
        timestamp: "2025-04-27T09:15:00",
        status: "resolved",
      }
    ],
    2: [
      {
        id: 5,
        type: "warning",
        message: "Eficiência abaixo do esperado",
        timestamp: "2025-04-29T10:15:00",
        status: "active",
      }
    ],
    3: [
      {
        id: 6,
        type: "error",
        message: "Sistema em manutenção",
        timestamp: "2025-04-29T08:00:00",
        status: "active",
      }
    ]
  };
  
  return allAlarms[usinaId] || [];
};

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
  const alarms = getAlarmsForUsina(usinaId);
  const activeAlarms = alarms.filter(alarm => alarm.status === 'active');
  const resolvedAlarms = alarms.filter(alarm => alarm.status === 'resolved');

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
      </CardContent>
    </Card>
  );
};

export default UsinaAlarmsCard;