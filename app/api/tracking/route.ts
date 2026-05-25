import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref");

  if (!ref) {
    return NextResponse.json({ error: "ref parameter required" }, { status: 400 });
  }

  // In a real implementation, query the database by reference number.
  // For now, return a not-found response — the client-side tracking page
  // handles demo data and localStorage lookups directly.
  return NextResponse.json(
    { error: "Booking not found. Use the client portal for tracking." },
    { status: 404 }
  );
}
