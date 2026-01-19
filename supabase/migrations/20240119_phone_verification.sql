-- Create a table for phone verification codes
create table public.phone_verification_codes (
  id uuid default gen_random_uuid() primary key,
  phone text not null,
  code text not null,
  expires_at timestamptz not null,
  verified boolean default false,
  created_at timestamptz default now()
);

-- Add an index for faster lookups
create index idx_phone_verification_codes_phone on public.phone_verification_codes(phone);
