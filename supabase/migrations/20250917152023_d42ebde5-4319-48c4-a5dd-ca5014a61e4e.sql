-- Enable realtime for questions and answers tables
ALTER TABLE public.questions REPLICA IDENTITY FULL;
ALTER TABLE public.answers REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.questions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.answers;