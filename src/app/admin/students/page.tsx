import { createSupabaseServerClient } from "@/lib/supabase-server";
import StudentTable from "@/components/admin/StudentTable";

export default async function StudentsPage() {
    const supabase = await createSupabaseServerClient();

    const { data: students } = await supabase
        .from("registrations")
        .select("id, name, age, phone, email, Location, preferred_batch, created_at, status")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 font-serif">
                    Students
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage all registered students across your branches.
                </p>
            </div>

            <StudentTable students={students || []} />
        </div>
    );
}
