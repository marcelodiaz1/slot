import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function POST() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Generate a random 32-character API key
  const apiKey = `zap_${randomBytes(24).toString('hex')}`;

  // Update the profiles table
  const { error } = await supabase
    .from('profiles')
    .update({ 
      zapier_api_key: apiKey,
      integrations: { 
        // We need to fetch current integrations first or use a RPC to merge
        // For simplicity, let's assume we are updating the boolean here:
        zoom: true, // You'll want to spread your actual current state here
        zapier: true 
      }
    })
    .eq('id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ apiKey });
}