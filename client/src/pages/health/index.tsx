import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
    to: new Date(),
  });
  const [showComparison, setShowComparison] = React.useState(false);

  const { data: healthData, isLoading: healthDataLoading } = useQuery<
    HealthData[]
  >({
    queryKey: ["/api/health-data", dateRange],
  });

  const { data: prevHealthData, isLoading: prevHealthDataLoading } = useQuery<
    HealthData[]
  >({
    queryKey: [
      "/api/health-data",
      {
        from: new Date(
          dateRange.from!.getTime() -
            (dateRange.to!.getTime() - dateRange.from!.getTime()),
        ),
        to: dateRange.from,
      },
    ],
    enabled: showComparison,
  });

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Calculate health update frequency
  const activeUsers = users?.filter((u) => u.lastActive) || [];
  const usersWithUpdates = new Set(healthData?.map((d) => d.userId) || []);
  const prevUsersWithUpdates = new Set(
    prevHealthData?.map((d) => d.userId) || [],
  );

  const updatePercentage = activeUsers.length
    ? Math.round((usersWithUpdates.size / activeUsers.length) * 100)
    : 0;
  const prevUpdatePercentage =
    activeUsers.length && showComparison
      ? Math.round((prevUsersWithUpdates.size / activeUsers.length) * 100)
      : undefined;

  // Calculate average metrics
  const getAverageMetric = (
    data: HealthData[] | undefined,
    field: keyof HealthData,
  ) => {
    const values = data?.map((d) => d[field]).filter(Boolean) as number[];
    return values?.length
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;
  };

  const avgWeight = getAverageMetric(healthData, "weight") / 1000; // Convert g to kg
  const prevAvgWeight = getAverageMetric(prevHealthData, "weight") / 1000;

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
      value: formatTrendValue(
        avgWeight,
        showComparison ? prevAvgWeight : undefined,
      ),
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
      type: "line" as const,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    xaxis: {
      type: "datetime" as const,
      labels: {
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
        },
      },
    },
    stroke: {
      curve: "smooth" as const,
      width: 2,
    },
    colors: ["#2563EB", showComparison ? "#94A3B8" : undefined].filter(
      Boolean,
    ) as string[],
  };

  if (
    healthDataLoading ||
    usersLoading ||
    (showComparison && prevHealthDataLoading)
  ) {
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

      {/* Weekly Averages */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Averages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2">Week</th>
                  <th className="px-4 py-2">Weight (kg)</th>
                  <th className="px-4 py-2">Waist (cm)</th>
                  <th className="px-4 py-2">Blood Glucose</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 12 }, (_, i) => {
                  const weekNumber = i + 1;
                  const weekData = healthData?.filter(d => {
                    const date = new Date(d.date);
                    const weekStart = new Date(dateRange.from!);
                    weekStart.setDate(weekStart.getDate() + (weekNumber - 1) * 7);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekEnd.getDate() + 7);
                    return date >= weekStart && date < weekEnd;
                  }) || [];

                  const avgWeight = weekData.reduce((sum, d) => sum + (d.weight || 0), 0) / (weekData.length || 1) / 1000;
                  const avgWaist = weekData.reduce((sum, d) => sum + (d.waistCircumference || 0), 0) / (weekData.length || 1) / 10;
                  const avgGlucose = weekData.reduce((sum, d) => sum + (d.bloodGlucose || 0), 0) / (weekData.length || 1);

                  return (
                    <tr key={weekNumber} className="border-b">
                      <td className="px-4 py-2">Week {weekNumber}</td>
                      <td className="px-4 py-2">{avgWeight.toFixed(1)}</td>
                      <td className="px-4 py-2">{avgWaist.toFixed(1)}</td>
                      <td className="px-4 py-2">{avgGlucose.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Goal Achievement */}
      <Card>
        <CardHeader>
          <CardTitle>Goal Achievement Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Weight Loss Goals */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Weight Loss Goals</span>
                <span className="text-sm text-muted-foreground">65% of members</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>

            {/* Activity Minutes */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Activity Minutes</span>
                <span className="text-sm text-muted-foreground">78% of members</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>

            {/* Sleep Hours */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Sleep Hours</span>
                <span className="text-sm text-muted-foreground">45% of members</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Average Charts */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Weight Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Average Weight (kg)</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={{
                ...chartOptions,
                xaxis: {
                  categories: Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`)
                }
              }}
              series={[{
                name: "Average Weight",
                data: Array.from({ length: 12 }, (_, i) => {
                  const weekNumber = i + 1;
                  const weekData = healthData?.filter(d => {
                    const date = new Date(d.date);
                    const weekStart = new Date(dateRange.from!);
                    weekStart.setDate(weekStart.getDate() + (weekNumber - 1) * 7);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekEnd.getDate() + 7);
                    return date >= weekStart && date < weekEnd;
                  }) || [];
                  return Number((weekData.reduce((sum, d) => sum + (d.weight || 0), 0) / (weekData.length || 1) / 1000).toFixed(1));
                })
              }]}
              height={300}
              type="line"
            />
          </CardContent>
        </Card>

        {/* Waist Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Average Waist (cm)</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={{
                ...chartOptions,
                xaxis: {
                  categories: Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`)
                }
              }}
              series={[{
                name: "Average Waist",
                data: Array.from({ length: 12 }, (_, i) => {
                  const weekNumber = i + 1;
                  const weekData = healthData?.filter(d => {
                    const date = new Date(d.date);
                    const weekStart = new Date(dateRange.from!);
                    weekStart.setDate(weekStart.getDate() + (weekNumber - 1) * 7);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekEnd.getDate() + 7);
                    return date >= weekStart && date < weekEnd;
                  }) || [];
                  return Number((weekData.reduce((sum, d) => sum + (d.waistCircumference || 0), 0) / (weekData.length || 1) / 10).toFixed(1));
                })
              }]}
              height={300}
              type="line"
            />
          </CardContent>
        </Card>

        {/* Blood Glucose Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Average Blood Glucose</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={{
                ...chartOptions,
                xaxis: {
                  categories: Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`)
                }
              }}
              series={[{
                name: "Average Blood Glucose",
                data: Array.from({ length: 12 }, (_, i) => {
                  const weekNumber = i + 1;
                  const weekData = healthData?.filter(d => {
                    const date = new Date(d.date);
                    const weekStart = new Date(dateRange.from!);
                    weekStart.setDate(weekStart.getDate() + (weekNumber - 1) * 7);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekEnd.getDate() + 7);
                    return date >= weekStart && date < weekEnd;
                  }) || [];
                  return Number((weekData.reduce((sum, d) => sum + (d.bloodGlucose || 0), 0) / (weekData.length || 1)).toFixed(1));
                })
              }]}
              height={300}
              type="line"
            />
          </CardContent>
        </Card>
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
                data:
                  healthData
                    ?.filter((d) => d.weight)
                    .map((d) => ({
                      x: new Date(d.date).getTime(),
                      y: d.weight ? Math.round(d.weight / 1000) : null, // Convert g to kg
                    })) || [],
              },
              ...(showComparison
                ? [
                    {
                      name: "Previous Period",
                      data:
                        prevHealthData
                          ?.filter((d) => d.weight)
                          .map((d) => ({
                            x: new Date(d.date).getTime(),
                            y: d.weight ? Math.round(d.weight / 1000) : null,
                          })) || [],
                    },
                  ]
                : []),
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
                  data:
                    healthData
                      ?.filter((d) => d.waistCircumference)
                      .map((d) => ({
                        x: new Date(d.date).getTime(),
                        y: d.waistCircumference
                          ? d.waistCircumference / 10
                          : null, // mm to cm
                      })) || [],
                },
                ...(showComparison
                  ? [
                      {
                        name: "Previous Period",
                        data:
                          prevHealthData
                            ?.filter((d) => d.waistCircumference)
                            .map((d) => ({
                              x: new Date(d.date).getTime(),
                              y: d.waistCircumference
                                ? d.waistCircumference / 10
                                : null,
                            })) || [],
                      },
                    ]
                  : []),
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
                  data:
                    healthData
                      ?.filter((d) => d.bloodGlucose)
                      .map((d) => ({
                        x: new Date(d.date).getTime(),
                        y: d.bloodGlucose,
                      })) || [],
                },
                ...(showComparison
                  ? [
                      {
                        name: "Previous Period",
                        data:
                          prevHealthData
                            ?.filter((d) => d.bloodGlucose)
                            .map((d) => ({
                              x: new Date(d.date).getTime(),
                              y: d.bloodGlucose,
                            })) || [],
                      },
                    ]
                  : []),
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
