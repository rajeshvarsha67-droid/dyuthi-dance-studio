"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";
import { addReview, deleteReview, addGalleryImage, deleteGalleryImage } from "@/app/admin/cms/actions";
import { Loader2, Trash2, ImagePlus, MessageSquareQuote } from "lucide-react";

interface Review {
    id: string;
    student_name: string;
    review_text: string;
    rating: number;
    created_at: string;
}

interface GalleryImage {
    id: string;
    image_url: string;
    alt_text: string | null;
    display_order: number;
    created_at: string;
}

interface CMSManagerProps {
    initialReviews: Review[];
    initialGallery: GalleryImage[];
}

export default function CMSManager({ initialReviews, initialGallery }: CMSManagerProps) {
    const [activeTab, setActiveTab] = useState<"reviews" | "gallery">("reviews");
    const [isPending, startTransition] = useTransition();

    // Review Form State
    const [studentName, setStudentName] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState("5");

    // Gallery Upload State
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // --- REVIEWS HANDLERS ---
    const handleAddReview = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("student_name", studentName);
        formData.append("review_text", reviewText);
        formData.append("rating", rating);

        startTransition(async () => {
            try {
                await addReview(formData);
                setStudentName("");
                setReviewText("");
                setRating("5");
            } catch (error) {
                console.error("Failed to add review", error);
                alert("Failed to add review. Check console for details.");
            }
        });
    };

    const handleDeleteReview = (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        startTransition(async () => {
            try {
                await deleteReview(id);
            } catch (error) {
                console.error("Failed to delete review", error);
                alert("Failed to delete review.");
            }
        });
    };

    // --- GALLERY HANDLERS ---
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            setUploadError("Please select a valid image file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setUploadError("Image must be smaller than 5MB.");
            return;
        }

        setIsUploading(true);
        setUploadError("");

        try {
            // 1. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `gallery/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("public-assets")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from("public-assets")
                .getPublicUrl(filePath);

            // 3. Save to Database via Server Action
            startTransition(async () => {
                await addGalleryImage(publicUrl, file.name);
                setIsUploading(false);
                // Reset file input
                e.target.value = "";
            });
        } catch (error: any) {
            console.error("Upload process failed:", error);
            setUploadError(error.message || "Failed to upload image.");
            setIsUploading(false);
        }
    };

    const handleDeleteImage = (id: string, url: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return;
        startTransition(async () => {
            try {
                await deleteGalleryImage(id, url);
            } catch (error) {
                console.error("Failed to delete image", error);
                alert("Failed to delete image.");
            }
        });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
            
            {/* TABS */}
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => setActiveTab("reviews")}
                    className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                        activeTab === "reviews"
                            ? "border-b-2 border-charcoal text-charcoal bg-gray-50/50"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    <MessageSquareQuote className="w-4 h-4" />
                    Manage Reviews
                </button>
                <button
                    onClick={() => setActiveTab("gallery")}
                    className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                        activeTab === "gallery"
                            ? "border-b-2 border-charcoal text-charcoal bg-gray-50/50"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    <ImagePlus className="w-4 h-4" />
                    Manage Gallery
                </button>
            </div>

            <div className="p-6">
                
                {/* ========================================================= */}
                {/* REVIEWS SECTION                                           */}
                {/* ========================================================= */}
                {activeTab === "reviews" && (
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Add Review Form */}
                        <div className="w-full lg:w-1/3 bg-gray-50 rounded-xl p-5 border border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Add New Review</h3>
                            <form onSubmit={handleAddReview} className="space-y-4">
                                <div>
                                    <label htmlFor="student_name" className="block text-xs font-medium text-gray-700 mb-1">Student Name</label>
                                    <input 
                                        type="text" 
                                        id="student_name" 
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal transition-all"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="rating" className="block text-xs font-medium text-gray-700 mb-1">Rating</label>
                                    <select 
                                        id="rating" 
                                        value={rating}
                                        onChange={(e) => setRating(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal transition-all"
                                    >
                                        <option value="5">5 - Excellent</option>
                                        <option value="4">4 - Very Good</option>
                                        <option value="3">3 - Good</option>
                                        <option value="2">2 - Fair</option>
                                        <option value="1">1 - Poor</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="review_text" className="block text-xs font-medium text-gray-700 mb-1">Review Text</label>
                                    <textarea 
                                        id="review_text" 
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        required
                                        rows={4}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal transition-all resize-none"
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={isPending}
                                    className="w-full flex justify-center py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-charcoal hover:bg-charcoal/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-charcoal disabled:opacity-50 transition-colors"
                                >
                                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Review"}
                                </button>
                            </form>
                        </div>

                        {/* Current Reviews List */}
                        <div className="w-full lg:w-2/3">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center justify-between">
                                Active Reviews
                                <span className="bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs font-medium">
                                    {initialReviews.length}
                                </span>
                            </h3>

                            {initialReviews.length === 0 ? (
                                <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-400 text-sm">
                                    No reviews added yet.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {initialReviews.map((review) => (
                                        <div key={review.id} className="relative p-5 border border-gray-100 rounded-xl bg-white shadow-sm hover:border-gray-200 transition-colors group">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm">{review.student_name}</p>
                                                    <div className="flex text-yellow-400 text-xs mt-0.5">
                                                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteReview(review.id)}
                                                    disabled={isPending}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete Review"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-gray-600 text-sm italic leading-relaxed">"{review.review_text}"</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ========================================================= */}
                {/* GALLERY SECTION                                           */}
                {/* ========================================================= */}
                {activeTab === "gallery" && (
                    <div className="space-y-8">
                        
                        {/* Upload Strip */}
                        <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Upload New Image</h3>
                                <p className="text-xs text-gray-500 mt-1">JPEG, PNG, or WebP. Max 5MB.</p>
                                {uploadError && <p className="text-xs text-red-500 mt-2 font-medium">{uploadError}</p>}
                            </div>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={isUploading || isPending}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                                />
                                <div className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    isUploading || isPending 
                                    ? "bg-gray-200 text-gray-500" 
                                    : "bg-charcoal text-white hover:bg-charcoal/90 shadow-sm"
                                }`}>
                                    {(isUploading || isPending) ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <ImagePlus className="w-4 h-4" />
                                            Select Image
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Images Grid */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center justify-between">
                                Gallery Images
                                <span className="bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs font-medium">
                                    {initialGallery.length}
                                </span>
                            </h3>

                            {initialGallery.length === 0 ? (
                                <div className="text-center py-16 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-400 text-sm">
                                    No images in the gallery. Upload one above.
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {initialGallery.map((img) => (
                                        <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                            <Image
                                                src={img.image_url}
                                                alt={img.alt_text || "Gallery image"}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {/* Hover overlay with delete button */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={() => handleDeleteImage(img.id, img.image_url)}
                                                    disabled={isPending}
                                                    className="p-2 bg-white/20 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors disabled:opacity-50"
                                                    title="Delete Image"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
