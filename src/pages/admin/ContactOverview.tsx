import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactRound } from "lucide-react";

export default function ContactOverview() {
  return (
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
  );
}
