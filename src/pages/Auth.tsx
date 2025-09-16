import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Users } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });
  
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: '' as 'student' | 'teacher' | ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(signInData.email, signInData.password);
    
    if (!error) {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.role) return;
    
    setLoading(true);
    
    const { error, needsConfirmation } = await signUp(
      signUpData.email,
      signUpData.password,
      signUpData.fullName,
      signUpData.role
    );
    
    if (!error && !needsConfirmation) {
      navigate('/dashboard');
    }
    // If needsConfirmation is true, user stays on auth page with the toast message
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 hero-gradient opacity-5"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10 px-4">
        <div className="text-center mb-8 animate-slide-up">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <BookOpen className="h-16 w-16 text-primary" />
              <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-3">EduConnect</h1>
          <p className="text-muted-foreground text-lg">Connect students and teachers</p>
        </div>

        <Tabs defaultValue="signin" className="w-full animate-fade-in-delay">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="card-elevated">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription className="text-base">Sign in to your account to continue learning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="signin-email" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInData.email}
                      onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="signin-password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={signInData.password}
                      onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold" 
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="card-elevated">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <CardDescription className="text-base">Join our education platform today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSignUp} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="signup-name" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signUpData.fullName}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="signup-email" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a secure password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="role" className="text-sm font-medium">Choose Your Role</Label>
                    <Select value={signUpData.role} onValueChange={(value: 'student' | 'teacher') => setSignUpData(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">
                          <div className="flex items-center gap-3 py-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">Student</div>
                              <div className="text-xs text-muted-foreground">Learn from expert teachers</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="teacher">
                          <div className="flex items-center gap-3 py-2">
                            <Users className="h-5 w-5 text-success" />
                            <div>
                              <div className="font-medium">Teacher</div>
                              <div className="text-xs text-muted-foreground">Share knowledge with students</div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold" 
                    disabled={loading || !signUpData.role}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;