import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function CampaignMonitoring() {
  return (
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
  );
}
