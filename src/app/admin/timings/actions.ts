"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export type ActionState = {
    error: string;
    success: boolean;
};

export async function updateBatchSchedule(
    id: string,
    days: string,
    timing: string
): Promise<ActionState> {
    if (!id) {
        return { error: "Batch ID is required.", success: false };
    }

    const { error } = await supabaseAdmin
        .from("batches")
        .update({
            days: days.trim() || null,
            timing: timing.trim() || null,
        })
        .eq("id", id);

    if (error) {
        console.error("Error updating batch schedule:", error);
        return { error: error.message || "Failed to update schedule.", success: false };
    }

    revalidatePath("/admin/timings");
    revalidatePath("/"); // revalidate public homepage
    return { error: "", success: true };
}
