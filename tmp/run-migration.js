// Run the CMS migration SQL against Supabase using the Management API
// Usage: node tmp/run-migration.js

const SUPABASE_URL = "https://nyfghjbpnsmqxzsszhvk.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZmdoamJwbnNtcXh6c3N6aHZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjAyOTczNCwiZXhwIjoyMDg3NjA1NzM0fQ.S3fL3YJgSP8osglW_NyT0p1DYZKC-IV9Y4AnnFolYMU";

const statements = [
    // Gallery Images table
    `CREATE TABLE IF NOT EXISTS gallery_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        image_url TEXT NOT NULL,
        alt_text TEXT,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY`,
    `CREATE POLICY "gallery_images_public_select_policy" ON gallery_images FOR SELECT TO anon, authenticated USING (true)`,
    `CREATE POLICY "gallery_images_admin_insert_policy" ON gallery_images FOR INSERT TO authenticated WITH CHECK (auth.uid() IN (SELECT id FROM admin_users))`,
    `CREATE POLICY "gallery_images_admin_update_policy" ON gallery_images FOR UPDATE TO authenticated USING (auth.uid() IN (SELECT id FROM admin_users)) WITH CHECK (auth.uid() IN (SELECT id FROM admin_users))`,
    `CREATE POLICY "gallery_images_admin_delete_policy" ON gallery_images FOR DELETE TO authenticated USING (auth.uid() IN (SELECT id FROM admin_users))`,

    // Reviews table
    `CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_name TEXT NOT NULL,
        review_text TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `ALTER TABLE reviews ENABLE ROW LEVEL SECURITY`,
    `CREATE POLICY "reviews_public_select_policy" ON reviews FOR SELECT TO anon, authenticated USING (true)`,
    `CREATE POLICY "reviews_admin_insert_policy" ON reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() IN (SELECT id FROM admin_users))`,
    `CREATE POLICY "reviews_admin_update_policy" ON reviews FOR UPDATE TO authenticated USING (auth.uid() IN (SELECT id FROM admin_users)) WITH CHECK (auth.uid() IN (SELECT id FROM admin_users))`,
    `CREATE POLICY "reviews_admin_delete_policy" ON reviews FOR DELETE TO authenticated USING (auth.uid() IN (SELECT id FROM admin_users))`,
];

async function runSQL(sql, index) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            apikey: SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ query: sql }),
    });

    if (res.ok) {
        console.log(`  [${index + 1}/${statements.length}] ✓ Success`);
        return true;
    }

    // If exec_sql RPC doesn't exist, fall back to a different approach
    const text = await res.text();
    if (text.includes("Could not find the function") || text.includes("404")) {
        return null; // Signal to try alternative
    }
    console.log(`  [${index + 1}/${statements.length}] ✗ Error: ${text}`);
    return false;
}

async function main() {
    console.log("=== Running CMS Migration ===\n");

    // First, try if exec_sql RPC function exists
    const testResult = await runSQL("SELECT 1", -1);

    if (testResult === null) {
        // exec_sql doesn't exist, we need to create it first
        console.log("Creating exec_sql helper function...\n");

        const createFnRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                apikey: SERVICE_ROLE_KEY,
                Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
            },
        });

        // Alternative: use the pg endpoint (Supabase exposes this on some plans)
        // Let's try the /pg endpoint
        console.log("Trying direct SQL via /pg endpoint...\n");

        const allSQL = statements.join(";\n") + ";";
        
        const pgRes = await fetch(`${SUPABASE_URL}/pg/query`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                apikey: SERVICE_ROLE_KEY,
                Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({ query: allSQL }),
        });

        console.log("Status:", pgRes.status);
        const pgText = await pgRes.text();
        console.log("Response:", pgText.substring(0, 500));

        if (!pgRes.ok) {
            console.log("\n--- Alternative: Please run SQL manually ---");
            console.log("The automated approach didn't work.");
            console.log("Please paste the SQL from supabase/migrations/0004_cms_schema.sql");
            console.log("into the Supabase SQL Editor and click Run.");
        }
        return;
    }

    // exec_sql exists, run each statement
    let allSuccess = true;
    for (let i = 0; i < statements.length; i++) {
        const result = await runSQL(statements[i], i);
        if (!result) allSuccess = false;
    }

    console.log(allSuccess ? "\n✓ Migration completed successfully!" : "\n✗ Some statements failed. Check errors above.");
}

main().catch(console.error);
