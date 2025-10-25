import { useEffect, useState } from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Search, Eye, Copy, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { marketerMenuItems } from "@/data/marketerMenuItems";

type Campaign = {
  id: number | string;
  name: string;
  type: 'Email' | 'SMS' | 'Social';
  status?: 'Draft' | 'Scheduled' | 'Sent' | string;
  subject?: string;
  message?: string;
  audience?: { kind: 'all' } | { kind: 'segment'; segmentId: string } | { kind: 'manual'; recipients: string[] };
  scheduledAt?: string | null;
  createdAt?: string;
  stats?: { open?: number; click?: number; deliver?: number; bounce?: number };
};

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<{ name: string; type: Campaign['type']; subject: string; message: string; audienceKind: 'all' | 'segment' | 'manual'; audienceValue: string; scheduledAt?: string | null }>({
    name: '',
    type: 'Email',
    subject: '',
    message: '',
    audienceKind: 'all',
    audienceValue: '',
    scheduledAt: null,
  });
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewStats, setViewStats] = useState<{ open: number; click: number; deliver: number; bounce: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [segments, setSegments] = useState<{ id: string; name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const menuItems = marketerMenuItems;

  useEffect(() => {
    let ac = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const [cRes, sRes] = await Promise.all([
          fetch("/api/campaigns", { signal: ac.signal }),
          fetch("/api/contacts/segments", { signal: ac.signal }),
        ]);
        if (cRes.ok) {
          const data = await cRes.json();
          setCampaigns(data || []);
        }
        if (sRes.ok) {
          const sdata = await sRes.json();
          setSegments(sdata || []);
        }
      } catch (err) {
        console.error("Load campaigns error", err);
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const payload: any = {
      name: form.name,
      type: form.type,
      subject: form.subject || undefined,
      message: form.message || undefined,
      scheduledAt: form.scheduledAt || null,
      audience:
        form.audienceKind === 'all'
          ? { kind: 'all' }
          : form.audienceKind === 'segment'
          ? { kind: 'segment', segmentId: form.audienceValue }
          : { kind: 'manual', recipients: (form.audienceValue || '').split(",").map((s) => s.trim()).filter(Boolean) },
      status: form.scheduledAt ? 'Scheduled' : 'Draft',
    };

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Create failed");
      const created: Campaign = await res.json();
      setCampaigns((prev) => [created, ...prev]);
      setShowModal(false);
      setForm({
        name: '',
        type: 'Email',
        subject: '',
        message: '',
        audienceKind: 'all',
        audienceValue: '',
        scheduledAt: null,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create campaign");
    }
  };

  const duplicateCampaign = async (id: Campaign['id']) => {
    try {
      const res = await fetch(`/api/campaigns/${id}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error("Duplicate failed");
      const duplicated: Campaign = await res.json();
      setCampaigns((prev) => [duplicated, ...prev]);
    } catch (err) {
      console.error(err);
      alert("Duplicate failed");
    }
  };

  const deleteCampaign = async (id: Campaign['id']) => {
    if (!confirm("Delete campaign?")) return;
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const openView = async (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowViewModal(true);
    setViewStats(null);
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/stats`);
      if (!res.ok) {
        return;
      }
      const s = await res.json();
      setViewStats({
        open: s.open ?? 0,
        click: s.click ?? 0,
        deliver: s.deliver ?? 0,
        bounce: s.bounce ?? 0,
      });
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  const filtered = campaigns.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.subject ?? "").toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <DashboardLayout title="Campaign Management" menuItems={menuItems}>
      <div className="relative mb-6">
        <Input placeholder="Search campaigns..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <Button onClick={() => setShowModal(true)}>Create New Campaign</Button>
      </div>

      <div className="mb-6">
        <p className="mb-4 text-sm text-muted-foreground">Choose a campaign type to get started</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg" onClick={() => { setForm((f) => ({ ...f, type: 'Email' })); setShowModal(true); }}>
            <CardHeader>
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 text-blue-600 p-3 mr-3">@</div>
                <CardTitle className="text-base">Email Campaign</CardTitle>
              </div>
              <CardDescription>Send targeted email campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Great for newsletters and product updates.</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg" onClick={() => { setForm((f) => ({ ...f, type: 'SMS' })); setShowModal(true); }}>
            <CardHeader>
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 text-green-600 p-3 mr-3">💬</div>
                <CardTitle className="text-base">SMS Campaign</CardTitle>
              </div>
              <CardDescription>Quick messages to contacts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Short, timely notifications and offers.</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg" onClick={() => { setForm((f) => ({ ...f, type: 'Social' })); setShowModal(true); }}>
            <CardHeader>
              <div className="flex items-center">
                <div className="rounded-full bg-pink-100 text-pink-600 p-3 mr-3">#</div>
                <CardTitle className="text-base">Social Media Post</CardTitle>
              </div>
              <CardDescription>Publish to social networks</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Create posts for Facebook, Instagram, and more.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>List view of campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-auto border-collapse">
              <thead>
                <tr className="text-sm text-muted-foreground text-left">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Audience</th>
                  <th className="py-3 px-4">Scheduled</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="py-6 px-4 text-center text-sm text-muted-foreground">Loading...</td></tr>
                ) : campaigns.length === 0 ? (
                  <tr><td colSpan={7} className="py-6 px-4 text-center text-sm text-muted-foreground">You haven't created any campaigns yet.</td></tr>
                ) : (
                  filtered.map((campaign) => (
                    <tr key={campaign.id} className="border-t">
                      <td className="py-3 px-4 align-top">
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-xs text-muted-foreground">{campaign.createdAt ? new Date(campaign.createdAt).toLocaleString() : ''}</div>
                      </td>
                      <td className="py-3 px-4 align-top">{campaign.type}</td>
                      <td className="py-3 px-4 align-top">{campaign.subject ?? '-'}</td>
                      <td className="py-3 px-4 align-top">
                        {campaign.audience?.kind === 'all' ? 'All contacts' : campaign.audience?.kind === 'segment' ? `Segment: ${(campaign.audience as any).segmentId}` : `${((campaign.audience as any).recipients || []).length} recipients`}
                      </td>
                      <td className="py-3 px-4 align-top">{campaign.scheduledAt ? new Date(campaign.scheduledAt).toLocaleString() : '-'}</td>
                      <td className="py-3 px-4 align-top">{campaign.status}</td>
                      <td className="py-3 px-4 align-top">
                        <div className="flex items-center gap-2">
                          <button aria-label="View" onClick={() => openView(campaign)} className="p-2 rounded hover:bg-muted/30"><Eye className="h-4 w-4 text-muted-foreground" /></button>
                          <button aria-label="Duplicate" onClick={() => duplicateCampaign(campaign.id)} className="p-2 rounded hover:bg-muted/30"><Copy className="h-4 w-4 text-muted-foreground" /></button>
                          <button aria-label="Delete" onClick={() => deleteCampaign(campaign.id)} className="p-2 rounded hover:bg-red-50 text-red-600"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 mx-4">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold">Create Campaign</h2>
              <button aria-label="Close" onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <form onSubmit={(e) => handleCreate(e)} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Campaign Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Summer Promo" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Campaign['type'] })} className="w-full rounded-md border px-3 py-2">
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                    <option value="Social">Social</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Schedule</label>
                  <input type="datetime-local" value={form.scheduledAt ?? ''} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value || null })} className="w-full rounded-md border px-3 py-2" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subject (Email)</label>
                <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Email subject" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message / Content</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full rounded-md border px-3 py-2" placeholder="Write the email body or social message..." />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Audience</label>
                <div className="flex gap-2 items-center mb-2">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" checked={form.audienceKind === 'all'} onChange={() => setForm({ ...form, audienceKind: 'all', audienceValue: '' })} />
                    <span>All contacts</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" checked={form.audienceKind === 'segment'} onChange={() => setForm({ ...form, audienceKind: 'segment', audienceValue: segments[0]?.id ?? '' })} />
                    <span>Segment</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" checked={form.audienceKind === 'manual'} onChange={() => setForm({ ...form, audienceKind: 'manual', audienceValue: '' })} />
                    <span>Manual (comma-separated emails)</span>
                  </label>
                </div>

                {form.audienceKind === 'segment' && (
                  <select value={form.audienceValue} onChange={(e) => setForm({ ...form, audienceValue: e.target.value })} className="w-full rounded-md border px-3 py-2">
                    <option value="">Select segment</option>
                    {segments.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                )}

                {form.audienceKind === 'manual' && (
                  <input className="w-full rounded-md border px-3 py-2" placeholder="email1@example.com,email2@example.com" value={form.audienceValue} onChange={(e) => setForm({ ...form, audienceValue: e.target.value })} />
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowModal(false)} type="button">Cancel</Button>
                <Button type="submit">Create Campaign</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 mx-4">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold">{selectedCampaign.name}</h2>
              <button aria-label="Close" onClick={() => { setShowViewModal(false); setSelectedCampaign(null); }} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Type</div>
                <div className="font-medium">{selectedCampaign.type}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Subject</div>
                <div>{selectedCampaign.subject || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Audience</div>
                <div>{selectedCampaign.audience?.kind === 'all' ? 'All contacts' : selectedCampaign.audience?.kind === 'segment' ? `Segment ${(selectedCampaign.audience as any).segmentId}` : `${((selectedCampaign.audience as any).recipients || []).length} recipients`}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Scheduled</div>
                <div>{selectedCampaign.scheduledAt ? new Date(selectedCampaign.scheduledAt).toLocaleString() : '-'}</div>
              </div>

              <div>
                <h4 className="text-sm font-medium">Engagement</h4>
                {viewStats ? (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 border rounded">
                      <div className="text-xs text-muted-foreground">Opens</div>
                      <div className="font-medium">{viewStats.open}</div>
                    </div>
                    <div className="p-2 border rounded">
                      <div className="text-xs text-muted-foreground">Clicks</div>
                      <div className="font-medium">{viewStats.click}</div>
                    </div>
                    <div className="p-2 border rounded">
                      <div className="text-xs text-muted-foreground">Delivered</div>
                      <div className="font-medium">{viewStats.deliver}</div>
                    </div>
                    <div className="p-2 border rounded">
                      <div className="text-xs text-muted-foreground">Bounced</div>
                      <div className="font-medium">{viewStats.bounce}</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No stats available.</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => duplicateCampaign(selectedCampaign.id)}>Duplicate</Button>
              <Button variant="destructive" onClick={() => { deleteCampaign(selectedCampaign.id); setShowViewModal(false); }}>Delete</Button>
              <Button variant="ghost" onClick={() => { setShowViewModal(false); }}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Campaigns;
