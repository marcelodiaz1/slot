import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    // --- 1. HANDLE CONNECT ONBOARDING ---
    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      
      // Check if the pro has finished the form and is cleared to get paid
      const isReady = 
        account.details_submitted && 
        account.charges_enabled && 
        account.payouts_enabled;

      if (isReady) {
        await supabase
          .from("profiles")
          .update({ 
            stripe_onboarding_complete: true,
            stripe_status: 'active' 
          })
          .eq("stripe_account_id", account.id);
      }
      break;
    }

    // --- 2. HANDLE CUSTOMER PAYMENTS ---
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      
      await supabase
        .from("bookings")
        .update({ status: "paid" })
        .eq("stripe_session_id", session.id);
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse("ok", { status: 200 });
}