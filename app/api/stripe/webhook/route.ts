/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    // Helper: update our DB from a Stripe subscription object
    const syncFromStripeSub = async (stripeSub: Stripe.Subscription) => {
      const userId = stripeSub.metadata?.userId;
      if (!userId) return;
      const startSec = stripeSub.current_period_start;
      const endSec = stripeSub.current_period_end;
      const startDate = new Date(startSec * 1000);
      const endDate = new Date(endSec * 1000);
      const status = stripeSub.status; // active | trialing | past_due | canceled | unpaid | incomplete | incomplete_expired | paused
      const now = new Date();
      const notExpired = endDate > now;
      const isActive = (status === "active" || status === "trialing") && notExpired;

      await prisma.subscription.upsert({
        where: { userId },
        update: { startDate, endDate, isActive },
        create: { userId, startDate, endDate, isActive },
      });
    };

    // Checkout completed (initial purchase)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.subscription) {
        const stripeSub = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        await syncFromStripeSub(stripeSub);
      }
    }

    // Subscription lifecycle updates
    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const stripeSub = event.data.object as Stripe.Subscription;
      await syncFromStripeSub(stripeSub);
    }

    // Fallback: invoice paid (renews the period)
    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        const stripeSub = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        );
        await syncFromStripeSub(stripeSub);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Error handling webhook:", err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
