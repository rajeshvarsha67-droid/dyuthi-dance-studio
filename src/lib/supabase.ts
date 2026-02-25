import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let supabase: SupabaseClient | null = null;

try {
    if (supabaseUrl && supabaseUrl.startsWith("https://")) {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
} catch {
    // Supabase client creation failed — will be null
}

export { supabase };
