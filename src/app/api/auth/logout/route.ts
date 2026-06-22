import { clearAuthCookie, revokeCurrentSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  await revokeCurrentSession();

  const response = NextResponse.json({ ok: true });
  clearAuthCookie(response.cookies);

  return response;
}