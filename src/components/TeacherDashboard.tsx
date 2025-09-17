import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Reply, Clock, CheckCircle, User } from 'lucide-react';

interface Student {
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
  student_id: string;
  profiles: { full_name: string };
  answers?: {
    id: string;
    content: string;
    created_at: string;
    teacher_id: string;
  }[];
}

interface Answer {
  id: string;
  content: string;
  created_at: string;
  teacher_id: string;
}

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answerText, setAnswerText] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchQuestions();
    
    // Set up real-time subscription for new questions
    const questionsChannel = supabase
      .channel('teacher-questions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'questions',
          filter: `teacher_id=eq.${user?.id}`
        },
        () => {
          fetchQuestions();
          toast({
            title: "New Question",
            description: "A student has asked you a question!"
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(questionsChannel);
    };
  }, [user?.id]);

  const fetchQuestions = async () => {
    const { data } = await supabase
      .from('questions')
      .select(`
        *,
        profiles!questions_student_id_fkey(full_name),
        answers(*)
      `)
      .eq('teacher_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (data) {
      setQuestions(data as unknown as Question[]);
    }
  };

  const submitAnswer = async (questionId: string) => {
    const answer = answerText[questionId];
    if (!answer?.trim()) return;
    
    setLoading(prev => ({ ...prev, [questionId]: true }));
    
    // Insert the answer
    const { error: answerError } = await supabase
      .from('answers')
      .insert({
        question_id: questionId,
        teacher_id: user?.id,
        content: answer
      });
    
    if (answerError) {
      toast({
        title: "Error",
        description: "Failed to submit answer",
        variant: "destructive"
      });
    } else {
      // Update question status to answered
      const { error: updateError } = await supabase
        .from('questions')
        .update({ status: 'answered' })
        .eq('id', questionId);
      
      if (updateError) {
        toast({
          title: "Warning",
          description: "Answer submitted but failed to update status",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Answer submitted successfully!"
        });
        setAnswerText(prev => ({ ...prev, [questionId]: '' }));
        fetchQuestions();
      }
    }
    
    setLoading(prev => ({ ...prev, [questionId]: false }));
  };

  const pendingQuestions = questions.filter(q => q.status === 'pending');
  const answeredQuestions = questions.filter(q => q.status === 'answered');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Teacher Portal</h2>
        <p className="text-muted-foreground">Help your students by answering their questions</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-500">{pendingQuestions.length}</p>
                <p className="text-sm text-muted-foreground">Pending Questions</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-success">{answeredQuestions.length}</p>
                <p className="text-sm text-muted-foreground">Answered Questions</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{questions.length}</p>
                <p className="text-sm text-muted-foreground">Total Questions</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Questions */}
      {pendingQuestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Pending Questions ({pendingQuestions.length})
          </h3>
          {pendingQuestions.map((question) => (
            <Card key={question.id} className="border-orange-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        From: {question.profiles.full_name}
                      </span>
                    </div>
                    <CardTitle className="text-base">{question.content}</CardTitle>
                    <CardDescription>
                      Asked on {new Date(question.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor={`answer-${question.id}`} className="text-sm font-medium">
                      Your Answer
                    </label>
                    <Textarea
                      id={`answer-${question.id}`}
                      placeholder="Type your answer here..."
                      value={answerText[question.id] || ''}
                      onChange={(e) => setAnswerText(prev => ({ ...prev, [question.id]: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={() => submitAnswer(question.id)}
                    disabled={loading[question.id] || !answerText[question.id]?.trim()}
                    className="w-full"
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    {loading[question.id] ? 'Submitting...' : 'Submit Answer'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Answered Questions */}
      {answeredQuestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Answered Questions ({answeredQuestions.length})
          </h3>
          {answeredQuestions.map((question) => (
            <Card key={question.id} className="border-green-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Answered
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        From: {question.profiles.full_name}
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
                  <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Your Answer:</h4>
                    {question.answers.map((answer) => (
                      <div key={answer.id}>
                        <p className="text-foreground mb-2">{answer.content}</p>
                        <p className="text-xs text-muted-foreground">
                          Answered on {new Date(answer.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {questions.length === 0 && (
        <Card className="card-elevated">
          <CardContent className="pt-6 text-center py-12">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Help Students</h3>
            <p className="text-muted-foreground mb-4">
              Students can see your name when selecting teachers to ask questions.
            </p>
            <p className="text-sm text-muted-foreground">
              New questions will appear here automatically when students ask them.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeacherDashboard;