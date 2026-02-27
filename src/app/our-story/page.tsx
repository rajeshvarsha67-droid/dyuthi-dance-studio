import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import { Heart, Sparkles, Users, Shield } from "lucide-react";

const values = [
    { icon: Heart, text: "Fun and inclusive" },
    { icon: Sparkles, text: "Confidence-building" },
    { icon: Shield, text: "Rooted in strong technique" },
    { icon: Users, text: "A way to create lasting friendships" },
];

export default function OurStoryPage() {
    return (
        <>
            <Navbar />
            <main className="bg-white">
                {/* Hero Banner */}
                <section className="bg-slate-900 py-20 lg:py-28 text-center">
                    <div className="max-w-3xl mx-auto px-6">
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D32F2F] mb-4 block">
                            Our Story
                        </span>
                        <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                            The Heart Behind Dyuthi
                        </h1>
                    </div>
                </section>

                {/* Story Content */}
                <section className="py-16 lg:py-24">
                    <div className="max-w-3xl mx-auto px-6 lg:px-12">
                        <p className="text-base lg:text-lg text-slate-600 leading-relaxed mb-6">
                            Founded by <strong className="text-slate-800">Dona Benny</strong>, an active live stage performer with over 10 years of experience in stage and television performances, Dyuthi Dance Studio is rooted in passion and purpose. Dona holds an <strong className="text-slate-800">M.A. in Bharatanatyam</strong>, has extensive experience in Western dance, and has choreographed for films and stage shows.
                        </p>
                        <p className="text-base lg:text-lg text-slate-600 leading-relaxed mb-12">
                            After stepping away from her career as a school teacher, she created Dyuthi Dance Studio to share her knowledge and love for dance with students of all ages—beyond the classroom and onto a bigger stage.
                        </p>

                        {/* More Than Just Dance */}
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6">
                            More Than Just Dance
                        </h2>
                        <p className="text-base lg:text-lg text-slate-600 leading-relaxed mb-6">
                            At Dyuthi, we believe dance should be:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                            {values.map(({ icon: Icon, text }) => (
                                <div
                                    key={text}
                                    className="flex items-center gap-3 bg-gray-50 px-5 py-4 rounded-xl border border-gray-100"
                                >
                                    <Icon size={20} className="text-[#D32F2F] shrink-0" />
                                    <span className="text-sm font-medium text-slate-700">{text}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-base lg:text-lg text-slate-600 leading-relaxed mb-12">
                            We&apos;re proud to be a space where students feel encouraged, supported, and inspired every step of the way.
                        </p>

                        {/* Join CTA */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 lg:p-10 text-center">
                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                                Join the Dyuthi Dance Family
                            </h2>
                            <p className="text-base text-slate-300 leading-relaxed mb-6">
                                Whether you want to learn, perform, stay active, or simply enjoy dancing, Dyuthi Dance Studio is the place for you.
                            </p>
                            <p className="text-lg font-semibold text-white italic mb-6">
                                Step in. Dance freely. Grow confidently.
                            </p>
                            <a
                                href="/#register"
                                className="inline-block px-8 py-3.5 text-base font-semibold text-white bg-[#D32F2F] rounded-lg hover:bg-[#B71C1C] transition-colors shadow-lg"
                            >
                                Register Now
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            <WhatsAppFAB />
        </>
    );
}
