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

const monthNumberToName = (n: number) => months[n - 1];

const Usinas = () => {
  const [powerPlants, setPowerPlants] = useState<any[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<number | null>(null);
  const [monthlyGeneration, setMonthlyGeneration] = useState<{ [key: string]: number }>({});
  const [dadosProjecao, setDadosProjecao] = useState<{ [plantId: number]: any[] }>({});

  useEffect(() => {
    getUsinas()
      .then(setPowerPlants)
      .catch((err) => console.error("Erro ao carregar usinas:", err));
  }, []);

  useEffect(() => {
    async function carregarProjecoesTodas() {
      for (const plant of powerPlants) {
        try {
          const res = await fetch(`https://SEU-BACKEND.onrailway.app/projecoes/${plant.ps_id}?year=2025`);
          const data = await res.json();
          setDadosProjecao(prev => ({ ...prev, [plant.ps_id]: data }));
        } catch (error) {
          console.error("Erro ao carregar projeções:", error);
        }
      }
    }

    if (powerPlants.length > 0) {
      carregarProjecoesTodas();
    }
  }, [powerPlants]);

  const handleGenerationChange = (month: string, value: string) => {
    setMonthlyGeneration(prev => ({
      ...prev,
      [month]: parseFloat(value) || 0
    }));
  };

  const carregarProjecoesSalvas = async (plantId: number) => {
    try {
      const res = await fetch(`https://SEU-BACKEND.onrailway.app/projecoes/${plantId}?year=2025`);
      const data = await res.json();

      const numeroParaMes: { [key: number]: string } = {
        1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril",
        5: "Maio", 6: "Junho", 7: "Julho", 8: "Agosto",
        9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro"
      };

      const dados: { [key: string]: number } = {};
      data.forEach((item: { month: number; projection_kwh: number }) => {
        const nomeMes = numeroParaMes[item.month];
        if (nomeMes) {
          dados[nomeMes] = item.projection_kwh;
        }
      });

      setMonthlyGeneration(dados);
    } catch (error) {
      console.error("Erro ao carregar projeções salvas:", error);
    }
  };

  const handleSaveGeneration = async () => {
    if (!selectedPlant) return;

    const mesNumero: { [key: string]: number } = {
      "Janeiro": 1, "Fevereiro": 2, "Março": 3, "Abril": 4,
      "Maio": 5, "Junho": 6, "Julho": 7, "Agosto": 8,
      "Setembro": 9, "Outubro": 10, "Novembro": 11, "Dezembro": 12
    };

    const projections = Object.entries(monthlyGeneration).map(([month, kwh]) => ({
      month: mesNumero[month],
      kwh
    }));

    const payload = {
      plant_id: selectedPlant,
      year: 2025,
      projections
    };

    try {
      const res = await fetch("https://backendmonitoramento-production.up.railway.app/projecoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      alert("Projeções salvas com sucesso!");
      setSelectedPlant(null);
      setMonthlyGeneration({});
    } catch (error) {
      console.error("Erro ao salvar projeções:", error);
      alert("Erro ao salvar projeções.");
    }
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
            <CardContent className="pt-6 space-y-4">
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

              {dadosProjecao[plant.ps_id]?.length > 0 && (
                <div className="text-sm border-t pt-2">
                  <p className="font-semibold mb-1 text-gray-500">Projeção (kWh):</p>
                  <ul className="space-y-1">
                    {dadosProjecao[plant.ps_id].map((item) => (
                      <li key={item.month} className="flex justify-between">
                        <span>{monthNumberToName(item.month)}:</span>
                        <span>{item.projection_kwh.toFixed(0)} kWh</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedPlant(plant.ps_id);
                      carregarProjecoesSalvas(plant.ps_id);
                    }}
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
                          value={monthlyGeneration[month] || ""}
                          onChange={(e) => handleGenerationChange(month, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedPlant(null)}>
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
