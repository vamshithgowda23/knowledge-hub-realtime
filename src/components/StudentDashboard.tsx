import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send, Clock, CheckCircle } from 'lucide-react';

interface Teacher {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
}

interface Question {
  id: string;
  content: string;
  status: 'pending' | 'answered';
  created_at: string;
  teacher_id: string;
  profiles: { full_name: string };
  answers?: {
    id: string;
    content: string;
    created_at: string;
    teacher_id: string;
    profiles: { full_name: string };
  }[];
}

interface Answer {
  id: string;
  content: string;
  created_at: string;
  teacher_id: string;
  profiles: { full_name: string };
}

const StudentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeachers();
    fetchQuestions();
    
    // Set up real-time subscriptions
    const questionsChannel = supabase
      .channel('student-questions')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'questions',
          filter: `student_id=eq.${user?.id}`
        },
        () => {
          fetchQuestions();
          toast({
            title: "Question Updated",
            description: "A teacher has responded to your question!"
          });
        }
      )
      .subscribe();

    const answersChannel = supabase
      .channel('student-answers')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'answers'
        },
        (payload) => {
          // Check if this answer is for the current student's question
          checkIfAnswerForStudent(payload.new.question_id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(questionsChannel);
      supabase.removeChannel(answersChannel);
    };
  }, [user?.id]);

  const checkIfAnswerForStudent = async (questionId: string) => {
    const { data } = await supabase
      .from('questions')
      .select('student_id')
      .eq('id', questionId)
      .eq('student_id', user?.id)
      .single();
    
    if (data) {
      fetchQuestions();
      toast({
        title: "New Answer",
        description: "A teacher has answered your question!"
      });
    }
  };

  const fetchTeachers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'teacher');
    
    if (data) {
      setTeachers(data);
    }
  };

  const fetchQuestions = async () => {
    const { data } = await supabase
      .from('questions')
      .select(`
        *,
        profiles!questions_teacher_id_fkey(full_name),
        answers(
          *,
          profiles!answers_teacher_id_fkey(full_name)
        )
      `)
      .eq('student_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (data) {
      setQuestions(data as unknown as Question[]);
    }
  };

  const submitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !selectedTeacher) return;
    
    setLoading(true);
    
    const { error } = await supabase
      .from('questions')
      .insert({
        content: newQuestion,
        student_id: user?.id,
        teacher_id: selectedTeacher
      });
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit question",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Question submitted successfully!"
      });
      setNewQuestion('');
      setSelectedTeacher('');
      fetchQuestions();
    }
    
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Student Portal</h2>
        <p className="text-muted-foreground">Ask questions and get answers from your teachers</p>
      </div>

      {/* Ask Question Form */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <MessageSquare className="h-5 w-5" />
            Ask a Question
          </CardTitle>
          <CardDescription>
            Submit your question to a teacher and get personalized help
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitQuestion} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="teacher" className="text-sm font-medium">
                Select Teacher
              </label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose a teacher to ask your question" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.user_id}>
                      <div className="flex items-center gap-2 py-1">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {teacher.full_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium">{teacher.full_name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTeacher && teachers.find(t => t.user_id === selectedTeacher) && (
                <div className="flex items-center gap-2 text-sm text-success mt-2 p-3 bg-success/10 rounded-lg">
                  <span className="font-medium">Selected Teacher:</span>
                  <span className="text-success-foreground">
                    {teachers.find(t => t.user_id === selectedTeacher)?.full_name}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="question" className="text-sm font-medium">
                Your Question
              </label>
              <Textarea
                id="question"
                placeholder="Describe your question in detail. The more specific you are, the better help you'll receive..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading || !newQuestion.trim() || !selectedTeacher} 
              className="w-full h-12 text-base font-semibold"
            >
              <Send className="h-4 w-4 mr-2" />
              {loading ? 'Submitting Question...' : 'Submit Question'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Your Questions</h3>
        {questions.length === 0 ? (
          <Card className="card-elevated">
            <CardContent className="pt-6 text-center py-12">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">No questions yet</p>
              <p className="text-sm text-muted-foreground">Ask your first question above to get started!</p>
            </CardContent>
          </Card>
        ) : (
          questions.map((question) => (
            <Card key={question.id} className="card-elevated">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge 
                        variant={question.status === 'answered' ? 'default' : 'secondary'}
                        className="font-medium"
                      >
                        {question.status === 'answered' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {question.status === 'answered' ? 'Answered' : 'Pending Response'}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>Asked to:</span>
                        <span className="font-semibold text-primary">
                          {question.profiles.full_name}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-base mb-2 leading-relaxed">{question.content}</CardTitle>
                    <CardDescription>
                      Asked on {new Date(question.created_at).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              {question.answers && question.answers.length > 0 && (
                <CardContent>
                  <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <h4 className="font-semibold text-success">Answer from {question.profiles.full_name}:</h4>
                    </div>
                    {question.answers.map((answer) => (
                      <div key={answer.id}>
                        <p className="text-foreground mb-3 leading-relaxed">{answer.content}</p>
                        <p className="text-xs text-muted-foreground">
                          Answered on {new Date(answer.created_at).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;