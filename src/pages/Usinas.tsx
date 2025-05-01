import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Factory, Plus } from "lucide-react";
import { getUsinas } from "@/services/usinaService";

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const Usinas = () => {
  const [powerPlants, setPowerPlants] = useState<any[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<number | null>(null);
  const [monthlyGeneration, setMonthlyGeneration] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    getUsinas()
      .then(setPowerPlants)
      .catch((err) => {
        console.error("Erro ao carregar usinas:", err);
      });
  }, []);

  const handleGenerationChange = (month: string, value: string) => {
    setMonthlyGeneration(prev => ({
      ...prev,
      [month]: parseFloat(value) || 0
    }));
  };

  const handleSaveGeneration = () => {
    console.log(`Saved projected generation for plant ID ${selectedPlant}:`, monthlyGeneration);
    setSelectedPlant(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-solar-blue dark:text-white">Usinas</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Gerencie todas as usinas solares e configure projeções mensais.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {powerPlants.map((plant) => (
          <Card key={plant.ps_id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-solar-blue to-solar-blue/80 text-white">
              <CardTitle className="text-md flex items-center gap-2">
                <Factory size={18} />
                {plant.ps_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Capacidade:</span>
                  <span className="font-medium">{plant.capacidade} kWp</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Endereço:</span>
                  <span className="font-medium">{plant.location}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedPlant(plant.ps_id)}
                  >
                    <Plus size={16} className="mr-2" />
                    Projeção Mensal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Projeção Mensal - {plant.ps_name}</DialogTitle>
                    <DialogDescription>
                      Insira a geração projetada (kWh) para cada mês do ano.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-4 py-4">
                    {months.map((month) => (
                      <div key={month} className="flex flex-col space-y-1">
                        <Label htmlFor={`${month}-input`}>{month}</Label>
                        <Input
                          id={`${month}-input`}
                          type="number"
                          placeholder="kWh"
                          onChange={(e) => handleGenerationChange(month, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedPlant(null)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSaveGeneration}
                      className="bg-solar-orange hover:bg-solar-orange/90"
                    >
                      Salvar Projeção
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Usinas;
