import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Share2, Users, BarChart3, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MarketerDashboard = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    { label: "Dashboard", path: "/marketer", icon: <BarChart3 className="h-4 w-4" /> },
    { label: "Campaigns", path: "/marketer/campaigns", icon: <Mail className="h-4 w-4" /> },
    { label: "Contacts", path: "/marketer/contacts", icon: <Users className="h-4 w-4" /> },
    { label: "Analytics", path: "/marketer/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout title="Marketer Dashboard" menuItems={menuItems}>
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Active campaigns</p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Campaigns</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Active campaigns</p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social Posts</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Scheduled posts</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Campaign</CardTitle>
          <CardDescription>
            Choose a campaign type to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Button 
              className="h-24 flex flex-col gap-2" 
              variant="outline"
              onClick={() => navigate('/marketer/campaigns')}
            >
              <Mail className="h-8 w-8" />
              <span>Email Campaign</span>
            </Button>
            <Button 
              className="h-24 flex flex-col gap-2" 
              variant="outline"
              onClick={() => navigate('/marketer/campaigns')}
            >
              <MessageSquare className="h-8 w-8" />
              <span>SMS Campaign</span>
            </Button>
            <Button 
              className="h-24 flex flex-col gap-2" 
              variant="outline"
              onClick={() => navigate('/marketer/campaigns')}
            >
              <Share2 className="h-8 w-8" />
              <span>Social Media Post</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest campaigns and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No recent activity. Create your first campaign to get started!
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default MarketerDashboard;
