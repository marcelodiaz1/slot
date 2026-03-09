// utils/zoomProvider.ts

async function getValidAccessToken(supabase: any, userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('zoom_access_token, zoom_refresh_token, zoom_expires_at')
    .eq('id', userId)
    .single();

  const now = new Date();
  const expiresAt = new Date(profile.zoom_expires_at);

  // If token is still valid (with a 5-minute buffer), return it
  if (profile.zoom_access_token && expiresAt > new Date(now.getTime() + 5 * 60000)) {
    return profile.zoom_access_token;
  }

  // Otherwise, Refresh it
  const response = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: profile.zoom_refresh_token,
    }),
  });

  const data = await response.json();

  if (data.access_token) {
    // Update DB with new tokens
    await supabase
      .from('profiles')
      .update({
        zoom_access_token: data.access_token,
        zoom_refresh_token: data.refresh_token,
        zoom_expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
      })
      .eq('id', userId);

    return data.access_token;
  }

  throw new Error("Could not refresh Zoom token");
}

export async function createZoomMeeting(supabase: any, userId: string, details: any) {
  try {
    const token = await getValidAccessToken(supabase, userId);

    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: details.title || 'Consultation',
        type: 2, // Scheduled meeting
        start_time: details.start.toISOString(),
        duration: details.duration,
        settings: {
          join_before_host: true,
          waiting_room: false,
        },
      }),
    });

    const meeting = await response.json();
    return { link: meeting.join_url, id: meeting.id };
  } catch (error) {
    console.error("Zoom Creation Error:", error);
    return null;
  }
}