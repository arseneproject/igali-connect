import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { salesMenuItems } from "./salesMenuItems";

export default function Search() {
  const menuItems = salesMenuItems;
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function doSearch() {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/sales/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data || []);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Search error", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout title="Search" menuItems={menuItems}>
      <Card>
        <CardHeader>
          <CardTitle>Global Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input placeholder="Search leads, companies, conversations..." value={q} onChange={(e) => setQ((e.target as HTMLInputElement).value)} />
            <Button onClick={doSearch} disabled={loading}>Search</Button>
            <Button variant="outline" onClick={() => { setQ(""); setResults([]); }}>Clear</Button>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Searching...</p>
          ) : results.length === 0 ? (
            <p className="text-muted-foreground">No results.</p>
          ) : (
            <ul className="space-y-2">
              {results.map((r, i) => (
                <li key={i} className="p-2 border rounded">
                  <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(r, null, 2)}</pre>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
