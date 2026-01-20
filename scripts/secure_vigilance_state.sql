-- Enable Row Level Security (RLS) to secure the table
-- This prevents public access, effectively making it "Private"
-- The Backend API (Service Role) will still have full access.
alter table vigilance_state enable row level security;
