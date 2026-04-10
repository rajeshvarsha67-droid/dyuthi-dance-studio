"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, XCircle, ArrowLeft, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus(null);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus({ type: "error", message: "Please enter a valid email address." });
            return;
        }

        if (!supabase) {
            setStatus({ type: "error", message: "Auth service is unavailable. Please try again later." });
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: "https://dyuthi-dance-studio.rajeshvarsha67.workers.dev/update-password",
            });

            if (error) throw error;

            setStatus({
                type: "success",
                message:
                    "Password reset link sent! Please check your inbox (and spam folder) for an email with instructions to reset your password.",
            });
        } catch (error: any) {
            setStatus({
                type: "error",
                message: error.message || "Something went wrong. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white flex items-center justify-center px-6 py-24">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-14 text-[#1A1A1A] flex flex-col items-center">
                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400 mb-4 block font-sans">
                        Account Recovery
                    </span>
                    <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
                        Forgot Password
                    </h1>
                    <p className="text-sm text-gray-500 font-sans max-w-sm">
                        Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                    </p>
                </div>

                {/* Status Banner */}
                {status && (
                    <div
                        className={`mb-6 flex items-start gap-3 rounded-xl border p-4 ${
                            status.type === "success"
                                ? "border-green-200 bg-green-50 text-green-800"
                                : "border-red-200 bg-red-50 text-red-800"
                        }`}
                    >
                        {status.type === "success" ? (
                            <CheckCircle2 size={20} className="text-green-600 mt-0.5 shrink-0" />
                        ) : (
                            <XCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
                        )}
                        <p className="text-sm leading-relaxed">{status.message}</p>
                    </div>
                )}

                {/* Form */}
                {status?.type !== "success" && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                        <div>
                            <label className="block text-[11px] uppercase tracking-[0.15em] font-medium text-gray-400 mb-2 font-sans">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    size={16}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-300 focus:border-[#1A1A1A] py-3 pl-6 text-sm outline-none transition-colors duration-300 font-sans"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-4 text-[11px] uppercase tracking-[0.15em] font-semibold bg-[#1A1A1A] text-white hover:bg-[#333] transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed font-sans"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> Sending Reset Link...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>
                    </form>
                )}

                {/* Back to login */}
                <div className="text-center mt-8">
                    <Link
                        href="/#login"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1A1A1A] transition-colors font-sans"
                    >
                        <ArrowLeft size={14} />
                        Back to Log In
                    </Link>
                </div>
            </div>
        </main>
    );
}
