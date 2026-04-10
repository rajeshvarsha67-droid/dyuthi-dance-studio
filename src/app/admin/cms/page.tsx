import { createSupabaseServerClient } from "@/lib/supabase-server";
import CMSManager from "@/components/admin/CMSManager";

export default async function CMSPage() {
    const supabase = await createSupabaseServerClient();

    // Fetch Reviews
    const { data: reviews } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

    // Fetch Gallery Images
    const { data: images } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 font-serif">
                    Content Management
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage your homepage Gallery images and Student Reviews.
                </p>
            </div>

            <CMSManager 
                initialReviews={reviews || []} 
                initialGallery={images || []} 
            />
        </div>
    );
}
