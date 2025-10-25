import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Download, 
  Calendar, 
  Mail, 
  MessageSquare, 
  Share2 
} from "lucide-react";
import { marketerMenuItems } from "./marketerMenuItems";

const Analytics = () => {
  const menuItems = marketerMenuItems;

  const performanceMetrics = [
    { 
      title: "Email Performance",
      value: "45%",
      change: "+5%",
      label: "Average Open Rate",
      icon: <Mail className="h-4 w-4" />
    },
    {
      title: "SMS Engagement",
      value: "28%",
      change: "+2%",
      label: "Response Rate",
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      title: "Social Media",
      value: "1.2K",
      change: "+12%",
      label: "Total Engagements",
      icon: <Share2 className="h-4 w-4" />
    }
  ];

  return (
    <DashboardLayout title="Analytics & Reports" menuItems={menuItems}>
      {/* Time Period Selector */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Last 30 Days
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {metric.label}
                <span className={`ml-2 ${metric.change.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.change}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>
                View metrics across all your marketing campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Open Rates Over Time</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[200px] flex items-center justify-center">
                    <LineChart className="h-8 w-8 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Chart coming soon</span>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Click-through Rates</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[200px] flex items-center justify-center">
                    <BarChart className="h-8 w-8 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Chart coming soon</span>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contact Analytics</CardTitle>
              <CardDescription>
                Understand your audience engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <PieChart className="h-8 w-8 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Contact segments visualization coming soon</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Automation Performance</CardTitle>
              <CardDescription>
                Track your automation workflow metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <BarChart className="h-8 w-8 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Automation metrics coming soon</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Analytics;
