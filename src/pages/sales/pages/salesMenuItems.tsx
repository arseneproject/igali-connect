import {
  Users,
  MessageSquare,
  CalendarCheck,
  BarChart3,
  Bell,
  Folder,
  User,
  HelpCircle,
  Tag,
  Search,
} from "lucide-react";

export const salesMenuItems = [
  {
    label: "Overview",
    path: "/sales",
    icon: <BarChart3 className="h-4 w-4" />,
    description: "Sales dashboard overview and key metrics",
  },
  {
    label: "Leads",
    path: "/sales/leads",
    icon: <Users className="h-4 w-4" />,
    description:
      "View and manage leads assigned to you — filter by tag (Hot/Warm/Cold), source, search by name/company, update lead stage, add notes or reminders, mark follow-up done.",
  },
  {
    label: "Conversations",
    path: "/sales/conversations",
    icon: <MessageSquare className="h-4 w-4" />,
    description:
      "Message history per contact, quick replies (Email/SMS/WhatsApp), filter by message type and view delivery/read status.",
  },
  {
    label: "Follow-ups",
    path: "/sales/follow-ups",
    icon: <CalendarCheck className="h-4 w-4" />,
    description:
      "Contacts needing follow-up today, auto-generated from automations, mark completed or reschedule reminders.",
  },
  {
    label: "Performance",
    path: "/sales/performance",
    icon: <BarChart3 className="h-4 w-4" />,
    description:
      "Track sales metrics: leads converted, response rate, avg follow-up time, visual charts and exportable reports (CSV/PDF).",
  },
  {
    label: "Notifications",
    path: "/sales/notifications",
    icon: <Bell className="h-4 w-4" />,
    description:
      "Automation-triggered alerts (new lead assigned, contact replied), mark read/unread and clear old notifications.",
  },
  {
    label: "Contacts Directory",
    path: "/sales/contacts",
    icon: <Folder className="h-4 w-4" />,
    description:
      "Full contact info for assigned leads — company, phone, email, tags, filter by campaign/segment and add private notes.",
  },
  {
    label: "Search",
    path: "/sales/search",
    icon: <Search className="h-4 w-4" />,
    description:
      "Quick global search across leads, companies and conversations (name, company, contact status).",
  },
  {
    label: "Profile",
    path: "/sales/profile",
    icon: <User className="h-4 w-4" />,
    description: "Manage your profile and preferences.",
  },
  {
    label: "Help",
    path: "/sales/help",
    icon: <HelpCircle className="h-4 w-4" />,
    description: "Documentation and support for sales features.",
  },
  {
    label: "Tags",
    path: "/sales/tags",
    icon: <Tag className="h-4 w-4" />,
    description: "Manage lead tags (Hot/Warm/Cold) used for filtering and segments.",
  },
];
