export default function LocationsSection() {
    return (
        <section id="locations" className="bg-gray-50 py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-14">
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D32F2F] mb-4 block">
                        Find Us
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                        Our Locations
                    </h2>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        Visit us at either of our two branches in Kochi. We&apos;d love to welcome you!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Kaloor Branch */}
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                        <div className="aspect-[4/3] w-full">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0!2d76.2977!3d9.9937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d1c5e0a3b1d%3A0x7b6c5e3a2f8d4e1c!2sDyuthi%20Dance%20Studio%20-%20Kaloor!5e0!3m2!1sen!2sin!4v1709000000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Dyuthi Dance Studio - Kaloor Branch"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Kaloor Branch</h3>
                            <p className="text-sm text-slate-500 mb-3">
                                Mother Teresa Road, Shenoy Rd, Kaloor, Kochi, Kerala 682017
                            </p>
                            <a
                                href="https://maps.app.goo.gl/HujfH7Exki6525qj7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#D32F2F] hover:text-[#B71C1C] transition-colors"
                            >
                                Get Directions →
                            </a>
                        </div>
                    </div>

                    {/* Kalamassery Branch */}
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                        <div className="aspect-[4/3] w-full">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.5!2d76.3177!3d10.0537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080e8f5b4a9c3d%3A0x4c2d1e6a8f9b5e7a!2sDyuthi%20Dance%20Studio%20-%20Kalamassery!5e0!3m2!1sen!2sin!4v1709000000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Dyuthi Dance Studio - Kalamassery Branch"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Kalamassery Branch</h3>
                            <p className="text-sm text-slate-500 mb-3">
                                3rd Floor, Maria Plaza, Rajagiri Rd, North Kalamassery, Kochi, Kerala 683104
                            </p>
                            <a
                                href="https://maps.app.goo.gl/7SNjXquse1rTLesu8"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#D32F2F] hover:text-[#B71C1C] transition-colors"
                            >
                                Get Directions →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
