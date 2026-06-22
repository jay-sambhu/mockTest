import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [quizCount, questionCount, attemptCount, userCount, recentQuiz, recentAttempt] = await Promise.all([
      prisma.quiz.count(),
      prisma.question.count(),
      prisma.quizAttempt.count(),
      prisma.user.count(),
      prisma.quiz.findFirst({
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true },
      }),
      prisma.quizAttempt.findFirst({
        orderBy: { completedAt: "desc" },
        select: { score: true, totalQuestions: true, quiz: { select: { title: true } } },
      }),
    ]);

    return NextResponse.json({
      quizCount,
      questionCount,
      attemptCount,
      userCount,
      recentQuiz,
      recentAttempt,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load stats" },
      { status: 500 }
    );
  }
}
