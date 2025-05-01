import React, { useEffect, useState } from 'react';
import { CircleProgressBar } from "@/components/CircleProgressBar";

interface PowerGaugeProps {
  value: number;
}

export const PowerGauge = ({ value }: PowerGaugeProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    // Inicia a animação e define o valor
    const timeout = setTimeout(() => {
      setDisplayValue(value);
      setAnimate(false); // Remove a animação após a transição
    }, 1000); // tempo da animação inicial

    return () => clearTimeout(timeout);
  }, [value]);

  const getColor = () => {
    if (displayValue > 80) return 'text-green-500';
    if (displayValue > 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className={`relative w-64 h-64 ${animate ? 'animate-pulseGlow' : ''}`}>
        <CircleProgressBar 
          percentage={displayValue} 
          circleWidth={220}
          strokeWidth={15}
          gradientStart={displayValue > 80 ? '#22c55e' : displayValue > 50 ? '#eab308' : '#ef4444'}
          gradientEnd={displayValue > 80 ? '#16a34a' : displayValue > 50 ? '#ca8a04' : '#dc2626'}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className={`text-4xl font-bold ${getColor()}`}>{displayValue}%</p>
          <p className="text-sm text-muted-foreground">Potência Atual</p>
        </div>
      </div>
    </div>
  );
};
