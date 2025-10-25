import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Play, History, Plus, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { marketerMenuItems } from "./marketerMenuItems";

type TriggerKind = "contact_created" | "campaign_opened" | "link_clicked" | "form_submitted";
type ActionKind = "send_email" | "send_sms" | "notify_sales" | "add_tag";

type Automation = {
  id: string;
  name: string;
  active: boolean;
  trigger: { kind: TriggerKind; config?: any };
  actions: Array<{ kind: ActionKind; config?: any }>;
  createdAt?: string;
};

const TRIGGERS: { key: TriggerKind; label: string; hint?: string }[] = [
  { key: "contact_created", label: "New contact added" },
  { key: "campaign_opened", label: "Campaign opened" },
  { key: "link_clicked", label: "Link clicked" },
  { key: "form_submitted", label: "Form submitted" },
];

const ACTIONS: { key: ActionKind; label: string; hint?: string }[] = [
  { key: "send_email", label: "Send email" },
  { key: "send_sms", label: "Send WhatsApp/SMS" },
  { key: "notify_sales", label: "Notify Sales" },
  { key: "add_tag", label: "Add tag to contact" },
];

const Automations = () => {
  const menuItems = marketerMenuItems;
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [formName, setFormName] = useState("");
  const [formTrigger, setFormTrigger] = useState<TriggerKind>("contact_created");
  const [formActions, setFormActions] = useState<Array<{ kind: ActionKind; config?: any }>>([]);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/automations", { signal: ac.signal });
        if (res.ok) {
          const data: Automation[] = await res.json();
          setAutomations(data || []);
        }
      } catch (err) {
        console.error("Failed to load automations", err);
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const submitCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const payload: Partial<Automation> = {
      name: formName || `Automation ${new Date().toISOString()}`,
      active: false,
      trigger: { kind: formTrigger },
      actions: formActions,
    };
    try {
      const res = await fetch("/api/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Create failed");
      const created: Automation = await res.json();
      setAutomations((prev) => [created, ...prev]);
      setShowCreate(false);
      setFormName("");
      setFormTrigger("contact_created");
      setFormActions([]);
    } catch (err) {
      console.error(err);
      alert("Failed to create automation");
    }
  };

  const toggleActive = async (id: string, next: boolean) => {
    try {
      const res = await fetch(`/api/automations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: next }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      const updated: Automation = await res.json();
      setAutomations((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const deleteAutomation = async (id: string) => {
    if (!confirm("Delete automation?")) return;
    try {
      const res = await fetch(`/api/automations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setAutomations((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <DashboardLayout title="Automation Workflows" menuItems={menuItems}>
      <div className="flex gap-4 mb-6">
        <Button variant="outline" onClick={() => setShowCreate(true)}><Plus className="mr-2" />Create Workflow</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automation List</CardTitle>
          <CardDescription>Manage rule-based workflows</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : automations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No automations yet. Create one to get started.</p>
          ) : (
            <ul className="space-y-3">
              {automations.map((a) => (
                <li key={a.id} className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs text-muted-foreground">Trigger: {a.trigger.kind}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button title={a.active ? "Deactivate" : "Activate"} onClick={() => toggleActive(a.id, !a.active)} className="p-2">
                      {a.active ? <ToggleRight className="text-green-600" /> : <ToggleLeft className="text-gray-400" />}
                    </button>
                    <button title="Delete" onClick={() => deleteAutomation(a.id)} className="p-2 text-red-600"><Trash2 /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Create Workflow</h3>
              <button onClick={() => setShowCreate(false)}>✕</button>
            </div>

            <form onSubmit={(e) => submitCreate(e)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input className="w-full border rounded px-2 py-1" value={formName} onChange={(e) => setFormName(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Trigger</label>
                <select className="w-full border rounded px-2 py-1" value={formTrigger} onChange={(e) => setFormTrigger(e.target.value as TriggerKind)}>
                  {TRIGGERS.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreate(false)} type="button">Cancel</Button>
                <Button type="submit">Save Workflow</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Automations;
