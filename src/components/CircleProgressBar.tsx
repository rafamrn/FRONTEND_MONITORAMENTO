
import React from 'react';

interface CircleProgressBarProps {
  percentage: number;
  circleWidth?: number;
  strokeWidth?: number;
  gradientStart?: string;
  gradientEnd?: string;
}

export const CircleProgressBar: React.FC<CircleProgressBarProps> = ({
  percentage,
  circleWidth = 200,
  strokeWidth = 12,
  gradientStart = '#ff5704',
  gradientEnd = '#0e354a'
}) => {
  const radius = (circleWidth - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Generate a unique ID for the gradient
  const gradientId = `gradient-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        width={circleWidth}
        height={circleWidth}
        viewBox={`0 0 ${circleWidth} ${circleWidth}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientStart} />
            <stop offset="100%" stopColor={gradientEnd} />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={circleWidth / 2}
          cy={circleWidth / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        
        {/* Progress circle */}
        <circle
          cx={circleWidth / 2}
          cy={circleWidth / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="none"
          strokeLinecap="round"
          transform={`rotate(-90 ${circleWidth / 2} ${circleWidth / 2})`}
          className="transition-all duration-700 ease-out"
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
        
        {/* Gauge markers */}
        {[...Array(11)].map((_, i) => {
          const angle = -90 + (i * 18);
          const markerRadius = radius + 6;
          const x1 = (circleWidth / 2) + markerRadius * Math.cos(angle * Math.PI / 180);
          const y1 = (circleWidth / 2) + markerRadius * Math.sin(angle * Math.PI / 180);
          
          const x2 = (circleWidth / 2) + (markerRadius + (i % 5 === 0 ? 5 : 3)) * Math.cos(angle * Math.PI / 180);
          const y2 = (circleWidth / 2) + (markerRadius + (i % 5 === 0 ? 5 : 3)) * Math.sin(angle * Math.PI / 180);
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth={i % 5 === 0 ? 2 : 1}
              className="text-gray-400 dark:text-gray-500"
            />
          );
        })}
      </svg>
    </div>
  );
};
