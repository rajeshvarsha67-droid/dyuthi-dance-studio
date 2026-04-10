"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

/**
 * Soft-delete: set status = 'INACTIVE' (never SQL DELETE).
 * Uses supabaseAdmin (service role) to bypass RLS.
 */
export async function archiveStudent(studentId: string) {
    const { error } = await supabaseAdmin
        .from("registrations")
        .update({ status: "INACTIVE" })
        .eq("id", studentId);

    if (error) {
        console.error("Failed to archive student:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/students");
    revalidatePath("/admin/reminders");
    revalidatePath("/admin/broadcast");
    revalidatePath("/admin/dashboard");
    return { success: true };
}

/**
 * Restore an archived student back to ACTIVE.
 * Uses supabaseAdmin (service role) to bypass RLS.
 */
export async function restoreStudent(studentId: string) {
    const { error } = await supabaseAdmin
        .from("registrations")
        .update({ status: "ACTIVE" })
        .eq("id", studentId);

    if (error) {
        console.error("Failed to restore student:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/students");
    revalidatePath("/admin/reminders");
    revalidatePath("/admin/broadcast");
    revalidatePath("/admin/dashboard");
    return { success: true };
}

export async function fetchStudentProfileData(studentId: string) {
    // Fetch payments
    const { data: payments, error: paymentsError } = await supabaseAdmin
        .from("payments")
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false });

    if (paymentsError) {
        console.error("Error fetching payments:", paymentsError);
    }

    // Determine enrolled batches from successful payments
    const batchIds = Array.from(
        new Set(
            (payments || [])
                .filter((p: any) => p.status === "SUCCESS" && p.batch_id)
                .map((p: any) => p.batch_id)
        )
    );

    let batches: any[] = [];
    if (batchIds.length > 0) {
        const { data: batchesData, error: batchesError } = await supabaseAdmin
            .from("batches")
            .select("*")
            .in("id", batchIds);
            
        if (batchesError) {
            console.error("Error fetching batches:", batchesError);
        } else {
            batches = batchesData || [];
        }
    }

    return {
        payments: payments || [],
        batches
    };
}
