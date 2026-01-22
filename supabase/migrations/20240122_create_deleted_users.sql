-- Create a table to store deleted user archives
CREATE TABLE IF NOT EXISTS deleted_users (
    id UUID PRIMARY KEY,
    reference_code TEXT,
    email TEXT,
    phone TEXT,
    full_name TEXT,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    original_created_at TIMESTAMP WITH TIME ZONE
);

-- Optional: Enable RLS on this table to prevent public access
ALTER TABLE deleted_users ENABLE ROW LEVEL SECURITY;

-- Only admins/service role can access
CREATE POLICY "Service role can do everything on deleted_users" 
ON deleted_users 
USING (auth.role() = 'service_role');
