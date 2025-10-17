import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, MessageSquare, Share2, BarChart3, Users, Zap, Check, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">MarketFlow</h1>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-5xl font-bold mb-6 text-foreground">
              Automate Your Marketing,
              <span className="text-primary"> Amplify Your Results</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Free Marketing Automation Platform for Email, SMS, and Social Media. 
              Manage campaigns, track leads, and grow your business—all in one place.
            </p>
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 shadow-elegant">
                Start Free Today <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Everything You Need to Succeed</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-elegant border animate-scale-in">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Email Marketing</h4>
              <p className="text-muted-foreground">
                Create beautiful email campaigns with personalization, scheduling, and delivery tracking.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-elegant border animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-secondary" />
              </div>
              <h4 className="text-xl font-semibold mb-3">SMS Campaigns</h4>
              <p className="text-muted-foreground">
                Reach customers instantly with SMS automation. Schedule messages and track responses.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-elegant border animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-accent" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Social Media</h4>
              <p className="text-muted-foreground">
                Post to Facebook, Instagram, and Twitter from one dashboard. Schedule and automate posts.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-elegant border animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Analytics & Reports</h4>
              <p className="text-muted-foreground">
                Track campaign performance, engagement metrics, and ROI with detailed analytics.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-elegant border animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Contact Management</h4>
              <p className="text-muted-foreground">
                Organize contacts, segment audiences, and manage leads all in one centralized system.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-elegant border animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Automation Workflows</h4>
              <p className="text-muted-foreground">
                Set up triggers and actions to automate repetitive tasks and nurture leads automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-4">How It Works</h3>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Get started with MarketFlow in three simple steps
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-semibold mb-3">Register Your Business</h4>
              <p className="text-muted-foreground">
                Create your company account with business details and get instant access to the platform.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-2xl font-bold text-secondary-foreground mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-semibold mb-3">Add Your Team</h4>
              <p className="text-muted-foreground">
                Invite marketers and sales team members. Assign roles and manage permissions easily.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-2xl font-bold text-accent-foreground mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-semibold mb-3">Launch Campaigns</h4>
              <p className="text-muted-foreground">
                Create, automate, and track your marketing campaigns across email, SMS, and social media.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-4">Frequently Asked Questions</h3>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Everything you need to know about MarketFlow
          </p>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is MarketFlow really free?</AccordionTrigger>
              <AccordionContent>
                Yes! MarketFlow is completely free to use. We provide all core features including email marketing, SMS campaigns, social media automation, and analytics at no cost.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How many team members can I add?</AccordionTrigger>
              <AccordionContent>
                You can add unlimited team members to your company account. Assign them roles as admins, marketers, or sales representatives based on their responsibilities.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What types of campaigns can I create?</AccordionTrigger>
              <AccordionContent>
                MarketFlow supports email marketing, SMS campaigns, and social media posts. You can schedule campaigns, personalize messages, and track performance across all channels.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I integrate with other platforms?</AccordionTrigger>
              <AccordionContent>
                Yes, MarketFlow integrates with popular platforms including Facebook, Instagram, Twitter, and various email service providers. Connect your accounts in the settings dashboard.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>How secure is my data?</AccordionTrigger>
              <AccordionContent>
                We take security seriously. All data is encrypted, and we follow industry best practices to protect your business information and customer contacts.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>Do I need technical knowledge to use MarketFlow?</AccordionTrigger>
              <AccordionContent>
                Not at all! MarketFlow is designed to be user-friendly. Our intuitive interface makes it easy for anyone to create and manage marketing campaigns without technical expertise.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-6">Ready to Transform Your Marketing?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of marketers automating their campaigns and growing their businesses.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Column 1: Logo and About */}
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">MarketFlow</h3>
              <p className="text-muted-foreground text-sm">
                Free Marketing Automation Platform empowering businesses to automate email, SMS, and social media campaigns. Manage your marketing efforts efficiently, all in one place.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/signup" className="text-muted-foreground hover:text-primary transition-colors">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:info@marketflow.com" className="hover:text-primary transition-colors">
                    info@marketflow.com
                  </a>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href="tel:+250788123456" className="hover:text-primary transition-colors">
                    +250 788 123 456
                  </a>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Kigali, Rwanda</span>
                </li>
              </ul>
              <div className="flex gap-3 mt-4">
                <a href="#" className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2025 MarketFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
