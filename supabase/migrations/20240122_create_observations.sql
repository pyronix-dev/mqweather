-- Create Observations Table
CREATE TABLE IF NOT EXISTS observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- generic/anonymous users allowed? Request implied authenticated but good to track.
    type TEXT NOT NULL,
    x NUMERIC NOT NULL,
    y NUMERIC NOT NULL,
    temp TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for filtering by recency
CREATE INDEX IF NOT EXISTS idx_observations_created_at ON observations(created_at);

-- Enable RLS
ALTER TABLE observations ENABLE ROW LEVEL SECURITY;

-- Policies
-- Everyone can read (public)
CREATE POLICY "Public can view observations" ON observations
    FOR SELECT USING (true);

-- Authenticated users can insert
-- (Service role in API will actually handle this most likely, but good to have)
CREATE POLICY "Authenticated users can insert observations" ON observations
    FOR INSERT WITH CHECK (auth.uid() = user_id);
