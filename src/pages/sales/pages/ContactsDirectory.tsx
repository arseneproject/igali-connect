import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";
import { salesMenuItems } from "./salesMenuItems";

type Contact = { id: string; name: string; company?: string; email?: string; phone?: string; tags?: string[]; privateNotes?: string[] };

export default function ContactsDirectory() {
  const menuItems = salesMenuItems;
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFor, setEditingFor] = useState<string | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/sales/contacts");
        if (res.ok) setContacts(await res.json());
      } catch (err) { console.error(err); } finally { setLoading(false); }
    })();
  }, []);

  async function addPrivateNote(id: string, text: string) {
    try {
      const res = await fetch(`/api/sales/contacts/${id}/private-notes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      if (!res.ok) throw new Error("fail");
      const updated = await res.json();
      setContacts((s) => s.map(c => c.id === id ? updated : c));
      setEditingFor(null);
      setNote("");
    } catch (err) { console.error(err); alert("Failed"); }
  }

  return (
    <DashboardLayout title="Contacts Directory" menuItems={menuItems}>
      <Card>
        <CardHeader><CardTitle>Contacts</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-muted-foreground">Loading...</p> : contacts.length === 0 ? <p className="text-muted-foreground">No contacts</p> : (
            <ul className="space-y-2">
              {contacts.map(c => (
                <li key={c.id} className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">{c.name} <span className="text-xs text-muted-foreground">{c.company}</span></div>
                    <div className="text-xs text-muted-foreground">{c.email} · {c.phone}</div>
                    <div className="text-xs mt-1">{(c.tags || []).map(t => <span key={t} className="mr-1 px-1 bg-gray-100 rounded">{t}</span>)}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => { setEditingFor(c.id); setNote(""); }}>Add private note</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {editingFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-4 rounded w-[480px]">
            <h3 className="font-medium mb-2">Add private note</h3>
            <textarea className="w-full border rounded px-2 py-1" rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
            <div className="mt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingFor(null)}>Cancel</Button>
              <Button onClick={() => addPrivateNote(editingFor, note)}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
