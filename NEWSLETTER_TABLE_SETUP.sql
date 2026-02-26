-- =====================================================
-- NEWSLETTER SUBSCRIBERS TABLE SETUP FOR SUPABASE
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    source VARCHAR(50) DEFAULT 'website',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed_at ON newsletter_subscribers(subscribed_at DESC);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything (for API)
CREATE POLICY "Service role full access" ON newsletter_subscribers
    FOR ALL
    USING (auth.role() = 'service_role');

-- Policy: Admins can read all subscribers
CREATE POLICY "Admins can read subscribers" ON newsletter_subscribers
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_newsletter_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trigger_newsletter_updated_at ON newsletter_subscribers;
CREATE TRIGGER trigger_newsletter_updated_at
    BEFORE UPDATE ON newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_newsletter_updated_at();

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Run this to verify the table was created:
-- SELECT * FROM newsletter_subscribers LIMIT 1;
