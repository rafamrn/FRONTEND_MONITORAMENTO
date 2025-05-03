import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, Leaf, Factory } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from 'react-router-dom';
import { getUsinas } from "@/services/usinaService";
import PlantsStatusSummary from "@/components/PlantsStatusSummary";

const normalizarPotenciaKW = (valor: string | number): number => {
  if (typeof valor === 'string') {
    const watts = parseFloat(valor.replace(/\./g, ''));
    return watts / 1000;
  }
  return valor / 1000;
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'online':
      return <Badge className="bg-green-500 animate-pulse-slow">Online</Badge>;
    case 'falha':
      return <Badge variant="destructive">Falha</Badge>;
    case 'alarme':
      return <Badge className="bg-yellow-500">Alarme</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Efficiency progress bar component
const EfficiencyBar = ({ value }: { value: number }) => {
  let color = "#ef4444"; // vermelho

  if (value >= 90) {
    color = "#21c15d"; // verde
  } else if (value > 0) {
    color = "#facc15"; // amarelo
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <Progress value={value} color={color} className="h-2" />
      <span className="text-sm whitespace-nowrap">{value}%</span>
    </div>
  );
};

interface EfficiencyCircleProps {
  value: number;
  label?: string;
}

const EfficiencyCircle = ({ value, label }: EfficiencyCircleProps) => {
  const radius = 18;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset =
    circumference - (value / 100) * circumference;

  let color = "#ef4444";
  if (value >= 90) color = "#21c15d";
  else if (value > 0) color = "#facc15";

  return (
    <div className="flex flex-col items-center space-y-1 w-12">
      <div className="relative w-12 h-12">
        <svg height="100%" width="100%" viewBox="0 0 40 40">
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="20"
            cy="20"
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            r={normalizedRadius}
            cx="20"
            cy="20"
            style={{ transition: "stroke-dashoffset 0.35s" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
          {Math.round(value)}%
        </div>
      </div>
      {label && <span className="text-[10px] text-muted-foreground">{label}</span>}
    </div>
  );
};




const mapFaultStatusToText = (status: number): string => {
  switch (status) {
    case 1: return 'falha';
    case 2: return 'alarme';
    case 3: return 'online';
    default: return 'desconhecido';
  }
};

// Plant Detail Link component
const PlantDetailRow = ({ plant, performance1d, performance7d }: { plant: any, performance1d: number, performance7d: number }) => {
  const navigate = useNavigate();
  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/60 transition-colors duration-200 group"
      onClick={() => navigate(`/usina/${plant.ps_id}`)}
    >
      <TableCell className="font-medium group-hover:text-solar-orange transition-colors duration-200">
        {plant.ps_name}
      </TableCell>
      <TableCell>{plant.location}</TableCell>
      <TableCell className="text-center">
        <StatusBadge status={mapFaultStatusToText(plant.ps_fault_status)} />
      </TableCell>
      <TableCell className="text-center">
        {plant.today_energy.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
      </TableCell>
      <TableCell className="flex items-center justify-center gap-3">
  <EfficiencyCircle value={performance1d} label="1d." />
  <EfficiencyCircle value={performance7d} label="7d." />
  {/* <EfficiencyCircle value={0} label="1m." /> */}
</TableCell>

      <TableCell className="text-center">
        <EfficiencyBar value={parseFloat(((normalizarPotenciaKW(plant.curr_power) / plant.capacidade) * 100).toFixed(0))} />
      </TableCell>
    </TableRow>
  );
};

const Dashboard = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [plants, setPlants] = useState<any[]>([]);
  const [performances, setPerformances] = useState<{ [plantId: number]: number }>({});
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [performances7d, setPerformances7d] = useState<{ [plantId: number]: number }>({});

 
  // Atualiza performance semanal a cada 2 minutos

  useEffect(() => {
    const carregarPerformance7d = async () => {
      try {
        const res = await fetch("https://backendmonitoramento-production.up.railway.app/performance_7dias");
        const data = await res.json();
        const perfMap: { [plantId: number]: number } = {};
        data.forEach((item: any) => {
          perfMap[item.plant_id] = item.performance_percentual;
        });
        setPerformances7d(perfMap);
      } catch (error) {
        console.error("Erro ao buscar performance de 7 dias:", error);
      }
    };
  
    carregarPerformance7d();
    const interval = setInterval(() => carregarPerformance7d(), 120000); // 2 minutos
  
    return () => clearInterval(interval);
  }, []);
  


  // Atualiza performance diário a cada 2 minutos
  useEffect(() => {
    const carregarPerformance = async () => {
      try {
        const res = await fetch("https://backendmonitoramento-production.up.railway.app/performance_diaria");
        const data = await res.json();
        const perfMap: { [plantId: number]: number } = {};
        data.forEach((item: any) => {
          perfMap[item.plant_id] = item.performance_percentual;
        });
        setPerformances(perfMap);
      } catch (error) {
        console.error("Erro ao buscar performance diária:", error);
      }
    };

    carregarPerformance();
    const interval = setInterval(() => carregarPerformance(), 120000); // 2 minutos

    return () => clearInterval(interval);
  }, []);

  // Atualiza usinas a cada 2 minutos
  useEffect(() => {
    const fetchUsinas = () => {
      getUsinas()
        .then(setPlants)
        .catch(err => {
          console.error("Erro ao carregar usinas", err);
          toast({ title: "Erro", description: "Falha ao buscar dados das usinas." });
        });
    };

    fetchUsinas();
    const interval = setInterval(() => fetchUsinas(), 120000); // 2 minutos

    return () => clearInterval(interval);
  }, [toast]);

  const totalPlants = plants.length;
  const totalTodayEnergy = plants.reduce((sum, plant) => sum + (plant.today_energy || 0), 0);
  const totalCO2Offset = totalTodayEnergy * 0.5;

  const mapFaultStatusToStatus = (status: number): string => {
    switch (status) {
      case 1: return 'falha';
      case 2: return 'alarme';
      case 3: return 'online';
      default: return 'desconhecido';
    }
  };
  
  const statusSummaryData = plants.map((plant) => ({
    id: plant.ps_id,
    name: plant.ps_name,
    status: mapFaultStatusToStatus(plant.ps_fault_status),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-solar-blue dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Visão geral de todas as usinas solares monitoradas pelo sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Usinas</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlants}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Energia Hoje</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTodayEnergy.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kWh
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Evitado</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCO2Offset.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mb-6">
      <PlantsStatusSummary
  plants={statusSummaryData}
  onStatusClick={(status) =>
    setSelectedStatus((prev) => (prev === status ? null : status))
  }
/>
      </div>
      

      
      
      <div className="rounded-lg border bg-card overflow-x-auto animate-fade-in">
        <Table>
          <TableCaption>Lista de todas as usinas solares.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Nome</TableHead>
              <TableHead>{!isMobile ? "Localização" : "Local"}</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">{!isMobile ? "Energia Hoje (kWh)" : "kWh"}</TableHead>
              <TableHead className="text-center">Performance</TableHead>
                  <TableHead className="text-center">Capacidade Atual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {plants
  .filter((plant) => {
    if (!selectedStatus) return true;
    const status = mapFaultStatusToStatus(plant.ps_fault_status);
    return status === selectedStatus;
  })
  .map((plant) => (
    <PlantDetailRow
  key={plant.ps_id}
  plant={plant}
  performance1d={performances[plant.ps_id] || 0}
  performance7d={performances7d[plant.ps_id] || 0}
/>
))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
