import { prisma } from "@/lib/prisma";
import {
  createAuthSession,
  hashPassword,
  setAuthCookie,
} from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash: await hashPassword(password),
      },
    });

    const { token, expiresAt } = await createAuthSession(user.id);
    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );

    setAuthCookie(response.cookies, token, expiresAt);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to register account" },
      { status: 500 }
    );
  }
}