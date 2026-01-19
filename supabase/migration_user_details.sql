-- Add user details columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS billing_details JSONB;

-- Add subscription payment details
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS card_brand TEXT,
ADD COLUMN IF NOT EXISTS card_last4 TEXT;

-- Add rate limiting to OTP codes
ALTER TABLE otp_codes 
ADD COLUMN IF NOT EXISTS attempts INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_attempts INT DEFAULT 3;
