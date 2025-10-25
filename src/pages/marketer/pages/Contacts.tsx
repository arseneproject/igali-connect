import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Upload, Tag, Edit2, Trash2, Eye, Plus, X } from "lucide-react";
import { marketerMenuItems } from "./marketerMenuItems";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Contact = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  source?: string;
  notes?: string;
  companyId?: string;
};

const Contacts = () => {
  const menuItems = marketerMenuItems;
  const navigate = useNavigate();

  // state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  // modals/drawers
  const [showImport, setShowImport] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [contactDetail, setContactDetail] = useState<any | null>(null);

  // load contacts (expects backend to return contacts for marketer's company)
  useEffect(() => {
    let ac = new AbortController();
    async function load() {
      setLoading(true);
      try {
        // If you have marketer profile endpoint to get companyId, replace accordingly.
        const res = await fetch("/api/contacts", { signal: ac.signal });
        if (!res.ok) throw new Error("Failed to load contacts");
        const data = await res.json();
        setContacts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => ac.abort();
  }, []);

  // tags / sources for filters
  const tags = useMemo(() => {
    const s = new Set<string>();
    contacts.forEach((c) => (c.tags || []).forEach((t) => s.add(t)));
    return Array.from(s);
  }, [contacts]);

  const sources = useMemo(() => {
    const s = new Set<string>();
    contacts.forEach((c) => c.source && s.add(c.source));
    return Array.from(s);
  }, [contacts]);

  // filtered list
  const filtered = contacts.filter((c) => {
    const q = search.trim().toLowerCase();
    if (q) {
      const hay = `${c.firstName ?? ""} ${c.lastName ?? ""} ${c.email ?? ""} ${c.phone ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (selectedTag && !(c.tags || []).includes(selectedTag)) return false;
    if (selectedSource && c.source !== selectedSource) return false;
    return true;
  });

  // CSV parse (simple)
  async function handleCSVFile(file: File) {
    const txt = await file.text();
    const lines = txt.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return;
    const headers = lines[0].split(",").map((h) => h.trim());
    const items: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(",");
      const obj: any = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = (row[j] || "").trim();
      }
      items.push(obj);
    }

    // POST to import endpoint (adjust path if needed)
    try {
      const res = await fetch("/api/contacts/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contacts: items }),
      });
      if (!res.ok) throw new Error("Import failed");
      const imported = await res.json();
      // merge into current list (backend should return created contacts)
      setContacts((prev) => [...imported, ...prev]);
      setShowImport(false);
    } catch (err) {
      console.error(err);
      alert("Import failed");
    }
  }

  // manual add/edit submit
  async function submitContact(payload: Partial<Contact>) {
    try {
      if (editing) {
        const res = await fetch(`/api/contacts/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Update failed");
        const updated = await res.json();
        setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const res = await fetch(`/api/contacts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Create failed");
        const created = await res.json();
        setContacts((prev) => [created, ...prev]);
      }
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  }

  // delete
  async function handleDelete(id: string) {
    if (!confirm("Delete contact?")) return;
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  // open details
  useEffect(() => {
    if (!detailId) {
      setContactDetail(null);
      return;
    }
    let ac = new AbortController();
    (async () => {
      try {
        const res = await fetch(`/api/contacts/${detailId}/details`, { signal: ac.signal });
        if (!res.ok) throw new Error("Detail fetch failed");
        const d = await res.json();
        setContactDetail(d);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => ac.abort();
  }, [detailId]);

  // small contact form component (inline)
  function ContactForm() {
    const [state, setState] = useState<Partial<Contact>>(editing ?? {});
    return (
      <div className="p-4 bg-white rounded shadow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">{editing ? "Edit Contact" : "Add Contact"}</h3>
          <button onClick={() => { setShowForm(false); setEditing(null); }}><X /></button>
        </div>
        <div className="space-y-2">
          <input className="w-full border rounded px-2 py-1" placeholder="First name" value={state.firstName ?? ""} onChange={(e) => setState((s) => ({ ...s, firstName: e.target.value }))} />
          <input className="w-full border rounded px-2 py-1" placeholder="Last name" value={state.lastName ?? ""} onChange={(e) => setState((s) => ({ ...s, lastName: e.target.value }))} />
          <input className="w-full border rounded px-2 py-1" placeholder="Email" value={state.email ?? ""} onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))} />
          <input className="w-full border rounded px-2 py-1" placeholder="Phone" value={state.phone ?? ""} onChange={(e) => setState((s) => ({ ...s, phone: e.target.value }))} />
          <input className="w-full border rounded px-2 py-1" placeholder="Tags (comma separated)" value={(state.tags || []).join?.(",") ?? ""} onChange={(e) => setState((s) => ({ ...s, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }))} />
          <input className="w-full border rounded px-2 py-1" placeholder="Source" value={state.source ?? ""} onChange={(e) => setState((s) => ({ ...s, source: e.target.value }))} />
          <textarea className="w-full border rounded px-2 py-1" placeholder="Notes" value={state.notes ?? ""} onChange={(e) => setState((s) => ({ ...s, notes: e.target.value }))} />
          <div className="flex gap-2">
            <Button onClick={() => submitContact(state)}>Save</Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Contacts Management" menuItems={menuItems}>
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <input className="border rounded px-2 py-1" placeholder="Search name, email or phone" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="border rounded px-2 py-1" value={selectedTag ?? ""} onChange={(e) => setSelectedTag(e.target.value || null)}>
            <option value="">All tags</option>
            {tags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="border rounded px-2 py-1" value={selectedSource ?? ""} onChange={(e) => setSelectedSource(e.target.value || null)}>
            <option value="">All sources</option>
            {sources.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowImport(true)}><Upload className="mr-2" />Import Contacts</Button>
          <Button onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="mr-2" />Add Contact</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {/* Quick actions */}
        <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => setShowImport(true)}>
          <Upload className="h-8 w-8" />
          <span>Import Contacts</span>
        </Button>
        <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Users className="h-8 w-8" />
          <span>Add Contact</span>
        </Button>
        <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => navigate("/marketer/segments")}>
          <Tag className="h-8 w-8" />
          <span>Manage Segments</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No contacts found.</p>
          ) : (
            <ul className="divide-y">
              {filtered.map((c) => (
                <li key={c.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{(c.firstName || "") + (c.lastName ? ` ${c.lastName}` : "") || c.email || c.phone}</div>
                    <div className="text-xs text-muted-foreground">{c.email} {c.phone && `· ${c.phone}`}</div>
                    <div className="text-xs mt-1">
                      {(c.tags || []).map((t) => <span key={t} className="text-[11px] bg-gray-100 border rounded px-1 mr-1">{t}</span>)}
                      {c.source && <span className="text-[11px] bg-gray-50 border rounded px-1 ml-1">{c.source}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button title="View" onClick={() => setDetailId(c.id)} className="p-1"><Eye /></button>
                    <button title="Edit" onClick={() => { setEditing(c); setShowForm(true); }} className="p-1"><Edit2 /></button>
                    <button title="Delete" onClick={() => handleDelete(c.id)} className="p-1 text-red-600"><Trash2 /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Import modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-[520px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Import Contacts (CSV)</h3>
              <button onClick={() => setShowImport(false)}><X /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">CSV must have headers like firstName,lastName,email,phone,tags,source,notes</p>
            <input type="file" accept=".csv,text/csv" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleCSVFile(f);
            }} />
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setShowImport(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-[520px]">
            <ContactForm />
          </div>
        </div>
      )}

      {/* Details drawer */}
      {detailId && (
        <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-lg z-40 overflow-auto">
          <div className="p-4 flex items-center justify-between border-b">
            <h3 className="text-lg font-medium">Contact Details</h3>
            <button onClick={() => setDetailId(null)}><X /></button>
          </div>
          <div className="p-4">
            {!contactDetail ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <>
                <div className="mb-3">
                  <div className="text-xl font-semibold">{contactDetail.firstName} {contactDetail.lastName}</div>
                  <div className="text-sm text-muted-foreground">{contactDetail.email} · {contactDetail.phone}</div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium">Notes</h4>
                  <p className="text-sm text-muted-foreground">{contactDetail.notes ?? "No notes"}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Past Campaigns</h4>
                  {Array.isArray(contactDetail.pastCampaigns) && contactDetail.pastCampaigns.length > 0 ? (
                    <ul className="space-y-2">
                      {contactDetail.pastCampaigns.map((pc: any) => (
                        <li key={pc.id} className="p-2 border rounded">
                          <div className="text-sm font-medium">{pc.title}</div>
                          <div className="text-xs text-muted-foreground">{pc.type} · {pc.status}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No campaign activity</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Contacts;
