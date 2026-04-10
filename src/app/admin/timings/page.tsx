import { supabaseAdmin } from "@/lib/supabase-admin";
import TimingManager from "@/components/admin/TimingManager";

export default async function TimingsPage() {
    const { data: batches } = await supabaseAdmin
        .from("batches")
        .select("id, branch, dance_style, days, timing")
        .order("branch", { ascending: true })
        .order("dance_style", { ascending: true });

    return <TimingManager batches={batches || []} />;
}
