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
  
        const response = await axios.get('https://backendmonitoramento-production.up.railway.app/api/geracao', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            period: periodType,
            date: dateParam,
            plant_id: plantId,
          }
        });
  
        const responseData = response.data;
  
        if (periodType === 'day' && Array.isArray(responseData.diario)) {
          setData(responseData.diario);
          if (responseData.p1) setTotalP1(responseData.p1);
        } else if (Array.isArray(responseData)) {
          setData(responseData);
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
            labelFormatter={(label) => `Horário: ${label}`}
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
      {totalP1 !== null && (
    <div className="text-center mt-6 text-lg font-semibold text-white">
      Geração Total: {totalP1.toLocaleString('pt-BR')} kWh
    </div>
  )}
    </div>
  );
};

export default EnergyProductionChart;
