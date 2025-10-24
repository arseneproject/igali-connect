import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactRound } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";


export default function ContactOverview() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Contact Overview</h1>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Contact Overview</h1>
              <p className="text-muted-foreground">Manage contacts system-wide</p>
            </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ContactRound className="h-5 w-5" />
            All Contacts
          </CardTitle>
          <CardDescription>
            View and manage all contacts across the organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Contact management interface coming soon
          </p>
        </CardContent>
      </Card>
    </div>
    </main>
    </SidebarInset>
  </SidebarProvider>
  );
}
