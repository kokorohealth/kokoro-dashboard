import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageCircle, Clock, Percent } from "lucide-react";
import Chart from "react-apexcharts";
import { cn } from "@/lib/utils";
import type { Session, User } from "@shared/schema";

interface KPIStat {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  className: string;
}

export default function LiveSessions() {
  const { data: sessions, isLoading: sessionsLoading } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Calculate session metrics
  const activeUsers = users?.filter(u => u.lastActive) || [];
  const latestSession = sessions?.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  
  const participationRate = activeUsers.length ? 
    Math.round((latestSession?.attendeeCount || 0) / activeUsers.length * 100) : 0;

  // Average duration in minutes
  const avgDuration = sessions?.reduce((sum, session) => sum + session.duration, 0) || 0;
  const avgSessionLength = sessions?.length ? Math.round(avgDuration / sessions.length) : 0;

  const kpiStats: KPIStat[] = [
    {
      title: "Latest Attendance",
      value: latestSession?.attendeeCount.toString() || "0",
      description: "Participants in last session",
      icon: Users,
      className: "text-blue-500",
    },
    {
      title: "Participation Rate",
      value: `${participationRate}%`,
      description: "Of active users attended",
      icon: Percent,
      className: "text-green-500",
    },
    {
      title: "Avg Session Length",
      value: `${avgSessionLength} min`,
      description: "Average duration",
      icon: Clock,
      className: "text-purple-500",
    },
    {
      title: "Engagement Score",
      value: "85%",
      description: "Based on interaction",
      icon: MessageCircle,
      className: "text-orange-500",
    },
  ];

  const attendanceChartOptions = {
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
    tooltip: {
      y: {
        formatter: (value: number) => `${value} attendees`
      }
    }
  };

  const userBaseChartOptions = {
    chart: {
      type: 'donut' as const,
    },
    labels: ['Attended', 'Did Not Attend'],
    colors: ['#2563EB', '#94A3B8'],
    legend: {
      position: 'bottom' as const
    }
  };

  if (sessionsLoading || usersLoading) {
    return <div>Loading session data...</div>;
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

      {/* Weekly Session Attendance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Session Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={attendanceChartOptions}
            series={[{
              name: "Attendance",
              data: sessions?.map(session => ({
                x: new Date(session.date).getTime(),
                y: session.attendeeCount
              })) || []
            }]}
            height={350}
            type="line"
          />
        </CardContent>
      </Card>

      {/* Attendance vs User Base */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance vs User Base</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={userBaseChartOptions}
              series={[
                latestSession?.attendeeCount || 0,
                (activeUsers.length || 0) - (latestSession?.attendeeCount || 0)
              ]}
              type="donut"
              height={350}
            />
          </CardContent>
        </Card>

        {/* Session Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Attendees</th>
                    <th className="px-4 py-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions?.slice(0, 5).map((session) => (
                    <tr key={session.id} className="border-b">
                      <td className="px-4 py-2">
                        {new Date(session.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">{session.name}</td>
                      <td className="px-4 py-2">{session.attendeeCount}</td>
                      <td className="px-4 py-2">{session.duration} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
