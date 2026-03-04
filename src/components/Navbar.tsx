"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
    { label: "Home", href: "/#home" },
    { label: "Our Story", href: "/our-story" },
    { label: "Styles", href: "/#styles" },
    { label: "Instructors", href: "/#instructors" },
    { label: "Gallery", href: "/#gallery" },
    { label: "Schedule", href: "/#schedule" },
    { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-24">
                {/* Logo */}
                <Link href="/#home" className="flex items-center mr-8">
                    <Image
                        src="/images/new-logo-no-bg.png"
                        alt="Dyuthi Dance Studio"
                        width={240}
                        height={120}
                        className="object-contain max-h-[120px] w-auto"
                    />
                </Link>

                {/* Desktop Links */}
                <ul className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                            >
                                {link.label}
                            </Link>
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
                                <Link
                                    href={link.href}
                                    className="text-sm font-medium text-slate-700 hover:text-slate-900"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </Link>
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

