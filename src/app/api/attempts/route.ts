import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserOrThrow } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { quizId, score, totalQuestions } = await request.json();
    const currentUser = await getAuthenticatedUserOrThrow();

    if (!quizId || score === undefined || !totalQuestions) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: currentUser.id,
        quizId: Number(quizId),
        score: Number(score),
        totalQuestions: Number(totalQuestions),
      },
    });

    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create quiz attempt" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    const quizId = request.nextUrl.searchParams.get("quizId");

    const where: {
      userId?: number;
      quizId?: number;
    } = {};

    if (userId) where.userId = Number(userId);
    if (quizId) where.quizId = Number(quizId);

    const attempts = await prisma.quizAttempt.findMany({
      where,
      include: {
        user: { select: { id: true, name: true } },
        quiz: { select: { id: true, title: true } },
      },
      orderBy: { completedAt: "desc" },
    });

    return NextResponse.json(attempts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch attempts" },
      { status: 500 }
    );
  }
}
