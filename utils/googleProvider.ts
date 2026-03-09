'use server'

/**
 * Updates the database with the Google Refresh Token.
 * Can be called during initial auth or during token rotation.
 */
export async function saveGoogleRefreshToken(supabase: any, userId: string, refreshToken: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ 
      google_refresh_token: refreshToken,
      // Using a spread or partial update to preserve other integrations
      // Note: check your table structure to ensure this doesn't overwrite the whole JSON
      integrations: { google_meet: true } 
    })
    .eq('id', userId);

  if (error) console.error("Error saving token to DB:", error);
}

/**
 * Gets a fresh access token using the stored refresh token.
 */
async function getValidGoogleToken(supabase: any, userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('google_refresh_token')
    .eq('id', userId)
    .single();

  if (!profile?.google_refresh_token) {
    throw new Error("No Google Refresh Token found in database.");
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: 'refresh_token',
      refresh_token: profile.google_refresh_token,
    }),
  });

  const data = await response.json();

  if (!data.access_token) {
    console.error("Google Token Refresh Error:", data);
    throw new Error("Failed to refresh Google token");
  }

    await saveGoogleRefreshToken(supabase, userId, data.refresh_token);
  // OPTIONAL BUT RECOMMENDED: If Google sends a NEW refresh token, save it!
  if (data.refresh_token) {
    await saveGoogleRefreshToken(supabase, userId, data.refresh_token);
  }

  return data.access_token;
}

/**
 * Creates a Google Calendar event with a Meet link.
 */
export async function createGoogleMeet(supabase: any, userId: string, details: any) {
  try {
    const token = await getValidGoogleToken(supabase, userId);

    const event = {
      summary: details.title,
      description: 'Scheduled via your Booking App',
      start: { dateTime: details.start.toISOString() },
      end: { dateTime: new Date(details.start.getTime() + details.duration * 60000).toISOString() },
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    // 
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    const result = await response.json();

    if (!result.id) {
      console.error("Google API Error Response:", result);
      return null;
    }

    const meetLink = result.conferenceData?.entryPoints?.find(
      (ep: any) => ep.entryPointType === 'video'
    )?.uri;

    return { 
      link: meetLink || null, 
      id: result.id 
    };
  } catch (error) {
    console.error("Google Meet Creation Error:", error);
    return null;
  }
}