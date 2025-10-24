import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function IntegrationSettings() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Integration Settings</h1>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integration Settings</h1>
        <p className="text-muted-foreground">Manage API keys for free tools</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            API Integrations
          </CardTitle>
          <CardDescription>
            Configure and manage third-party integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Integration settings interface coming soon
          </p>
        </CardContent>
      </Card>
    </div>
    </main>
    </SidebarInset>
  </SidebarProvider>
  );
}
