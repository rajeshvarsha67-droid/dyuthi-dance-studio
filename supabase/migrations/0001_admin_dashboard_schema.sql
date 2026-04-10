-- ============================================================
-- Migration: Admin Dashboard Schema
-- Description: Creates batches, payments, and admin_users tables
--              with Row Level Security (RLS) policies.
-- ============================================================

-- =========================
-- 1. EXTENSIONS
-- =========================
-- Ensure pgcrypto is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- 2. HELPER FUNCTION
-- =========================
-- Auto-update the updated_at column on row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================
-- 3. ADMIN_USERS TABLE
-- =========================
-- Created first because RLS policies on other tables reference it.
CREATE TABLE IF NOT EXISTS admin_users (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email      TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed the first default admin
INSERT INTO admin_users (email)
VALUES ('Dona.official07@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Service role bypasses RLS automatically.
-- Policy: Authenticated admins can SELECT their own row (or all, for dashboard).
CREATE POLICY "admin_users_select_policy"
    ON admin_users
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IN (SELECT id FROM admin_users)
    );

-- Policy: Only service role can INSERT/UPDATE/DELETE admin_users
-- (service_role bypasses RLS by default, so no explicit policy needed)

-- =========================
-- 4. BATCHES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS batches (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch          TEXT NOT NULL CHECK (branch IN ('Kaloor', 'Kalamassery')),
    dance_style     TEXT NOT NULL,
    instructor_name TEXT NOT NULL,
    schedule        TEXT NOT NULL,
    max_capacity    INTEGER NOT NULL CHECK (max_capacity > 0),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone (including anon) can read batches — needed by the public frontend
CREATE POLICY "batches_public_select_policy"
    ON batches
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Policy: Only authenticated admins can INSERT
CREATE POLICY "batches_admin_insert_policy"
    ON batches
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() IN (SELECT id FROM admin_users)
    );

-- Policy: Only authenticated admins can UPDATE
CREATE POLICY "batches_admin_update_policy"
    ON batches
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IN (SELECT id FROM admin_users)
    )
    WITH CHECK (
        auth.uid() IN (SELECT id FROM admin_users)
    );

-- Policy: Only authenticated admins can DELETE
CREATE POLICY "batches_admin_delete_policy"
    ON batches
    FOR DELETE
    TO authenticated
    USING (
        auth.uid() IN (SELECT id FROM admin_users)
    );

-- =========================
-- 5. PAYMENTS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS payments (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id     UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    batch_id       UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    amount         NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    transaction_id TEXT UNIQUE,
    status         TEXT NOT NULL DEFAULT 'PENDING'
                       CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED')),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: Auto-update updated_at on every UPDATE
CREATE TRIGGER set_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated admins can SELECT all payments
CREATE POLICY "payments_admin_select_policy"
    ON payments
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IN (SELECT id FROM admin_users)
    );

-- Policy: Authenticated admins (and service role) can INSERT payments
-- PhonePe webhook handler will use the service_role key, which bypasses RLS.
CREATE POLICY "payments_admin_insert_policy"
    ON payments
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() IN (SELECT id FROM admin_users)
    );

-- Policy: Authenticated admins can UPDATE payments (e.g., mark status)
CREATE POLICY "payments_admin_update_policy"
    ON payments
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IN (SELECT id FROM admin_users)
    )
    WITH CHECK (
        auth.uid() IN (SELECT id FROM admin_users)
    );

-- Policy: Authenticated admins can DELETE payments
CREATE POLICY "payments_admin_delete_policy"
    ON payments
    FOR DELETE
    TO authenticated
    USING (
        auth.uid() IN (SELECT id FROM admin_users)
    );

-- =========================
-- 6. INDEXES
-- =========================
-- Speed up FK lookups and common queries
CREATE INDEX IF NOT EXISTS idx_payments_student_id     ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_batch_id       ON payments(batch_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_status         ON payments(status);
CREATE INDEX IF NOT EXISTS idx_batches_branch          ON batches(branch);
