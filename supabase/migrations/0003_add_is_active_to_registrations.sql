-- ============================================================
-- Migration: Add is_active to registrations
-- Description: Adds an `is_active` boolean column so admins
--              can toggle student active status.
-- ============================================================

ALTER TABLE registrations
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
