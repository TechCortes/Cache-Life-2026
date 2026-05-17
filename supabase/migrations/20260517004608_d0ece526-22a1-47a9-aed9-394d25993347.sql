ALTER TABLE public.event_signups
  ADD COLUMN IF NOT EXISTS rsvp_for_date timestamptz NULL,
  ADD COLUMN IF NOT EXISTS source text NULL;

CREATE INDEX IF NOT EXISTS idx_event_signups_source ON public.event_signups (source);
CREATE INDEX IF NOT EXISTS idx_event_signups_rsvp_for_date ON public.event_signups (rsvp_for_date);