// app/api/auth/expo-authorization-proxy/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("authorizationURL");
  if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  return NextResponse.redirect(url);
}
