
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, Droplets } from 'lucide-react';

const WeatherCard = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Weather Conditions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sun className="h-10 w-10 text-solar-yellow mr-3" />
            <div>
              <p className="text-2xl font-bold">28°C</p>
              <p className="text-sm text-muted-foreground">Sunny</p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <Cloud className="h-5 w-5 text-solar-light-blue mr-2" />
              <span className="text-sm">0% Cloud Cover</span>
            </div>
            <div className="flex items-center">
              <Droplets className="h-5 w-5 text-solar-light-blue mr-2" />
              <span className="text-sm">0% Precipitation</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <p className="text-sm text-center text-solar-green font-medium">Optimal Solar Production Conditions</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
