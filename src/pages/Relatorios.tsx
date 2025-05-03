import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Relatorios = () => {
  const { toast } = useToast();
  const [usinas, setUsinas] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://backendmonitoramento-production.up.railway.app/usina", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setUsinas)
      .catch((err) => {
        console.error("Erro ao carregar usinas", err);
        toast({
          title: "Erro ao buscar usinas",
          description: "Falha ao acessar os dados da API.",
          variant: "destructive",
        });
      });
  }, [toast]);

  const handleExportReport = (plantId: number, plantName: string) => {
    toast({
      title: "Relatório em exportação",
      description: `O relatório da ${plantName} está sendo gerado.`,
    });
  };

  const handleExportAllReports = () => {
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
                <TableHead>Última Atualização</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usinas.map((plant) => (
                <TableRow key={plant.ps_id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-solar-blue" />
                      {plant.ps_name}
                    </div>
                  </TableCell>
                  <TableCell>{plant.location || "Não informado"}</TableCell>
                  <TableCell>
                    {new Date().toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportReport(plant.ps_id, plant.ps_name)}
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
