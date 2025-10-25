import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck } from "lucide-react";
import { salesMenuItems } from "./salesMenuItems";

type FollowUp = { id: string; leadId: string; leadName: string; dueAt: string; reason?: string; completed?: boolean };

export default function FollowUps() {
  const menuItems = salesMenuItems;
  const [items, setItems] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/sales/follow-ups?due=today");
        if (res.ok) setItems(await res.json());
      } catch (err) { console.error(err); } finally { setLoading(false); }
    })();
  }, []);

  async function markDone(id: string) {
    try {
      const res = await fetch(`/api/sales/follow-ups/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ completed: true }) });
      if (!res.ok) throw new Error("fail");
      const upd = await res.json();
      setItems((s) => s.map(i => i.id === id ? upd : i));
    } catch (err) { console.error(err); alert("Failed"); }
  }

  async function reschedule(id: string, when: string) {
    try {
      const res = await fetch(`/api/sales/follow-ups/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dueAt: when }) });
      if (!res.ok) throw new Error("fail");
      const upd = await res.json();
      setItems((s) => s.map(i => i.id === id ? upd : i));
    } catch (err) { console.error(err); alert("Failed"); }
  }

  return (
    <DashboardLayout title="Follow-ups" menuItems={menuItems}>
      <Card>
        <CardHeader>
          <CardTitle>Follow-ups due today</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-muted-foreground">Loading...</p> : items.length === 0 ? <p className="text-muted-foreground">No follow-ups for today.</p> : (
            <ul className="space-y-2">
              {items.map(i => (
                <li key={i.id} className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">{i.leadName}</div>
                    <div className="text-xs text-muted-foreground">{i.reason} · {new Date(i.dueAt).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => markDone(i.id)}>Mark completed</Button>
                    <Button variant="outline" onClick={() => {
                      const when = prompt("Reschedule (ISO datetime)", new Date(Date.now() + 86400000).toISOString().slice(0,16));
                      if (when) reschedule(i.id, when);
                    }}>Reschedule</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
