
import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Demo data for energy production by period type
const dailyEnergyData = [
  { time: '0', production: 0 },
  { time: '1', production: 0 },
  { time: '2', production: 0 },
  { time: '3', production: 0 },
  { time: '4', production: 0 },
  { time: '5', production: 0 },
  { time: '6', production: 0.8 },
  { time: '7', production: 4 },
  { time: '8', production: 6 },
  { time: '9', production: 5 },
  { time: '10', production: 8 },
  { time: '11', production: 9 },
  { time: '12', production: 9 },
  { time: '13', production: 7 },
  { time: '14', production: 5 },
  { time: '15', production: 4 },
  { time: '16', production: 3 },
  { time: '17', production: 2 },
  { time: '18', production: 0.8 },
  { time: '19', production: 0 },
  { time: '20', production: 0 },
  { time: '21', production: 0 },
  { time: '22', production: 0 },
  { time: '23', production: 0 },
];

const monthlyEnergyData = [
  { time: 'Jan', production: 120.5 },
  { time: 'Fev', production: 145.2 },
  { time: 'Mar', production: 190.8 },
  { time: 'Abr', production: 210.5 },
  { time: 'Mai', production: 220.3 },
  { time: 'Jun', production: 240.1 },
  { time: 'Jul', production: 280.7 },
  { time: 'Ago', production: 265.4 },
  { time: 'Set', production: 225.9 },
  { time: 'Out', production: 195.3 },
  { time: 'Nov', production: 170.2 },
  { time: 'Dez', production: 155.0 },
];

const yearlyEnergyData = [
  { time: '2018', production: 1250.8 },
  { time: '2019', production: 1820.5 },
  { time: '2020', production: 2340.3 },
  { time: '2021', production: 2560.7 },
  { time: '2022', production: 2840.2 },
  { time: '2023', production: 3020.5 },
  { time: '2024', production: 3150.8 },
];

interface EnergyProductionChartProps {
  periodType?: 'day' | 'month' | 'year';
}

const EnergyProductionChart: React.FC<EnergyProductionChartProps> = ({ periodType = 'day' }) => {
  // Select data based on period type
  const getData = () => {
    switch (periodType) {
      case 'month':
        return monthlyEnergyData;
      case 'year':
        return yearlyEnergyData;
      default:
        return dailyEnergyData;
    }
  };

  // Get unit based on period type
  const getUnit = () => {
    switch (periodType) {
      case 'day':
        return 'kW';
      case 'month':
      case 'year':
        return 'kWh';
    }
  };

  // Get title based on period type
  const getTitle = () => {
    switch (periodType) {
      case 'day':
        return 'Produção Diária de Energia';
      case 'month':
        return 'Produção Mensal de Energia';
      case 'year':
        return 'Produção Anual de Energia';
    }
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={getData()} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="time" tickLine={false} />
        <YAxis tickLine={false} axisLine={false} unit={getUnit()} />
        <Tooltip 
          formatter={(value) => [`${value} ${getUnit()}`, 'Produção']} 
          contentStyle={{ 
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Line 
          type="monotone"
          dataKey="production" 
          stroke="#2F855A" 
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EnergyProductionChart;
