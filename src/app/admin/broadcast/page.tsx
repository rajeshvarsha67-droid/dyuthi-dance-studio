import { createSupabaseServerClient } from "@/lib/supabase-server";
import BroadcastTool from "@/components/admin/BroadcastTool";

export default async function BroadcastPage() {
    const supabase = await createSupabaseServerClient();

    // Fetch all active batches
    const { data: batches } = await supabase
        .from("batches")
        .select("id, branch, dance_style")
        .order("branch", { ascending: true })
        .order("dance_style", { ascending: true });

    // Fetch all active students
    const { data: students } = await supabase
        .from("registrations")
        .select("id, name, phone, email, Location, preferred_batch")
        .eq("status", "ACTIVE")
        .order("name", { ascending: true });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 font-serif">
                    Communication Hub
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Filter students by branch and batch, then copy their contact
                    details for bulk messaging.
                </p>
            </div>

            <BroadcastTool
                batches={batches || []}
                students={students || []}
            />
        </div>
    );
}
