const ACCOUNT_ID = "453ff05113690cf103fa7b84d2e9475d";
const WORKER_NAME = "dyuthi-dance-studio";
const TOKEN = "jN7_UKWhfbkoOncW6bNfcEMQ1aJ8lX-czHvyrAPgXGY.pIPs5BFiCn4FpUXswVIAGqUeWr8JRKT4SY7A4ZN1cSI";

async function putSecret(name, value) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${WORKER_NAME}/secrets`;
    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            text: value,
            type: "secret_text"
        })
    });
    const data = await res.json();
    if (data.success) {
        console.log(`Successfully set secret: ${name}`);
    } else {
        console.error(`Failed to set secret: ${name}`, data.errors);
    }
}

async function run() {
    await putSecret("NEXT_PUBLIC_SUPABASE_URL", "https://nyfghjbpnsmqxzsszhvk.supabase.co");
    await putSecret("NEXT_PUBLIC_SUPABASE_ANON_KEY", "sb_publishable_q8mYfELswh9IlIPPBJoGcg_tg7YK7vr");
}

run().catch(console.error);
