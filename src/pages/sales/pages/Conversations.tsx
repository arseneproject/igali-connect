import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, Smartphone } from "lucide-react";
import { salesMenuItems } from "./salesMenuItems";

type Msg = { id: string; type: "email" | "sms" | "whatsapp"; text: string; sentAt: string; status?: "sent" | "delivered" | "read" | "failed" };
type Thread = { id: string; contactName: string; lastMessage: string; lastAt: string; unread?: boolean };

export default function Conversations() {
  const menuItems = salesMenuItems;
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selected, setSelected] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [filterType, setFilterType] = useState<"" | "email" | "sms" | "whatsapp">("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/sales/conversations");
        if (res.ok) setThreads(await res.json());
      } catch (err) { console.error(err); }
    })();
  }, []);

  async function openThread(t: Thread) {
    setSelected(t);
    try {
      const res = await fetch(`/api/sales/conversations/${t.id}`);
      if (res.ok) setMessages(await res.json());
    } catch (err) { console.error(err); }
  }

  async function sendQuickReply(type: Msg["type"], text: string) {
    if (!selected) return;
    try {
      const res = await fetch(`/api/sales/conversations/${selected.id}/send`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, text }) });
      if (!res.ok) throw new Error("send failed");
      const m = await res.json();
      setMessages((s) => [...s, m]);
    } catch (err) { console.error(err); alert("Send failed"); }
  }

  const visibleThreads = threads.filter((t) => !filterType || t.lastMessage.toLowerCase().includes(filterType));

  return (
    <DashboardLayout title="Conversations" menuItems={menuItems}>
      <div className="mb-4 flex items-center gap-2">
        <select className="border rounded px-2 py-1" value={filterType} onChange={(e) => setFilterType(e.target.value as any)}>
          <option value="">All</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Threads</CardTitle>
            <CardDescription>Recent conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {visibleThreads.map((t) => (
                <li key={t.id} className="p-2 border rounded cursor-pointer" onClick={() => openThread(t)}>
                  <div className="font-medium">{t.contactName}</div>
                  <div className="text-xs text-muted-foreground">{t.lastMessage} · {new Date(t.lastAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{selected ? selected.contactName : "Select a conversation"}</CardTitle>
            <CardDescription>{selected ? `Last: ${selected.lastAt}` : "Pick a thread to view messages"}</CardDescription>
          </CardHeader>
          <CardContent>
            {!selected ? <p className="text-muted-foreground">No thread selected.</p> : (
              <>
                <div className="space-y-2 mb-4 max-h-[40vh] overflow-auto">
                  {messages.map((m) => (
                    <div key={m.id} className="p-2 border rounded">
                      <div className="text-xs text-muted-foreground">{m.type.toUpperCase()} · {new Date(m.sentAt).toLocaleString()}</div>
                      <div className="mt-1">{m.text}</div>
                      <div className="text-xs text-muted-foreground mt-1">Status: {m.status}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input id="quick-reply" className="flex-1 border rounded px-2 py-1" placeholder="Quick reply..." />
                  <Button onClick={() => {
                    const el = document.getElementById("quick-reply") as HTMLInputElement | null;
                    if (!el || !el.value.trim()) return;
                    sendQuickReply("email", el.value.trim());
                    el.value = "";
                  }}>Send Email</Button>
                  <Button onClick={() => {
                    const el = document.getElementById("quick-reply") as HTMLInputElement | null;
                    if (!el || !el.value.trim()) return;
                    sendQuickReply("sms", el.value.trim());
                    el.value = "";
                  }}>Send SMS</Button>
                  <Button onClick={() => {
                    const el = document.getElementById("quick-reply") as HTMLInputElement | null;
                    if (!el || !el.value.trim()) return;
                    sendQuickReply("whatsapp", el.value.trim());
                    el.value = "";
                  }}>WhatsApp</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
