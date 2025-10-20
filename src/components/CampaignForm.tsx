import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Campaign, CampaignType, CampaignStatus } from "@/types/campaign";
import { Mail, MessageSquare, Share2 } from "lucide-react";

interface CampaignFormProps {
  campaign?: Campaign;
  onSubmit: (campaign: any) => void;
  onCancel: () => void;
}

export const CampaignForm = ({ campaign, onSubmit, onCancel }: CampaignFormProps) => {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    type: campaign?.type || 'email' as CampaignType,
    status: campaign?.status || 'draft' as CampaignStatus,
    subject: campaign?.subject || '',
    content: campaign?.content || '',
    scheduledDate: campaign?.scheduledDate || '',
    targetAudience: campaign?.targetAudience || [] as string[],
    attachments: campaign?.attachments || [] as string[],
    companyId: campaign?.companyId || localStorage.getItem('companyId') || '',
    createdBy: campaign?.createdBy || localStorage.getItem('userId') || '',
  });

  const [audienceInput, setAudienceInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (campaign) {
      onSubmit({ ...campaign, ...formData });
    } else {
      onSubmit(formData);
    }
  };

  const handleAddAudience = () => {
    if (audienceInput.trim()) {
      setFormData({
        ...formData,
        targetAudience: [...formData.targetAudience, audienceInput.trim()]
      });
      setAudienceInput('');
    }
  };

  const handleRemoveAudience = (index: number) => {
    setFormData({
      ...formData,
      targetAudience: formData.targetAudience.filter((_, i) => i !== index)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Campaign Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Enter campaign name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Campaign Type *</Label>
        <Select
          value={formData.type}
          onValueChange={(value: CampaignType) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Campaign
              </div>
            </SelectItem>
            <SelectItem value="sms">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS Campaign
              </div>
            </SelectItem>
            <SelectItem value="social">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Social Media Post
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.type === 'email' && (
        <div className="space-y-2">
          <Label htmlFor="subject">Email Subject *</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required={formData.type === 'email'}
            placeholder="Enter email subject"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="content">
          {formData.type === 'email' ? 'Email Content' : 
           formData.type === 'sms' ? 'SMS Message' : 
           'Social Media Post'} *
        </Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          placeholder={`Enter ${formData.type} content`}
          className="min-h-[120px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="scheduledDate">Schedule Date & Time</Label>
        <Input
          id="scheduledDate"
          type="datetime-local"
          value={formData.scheduledDate}
          onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Target Audiences</Label>
        <div className="flex gap-2">
          <Input
            value={audienceInput}
            onChange={(e) => setAudienceInput(e.target.value)}
            placeholder="Enter email, phone, or contact ID"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAudience())}
          />
          <Button type="button" onClick={handleAddAudience} variant="outline">
            Add
          </Button>
        </div>
        {formData.targetAudience.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.targetAudience.map((audience, index) => (
              <div
                key={index}
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {audience}
                <button
                  type="button"
                  onClick={() => handleRemoveAudience(index)}
                  className="hover:text-destructive"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: CampaignStatus) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {campaign ? 'Update Campaign' : 'Create Campaign'}
        </Button>
      </div>
    </form>
  );
};
