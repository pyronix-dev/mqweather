-- Add attempts column if it doesn't exist (it might have been lost during rename if not handled carefully, or just to be safe)
ALTER TABLE public.verification_codes ADD COLUMN IF NOT EXISTS attempts integer DEFAULT 0;
