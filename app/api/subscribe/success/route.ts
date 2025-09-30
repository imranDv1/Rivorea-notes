/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ message: "sessionId is required" }, { status: 400 });
    }

    // Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const userId = session.metadata?.userId;
    if (!userId) {
      return NextResponse.json({ message: "User ID not found in session metadata" }, { status: 400 });
    }

    // Save subscription in DB with start and end dates
    const startDate = new Date();
    const endDate = new Date(new Date().setMonth(startDate.getMonth() + 1)); // 1 month from start

    await prisma.subscription.upsert({
      where: { userId },
      update: { startDate, endDate, isActive: true },
      create: { userId, startDate, endDate, isActive: true },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
