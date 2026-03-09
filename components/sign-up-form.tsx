"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User, Briefcase, Loader2, ShieldAlert, UserPlus, ShieldCheck, Users, ChevronDown } from "lucide-react";
import Link from "next/link";
import { adminCreateUser } from "@/app/actions/admin-actions";

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  
  // Logic States
  const [role, setRole] = useState<'pro' | 'client' | 'teammember'>('pro');
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const [professionals, setProfessionals] = useState<any[]>([]); 
  const [selectedProId, setSelectedProId] = useState<string>(""); 
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const router = useRouter();
  const supabase = createClient();

  const brandColor = currentUserProfile?.brand_color || '#2563eb';

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, role, brand_color')
          .eq('id', user.id)
          .single();
        
        setCurrentUserProfile(profile);
        if (profile?.role === 'pro') {
          setRole('teammember');
          setSelectedProId(profile.id);
        }
      }

      const { data: pros } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, username')
        .eq('role', 'pro')
        .order('last_name', { ascending: true });
      
      setProfessionals(pros || []);
      setIsCheckingAuth(false);
    }
    init();
  }, []);

 const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (role === 'teammember' && !selectedProId) {
      setError("Please select the Professional you are joining.");
      setIsLoading(false);
      return;
    }

    try {
      const base = `${firstName}.${lastName}`.toLowerCase().replace(/[^a-z0-9]/g, '');
      const uniqueUsername = `${base}${Math.floor(Math.random() * 1000)}`;
      const creatorId = currentUserProfile?.id || selectedProId;

      const result = await adminCreateUser({
        email,
        password,
        firstName,
        lastName,
        phone,
        role,
        username: uniqueUsername,
        brandColor: brandColor,
      }, creatorId);

      if (result?.error) {
        throw new Error(result.error);
      }

      // Success! 
      setIsLoading(false);
// 1. Get the current user's role safely
      const viewerRole = currentUserProfile?.role;

      // 2. Handle the redirect based on WHO is performing the action and for WHOM
      if (!viewerRole) {
        // SCENARIO: Anonymous user registering themselves
        window.location.href = "/dashboard";
      } 

      else if (viewerRole === 'admin' && role === 'teammember') {
        window.location.href = "/dashboard/team";
      }
      else if (viewerRole === 'admin' && role === 'pro') {
        window.location.href = "/dashboard/pros";
      }
      else if (viewerRole === 'admin' && role === 'client') {
        window.location.href = "/dashboard/clients";
      }


      else if (viewerRole === 'pro' && role === 'client') {
        window.location.href = "/dashboard/clients";
      }
      else if (viewerRole === 'pro' && role === 'teammember') {
        window.location.href = "/dashboard/team";
      }
      
      else if (viewerRole === 'teammember' && role === 'client') {
        window.location.href = "/dashboard/clients";
      }


      else {
        // Fallback if no specific rule matches
        window.location.href = "/dashboard";
      }
       
      
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "An unexpected error occurred");
      setIsLoading(false); 
    }
  };
  if (!isCheckingAuth && currentUserProfile?.role === 'client') {
    return (
      <Card className="border-red-100 bg-red-50/50 rounded-[3rem] p-12 text-center shadow-xl">
        <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
           <ShieldAlert className="text-red-500" size={40} />
        </div>
        <CardTitle className="text-2xl font-black text-red-900">Access Denied</CardTitle>
        <p className="text-red-600 mt-2 font-medium">Clients cannot register new team members.</p>
        <Button className="mt-8 bg-red-500 hover:bg-red-600 rounded-2xl px-8" onClick={() => router.back()}>Return to Safety</Button>
      </Card>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex items-center gap-5 mb-4">
        <div 
          className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl rotate-3"
          style={{ backgroundColor: brandColor }}
        >
           <UserPlus size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            {role === 'teammember' ? 'Join a Team' : 'Get Started'}
          </h1>
          <p className="text-slate-500 font-medium">Account Registration</p>
        </div>
      </div> 

      <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-slate-100 rounded-[3rem] overflow-hidden">
        <CardContent className="pt-8">
          <form onSubmit={handleSignUp} className="space-y-8">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(currentUserProfile?.role === 'admin' || !currentUserProfile) && (
                <button
                  type="button"
                  onClick={() => setRole('pro')}
                  className={cn(
                    "p-4 border-2 rounded-[1.5rem] text-left transition-all flex flex-col gap-2 group",
                    role === 'pro' ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900 ring-offset-2" : "border-slate-100 grayscale hover:grayscale-0"
                  )}
                >
                  <Briefcase size={20} className={role === 'pro' ? "text-slate-900" : "text-slate-400"} />
                  <p className="font-bold text-xs uppercase tracking-widest">Professional</p>
                </button>
              )}
              
              <button
                type="button"
                onClick={() => setRole('teammember')}
                className={cn(
                  "p-4 border-2 rounded-[1.5rem] text-left transition-all flex flex-col gap-2",
                  role === 'teammember' ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900 ring-offset-2" : "border-slate-100 grayscale hover:grayscale-0"
                )}
              >
                <Users size={20} className={role === 'teammember' ? "text-slate-900" : "text-slate-400"} />
                <p className="font-bold text-xs uppercase tracking-widest">Team Staff</p>
              </button>

              <button
                type="button"
                onClick={() => setRole('client')}
                className={cn(
                  "p-4 border-2 rounded-[1.5rem] text-left transition-all flex flex-col gap-2",
                  role === 'client' ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900 ring-offset-2" : "border-slate-100 grayscale hover:grayscale-0"
                )}
              >
                <User size={20} className={role === 'client' ? "text-slate-900" : "text-slate-400"} />
                <p className="font-bold text-xs uppercase tracking-widest">Client</p>
              </button>
            </div>

            {role == 'teammember' && (!currentUserProfile || currentUserProfile?.role == 'admin') && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Select your Professional / Manager</Label>
                <div className="relative">
                  <select 
                    required
                    value={selectedProId}
                    onChange={(e) => setSelectedProId(e.target.value)}
                    className="w-full h-14 pl-5 pr-10 rounded-2xl bg-slate-50 border-none appearance-none font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer"
                  >
                    <option value="" disabled>Choose a professional...</option>
                    {professionals.map((pro) => (
                      <option key={pro.id} value={pro.id}>
                        {pro.first_name} {pro.last_name} (@{pro.username})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-2">
                <ShieldAlert size={16} /> {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">First Name</Label>
                  <Input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="rounded-2xl h-14 bg-slate-50 border-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Last Name</Label>
                  <Input required value={lastName} onChange={(e) => setLastName(e.target.value)} className="rounded-2xl h-14 bg-slate-50 border-none" />
                </div>
              </div> 
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Address</Label>
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-2xl h-14 bg-slate-50 border-none" />
              </div>
              <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Phone Number</Label>
                  <Input type="tel" placeholder="+1 (555) 000-0000" required value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-2xl h-14 bg-slate-50 border-none" />
                </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Password</Label>
                  <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-2xl h-14 bg-slate-50 border-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Repeat Password</Label>
                  <Input type="password" required value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} className="rounded-2xl h-14 bg-slate-50 border-none" />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              style={{ backgroundColor: brandColor }}
              className="w-full h-16 text-white text-sm font-black uppercase tracking-[0.2em] rounded-3xl shadow-xl hover:opacity-90 transition-all" 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Authorize & Create Account"}
            </Button>

            <div className="text-center pt-2">
              <Link href="/auth/login" className="text-slate-500 font-bold hover:text-slate-800 transition-colors text-sm">
                Already have an account? <span className="underline decoration-2 underline-offset-4">Sign In</span>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}