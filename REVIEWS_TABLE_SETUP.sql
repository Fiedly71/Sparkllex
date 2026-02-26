-- ============================================
-- SPARKLLEX REVIEWS TABLE SETUP
-- ============================================
-- Run this SQL in Supabase SQL Editor to create the reviews table

-- Create the reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    client_name TEXT,
    client_email TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    service_type TEXT,
    comment TEXT,
    photos JSONB,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved reviews
CREATE POLICY "Anyone can view approved reviews" ON reviews
    FOR SELECT
    USING (approved = true);

-- Policy: Authenticated users can insert their own reviews
CREATE POLICY "Authenticated users can create reviews" ON reviews
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = client_id);

-- Policy: Users can view their own reviews (even if not approved)
CREATE POLICY "Users can view their own reviews" ON reviews
    FOR SELECT
    TO authenticated
    USING (auth.uid() = client_id);

-- ============================================
-- STORAGE BUCKET FOR REVIEW PHOTOS
-- ============================================
-- Run this to create the storage bucket for review photos

-- Create the bucket (run in Supabase Dashboard > Storage)
-- Bucket name: review-photos
-- Public: Yes

-- To set up via SQL (alternative):
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-photos', 'review-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload review photos" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'review-photos');

-- Storage policy: Anyone can view review photos
CREATE POLICY "Anyone can view review photos" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'review-photos');

-- ============================================
-- ADMIN FUNCTIONS (OPTIONAL)
-- ============================================

-- Function to approve a review (for admin dashboard)
CREATE OR REPLACE FUNCTION approve_review(review_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE reviews SET approved = true, updated_at = NOW() WHERE id = review_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get review statistics
CREATE OR REPLACE FUNCTION get_review_stats()
RETURNS TABLE (
    total_reviews BIGINT,
    average_rating NUMERIC,
    five_star_count BIGINT,
    four_star_count BIGINT,
    three_star_count BIGINT,
    pending_reviews BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) FILTER (WHERE approved = true) as total_reviews,
        ROUND(AVG(rating) FILTER (WHERE approved = true), 1) as average_rating,
        COUNT(*) FILTER (WHERE rating = 5 AND approved = true) as five_star_count,
        COUNT(*) FILTER (WHERE rating = 4 AND approved = true) as four_star_count,
        COUNT(*) FILTER (WHERE rating = 3 AND approved = true) as three_star_count,
        COUNT(*) FILTER (WHERE approved = false) as pending_reviews
    FROM reviews;
END;
$$ LANGUAGE plpgsql;
