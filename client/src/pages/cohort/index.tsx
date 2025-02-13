
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserMinus, CalendarDays } from "lucide-react";
import Chart from "react-apexcharts";
import { cn } from "@/lib/utils";
import { TimeFilter } from "@/components/ui/time-filter";
import { formatTrendValue } from "@/lib/trends";
import { DateRange } from "react-day-picker";
import React from "react";
import type { User } from "@shared/schema";

interface KPIStat {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  className: string;
}

export default function CohortAnalysis() {
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // Last 6 months
    to: new Date(),
  });
  const [showComparison, setShowComparison] = React.useState(false);

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Calculate cohort metrics
  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter((u) => u.lastActive).length || 0;
  const churnRate = totalUsers ? ((totalUsers - activeUsers) / totalUsers * 100).toFixed(1) : "0";

  const kpiStats: KPIStat[] = [
    {
      title: "User Retention",
      value: `${((activeUsers / totalUsers) * 100).toFixed(1)}%`,
      description: "Overall retention rate",
      icon: Users,
      className: "text-blue-500",
    },
    {
      title: "Churn Rate",
      value: `${churnRate}%`,
      description: "Monthly churn rate",
      icon: UserMinus,
      className: "text-red-500",
    },
    {
      title: "Cohort Size",
      value: `${Math.floor(totalUsers / 6)}`,
      description: "Average monthly cohort",
      icon: CalendarDays,
      className: "text-green-500",
    },
  ];

  // Calculate cohort retention data
  const cohortData = React.useMemo(() => {
    if (!users?.length) return [];
    
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toISOString().slice(0, 7);
    }).reverse();

    return months.map(month => {
      const cohort = users.filter(u => u.joinDate.toString().startsWith(month));
      const retentionByMonth = months.map(m => {
        const activeInMonth = cohort.filter(u => 
          u.lastActive && u.lastActive.toString().startsWith(m)
        ).length;
        return (activeInMonth / cohort.length * 100) || 0;
      });
      return {
        name: month,
        data: retentionByMonth
      };
    });
  }, [users]);

  const retentionChartOptions = {
    chart: {
      type: 'heatmap' as const,
      toolbar: { show: false }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${Math.round(val)}%`
    },
    xaxis: {
      categories: Array.from({ length: 6 }, (_, i) => `Month ${i + 1}`)
    },
    colors: ['#2563EB']
  };

  if (isLoading) {
    return <div>Loading cohort data...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <TimeFilter
        onRangeChange={(range) => range && setDateRange(range)}
        onComparisonChange={setShowComparison}
        className="mb-8"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {kpiStats.map((stat) => (
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

      <Card>
        <CardHeader>
          <CardTitle>Cohort Retention Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={retentionChartOptions}
            series={cohortData}
            type="heatmap"
            height={350}
          />
        </CardContent>
      </Card>
    </div>
  );
}
