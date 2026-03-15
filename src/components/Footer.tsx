"use client";

import { MapPin, Phone, ExternalLink, Instagram } from "lucide-react";
export default function Footer() {
    return (
        <footer id="contact" className="bg-[#1A1A1A] text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {/* About Column */}
                    <div>
                        <div className="mb-6">
                            <h3 className="font-serif text-2xl font-semibold">Dyuthi Dance Studio</h3>
                        </div>
                        <p className="text-sm text-gray-400 leading-[1.9] mb-6 font-sans">
                            At Dyuthi, dance is joy, confidence, and connection. A welcoming
                            space for children and adults to discover the art of movement.
                        </p>
                        <a
                            href="/our-story"
                            className="text-[11px] uppercase tracking-[0.2em] font-medium text-white hover:opacity-50 transition-opacity duration-300 inline-block mb-8 font-sans"
                        >
                            Our Story →
                        </a>

                        <div className="mt-4">
                            <a
                                className="inline-flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors duration-300 font-sans"
                                href="https://www.instagram.com/dyuthi_dance_studio_/?hl=en"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg fill="currentColor" viewBox="0 0 448 512" height="1.2em" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
                                </svg>
                                <span className="text-[11px] uppercase tracking-[0.15em]">@dyuthi_dance_studio_</span>
                            </a>
                        </div>
                    </div>

                    {/* Locations Column */}
                    <div>
                        <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-6 font-sans">Our Locations</h3>
                        <div className="flex flex-col gap-8">
                            <div className="flex items-start gap-3">
                                <MapPin size={14} className="text-gray-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-300 font-sans">
                                        Kaloor Branch
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed font-sans">
                                        Mother Teresa Road, Shenoy Rd, Kaloor, Kochi, Kerala 682017
                                    </p>
                                    <a
                                        href="https://maps.app.goo.gl/HujfH7Exki6525qj7"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.15em] text-white hover:opacity-50 transition-opacity duration-300 mt-2 font-sans"
                                    >
                                        View on Google Maps
                                        <ExternalLink size={10} />
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={14} className="text-gray-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-300 font-sans">
                                        Kalamassery Branch
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed font-sans">
                                        3rd Floor, Maria Plaza, Rajagiri Rd, North Kalamassery, Kalamassery, Kochi, Kerala 683104
                                    </p>
                                    <a
                                        href="https://maps.app.goo.gl/7SNjXquse1rTLesu8"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.15em] text-white hover:opacity-50 transition-opacity duration-300 mt-2 font-sans"
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
                        <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-6 font-sans">Contact Us</h3>
                        <div className="flex flex-col gap-4">
                            <a
                                href="https://wa.me/917306122860"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors duration-300 font-sans"
                            >
                                <Phone size={14} className="text-green-500" />
                                +91 73061 22860 (WhatsApp)
                            </a>
                            <a
                                href="tel:+918921146960"
                                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors duration-300 font-sans"
                            >
                                <Phone size={14} className="text-gray-500" />
                                +91 89211 46960
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
                    <p className="text-center text-[11px] uppercase tracking-[0.15em] text-gray-600 font-sans">
                        © 2026 Dyuthi Dance Studio. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
