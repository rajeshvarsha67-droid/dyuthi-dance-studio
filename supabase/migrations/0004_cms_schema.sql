-- ============================================================
-- Migration: CMS Schema (Gallery & Reviews)
-- Description: Creates gallery_images and reviews tables
--              with Row Level Security (RLS) policies.
-- ============================================================

-- =========================
-- 1. GALLERY IMAGES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS gallery_images (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url      TEXT NOT NULL,
    alt_text       TEXT,
    display_order  INTEGER NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone (including anon) can read gallery images
CREATE POLICY "gallery_images_public_select_policy"
    ON gallery_images
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Policy: Only authenticated admins can INSERT, UPDATE, DELETE
CREATE POLICY "gallery_images_admin_insert_policy"
    ON gallery_images FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "gallery_images_admin_update_policy"
    ON gallery_images FOR UPDATE TO authenticated
    USING (auth.uid() IN (SELECT id FROM admin_users))
    WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "gallery_images_admin_delete_policy"
    ON gallery_images FOR DELETE TO authenticated
    USING (auth.uid() IN (SELECT id FROM admin_users));

-- =========================
-- 2. REVIEWS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS reviews (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name   TEXT NOT NULL,
    review_text    TEXT NOT NULL,
    rating         INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone (including anon) can read reviews
CREATE POLICY "reviews_public_select_policy"
    ON reviews
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Policy: Only authenticated admins can INSERT, UPDATE, DELETE
CREATE POLICY "reviews_admin_insert_policy"
    ON reviews FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "reviews_admin_update_policy"
    ON reviews FOR UPDATE TO authenticated
    USING (auth.uid() IN (SELECT id FROM admin_users))
    WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "reviews_admin_delete_policy"
    ON reviews FOR DELETE TO authenticated
    USING (auth.uid() IN (SELECT id FROM admin_users));
