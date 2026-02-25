import { GoogleGenerativeAI } from "@google/generative-ai";

interface RegistrationData {
    name: string;
    age: number;
    danceStyle: string;
    preferredBatch: string;
}

const STYLE_LABELS: Record<string, string> = {
    western: "Western Dance",
    zumba: "Zumba Fitness",
    bollywood: "Bollywood",
    bharatanatyam: "Bharatanatyam",
};

const BATCH_LABELS: Record<string, string> = {
    morning: "Morning",
    evening: "Evening",
    weekend: "Weekend",
};

const SYSTEM_PROMPT = `You are the friendly student coordinator at Dyuthi Dance Studio, a vibrant dance academy in Kochi, Kerala.

Studio Facts:
- Founded by Dona Benny (M.A. in Bharatanatyam, 10+ years of experience)
- Co-founder: Tony (12+ years experience, Bollywood/Western/Zumba specialist)
- Choreographer: Swaliha (3+ years experience, Western/Freestyle specialist)
- Locations: Kaloor and Kalamassery branches in Kochi, Kerala
- Dance styles offered: Western Dance, Zumba Fitness, Bollywood, Bharatanatyam
- Ages: Children (6+) and adults welcome
- WhatsApp contact: +91 73061 22860

Your tone is warm, enthusiastic, and professional. You genuinely care about each student.`;

export async function generateWelcomeMessage(
    data: RegistrationData
): Promise<string> {
    const styleLabel = STYLE_LABELS[data.danceStyle] || data.danceStyle;
    const batchLabel = BATCH_LABELS[data.preferredBatch] || data.preferredBatch;

    const userPrompt = `A new student has just registered with the following details:
- Name: ${data.name}
- Age: ${data.age}
- Chosen Dance Style: ${styleLabel}
- Preferred Batch: ${batchLabel}

Generate a warm, personalized welcome message (3-4 short paragraphs) that:
1. Greets them by name and welcomes them to Dyuthi Dance Studio
2. Explains why their chosen dance style is amazing and what they'll learn
3. Mentions the benefits of their chosen batch timing
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
        const styleLabel =
            STYLE_LABELS[data.danceStyle] || data.danceStyle;
        const batchLabel =
            BATCH_LABELS[data.preferredBatch] || data.preferredBatch;

        return `Welcome to Dyuthi Dance Studio, ${data.name}! 🎉 We're thrilled to have you join our ${styleLabel} family. Our team will reach out to you shortly on WhatsApp to confirm your ${batchLabel} batch details. See you on the dance floor!`;
    }
}
