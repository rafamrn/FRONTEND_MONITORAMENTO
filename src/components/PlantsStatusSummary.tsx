import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, AlertTriangle, X } from "lucide-react";

interface PlantsStatusSummaryProps {
  plants: Array<{
    id: number;
    name: string;
    status: string;
  }>;
  selectedStatus?: string | null;
  onStatusClick?: (status: string) => void;
}

const PlantsStatusSummary: React.FC<PlantsStatusSummaryProps> = ({
  plants,
  selectedStatus,
  onStatusClick,
}) => {
  const onlineCount = plants.filter((plant) => plant.status === "online").length;
  const alertCount = plants.filter((plant) => plant.status === "alarme").length;
  const offlineCount = plants.filter((plant) => plant.status === "falha").length;

  const statusBoxes = [
    {
      label: "Online",
      count: onlineCount,
      status: "online",
      icon: <Check className="h-5 w-5 text-green-500" />,
      bg: "bg-green-500/10",
    },
    {
      label: "Em Alerta",
      count: alertCount,
      status: "alarme",
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      bg: "bg-amber-500/10",
    },
    {
      label: "Offline",
      count: offlineCount,
      status: "falha",
      icon: <X className="h-5 w-5 text-red-500" />,
      bg: "bg-red-500/10",
    },
  ];

  return (
    <Card className="overflow-hidden card-gradient card-hover">
      <CardContent className="p-4">
        <div className="flex flex-wrap justify-around gap-4 py-2">
          {statusBoxes.map((box) => (
            <div
              key={box.status}
              onClick={() =>
                onStatusClick?.(selectedStatus === box.status ? null : box.status)
              }
              className={`flex items-center gap-2 cursor-pointer rounded-md p-2 transition ${
                selectedStatus === box.status ? "bg-muted" : ""
              }`}
            >
              <div className={`p-2 rounded-full ${box.bg}`}>{box.icon}</div>
              <div>
                <p className="text-xs text-muted-foreground">{box.label}</p>
                <p className="text-lg font-bold">{box.count}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantsStatusSummary;
