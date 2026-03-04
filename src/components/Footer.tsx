import { MapPin, Phone, ExternalLink, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer id="contact" className="bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* About Column */}
                    <div>
                        <div className="mb-4">
                            <h3 className="text-xl font-bold">Dyuthi Dance Studio</h3>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                            At Dyuthi, dance is joy, confidence, and connection. A welcoming
                            space for children and adults to discover the art of movement.
                        </p>
                        <a
                            href="/our-story"
                            className="text-sm font-medium text-[#D32F2F] hover:text-red-400 transition-colors"
                        >
                            Our Story →
                        </a>
                    </div>

                    {/* Locations Column */}
                    <div>
                        <h3 className="text-base font-semibold mb-4">Our Locations</h3>
                        <div className="flex flex-col gap-5">
                            <div className="flex items-start gap-2">
                                <MapPin size={16} className="text-[#D32F2F] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-slate-300">
                                        Kaloor Branch
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                        Mother Teresa Road, Shenoy Rd, Kaloor, Kochi, Kerala 682017
                                    </p>
                                    <a
                                        href="https://maps.app.goo.gl/HujfH7Exki6525qj7"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-[#D32F2F] hover:text-red-400 transition-colors mt-1"
                                    >
                                        View on Google Maps
                                        <ExternalLink size={10} />
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin size={16} className="text-[#D32F2F] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-slate-300">
                                        Kalamassery Branch
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                        3rd Floor, Maria Plaza, Rajagiri Rd, North Kalamassery, Kalamassery, Kochi, Kerala 683104
                                    </p>
                                    <a
                                        href="https://maps.app.goo.gl/7SNjXquse1rTLesu8"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-[#D32F2F] hover:text-red-400 transition-colors mt-1"
                                    >
                                        View on Google Maps
                                        <ExternalLink size={10} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="text-base font-semibold mb-4">Contact Us</h3>
                        <div className="flex flex-col gap-3">
                            <a
                                href="https://wa.me/917306122860"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                <Phone size={14} className="text-green-500" />
                                +91 73061 22860 (WhatsApp)
                            </a>
                            <a
                                href="tel:+918921146960"
                                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                <Phone size={14} className="text-slate-500" />
                                +91 89211 46960
                            </a>
                            <a
                                href="https://www.instagram.com/dyuthi_dance_studio_/?hl=en"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                <Instagram size={14} className="text-pink-500" />
                                @dyuthi_dance_studio_
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
                    <p className="text-center text-xs text-slate-500">
                        © 2026 Dyuthi Dance Studio. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
