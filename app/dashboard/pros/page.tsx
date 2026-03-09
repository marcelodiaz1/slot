import { createClient } from "@/lib/supabase/server";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ProsTableClient } from "components/ProsTableClient";

// Table Skeleton for Suspense
function TableSkeleton() {
  return <div className="w-full h-96 bg-slate-50 animate-pulse rounded-[2.5rem] border border-slate-100" />;
}

// Data Fetching Logic
async function ProsDataLayer() {
  const supabase = await createClient();
  const { data: professionals } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'pro')
    .order('username', { ascending: true });

  return <ProsTableClient professionals={professionals || []} />;
}

export default function ProfessionalsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Professionals</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your team and their public booking profiles.</p>
        </div>

        <Link 
          href="/dashboard/pros/new" 
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 text-sm"
        >
          <UserPlus size={18} />
          Add New Professional
        </Link>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <ProsDataLayer />
      </Suspense>
    </div>
  );
}