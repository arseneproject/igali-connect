import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { marketerMenuItems } from "./marketerMenuItems";
import { useEffect, useState } from "react";

const ContactSegments = () => {
  const [segments, setSegments] = useState<string[]>([]);
  useEffect(() => {
    // lightweight: derive segments from backend or compute client-side
    (async () => {
      try {
        const res = await fetch("/api/contacts/segments");
        if (!res.ok) return;
        const data = await res.json();
        setSegments(data || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);
  return (
    <DashboardLayout title="Contact Segments" menuItems={marketerMenuItems}>
      <Card>
        <CardHeader>
          <CardTitle>Segments</CardTitle>
        </CardHeader>
        <CardContent>
          {segments.length === 0 ? <p className="text-muted-foreground">No segments yet.</p> : (
            <ul className="space-y-2">
              {segments.map((s) => <li key={s} className="p-2 border rounded">{s}</li>)}
            </ul>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ContactSegments;
