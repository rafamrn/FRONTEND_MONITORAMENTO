
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
}

const StatsCard = ({
  title,
  value,
  unit,
  icon,
  trend
}: StatsCardProps) => {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline">
              <h3 className="text-2xl font-bold">{value}</h3>
              {unit && <span className="text-sm ml-1 text-muted-foreground">{unit}</span>}
            </div>
            
            {trend && (
              <div className="flex items-center mt-2">
                <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
                {trend.label && (
                  <span className="text-xs text-muted-foreground ml-1.5">
                    {trend.label}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="p-2 rounded-md bg-solar-green bg-opacity-10">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
