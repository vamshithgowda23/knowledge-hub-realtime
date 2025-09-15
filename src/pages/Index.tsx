import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, MessageSquare, Shield, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="h-20 w-20 text-primary" />
          </div>
          <h1 className="mb-4 text-5xl font-bold text-foreground">EduConnect</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Connect students and teachers in a seamless learning environment
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-6 rounded-lg border bg-card">
              <BookOpen className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">For Students</h3>
              <p className="text-muted-foreground text-sm">
                Ask questions, get personalized help, and track your learning progress
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">For Teachers</h3>
              <p className="text-muted-foreground text-sm">
                Answer student questions, provide guidance, and support learning
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <Button asChild size="lg" className="w-full md:w-auto">
            <Link to="/auth">Get Started</Link>
          </Button>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Real-time Q&A
            </span>
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Secure Platform
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              Instant Notifications
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
