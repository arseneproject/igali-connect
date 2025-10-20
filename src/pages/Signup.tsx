import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Lock, User, Building2, MapPin, Phone } from "lucide-react";

const Signup = () => {
  // Company fields
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  
  // Admin user fields
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup({
        companyName,
        businessType,
        location,
        companyEmail,
        companyPhone,
        adminName,
        adminEmail,
        password
      });
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-2xl shadow-elegant animate-scale-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Register Your Business</CardTitle>
          <CardDescription className="text-center">
            Create your company account and start automating your marketing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Company Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Your Company Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select value={businessType} onValueChange={setBusinessType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      type="text"
                      placeholder="City, Country"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyPhone"
                      type="tel"
                      placeholder="+250 788 123 456"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyEmail">Company Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyEmail"
                    type="email"
                    placeholder="contact@yourcompany.com"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Admin Account */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Admin Account</h3>
              
              <div className="space-y-2">
                <Label htmlFor="adminName">Admin Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="adminName"
                    type="text"
                    placeholder="John Doe"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="admin@yourcompany.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !businessType}>
              {loading ? "Creating Account..." : "Register Business"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
            <div className="mt-2">
              <Link to="/" className="text-muted-foreground hover:underline">
                ← Home
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
