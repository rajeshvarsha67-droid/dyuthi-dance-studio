import { GoogleGenerativeAI } from "@google/generative-ai";

interface RegistrationData {
    name: string;
    age: number;
    location: string;
    preferredBatch: string;
}

const LOCATION_LABELS: Record<string, string> = {
    kaloor: "Kaloor Branch",
    kalamassery: "Kalamassery Branch",
    bpcl_township: "BPCL Township",
};

const SYSTEM_PROMPT = `You are the friendly student coordinator at Dyuthi Dance Studio, a vibrant dance academy in Kochi, Kerala.

Studio Facts:
- Founded by Dona Benny (M.A. in Bharatanatyam, 10+ years of experience)
- Co-founder: Tony (12+ years experience, Bollywood/Western/Zumba specialist)
- Choreographer: Swaliha (3+ years experience, Western/Freestyle specialist)
- Locations: Kaloor Branch, Kalamassery Branch, and BPCL Township in Kochi, Kerala
- Kaloor Branch batches: Zumba batch, Western dance batch, Bharathanatyam batch
- Kalamassery Branch batches: Zumba batch, Bollywood dance for women, Western dance batch
- BPCL Township batches: Senior batch, Junior batch
- Ages: Children (6+) and adults welcome
- WhatsApp contact: +91 73061 22860

Your tone is warm, enthusiastic, and professional. You genuinely care about each student.`;

export async function generateWelcomeMessage(
    data: RegistrationData
): Promise<string> {
    const locationLabel = LOCATION_LABELS[data.location] || data.location;
    const batchLabel = data.preferredBatch;

    const userPrompt = `A new student has just registered with the following details:
- Name: ${data.name}
- Age: ${data.age}
- Chosen Location: ${locationLabel}
- Preferred Batch: ${batchLabel}

Generate a warm, personalized welcome message (3-4 short paragraphs) that:
1. Greets them by name and welcomes them to Dyuthi Dance Studio at their chosen location
2. Explains what their chosen batch involves and what they'll learn
3. Mentions the benefits of joining at their chosen branch
4. Tells them what to expect next (contact via WhatsApp, first class details)

Keep the tone warm, enthusiastic, and professional. Use emojis sparingly (max 3-4 total).`;

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not configured");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: SYSTEM_PROMPT,
        });

        const result = await model.generateContent(userPrompt);
        const text = result.response.text();

        if (text && text.trim().length > 0) {
            return text.trim();
        }

        throw new Error("Empty response from AI");
    } catch {
        // Fallback generic welcome message
        const locationLabel =
            LOCATION_LABELS[data.location] || data.location;
        const batchLabel = data.preferredBatch;

        return `Welcome to Dyuthi Dance Studio, ${data.name}! 🎉 We're thrilled to have you join us at our ${locationLabel} location. Our team will reach out to you shortly on WhatsApp to confirm your ${batchLabel} details. See you on the dance floor!`;
    }
}
