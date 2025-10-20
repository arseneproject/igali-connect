import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart3, Mail, MessageSquare, Plus, Share2, Users, Edit, Trash2, Play, Pause } from "lucide-react";
import { CampaignForm } from "@/components/CampaignForm";
import { Campaign, CampaignStatus, CampaignType } from "@/types/campaign";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const menuItems = [
    { label: "Dashboard", path: "/marketer", icon: <BarChart3 className="h-4 w-4" /> },
    { label: "Campaigns", path: "/marketer/campaigns", icon: <Mail className="h-4 w-4" /> },
    { label: "Contacts", path: "/marketer/contacts", icon: <Users className="h-4 w-4" /> },
    { label: "Analytics", path: "/marketer/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  ];

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = () => {
    const stored = localStorage.getItem('campaigns');
    if (stored) {
      setCampaigns(JSON.parse(stored));
    }
  };

  const saveCampaigns = (updatedCampaigns: Campaign[]) => {
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    setCampaigns(updatedCampaigns);
  };

  const handleCreateCampaign = (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveCampaigns([...campaigns, newCampaign]);
    setIsCreateOpen(false);
    toast({
      title: "Campaign created",
      description: "Your campaign has been created successfully.",
    });
  };

  const handleUpdateCampaign = (updated: Campaign) => {
    const updatedCampaigns = campaigns.map(c => 
      c.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : c
    );
    saveCampaigns(updatedCampaigns);
    setEditingCampaign(null);
    toast({
      title: "Campaign updated",
      description: "Your campaign has been updated successfully.",
    });
  };

  const handleDeleteCampaign = (id: string) => {
    const updatedCampaigns = campaigns.filter(c => c.id !== id);
    saveCampaigns(updatedCampaigns);
    setDeletingId(null);
    toast({
      title: "Campaign deleted",
      description: "Your campaign has been deleted successfully.",
    });
  };

  const handleStatusChange = (id: string, newStatus: CampaignStatus) => {
    const updatedCampaigns = campaigns.map(c =>
      c.id === id ? { ...c, status: newStatus, updatedAt: new Date().toISOString() } : c
    );
    saveCampaigns(updatedCampaigns);
    toast({
      title: "Status updated",
      description: `Campaign status changed to ${newStatus}.`,
    });
  };

  const getTypeIcon = (type: CampaignType) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'social':
        return <Share2 className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: CampaignStatus) => {
    const variants = {
      draft: "secondary",
      scheduled: "default",
      running: "default",
      completed: "secondary",
    } as const;

    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const stats = {
    email: campaigns.filter(c => c.type === 'email').length,
    sms: campaigns.filter(c => c.type === 'sms').length,
    social: campaigns.filter(c => c.type === 'social').length,
    active: campaigns.filter(c => c.status === 'running').length,
  };

  return (
    <DashboardLayout title="Campaign Management" menuItems={menuItems}>
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.email}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Campaigns</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sms}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social Posts</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.social}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Campaigns</CardTitle>
              <CardDescription>Manage your marketing campaigns</CardDescription>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new marketing campaign
                  </DialogDescription>
                </DialogHeader>
                <CampaignForm onSubmit={handleCreateCampaign} onCancel={() => setIsCreateOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No campaigns yet. Create your first campaign to get started!</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(campaign.type)}
                        <span className="capitalize">{campaign.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>
                      {campaign.scheduledDate
                        ? new Date(campaign.scheduledDate).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell>{campaign.targetAudience.length} contacts</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {campaign.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStatusChange(campaign.id, 'scheduled')}
                            title="Schedule"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {campaign.status === 'running' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStatusChange(campaign.id, 'completed')}
                            title="Complete"
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        )}
                        <Dialog open={editingCampaign?.id === campaign.id} onOpenChange={(open) => !open && setEditingCampaign(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingCampaign(campaign)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Campaign</DialogTitle>
                              <DialogDescription>
                                Update your campaign details
                              </DialogDescription>
                            </DialogHeader>
                            {editingCampaign && (
                              <CampaignForm
                                campaign={editingCampaign}
                                onSubmit={handleUpdateCampaign}
                                onCancel={() => setEditingCampaign(null)}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingId(campaign.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
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

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the campaign.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingId && handleDeleteCampaign(deletingId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Campaigns;
