import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Tag, Search as SearchIcon, Edit2 } from "lucide-react";
import { salesMenuItems } from "./salesMenuItems";

type Lead = {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  source?: string;
  stage?: "New" | "Contacted" | "Negotiation" | "Closed (Won)" | "Closed (Lost)";
  notes?: string[];
  followUpDue?: string | null;
};

const STAGES = ["New", "Contacted", "Negotiation", "Closed (Won)", "Closed (Lost)"] as const;

export default function Leads() {
  const menuItems = salesMenuItems;
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | "">("");
  const [source, setSource] = useState<string | "">("");
  const [editingNoteFor, setEditingNoteFor] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    let ac = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/sales/leads", { signal: ac.signal });
        if (res.ok) setLeads(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const tags = useMemo(() => {
    const s = new Set<string>();
    leads.forEach((l) => (l.tags || []).forEach((t) => s.add(t)));
    return Array.from(s);
  }, [leads]);

  const sources = useMemo(() => {
    const s = new Set<string>();
    leads.forEach((l) => l.source && s.add(l.source));
    return Array.from(s);
  }, [leads]);

  const filtered = leads.filter((l) => {
    const qq = q.trim().toLowerCase();
    if (qq) {
      if (!`${l.name} ${l.company ?? ""} ${l.email ?? ""}`.toLowerCase().includes(qq)) return false;
    }
    if (tag && !(l.tags || []).includes(tag)) return false;
    if (source && l.source !== source) return false;
    return true;
  });

  async function updateStage(id: string, stage: Lead["stage"]) {
    try {
      const res = await fetch(`/api/sales/leads/${id}/stage`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stage }) });
      if (!res.ok) throw new Error("failed");
      const updated = await res.json();
      setLeads((s) => s.map((l) => (l.id === id ? updated : l)));
    } catch (err) {
      console.error(err);
      alert("Failed to update stage");
    }
  }

  async function addNote(id: string, note: string) {
    try {
      const res = await fetch(`/api/sales/leads/${id}/notes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note }) });
      if (!res.ok) throw new Error("failed");
      const updated = await res.json();
      setLeads((s) => s.map((l) => (l.id === id ? updated : l)));
      setEditingNoteFor(null);
      setNoteText("");
    } catch (err) {
      console.error(err);
      alert("Failed to save note");
    }
  }

  async function markFollowUpDone(id: string) {
    try {
      const res = await fetch(`/api/sales/leads/${id}/followup`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "done" }) });
      if (!res.ok) throw new Error("failed");
      const updated = await res.json();
      setLeads((s) => s.map((l) => (l.id === id ? updated : l)));
    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  }

  return (
    <DashboardLayout title="Leads" menuItems={menuItems}>
      <div className="mb-4 flex gap-2 items-center">
        <div className="flex items-center gap-2">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <input className="border rounded px-2 py-1" placeholder="Search name, company, email..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="border rounded px-2 py-1" value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="">All tags</option>
          {tags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="border rounded px-2 py-1" value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">All sources</option>
          {sources.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead List</CardTitle>
          <CardDescription>Assigned to you</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-muted-foreground">Loading...</p> : filtered.length === 0 ? <p className="text-muted-foreground">No leads.</p> : (
            <ul className="space-y-3">
              {filtered.map((l) => (
                <li key={l.id} className="p-3 border rounded flex items-start justify-between">
                  <div>
                    <div className="font-medium">{l.name} <span className="text-xs text-muted-foreground">{l.company}</span></div>
                    <div className="text-xs text-muted-foreground">{l.email} · {l.phone}</div>
                    <div className="mt-2 text-xs">{(l.tags || []).map(t => <span key={t} className="mr-1 px-1 py-0.5 bg-gray-100 rounded">{t}</span>)}</div>
                    <div className="mt-2 text-xs">
                      <strong>Stage:</strong>
                      <select value={l.stage} onChange={(e) => updateStage(l.id, e.target.value as Lead["stage"])} className="ml-2 border rounded px-2 py-0.5">
                        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="mt-2 text-xs">
                      <strong>Notes:</strong>
                      <ul className="mt-1">
                        {(l.notes || []).map((n, i) => <li key={i} className="text-xs text-muted-foreground">- {n}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => { setEditingNoteFor(l.id); setNoteText(""); }} title="Add note" className="p-1"><Edit2 /></button>
                    <Button variant="outline" size="sm" onClick={() => markFollowUpDone(l.id)}>Mark follow-up done</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {editingNoteFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-4 rounded w-[480px]">
            <h3 className="font-medium mb-2">Add Note</h3>
            <textarea className="w-full border rounded px-2 py-1" rows={4} value={noteText} onChange={(e) => setNoteText(e.target.value)} />
            <div className="mt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingNoteFor(null)}>Cancel</Button>
              <Button onClick={() => addNote(editingNoteFor, noteText)}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
