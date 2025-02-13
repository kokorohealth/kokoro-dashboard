import { useQuery } from "@tanstack/react-query";
import { Stats } from "@/components/dashboard/stats";
import { Charts } from "@/components/dashboard/charts";
import { DataTable } from "@/components/dashboard/data-table";
import type { Metric, Sale } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useQuery<Metric[]>({
    queryKey: ["/api/metrics"],
  });

  const { data: sales, isLoading: salesLoading } = useQuery<Sale[]>({
    queryKey: ["/api/sales"],
  });

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

  console.log("metrics", metrics);
  console.log("sales", sales);
  return (
    <div className="p-8 space-y-8">
      <Stats metrics={metrics} />
      <Charts sales={sales} />
      <DataTable sales={sales} />
    </div>
  );
}
