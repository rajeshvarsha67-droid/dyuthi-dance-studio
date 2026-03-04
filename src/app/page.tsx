import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import OurStorySection from "@/components/OurStorySection";
import DanceStylesSection from "@/components/DanceStylesSection";
import InstructorsSection from "@/components/InstructorsSection";
import ReviewsSection from "@/components/ReviewsSection";
import ClassTimingsSection from "@/components/ClassTimingsSection";
import RegistrationForm from "@/components/RegistrationForm";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

export default function Home() {
    return (
        <>
            <Navbar />
            <main>
                <HeroSection />
                <OurStorySection />
                <DanceStylesSection />
                <InstructorsSection />
                <ReviewsSection />
                <GallerySection />
                <ClassTimingsSection />
                <RegistrationForm />
            </main>
            <Footer />
            <WhatsAppFAB />
        </>
    );
}
