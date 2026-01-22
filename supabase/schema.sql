CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  reference_code text NOT NULL,
  email text NULL,
  phone text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  full_name text NULL,
  country text NULL,
  billing_details jsonb NULL,
  notifications_enabled boolean NULL DEFAULT true,
  notif_sms boolean NULL DEFAULT true,
  notif_email boolean NULL DEFAULT true,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_reference_code_key UNIQUE (reference_code),
  CONSTRAINT email_or_phone CHECK ((email IS NOT NULL) OR (phone IS NOT NULL))
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users USING btree (email) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users USING btree (phone) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_users_reference_code ON public.users USING btree (reference_code) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.otp_codes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  used boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  code text NULL,
  attempts integer NULL DEFAULT 0,
  max_attempts integer NULL DEFAULT 3,
  CONSTRAINT otp_codes_pkey PRIMARY KEY (id),
  CONSTRAINT otp_codes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_otp_codes_user_id ON public.otp_codes USING btree (user_id) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.verification_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  phone text NULL,
  code text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  verified boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  attempts integer NULL DEFAULT 0,
  last_attempt_at timestamp with time zone NULL DEFAULT now(),
  email text NULL,
  CONSTRAINT phone_verification_codes_pkey PRIMARY KEY (id),
  CONSTRAINT verification_codes_contact_check CHECK (((phone IS NOT NULL) AND (email IS NULL)) OR ((phone IS NULL) AND (email IS NOT NULL)))
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_phone_verification_codes_phone ON public.verification_codes USING btree (phone) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS verification_codes_email_idx ON public.verification_codes USING btree (email) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.deleted_users (
  id uuid NOT NULL,
  reference_code text NULL,
  email text NULL,
  phone text NULL,
  full_name text NULL,
  deleted_at timestamp with time zone NULL DEFAULT now(),
  original_created_at timestamp with time zone NULL,
  CONSTRAINT deleted_users_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  plan text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  stripe_session_id text NULL,
  stripe_subscription_id text NULL,
  amount integer NOT NULL,
  card_brand text NULL,
  card_last4 text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  expires_at timestamp with time zone NULL,
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT valid_status CHECK (status IN ('active', 'cancelled', 'expired')),
  CONSTRAINT valid_plan CHECK (plan IN ('sms-monthly', 'sms-annual', 'email-annual'))
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_session ON public.subscriptions USING btree (stripe_session_id) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.observations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NULL,
  type text NOT NULL,
  x numeric NOT NULL,
  y numeric NOT NULL,
  temp text NULL,
  details text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT observations_pkey PRIMARY KEY (id),
  CONSTRAINT observations_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_observations_created_at ON public.observations USING btree (created_at) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.vigilance_state (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  color_id integer NOT NULL,
  color_name text NOT NULL,
  phenomena text[] NULL,
  last_update timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT vigilance_state_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_vigilance_state_created_at ON public.vigilance_state USING btree (created_at DESC) TABLESPACE pg_default;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deleted_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vigilance_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view observations" ON public.observations FOR SELECT USING (true);
CREATE POLICY "Public can view vigilance_state" ON public.vigilance_state FOR SELECT USING (true);
CREATE POLICY "Service can manage otp_codes" ON public.otp_codes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service can manage vigilance_state" ON public.vigilance_state FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service can manage users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service can manage subscriptions" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service can manage verification_codes" ON public.verification_codes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service can manage deleted_users" ON public.deleted_users FOR ALL USING (true) WITH CHECK (true);
