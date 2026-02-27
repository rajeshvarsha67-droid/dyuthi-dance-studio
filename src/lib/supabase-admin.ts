import { createClient } from "@supabase/supabase-js";

// Server-side only Supabase client using service role key.
// This bypasses RLS and is safe because it's only used in API routes
// (never exposed to the browser/client).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://nyfghjbpnsmqxzsszhvk.supabase.co";
const supabaseServiceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZmdoamJwbnNtcXh6c3N6aHZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjAyOTczNCwiZXhwIjoyMDg3NjA1NzM0fQ.S3fL3YJgSP8osglW_NyT0p1DYZKC-IV9Y4AnnFolYMU";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
