const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    console.log("Authenticating as Dona.official07@gmail.com...");
    // You should put the actual password here just for testing! Wait, I can't.
    // Let's just try selecting as anon first.
    
    console.log("Checking admin_users as unauthenticated anon:");
    const { data: admins, error: adminsError } = await supabase.from("admin_users").select("*");
    console.log("Admins:", admins);
    if (adminsError) console.error("Admins Error:", adminsError);
}

check();
