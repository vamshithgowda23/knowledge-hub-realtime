import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, MessageCircle, Star, Award, Clock, ArrowRight, CheckCircle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gradient">EduConnect</span>
          </div>
          <Button onClick={() => navigate('/auth')} variant="default" size="sm">
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-slide-up">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <BookOpen className="h-20 w-20 text-primary" />
                <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl"></div>
              </div>
            </div>
            <h1 className="text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              Welcome to <span className="text-gradient">EduConnect</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect students and teachers in a collaborative learning environment. 
              Ask questions, get answers, and excel together in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-delay">
              <Button 
                onClick={() => navigate('/auth')} 
                size="lg"
                variant="premium"
                className="text-lg px-12 py-4 group"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-12 py-4"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="animate-slide-up">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Active Students</div>
            </div>
            <div className="animate-slide-up">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Expert Teachers</div>
            </div>
            <div className="animate-slide-up">
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Questions Answered</div>
            </div>
            <div className="animate-slide-up">
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Why Choose EduConnect?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of education with our comprehensive platform designed for modern learning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-elevated interactive-hover">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-2xl w-fit">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Real-time Q&A</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Ask questions and get instant answers from teachers and peers with our real-time messaging system.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-elevated interactive-hover">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-success/10 rounded-2xl w-fit">
                  <Users className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-xl">Collaborative Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Connect with students and teachers worldwide in a supportive, interactive community environment.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-elevated interactive-hover">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-warning/10 rounded-2xl w-fit">
                  <Award className="h-8 w-8 text-warning" />
                </div>
                <CardTitle className="text-xl">Expert Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Learn from verified, qualified teachers and subject matter experts who care about your success.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-elevated interactive-hover">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-2xl w-fit">
                  <Star className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Quality Content</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Access high-quality educational content and curated resources tailored to your learning needs.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-elevated interactive-hover">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-2xl w-fit">
                  <Clock className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-xl">24/7 Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Learn at your own pace with round-the-clock access to materials, support, and community.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-elevated interactive-hover">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-2xl w-fit">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Rich Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Access a comprehensive library of materials, interactive tutorials, and practice exercises.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">
                Transform Your Learning Experience
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Personalized Learning Paths</h4>
                    <p className="text-muted-foreground">Adaptive content that adjusts to your learning style and pace</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Interactive Assessments</h4>
                    <p className="text-muted-foreground">Real-time feedback and progress tracking for better outcomes</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Global Community</h4>
                    <p className="text-muted-foreground">Connect with learners and educators from around the world</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="card-gradient p-8">
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold text-primary">4.9/5</div>
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">Average rating from 10,000+ users</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl lg:text-2xl mb-12 text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students and teachers already transforming education with EduConnect
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              onClick={() => navigate('/auth')} 
              size="lg"
              variant="premium"
              className="text-lg px-12 py-4 group"
            >
              Join EduConnect Today
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="text-lg px-12 py-4"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gradient">EduConnect</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Empowering education through technology and community.
          </p>
          <p className="text-sm text-muted-foreground">
            © 2024 EduConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
