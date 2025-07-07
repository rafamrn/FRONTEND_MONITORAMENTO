import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface EnergyProductionChartProps {
  periodType: 'day' | 'month' | 'year';
  selectedDate: Date;
  plantId?: number;
  onTotalChange?: (valor: number) => void;
}

const EnergyProductionChart: React.FC<EnergyProductionChartProps> = ({
  periodType,
  selectedDate,
  plantId,
  onTotalChange
}) => {
  const [data, setData] = useState<{ time: string; production: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalP1, setTotalP1] = useState<number | null>(null);

  useEffect(() => {
    const fetchEnergyData = async () => {
      setLoading(true);
      try {
        const dateParam = dayjs(selectedDate).format(
          periodType === 'day' ? 'YYYY-MM-DD' :
          periodType === 'month' ? 'YYYY-MM' :
          'YYYY'
        );

        const token = localStorage.getItem("token");

        const endpoint =
          periodType === 'month'
            ? 'https://backendmonitoramento-production.up.railway.app/api/geracao/mensal'
            : periodType === 'year'
            ? 'https://backendmonitoramento-production.up.railway.app/api/geracao/anual'
            : 'https://backendmonitoramento-production.up.railway.app/api/geracao';

        const params =
          periodType === 'year'
            ? { year: dateParam, plant_id: plantId }
            : { period: periodType, date: dateParam, plant_id: plantId };

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params
        });

        const responseData = response.data;

        if (periodType === 'day' && Array.isArray(responseData.diario)) {
          setData(responseData.diario.map((item: any) => ({
            time: item.time,
            production: item.production
          })));
          if (responseData.p1) {
  console.log("🔵 Valor de p1 (geração total):", responseData.p1);
  setTotalP1(responseData.p1);
  if (onTotalChange) {
    onTotalChange(responseData.p1); // <- ✅ chama o callback para UsinaDetalhe
  }
}

console.log("🟢 Valores de p24 (produção por horário):", responseData.diario);

        } else if (periodType === 'month' && Array.isArray(responseData["30dias"])) {
          setData(responseData["30dias"].map((item: any) => ({
            time: item.date,
            production: item.production
          })));
          setTotalP1(responseData.total);
          if (onTotalChange) {
            onTotalChange(responseData.total); // ✅ envia total mensal
          }

        } else if (periodType === 'year' && Array.isArray(responseData["12meses"] || responseData.anual)) {
          const meses = responseData["12meses"] || responseData.anual;
          setData(meses.map((item: any) => ({
            time: item.date,
            production: item.production
          })));
          setTotalP1(responseData.total);
          if (onTotalChange) {
            onTotalChange(responseData.total);
          }



        } else {
          console.warn("Formato de dados inesperado:", responseData);
          setData([]);
        }

      } catch (error) {
        console.error('Erro ao carregar dados de geração:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (plantId) {
      fetchEnergyData();
    }
  }, [periodType, selectedDate, plantId]);

  const getUnit = () => (periodType === 'day' ? 'kW' : 'kWh');

  if (loading) {
    return <div className="text-sm text-gray-500">Carregando gráfico...</div>;
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" tickLine={false} />
          <YAxis tickLine={false} axisLine={false} unit={getUnit()} />
          <Tooltip
            formatter={(value) => [`${value} ${getUnit()}`, 'Produção']}
            labelFormatter={(label) => `${periodType === 'year' ? 'Mês' : periodType === 'month' ? 'Dia' : 'Hora'}: ${label}`}
            contentStyle={{
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
            labelClassName="text-sm text-gray-700 font-medium"
          />
          <Line
            type="monotone"
            dataKey="production"
            stroke="#2F855A"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyProductionChart;