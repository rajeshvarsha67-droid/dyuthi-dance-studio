"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Loader2, CheckCircle2, XCircle, Lock, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [status, setStatus] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    // Listen for the PASSWORD_RECOVERY event from Supabase
    useEffect(() => {
        if (!supabase) return;

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event: string) => {
                if (event === "PASSWORD_RECOVERY") {
                    setIsReady(true);
                }
            }
        );

        // Also check if we already have a session (user may have landed here with a valid recovery token)
        const checkSession = async () => {
            if (!supabase) return;
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsReady(true);
            }
        };
        checkSession();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus(null);

        if (newPassword.length < 6) {
            setStatus({ type: "error", message: "Password must be at least 6 characters." });
            return;
        }

        if (newPassword !== confirmPassword) {
            setStatus({ type: "error", message: "Passwords do not match." });
            return;
        }

        if (!supabase) {
            setStatus({ type: "error", message: "Auth service is unavailable. Please try again later." });
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) throw error;

            setStatus({
                type: "success",
                message: "Password updated successfully! Redirecting to login...",
            });

            // Redirect after a brief delay so the user can see the success message
            setTimeout(() => {
                router.push("/#login");
            }, 2000);
        } catch (error: any) {
            setStatus({
                type: "error",
                message: error.message || "Failed to update password. Please try again.",
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
                        Account Security
                    </span>
                    <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
                        Set New Password
                    </h1>
                    <p className="text-sm text-gray-500 font-sans max-w-sm">
                        Choose a strong new password for your account.
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

                {/* Not Ready State — user visited without a valid recovery token */}
                {!isReady && !status && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 p-4">
                        <XCircle size={20} className="text-amber-600 mt-0.5 shrink-0" />
                        <div className="text-sm leading-relaxed">
                            <p className="font-semibold mb-1">No recovery session found</p>
                            <p>
                                This page can only be accessed through a password reset link sent to your email.
                                Please{" "}
                                <Link href="/forgot-password" className="font-semibold underline">
                                    request a new reset link
                                </Link>{" "}
                                if you need to change your password.
                            </p>
                        </div>
                    </div>
                )}

                {/* Form — only show when recovery session is active */}
                {isReady && status?.type !== "success" && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                        {/* New Password */}
                        <div>
                            <label className="block text-[11px] uppercase tracking-[0.15em] font-medium text-gray-400 mb-2 font-sans">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="password"
                                    required
                                    placeholder="Min 6 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-300 focus:border-[#1A1A1A] py-3 pl-6 text-sm outline-none transition-colors duration-300 font-sans"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-[11px] uppercase tracking-[0.15em] font-medium text-gray-400 mb-2 font-sans">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="password"
                                    required
                                    placeholder="Re-enter your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-300 focus:border-[#1A1A1A] py-3 pl-6 text-sm outline-none transition-colors duration-300 font-sans"
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
                                    <Loader2 size={18} className="animate-spin" /> Updating Password...
                                </>
                            ) : (
                                "Update Password"
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
