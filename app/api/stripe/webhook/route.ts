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
    // Handle initial checkout session completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (userId) {
        const startDate = new Date();
        const endDate = new Date(new Date().setMonth(startDate.getMonth() + 1));

        await prisma.subscription.upsert({
          where: { userId },
          update: { startDate, endDate, isActive: true },
          create: { userId, startDate, endDate, isActive: true },
        });
      }
    }

    // Handle subscription renewal
    if (event.type === "invoice.paid") {
      const invoice = event.data.object as any; // cast to any to fix TypeScript error
      const subscriptionId = invoice.subscription as string | undefined;

      if (!subscriptionId) {
        console.warn("Invoice has no subscription ID, skipping");
      } else {
        // Retrieve Stripe subscription to get metadata (userId)
        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = stripeSubscription.metadata?.userId;

        if (userId) {
          const startDate = new Date();
          const endDate = new Date(new Date().setMonth(startDate.getMonth() + 1));

          await prisma.subscription.upsert({
            where: { userId },
            update: { startDate, endDate, isActive: true },
            create: { userId, startDate, endDate, isActive: true },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Error handling webhook:", err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
