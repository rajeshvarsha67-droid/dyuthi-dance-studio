import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Dyuthi Dance Studio — Kochi, Kerala",
    description:
        "Traverse into the boundless world of dance. Western, Zumba, Bollywood & Bharatanatyam classes for all ages in Kaloor and Kalamassery.",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={montserrat.variable}>
            <body className="font-sans bg-white text-slate-900 antialiased">
                {children}
            </body>
        </html>
    );
}
