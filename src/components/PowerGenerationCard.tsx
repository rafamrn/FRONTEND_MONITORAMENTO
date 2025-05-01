
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PowerGenerationCardProps {
  currentPower: number;
  maxCapacity: number;
}

const PowerGenerationCard = ({ 
  currentPower = 4.2,
  maxCapacity = 10
}: PowerGenerationCardProps) => {
  // Calculate the percentage of power generation
  const percentage = (currentPower / maxCapacity) * 100;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Current Power Generation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between mb-2">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{currentPower}</span>
            <span className="text-sm ml-1 text-muted-foreground">kW</span>
          </div>
          <span className="text-sm text-muted-foreground">of {maxCapacity} kW capacity</span>
        </div>
        
        <Progress value={percentage} className="h-2" />
        
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <span className="inline-block w-3 h-3 rounded-full bg-solar-green mr-1"></span>
            Active Production
          </div>
          <div className="text-sm font-medium text-solar-green animate-pulse-slow">
            Generating Now
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PowerGenerationCard;
