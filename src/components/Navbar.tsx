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
                <ul className="hidden md:flex items-center gap-8">
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
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/#login"
                        onClick={() => window.dispatchEvent(new CustomEvent('switchAuthMode', { detail: 'login' }))}
                        className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A] hover:opacity-50 transition-opacity duration-300"
                    >
                        Login
                    </Link>
                    <Link
                        href="/#register"
                        onClick={() => window.dispatchEvent(new CustomEvent('switchAuthMode', { detail: 'signup' }))}
                        className="px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#1A1A1A] border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all duration-300"
                    >
                        Register
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-[#1A1A1A] p-2 focus:outline-none z-50"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div 
                className={`fixed inset-0 bg-white z-[100] transform transition-transform duration-500 ease-in-out flex flex-col items-center justify-center ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <button 
                    className="absolute top-8 right-8 text-[#1A1A1A] p-2 focus:outline-none"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <nav className="flex flex-col space-y-8 text-center font-sans uppercase tracking-[0.2em] text-sm text-gray-500">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="hover:text-[#1A1A1A] transition-colors"
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-12 flex flex-col items-center space-y-6 w-full px-12 text-sm uppercase tracking-[0.2em] font-semibold">
                    <Link
                        href="/#login"
                        className="text-gray-500 hover:text-[#1A1A1A] transition-colors"
                        onClick={() => {
                            setMobileOpen(false);
                            window.dispatchEvent(new CustomEvent('switchAuthMode', { detail: 'login' }));
                        }}
                    >
                        Login
                    </Link>
                    <Link
                        href="/#register"
                        className="w-full py-4 text-center border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all duration-300"
                        onClick={() => {
                            setMobileOpen(false);
                            window.dispatchEvent(new CustomEvent('switchAuthMode', { detail: 'signup' }));
                        }}
                    >
                        Register
                    </Link>
                </div>
            </div>
        </nav>
    );
}
