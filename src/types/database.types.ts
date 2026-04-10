// ============================================================
// TypeScript Interfaces for Admin Dashboard Tables
// Maps to: batches, payments, admin_users in Supabase
// ============================================================

// --- Union types matching DB CHECK constraints ---

/** Allowed branch values for the batches table */
export type BatchBranch = "Kaloor" | "Kalamassery";

/** Allowed payment status values */
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

// --- Table interfaces ---

/** Maps to the `batches` table */
export interface Batch {
  id: string;
  branch: BatchBranch;
  dance_style: string;


  created_at: string; // ISO 8601 timestamptz
}

/** Maps to the `payments` table */
export interface Payment {
  id: string;
  student_id: string;
  batch_id: string;
  amount: number;
  transaction_id: string | null;
  status: PaymentStatus;
  created_at: string; // ISO 8601 timestamptz
  updated_at: string; // ISO 8601 timestamptz
}

/** Maps to the `admin_users` table */
export interface AdminUser {
  id: string;
  email: string;
  created_at: string; // ISO 8601 timestamptz
}

// --- Insert / Update DTOs (optional columns omitted from required) ---

/** Fields required when inserting a new batch */
export interface BatchInsert {
  branch: BatchBranch;
  dance_style: string;


  id?: string;
  created_at?: string;
}

/** Fields required when inserting a new payment */
export interface PaymentInsert {
  student_id: string;
  batch_id: string;
  amount: number;
  id?: string;
  transaction_id?: string;
  status?: PaymentStatus;
  created_at?: string;
  updated_at?: string;
}

/** Fields required when inserting a new admin user */
export interface AdminUserInsert {
  email: string;
  id?: string;
  created_at?: string;
}

/** Fields that can be updated on a payment row */
export interface PaymentUpdate {
  student_id?: string;
  batch_id?: string;
  amount?: number;
  transaction_id?: string;
  status?: PaymentStatus;
}

/** Fields that can be updated on a batch row */
export interface BatchUpdate {
  branch?: BatchBranch;
  dance_style?: string;


}
