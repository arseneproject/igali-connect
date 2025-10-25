import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Share2, PlusCircle, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { marketerMenuItems } from "@/data/marketerMenuItems";
import { useEffect, useMemo, useState } from "react";

// New: small inline SVG chart (no external deps)
const MiniLineChart = ({ labels = [], series = [], colors = ["#60A5FA", "#34D399", "#F59E0B"], height = 64, strokeWidth = 2 }: {
  labels?: string[];
  series?: number[][];
  colors?: string[];
  height?: number;
  strokeWidth?: number;
}) => {
  // series: array of arrays, each is same length as labels
  const width = Math.max(120, (labels.length || 1) * 20);
  const pad = 6;
  const all = series.flat();
  const min = Math.min(...all, 0);
  const max = Math.max(...all, 100);
  const scale = (v: number) => {
    if (max === min) return height / 2;
    return ((v - min) / (max - min)) * (height - pad * 2);
  };

  const paths = series.map((s) => {
    return s
      .map((v, i) => {
        const x = (i / Math.max(1, labels.length - 1)) * (width - pad * 2) + pad;
        const y = height - pad - scale(v);
        return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
  });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Mini chart">
      <rect x="0" y="0" width={width} height={height} fill="transparent" />
      {paths.map((d, idx) => (
        <path key={idx} d={d} fill="none" stroke={colors[idx % colors.length]} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
};

const MarketerDashboard = () => {
  const navigate = useNavigate();

  // New state for summary and notifications
  const [summary, setSummary] = useState<{
    totalContacts: number;
    totalCampaigns: { email: number; sms: number; social: number; total: number };
    totalAutomations: number;
    chart?: { labels: string[]; openRate: number[]; clickRate: number[]; socialEngagement: number[] };
  } | null>(null);
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();

    async function load() {
      setLoading(true);
      try {
        const [sRes, nRes] = await Promise.all([
          fetch("/api/marketer/summary", { signal: ac.signal }),
          fetch("/api/notifications?limit=5", { signal: ac.signal }),
        ]);

        if (!sRes.ok) throw new Error("Summary fetch failed");
        const sJson = await sRes.json();
        const nJson = nRes.ok ? await nRes.json() : [];

        // Expecting shape:
        // { totalContacts, totalCampaigns: {email,sms,social,total}, totalAutomations, chart: {labels, openRate, clickRate, socialEngagement} }
        setSummary(sJson);
        setNotifications(nJson);
      } catch (error) {
        // minimal error handling: leave summary null
        console.error("Dashboard load error", error);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => ac.abort();
  }, []);

  const chartSeries = useMemo(() => {
    if (!summary?.chart) return { labels: [], series: [] as number[][] };
    return {
      labels: summary.chart.labels,
      series: [summary.chart.openRate || [], summary.chart.clickRate || [], summary.chart.socialEngagement || []],
    };
  }, [summary]);

  return (
    <DashboardLayout title="Marketer Dashboard" menuItems={marketerMenuItems}>
      {/* Top summary: total contacts, campaigns, automations */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "—" : summary?.totalContacts ?? 0}</div>
            <p className="text-xs text-muted-foreground">Contacts imported</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "—" : summary?.totalCampaigns?.total ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              Email: {summary?.totalCampaigns?.email ?? 0} · SMS: {summary?.totalCampaigns?.sms ?? 0} · Social: {summary?.totalCampaigns?.social ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Automations</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "—" : summary?.totalAutomations ?? 0}</div>
            <p className="text-xs text-muted-foreground">Active automations</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart and quick links row */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Email & Social Performance</CardTitle>
            <CardDescription>Open rate, Click rate and Social engagement over time</CardDescription>
          </CardHeader>
          <CardContent>
            {chartSeries.series.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No chart data available</p>
            ) : (
              <div className="flex items-center gap-4">
                <MiniLineChart labels={chartSeries.labels} series={chartSeries.series} />
                <div className="flex-1">
                  <div className="flex gap-4">
                    <div className="text-sm"><span className="inline-block w-3 h-3 mr-2 bg-blue-400 rounded-full align-middle" />Open Rate</div>
                    <div className="text-sm"><span className="inline-block w-3 h-3 mr-2 bg-green-400 rounded-full align-middle" />Click Rate</div>
                    <div className="text-sm"><span className="inline-block w-3 h-3 mr-2 bg-yellow-400 rounded-full align-middle" />Social Engagement</div>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Data is shown for the last {chartSeries.labels.length} periods.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Common actions</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/marketer/campaigns/create")}>
              <PlusCircle className="mr-2" /> Create Campaign
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/marketer/contacts/import")}>
              <Download className="mr-2" /> Import Contacts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Existing create new campaign card (keeps original quick-create UI) */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Campaign</CardTitle>
          <CardDescription>Choose a campaign type to get started</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => navigate("/marketer/campaigns/create?type=email")}>
            <Mail className="h-8 w-8" />
            <span>Email Campaign</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => navigate("/marketer/campaigns/create?type=sms")}>
            <MessageSquare className="h-8 w-8" />
            <span>SMS Campaign</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => navigate("/marketer/campaigns/create?type=social")}>
            <Share2 className="h-8 w-8" />
            <span>Social Media Post</span>
          </Button>
        </CardContent>
      </Card>

      {/* Latest notifications */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Latest Notifications</CardTitle>
          <CardDescription>From your account activity</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No recent notifications.</p>
          ) : (
            <ul className="space-y-3">
              {notifications.map((n) => (
                <li key={n.id} className="flex items-start justify-between">
                  <div>
                    <div className="text-sm">{n.message}</div>
                    <div className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default MarketerDashboard;
