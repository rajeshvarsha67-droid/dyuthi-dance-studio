-- ============================================================
-- Migration: Allow students to insert their own payments
-- Description: Adds an RLS policy so authenticated students can
--              insert rows into the payments table where the
--              student_id matches their own registration.
-- ============================================================

-- Policy: Authenticated students can INSERT their own payments
CREATE POLICY "payments_student_insert_policy"
    ON payments
    FOR INSERT
    TO authenticated
    WITH CHECK (
        student_id IN (
            SELECT id FROM registrations WHERE email = auth.email()
        )
    );

-- Policy: Authenticated students can SELECT their own payments
CREATE POLICY "payments_student_select_policy"
    ON payments
    FOR SELECT
    TO authenticated
    USING (
        student_id IN (
            SELECT id FROM registrations WHERE email = auth.email()
        )
    );
