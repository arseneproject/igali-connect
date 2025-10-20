export type CampaignType = 'email' | 'sms' | 'social';
export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'completed';

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  subject?: string; // For email campaigns
  content: string;
  scheduledDate?: string;
  targetAudience: string[];
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  companyId: string;
  createdBy: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  segment?: string;
}
