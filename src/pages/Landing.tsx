import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, MessageSquare, Share2, BarChart3, Users, Zap } from "lucide-react";

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
      <section className="py-20 bg-muted/30">
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
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 MarketFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
