import { NavLink } from "react-router-dom";
import {
  Users,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Zap,
  ContactRound,
  Bell,
  Settings,
  FileText,
  Wrench,
  BarChart3,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const adminNavItems = [
  {
    title: "System Overview",
    url: "/admin",
    icon: LayoutDashboard,
    description: "Key metrics and analytics",
  },
  {
    title: "User Management",
    url: "/admin/users",
    icon: Users,
    description: "Manage users, roles, access",
  },
  {
    title: "Campaign Monitoring",
    url: "/admin/campaigns",
    icon: BarChart3,
    description: "View all marketer campaigns",
  },
  {
    title: "Communication Control",
    url: "/admin/communications",
    icon: MessageSquare,
    description: "Oversee emails, SMS, posts",
  },
  {
    title: "Automation Management",
    url: "/admin/automations",
    icon: Zap,
    description: "Manage and audit automations",
  },
  {
    title: "Contact Overview",
    url: "/admin/contacts",
    icon: ContactRound,
    description: "Manage contacts system-wide",
  },
  {
    title: "Notifications",
    url: "/admin/notifications",
    icon: Bell,
    description: "System and event alerts",
  },
  {
    title: "Integration Settings",
    url: "/admin/integrations",
    icon: Settings,
    description: "Manage API keys",
  },
  {
    title: "Reports & Logs",
    url: "/admin/reports",
    icon: FileText,
    description: "Generate full reports",
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    description: "Branding and limits",
  },
  {
    title: "Support Tools",
    url: "/admin/support",
    icon: Wrench,
    description: "Announcements, backups",
  },
];

export function AdminSidebar() {
  const { user, company, logout } = useAuth();
  const navigate = useNavigate();
  const { open } = useSidebar();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <Mail className="h-6 w-6 text-primary" />
          {open && (
            <div className="flex flex-col">
              <h2 className="text-lg font-bold">MarketFlow</h2>
              {company && (
                <p className="text-xs text-muted-foreground">
                  {company.companyName}
                </p>
              )}
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.description}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className={({ isActive }) =>
                        isActive ? "bg-accent text-accent-foreground" : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex flex-col gap-2">
          {open && (
            <div className="mb-2">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role}
              </p>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4" />
            {open && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
