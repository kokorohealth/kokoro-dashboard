import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Video, FileText, PenTool } from "lucide-react";
import Chart from "react-apexcharts";
import { cn } from "@/lib/utils";
import type { LessonCompletion, ContentInteraction, Lesson } from "@shared/schema";

interface KPIStat {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  className: string;
}

export default function Engagement() {
  const { data: completions, isLoading: completionsLoading } = useQuery<LessonCompletion[]>({
    queryKey: ["/api/lesson-completions"],
  });

  const { data: interactions, isLoading: interactionsLoading } = useQuery<ContentInteraction[]>({
    queryKey: ["/api/content-interactions"],
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"],
  });

  // Calculate week 1 completion stats
  const week1Total = completions?.filter(c => c.weekNumber === 1).length || 0;
  const totalUsers = [...new Set(completions?.map(c => c.userId) || [])].length;
  const week1Percentage = totalUsers ? Math.round((week1Total / totalUsers) * 100) : 0;

  // Calculate content type engagement
  const contentTypeCount = {
    video: interactions?.filter(i => i.contentType === 'video').length || 0,
    pdf: interactions?.filter(i => i.contentType === 'pdf').length || 0,
    journal: interactions?.filter(i => i.contentType === 'journal').length || 0,
  };

  const kpiStats: KPIStat[] = [
    {
      title: "Week 1 Completion",
      value: `${week1Percentage}%`,
      description: `${week1Total} users completed`,
      icon: BookOpen,
      className: "text-blue-500",
    },
    {
      title: "Video Views",
      value: contentTypeCount.video.toString(),
      description: "Total video interactions",
      icon: Video,
      className: "text-green-500",
    },
    {
      title: "PDF Downloads",
      value: contentTypeCount.pdf.toString(),
      description: "Total PDF interactions",
      icon: FileText,
      className: "text-purple-500",
    },
    {
      title: "Journal Entries",
      value: contentTypeCount.journal.toString(),
      description: "Total journal entries",
      icon: PenTool,
      className: "text-orange-500",
    },
  ];

  // Prepare weekly completion data
  const weeklyCompletions = Array.from({ length: 12 }, (_, i) => {
    const weekNum = i + 1;
    return completions?.filter(c => c.weekNumber === weekNum).length || 0;
  });

  const weeklyCompletionOptions = {
    chart: {
      type: 'bar' as const,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
      }
    },
    colors: ['#2563EB'],
    xaxis: {
      categories: Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`),
    }
  };

  // Content type engagement chart
  const contentTypeOptions = {
    chart: {
      type: 'donut' as const,
    },
    labels: ['Videos', 'PDFs', 'Journals'],
    colors: ['#2563EB', '#3B82F6', '#60A5FA'],
  };

  const isLoading = completionsLoading || interactionsLoading || lessonsLoading;

  if (isLoading) {
    return <div>Loading engagement data...</div>;
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

      {/* Weekly Completions Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Week-by-Week Completion Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={weeklyCompletionOptions}
            series={[{
              name: "Completions",
              data: weeklyCompletions
            }]}
            type="bar"
            height={350}
          />
        </CardContent>
      </Card>

      {/* Content Type Engagement */}
      <Card>
        <CardHeader>
          <CardTitle>Content Type Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={contentTypeOptions}
            series={[
              contentTypeCount.video,
              contentTypeCount.pdf,
              contentTypeCount.journal
            ]}
            type="donut"
            height={350}
          />
        </CardContent>
      </Card>

      {/* Interactive Lessons Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lesson Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2">Lesson</th>
                  <th className="px-4 py-2">Week</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Completions</th>
                  <th className="px-4 py-2">Avg. Rating</th>
                  <th className="px-4 py-2">Avg. Time</th>
                </tr>
              </thead>
              <tbody>
                {lessons?.map((lesson) => (
                  <tr key={lesson.id} className="border-b">
                    <td className="px-4 py-2">{lesson.title}</td>
                    <td className="px-4 py-2">{lesson.weekNumber}</td>
                    <td className="px-4 py-2 capitalize">{lesson.type}</td>
                    <td className="px-4 py-2">{lesson.totalCompletions}</td>
                    <td className="px-4 py-2">{lesson.averageRating}/5</td>
                    <td className="px-4 py-2">{Math.round(lesson.averageTimeSpent / 60)} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
