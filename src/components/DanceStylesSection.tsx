import Image from "next/image";

const styles = [
    { title: "Western Dance", image: "https://images.unsplash.com/photo-1605369062325-24231b409cb3?auto=format&fit=crop&w=800&q=80" },
    { title: "Zumba Fitness", image: "https://images.unsplash.com/photo-1582914856411-d14fb619277d?auto=format&fit=crop&w=800&q=80" },
    { title: "Bollywood", image: "https://images.unsplash.com/photo-1535597401618-91c62ee27f37?auto=format&fit=crop&w=800&q=80" },
    { title: "Bharatanatyam", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80", subtitle: "Led by Dona Benny" },
];

export default function DanceStylesSection() {
    return (
        <section id="styles" className="bg-white py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-12">
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D32F2F] mb-4 block">
                        What We Teach
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
                        Our Dance Styles
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {styles.map((style) => (
                        <div
                            key={style.title}
                            className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer shadow-md"
                        >
                            <Image
                                src={style.image}
                                alt={style.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-6">
                                <h3 className="text-xl font-bold text-white mb-1">
                                    {style.title}
                                </h3>
                                {style.subtitle && (
                                    <p className="text-sm text-white/70">{style.subtitle}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
