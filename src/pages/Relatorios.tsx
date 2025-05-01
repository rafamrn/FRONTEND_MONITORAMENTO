
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const powerPlants = [
  {
    id: 1,
    name: "Usina Solar Central",
    location: "São Paulo, SP",
    lastReportDate: "2025-03-28",
    reportCount: 12,
  },
  {
    id: 2,
    name: "Parque Solar Norte",
    location: "Fortaleza, CE",
    lastReportDate: "2025-03-27",
    reportCount: 10,
  },
  {
    id: 3,
    name: "Fazenda Solar Sul",
    location: "Porto Alegre, RS",
    lastReportDate: "2025-03-15",
    reportCount: 8,
  },
  {
    id: 4,
    name: "Usina Solar Vale Verde",
    location: "Belo Horizonte, MG",
    lastReportDate: "2025-03-25",
    reportCount: 11,
  },
  {
    id: 5,
    name: "Parque Solar Oeste",
    location: "Cuiabá, MT",
    lastReportDate: "2025-03-20",
    reportCount: 9,
  },
];

const Relatorios = () => {
  const { toast } = useToast();

  const handleExportReport = (plantId: number, plantName: string) => {
    // In a real application, this would trigger a download
    toast({
      title: "Relatório em exportação",
      description: `O relatório da ${plantName} está sendo gerado.`,
    });
  };

  const handleExportAllReports = () => {
    // In a real application, this would trigger multiple downloads or a zip file
    toast({
      title: "Exportando todos os relatórios",
      description: "Todos os relatórios estão sendo compilados para download.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-solar-blue dark:text-white">Relatórios</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Exporte relatórios detalhados de cada usina solar.
          </p>
        </div>
        <Button 
          onClick={handleExportAllReports}
          className="bg-solar-orange hover:bg-solar-orange/90"
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar Todos
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Nome da Usina</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Último Relatório</TableHead>
                <TableHead>Qtd Relatórios</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {powerPlants.map((plant) => (
                <TableRow key={plant.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-solar-blue" />
                      {plant.name}
                    </div>
                  </TableCell>
                  <TableCell>{plant.location}</TableCell>
                  <TableCell>
                    {new Date(plant.lastReportDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{plant.reportCount}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportReport(plant.id, plant.name)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Exportar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Relatorios;
