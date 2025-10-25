import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { salesMenuItems } from "./salesMenuItems";

type Note = { id: string; message: string; createdAt: string; read?: boolean };

export default function SalesNotifications() {
  const menuItems = salesMenuItems;
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/sales/notifications");
        if (res.ok) setNotes(await res.json());
      } catch (err) { console.error(err); } finally { setLoading(false); }
    })();
  }, []);

  async function toggleRead(id: string, read: boolean) {
    try {
      const res = await fetch(`/api/sales/notifications/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read }) });
      if (!res.ok) throw new Error("fail");
      const upd = await res.json();
      setNotes((s) => s.map(n => n.id === id ? upd : n));
    } catch (err) { console.error(err); }
  }

  async function clearOld() {
    if (!confirm("Clear old notifications?")) return;
    try {
      const res = await fetch(`/api/sales/notifications/clear`, { method: "POST" });
      if (!res.ok) throw new Error("fail");
      setNotes([]);
    } catch (err) { console.error(err); alert("Failed"); }
  }

  return (
    <DashboardLayout title="Notifications" menuItems={menuItems}>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>System and automation alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-2">
            <Button variant="outline" onClick={clearOld}>Clear old</Button>
          </div>
          {loading ? <p className="text-muted-foreground">Loading...</p> : notes.length === 0 ? <p className="text-muted-foreground">No notifications</p> : (
            <ul className="space-y-2">
              {notes.map(n => (
                <li key={n.id} className={`p-2 border rounded ${n.read ? "opacity-70" : ""}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm">{n.message}</div>
                      <div className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" onClick={() => toggleRead(n.id, !n.read)}>{n.read ? "Mark unread" : "Mark read"}</Button>
                    </div>
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
