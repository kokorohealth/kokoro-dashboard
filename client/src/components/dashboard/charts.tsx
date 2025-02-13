import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "react-apexcharts";
import type { Sale } from "@shared/schema";

interface ChartsProps {
  sales: Sale[];
}

export function Charts({ sales }: ChartsProps) {
  // Prepare data for revenue timeline
  const salesData = sales.map(sale => ({
    x: new Date(sale.date).getTime(),
    y: sale.amount
  }));

  // Sample funnel data (this should come from API)
  const funnelData = [
    { label: "Registered Users", value: 1000 },
    { label: "Started Week 1", value: 750 },
    { label: "Upgraded to Paid", value: 500 },
    { label: "Completed 12 Weeks", value: 300 }
  ];

  // Sample subscription data (this should come from API)
  const subscriptionData = [
    { label: "Monthly", value: 65 },
    { label: "Yearly", value: 35 }
  ];

  const revenueChartOptions = {
    chart: {
      type: "area" as const,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    xaxis: {
      type: "datetime" as const,
      labels: {
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM \'yy',
          day: 'dd MMM',
        }
      }
    },
    stroke: {
      curve: 'smooth' as const,
      width: 2
    },
    colors: ['#2563EB'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      }
    }
  };

  const funnelChartOptions = {
    chart: {
      type: 'bar' as const,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        distributed: true
      }
    },
    colors: ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD'],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toString()
    },
    xaxis: {
      categories: funnelData.map(d => d.label)
    }
  };

  const pieChartOptions = {
    chart: {
      type: 'donut' as const,
    },
    labels: subscriptionData.map(d => d.label),
    colors: ['#2563EB', '#3B82F6'],
    legend: {
      position: 'bottom' as const
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={revenueChartOptions}
            series={[{ name: "Revenue", data: salesData }]}
            height={350}
            type="area"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={funnelChartOptions}
            series={[{
              name: "Users",
              data: funnelData.map(d => d.value)
            }]}
            height={350}
            type="bar"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={pieChartOptions}
            series={subscriptionData.map(d => d.value)}
            height={350}
            type="donut"
          />
        </CardContent>
      </Card>
    </div>
  );
}