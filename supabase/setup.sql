-- Enable the uuid-ossp extension for gen_random_uuid() if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create proposals table
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 200),
    category TEXT NOT NULL CHECK (char_length(category) > 0),
    likes_count INTEGER DEFAULT 0,
    reports_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- 3. Define Policies
-- Allow anyone to read published proposals
CREATE POLICY "Allow public read for published proposals"
ON proposals
FOR SELECT
USING (status = 'published');

-- Prevent public insert/update/delete entirely.
-- We do not create policies for INSERT/UPDATE/DELETE.
-- Only Service Role Key (backend API) can write by bypassing RLS.

-- 4. Create Stored Procedures (RPC)
-- 4-1. Increment like
CREATE OR REPLACE FUNCTION increment_like(proposal_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE proposals
    SET likes_count = likes_count + 1
    WHERE id = proposal_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- SECURITY DEFINER allows the function to execute with the privileges of the creator
-- We can also revoke execute from public to be strict, since API uses service role.
REVOKE EXECUTE ON FUNCTION increment_like(UUID) FROM PUBLIC;

-- 4-2. Increment report
CREATE OR REPLACE FUNCTION increment_report(proposal_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE proposals
    SET 
        reports_count = reports_count + 1,
        status = CASE 
            WHEN reports_count + 1 >= 3 THEN 'hidden'
            ELSE status
        END
    WHERE id = proposal_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Revoke execute from public
REVOKE EXECUTE ON FUNCTION increment_report(UUID) FROM PUBLIC;
