import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Analytics from "@/pages/analytics";
import Engagement from "@/pages/engagement";
import HealthTracking from "@/pages/health";
import SubscriptionRetention from "@/pages/subscription";
import CohortAnalysis from "@/pages/cohort";
import LiveSessions from "@/pages/sessions";
import { Sidebar } from "@/components/layout/sidebar";

function Router() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/engagement" component={Engagement} />
          <Route path="/sessions" component={LiveSessions} />
          <Route path="/health" component={HealthTracking} />
          <Route path="/subscription" component={SubscriptionRetention} />
          <Route path="/cohort" component={CohortAnalysis} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
