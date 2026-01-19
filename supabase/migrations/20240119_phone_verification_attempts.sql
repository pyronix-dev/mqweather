-- Add rate limiting columns to phone_verification_codes
ALTER TABLE public.phone_verification_codes 
ADD COLUMN attempts integer DEFAULT 0,
ADD COLUMN last_attempt_at timestamptz DEFAULT now();
