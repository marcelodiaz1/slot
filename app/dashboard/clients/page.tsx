import { createClient } from "@/utils/supabase/server"
import { UserPlus } from "lucide-react"
import Link from "next/link"
import { ClientTable } from "@/components/ClientTable"

export default async function ProfessionalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // 1. Fetch current user profile to determine Role and Brand Color
  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('brand_color, role')
    .eq('id', user.id)
    .single()

  const brandColor = currentUserProfile?.brand_color || '#2563eb'
  const isAdmin = currentUserProfile?.role === 'admin'

  // 2. Prepare the Base Queries
  // We initialize the queries without filters first
  let profilesQuery = supabase
    .from('profiles')
    .select('id, username, first_name, last_name, phone, email, role, parent_id')
    .eq('role', 'client')

  let bookingsQuery = supabase
    .from('bookings')
    .select('guest_name, guest_email, guest_phone, doctor_id')
    .is('client_id', null)

  // 3. Apply Conditional Filtering
  // If the user is NOT an admin, we restrict results to their specific ID
  if (!isAdmin) {
    profilesQuery = profilesQuery.eq('parent_id', user.id)
    bookingsQuery = bookingsQuery.eq('doctor_id', user.id)
  }

  // 4. Execute Queries in Parallel for better performance
  const [profilesResponse, bookingsResponse] = await Promise.all([
    profilesQuery,
    bookingsQuery
  ]);

  const profilesData = profilesResponse.data || [];
  const guestBookings = bookingsResponse.data || [];

  // 5. Merge Strategy (Profiles + Guest Bookings)
  const clientMap = new Map();

  // Add Registered Clients
  profilesData.forEach((p) => {
    clientMap.set(p.id, {
      ...p,
      isGuest: false
    });
  });

  // Add Anonymous Guests from Bookings (if they don't already exist as a profile)
  guestBookings.forEach((b) => {
    // Using email as the unique key for guests
    if (b.guest_email && !clientMap.has(b.guest_email)) {
      clientMap.set(b.guest_email, {
        id: b.guest_email, // Temporary ID for table key
        first_name: b.guest_name?.split(' ')[0] || "Guest",
        last_name: b.guest_name?.split(' ').slice(1).join(' ') || "",
        email: b.guest_email,
        phone: b.guest_phone || "N/A",
        isGuest: true,
        username: null,
        parent_id: b.doctor_id // Shows who they booked with
      });
    }
  });

  const allClients = Array.from(clientMap.values())

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            {isAdmin ? "Global Client Directory" : "My Clients"}
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            {isAdmin 
              ? "All patients across the platform (registered and guests)." 
              : "All patients who have booked directly with you."}
          </p>
        </div>
        
        <Link 
          href="/dashboard/clients/new" 
          style={{ backgroundColor: brandColor }}
          className="flex items-center gap-2 text-white px-8 py-4 rounded-2xl font-bold hover:opacity-90 shadow-xl transition-all active:scale-95 text-sm"
        >
          <UserPlus size={18} />
          Add New Client
        </Link>
      </div>

      {/* 6. Render the Table with filtered data */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <ClientTable clients={allClients} brandColor={brandColor} />
      </div>

      {allClients.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] mt-4">
          <p className="text-slate-400 font-medium text-sm">No clients found.</p>
        </div>
      )}
    </div>
  )
}