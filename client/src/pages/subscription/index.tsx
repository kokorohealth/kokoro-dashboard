import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, DollarSign, UserCheck, LineChart } from "lucide-react";
import Chart from "react-apexcharts";
import { cn } from "@/lib/utils";
import type { User } from "@shared/schema";

interface KPIStat {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  className: string;
}

export default function SubscriptionRetention() {
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Calculate conversion rates and metrics
  const totalUsers = users?.length || 0;
  const paidUsers = users?.filter(u => u.onboardingCompleted).length || 0;
  const conversionRate = totalUsers ? Math.round((paidUsers / totalUsers) * 100) : 0;

  const kpiStats: KPIStat[] = [
    {
      title: "Free-to-Paid Conversion",
      value: `${conversionRate}%`,
      description: "Trial to paid conversion rate",
      icon: DollarSign,
      className: "text-green-500",
    },
    {
      title: "Monthly Subscribers",
      value: "300",
      description: "Active monthly plans",
      icon: UserCheck,
      className: "text-blue-500",
    },
    {
      title: "Yearly Subscribers",
      value: "100",
      description: "Active yearly plans",
      icon: Activity,
      className: "text-purple-500",
    },
    {
      title: "Dietitian Plans",
      value: "50",
      description: "One-to-one dietitian plans",
      icon: UserCheck,
      className: "text-emerald-500",
    },
    {
      title: "Churn Rate",
      value: "5.2%",
      description: "Monthly churn rate",
      icon: LineChart,
      className: "text-orange-500",
    },
  ];

  const retentionChartOptions = {
    chart: {
      type: 'line' as const,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    xaxis: {
      categories: ['1 Month', '3 Months', '6 Months', '12 Months'],
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    stroke: {
      curve: 'smooth' as const,
      width: 2
    },
    colors: ['#2563EB'],
    tooltip: {
      y: {
        formatter: (value: number) => `${value}%`
      }
    }
  };

  const subscriptionChartOptions = {
    chart: {
      type: 'donut' as const,
    },
    labels: ['Monthly Plan', 'Yearly Plan', 'Dietitian Plan', 'Free Trial'],
    colors: ['#3B82F6', '#8B5CF6', '#10B981', '#64748B'],
    legend: {
      position: 'bottom' as const
    }
  };

  const cancellationChartOptions = {
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
        return val.toString() + '%';
      }
    },
    xaxis: {
      categories: [
        'Achieved Goals',
        'Cost',
        'Content Not Engaging',
        'Other'
      ]
    }
  };

  if (usersLoading) {
    return <div>Loading subscription data...</div>;
  }

  return (
    <div className="p-8 space-y-8">
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

      {/* Retention Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Retention Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={retentionChartOptions}
            series={[{
              name: "Retention Rate",
              data: [65, 45, 35, 25]  // Sample retention percentages
            }]}
            type="line"
            height={350}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Subscription Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={subscriptionChartOptions}
              series={[300, 100, 50, 600]}  // Monthly, Yearly, Dietitian, Free Trial
              type="donut"
              height={350}
            />
          </CardContent>
        </Card>

        {/* Cancellation Reasons */}
        <Card>
          <CardHeader>
            <CardTitle>Cancellation Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={cancellationChartOptions}
              series={[{
                name: "Percentage",
                data: [35, 25, 20, 20]
              }]}
              type="bar"
              height={350}
            />
          </CardContent>
        </Card>
      </div>

      {/* Introduction Call Conversion */}
      <Card>
        <CardHeader>
          <CardTitle>Introduction Call Conversions</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={{
              chart: {
                type: 'bar' as const,
                toolbar: { show: false }
              },
              plotOptions: {
                bar: {
                  borderRadius: 4,
                  horizontal: false,
                  columnWidth: '60%',
                }
              },
              colors: ['#3B82F6', '#8B5CF6', '#10B981'],
              xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
              },
              legend: {
                position: 'top' as const
              },
              dataLabels: {
                enabled: true,
                formatter: function (val: number) {
                  return val + '%';
                }
              }
            }}
            series={[
              {
                name: 'Monthly Plan',
                data: [45, 52, 38, 54, 48, 58]  // Sample conversion rates
              },
              {
                name: 'Yearly Plan',
                data: [25, 28, 32, 34, 36, 42]
              },
              {
                name: 'Dietitian Plan',
                data: [15, 18, 22, 25, 28, 32]
              }
            ]}
            type="bar"
            height={350}
          />
        </CardContent>
      </Card>
    </div>
  );
}