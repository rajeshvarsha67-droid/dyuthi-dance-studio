"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export type ActionState = {
    error: string;
    success: boolean;
};

export async function addBatch(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = supabaseAdmin;

    const branch = (formData.get("branch") as string)?.trim();
    const dance_style = (formData.get("dance_style") as string)?.trim();

    if (!branch || !dance_style) {
        return { error: "Both Branch Name and Dance Style are required.", success: false };
    }

    const { error } = await supabase.from("batches").insert({
        branch,
        dance_style,
    });

    if (error) {
        console.error("Error creating batch:", error);
        return { error: error.message || "Failed to create batch.", success: false };
    }

    revalidatePath("/admin/batches");
    return { error: "", success: true };
}

export async function deleteBatch(id: string): Promise<ActionState> {
    if (!id) {
        return { error: "Batch ID is required.", success: false };
    }

    const supabase = supabaseAdmin;

    const { error } = await supabase
        .from("batches")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting batch:", error);
        return { error: error.message || "Failed to delete batch.", success: false };
    }

    revalidatePath("/admin/batches");
    return { error: "", success: true };
}

export async function getBatchStudents(batchId: string) {
    const supabase = await createSupabaseServerClient();

    const { data: payments, error } = await supabase
        .from("payments")
        .select("student_id")
        .eq("batch_id", batchId)
        .eq("status", "SUCCESS");

    if (error || !payments || payments.length === 0) return [];

    const studentIds = Array.from(new Set(payments.map(p => p.student_id).filter(Boolean)));
    if (studentIds.length === 0) return [];

    const { data: students } = await supabase
        .from("registrations")
        .select("id, name")
        .in("id", studentIds)
        .eq("status", "ACTIVE")
        .order("name", { ascending: true });

    return students || [];
}

export async function saveAttendance(batchId: string, presentStudentIds: string[]) {
    console.log(`[STUB] Saving attendance for batch ${batchId}. Present IDs:`, presentStudentIds);
    return { success: true };
}
