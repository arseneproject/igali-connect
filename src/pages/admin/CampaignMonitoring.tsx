import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function CampaignMonitoring() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Campaign Monitoring</h1>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
         
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Campaign Monitoring</h1>
        <p className="text-muted-foreground">View and monitor all marketer campaigns</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            All Campaigns Overview
          </CardTitle>
          <CardDescription>
            Monitor performance metrics across all marketing campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Campaign monitoring interface coming soon
          </p>
        </CardContent>
      </Card>
    </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
