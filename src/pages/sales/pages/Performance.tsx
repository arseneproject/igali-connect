import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { salesMenuItems } from "./salesMenuItems";

type Metrics = { leadsConvertedThisMonth: number; responseRate: number; avgFollowUpTimeHours: number; series?: { label: string; value: number }[] };

function MiniBar({ data }: { data: Metrics["series"] }) {
  if (!data) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-24">
      {data.map((d, i) => <div key={i} style={{ height: `${(d.value / max) * 100}%` }} className="w-6 bg-blue-500 rounded" title={`${d.label}: ${d.value}`} />)}
    </div>
  );
}

export default function Performance() {
  const menuItems = salesMenuItems;
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/sales/performance");
        if (res.ok) setMetrics(await res.json());
      } catch (err) { console.error(err); } finally { setLoading(false); }
    })();
  }, []);

  return (
    <DashboardLayout title="Performance" menuItems={menuItems}>
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader><CardTitle>Leads Converted</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics ? metrics.leadsConvertedThisMonth : "—"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Response Rate</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics ? `${Math.round(metrics.responseRate)}%` : "—"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Avg Follow-up Time (hrs)</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics ? Math.round(metrics.avgFollowUpTimeHours) : "—"}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Trends</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-muted-foreground">Loading...</p> : metrics?.series ? <MiniBar data={metrics.series} /> : <p className="text-muted-foreground">No data</p>}
          <div className="mt-4 flex gap-2">
            <Button onClick={() => alert("Export CSV (backend integration)")}>Export CSV</Button>
            <Button variant="outline" onClick={() => alert("Export PDF (backend integration)")}>Export PDF</Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
