import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { salesMenuItems } from "./salesMenuItems";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const menuItems = salesMenuItems;
  return (
    <DashboardLayout title="Profile" menuItems={menuItems}>
      <Card>
        <CardHeader><CardTitle>Your Profile</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Manage your name, email, notification preferences and integrations.</p>
          <div className="mt-4">
            <Button onClick={() => alert("Profile editing not implemented yet")}>Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
