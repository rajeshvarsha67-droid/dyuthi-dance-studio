const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function check() {
    console.log("Checking admin_users:");
    const { data: admins, error: adminsError } = await supabase.from("admin_users").select("*");
    console.log("Admins:", admins);
    if (adminsError) console.error("Admins Error:", adminsError);

    console.log("\nChecking auth.users:");
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    console.log("Users:", users?.users.map(u => u.email));
    if (usersError) console.error("Users Error:", usersError);
}

check();
