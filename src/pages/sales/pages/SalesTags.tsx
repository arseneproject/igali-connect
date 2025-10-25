import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { salesMenuItems } from "./salesMenuItems";

export default function SalesTags() {
  const menuItems = salesMenuItems;
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/sales/tags");
        if (res.ok) setTags(await res.json());
      } catch (err) {
        console.error("Load tags", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function createTag() {
    const t = newTag.trim();
    if (!t) return;
    try {
      const res = await fetch("/api/sales/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: t }),
      });
      if (!res.ok) throw new Error("create failed");
      const created = await res.json();
      setTags((s) => [created, ...s]);
      setNewTag("");
    } catch (err) {
      console.error("Create tag", err);
      alert("Failed to create tag");
    }
  }

  async function deleteTag(name: string) {
    if (!confirm("Delete tag?")) return;
    try {
      const res = await fetch(`/api/sales/tags/${encodeURIComponent(name)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
      setTags((s) => s.filter((x) => x !== name));
    } catch (err) {
      console.error("Delete tag", err);
      alert("Failed to delete tag");
    }
  }

  return (
    <DashboardLayout title="Tags" menuItems={menuItems}>
      <Card>
        <CardHeader>
          <CardTitle>Manage Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <input className="border rounded px-2 py-1" placeholder="New tag (Hot/Warm/Cold)" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
            <Button onClick={createTag} disabled={!newTag.trim()}>Create</Button>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : tags.length === 0 ? (
            <p className="text-muted-foreground">No tags yet.</p>
          ) : (
            <ul className="space-y-2">
              {tags.map((t) => (
                <li key={t} className="flex items-center justify-between p-2 border rounded">
                  <div>{t}</div>
                  <div>
                    <Button variant="destructive" onClick={() => deleteTag(t)}>Delete</Button>
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
