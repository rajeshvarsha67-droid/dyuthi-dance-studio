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
        objectPosition: "center 15%",
    },
];

export default function InstructorsSection() {
    return (
        <section id="instructors" className="bg-gray-50 py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-14">
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D32F2F] mb-4 block">
                        Our Team
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
                        Meet Our Instructors
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {instructors.map((inst) => (
                        <div key={inst.name} className="text-center group">
                            <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-lg ring-4 ring-white">
                                <Image
                                    src={inst.image}
                                    alt={inst.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    style={{ objectPosition: inst.objectPosition || "center" }}
                                />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">
                                {inst.name}
                            </h3>
                            <p className="text-sm font-medium text-[#D32F2F] mb-3">
                                {inst.title}
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                                {inst.bio}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
