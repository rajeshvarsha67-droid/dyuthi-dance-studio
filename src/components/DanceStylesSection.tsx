"use client";

import Image from "next/image";
const styles = [
    { title: "Western Dance", image: "/images/style-western.jpg" },
    { title: "Zumba Fitness", image: "/images/style-zumba.jpg" },
    { title: "Bollywood", image: "/images/style-bollywood.jpg" },
    { title: "Bharatanatyam", image: "/images/style-classical.jpg" },
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mt-16 perspective-[2000px]">
                    {styles.map((style, i) => (
                        <div key={style.title} className="container sk-flip-container relative w-full aspect-[4/3] cursor-pointer group">
                            <div className="card w-full h-full relative transition-transform duration-700 shadow-[0_15px_35px_rgba(0,0,0,0.5)] rounded-2xl sk-flip-card">
                                {/* FRONT */}
                                <div className="front absolute inset-0 w-full h-full skeuo-metal-plate p-3 flex flex-col justify-between overflow-hidden rounded-2xl sk-flip-front">
                                    <div className="relative w-full h-full skeuo-inset rounded-xl overflow-hidden border border-black/10">
                                        <Image
                                            src={style.image}
                                            alt={style.title}
                                            fill
                                            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                                            <p className="front-heading text-xl font-bold text-white shadow-black drop-shadow-md">
                                                {style.title}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Physical Screws representing heavy industry mounting */}
                                    <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-gradient-to-br from-gray-300 to-gray-600 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.5),1px_1px_2px_rgba(0,0,0,0.3)]"></div>
                                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br from-gray-300 to-gray-600 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.5),1px_1px_2px_rgba(0,0,0,0.3)]"></div>
                                </div>

                                {/* BACK */}
                                <div className="back absolute inset-0 w-full h-full skeuo-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center sk-flip-back">
                                    <div className="w-full h-full skeuo-inset rounded-xl p-6 flex flex-col justify-center items-center relative overflow-hidden">
                                        <p className="back-heading text-2xl font-extrabold text-[#D32F2F] tracking-tight mb-4 drop-shadow-sm">
                                            {style.title}
                                        </p>
                                        <p className="skeuo-text text-sm font-medium text-slate-700 leading-relaxed z-10">
                                            Experience the rhythm and joy of {style.title}. Join our professional instructors and find your passion.
                                        </p>
                                        <p className="mt-6 text-xs uppercase tracking-[0.2em] font-bold text-slate-500 hover:text-[#D32F2F] transition-colors">
                                            Book A Class
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .sk-flip-container {
                    perspective: 2000px;
                }
                .sk-flip-card {
                    transform-style: preserve-3d;
                }
                .sk-flip-container:hover .sk-flip-card {
                    transform: rotateY(180deg);
                    box-shadow: -15px 15px 30px rgba(0,0,0,0.3); /* Physical light shift */
                }
                .sk-flip-front,
                .sk-flip-back {
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                    transform-style: preserve-3d;
                }
                .sk-flip-back {
                    transform: rotateY(180deg);
                }
            `}</style>
        </section>
    );
}
