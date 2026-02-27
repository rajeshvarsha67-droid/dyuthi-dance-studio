import Image from "next/image";

export default function HeroSection() {
    return (
        <section id="home" className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <Image
                src="https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1920&q=80"
                alt="Dyuthi Dance Studio"
                fill
                className="object-cover"
                priority
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                    Welcome to Dyuthi Dance Studio
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed">
                    Traverse into the boundless world of dance.
                </p>
                <a
                    href="#register"
                    className="inline-block px-8 py-3.5 text-base font-semibold text-white bg-[#D32F2F] rounded-lg hover:bg-[#B71C1C] transition-colors shadow-lg hover:shadow-xl"
                >
                    Join a Batch
                </a>
            </div>
        </section>
    );
}
