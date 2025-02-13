import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, UserCheck } from "lucide-react";
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
      title: "Total Active Users",
      value: getMetricByName("Active Users").toLocaleString(),
      icon: Users,
      description: "Current active users",
      className: "text-blue-500",
    },
    {
      title: "Total Subscribers",
      value: getMetricByName("Total Users").toLocaleString(),
      icon: UserCheck,
      description: "Registered users",
      className: "text-green-500",
    },
    {
      title: "Conversion Rate",
      value: `${getMetricByName("Conversion Rate")}%`,
      icon: TrendingUp,
      description: "Free to paid conversion",
      className: "text-purple-500",
    },
    {
      title: "Total Revenue",
      value: `$${getMetricByName("Revenue").toLocaleString()}`,
      icon: DollarSign,
      description: "Monthly recurring revenue",
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
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}