import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Phone, BarChart3, Mail } from "lucide-react";

const SalesDashboard = () => {
  const menuItems = [
    { label: "Dashboard", path: "/sales", icon: <BarChart3 className="h-4 w-4" /> },
    { label: "Leads", path: "/sales/leads", icon: <Users className="h-4 w-4" /> },
    { label: "Reports", path: "/sales/reports", icon: <TrendingUp className="h-4 w-4" /> },
    { label: "Contacts", path: "/sales/contacts", icon: <Phone className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout title="Sales Dashboard" menuItems={menuItems}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Active leads</p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Being contacted</p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Lead Pipeline</CardTitle>
          <CardDescription>
            Track and manage your leads through the sales process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">New</p>
                <p className="text-sm text-muted-foreground">0 leads</p>
              </div>
              <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">In Progress</p>
                <p className="text-sm text-muted-foreground">0 leads</p>
              </div>
              <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Closed</p>
                <p className="text-sm text-muted-foreground">0 leads</p>
              </div>
              <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-secondary" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default SalesDashboard;
