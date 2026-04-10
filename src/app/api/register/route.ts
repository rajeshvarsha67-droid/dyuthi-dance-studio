import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateWelcomeMessage } from "@/lib/gemini";

interface RegistrationBody {
    name: string;
    age: string;
    whatsapp: string;
    email: string;
    location: string;
    preferredBatch: string;
}



function validateBasicFields(body: RegistrationBody): string | null {
    if (!body.name || body.name.trim().length < 2) {
        return "Name must be at least 2 characters.";
    }

    const age = parseInt(body.age, 10);
    if (!body.age || isNaN(age) || age < 4) {
        return "Age must be a number, minimum 4.";
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(body.whatsapp)) {
        return "Enter a valid 10-digit Indian WhatsApp number.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
        return "Enter a valid email address.";
    }

    if (!body.location || !body.location.trim()) {
        return "Please select a valid branch.";
    }

    if (!body.preferredBatch || !body.preferredBatch.trim()) {
        return "Please select a valid batch.";
    }

    return null;
}

export async function POST(request: NextRequest) {
    try {

        if (!supabaseAdmin) {
            return NextResponse.json(
                { error: "Database service is not configured. Please contact support." },
                { status: 503 }
            );
        }

        const body: RegistrationBody = await request.json();

        const validationError = validateBasicFields(body);
        if (validationError) {
            return NextResponse.json(
                { error: validationError },
                { status: 400 }
            );
        }

        // Validate branch + dance_style against the batches table
        const { data: matchingBatch } = await supabaseAdmin
            .from("batches")
            .select("id")
            .eq("branch", body.location)
            .eq("dance_style", body.preferredBatch)
            .limit(1)
            .maybeSingle();

        if (!matchingBatch) {
            return NextResponse.json(
                { error: "The selected branch/batch combination is not valid. Please refresh and try again." },
                { status: 400 }
            );
        }

        const whatsapp = body.whatsapp.trim();

        // Check for duplicate WhatsApp number
        const { data: existing } = await supabaseAdmin
            .from("registrations")
            .select("id")
            .eq("phone", whatsapp)
            .limit(1)
            .maybeSingle();

        if (existing) {
            return NextResponse.json(
                { error: "This WhatsApp number is already registered." },
                { status: 409 }
            );
        }

        // Insert into Supabase
        const { data, error } = await supabaseAdmin
            .from("registrations")
            .insert({
                name: body.name.trim(),
                age: parseInt(body.age, 10),
                phone: whatsapp,
                email: body.email.trim().toLowerCase(),
                Location: body.location,
                preferred_batch: body.preferredBatch,
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", JSON.stringify(error, null, 2));
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
                location: data.Location,
                preferredBatch: data.preferred_batch,
            });

            // Store the AI message back in Supabase
            await supabaseAdmin
                .from("registrations")
                .update({ ai_welcome_message: welcomeMessage })
                .eq("id", data.id);
        } catch (aiError) {
            console.error("Welcome message error:", aiError);
            welcomeMessage = `A very warm welcome to the Dyuthi Dance Studio family! We are absolutely thrilled to have you join our ${data.Location} and embark on your dance journey with us.`;
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
