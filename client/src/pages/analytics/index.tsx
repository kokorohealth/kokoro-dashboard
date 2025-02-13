import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, PhoneCall, UserCheck, BookOpen } from "lucide-react";
import Chart from "react-apexcharts";
import { cn } from "@/lib/utils";
import type { Metric } from "@shared/schema";

interface KPIStat {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  className: string;
}

export default function Analytics() {
  const { data: metrics, isLoading } = useQuery<Metric[]>({
    queryKey: ["/api/metrics"],
  });

  const getMetricByName = (name: string) => 
    metrics?.find(m => m.name === name)?.value || 0;

  const kpiStats: KPIStat[] = [
    {
      title: "Total Sign-ups",
      value: getMetricByName("Total Users").toLocaleString(),
      description: "All time registered users",
      icon: Users,
      className: "text-blue-500",
    },
    {
      title: "Intro Calls Booked",
      value: `${getMetricByName("Intro Call Rate")}%`,
      description: "Of total sign-ups",
      icon: PhoneCall,
      className: "text-green-500",
    },
    {
      title: "Profile Completion",
      value: `${getMetricByName("Profile Completion")}%`,
      description: "Users with complete profiles",
      icon: UserCheck,
      className: "text-purple-500",
    },
    {
      title: "First Lesson Started",
      value: `${getMetricByName("First Lesson")}%`,
      description: "Users who started learning",
      icon: BookOpen,
      className: "text-orange-500",
    },
  ];

  // Sample funnel data (this would come from API)
  const funnelData = [
    { stage: "Sign-ups", count: 1000 },
    { stage: "Profile Completed", count: 800 },
    { stage: "Intro Call Booked", count: 600 },
    { stage: "First Lesson Started", count: 400 },
  ];

  const funnelChartOptions = {
    chart: {
      type: 'bar' as const,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        distributed: true,
      }
    },
    colors: ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD'],
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toString() + ' users';
      }
    },
    xaxis: {
      categories: funnelData.map(d => d.stage)
    }
  };

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="p-8 space-y-8">
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

      <Card>
        <CardHeader>
          <CardTitle>User Journey Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={funnelChartOptions}
            series={[{
              name: "Users",
              data: funnelData.map(d => d.count)
            }]}
            type="bar"
            height={350}
          />
        </CardContent>
      </Card>
    </div>
  );
}
