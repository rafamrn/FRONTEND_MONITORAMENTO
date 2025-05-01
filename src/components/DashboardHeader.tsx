
import React from 'react';
import { Sun } from 'lucide-react';

interface DashboardHeaderProps {
  systemName?: string;
}

const DashboardHeader = ({ systemName = "Solar Power System" }: DashboardHeaderProps) => {
  return (
    <header className="flex justify-between items-center w-full py-4 mb-6">
      <div className="flex items-center">
        <Sun className="h-8 w-8 mr-2 text-solar-yellow" />
        <h1 className="text-2xl font-bold">{systemName}</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="px-3 py-1.5 bg-green-100 text-solar-green font-medium rounded-full text-sm">
          System Online
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
