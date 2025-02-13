import { LucideIcon, Home, BarChart2, Users, Settings, BookOpen, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

const items: SidebarItem[] = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: BarChart2, label: "Analytics", href: "/analytics" },
  { icon: BookOpen, label: "Engagement", href: "/engagement" },
  { icon: Activity, label: "Health", href: "/health" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="pb-12 min-h-screen bg-sidebar">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold text-sidebar-foreground">
            Admin Dashboard
          </h2>
          <div className="space-y-1">
            {items.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent",
                    location === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}