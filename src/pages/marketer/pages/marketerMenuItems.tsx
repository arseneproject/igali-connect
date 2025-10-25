import { 
    Mail, 
    MessageSquare, 
    Share2, 
    Users, 
    BarChart3, 
    Settings, 
    Activity, 
    Puzzle, 
    Bell, 
    Link2, 
    UserCircle, 
    HelpCircle 
  } from "lucide-react";
  
  export const marketerMenuItems = [
    { 
      label: "Overview", 
      path: "/marketer", 
      icon: <BarChart3 className="h-4 w-4" />,
      description: "Dashboard overview and key metrics"
    },
    { 
      label: "Contacts", 
      path: "/marketer/contacts", 
      icon: <Users className="h-4 w-4" />,
      description: "Manage your contact lists"
    },
    { 
      label: "Campaigns", 
      path: "/marketer/campaigns", 
      icon: <Mail className="h-4 w-4" />,
      description: "Create and manage campaigns"
    },
    { 
      label: "Automations", 
      path: "/marketer/automations", 
      icon: <Settings className="h-4 w-4" />,
      description: "Setup marketing workflows"
    },
    { 
      label: "Social Media", 
      path: "/marketer/social", 
      icon: <Share2 className="h-4 w-4" />,
      description: "Manage social media posts"
    },
    { 
      label: "Templates", 
      path: "/marketer/templates", 
      icon: <Puzzle className="h-4 w-4" />,
      description: "Message and email templates"
    },
    { 
      label: "Analytics", 
      path: "/marketer/analytics", 
      icon: <Activity className="h-4 w-4" />,
      description: "Campaign performance metrics"
    },
    { 
      label: "Notifications", 
      path: "/marketer/notifications", 
      icon: <Bell className="h-4 w-4" />,
      description: "System notifications"
    },
    { 
      label: "Integrations", 
      path: "/marketer/integrations", 
      icon: <Link2 className="h-4 w-4" />,
      description: "Manage connected services"
    },
    { 
      label: "Profile", 
      path: "/marketer/profile", 
      icon: <UserCircle className="h-4 w-4" />,
      description: "Account settings"
    },
    { 
      label: "Help", 
      path: "/marketer/help", 
      icon: <HelpCircle className="h-4 w-4" />,
      description: "Support and documentation"
    },
  ];
  