import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

export default function AutomationManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Automation Management</h1>
        <p className="text-muted-foreground">Manage and audit all marketing automations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Active Automations
          </CardTitle>
          <CardDescription>
            View, manage, and audit all automated workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Automation management interface coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
