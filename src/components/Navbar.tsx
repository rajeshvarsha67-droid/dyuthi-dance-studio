"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Our Story", href: "#our-story" },
    { label: "Styles", href: "#styles" },
    { label: "Instructors", href: "#instructors" },
    { label: "Schedule", href: "#schedule" },
    { label: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
                {/* Logo */}
                <a href="#home" className="flex items-center gap-3">
                    <Image
                        src="/images/logo.png"
                        alt="Dyuthi Dance Studio"
                        width={72}
                        height={72}
                        className="object-contain"
                    />
                    <span className="text-xl font-bold text-slate-900 hidden sm:block">
                        Dyuthi
                    </span>
                </a>

                {/* Desktop Links */}
                <ul className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Desktop Buttons */}
                <div className="hidden lg:flex items-center gap-3">
                    <button className="px-5 py-2 text-sm font-medium text-slate-900 border border-slate-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Login
                    </button>
                    <button className="px-5 py-2 text-sm font-medium text-white bg-[#D32F2F] rounded-lg hover:bg-[#B71C1C] transition-colors">
                        Register
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden p-2 text-slate-700"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100 px-6 pb-6">
                    <ul className="flex flex-col gap-4 pt-4">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="text-sm font-medium text-slate-700 hover:text-slate-900"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-col gap-3 mt-6">
                        <button className="w-full px-5 py-2.5 text-sm font-medium text-slate-900 border border-slate-300 rounded-lg hover:bg-gray-50">
                            Login
                        </button>
                        <button className="w-full px-5 py-2.5 text-sm font-medium text-white bg-[#D32F2F] rounded-lg hover:bg-[#B71C1C]">
                            Register
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
