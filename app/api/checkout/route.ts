import { Stripe } from 'stripe';
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { bookingId, priceInCents, professionalStripeId, serviceName } = await req.json();
    const supabase = await createClient();

    // 1. Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: serviceName },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      // This routes the money to the Professional
      payment_intent_data: {
        application_fee_amount: Math.round(priceInCents * 0.10), // Example: 10% fee
        transfer_data: {
          destination: professionalStripeId,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/success?id=${bookingId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/cancel`,
      metadata: { bookingId },
    });

    // 2. Save the Session ID to your booking record
    await supabase
      .from('bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', bookingId);

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}