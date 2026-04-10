-- ============================================================
-- Migration: Fix Admin RLS
-- Description: The original RLS policies incorrectly assumed admin_users.id 
-- matches auth.users(id). Since it auto-generates a gen_random_uuid(), 
-- auth.uid() IN (SELECT id FROM admin_users) always evaluates to false.
-- This migration updates all admin policies to check by email:
-- auth.email() IN (SELECT email FROM admin_users)
-- ============================================================

-- 1. admin_users
DROP POLICY IF EXISTS "admin_users_select_policy" ON admin_users;
CREATE POLICY "admin_users_select_policy"
    ON admin_users FOR SELECT TO authenticated
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

-- 2. batches
DROP POLICY IF EXISTS "batches_admin_insert_policy" ON batches;
CREATE POLICY "batches_admin_insert_policy"
    ON batches FOR INSERT TO authenticated
    WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

DROP POLICY IF EXISTS "batches_admin_update_policy" ON batches;
CREATE POLICY "batches_admin_update_policy"
    ON batches FOR UPDATE TO authenticated
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users))
    WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

DROP POLICY IF EXISTS "batches_admin_delete_policy" ON batches;
CREATE POLICY "batches_admin_delete_policy"
    ON batches FOR DELETE TO authenticated
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

-- 3. payments
DROP POLICY IF EXISTS "payments_admin_select_policy" ON payments;
CREATE POLICY "payments_admin_select_policy"
    ON payments FOR SELECT TO authenticated
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

DROP POLICY IF EXISTS "payments_admin_insert_policy" ON payments;
CREATE POLICY "payments_admin_insert_policy"
    ON payments FOR INSERT TO authenticated
    WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

DROP POLICY IF EXISTS "payments_admin_update_policy" ON payments;
CREATE POLICY "payments_admin_update_policy"
    ON payments FOR UPDATE TO authenticated
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users))
    WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

DROP POLICY IF EXISTS "payments_admin_delete_policy" ON payments;
CREATE POLICY "payments_admin_delete_policy"
    ON payments FOR DELETE TO authenticated
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

-- 4. gallery_images
DROP POLICY IF EXISTS "gallery_images_admin_insert_policy" ON gallery_images;
CREATE POLICY "gallery_images_admin_insert_policy"
    ON gallery_images FOR INSERT TO authenticated
    WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

DROP POLICY IF EXISTS "gallery_images_admin_update_policy" ON gallery_images;
CREATE POLICY "gallery_images_admin_update_policy"
    ON gallery_images FOR UPDATE TO authenticated
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users))
    WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

DROP POLICY IF EXISTS "gallery_images_admin_delete_policy" ON gallery_images;
CREATE POLICY "gallery_images_admin_delete_policy"
    ON gallery_images FOR DELETE TO authenticated
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

-- 5. reviews
DROP POLICY IF EXISTS "reviews_admin_insert_policy" ON reviews;
CREATE POLICY "reviews_admin_insert_policy"
    ON reviews FOR INSERT TO authenticated
    WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

DROP POLICY IF EXISTS "reviews_admin_update_policy" ON reviews;
CREATE POLICY "reviews_admin_update_policy"
    ON reviews FOR UPDATE TO authenticated
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users))
    WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

DROP POLICY IF EXISTS "reviews_admin_delete_policy" ON reviews;
CREATE POLICY "reviews_admin_delete_policy"
    ON reviews FOR DELETE TO authenticated
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));
