import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { marketerMenuItems } from "./marketerMenuItems";
import { useNavigate } from "react-router-dom";

const ImportContacts = () => {
  const navigate = useNavigate();
  return (
    <DashboardLayout title="Import Contacts" menuItems={marketerMenuItems}>
      <Card>
        <CardHeader>
          <CardTitle>Import Contacts (CSV)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Upload a CSV with columns like firstName,lastName,email,phone,tags,source,notes</p>
          <input type="file" accept=".csv,text/csv" />
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate(-1)}><Upload className="mr-2" />Back</Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ImportContacts;
