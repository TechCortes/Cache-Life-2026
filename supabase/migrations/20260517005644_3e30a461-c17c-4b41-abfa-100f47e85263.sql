ALTER TABLE public.event_signups
  ADD COLUMN IF NOT EXISTS consent_version text NULL,
  ADD COLUMN IF NOT EXISTS consent_at timestamptz NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_signups_afterglow_per_day
  ON public.event_signups (lower(email), rsvp_for_date)
  WHERE source = 'afterglow' AND rsvp_for_date IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_signups_per_event
  ON public.event_signups (lower(email), posh_event_id)
  WHERE posh_event_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_signups_general_email
  ON public.event_signups (lower(email))
  WHERE posh_event_id IS NULL AND (source IS NULL OR source = 'general');