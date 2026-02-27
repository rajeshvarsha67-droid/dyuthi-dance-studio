const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nyfghjbpnsmqxzsszhvk.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZmdoamJwbnNtcXh6c3N6aHZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjAyOTczNCwiZXhwIjoyMDg3NjA1NzM0fQ.S3fL3YJgSP8osglW_NyT0p1DYZKC-IV9Y4AnnFolYMU';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkSchema() {
    // 1. Try to get column info by selecting an empty set
    const { data: cols, error: colErr } = await supabase
        .from('registrations')
        .select('*')
        .limit(0);

    console.log('SELECT * limit 0:', JSON.stringify({ data: cols, error: colErr }, null, 2));

    // 2. Read existing rows to see what dance_style values exist
    const { data: rows, error: rowErr } = await supabase
        .from('registrations')
        .select('*')
        .limit(5);

    console.log('Existing rows:', JSON.stringify({ data: rows, error: rowErr }, null, 2));

    // 3. Try insert WITHOUT dance_style
    const result = await supabase
        .from('registrations')
        .insert({
            name: 'Test No Style',
            age: 25,
            phone: '9999999111',
            email: 'test-nostyle@test.com',
            preferred_batch: 'Zumba batch',
        })
        .select()
        .single();

    console.log('Insert without dance_style:', JSON.stringify(result, null, 2));
    if (result.data) {
        await supabase.from('registrations').delete().eq('id', result.data.id);
        console.log('Cleaned up.');
    }

    // 4. Try to get CHECK constraint info 
    const { data: checkData, error: checkErr } = await supabase
        .from('information_schema.check_constraints')
        ?.select?.('*');
    console.log('check_constraints:', JSON.stringify({ data: checkData, error: checkErr }, null, 2));
}

checkSchema().catch(console.error);
