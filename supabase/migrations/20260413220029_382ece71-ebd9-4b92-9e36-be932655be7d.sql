CREATE TABLE public.event_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.event_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can sign up"
  ON public.event_signups
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view signups"
  ON public.event_signups
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete signups"
  ON public.event_signups
  FOR DELETE
  TO authenticated
  USING (true);