"use client";

import { useState, type FormEvent } from "react";
import { UserPlus, Loader2, CheckCircle2, XCircle, Sparkles } from "lucide-react";

interface IRegistrationForm {
    name: string;
    age: string;
    phone: string;
    email: string;
    danceStyle: string;
    preferredBatch: string;
}

interface FormErrors {
    name?: string;
    age?: string;
    phone?: string;
    email?: string;
    danceStyle?: string;
    preferredBatch?: string;
}

const initialFormData: IRegistrationForm = {
    name: "",
    age: "",
    phone: "",
    email: "",
    danceStyle: "",
    preferredBatch: "",
};

export default function RegistrationForm() {
    const [formData, setFormData] = useState<IRegistrationForm>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);
    const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim() || formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters.";
        }

        const ageNum = parseInt(formData.age, 10);
        if (!formData.age || isNaN(ageNum) || ageNum < 4) {
            newErrors.age = "Age must be a number, minimum 4.";
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "Enter a valid 10-digit Indian phone number.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!formData.danceStyle) {
            newErrors.danceStyle = "Please select a dance style.";
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

        if (!validate()) return;

        setIsLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setSubmitStatus({
                    type: "success",
                    message:
                        data.message ||
                        "Registration successful! We will contact you shortly.",
                });
                if (data.welcomeMessage) {
                    setWelcomeMessage(data.welcomeMessage);
                }
                setFormData(initialFormData);
                setErrors({});
            } else {
                setSubmitStatus({
                    type: "error",
                    message:
                        data.error || "Something went wrong. Please try again.",
                });
            }
        } catch {
            setSubmitStatus({
                type: "error",
                message: "Network error. Please check your connection and try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const updateField = (field: keyof IRegistrationForm, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <section id="register" className="bg-white py-20 lg:py-28">
            <div className="max-w-lg mx-auto px-6">
                <div className="text-center mb-10">
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D32F2F] mb-4 block">
                        Get Started
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
                        Register for a Batch
                    </h2>
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
                            <CheckCircle2
                                size={20}
                                className="text-green-600 mt-0.5 shrink-0"
                            />
                        ) : (
                            <XCircle
                                size={20}
                                className="text-red-600 mt-0.5 shrink-0"
                            />
                        )}
                        <p className="text-sm leading-relaxed">
                            {submitStatus.message}
                        </p>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 flex flex-col gap-5"
                    noValidate
                >
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] outline-none transition-all bg-gray-50 ${errors.name
                                ? "border-red-400"
                                : "border-gray-200"
                                }`}
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Age */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Age
                        </label>
                        <input
                            type="number"
                            required
                            placeholder="Enter your age"
                            min={4}
                            value={formData.age}
                            onChange={(e) => updateField("age", e.target.value)}
                            className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] outline-none transition-all bg-gray-50 ${errors.age
                                ? "border-red-400"
                                : "border-gray-200"
                                }`}
                        />
                        {errors.age && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.age}
                            </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            required
                            placeholder="10-digit number (e.g. 9876543210)"
                            value={formData.phone}
                            onChange={(e) =>
                                updateField("phone", e.target.value)
                            }
                            className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] outline-none transition-all bg-gray-50 ${errors.phone
                                ? "border-red-400"
                                : "border-gray-200"
                                }`}
                        />
                        {errors.phone && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) =>
                                updateField("email", e.target.value)
                            }
                            className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] outline-none transition-all bg-gray-50 ${errors.email
                                ? "border-red-400"
                                : "border-gray-200"
                                }`}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Dance Style */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Dance Style
                        </label>
                        <select
                            required
                            value={formData.danceStyle}
                            onChange={(e) =>
                                updateField("danceStyle", e.target.value)
                            }
                            className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] outline-none transition-all bg-gray-50 appearance-none ${errors.danceStyle
                                ? "border-red-400"
                                : "border-gray-200"
                                }`}
                        >
                            <option value="">Select a dance style</option>
                            <option value="western">Western Dance</option>
                            <option value="zumba">Zumba Fitness</option>
                            <option value="bollywood">Bollywood</option>
                            <option value="bharatanatyam">Bharatanatyam</option>
                        </select>
                        {errors.danceStyle && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.danceStyle}
                            </p>
                        )}
                    </div>

                    {/* Preferred Batch */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Preferred Batch
                        </label>
                        <select
                            required
                            value={formData.preferredBatch}
                            onChange={(e) =>
                                updateField("preferredBatch", e.target.value)
                            }
                            className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] outline-none transition-all bg-gray-50 appearance-none ${errors.preferredBatch
                                ? "border-red-400"
                                : "border-gray-200"
                                }`}
                        >
                            <option value="">Select a batch</option>
                            <option value="morning">Morning</option>
                            <option value="evening">Evening</option>
                            <option value="weekend">Weekend</option>
                        </select>
                        {errors.preferredBatch && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.preferredBatch}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#D32F2F] rounded-lg hover:bg-[#B71C1C] transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <UserPlus size={18} />
                                Submit Registration
                            </>
                        )}
                    </button>
                </form>

                {/* AI Welcome Message Card */}
                {welcomeMessage && (
                    <div className="mt-8 rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-md">
                        <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
                            {welcomeMessage}
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                            <Sparkles size={12} />
                            <span>Powered by AI ✨</span>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
