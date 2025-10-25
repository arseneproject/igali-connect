import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { salesMenuItems } from "./salesMenuItems";

export default function Help() {
  const menuItems = salesMenuItems;
  return (
    <DashboardLayout title="Help" menuItems={menuItems}>
      <Card>
        <CardHeader><CardTitle>Help & Documentation</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Links to docs, FAQ, and support contact.</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
