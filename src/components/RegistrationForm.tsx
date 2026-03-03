"use client";

import { useState, useEffect, type FormEvent } from "react";
import { UserPlus, Loader2, CheckCircle2, XCircle, LogIn, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface IRegistrationForm {
    name: string;
    age: string;
    whatsapp: string;
    email: string;
    password?: string;
    location: string;
    preferredBatch: string;
}

interface FormErrors {
    name?: string;
    age?: string;
    whatsapp?: string;
    email?: string;
    password?: string;
    location?: string;
    preferredBatch?: string;
    auth?: string;
}

const LOCATION_BATCHES: Record<string, string[]> = {
    kaloor: ["Zumba batch", "Western dance batch", "Bharathanatyam batch"],
    kalamassery: ["Zumba batch", "Bollywood dance for women", "Western dance batch"],
    bpcl_township: ["Senior batch", "Junior batch"],
};

const LOCATION_LABELS: Record<string, string> = {
    kaloor: "Kaloor branch",
    kalamassery: "Kalamassery branch",
    bpcl_township: "BPCL township",
};

const initialFormData: IRegistrationForm = {
    name: "",
    age: "",
    whatsapp: "",
    email: "",
    password: "",
    location: "",
    preferredBatch: "",
};

type AuthMode = "signup" | "login" | "authenticated";

export default function RegistrationForm() {
    const [formData, setFormData] = useState<IRegistrationForm>(initialFormData);
    const [authMode, setAuthMode] = useState<AuthMode>("signup");
    const [user, setUser] = useState<User | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);
    const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);

    // Check for existing session on mount
    useEffect(() => {
        if (!supabase) return;

        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                handleUserLogin(session.user);
            }
        };
        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                handleUserLogin(session.user);
            } else {
                setUser(null);
                setAuthMode("signup");
                setFormData(initialFormData);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleUserLogin = (user: User) => {
        setUser(user);
        setAuthMode("authenticated");
        // Pre-fill form from metadata
        setFormData((prev) => ({
            ...prev,
            email: user.email || prev.email,
            name: user.user_metadata?.name || prev.name,
            whatsapp: user.user_metadata?.whatsapp || prev.whatsapp,
            age: user.user_metadata?.age?.toString() || prev.age,
        }));
    };

    const handleLogout = async () => {
        if (!supabase) return;
        setIsLoading(true);
        await supabase.auth.signOut();
        setIsLoading(false);
        setSubmitStatus(null);
        setWelcomeMessage(null);
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        // Login mode only requires email and password
        if (authMode === "login") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = "Enter a valid email address.";
            }
            if (!formData.password || formData.password.length < 6) {
                newErrors.password = "Password must be at least 6 characters.";
            }
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        }

        // Signup and Authenticated modes need full form validation
        if (!formData.name.trim() || formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters.";
        }

        const ageNum = parseInt(formData.age, 10);
        if (!formData.age || isNaN(ageNum) || ageNum < 4) {
            newErrors.age = "Age must be a number, minimum 4.";
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(formData.whatsapp)) {
            newErrors.whatsapp = "Enter a valid 10-digit Indian WhatsApp number.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Enter a valid email address.";
        }

        if (authMode === "signup" && (!formData.password || formData.password.length < 6)) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        if (!formData.location) {
            newErrors.location = "Please select a location.";
        }

        if (!formData.preferredBatch) {
            newErrors.preferredBatch = "Please select a preferred batch.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitStatus(null);
        setErrors({});

        if (!validate() || !supabase) {
            if (!supabase) {
                setSubmitStatus({ type: "error", message: "Auth service is unavailable." });
            }
            return;
        }

        setIsLoading(true);

        try {
            if (authMode === "login") {
                // Just log the user in
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password || "",
                });

                if (error) throw error;
                // Success: onAuthStateChange will handle transition to "authenticated"

            } else {
                // Sign Up or already Authenticated class registration
                if (authMode === "signup") {
                    // 1. Create Supabase Auth Account
                    const { error: signUpError } = await supabase.auth.signUp({
                        email: formData.email,
                        password: formData.password || "",
                        options: {
                            data: {
                                name: formData.name,
                                age: formData.age,
                                whatsapp: formData.whatsapp
                            }
                        }
                    });

                    if (signUpError) throw signUpError;
                }

                // 2. Submit the class registration to our backend
                const res = await fetch("/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: formData.name,
                        age: formData.age,
                        whatsapp: formData.whatsapp,
                        email: formData.email,
                        location: formData.location,
                        preferredBatch: formData.preferredBatch,
                    }), // Explicitly omit password
                });

                const data = await res.json();

                if (res.ok) {
                    setSubmitStatus({
                        type: "success",
                        message: data.message || "Registration successful! We will contact you shortly.",
                    });
                    if (data.welcomeMessage) {
                        setWelcomeMessage(data.welcomeMessage);
                    }
                    if (authMode === "signup") {
                        // Keep user data if they just signed up, but clear batch
                        setFormData(prev => ({ ...prev, location: "", preferredBatch: "", password: "" }));
                    } else {
                        setFormData(prev => ({ ...prev, location: "", preferredBatch: "" }));
                    }
                    setErrors({});
                } else {
                    setSubmitStatus({
                        type: "error",
                        message: data.error || "Something went wrong. Please try again.",
                    });
                }
            }
        } catch (error: any) {
            setSubmitStatus({
                type: "error",
                message: error.message || "An unexpected error occurred. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const updateField = (field: keyof IRegistrationForm, value: string) => {
        setFormData((prev) => {
            const updated = { ...prev, [field]: value };
            if (field === "location") {
                updated.preferredBatch = "";
            }
            return updated;
        });
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
        if (field === "location" && errors.preferredBatch) {
            setErrors((prev) => ({ ...prev, preferredBatch: undefined }));
        }
    };

    const availableBatches = formData.location
        ? LOCATION_BATCHES[formData.location] || []
        : [];

    return (
        <section id="register" className="bg-white py-20 lg:py-28">
            <div className="max-w-lg mx-auto px-6">
                <div className="text-center mb-10 text-slate-900 flex flex-col items-center">
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D32F2F] mb-4 block">
                        Get Started
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                        {authMode === "login"
                            ? "Log In to Your Account"
                            : authMode === "authenticated"
                                ? "Register for a Class"
                                : "Sign Up & Register"}
                    </h2>

                    {authMode === 'authenticated' && user && (
                        <div className="flex items-center gap-3 bg-gray-50 border px-4 py-2 rounded-full">
                            <span className="text-sm font-medium">Logged in as {user.user_metadata?.name || user.email}</span>
                            <button onClick={handleLogout} className="text-xs text-red-600 font-bold flex items-center gap-1 hover:underline">
                                <LogOut size={12} /> Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Status Banner */}
                {submitStatus && (
                    <div
                        className={`mb-6 flex items-start gap-3 rounded-xl border p-4 ${submitStatus.type === "success"
                            ? "border-green-200 bg-green-50 text-green-800"
                            : "border-red-200 bg-red-50 text-red-800"
                            }`}
                    >
                        {submitStatus.type === "success" ? (
                            <CheckCircle2 size={20} className="text-green-600 mt-0.5 shrink-0" />
                        ) : (
                            <XCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
                        )}
                        <p className="text-sm leading-relaxed">{submitStatus.message}</p>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 flex flex-col gap-5"
                    noValidate
                >
                    {/* Basic Info - Hidden if just logging in */}
                    {authMode !== "login" && (
                        <>
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                    className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] outline-none transition-all bg-gray-50 ${errors.name ? "border-red-400" : "border-gray-200"}`}
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            {/* Age & WhatsApp row */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Age</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="Age"
                                        min={4}
                                        value={formData.age}
                                        onChange={(e) => updateField("age", e.target.value)}
                                        className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] outline-none transition-all bg-gray-50 ${errors.age ? "border-red-400" : "border-gray-200"}`}
                                    />
                                    {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
                                </div>
                                <div className="flex-[2]">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp Number</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="10-digit number"
                                        value={formData.whatsapp}
                                        onChange={(e) => updateField("whatsapp", e.target.value)}
                                        className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] outline-none transition-all bg-gray-50 ${errors.whatsapp ? "border-red-400" : "border-gray-200"}`}
                                    />
                                    {errors.whatsapp && <p className="mt-1 text-xs text-red-500">{errors.whatsapp}</p>}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Email - Used in all modes */}
                    {authMode !== "authenticated" && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => updateField("email", e.target.value)}
                                className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] outline-none transition-all bg-gray-50 ${errors.email ? "border-red-400" : "border-gray-200"}`}
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>
                    )}

                    {/* Password */}
                    {authMode !== "authenticated" && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <input
                                type="password"
                                required
                                placeholder="Min 6 characters"
                                value={formData.password}
                                onChange={(e) => updateField("password", e.target.value)}
                                className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] outline-none transition-all bg-gray-50 ${errors.password ? "border-red-400" : "border-gray-200"}`}
                            />
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                        </div>
                    )}

                    {/* Class Details - Hidden in Login mode */}
                    {authMode !== "login" && (
                        <div className="pt-2 border-t mt-2 border-gray-100 flex flex-col gap-5">
                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
                                <select
                                    required
                                    value={formData.location}
                                    onChange={(e) => updateField("location", e.target.value)}
                                    className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] outline-none transition-all bg-gray-50 appearance-none ${errors.location ? "border-red-400" : "border-gray-200"}`}
                                >
                                    <option value="">Select a location</option>
                                    <option value="kaloor">Kaloor Branch</option>
                                    <option value="kalamassery">Kalamassery Branch</option>
                                    <option value="bpcl_township">BPCL Township</option>
                                </select>
                                {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
                            </div>

                            {/* Preferred Batch */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred Batch</label>
                                <select
                                    required
                                    value={formData.preferredBatch}
                                    onChange={(e) => updateField("preferredBatch", e.target.value)}
                                    disabled={!formData.location}
                                    className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] outline-none transition-all bg-gray-50 appearance-none ${errors.preferredBatch ? "border-red-400" : "border-gray-200"} ${!formData.location ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    <option value="">{formData.location ? "Select a batch" : "Select a location first"}</option>
                                    {availableBatches.map((batch) => (
                                        <option key={batch} value={batch}>{batch}</option>
                                    ))}
                                </select>
                                {errors.preferredBatch && <p className="mt-1 text-xs text-red-500">{errors.preferredBatch}</p>}
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#D32F2F] rounded-lg hover:bg-[#B71C1C] transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <><Loader2 size={18} className="animate-spin" /> {authMode === "login" ? "Logging In..." : "Submitting..."}</>
                        ) : (
                            <>
                                {authMode === "login" ? <LogIn size={18} /> : <UserPlus size={18} />}
                                {authMode === "login" ? "Log In" : authMode === "authenticated" ? "Complete Registration" : "Sign Up & Register"}
                            </>
                        )}
                    </button>

                    {/* Mode Toggle */}
                    {authMode !== "authenticated" && (
                        <p className="text-center text-sm text-slate-600 mt-2">
                            {authMode === "signup" ? "Already have an account? " : "Don't have an account? "}
                            <button
                                type="button"
                                onClick={() => {
                                    setAuthMode(authMode === "signup" ? "login" : "signup");
                                    setErrors({});
                                    setSubmitStatus(null);
                                }}
                                className="font-semibold text-[#D32F2F] hover:underline"
                            >
                                {authMode === "signup" ? "Log in here" : "Sign up"}
                            </button>
                        </p>
                    )}
                </form>

                {/* AI Welcome Message Card */}
                {welcomeMessage && (
                    <div className="mt-8 rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-md">
                        <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
                            {welcomeMessage}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
