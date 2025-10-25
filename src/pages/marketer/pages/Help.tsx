import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Book, 
  Mail, 
  MessageSquare, 
  Video, 
  HeadphonesIcon,
  ExternalLink
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { marketerMenuItems } from "@/data/marketerMenuItems";

const Help = () => {
  const menuItems = marketerMenuItems;

  const helpResources = [
    {
      title: "Getting Started",
      icon: <Book className="h-8 w-8" />,
      description: "Learn the basics",
      links: [
        { text: "Platform Overview", url: "#" },
        { text: "Creating Your First Campaign", url: "#" },
        { text: "Managing Contacts", url: "#" }
      ]
    },
    {
      title: "Video Tutorials",
      icon: <Video className="h-8 w-8" />,
      description: "Watch step-by-step guides",
      links: [
        { text: "Campaign Creation Tutorial", url: "#" },
        { text: "Automation Setup Guide", url: "#" },
        { text: "Analytics Dashboard Overview", url: "#" }
      ]
    },
    {
      title: "Support",
      icon: <HeadphonesIcon className="h-8 w-8" />,
      description: "Get help when you need it",
      links: [
        { text: "Contact Support", url: "#" },
        { text: "Schedule a Demo", url: "#" },
        { text: "Report an Issue", url: "#" }
      ]
    }
  ];

  const faqItems = [
    {
      question: "How do I create my first campaign?",
      answer: "Navigate to the Campaigns section and click 'Create New Campaign'. Choose your campaign type (Email, SMS, or Social) and follow the step-by-step wizard to set up your campaign."
    },
    {
      question: "How can I import contacts?",
      answer: "Go to the Contacts section and click 'Import Contacts'. You can upload a CSV file with your contacts or manually add them one by one."
    },
    {
      question: "How do automation workflows work?",
      answer: "Automation workflows allow you to create triggered sequences of actions. Visit the Automations section to create workflows based on specific triggers like new subscriber, email opened, or link clicked."
    },
    {
      question: "How do I connect social media accounts?",
      answer: "Visit the Integrations section and click on the social media platform you want to connect. Follow the authentication process to link your accounts."
    }
  ];

  return (
    <DashboardLayout title="Help & Documentation" menuItems={menuItems}>
      {/* Search Bar */}
      <div className="relative mb-8">
        <Input 
          placeholder="Search help articles..."
          className="pl-10"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      </div>

      {/* Help Resources Grid */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {helpResources.map((resource, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                {resource.icon}
              </div>
              <CardTitle className="mt-4">{resource.title}</CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {resource.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-left"
                      onClick={() => window.open(link.url, '_blank')}
                    >
                      {link.text}
                      <ExternalLink className="h-3 w-3 ml-1 inline" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Still Need Help?</CardTitle>
          <CardDescription>
            Our support team is available 24/7 to assist you
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button>
            <Mail className="h-4 w-4 mr-2" />
            Email Support
          </Button>
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Live Chat
          </Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Help;
