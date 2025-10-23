import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import MarketerDashboard from "./pages/MarketerDashboard";
import SalesDashboard from "./pages/SalesDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Campaigns from "./pages/Campaigns";
import NotFound from "./pages/NotFound";
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
              path="/marketer/campaigns"
              element={
                <ProtectedRoute allowedRoles={['marketer']}>
                  <Campaigns />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
