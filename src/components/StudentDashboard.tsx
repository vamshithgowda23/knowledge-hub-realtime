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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
                <SelectTrigger>
                  <SelectValue placeholder="Choose a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.user_id}>
                      {teacher.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="question" className="text-sm font-medium">
                Your Question
              </label>
              <Textarea
                id="question"
                placeholder="Type your question here..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                rows={4}
              />
            </div>
            <Button type="submit" disabled={loading || !newQuestion.trim() || !selectedTeacher} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              {loading ? 'Submitting...' : 'Submit Question'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Your Questions</h3>
        {questions.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No questions yet. Ask your first question above!</p>
            </CardContent>
          </Card>
        ) : (
          questions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={question.status === 'answered' ? 'default' : 'secondary'}>
                        {question.status === 'answered' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {question.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        To: {question.profiles.full_name}
                      </span>
                    </div>
                    <CardTitle className="text-base">{question.content}</CardTitle>
                    <CardDescription>
                      Asked on {new Date(question.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              {question.answers && question.answers.length > 0 && (
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Answer:</h4>
                    {question.answers.map((answer) => (
                      <div key={answer.id}>
                        <p className="text-foreground mb-2">{answer.content}</p>
                        <p className="text-xs text-muted-foreground">
                          Answered by {answer.profiles.full_name} on{' '}
                          {new Date(answer.created_at).toLocaleDateString()}
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