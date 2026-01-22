-- Add notifications_enabled column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT true;

-- Update existing rows to have true (implying they are subscribed)
UPDATE public.users 
SET notifications_enabled = true 
WHERE notifications_enabled IS NULL;
