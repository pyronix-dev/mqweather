-- Add plain text code column to otp_codes table
ALTER TABLE otp_codes ADD COLUMN code TEXT;

-- (Optional) If you want to drop the hash column later you can, 
-- but kept for now as API logic uses it.
-- The API update will populate both 'code' and 'code_hash'.
