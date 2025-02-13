import { useQuery } from "@tanstack/react-query";
import { Stats } from "@/components/dashboard/stats";
import { Charts } from "@/components/dashboard/charts";
import { DataTable } from "@/components/dashboard/data-table";
import type { Metric, Sale } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Chart from "react-apexcharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useQuery<Metric[]>({
    queryKey: ["/api/metrics"],
  });

  const { data: sales, isLoading: salesLoading } = useQuery<Sale[]>({
    queryKey: ["/api/sales"],
  });

  // Sample data for User Journey Analysis (replace with actual data fetching if needed)
  const signupTrend = [
    { date: new Date("2024-03-01"), count: 10 },
    { date: new Date("2024-03-08"), count: 15 },
    { date: new Date("2024-03-15"), count: 22 },
    { date: new Date("2024-03-22"), count: 25 },
  ];

  const journeyMetrics = [
    { stage: "Account Creation", completion: 95, avgTime: "2 mins" },
    { stage: "Profile Setup", completion: 80, avgTime: "5 mins" },
    { stage: "First Purchase", completion: 70, avgTime: "10 mins" },
  ];


  if (metricsLoading || salesLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!metrics || !sales) {
    return <div>Error loading dashboard data</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <Stats metrics={metrics} />
      <Charts sales={sales} />

      <Card>
        <CardHeader>
          <CardTitle>User Journey Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Sign-up Trends</h3>
              <Chart
                options={{
                  chart: {
                    type: "area",
                    toolbar: { show: false },
                    zoom: { enabled: false },
                  },
                  xaxis: {
                    type: "datetime",
                    categories: signupTrend.map((d) => d.date.getTime()),
                  },
                  stroke: { curve: "smooth", width: 2 },
                  fill: {
                    type: "gradient",
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.7,
                      opacityTo: 0.3,
                    },
                  },
                }}
                series={[
                  {
                    name: "Sign-ups",
                    data: signupTrend.map((d) => d.count),
                  },
                ]}
                type="area"
                height={300}
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Journey Stage</TableHead>
                  <TableHead>Completion Rate</TableHead>
                  <TableHead>Avg. Time Spent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {journeyMetrics.map((metric, i) => (
                  <TableRow key={i}>
                    <TableCell>{metric.stage}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${metric.completion}%` }}
                          />
                        </div>
                        <span className="text-sm">{metric.completion}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{metric.avgTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <DataTable sales={sales} />
    </div>
  );
}