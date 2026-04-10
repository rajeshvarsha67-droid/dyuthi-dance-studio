"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function addReview(formData: FormData) {
    const student_name = formData.get("student_name") as string;
    const review_text = formData.get("review_text") as string;
    const rating = parseInt(formData.get("rating") as string, 10);

    if (!student_name || !review_text || !rating || rating < 1 || rating > 5) {
        throw new Error("Invalid review data");
    }

    const supabase = await createSupabaseServerClient();
    
    // Check if admin is authenticated (RLS will also catch this)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase.from("reviews").insert({
        student_name,
        review_text,
        rating,
    });

    if (error) {
        console.error("Error adding review:", error);
        throw new Error("Failed to add review");
    }

    revalidatePath("/admin/cms");
}

export async function deleteReview(id: string) {
    const supabase = await createSupabaseServerClient();
    
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    
    if (error) {
        console.error("Error deleting review:", error);
        throw new Error("Failed to delete review");
    }

    revalidatePath("/admin/cms");
}

export async function addGalleryImage(imageUrl: string, altText: string) {
    if (!imageUrl) throw new Error("Image URL is required");

    const supabase = await createSupabaseServerClient();
    
    const { error } = await supabase.from("gallery_images").insert({
        image_url: imageUrl,
        alt_text: altText,
    });

    if (error) {
        console.error("Error adding gallery image:", error);
        throw new Error("Failed to add gallery image");
    }

    revalidatePath("/admin/cms");
}

export async function deleteGalleryImage(id: string, imageUrl: string) {
    const supabase = await createSupabaseServerClient();
    
    // 1. Delete from database
    const { error: dbError } = await supabase.from("gallery_images").delete().eq("id", id);
    if (dbError) {
        console.error("Error deleting gallery image record:", dbError);
        throw new Error("Failed to delete gallery image record");
    }

    // 2. Extract relative path for Storage deletion
    // e.g. "https://xxx.supabase.co/storage/v1/object/public/public-assets/gallery/123-abc.jpg"
    // -> "gallery/123-abc.jpg"
    try {
        const urlObj = new URL(imageUrl);
        const pathParts = urlObj.pathname.split("/public-assets/");
        if (pathParts.length > 1) {
            const storagePath = pathParts[1];
            const { error: storageError } = await supabase.storage
                .from("public-assets")
                .remove([storagePath]);
                
            if (storageError) {
                console.error("Failed to delete from storage:", storageError);
                // We don't throw an error here to prevent blocking the UI, 
                // as the DB record is already gone.
            }
        }
    } catch (e) {
        console.error("Could not parse image URL for storage deletion:", e);
    }

    revalidatePath("/admin/cms");
}
