-- Add metadata column to verification_codes to store pending user details
alter table public.verification_codes 
add column if not exists metadata jsonb;

-- Prevent multiple pending codes for same email/phone to avoid spam
create index if not exists idx_verification_codes_metadata on public.verification_codes using gin(metadata);
