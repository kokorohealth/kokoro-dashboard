import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";
import type { Metric } from "@shared/schema";
import { cn } from "@/lib/utils";

interface StatsProps {
  metrics: Metric[];
}

export function Stats({ metrics }: StatsProps) {
  const getMetricByName = (name: string) => 
    metrics.find(m => m.name === name)?.value || 0;

  const stats = [
    {
      title: "Total Users",
      value: getMetricByName("Total Users").toLocaleString(),
      icon: Users,
      className: "text-blue-500",
    },
    {
      title: "Active Users",
      value: getMetricByName("Active Users").toLocaleString(),
      icon: Activity,
      className: "text-green-500",
    },
    {
      title: "Revenue",
      value: `$${getMetricByName("Revenue").toLocaleString()}`,
      icon: DollarSign,
      className: "text-purple-500",
    },
    {
      title: "Growth",
      value: `${getMetricByName("Growth")}%`,
      icon: TrendingUp,
      className: "text-orange-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={cn("h-4 w-4", stat.className)} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}