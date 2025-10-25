import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, Mail, MessageSquare, Share2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { marketerMenuItems } from "./marketerMenuItems";

const Integrations = () => {
  const menuItems = marketerMenuItems;

  const integrations = [
    {
      id: "emailjs",
      name: "EmailJS",
      description: "Send emails through EmailJS API",
      icon: <Mail className="h-8 w-8" />,
      connected: true
    },
    {
      id: "callmebot",
      name: "CallMeBot",
      description: "Send WhatsApp messages",
      icon: <MessageSquare className="h-8 w-8" />,
      connected: false
    },
    {
      id: "buffer",
      name: "Buffer",
      description: "Schedule social media posts",
      icon: <Share2 className="h-8 w-8" />,
      connected: false
    }
  ];

  return (
    <DashboardLayout title="Integrations" menuItems={menuItems}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                {integration.icon}
                <Badge variant={integration.connected ? "default" : "outline"}>
                  {integration.connected ? "Connected" : "Not Connected"}
                </Badge>
              </div>
              <CardTitle className="mt-4">{integration.name}</CardTitle>
              <CardDescription>{integration.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant={integration.connected ? "destructive" : "default"}
                className="w-full"
              >
                {integration.connected ? "Disconnect" : "Connect"}
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Add New Integration Card */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Add Integration</CardTitle>
            <CardDescription>Connect a new service</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full h-24">
              <Plus className="h-8 w-8" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Integrations;
