import { prisma } from "@/lib/prisma";

interface ResolveUserInput {
  userId?: number | null;
  name?: string | null;
  email?: string | null;
}

export async function resolveUser({ userId, name, email }: ResolveUserInput) {
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  if (!email) {
    throw new Error("Email is required");
  }

  return prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: name?.trim() || email.split("@")[0] || "Quiz User",
    },
    update: name?.trim() ? { name: name.trim() } : {},
  });
}