import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const cookieStore = await cookies();

  // Initialize Supabase
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

  if (!code) return NextResponse.json({ error: 'No code provided' }, { status: 400 });

  // 1. Exchange code for Access Token
  const response = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.ZOOM_REDIRECT_URI!,
    }),
  });

  const data = await response.json();

  if (data.access_token) {
    // 2. Get the current user session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(new URL('/login', req.url));

    // 3. Get existing integrations to avoid overwriting others (stripe, outlook, etc.)
    const { data: profile } = await supabase
      .from('profiles')
      .select('integrations')
      .eq('id', user.id)
      .single();

    const currentIntegrations = profile?.integrations || {};

    // 4. Update the JSON and save tokens
    const { error: dbError } = await supabase
      .from('profiles')
      .update({ 
        integrations: { 
          ...currentIntegrations, 
          zoom: true 
        },
        // It is highly recommended to store these in the DB to create meetings later
        zoom_access_token: data.access_token,
        zoom_refresh_token: data.refresh_token,
        zoom_expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString()
      })
      .eq('id', user.id);

    if (dbError) {
        console.error("Database Update Error:", dbError);
        return NextResponse.redirect(new URL('/dashboard/settings?status=error', req.url));
    }

    return NextResponse.redirect(new URL('/dashboard/settings?status=zoom_success', req.url));
  }

  return NextResponse.json({ error: 'Failed to connect Zoom', details: data });
}