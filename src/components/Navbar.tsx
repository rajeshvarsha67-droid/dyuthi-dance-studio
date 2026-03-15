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
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200/60">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
                {/* Logo */}
                <Link href="/#home" className="flex items-center mr-8">
                    <Image
                        src="/images/new-logo-no-bg.png"
                        alt="Dyuthi Dance Studio"
                        width={240}
                        height={120}
                        className="object-contain max-h-[100px] w-auto"
                    />
                </Link>

                {/* Desktop Links */}
                <ul className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A] hover:opacity-50 transition-opacity duration-300"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Desktop Buttons */}
                <div className="hidden lg:flex items-center gap-4">
                    <Link
                        href="/#login"
                        className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A] hover:opacity-50 transition-opacity duration-300"
                    >
                        Login
                    </Link>
                    <Link
                        href="/#register"
                        className="px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#1A1A1A] border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all duration-300"
                    >
                        Register
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden p-2 text-[#1A1A1A]"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="lg:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200/60 px-6 pb-8">
                    <ul className="flex flex-col gap-5 pt-6">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A] hover:opacity-50 transition-opacity duration-300"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-col gap-4 mt-8">
                        <Link
                            href="/#login"
                            className="text-center text-[11px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A] py-2.5 hover:opacity-50 transition-opacity duration-300"
                            onClick={() => setMobileOpen(false)}
                        >
                            Login
                        </Link>
                        <Link
                            href="/#register"
                            className="text-center px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#1A1A1A] border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all duration-300"
                            onClick={() => setMobileOpen(false)}
                        >
                            Register
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
