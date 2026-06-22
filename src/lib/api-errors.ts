import { NextResponse } from "next/server";
import { isAuthenticationError } from "@/lib/auth";

export function handleRouteError(error: unknown, fallbackMessage: string) {
  if (isAuthenticationError(error)) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}
