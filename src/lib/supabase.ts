import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nyfghjbpnsmqxzsszhvk.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_q8mYfELswh9IlIPPBJoGcg_tg7YK7vr";

let supabase: ReturnType<typeof createBrowserClient> | null = null;

try {
    if (supabaseUrl && supabaseUrl.startsWith("https://")) {
        supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    }
} catch {
    // Supabase client creation failed — will be null
}

export { supabase };
