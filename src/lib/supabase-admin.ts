import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

let supabaseAdmin: SupabaseClient | null = null;

try {
    if (supabaseUrl && supabaseUrl.startsWith("https://") && supabaseServiceRoleKey) {
        supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });
    }
} catch {
    // Supabase admin client creation failed — will be null
}

export { supabaseAdmin };
