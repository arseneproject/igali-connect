import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
// Auth Imported Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// Super Admin Imported Pages
import SuperAdminDashboard from "./pages/superadmin/pages/SuperAdminDashboard";
import NotFound from "./pages/NotFound";
// Addmin Imported Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import CampaignMonitoring from "./pages/admin/CampaignMonitoring";
import CommunicationControl from "./pages/admin/CommunicationControl";
import AutomationManagement from "./pages/admin/AutomationManagement";
import ContactOverview from "./pages/admin/ContactOverview";
import Notifications from "./pages/admin/Notifications";
import IntegrationSettings from "./pages/admin/IntegrationSettings";
import ReportsAndLogs from "./pages/admin/ReportsAndLogs";
import AdminSettings from "./pages/admin/AdminSettings";
import SupportTools from "./pages/admin/SupportTools";
// Marketer Imported Pages
import MarketerDashboard from "./pages/marketer/pages/MarketerDashboard";
import MarketerContacts from "./pages/marketer/pages/Contacts";
import MarketerAutomations from "./pages/marketer/pages/Automations";
import MarketerSocial from "./pages/marketer/pages/Social";
import MarketerTemplates from "./pages/marketer/pages/Templates";
import MarketerAnalytics from "./pages/marketer/pages/Analytics";
import MarketerNotifications from "./pages/marketer/pages/Notifications";
import MarketerIntegrations from "./pages/marketer/pages/Integrations";
import MarketerProfile from "./pages/marketer/pages/Profile";
import MarketerHelp from "./pages/marketer/pages/Help";
import  Campaigns  from "./pages/marketer/pages/Campaigns";
// Sales Imported Pages
import SalesDashboard from "./pages/sales/pages/SalesDashboard";
import ContactsDirectory from "./pages/sales/pages/ContactsDirectory";
import Conversations from "./pages/sales/pages/Conversations";
import FollowUps from "./pages/sales/pages/FollowUps";
import Help from "./pages/sales/pages/Help";
import SalesNotifications from "./pages/sales/pages/Notifications";
import Performance from "./pages/sales/pages/Performance";
import Profile from "./pages/sales/pages/Profile";
import Leads from "./pages/sales/pages/Leads";
import Search from "./pages/sales/pages/Search";
import SalesTags from "./pages/sales/pages/SalesTags";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/campaigns"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CampaignMonitoring />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/communications"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CommunicationControl />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/automations"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AutomationManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/contacts"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ContactOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/integrations"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <IntegrationSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ReportsAndLogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/support"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SupportTools />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketer"
              element={
                <ProtectedRoute allowedRoles={['marketer']}>
                  <MarketerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketer/contacts/*"
              element={
                <ProtectedRoute allowedRoles={['marketer']}>
                  <MarketerContacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketer/campaigns/*"
              element={
                <ProtectedRoute allowedRoles={['marketer']}>
                  <Campaigns />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketer/automations/*"
              element={
                <ProtectedRoute allowedRoles={['marketer']}>
                  <MarketerAutomations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketer/social/*"
              element={
                <ProtectedRoute allowedRoles={['marketer']}>
                  <MarketerSocial />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketer/templates/*"
              element={
                <ProtectedRoute allowedRoles={['marketer']}>
                  <MarketerTemplates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketer/analytics"
              element={
                <ProtectedRoute allowedRoles={['marketer']}>
                  <MarketerAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketer/notifications"
              element={
                <ProtectedRoute allowedRoles={['marketer']}>
                  <MarketerNotifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketer/integrations"
              element={
                <ProtectedRoute allowedRoles={['marketer']}>
                  <MarketerIntegrations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketer/profile"
              element={
                <ProtectedRoute allowedRoles={['marketer']}>
                  <MarketerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketer/help"
              element={
                <ProtectedRoute allowedRoles={['marketer']}>
                  <MarketerHelp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoute allowedRoles={['sales']}>
                  <SalesDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/contacts"
              element={
                <ProtectedRoute allowedRoles={['sales']}>
                  <ContactsDirectory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/conversations"
              element={
                <ProtectedRoute allowedRoles={['sales']}>
                  <Conversations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/follow-ups"
              element={
                <ProtectedRoute allowedRoles={['sales']}>
                  <FollowUps />
                </ProtectedRoute>
              }

            />
            <Route
              path="/sales/help"
              element={
                <ProtectedRoute allowedRoles={['sales']}>
                  <Help />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/notifications"
              element={
                <ProtectedRoute allowedRoles={['sales']}>
                  <SalesNotifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/performance"
              element={
                <ProtectedRoute allowedRoles={['sales']}>
                  <Performance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/profile"
              element={
                <ProtectedRoute allowedRoles={['sales']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/leads"
              element={
                <ProtectedRoute allowedRoles={['sales']}>
                  <Leads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/search"
              element={
                <ProtectedRoute allowedRoles={['sales']}>
                  <Search />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/tags"
              element={
                <ProtectedRoute allowedRoles={['sales']}>
                  <SalesTags />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
