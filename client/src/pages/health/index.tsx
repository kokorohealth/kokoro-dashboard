import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Scale, Ruler, LineChart } from "lucide-react";
import Chart from "react-apexcharts";
import { cn } from "@/lib/utils";
import { TimeFilter } from "@/components/ui/time-filter";
import { formatTrendValue } from "@/lib/trends";
import { DateRange } from "react-day-picker";
import React from "react";
import type { HealthData, User } from "@shared/schema";

interface KPIStat {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  className: string;
}

export default function HealthTracking() {
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [showComparison, setShowComparison] = React.useState(false);

  const { data: healthData, isLoading: healthDataLoading } = useQuery<HealthData[]>({
    queryKey: ["/api/health-data", dateRange],
  });

  const { data: prevHealthData, isLoading: prevHealthDataLoading } = useQuery<HealthData[]>({
    queryKey: ["/api/health-data", {
      from: new Date(dateRange.from!.getTime() - (dateRange.to!.getTime() - dateRange.from!.getTime())),
      to: dateRange.from
    }],
    enabled: showComparison,
  });

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Calculate health update frequency
  const activeUsers = users?.filter(u => u.lastActive) || [];
  const usersWithUpdates = new Set(healthData?.map(d => d.userId) || []);
  const prevUsersWithUpdates = new Set(prevHealthData?.map(d => d.userId) || []);

  const updatePercentage = activeUsers.length ? 
    Math.round((usersWithUpdates.size / activeUsers.length) * 100) : 0;
  const prevUpdatePercentage = activeUsers.length && showComparison ? 
    Math.round((prevUsersWithUpdates.size / activeUsers.length) * 100) : undefined;

  // Calculate average metrics
  const getAverageMetric = (data: HealthData[] | undefined, field: keyof HealthData) => {
    const values = data?.map(d => d[field]).filter(Boolean) as number[];
    return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  };

  const avgWeight = getAverageMetric(healthData, 'weight') / 1000; // Convert g to kg
  const prevAvgWeight = getAverageMetric(prevHealthData, 'weight') / 1000;

  const kpiStats: KPIStat[] = [
    {
      title: "Health Updates",
      value: formatTrendValue(updatePercentage, prevUpdatePercentage),
      description: "Users tracking health metrics",
      icon: Activity,
      className: "text-blue-500",
    },
    {
      title: "Avg Weight",
      value: formatTrendValue(avgWeight, showComparison ? prevAvgWeight : undefined),
      description: "Average weight (kg)",
      icon: Scale,
      className: "text-green-500",
    },
    {
      title: "Goal Progress",
      value: "50%", // This should come from API
      description: "Average goal completion",
      icon: LineChart,
      className: "text-purple-500",
    },
    {
      title: "Waist Reduction",
      value: "5cm", // This should come from API
      description: "Average reduction",
      icon: Ruler,
      className: "text-orange-500",
    },
  ];

  const chartOptions = {
    chart: {
      type: 'line' as const,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    xaxis: {
      type: 'datetime' as const,
      labels: {
        datetimeFormatter: {
          year: 'yyyy',
          month: "MMM 'yy",
          day: 'dd MMM',
        }
      }
    },
    stroke: {
      curve: 'smooth' as const,
      width: 2
    },
    colors: ['#2563EB', showComparison ? '#94A3B8' : undefined].filter(Boolean) as string[],
  };

  if (healthDataLoading || usersLoading || (showComparison && prevHealthDataLoading)) {
    return <div>Loading health data...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <TimeFilter
        onRangeChange={(range) => range && setDateRange(range)}
        onComparisonChange={setShowComparison}
        className="mb-8"
      />

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      {/* Weight Loss Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weight Loss Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={chartOptions}
            series={[
              {
                name: "Current Period",
                data: healthData
                  ?.filter(d => d.weight)
                  .map(d => ({
                    x: new Date(d.date).getTime(),
                    y: d.weight ? Math.round(d.weight / 1000) : null // Convert g to kg
                  })) || []
              },
              ...(showComparison ? [{
                name: "Previous Period",
                data: prevHealthData
                  ?.filter(d => d.weight)
                  .map(d => ({
                    x: new Date(d.date).getTime(),
                    y: d.weight ? Math.round(d.weight / 1000) : null
                  })) || []
              }] : [])
            ]}
            height={350}
            type="line"
          />
        </CardContent>
      </Card>

      {/* Biometric Data Trends */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Waist Circumference Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={chartOptions}
              series={[
                {
                  name: "Current Period",
                  data: healthData
                    ?.filter(d => d.waistCircumference)
                    .map(d => ({
                      x: new Date(d.date).getTime(),
                      y: d.waistCircumference ? d.waistCircumference / 10 : null // mm to cm
                    })) || []
                },
                ...(showComparison ? [{
                  name: "Previous Period",
                  data: prevHealthData
                    ?.filter(d => d.waistCircumference)
                    .map(d => ({
                      x: new Date(d.date).getTime(),
                      y: d.waistCircumference ? d.waistCircumference / 10 : null
                    })) || []
                }] : [])
              ]}
              height={350}
              type="line"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blood Glucose Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={chartOptions}
              series={[
                {
                  name: "Current Period",
                  data: healthData
                    ?.filter(d => d.bloodGlucose)
                    .map(d => ({
                      x: new Date(d.date).getTime(),
                      y: d.bloodGlucose
                    })) || []
                },
                ...(showComparison ? [{
                  name: "Previous Period",
                  data: prevHealthData
                    ?.filter(d => d.bloodGlucose)
                    .map(d => ({
                      x: new Date(d.date).getTime(),
                      y: d.bloodGlucose
                    })) || []
                }] : [])
              ]}
              height={350}
              type="line"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}