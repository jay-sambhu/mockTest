import { createHash, randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const AUTH_COOKIE_NAME = "quiz-auth-token";
const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

export function hashAuthToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function createAuthSession(userId: number) {
  const token = randomUUID();
  const tokenHash = hashAuthToken(token);
  const expiresAt = new Date(Date.now() + THIRTY_DAYS_IN_SECONDS * 1000);

  await prisma.session.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export function setAuthCookie(cookieStore: ReturnType<typeof cookies>, token: string, expiresAt: Date) {
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export function clearAuthCookie(cookieStore: ReturnType<typeof cookies>) {
  cookieStore.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentUser() {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const tokenHash = hashAuthToken(token);
  const session = await prisma.session.findFirst({
    where: {
      tokenHash,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });

  if (!session) {
    return null;
  }

  return session.user;
}

export async function getAuthenticatedUserOrThrow() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  return user;
}

export async function revokeCurrentSession() {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return;
  }

  await prisma.session.deleteMany({
    where: {
      tokenHash: hashAuthToken(token),
    },
  });
}