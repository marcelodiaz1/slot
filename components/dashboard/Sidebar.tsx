"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calendar, Layers, Settings, Clock, Users, 
  LogOut, User as UserIcon, ShieldCheck, 
  User
} from 'lucide-react';
import { signOut } from '@/app/dashboard/actions';

export default function Sidebar({ profile, email }: { profile: any, email: string }) {
  const pathname = usePathname();
  
  // Define the brand color with a fallback
  const brandColor = profile?.brand_color || '#2563eb';

  return (
    <aside className="w-64 bg-white border-r flex flex-col sticky top-0 h-screen">
      
      {/* 3. User Profile Section */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 mt-auto">
        <div className="flex items-center gap-3 px-2 py-3 mb-2">
          {/* Avatar / Logo Container */}
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden border"
            style={{ 
              backgroundColor: brandColor,
              borderColor: `${brandColor}33`,
              boxShadow: `0 4px 12px ${brandColor}33`
            }}
          >
            {profile.logo_url ? (
              <img 
                src={profile.logo_url} 
                alt="Brand Logo" 
                className="w-full h-full object-cover"
              />
            ) : (
              // Fallback to Initials
              <span className="text-sm">
                {profile.username?.[0].toUpperCase() || email[0].toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">
              {profile.first_name || "User"}
            </p>
            <p className="text-[11px] text-slate-500 truncate lowercase font-medium">
              {email}
            </p>
          </div>
        </div>

        {/* Role Badge */}
        <div className="flex items-center gap-1.5 px-2">
            <span 
              className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border"
              style={{ 
                color: brandColor, 
                borderColor: `${brandColor}33`, 
                backgroundColor: `${brandColor}15` // Very light tint
              }}
            >
           Powered by Slot<span style={{ color: brandColor }}>.</span> 
            </span>
        </div>
      </div>  
      
      {/* 2. Navigation Section */}
      <nav className="flex-1 px-4 space-y-1">
        <DashboardLink 
          href="/dashboard" 
          icon={<Calendar size={18} />} 
          label="Bookings" 
          active={pathname === "/dashboard"} 
          brandColor={brandColor}
        />

        {profile.role === 'pro' || profile.role === 'teammember' && (
          <DashboardLink 
            href="/dashboard/availability" 
            icon={<Clock size={18} />} 
            label="Availability" 
            active={pathname === "/dashboard/availability"} 
            brandColor={brandColor}
          />
        )}

        {(profile.role === 'pro' || profile.role === 'admin') && (
          <>
            <DashboardLink 
              href="/dashboard/clients" 
              icon={<Users size={18} />} 
              label="Clients" 
              active={pathname === "/dashboard/clients"} 
              brandColor={brandColor}
            />
            <DashboardLink 
              href="/dashboard/team" 
              icon={<User size={18} />} 
              label="Team" 
              active={pathname === "/dashboard/team"} 
              brandColor={brandColor}
            />
          </>
        )}

        {profile.role === 'admin' && (
          <>
            <DashboardLink 
              href="/dashboard/events" 
              icon={<Layers size={18} />} 
              label="Event Types" 
              active={pathname === "/dashboard/events"} 
              brandColor={brandColor}
            />
            <DashboardLink 
              href="/dashboard/pros" 
              icon={<User size={18} />} 
              label="Professionals" 
              active={pathname?.startsWith("/dashboard/pros")} 
              brandColor={brandColor}
            />
          </>
        )}
        
        <hr className="my-4 border-slate-100 mx-2" />
        
        <DashboardLink 
          href="/dashboard/settings" 
          icon={<Settings size={18} />} 
          label="Settings" 
          active={pathname === "/dashboard/settings"} 
          brandColor={brandColor}
        />

        <button 
          onClick={() => signOut()} 
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
        >
          <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          Sign Out
        </button>
      </nav>

    </aside>
  );
}

function DashboardLink({ href, icon, label, active, brandColor }: { href: string, icon: any, label: string, active: boolean, brandColor: string }) {
  return (
    <Link 
      href={href} 
      style={active ? { backgroundColor: brandColor } : {}}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${
        active 
          ? "text-white shadow-lg" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className={active ? "text-white" : "text-slate-400"}>
        {icon}
      </span>
      {label}
    </Link>
  );
}