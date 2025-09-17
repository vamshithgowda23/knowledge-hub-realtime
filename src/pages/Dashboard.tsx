import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StudentDashboard from '@/components/StudentDashboard';
import TeacherDashboard from '@/components/TeacherDashboard';
import { Button } from '@/components/ui/button';
import { LogOut, BookOpen } from 'lucide-react';

const Dashboard = () => {
  const { profile, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-slide-up">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
            <BookOpen className="h-8 w-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-muted-foreground text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">No profile found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <h1 className="text-lg sm:text-2xl font-bold text-gradient">EduConnect</h1>
            </div>
            <div className="hidden md:block h-6 w-px bg-border"></div>
            <div className="hidden md:block">
              <p className="text-lg font-semibold text-foreground">
                Welcome back, {profile.full_name}
              </p>
              <p className="text-sm text-muted-foreground capitalize">
                {profile.role} Dashboard
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={signOut} 
            size="sm"
            className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="animate-fade-in-delay">
          {profile.role === 'student' ? (
            <StudentDashboard />
          ) : (
            <TeacherDashboard />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;