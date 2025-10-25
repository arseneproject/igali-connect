import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Calendar, BarChart2, Plus, Trash2, Link } from "lucide-react";
import { marketerMenuItems } from "./marketerMenuItems";

type SocialPost = {
  id: string;
  content: string;
  image?: string | null;
  platforms: string[]; // 'facebook' | 'x' | 'linkedin'
  scheduledAt?: string | null;
  status?: "draft" | "scheduled" | "posted" | "failed";
  performance?: { likes?: number; shares?: number; comments?: number } | null;
  createdAt?: string;
};

const Social = () => {
  const menuItems = marketerMenuItems;

  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<{ content: string; image?: string; platforms: Record<string, boolean>; scheduledAt?: string | null }>({
    content: "",
    image: "",
    platforms: { facebook: false, x: false, linkedin: false },
    scheduledAt: null,
  });

  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const [connected, setConnected] = useState<{ buffer?: boolean; ifttt?: boolean }>({});

  // load posts + connection status
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const [pRes, cRes] = await Promise.all([
          fetch("/api/social/posts", { signal: ac.signal }),
          fetch("/api/social/connect/status", { signal: ac.signal }),
        ]);
        if (pRes.ok) {
          const data = await pRes.json();
          setPosts(data || []);
        }
        if (cRes.ok) {
          const status = await cRes.json();
          setConnected(status || {});
        }
      } catch (err) {
        console.error("social load", err);
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  // connect provider (Buffer / IFTTT) -> backend returns oauth url or starts flow
  const connectProvider = async (provider: "buffer" | "ifttt") => {
    try {
      setConnectingProvider(provider);
      const res = await fetch(`/api/social/connect?provider=${provider}`, { method: "POST" });
      if (!res.ok) throw new Error("connect failed");
      const data = await res.json();
      // backend should return { url }
      if (data?.url) {
        // open popup for oauth
        window.open(data.url, "_blank", "noopener");
      } else {
        alert("Connection started. Complete the flow in the opened window.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to start connection");
    } finally {
      setConnectingProvider(null);
    }
  };

  // create post (immediate or scheduled)
  const submitPost = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const platforms = Object.entries(form.platforms).filter(([,v]) => v).map(([k]) => k);
    if (!form.content.trim() || platforms.length === 0) {
      alert("Provide content and at least one platform");
      return;
    }
    const payload = {
      content: form.content,
      image: form.image || null,
      platforms,
      scheduledAt: form.scheduledAt || null,
    };
    try {
      const res = await fetch("/api/social/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Create failed");
      const created: SocialPost = await res.json();
      setPosts((p) => [created, ...p]);
      setShowCreate(false);
      setForm({ content: "", image: "", platforms: { facebook: false, x: false, linkedin: false }, scheduledAt: null });
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    }
  };

  const refreshPerformance = async (id: string) => {
    try {
      const res = await fetch(`/api/social/posts/${id}/performance`);
      if (!res.ok) throw new Error("Perf fetch failed");
      const perf = await res.json();
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, performance: perf } : p)));
    } catch (err) {
      console.error(err);
      alert("Failed to load performance");
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete post?")) return;
    try {
      const res = await fetch(`/api/social/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <DashboardLayout title="Social Media Management" menuItems={menuItems}>
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => setShowCreate(true)}>
          <Plus className="h-8 w-8" />
          <span>Create Post</span>
        </Button>
        <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => { /* navigate to scheduling calendar if exists */ }}>
          <Calendar className="h-8 w-8" />
          <span>Schedule Posts</span>
        </Button>
        <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => { /* analytics page */ }}>
          <BarChart2 className="h-8 w-8" />
          <span>Analytics</span>
        </Button>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <div className="flex-1">
            <div className="font-medium">Buffer</div>
            <div className="text-sm text-muted-foreground mb-2">{connected.buffer ? "Connected" : "Not connected"}</div>
            <div className="flex gap-2">
              <Button onClick={() => connectProvider("buffer")} disabled={connectingProvider === "buffer"}>{connected.buffer ? "Reconnect" : "Connect Buffer"}</Button>
              <Button variant="outline" onClick={() => alert("IFTTT can be used via backend webhooks")}>Help</Button>
            </div>
          </div>

          <div className="flex-1">
            <div className="font-medium">IFTTT</div>
            <div className="text-sm text-muted-foreground mb-2">{connected.ifttt ? "Connected" : "Not connected"}</div>
            <div className="flex gap-2">
              <Button onClick={() => connectProvider("ifttt")} disabled={connectingProvider === "ifttt"}>{connected.ifttt ? "Reconnect" : "Connect IFTTT"}</Button>
              <Button variant="outline" onClick={() => alert("You can configure applets on IFTTT and provide webhook keys to backend")}>Help</Button>
            </div>
          </div>

          <div className="flex-1">
            <div className="font-medium">Platforms</div>
            <div className="text-sm text-muted-foreground">Post to Facebook, X (Twitter), LinkedIn using Buffer/IFTTT via backend</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled & Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No posts yet. Create or schedule a post.</p>
          ) : (
            <ul className="space-y-3">
              {posts.map((p) => (
                <li key={p.id} className="p-3 border rounded flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{p.content}</div>
                    {p.image ? <div className="text-xs text-muted-foreground">Image: {p.image}</div> : null}
                    <div className="text-xs text-muted-foreground mt-2">
                      Platforms: {p.platforms.join(", ")} · Status: {p.status} · Scheduled: {p.scheduledAt ? new Date(p.scheduledAt).toLocaleString() : "-"}
                    </div>

                    <div className="mt-2 text-sm">
                      {p.performance ? (
                        <div className="flex gap-3">
                          <div>Likes: {p.performance.likes ?? 0}</div>
                          <div>Shares: {p.performance.shares ?? 0}</div>
                          <div>Comments: {p.performance.comments ?? 0}</div>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">Performance not loaded</div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button variant="outline" onClick={() => refreshPerformance(p.id)}>Refresh</Button>
                    <Button variant="ghost" onClick={() => deletePost(p.id)}><Trash2 /></Button>
                    <a href={`#post-${p.id}`} className="text-xs text-muted-foreground flex items-center gap-1"><Link /> Details</a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Create Social Post</h3>
              <button onClick={() => setShowCreate(false)}>✕</button>
            </div>

            <form onSubmit={(e) => submitPost(e)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea className="w-full border rounded px-2 py-1" rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
                <input className="w-full border rounded px-2 py-1" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Platforms</label>
                <div className="flex gap-2">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={form.platforms.facebook} onChange={(e) => setForm({ ...form, platforms: { ...form.platforms, facebook: e.target.checked } })} />
                    <span>Facebook</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={form.platforms.x} onChange={(e) => setForm({ ...form, platforms: { ...form.platforms, x: e.target.checked } })} />
                    <span>X (Twitter)</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={form.platforms.linkedin} onChange={(e) => setForm({ ...form, platforms: { ...form.platforms, linkedin: e.target.checked } })} />
                    <span>LinkedIn</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Schedule</label>
                <input type="datetime-local" className="w-full border rounded px-2 py-1" value={form.scheduledAt ?? ""} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value || null })} />
                <div className="text-xs text-muted-foreground mt-1">Leave empty to post immediately.</div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreate(false)} type="button">Cancel</Button>
                <Button type="submit">Create / Schedule</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Social;
