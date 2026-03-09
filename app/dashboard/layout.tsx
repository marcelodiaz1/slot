import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  
  // Get Auth user for the email
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Get Profile for role and username
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile?.is_blocked) redirect('/blocked');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        profile={profile || { role: 'client' }} 
        email={user.email || ''} 
      />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}