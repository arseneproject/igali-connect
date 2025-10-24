import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MessageSquare, Share2 } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function CommunicationControl() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Communication Control</h1>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Communication Control</h1>
              <p className="text-muted-foreground">Oversee all emails, SMS, and social media posts</p>
            </div>

            <Tabs defaultValue="emails" className="space-y-4">
              <TabsList>
                <TabsTrigger value="emails">
                  <Mail className="h-4 w-4 mr-2" />
                  Emails
                </TabsTrigger>
                <TabsTrigger value="sms">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  SMS
                </TabsTrigger>
                <TabsTrigger value="posts">
                  <Share2 className="h-4 w-4 mr-2" />
                  Social Posts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="emails">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Communications</CardTitle>
                    <CardDescription>Monitor and manage all email campaigns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                      Email communication dashboard coming soon
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sms">
                <Card>
                  <CardHeader>
                    <CardTitle>SMS Communications</CardTitle>
                    <CardDescription>Monitor and manage SMS campaigns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                      SMS communication dashboard coming soon
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="posts">
                <Card>
                  <CardHeader>
                    <CardTitle>Social Media Posts</CardTitle>
                    <CardDescription>Monitor and manage social media activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                      Social media dashboard coming soon
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
