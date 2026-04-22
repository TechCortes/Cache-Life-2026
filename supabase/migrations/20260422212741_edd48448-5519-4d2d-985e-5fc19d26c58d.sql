
-- 1. posh_events table
CREATE TABLE public.posh_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  image_url TEXT,
  posh_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.posh_events ENABLE ROW LEVEL SECURITY;

-- Public can read active events
CREATE POLICY "Anyone can view active posh events"
ON public.posh_events
FOR SELECT
USING (is_active = true);

-- Authenticated users (admins) can read all
CREATE POLICY "Authenticated users can view all posh events"
ON public.posh_events
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert posh events"
ON public.posh_events
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update posh events"
ON public.posh_events
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete posh events"
ON public.posh_events
FOR DELETE
TO authenticated
USING (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER posh_events_set_updated_at
BEFORE UPDATE ON public.posh_events
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- 2. extend event_signups
ALTER TABLE public.event_signups
  ADD COLUMN posh_event_id UUID REFERENCES public.posh_events(id) ON DELETE SET NULL,
  ADD COLUMN posh_url TEXT;
