import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MessageSquare, Share2, Plus, Copy, Pencil, Trash } from "lucide-react";
import { marketerMenuItems } from "./marketerMenuItems";
import { useNavigate } from "react-router-dom";

type Template = {
  id: string;
  name: string;
  type: "email" | "sms" | "social";
  subject?: string;
  body?: string;
  createdAt?: string;
};

const Templates = () => {
  const menuItems = marketerMenuItems;
  const navigate = useNavigate();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState<Template | null>(null);
  const [showPreview, setShowPreview] = useState<Template | null>(null);

  const [form, setForm] = useState<{ name: string; type: Template["type"]; subject?: string; body?: string }>({
    name: "",
    type: "email",
    subject: "",
    body: "",
  });

  useEffect(() => {
    let ac = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/templates");
        if (res.ok) {
          const data: Template[] = await res.json();
          setTemplates(data || []);
        } else {
          setTemplates([]);
        }
      } catch (err) {
        console.error("Failed to load templates", err);
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const emailTemplates = useMemo(() => templates.filter((t) => t.type === "email"), [templates]);
  const smsTemplates = useMemo(() => templates.filter((t) => t.type === "sms"), [templates]);
  const socialTemplates = useMemo(() => templates.filter((t) => t.type === "social"), [templates]);

  const openCreate = (type: Template["type"]) => {
    setEditing(null);
    setForm({ name: "", type, subject: "", body: "" });
    setShowEditor(true);
  };
  const openEdit = (t: Template) => {
    setEditing(t);
    setForm({ name: t.name, type: t.type, subject: t.subject ?? "", body: t.body ?? "" });
    setShowEditor(true);
  };

  const saveTemplate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const payload = { name: form.name, type: form.type, subject: form.subject, body: form.body };
    try {
      if (editing) {
        const res = await fetch(`/api/templates/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Update failed");
        const updated: Template = await res.json();
        setTemplates((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const res = await fetch("/api/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Create failed");
        const created: Template = await res.json();
        setTemplates((prev) => [created, ...prev]);
      }
      setShowEditor(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save template");
    }
  };

  const cloneTemplate = async (t: Template) => {
    try {
      const res = await fetch(`/api/templates/${t.id}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error("Duplicate failed");
      const dup: Template = await res.json();
      setTemplates((prev) => [dup, ...prev]);
    } catch (err) {
      console.error(err);
      alert("Clone failed");
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm("Delete template?")) return;
    try {
      const res = await fetch(`/api/templates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const previewTemplate = (t: Template) => {
    setShowPreview(t);
  };

  const useTemplate = (t: Template) => {
    navigate(`/marketer/campaigns/create?templateId=${encodeURIComponent(t.id)}&type=${t.type === "email" ? "Email" : t.type === "sms" ? "SMS" : "Social"}`);
  };

  const renderTemplateCard = (t: Template) => (
    <Card key={t.id}>
      <CardHeader>
        <CardTitle className="text-lg">{t.name}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">{t.type.toUpperCase()} · {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ""}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-3 text-sm text-muted-foreground">{t.subject ? t.subject : (t.body ? (t.body.length > 120 ? t.body.slice(0, 120) + "..." : t.body) : "")}</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => previewTemplate(t)}><Copy className="mr-2" />Preview</Button>
          <Button variant="ghost" size="sm" onClick={() => useTemplate(t)}><Plus className="mr-2" />Use</Button>
          <Button variant="outline" size="sm" onClick={() => openEdit(t)}><Pencil className="mr-2" />Edit</Button>
          <Button variant="outline" size="sm" onClick={() => cloneTemplate(t)}><Copy className="mr-2" />Clone</Button>
          <Button variant="destructive" size="sm" onClick={() => deleteTemplate(t.id)}><Trash /></Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout title="Message Templates" menuItems={menuItems}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={() => openCreate("email")}>New Email</Button>
          <Button onClick={() => openCreate("sms")}>New SMS</Button>
          <Button onClick={() => openCreate("social")}>New Social</Button>
        </div>
      </div>

      <Tabs defaultValue="email" className="space-y-4">
        <TabsList>
          <TabsTrigger value="email" className="space-x-2"><Mail className="h-4 w-4" /> <span>Email Templates</span></TabsTrigger>
          <TabsTrigger value="sms" className="space-x-2"><MessageSquare className="h-4 w-4" /> <span>SMS Templates</span></TabsTrigger>
          <TabsTrigger value="social" className="space-x-2"><Share2 className="h-4 w-4" /> <span>Social Templates</span></TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading ? <div className="text-center text-muted-foreground">Loading...</div> : (emailTemplates.length ? emailTemplates.map(renderTemplateCard) : <Card><CardContent><div className="text-muted-foreground">No email templates yet.</div></CardContent></Card>)}
          </div>
        </TabsContent>

        <TabsContent value="sms">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading ? <div className="text-center text-muted-foreground">Loading...</div> : (smsTemplates.length ? smsTemplates.map(renderTemplateCard) : <Card><CardContent><div className="text-muted-foreground">No SMS templates yet.</div></CardContent></Card>)}
          </div>
        </TabsContent>

        <TabsContent value="social">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading ? <div className="text-center text-muted-foreground">Loading...</div> : (socialTemplates.length ? socialTemplates.map(renderTemplateCard) : <Card><CardContent><div className="text-muted-foreground">No social templates yet.</div></CardContent></Card>)}
          </div>
        </TabsContent>
      </Tabs>

      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">{editing ? "Edit Template" : "Create Template"}</h3>
              <button onClick={() => { setShowEditor(false); setEditing(null); }}>✕</button>
            </div>

            <form onSubmit={(e) => saveTemplate(e)} className="space-y-3">
              <div>
                <label className="text-sm block mb-1">Name</label>
                <input className="w-full border rounded px-2 py-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>

              <div>
                <label className="text-sm block mb-1">Type</label>
                <select className="w-full border rounded px-2 py-1" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Template["type"] })}>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="social">Social</option>
                </select>
              </div>

              {form.type === "email" && (
                <div>
                  <label className="text-sm block mb-1">Subject</label>
                  <input className="w-full border rounded px-2 py-1" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                </div>
              )}

              <div>
                <label className="text-sm block mb-1">Body / Content</label>
                <textarea className="w-full border rounded px-2 py-1" rows={6} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setShowEditor(false); setEditing(null); }} type="button">Cancel</Button>
                <Button type="submit">{editing ? "Save" : "Create"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">{showPreview.name} • {showPreview.type.toUpperCase()}</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => useTemplate(showPreview)}>Use</Button>
                <button onClick={() => setShowPreview(null)}>✕</button>
              </div>
            </div>

            <div className="mb-4">
              {showPreview.subject && <div className="text-sm text-muted-foreground mb-2">Subject: {showPreview.subject}</div>}
              <div className="border p-4 rounded bg-white text-sm whitespace-pre-wrap">{showPreview.body || "(no content)"}</div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowPreview(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Templates;
