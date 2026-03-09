import ClientsActions from "@/components/clients/ClientsActions"; 
import { createClient } from "@/utils/supabase/server";
import { UserPlus, Users, Shield } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

// --- STAFF TABLE COMPONENT ---
async function StaffTable({ 
  brandColor, 
  proId, 
  isAdmin 
}: { 
  brandColor: string, 
  proId: string, 
  isAdmin: boolean 
}) {
  const supabase = await createClient();
  
  // 1. Build Query
  // We join 'parent_id' to the profiles table to get the Manager's name for each row
  let query = supabase
    .from('profiles')
    .select(`
      *,
      manager:parent_id (
        first_name,
        last_name
      )
    `)
    .eq('role', 'teammember');

  // 2. Apply Security Filter: Admins see all, Pros see only their staff
  if (!isAdmin) {
    query = query.eq('parent_id', proId);
  }

  const { data: staffMembers, error } = await query.order('username', { ascending: true });

  if (error) {
    console.error("Error fetching staff:", error);
    return <div className="p-8 text-red-500">Error loading team data.</div>;
  }

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-visible">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Staff Member</th>
            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Full Name</th>
            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Manager / PRO</th>
            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {staffMembers?.map((staff) => (
            <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors group">
              {/* Profile / Username Column */}
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-slate-200"
                    style={{ backgroundColor: brandColor }}
                  >
                    {staff.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">@{staff.username}</div>
                    <div 
                      className="text-[10px] font-black uppercase tracking-wider"
                      style={{ color: brandColor }}
                    >
                      Team Staff
                    </div>
                  </div>
                </div>
              </td>

              {/* Contact Info Column */}
              <td className="px-8 py-6">
                <p className="text-sm font-semibold text-slate-700 capitalize">
                  {staff.first_name} {staff.last_name}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {staff.phone || "No phone provided"}
                </p>
              </td>

              {/* Manager Column - This now shows the actual manager for each row */}
              <td className="px-8 py-6">
                <p className="text-sm font-semibold text-slate-700 capitalize">
                  {staff.manager 
                    ? `${staff.manager.first_name} ${staff.manager.last_name}` 
                    : "Direct Admin"}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Team Lead</p>
              </td>

              {/* Actions Column */}
              <td className="px-8 py-6 text-right">
                <div className="flex items-center justify-end gap-2">
                  <ClientsActions client={staff} /> 
                </div>
              </td>
            </tr>
          ))}

          {/* Empty State */}
          {(!staffMembers || staffMembers.length === 0) && (
            <tr>
              <td colSpan={4} className="px-8 py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <Users className="w-10 h-10 text-slate-200" />
                  <p className="text-slate-400 font-medium">No team members registered yet.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// --- SKELETON LOADER ---
function TableSkeleton() {
  return <div className="w-full h-96 bg-slate-50 animate-pulse rounded-[2.5rem] border border-slate-100" />;
}

// --- MAIN PAGE COMPONENT ---
export default async function StaffPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, brand_color')
    .eq('id', user.id)
    .single();

  const brandColor = profile?.brand_color || '#2563eb';
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">My Team</h1>
            {isAdmin && (
              <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase px-2 py-1 rounded-md flex items-center gap-1">
                <Shield size={10} /> Admin View
              </span>
            )}
          </div>
          <p className="text-slate-500 font-medium">
            {isAdmin 
              ? "Global overview of all staff members in the database." 
              : "Manage your staff accounts and access levels."}
          </p>
        </div>

        <Link 
          href="/dashboard/pros/new" 
          style={{ backgroundColor: brandColor }}
          className="flex items-center gap-2 text-white px-8 py-4 rounded-2xl font-bold hover:opacity-90 shadow-xl transition-all active:scale-95 text-sm"
        >
          <UserPlus size={18} />
          Add Team Member
        </Link>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <StaffTable 
          brandColor={brandColor} 
          proId={profile?.id || ""} 
          isAdmin={isAdmin} 
        />
      </Suspense>
    </div>
  );
}