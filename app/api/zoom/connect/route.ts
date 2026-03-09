import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.ZOOM_CLIENT_ID;
  const redirectUri = process.env.ZOOM_REDIRECT_URI;

  const zoomUrl = new URL('https://zoom.us/oauth/authorize');
  zoomUrl.searchParams.set('response_type', 'code');
  zoomUrl.searchParams.set('client_id', clientId!);
  zoomUrl.searchParams.set('redirect_uri', redirectUri!);
   
  const scopes = [
    'meeting:write:meeting',
    'meeting:write:invite_links',
    'user:read:user'
  ].join(' ');

  zoomUrl.searchParams.set('scope', scopes); 

  return NextResponse.json({ url: zoomUrl.toString() });
}