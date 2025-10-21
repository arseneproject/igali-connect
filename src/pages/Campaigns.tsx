import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Mail, MessageSquare, Share2, BarChart3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CampaignForm } from "@/components/CampaignForm";
import { Campaign, CampaignType, CampaignStatus } from "@/types/campaign";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, company } = useAuth();

  const menuItems = [
    { label: "Dashboard", path: "/marketer", icon: <BarChart3 className="h-4 w-4" /> },
    { label: "Campaigns", path: "/marketer/campaigns", icon: <Mail className="h-4 w-4" /> },
  ];

  useEffect(() => {
    if (company?.id && user?.id) {
      fetchCampaigns();
    }
  }, [company?.id, user?.id]);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('campaigns')
        .select('*')
        .eq('company_id', company!.id)
        .order('created_at', { ascending: false});

      if (error) throw error;
      
      const mappedData = ((data || []) as any[]).map((campaign: any) => ({
        id: campaign.id,
        name: campaign.name,
        type: campaign.type as CampaignType,
        status: campaign.status as CampaignStatus,
        subject: campaign.subject,
        content: campaign.content,
        scheduledDate: campaign.scheduled_date,
        targetAudience: campaign.target_audience,
        attachments: campaign.attachments,
        createdAt: campaign.created_at,
        updatedAt: campaign.updated_at,
        companyId: campaign.company_id,
        createdBy: campaign.created_by,
      }));
      
      setCampaigns(mappedData);
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

  const handleSaveCampaign = async (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'companyId' | 'createdBy'>) => {
    try {
      if (editingCampaign) {
        const { error } = await (supabase as any)
          .from('campaigns')
          .update({
            name: campaign.name,
            type: campaign.type,
            status: campaign.status,
            subject: campaign.subject,
            content: campaign.content,
            scheduled_date: campaign.scheduledDate,
            target_audience: campaign.targetAudience,
            attachments: campaign.attachments,
          })
          .eq('id', editingCampaign.id);

        if (error) throw error;

        toast({
          title: "Campaign updated",
          description: "Your campaign has been updated successfully.",
        });
      } else {
        const { error } = await (supabase as any)
          .from('campaigns')
          .insert({
            name: campaign.name,
            type: campaign.type,
            status: campaign.status,
            subject: campaign.subject,
            content: campaign.content,
            scheduled_date: campaign.scheduledDate,
            target_audience: campaign.targetAudience,
            attachments: campaign.attachments,
            company_id: company!.id,
            created_by: user!.id,
          });

        if (error) throw error;

        toast({
          title: "Campaign created",
          description: "Your campaign has been created successfully.",
        });
      }

      fetchCampaigns();
      setIsDialogOpen(false);
      setEditingCampaign(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Campaign deleted",
        description: "Campaign has been deleted successfully.",
      });
      fetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: string, status: CampaignStatus) => {
    try {
      const { error } = await (supabase as any)
        .from('campaigns')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Campaign status changed to ${status}.`,
      });
      fetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsDialogOpen(true);
  };

  const stats = {
    total: campaigns.length,
    email: campaigns.filter(c => c.type === 'email').length,
    sms: campaigns.filter(c => c.type === 'sms').length,
    social: campaigns.filter(c => c.type === 'social').length,
  };

  return (
    <DashboardLayout title="Campaigns" menuItems={menuItems}>
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card className="animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.email}</div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sms}</div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.social}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Campaigns</CardTitle>
          <Button onClick={() => {
            setEditingCampaign(null);
            setIsDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Loading campaigns...</p>
          ) : campaigns.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No campaigns yet. Create your first campaign to get started!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Target Audience</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {campaign.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          campaign.status === 'completed' ? 'default' :
                          campaign.status === 'running' ? 'secondary' :
                          'outline'
                        }
                        className="capitalize"
                      >
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{campaign.targetAudience.length} contacts</TableCell>
                    <TableCell>
                      {campaign.scheduledDate 
                        ? new Date(campaign.scheduledDate).toLocaleDateString()
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(campaign)}
                        >
                          Edit
                        </Button>
                        {campaign.status === 'draft' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(campaign.id, 'scheduled')}
                          >
                            Schedule
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setEditingCampaign(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
            </DialogTitle>
          </DialogHeader>
          <CampaignForm
            campaign={editingCampaign}
            onSubmit={handleSaveCampaign}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingCampaign(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Campaigns;
