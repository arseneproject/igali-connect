import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Users, Mail, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompanyData {
  id: string;
  company_name: string;
  business_type: string;
  email: string;
  location: string;
  userCount: number;
  campaignCount: number;
}

const SuperAdminDashboard = () => {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const menuItems = [
    { label: "Dashboard", path: "/super-admin", icon: <BarChart3 className="h-4 w-4" /> },
    { label: "Companies", path: "/super-admin/companies", icon: <Building2 className="h-4 w-4" /> },
    { label: "All Users", path: "/super-admin/users", icon: <Users className="h-4 w-4" /> },
    { label: "All Campaigns", path: "/super-admin/campaigns", icon: <Mail className="h-4 w-4" /> },
  ];

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*');

      if (companiesError) throw companiesError;

      const companiesWithStats = await Promise.all(
        (companiesData || []).map(async (company) => {
          const { count: userCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id);

          const campaignResult = await (supabase as any)
            .from('campaigns')
            .select('id', { count: 'exact', head: true })
            .eq('company_id', company.id);
          
          const campaignCount = campaignResult.count;

          return {
            ...company,
            userCount: userCount || 0,
            campaignCount: campaignCount || 0,
          };
        })
      );

      setCompanies(companiesWithStats);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Super Admin Dashboard" menuItems={menuItems}>
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card className="animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {companies.reduce((sum, c) => sum + c.userCount, 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {companies.reduce((sum, c) => sum + c.campaignCount, 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {companies.filter(c => c.campaignCount > 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Companies</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : companies.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No companies found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Business Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Campaigns</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.company_name}</TableCell>
                    <TableCell className="capitalize">{company.business_type}</TableCell>
                    <TableCell>{company.location}</TableCell>
                    <TableCell>{company.userCount}</TableCell>
                    <TableCell>{company.campaignCount}</TableCell>
                    <TableCell>
                      <Badge variant={company.campaignCount > 0 ? "default" : "secondary"}>
                        {company.campaignCount > 0 ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
