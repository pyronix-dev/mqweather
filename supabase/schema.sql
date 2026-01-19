-- Supabase Schema for MQ Weather
-- Run this in the Supabase SQL Editor (Database → SQL Editor)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_code TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- At least one contact method required
  CONSTRAINT email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_reference_code ON users(reference_code);

-- =============================================
-- SUBSCRIPTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL, -- 'sms-monthly', 'sms-annual', 'email-annual'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  stripe_session_id TEXT,
  stripe_subscription_id TEXT,
  amount INTEGER NOT NULL, -- Price in cents
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_status CHECK (status IN ('active', 'cancelled', 'expired')),
  CONSTRAINT valid_plan CHECK (plan IN ('sms-monthly', 'sms-annual', 'email-annual'))
);

-- Index for user subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_session ON subscriptions(stripe_session_id);

-- =============================================
-- OTP CODES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL, -- SHA256 hash of the 6-digit code
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster OTP lookups
CREATE INDEX IF NOT EXISTS idx_otp_codes_user_id ON otp_codes(user_id);

-- Auto-delete expired OTP codes (optional, run periodically or use Supabase Edge Functions)
-- DELETE FROM otp_codes WHERE expires_at < NOW();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role to do everything (for API routes)
-- Note: Service role bypasses RLS by default, so no explicit policy needed

-- Policy: Users can only read their own data (if using Supabase Auth)
-- CREATE POLICY "Users can view own data" ON users
--   FOR SELECT USING (auth.uid() = id);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to clean up expired OTP codes
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM otp_codes WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Optional: Schedule cleanup (requires pg_cron extension in Supabase)
-- SELECT cron.schedule('cleanup-otps', '*/15 * * * *', 'SELECT cleanup_expired_otps();');
