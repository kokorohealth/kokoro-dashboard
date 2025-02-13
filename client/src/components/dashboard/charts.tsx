import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "react-apexcharts";
import type { Sale } from "@shared/schema";

interface ChartsProps {
  sales: Sale[];
}

export function Charts({ sales }: ChartsProps) {
  const salesData = sales.map(sale => ({
    x: new Date(sale.date).getTime(),
    y: sale.amount
  }));

  const lineChartOptions = {
    chart: {
      type: "line" as const,
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
  };

  const barChartOptions = {
    ...lineChartOptions,
    chart: {
      type: "bar" as const,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
      }
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={lineChartOptions}
            series={[{ name: "Sales", data: salesData }]}
            height={350}
            type="line"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Revenue Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={barChartOptions}
            series={[{ name: "Revenue", data: salesData }]}
            height={350}
            type="bar"
          />
        </CardContent>
      </Card>
    </div>
  );
}
