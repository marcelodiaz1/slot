"use client";

import { createClient } from '@/lib/supabase/client'; // Ensure this is the BROWSER client
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes (login/logout) to keep navbar in sync
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      router.refresh(); // Refresh to update server-side data if needed
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  if (loading) {
    return <div className="w-20 h-10 bg-gray-100 animate-pulse rounded-xl" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </Button>
        <Button asChild className="bg-blue-600">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" className="font-semibold">
        <Link href="/auth/login">Login</Link>
      </Button>
      <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-bold">
        <Link href="/auth/sign-up">Get Started</Link>
      </Button>
    </div>
  );
}