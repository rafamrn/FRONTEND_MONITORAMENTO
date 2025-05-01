
import React from 'react';
import DashboardHeader from './DashboardHeader';
import PowerGenerationCard from './PowerGenerationCard';
import EnergyProductionChart from './EnergyProductionChart';
import StatsCard from './StatsCard';
import WeatherCard from './WeatherCard';
import EnergySavingsCalculator from './EnergySavingsCalculator';
import { Battery, Leaf, Zap } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="container mx-auto py-4 px-4 max-w-7xl">
      <DashboardHeader systemName="Radiant Power Insight" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard 
          title="Total Energy Today"
          value={28.7}
          unit="kWh"
          icon={<Zap className="h-5 w-5 text-solar-green" />}
          trend={{ value: 12, isPositive: true, label: "vs. yesterday" }}
        />
        <StatsCard 
          title="CO₂ Offset Today"
          value={14.2}
          unit="kg"
          icon={<Leaf className="h-5 w-5 text-solar-green" />}
          trend={{ value: 8, isPositive: true, label: "vs. yesterday" }}
        />
        <StatsCard 
          title="Battery Status"
          value={74}
          unit="%"
          icon={<Battery className="h-5 w-5 text-solar-green" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PowerGenerationCard currentPower={4.2} maxCapacity={10} />
        <WeatherCard />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnergyProductionChart />
        </div>
        <div>
          <EnergySavingsCalculator />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
