ALTER TABLE public.posh_events
  ADD COLUMN IF NOT EXISTS provider text NOT NULL DEFAULT 'posh';

ALTER TABLE public.posh_events
  DROP CONSTRAINT IF EXISTS posh_events_provider_check;

ALTER TABLE public.posh_events
  ADD CONSTRAINT posh_events_provider_check
  CHECK (provider IN ('posh', 'partiful'));