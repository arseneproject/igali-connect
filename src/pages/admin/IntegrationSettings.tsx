import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function IntegrationSettings() {
  return (
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
  );
}
