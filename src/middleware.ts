import { NextRequest, NextResponse } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase-middleware";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow the login page to be accessed without auth
    if (pathname === "/admin/login") {
        return NextResponse.next();
    }

    // Create a response we can modify (to set cookies)
    const response = NextResponse.next({ request });

    const supabase = createSupabaseMiddlewareClient(request, response);

    // Refresh the session — this also sets updated cookies on the response
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // No authenticated user → redirect to login
    if (!user) {
        const loginUrl = new URL("/admin/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Check if the authenticated user is in the admin_users table
    const { data: adminUser } = await supabase
        .from("admin_users")
        .select("id")
        .ilike("email", user.email || "")
        .maybeSingle();

    if (!adminUser) {
        // Authenticated but not an admin → redirect with error
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("error", "unauthorized");
        // Sign them out first so the session doesn't persist
        await supabase.auth.signOut();
        return NextResponse.redirect(loginUrl);
    }

    return response;
}

export const config = {
    matcher: ["/admin/:path*"],
};
