import Image from "next/image";

const instructors = [
    {
        name: "Dona Benny",
        title: "Founder & Artistic Director",
        bio: "M.A. in Bharatanatyam with over 10 years of experience. Dona's passion for dance and commitment to nurturing talent is the heart of Dyuthi.",
        image: "/images/instructor-dona.jpg",
        objectPosition: "center 20%",
    },
    {
        name: "Tony",
        title: "Co-Founder",
        bio: "With 12+ years of experience spanning Bollywood, Western, and Zumba, Tony brings infectious energy and precision to every class.",
        image: "/images/instructor-tony.jpg",
        objectPosition: "center",
    },
    {
        name: "Swaliha",
        title: "Choreographer",
        bio: "A dynamic talent with 3+ years of experience specializing in Western and Freestyle dance. Swaliha's creativity shines in every routine.",
        image: "/images/instructor-swaliha.jpg",
        objectPosition: "center 30%",
        scale: "1.3",
    },
];

export default function InstructorsSection() {
    return (
        <section id="instructors" className="bg-white py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-20">
                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400 mb-4 block font-sans">
                        Our Team
                    </span>
                    <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#1A1A1A]">
                        Meet Our Instructors
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {instructors.map((inst) => (
                        <div key={inst.name} className="text-center group">
                            <div className="relative w-44 h-44 mx-auto mb-8 rounded-full overflow-hidden">
                                <Image
                                    src={inst.image}
                                    alt={inst.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    style={{
                                        objectPosition: inst.objectPosition || "center",
                                        ...(inst.scale ? { transform: `scale(${inst.scale})` } : {}),
                                    }}
                                />
                            </div>
                            <h3 className="font-serif text-2xl font-semibold text-[#1A1A1A] mb-1">
                                {inst.name}
                            </h3>
                            <p className="text-[11px] uppercase tracking-[0.15em] font-medium text-gray-400 mb-4 font-sans">
                                {inst.title}
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto font-sans">
                                {inst.bio}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
