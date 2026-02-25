import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateWelcomeMessage } from "@/lib/gemini";

interface RegistrationBody {
    name: string;
    age: string;
    phone: string;
    email: string;
    danceStyle: string;
    preferredBatch: string;
}

const VALID_DANCE_STYLES = ["western", "zumba", "bollywood", "bharatanatyam"];
const VALID_BATCHES = ["morning", "evening", "weekend"];

function validateBody(body: RegistrationBody): string | null {
    if (!body.name || body.name.trim().length < 2) {
        return "Name must be at least 2 characters.";
    }

    const age = parseInt(body.age, 10);
    if (!body.age || isNaN(age) || age < 4) {
        return "Age must be a number, minimum 4.";
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(body.phone)) {
        return "Enter a valid 10-digit Indian phone number.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
        return "Enter a valid email address.";
    }

    if (!VALID_DANCE_STYLES.includes(body.danceStyle)) {
        return "Please select a valid dance style.";
    }

    if (!VALID_BATCHES.includes(body.preferredBatch)) {
        return "Please select a valid batch.";
    }

    return null;
}

export async function POST(request: NextRequest) {
    try {
        if (!supabase) {
            return NextResponse.json(
                { error: "Database service is not configured. Please contact support." },
                { status: 503 }
            );
        }

        const body: RegistrationBody = await request.json();

        const validationError = validateBody(body);
        if (validationError) {
            return NextResponse.json(
                { error: validationError },
                { status: 400 }
            );
        }

        const phone = body.phone.trim();

        // Check for duplicate phone number
        const { data: existing } = await supabase
            .from("registrations")
            .select("id")
            .eq("phone", phone)
            .limit(1)
            .single();

        if (existing) {
            return NextResponse.json(
                { error: "This phone number is already registered." },
                { status: 409 }
            );
        }

        // Insert into Supabase
        const { data, error } = await supabase
            .from("registrations")
            .insert({
                name: body.name.trim(),
                age: parseInt(body.age, 10),
                phone: phone,
                email: body.email.trim().toLowerCase(),
                dance_style: body.danceStyle,
                preferred_batch: body.preferredBatch,
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json(
                {
                    error: "Failed to save registration. Please try again.",
                },
                { status: 500 }
            );
        }

        // Generate AI welcome message (non-blocking — failure won't break registration)
        let welcomeMessage = "";
        try {
            welcomeMessage = await generateWelcomeMessage({
                name: data.name,
                age: data.age,
                danceStyle: data.dance_style,
                preferredBatch: data.preferred_batch,
            });

            // Store the AI message back in Supabase
            await supabase
                .from("registrations")
                .update({ ai_welcome_message: welcomeMessage })
                .eq("id", data.id);
        } catch (aiError) {
            console.error("AI welcome message error:", aiError);
            welcomeMessage = `Welcome to Dyuthi Dance Studio, ${data.name}! 🎉 We're thrilled to have you join us. Our team will reach out to you shortly on WhatsApp.`;
        }

        return NextResponse.json(
            {
                message:
                    "Registration successful! We will contact you on WhatsApp shortly.",
                registrationId: data.id,
                welcomeMessage,
            },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            { error: "An unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
}
