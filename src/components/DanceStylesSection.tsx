import Image from "next/image";

const styles = [
    { title: "Western Dance", image: "/images/style-western.jpg" },
    { title: "Zumba Fitness", image: "/images/style-zumba.jpg" },
    { title: "Bollywood", image: "/images/style-bollywood.jpg" },
    { title: "Bharatanatyam", image: "/images/style-classical.jpg" },
];

export default function DanceStylesSection() {
    return (
        <section id="styles" className="bg-white py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-20">
                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400 mb-4 block font-sans">
                        What We Teach
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#1A1A1A]">
                        Our Dance Styles
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                    {styles.map((style) => (
                        <div key={style.title} className="group cursor-pointer">
                            <div className="relative w-full aspect-[4/5] overflow-hidden mb-5">
                                <Image
                                    src={style.image}
                                    alt={style.title}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                                />
                            </div>
                            <h3 className="font-serif text-xl font-semibold text-[#1A1A1A] text-center">
                                {style.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
