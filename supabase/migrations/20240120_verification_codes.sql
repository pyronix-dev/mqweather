-- Rename table to be generic
ALTER TABLE public.phone_verification_codes RENAME TO verification_codes;

-- Add email column
ALTER TABLE public.verification_codes ADD COLUMN email text;

-- Make phone nullable since we might have email-only verification
ALTER TABLE public.verification_codes ALTER COLUMN phone DROP NOT NULL;

-- Add check constraint to ensure either phone or email is present
ALTER TABLE public.verification_codes ADD CONSTRAINT verification_codes_contact_check CHECK (
  (phone IS NOT NULL AND email IS NULL) OR
  (phone IS NULL AND email IS NOT NULL)
);

-- Update RLS policies (if any exist, they might need adjustment, but usually service role bypasses them)
-- For safety, let's create an index on email
CREATE INDEX verification_codes_email_idx ON public.verification_codes (email);
