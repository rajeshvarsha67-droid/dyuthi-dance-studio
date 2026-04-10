import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import OurStorySection from "@/components/OurStorySection";
import DanceStylesSection from "@/components/DanceStylesSection";
import InstructorsSection from "@/components/InstructorsSection";
import ReviewsSection from "@/components/ReviewsSection";
import ClassTimingsSection from "@/components/ClassTimingsSection";
import RegistrationForm from "@/components/RegistrationForm";
import GallerySection from "@/components/GallerySection";
import LocationsSection from "@/components/LocationsSection";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Next.js static caching settings - this page can be Revalidated when CMS is updated
export const revalidate = 60; // Revalidate at most every 60 seconds

export default async function Home() {
    let gallery_images: any[] = [];
    let reviews: any[] = [];
    let batches: any[] = [];
    let allBatches: any[] = [];

    if (supabase) {
        // Fetch Gallery Images
        const { data: gData } = await supabase
            .from("gallery_images")
            .select("*")
            .order("display_order", { ascending: true })
            .order("created_at", { ascending: false });
        gallery_images = gData || [];

        // Fetch Reviews
        const { data: rData } = await supabase
            .from("reviews")
            .select("*")
            .order("created_at", { ascending: false });
        reviews = rData || [];
    }

    // Fetch Batches for Class Timings (uses admin client to bypass RLS)
    const { data: bData } = await supabaseAdmin
        .from("batches")
        .select("id, branch, dance_style, days, timing")
        .neq("branch", "BPCL township")
        .order("branch", { ascending: true })
        .order("dance_style", { ascending: true });
    batches = bData || [];

    // Fetch ALL batches for the Registration Form dropdowns (no branch filter)
    const { data: allBData } = await supabaseAdmin
        .from("batches")
        .select("id, branch, dance_style")
        .order("branch", { ascending: true })
        .order("dance_style", { ascending: true });
    allBatches = allBData || [];

    return (
        <>
            <Navbar />
            <main>
                <HeroSection />
                <OurStorySection />
                <DanceStylesSection />
                <InstructorsSection />
                <ReviewsSection reviews={reviews} />
                <GallerySection images={gallery_images} />
                <ClassTimingsSection batches={batches} />
                <RegistrationForm batches={allBatches} />
                <LocationsSection />
            </main>
            <Footer />
            <WhatsAppFAB />
        </>
    );
}
