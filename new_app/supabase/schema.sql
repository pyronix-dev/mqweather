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
  password_hash text NULL,
  is_verified boolean DEFAULT false,
  role text NOT NULL DEFAULT 'user',
  is_banned boolean DEFAULT false,
  banned_reason text NULL,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_reference_code_key UNIQUE (reference_code),
  CONSTRAINT email_or_phone CHECK ((email IS NOT NULL) OR (phone IS NOT NULL)),
  CONSTRAINT valid_role CHECK (role IN ('user', 'admin', 'super_admin'))
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

CREATE TABLE IF NOT EXISTS public.ip_limit_tracking (
    ip_address TEXT PRIMARY KEY,
    attempt_count INTEGER DEFAULT 0,
    blocked_until TIMESTAMPTZ,
    suspicion_level INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_ip_tracking ON public.ip_limit_tracking(ip_address) TABLESPACE pg_default;

-- Login history for tracking user sessions, IP, location
CREATE TABLE IF NOT EXISTS public.login_history (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  ip_address text NULL,
  user_agent text NULL,
  location_country text NULL,
  location_city text NULL,
  isp text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT login_history_pkey PRIMARY KEY (id),
  CONSTRAINT login_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON public.login_history USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_login_history_created_at ON public.login_history USING btree (created_at DESC) TABLESPACE pg_default;

-- Admin audit log for tracking admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  admin_id uuid NOT NULL,
  action text NOT NULL,
  target_type text NULL,
  target_id uuid NULL,
  details jsonb NULL,
  ip_address text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT admin_audit_log_pkey PRIMARY KEY (id),
  CONSTRAINT admin_audit_log_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id ON public.admin_audit_log USING btree (admin_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON public.admin_audit_log USING btree (created_at DESC) TABLESPACE pg_default;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deleted_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vigilance_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_limit_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view observations') THEN
        CREATE POLICY "Public can view observations" ON public.observations FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view vigilance_state') THEN
        CREATE POLICY "Public can view vigilance_state" ON public.vigilance_state FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service can manage otp_codes') THEN
        CREATE POLICY "Service can manage otp_codes" ON public.otp_codes FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service can manage vigilance_state') THEN
        CREATE POLICY "Service can manage vigilance_state" ON public.vigilance_state FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service can manage users') THEN
        CREATE POLICY "Service can manage users" ON public.users FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service can manage subscriptions') THEN
        CREATE POLICY "Service can manage subscriptions" ON public.subscriptions FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service can manage verification_codes') THEN
        CREATE POLICY "Service can manage verification_codes" ON public.verification_codes FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service can manage deleted_users') THEN
        CREATE POLICY "Service can manage deleted_users" ON public.deleted_users FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service can manage ip_limit_tracking') THEN
        CREATE POLICY "Service can manage ip_limit_tracking" ON public.ip_limit_tracking FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service can manage login_history') THEN
        CREATE POLICY "Service can manage login_history" ON public.login_history FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service can manage admin_audit_log') THEN
        CREATE POLICY "Service can manage admin_audit_log" ON public.admin_audit_log FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
END $$;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='full_name') THEN
        ALTER TABLE users ADD COLUMN full_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password_hash') THEN
        ALTER TABLE users ADD COLUMN password_hash TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_verified') THEN
        ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='observations' AND column_name='x') THEN
        ALTER TABLE observations ADD COLUMN x NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='observations' AND column_name='y') THEN
        ALTER TABLE observations ADD COLUMN y NUMERIC;
    END IF;

    -- Admin columns migration
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
        ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_banned') THEN
        ALTER TABLE users ADD COLUMN is_banned BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='banned_reason') THEN
        ALTER TABLE users ADD COLUMN banned_reason TEXT;
    END IF;
END $$;
