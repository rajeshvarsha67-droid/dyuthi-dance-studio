import Image from "next/image";

export default function HeroSection() {
    return (
        <section
            id="home"
            className="min-h-screen flex flex-col lg:flex-row"
        >
            {/* Left Side — Typography */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-20 py-20 lg:py-0">
                <h1 className="font-serif text-5xl lg:text-[5.5rem] leading-[1.1] font-bold text-[#1A1A1A] mb-8">
                    Welcome to Dyuthi Dance Studio
                </h1>
                <p className="text-base lg:text-lg text-gray-500 mb-12 max-w-md leading-relaxed font-sans">
                    Traverse into the boundless world of dance.
                </p>

                <div>
                    <a
                        href="#register"
                        className="inline-block px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-semibold text-white bg-[#1A1A1A] hover:bg-[#333] transition-colors duration-300"
                    >
                        Join a Batch
                    </a>
                </div>
            </div>

            {/* Right Side — Placeholder for 3D element */}
            <div className="w-full lg:w-1/2 h-[50vh] lg:h-auto min-h-[400px] bg-[#F9F8F6] flex justify-center items-center relative overflow-hidden">
                <Image
                    src="/images/hero-bg.jpg"
                    alt="Dyuthi Dance Studio"
                    fill
                    className="object-cover object-[center_15%] opacity-90"
                    priority
                />
            </div>
        </section>
    );
}
