"use client";

import { useState, useEffect, useRef, useCallback, type FormEvent } from "react";
import { UserPlus, Loader2, CheckCircle2, XCircle, LogIn, LogOut, Mail, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Data shape coming from Supabase batches table
interface BatchOption {
    id: string;
    branch: string;
    dance_style: string;
}

interface RegistrationFormProps {
    batches?: BatchOption[];
}

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

const initialFormData: IRegistrationForm = {
    name: "",
    age: "",
    whatsapp: "",
    email: "",
    password: "",
    location: "",
    preferredBatch: "",
};

type AuthMode = "signup" | "login" | "authenticated" | "verify_otp";

export default function RegistrationForm({ batches = [] }: RegistrationFormProps) {
    const router = useRouter();
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

    // OTP verification state
    const [otpCode, setOtpCode] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [pendingFormData, setPendingFormData] = useState<IRegistrationForm | null>(null);
    const [resendCooldown, setResendCooldown] = useState(0);
    const cooldownRef = useRef<NodeJS.Timeout | null>(null);

    // Check for existing session on mount
    useEffect(() => {
        if (!supabase) return;

        const checkSession = async () => {
            // TypeScript still requires the check because supabase could theoretically be reassigned, 
            // though we know it won't be in this scope.
            if (!supabase) return;
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                handleUserLogin(session.user);
            }
        };
        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
            if (session?.user) {
                handleUserLogin(session.user);
            } else {
                setUser(null);
                setAuthMode(window.location.hash === "#login" ? "login" : "signup");
                setFormData(initialFormData);
            }
        });

        // Listen for hash changes to switch between login and signup
        const handleHashChange = () => {
            if (window.location.hash === "#login") {
                setAuthMode("login");
            } else if (window.location.hash === "#register") {
                setAuthMode("signup");
            }
        };
        
        // Listen for custom events for more reliable Navigation switching
        const handleCustomAuthChange = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail === 'login') {
                setAuthMode('login');
                window.location.hash = '#login';
            } else if (customEvent.detail === 'signup') {
                setAuthMode('signup');
                window.location.hash = '#register';
            }
        };

        handleHashChange(); // check on mount
        window.addEventListener("hashchange", handleHashChange);
        window.addEventListener("switchAuthMode", handleCustomAuthChange);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener("hashchange", handleHashChange);
            window.removeEventListener("switchAuthMode", handleCustomAuthChange);
        };
    }, []);

    // Countdown timer for resend cooldown
    useEffect(() => {
        if (resendCooldown > 0) {
            cooldownRef.current = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
            return () => { if (cooldownRef.current) clearTimeout(cooldownRef.current); };
        }
    }, [resendCooldown]);

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
                router.push("/mock-checkout");

            } else if (authMode === "verify_otp") {
                // OTP Verification step
                if (!otpCode || otpCode.length !== 8) {
                    setSubmitStatus({ type: "error", message: "Please enter the 8-digit code from your email." });
                    setIsLoading(false);
                    return;
                }

                // Try verifying with type 'email' first, fall back to 'signup'
                const { error: verifyError } = await supabase.auth.verifyOtp({
                    email: signupEmail,
                    token: otpCode,
                    type: "email",
                });

                if (verifyError) {
                    // Fallback: try with type 'signup' in case the token was generated differently
                    const { error: fallbackError } = await supabase.auth.verifyOtp({
                        email: signupEmail,
                        token: otpCode,
                        type: "signup",
                    });
                    if (fallbackError) throw fallbackError;
                }

                // OTP verified — now submit class registration
                await submitClassRegistration(pendingFormData!);

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

                    // Transition to OTP verification screen
                    setSignupEmail(formData.email);
                    setPendingFormData({ ...formData });
                    setAuthMode("verify_otp");
                    setOtpCode("");
                    setResendCooldown(60);
                    setSubmitStatus({
                        type: "success",
                        message: `We've sent an 8-digit verification code to ${formData.email}. Please check your inbox (and spam folder).`,
                    });
                    setIsLoading(false);
                    return;
                }

                // Already authenticated — just submit class registration
                await submitClassRegistration(formData);
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

    // Submit class registration to backend API
    const submitClassRegistration = async (data: IRegistrationForm) => {
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: data.name,
                age: data.age,
                whatsapp: data.whatsapp,
                email: data.email,
                location: data.location,
                preferredBatch: data.preferredBatch,
            }),
        });

        const result = await res.json();

        if (res.ok) {
            setSubmitStatus({
                type: "success",
                message: result.message || "Registration successful! We will contact you shortly.",
            });
            if (result.welcomeMessage) {
                setWelcomeMessage(result.welcomeMessage);
            }
            setPendingFormData(null);
            setOtpCode("");
            setSignupEmail("");
            setFormData((prev) => ({ ...prev, location: "", preferredBatch: "", password: "" }));
            setErrors({});
        } else {
            setSubmitStatus({
                type: "error",
                message: result.error || "Something went wrong. Please try again.",
            });
        }
    };

    // Resend OTP email
    const handleResendOtp = async () => {
        if (!supabase || resendCooldown > 0) return;
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.resend({
                email: signupEmail,
                type: "signup",
            });
            if (error) throw error;
            setResendCooldown(60);
            setSubmitStatus({
                type: "success",
                message: `A new verification code has been sent to ${signupEmail}.`,
            });
        } catch (error: any) {
            setSubmitStatus({
                type: "error",
                message: error.message || "Failed to resend code. Please try again.",
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

    // Derive unique branches from batch data
    const uniqueBranches = Array.from(new Set(batches.map((b) => b.branch))).sort();

    // Filter dance styles for the selected branch
    const availableBatches = formData.location
        ? batches
              .filter((b) => b.branch === formData.location)
              .map((b) => b.dance_style)
        : [];

    return (
        <section id="register" className="bg-white py-24 lg:py-32 relative">
            <div id="login" className="absolute -top-20" />
            <div className="max-w-lg mx-auto px-6">
                <div className="text-center mb-14 text-[#1A1A1A] flex flex-col items-center">
                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400 mb-4 block font-sans">
                        Get Started
                    </span>
                    <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
                        {authMode === "login"
                            ? "Log In to Your Account"
                            : authMode === "authenticated"
                                ? "Register for a Class"
                                : authMode === "verify_otp"
                                    ? "Verify Your Email"
                                    : "Sign Up & Register"}
                    </h2>

                    {authMode === 'authenticated' && user && (
                        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-2">
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
                    className="p-0 lg:p-2 flex flex-col gap-6"
                    noValidate
                >
                    {/* Basic Info - Hidden if just logging in or verifying OTP */}
                    {authMode !== "login" && authMode !== "verify_otp" && (
                        <>
                            {/* Name */}
                            <div>
                                <label className="block text-[11px] uppercase tracking-[0.15em] font-medium text-gray-400 mb-2 font-sans">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                    className={`w-full bg-transparent border-b border-gray-300 focus:border-[#1A1A1A] py-3 text-sm outline-none transition-colors duration-300 font-sans ${errors.name ? "border-red-400" : ""}`}
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            {/* Age & WhatsApp row */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-[11px] uppercase tracking-[0.15em] font-medium text-gray-400 mb-2 font-sans">Age</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="Age"
                                        min={4}
                                        value={formData.age}
                                        onChange={(e) => updateField("age", e.target.value)}
                                        className={`w-full bg-transparent border-b border-gray-300 focus:border-[#1A1A1A] py-3 text-sm outline-none transition-colors duration-300 font-sans ${errors.age ? "border-red-400" : ""}`}
                                    />
                                    {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
                                </div>
                                <div className="flex-[2]">
                                    <label className="block text-[11px] uppercase tracking-[0.15em] font-medium text-gray-400 mb-2 font-sans">WhatsApp Number</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="10-digit number"
                                        value={formData.whatsapp}
                                        onChange={(e) => updateField("whatsapp", e.target.value)}
                                        className={`w-full bg-transparent border-b border-gray-300 focus:border-[#1A1A1A] py-3 text-sm outline-none transition-colors duration-300 font-sans ${errors.whatsapp ? "border-red-400" : ""}`}
                                    />
                                    {errors.whatsapp && <p className="mt-1 text-xs text-red-500">{errors.whatsapp}</p>}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Email - Used in signup and login modes */}
                    {authMode !== "authenticated" && authMode !== "verify_otp" && (
                        <div>
                            <label className="block text-[11px] uppercase tracking-[0.15em] font-medium text-gray-400 mb-2 font-sans">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => updateField("email", e.target.value)}
                                className={`w-full bg-transparent border-b border-gray-300 focus:border-[#1A1A1A] py-3 text-sm outline-none transition-colors duration-300 font-sans ${errors.email ? "border-red-400" : ""}`}
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>
                    )}

                    {/* Password */}
                    {authMode !== "authenticated" && authMode !== "verify_otp" && (
                        <div>
                            <label className="block text-[11px] uppercase tracking-[0.15em] font-medium text-gray-400 mb-2 font-sans">Password</label>
                            <input
                                type="password"
                                required
                                placeholder="Min 6 characters"
                                value={formData.password}
                                onChange={(e) => updateField("password", e.target.value)}
                                className={`w-full bg-transparent border-b border-gray-300 focus:border-[#1A1A1A] py-3 text-sm outline-none transition-colors duration-300 font-sans ${errors.password ? "border-red-400" : ""}`}
                            />
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                            {authMode === "login" && (
                                <div className="mt-2 text-right">
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs text-[#D32F2F] font-medium hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Class Details - Hidden in Login and OTP mode */}
                    {authMode !== "login" && authMode !== "verify_otp" && (
                        <div className="pt-4 border-t mt-4 border-gray-200 flex flex-col gap-6">
                            {/* Location */}
                            <div>
                                <label className="block text-[11px] uppercase tracking-[0.15em] font-medium text-gray-400 mb-2 font-sans">Location</label>
                                <select
                                    required
                                    value={formData.location}
                                    onChange={(e) => updateField("location", e.target.value)}
                                    className={`w-full bg-transparent border-b border-gray-300 focus:border-[#1A1A1A] py-3 text-sm outline-none transition-colors duration-300 appearance-none font-sans ${errors.location ? "border-red-400" : ""}`}
                                >
                                    <option value="">Select a branch</option>
                                    {uniqueBranches.map((branch) => (
                                        <option key={branch} value={branch}>
                                            {branch}
                                        </option>
                                    ))}
                                </select>
                                {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
                            </div>

                            {/* Preferred Batch */}
                            <div>
                                <label className="block text-[11px] uppercase tracking-[0.15em] font-medium text-gray-400 mb-2 font-sans">Preferred Batch</label>
                                <select
                                    required
                                    value={formData.preferredBatch}
                                    onChange={(e) => updateField("preferredBatch", e.target.value)}
                                    disabled={!formData.location}
                                    className={`w-full bg-transparent border-b border-gray-300 focus:border-[#1A1A1A] py-3 text-sm outline-none transition-colors duration-300 appearance-none font-sans ${errors.preferredBatch ? "border-red-400" : ""} ${!formData.location ? "opacity-50 cursor-not-allowed" : ""}`}
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

                    {/* OTP Verification UI */}
                    {authMode === "verify_otp" && (
                        <div className="flex flex-col items-center gap-5">
                            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                                <Mail size={28} className="text-blue-500" />
                            </div>
                            <p className="text-sm text-slate-600 text-center">
                                Enter the 8-digit code sent to <strong className="text-slate-800">{signupEmail}</strong>
                            </p>

                            {/* OTP Input */}
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={8}
                                placeholder="00000000"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
                                className="w-48 text-center text-2xl font-mono tracking-[0.5em] py-3 bg-transparent border-b border-gray-300 focus:border-[#1A1A1A] outline-none transition-colors duration-300"
                                autoFocus
                            />

                            {/* Resend */}
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={resendCooldown > 0 || isLoading}
                                className="flex items-center gap-1.5 text-sm text-[#D32F2F] font-medium hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed transition-colors"
                            >
                                <RefreshCw size={14} />
                                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend verification code"}
                            </button>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 text-[11px] uppercase tracking-[0.15em] font-semibold bg-[#1A1A1A] text-white hover:bg-[#333] transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed font-sans"
                    >
                        {isLoading ? (
                            <><Loader2 size={18} className="animate-spin" /> {authMode === "login" ? "Logging In..." : authMode === "verify_otp" ? "Verifying..." : "Submitting..."}</>
                        ) : (
                            <>
                                {authMode === "login" ? <LogIn size={18} /> : authMode === "verify_otp" ? <CheckCircle2 size={18} /> : <UserPlus size={18} />}
                                {authMode === "login" ? "Log In" : authMode === "authenticated" ? "Complete Registration" : authMode === "verify_otp" ? "Verify & Complete Registration" : "Sign Up & Register"}
                            </>
                        )}
                    </button>

                    {/* Mode Toggle */}
                    {authMode !== "authenticated" && authMode !== "verify_otp" && (
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
                    {authMode === "verify_otp" && (
                        <p className="text-center text-sm text-slate-600 mt-2">
                            Wrong email?{" "}
                            <button
                                type="button"
                                onClick={() => {
                                    setAuthMode("signup");
                                    setOtpCode("");
                                    setSignupEmail("");
                                    setPendingFormData(null);
                                    setSubmitStatus(null);
                                    setResendCooldown(0);
                                }}
                                className="font-semibold text-[#D32F2F] hover:underline"
                            >
                                Go back to sign up
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
