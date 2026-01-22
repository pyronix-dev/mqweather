-- Add granular notification columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS notif_sms BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notif_email BOOLEAN DEFAULT true;

-- Initialize them based on the existing master switch if false (optional, but good for consistency)
UPDATE users 
SET notif_sms = false, notif_email = false 
WHERE notifications_enabled = false;
