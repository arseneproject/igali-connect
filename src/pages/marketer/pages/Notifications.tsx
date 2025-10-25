import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Mail, MessageSquare, Share2, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { marketerMenuItems } from "./marketerMenuItems";

const Notifications = () => {
  const menuItems = marketerMenuItems;

  const mockNotifications = [
    {
      id: 1,
      type: "campaign",
      icon: <Mail className="h-4 w-4" />,
      title: "Campaign Complete",
      message: "Your email campaign 'Welcome Series' has finished sending",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      type: "automation",
      icon: <MessageSquare className="h-4 w-4" />,
      title: "Automation Triggered",
      message: "New contact added to welcome sequence",
      time: "5 hours ago",
      read: true
    }
  ];

  return (
    <DashboardLayout title="Notifications" menuItems={menuItems}>
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" size="sm">
          <Check className="h-4 w-4 mr-2" />
          Mark All as Read
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-4 p-4 rounded-lg border ${
                notification.read ? 'bg-background' : 'bg-muted'
              }`}
            >
              <div className="shrink-0">{notification.icon}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{notification.title}</p>
                  <Badge variant="outline">{notification.time}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.message}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Notifications;
