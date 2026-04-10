import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StudentPayPage() {
    const supabase = await createSupabaseServerClient();

    // 1. Check for an active session
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/admin/login");
    }

    // 2. Fetch student details from the registrations table
    const { data: student } = await supabase
        .from("registrations")
        .select("name, email, phone, preferred_batch, Location")
        .eq("email", user.email)
        .maybeSingle();

    const studentName = student?.name || user.email?.split("@")[0] || "Student";
    const batchName = student?.preferred_batch || "Your Batch";
    const branch = student?.Location || "";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 flex items-center justify-center px-4 py-12">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-charcoal/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-charcoal/3 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md space-y-6">
                {/* Branding Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-charcoal rounded-xl mb-4 shadow-lg">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-charcoal font-serif tracking-tight">
                        Payment Portal
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Dyuthi Dance Studio
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 overflow-hidden">
                    {/* Welcome Banner */}
                    <div className="bg-charcoal px-6 py-5 text-white">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">Welcome back,</p>
                        <h2 className="text-xl font-bold font-serif">{studentName}!</h2>
                        {branch && (
                            <p className="text-xs text-white/50 mt-1">
                                {branch} Branch
                            </p>
                        )}
                    </div>

                    {/* Fee Summary */}
                    <div className="p-6 space-y-5">
                        {/* Batch Info */}
                        <div className="flex items-center justify-between py-3 border-b border-dashed border-gray-100">
                            <div>
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Batch / Style</p>
                                <p className="text-sm font-semibold text-charcoal mt-0.5">{batchName}</p>
                            </div>
                            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs font-semibold">Active</span>
                            </div>
                        </div>

                        {/* Amount Due */}
                        <div className="bg-gray-50 rounded-xl p-5 text-center">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Amount Due</p>
                            <p className="text-4xl font-bold text-charcoal font-serif">
                                ₹1,500
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Monthly Batch Fee</p>
                        </div>

                        {/* Pay Now Button */}
                        <Link
                            href="/mock-checkout"
                            className="flex items-center justify-center gap-2 w-full py-4 bg-charcoal text-white text-sm font-semibold rounded-xl hover:bg-charcoal/90 focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-charcoal/20"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Pay Now
                        </Link>

                        <p className="text-center text-[11px] text-gray-400">
                            Secure payment powered by Razorpay
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400">
                    Need help? Contact us at{" "}
                    <a href="tel:+919876543210" className="text-charcoal underline underline-offset-2">
                        +91 98765 43210
                    </a>
                </p>
            </div>
        </div>
    );
}
