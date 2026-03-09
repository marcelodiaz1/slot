import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();

    // Create a Stripe Connect Account
    const account = await stripe.accounts.create({
      type: 'express',
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Create an Account Link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings?stripe=failed`,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings?stripe=success`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error: any) {
    console.error('Stripe Error:', error);
    // This ensures we return JSON even on error, preventing the HTML crash
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}