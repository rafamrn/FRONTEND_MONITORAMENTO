import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Thermometer, ArrowRight, Power } from 'lucide-react';

interface StringData {
  id: number;
  voltage: number;
  current: number;
  isOperating: boolean;
}

interface MPPTData {
  id: number;
  voltage: number;
  current: number;
}

interface InverterData {
  id: number;
  name: string;
  temperature: number;
  efficiency: number;
  curr_power: number;
  strings: StringData[];
  mppts: MPPTData[];

  tensao_fase_a?: number;
  tensao_fase_b?: number;
  tensao_fase_c?: number;
  corrente_fase_a?: number;
  corrente_fase_b?: number;
  corrente_fase_c?: number;
  frequencia_rede?: number;
}

interface ACPhase {
  phase: string;
  voltage: number;
  current?: number;
}

interface EnergyFlowDiagramProps {
  inverters: InverterData[];
}

const StringComponent = ({ string }: { string: StringData }) => (
  <div className={`p-2 rounded-lg border-2 transition-all duration-500 min-w-[160px] ${
    string.isOperating 
      ? 'border-green-400 bg-green-50 dark:bg-green-950/20' 
      : 'border-red-400 bg-red-50 dark:bg-red-950/20'
  }`}>
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs font-medium">String {string.id}</span>
      <Badge 
        className={`text-xs px-2 py-0 ${string.isOperating ? 'bg-green-500' : 'bg-red-500'}`}
      >
        {string.isOperating ? 'ON' : 'OFF'}
      </Badge>
    </div>
    <div className="space-y-1 text-xs">
      <div className="flex justify-between">
        <span className="text-muted-foreground">V:</span>
        <span className="font-medium">{string.voltage}V</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">A:</span>
        <span className="font-medium">{string.current}A</span>
      </div>
    </div>
    {string.isOperating && (
      <div className="mt-1 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded animate-pulse" />
    )}
  </div>
);

const MPPTComponent = ({ mppt }: { mppt: MPPTData }) => (
  <div className="p-2 rounded-lg border-2 border-blue-400 bg-blue-50 dark:bg-blue-950/20 min-w-[160px] transition-all duration-500">
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs font-medium">MPPT {mppt.id}</span>
      <Badge className="text-xs px-2 py-0 bg-blue-500">MPPT</Badge>
    </div>
    <div className="space-y-1 text-xs">
      <div className="flex justify-between">
        <span className="text-muted-foreground">V:</span>
        <span className="font-medium">{mppt.voltage}V</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">A:</span>
        <span className="font-medium">{mppt.current}A</span>
      </div>
    </div>
  </div>
);


const EnergyFlow = ({ isActive }: { isActive: boolean }) => (
  <div className={`flex items-center justify-center px-4 ${isActive ? 'animate-pulse' : ''}`}>
    <div className={`flex items-center space-x-2 ${isActive ? 'text-yellow-500' : 'text-gray-300'}`}>
<div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-bounce' : 'bg-gray-300'}`} style={{ animationDelay: '0ms' }} />
<div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-bounce' : 'bg-gray-300'}`} style={{ animationDelay: '100ms' }} />
<div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-bounce' : 'bg-gray-300'}`} style={{ animationDelay: '200ms' }} />

      <ArrowRight className={`h-4 w-4 ${isActive ? 'text-green-500' : 'text-gray-300'}`} />
    </div>
  </div>
);

const InverterComponent = ({ inverter }: { inverter: InverterData }) => {
  const isActive = inverter.strings.length > 0
  ? inverter.strings.some(s => s.isOperating)
  : inverter.mppts.some(mppt => mppt.voltage > 100 && mppt.current > 0);

  return (
    <Card className={`min-w-[200px] transition-all duration-300 ${
      isActive ? 'border-solar-orange shadow-lg' : 'border-gray-300'
    }`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-sm flex items-center justify-center gap-2">
          <Zap className={`h-4 w-4 ${isActive ? 'text-solar-orange' : 'text-gray-400'}`} />
          {inverter.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Thermometer className="h-3 w-3 text-blue-500" />
            <span className="text-xs text-muted-foreground">Temp:</span>
          </div>
          <span className={`text-xs font-medium ${
            inverter.temperature > 60 ? 'text-red-500' : 
            inverter.temperature > 45 ? 'text-yellow-500' : 'text-green-500'
          }`}>
            {inverter.temperature}°C
          </span>
        </div>
        <div className="flex justify-between">
        </div>
        <div className="flex justify-between">
        <span className="text-xs text-muted-foreground">Potência Instantânea: </span>
        <span className="text-xs font-medium">{(inverter.curr_power / 1000).toFixed(2)} kW</span>
        </div>

        {isActive && (
          <div className="h-2 bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 rounded animate-pulse" />
        )}
      </CardContent>
    </Card>
  );
};

const ACOutputComponent = ({
  phases,
  frequency,
}: {
  phases: ACPhase[];
  frequency?: number;
}) => (
  <Card className="min-w-[180px] border-solar-green">
    <CardHeader className="pb-2">
      <CardTitle className="text-center text-sm flex items-center justify-center gap-2">
        <Power className="h-4 w-4 text-solar-green" />
        Saída CA
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
  <div className="flex flex-wrap justify-between gap-4">
    {phases.map((phase) => (
      <div key={phase.phase} className="space-y-1 text-xs border p-2 rounded-md min-w-[180px] flex-1">

          <div className="flex justify-between">
            <span className="font-medium">{phase.phase}</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tensão:</span>
            <span className="font-bold text-solar-green">{phase.voltage} V</span>
          </div>
          {phase.current !== undefined && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Corrente:</span>
              <span className="font-bold text-solar-green">{phase.current} A</span>
            </div>
          )}
        </div>
      ))}
  </div>
      {frequency !== undefined && (
        <div className="flex justify-between text-xs pt-2">
          <span className="text-muted-foreground">Frequência:</span>
          <span className="font-bold text-solar-green">{frequency} Hz</span>
        </div>
      )}

      <div className="mt-3 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded animate-pulse" />
      <div className="text-center">
        <span className="text-xs text-muted-foreground">Injetando na Rede</span>
      </div>
    </CardContent>
  </Card>
);


const EnergyFlowDiagram: React.FC<EnergyFlowDiagramProps> = ({ inverters }) => {
  return (
    <div className="space-y-8">
      {inverters.map((inverter) => {
        const isActive = inverter.strings.length > 0
    ? inverter.strings.some(s => s.isOperating)
    : inverter.mppts.some(mppt => mppt.voltage > 100 && mppt.current > 0);
        
        return (
          <div key={inverter.id} className="p-6 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-center overflow-x-auto">
              <div className="flex items-center gap-4 min-w-max">
                {/* Strings DC Section */}
        <div className="flex gap-6">
        {/* Strings DC */}
        {inverter.strings.length > 0 && (
        <div className="flex flex-col items-center gap-2">
            <h4 className="text-sm font-medium text-center mb-2">Strings DC</h4>
            <div className="grid grid-cols-2 gap-2">
            {inverter.strings.map((string) => (
                <StringComponent key={string.id} string={string} />
            ))}
            </div>
        </div>
        )}

        {/* MPPTs */}
        <div className="flex flex-col items-center gap-2">
            <h4 className="text-sm font-medium text-center mb-2">MPPTs</h4>
            <div className="grid grid-cols-2 gap-2">
            {inverter.mppts.map((mppt) => (
                <MPPTComponent key={mppt.id} mppt={mppt} />
            ))}
            </div>
        </div>
        </div>
                
                {/* Energy Flow to Inverter */}
                <EnergyFlow isActive={isActive} />
                
                {/* Inverter Section */}
                <div className="flex flex-col items-center">
                  <InverterComponent inverter={inverter} />
                </div>
                
                {/* Energy Flow from Inverter */}
                <EnergyFlow isActive={isActive} />
                
                {/* AC Output Section */}
                <div className="flex flex-col items-center">
                  <h4 className="text-sm font-medium text-center mb-2">Saída CA</h4>
                  <ACOutputComponent
  phases={[
    inverter.tensao_fase_a && inverter.tensao_fase_a > 0
      ? { phase: "Fase A", voltage: inverter.tensao_fase_a, current: inverter.corrente_fase_a }
      : null,
    inverter.tensao_fase_b && inverter.tensao_fase_b > 0
      ? { phase: "Fase B", voltage: inverter.tensao_fase_b, current: inverter.corrente_fase_b }
      : null,
    inverter.tensao_fase_c && inverter.tensao_fase_c > 0
      ? { phase: "Fase C", voltage: inverter.tensao_fase_c, current: inverter.corrente_fase_c }
      : null,
  ].filter(Boolean)}
  frequency={inverter.frequencia_rede}
/>

                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EnergyFlowDiagram;