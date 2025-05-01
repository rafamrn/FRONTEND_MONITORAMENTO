
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const EnergySavingsCalculator = () => {
  const [electricityRate, setElectricityRate] = useState(0.15);
  const [systemSize, setSystemSize] = useState(5);
  const [yearlySavings, setYearlySavings] = useState(1350);

  const calculateSavings = () => {
    // Simple calculation: System size (kW) * 5 hours average daily production * 365 days * electricity rate
    const savings = systemSize * 5 * 365 * electricityRate;
    setYearlySavings(Math.round(savings));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Energy Savings Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="electricityRate" className="block text-sm font-medium mb-1">
              Electricity Rate ($ per kWh)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm">$</span>
              <Input
                id="electricityRate"
                type="number"
                step="0.01"
                min="0"
                value={electricityRate}
                onChange={(e) => setElectricityRate(parseFloat(e.target.value) || 0)}
                className="w-full"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              System Size: {systemSize} kW
            </label>
            <Slider
              value={[systemSize]}
              min={1}
              max={15}
              step={0.5}
              onValueChange={(value) => setSystemSize(value[0])}
            />
          </div>
          
          <Button onClick={calculateSavings} className="w-full bg-solar-green hover:bg-solar-green/90">
            Calculate Savings
          </Button>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Estimated Annual Savings</p>
            <p className="text-3xl font-bold text-solar-green">${yearlySavings}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergySavingsCalculator;
