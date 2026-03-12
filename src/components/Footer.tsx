"use client";

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
                            className="text-sm font-medium text-[#D32F2F] hover:text-red-400 transition-colors inline-block mb-6"
                        >
                            Our Story →
                        </a>

                        <div className="tooltip-container">
                            <div className="tooltip">
                                <div className="profile">
                                    <div className="user">
                                        <div className="img">Dy</div>
                                        <div className="details">
                                            <div className="name">Dyuthi Dance</div>
                                            <div className="username">@dyuthi_dance_studio_</div>
                                        </div>
                                    </div>
                                    <div className="about">Follow us on Instagram</div>
                                </div>
                            </div>
                            <div className="text text-left w-max">
                                <a
                                    className="icon"
                                    href="https://www.instagram.com/dyuthi_dance_studio_/?hl=en"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <div className="layer">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span className="instagramSVG">
                                            <svg fill="white" className="svgIcon" viewBox="0 0 448 512" height="1.5em" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="text inline-block ml-16 mt-4 text-sm text-slate-400 hover:text-white transition-colors">Instagram</div>
                                </a>
                            </div>
                        </div>
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

            <style jsx>{`
                .tooltip-container {
                    position: relative;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 17px;
                    border-radius: 10px;
                    width: max-content;
                }
                .tooltip {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 10px;
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.3s;
                    border-radius: 15px;
                    box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.2),
                        inset -5px -5px 15px rgba(255, 255, 255, 0.1),
                        5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.1);
                }
                .profile {
                    background: #2a2b2f;
                    border-radius: 10px 15px;
                    padding: 10px;
                    border: 1px solid rgba(11, 63, 95, 1);
                    min-width: 200px;
                }
                .user {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .img {
                    background: #e1306c;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: white;
                }
                .name {
                    font-weight: bold;
                    font-size: 14px;
                }
                .username {
                    font-size: 12px;
                    color: #999;
                }
                .about {
                    font-size: 12px;
                    color: #ccc;
                    margin-top: 10px;
                }
                .tooltip-container:hover .tooltip {
                    top: -120px;
                    opacity: 1;
                    visibility: visible;
                    pointer-events: auto;
                }
                .icon {
                    text-decoration: none;
                    color: #fff;
                    display: block;
                    position: relative;
                }
                .layer {
                    width: 45px;
                    height: 45px;
                    transition: transform 0.3s;
                    position: absolute;
                    top: -10px;
                    left: 0;
                }
                .icon:hover .layer {
                    transform: rotate(-35deg) skew(20deg);
                }
                .layer span {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    border: 1px solid #fff;
                    border-radius: 5px;
                    transition: all 0.3s;
                }
                .layer span.instagramSVG {
                    font-size: 24px;
                    line-height: 45px;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .icon:hover .layer span:nth-child(1) { opacity: 0.2; }
                .icon:hover .layer span:nth-child(2) { opacity: 0.4; transform: translate(5px, -5px); }
                .icon:hover .layer span:nth-child(3) { opacity: 0.6; transform: translate(10px, -10px); }
                .icon:hover .layer span:nth-child(4) { opacity: 0.8; transform: translate(15px, -15px); }
                .icon:hover .layer span:nth-child(5) { opacity: 1; transform: translate(20px, -20px); }
                .icon:hover .layer span {
                    box-shadow: -1px 1px 3px rgba(0,0,0,0.5);
                    background: #e1306c;
                }
            `}</style>
        </footer>
    );
}
