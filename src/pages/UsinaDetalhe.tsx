import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getUsinas } from '@/services/usinaService';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Thermometer, Info, Gauge, CircleAlert, CircuitBoard } from 'lucide-react';
import { PowerGauge } from '@/components/PowerGauge';
import EnergyProductionChart from '@/components/EnergyProductionChart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';



const UsinaDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState<any>(null);
  const [periodType, setPeriodType] = useState<'day' | 'month' | 'year'>('day');
  const [date, setDate] = useState<Date>(new Date());
  const [totalGerado, setTotalGerado] = useState<number | null>(null);
  const [dadosTecnicos, setDadosTecnicos] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  // ✅ Busca e atualiza a planta + performance30d
  useEffect(() => {
    const fetchUsinaEPerformance = async () => {
      try {
        const usinas = await getUsinas();
        const found = usinas.find((u) => String(u.ps_id) === id);
        if (found) {
          let updatedPlant = { ...found };
  
          // Performance dos últimos 30 dias
          const res30d = await fetch("https://backendmonitoramento-production.up.railway.app/performance_30dias");
          const data30d = await res30d.json();
          const perf30d = data30d.find((item: any) => String(item.plant_id) === String(found.ps_id));
          if (perf30d) {
            updatedPlant.performance30d = perf30d.performance_percentual;
          }
  
          // ✅ Performance diária (todas as usinas, filtra a correta)
          const resDia = await fetch("https://backendmonitoramento-production.up.railway.app/performance_diaria");
          const dataDia = await resDia.json();
          const perfDia = dataDia.find((item: any) => String(item.plant_id) === String(found.ps_id));
          if (perfDia) {
            updatedPlant.performance_diaria = perfDia.performance_percentual;
          }
  
          setPlant(updatedPlant);
        }
      } catch (error) {
        console.error("Erro ao buscar dados da usina:", error);
      }
    };
  
    fetchUsinaEPerformance();
  }, [id]);

  useEffect(() => {
    const getDadosTecnicos = async (plantId: number, token: string | null) => {
      const res = await fetch(`https://backendmonitoramento-production.up.railway.app/dados_tecnicos?plant_id=${plantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      if (!res.ok) {
        throw new Error("Erro ao buscar dados técnicos");
      }
    
      return await res.json();
    };
    async function fetchDados() {
      try {
        const res = await getDadosTecnicos(Number(id), token);
        setDadosTecnicos(res.dados);
    
        if (res.dados && res.dados.length > 0) {
          const temperatura = res.dados[0].temperatura_interna;
          setPlant((prevPlant: any) => ({
            ...prevPlant,
            temperatura_interna: temperatura
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar dados técnicos:", err);
      }
    }
  
    if (id && token) {
      fetchDados();
    }
  }, [id, token]);


  const normalizarPotenciaKW = (valor: string | number): number => {
    if (typeof valor === 'string') {
      const watts = parseFloat(valor.replace(/\./g, ''));
      return watts / 1000;
    }
    return valor / 1000;
  };

  if (!plant) return <div className="p-4 text-muted-foreground">Carregando dados...</div>;

  const formatDate = () => {
    switch (periodType) {
      case 'day': return format(date, 'PP', { locale: ptBR });
      case 'month': return format(date, 'MMMM yyyy', { locale: ptBR });
      case 'year': return format(date, 'yyyy', { locale: ptBR });
    }
  };

  const renderCalendarContent = () => {
    switch (periodType) {
      case 'month':
        const months = Array.from({ length: 12 }, (_, i) => {
          const d = new Date(date.getFullYear(), i, 1);
          return (
            <Button key={i} variant={i === date.getMonth() ? "default" : "outline"} className="m-1" onClick={() => setDate(new Date(date.getFullYear(), i, 1))}>
              {format(d, 'MMM', { locale: ptBR })}
            </Button>
          );
        });
        return (
          <div className="p-3">
            <div className="flex justify-between items-center mb-4">
              <Button variant="outline" onClick={() => setDate(new Date(date.getFullYear() - 1, date.getMonth(), 1))}><ChevronLeft className="h-4 w-4" /></Button>
              <span>{date.getFullYear()}</span>
              <Button variant="outline" onClick={() => setDate(new Date(date.getFullYear() + 1, date.getMonth(), 1))}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <div className="grid grid-cols-3 gap-2">{months}</div>
          </div>
        );
      case 'year':
        const currentYear = date.getFullYear();
        const years = Array.from({ length: 9 }, (_, i) => currentYear - 4 + i).map(year => (
          <Button key={year} variant={year === currentYear ? "default" : "outline"} className="m-1" onClick={() => setDate(new Date(year, 0, 1))}>
            {year}
          </Button>
        ));
        return <div className="p-3 grid grid-cols-3 gap-2">{years}</div>;
      default:
        return (
          <CalendarComponent mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus className="pointer-events-auto" />
        );
    }
  };

  const mapFaultStatusToText = (status: number): string => {
    switch (status) {
      case 1: return 'falha';
      case 2: return 'alarme';
      case 3: return 'online';
      default: return 'desconhecido';
    }
  };

  const economiaEstimada = totalGerado !== null ? parseFloat((totalGerado * 0.95).toFixed(2)) : 0;


  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500 animate-pulse-slow text-lg px-4 py-2">Online</Badge>;
      case 'falha':
        return <Badge variant="destructive" className="text-lg px-4 py-2">Falha</Badge>;
      case 'alarme':
        return <Badge className="bg-yellow-500 text-lg px-4 py-2">Alarme</Badge>;
      default:
        return <Badge variant="outline" className="text-lg px-4 py-2">{status}</Badge>;
    }


  };

  const tensoesStrings = dadosTecnicos.filter((d: any) => d.nome?.startsWith("tensao_string_"));
  const correntesStrings = dadosTecnicos.filter((d: any) => d.nome?.startsWith("corrente_string_"));

  


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button and page title */}
      <div className="flex items-center gap-4">
        <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="hover:bg-muted/60"
        
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-solar-blue dark:text-white">{plant.ps_name}</h1>
          <p className="text-muted-foreground">{plant.location}</p>
          </div>
        </div>

        {/* Status highlight */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border rounded-lg bg-muted/30 animate-fade-in">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">Status de Operação do Sistema</span>
          <div className="mt-1">
            <StatusBadge status={mapFaultStatusToText(plant.ps_fault_status)} />
          </div>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Button variant="outline">
            Exportar Relatório Mensal
          </Button>
        </div>
      </div>

{/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-scale-in">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-solar-blue">Geração</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {totalGerado !== null ? `${totalGerado.toLocaleString('pt-BR')} kWh` : 'Carregando...'}
              </div>
            <p className="text-sm text-muted-foreground">período analisado</p>
          </CardContent>
            </Card>
{/* Economia Estimada */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
  <CardHeader className="pb-2">
    <CardTitle className="text-solar-blue">Economia Estimada</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">
      R$ {economiaEstimada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
    </div>
    <p className="text-sm text-muted-foreground">no mês atual</p>
  </CardContent>
</Card>
{/* Eficiência */}
<Card className="hover:shadow-lg transition-shadow duration-300">
  <CardHeader className="pb-2">
    <CardTitle className="text-solar-blue">Performance do Sistema</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">{plant.performance30d}%</div>
    <div className="w-full h-2 bg-muted rounded-full mt-2">
      <div 
        className={`h-2 rounded-full ${
          plant.performance30d > 85 ? 'bg-green-500' : 
          plant.performance30d > 60 ? 'bg-yellow-500' : 'bg-red-500'
        }`} 
        style={{ width: `${Math.min(plant.performance30d, 100)}%` }}
      />
    </div>
  </CardContent>
</Card>
      </div>


{/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Energy chart - 3 columns */}
        <div className="lg:col-span-3 space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Análise de Geração</CardTitle>
                <div className="flex items-center gap-4">
                  <Select value={periodType} onValueChange={(val) => setPeriodType(val as any)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Dia</SelectItem>
                      <SelectItem value="month">Mês</SelectItem>
                      <SelectItem value="year">Ano</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate()}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      {renderCalendarContent()}
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>
            <CardContent>
  <div className="h-[300px]">
    {plant?.ps_id && (
      <EnergyProductionChart
        periodType={periodType}
        selectedDate={date}
        plantId={plant.ps_id}
        onTotalChange={(valor) => setTotalGerado(valor)}
      />
    )}
  </div>
</CardContent>
          </Card>
        </div>


            {/* Power gauge - 2 columns */}
            <div className="lg:col-span-2 animate-fade-in">
            <Card className="h-full flex flex-col">
            <CardHeader>
            <CardTitle>Potência Instantânea</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
              <PowerGauge value={parseFloat(((normalizarPotenciaKW(plant.curr_power) / plant.capacidade) * 100).toFixed(1))} />
              </CardContent>
              <CardFooter className="flex justify-center">
              <span className="text-muted-foreground text-lg">
              {normalizarPotenciaKW(plant.curr_power).toFixed(2)} kW
              </span>
              </CardFooter>
              </Card>
            </div>
          </div>

            
{/* System information and current state */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-2">
              <Info className="h-5 w-5 text-solar-orange" />
                <CardTitle>Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium">{plant.ps_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Localização</p>
                <p className="font-medium">{plant.location}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
              <p className="text-sm text-muted-foreground">Capacidade Instalada</p>
              <p className="font-medium">{plant.capacidade} kWp</p>
              </div>
            </div>
            </CardContent>
          </Card>


        

        {/*LISTA DE ALARMES */}
        
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center space-x-2">
            <CircleAlert className="h-5 w-5 text-solar-orange" />
            <CardTitle>Alarmes Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
           
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CircleAlert className="h-5 w-5 text-solar-blue" />
                <p className="text-sm text-muted-foreground">Alarme 1</p>
              </div>
              <p className={`font-medium ${plant.temperature > 35 ? 'text-red-500' : plant.temperature > 30 ? 'text-yellow-500' : 'text-green-500'}`}>
                {plant.temperature > 0 ? `${plant.temperature}°C` : 'N/A'}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CircleAlert className="h-5 w-5 text-solar-blue" />
                <p className="text-sm text-muted-foreground">Alarme 2</p>
              </div>
              <p className={`font-medium ${plant.temperature > 35 ? 'text-red-500' : plant.temperature > 30 ? 'text-yellow-500' : 'text-green-500'}`}>
                {plant.temperature > 0 ? `${plant.temperature}°C` : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
        </div>
                  {/* INFORMAÇÕES TÉCNICAS DO SISTEMA */}
                  <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center space-x-2">
          <Gauge className="h-5 w-5 text-solar-orange" />
          <CardTitle>Informações Técnicas do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
        {dadosTecnicos.map((inversor, idx) => {
        const tensoes = Object.entries(inversor).filter(([k]) => k.startsWith("tensao_string_"));
        const correntes = Object.entries(inversor).filter(([k]) => k.startsWith("corrente_string_"));
        const tensoesMPPT = Object.entries(inversor).filter(([k]) => k.startsWith("tensao_mppt_"));
        const correntesMPPT = Object.entries(inversor).filter(([k]) => k.startsWith("corrente_mppt_"));

            
            return (
              <div key={idx} className="space-y-4 border-t pt-4 mt-4">
                <div className="flex items-center gap-2">
                  <CircuitBoard className="h-5 w-5 text-solar-orange" />
                  <p className="text-base font-semibold white">
                  {inversor.nome_inversor?.toLowerCase().startsWith("inverter")
                    ? `Inversor ${idx + 1}`
                    : inversor.nome_inversor || `Inversor ${idx + 1}`}
                </p>
                </div>


                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-solar-orange" />
                      <p className="text-sm text-muted-foreground">Temperatura de Ar Interna</p>
                    </div>
                    <p className={`font-medium ${
                      inversor.temperatura_interna > 65
                        ? 'text-red-500'
                        : inversor.temperatura_interna > 30
                        ? 'text-yellow-500'
                        : 'text-green-500'
                    }`}>
                      {inversor.temperatura_interna > 0
                        ? `${inversor.temperatura_interna}°C`
                        : 'N/A'}
                    </p>
                  </div>



                <div className="space-y-1">

                  {tensoes.map(([nome, valor]) => (
                    <div key={nome} className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground capitalize">{nome.replace(/_/g, ' ')}</p>
                      <p className="font-medium">{valor} V</p>
                    </div>
                  ))}
                </div>

                
                <div className="space-y-1 mt-2">
                  {correntes.map(([nome, valor]) => (
                    <div key={nome} className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground capitalize">{nome.replace(/_/g, ' ')}</p>
                      <p className="font-medium">{valor} A</p>
                    </div>
                  ))}
                </div>
              {/* Tensões por MPPT */}
              <div className="space-y-1 mt-4">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-solar-orange" />
                  <p className="text-base font-semibold white">Tensões por MPPT</p>
                </div>
                {tensoesMPPT.map(([nome, valor]) => (
                  <div key={nome} className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground capitalize">{nome.replace(/_/g, " ")}</p>
                    <p className="font-medium">{valor} V</p>
                  </div>
                ))}
              </div>

              {/* Correntes por MPPT */}
              <div className="space-y-1 mt-2">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-solar-orange" />
                  <p className="text-base font-semibold white">Correntes por MPPT</p>
                </div>
                {correntesMPPT.map(([nome, valor]) => (
                  <div key={nome} className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground capitalize">{nome.replace(/_/g, " ")}</p>
                    <p className="font-medium">{valor} A</p>
                  </div>
                ))}
              </div>



              </div>
            );
          })}
        </CardContent>
      </Card>

      </div>
  );
};

export default UsinaDetalhe;
