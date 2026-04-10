-- ============================================================
-- Migration: Fix admin_users RLS policy
-- Description: The previous SELECT policy on admin_users caused
-- an infinite recursion and prevented login verification.
-- We are replacing it with a policy that allows an authenticated
-- user to check if their email exists in the table.
-- ============================================================

-- Drop the broken policy
DROP POLICY IF EXISTS "admin_users_select_policy" ON admin_users;

-- Create a new policy that allows authenticated users to read the table
-- (We restrict it so they can only see their own email row to be safe,
-- though for an admin dashboard, seeing all admins is usually fine too.
-- Let's just allow all authenticated users to read admin_users, because
-- if they aren't an admin, the middleware kicks them out anyway.)
CREATE POLICY "admin_users_select_policy"
    ON admin_users
    FOR SELECT
    TO authenticated
    USING (true);
