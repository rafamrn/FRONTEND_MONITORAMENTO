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
import { Zap, Leaf, Bell, Factory } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from 'react-router-dom';
import { getUsinas } from "@/services/usinaService";

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
  let color = "#ef4444"; // vermelho (red-500)

  if (value >= 90) {
    color = "#3b82f6"; // solar-blue (azul Tailwind)
  } else if (value > 0) {
    color = "#facc15"; // amarelo (yellow-400)
  }
  return (
    <div className="flex items-center gap-2 w-full">
      <Progress value={value} className={`h-2 ${color}`} />
      <span className="text-sm whitespace-nowrap">{value}%</span>
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
const PlantDetailRow = ({ plant, performance }: { plant: any, performance: number }) => {
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
      <TableCell className="text-center">
      <EfficiencyBar value={performance} />
      </TableCell>
    </TableRow>
  );
};

const Dashboard = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [plants, setPlants] = useState<any[]>([]);
  const [performances, setPerformances] = useState<{ [plantId: number]: number }>({});

  useEffect(() => {
    async function carregarPerformance() {
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
    }
  
    carregarPerformance();
  }, []);

  useEffect(() => {
    getUsinas()
      .then(setPlants)
      .catch(err => {
        console.error("Erro ao carregar usinas", err);
        toast({ title: "Erro", description: "Falha ao buscar dados das usinas." });
      });
  }, []);

  const totalPlants = plants.length;
  const totalTodayEnergy = plants.reduce((sum, plant) => sum + (plant.today_energy || 0), 0);
  const totalCO2Offset = totalTodayEnergy * 0.5;

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {plants.map((plant) => (
          <PlantDetailRow
            key={plant.ps_id}
            plant={plant}
            performance={performances[plant.ps_id] || 0}
          />
        ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
