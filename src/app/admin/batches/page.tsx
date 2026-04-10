import { supabaseAdmin } from "@/lib/supabase-admin";
import BatchManager from "@/components/admin/BatchManager";

export default async function BatchesPage() {
    const supabase = supabaseAdmin;

    const { data: batches } = await supabase
        .from("batches")
        .select("id, branch, dance_style")
        .order("branch", { ascending: true })
        .order("dance_style", { ascending: true });

    return <BatchManager batches={batches || []} />;
}
