import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserOrThrow } from "@/lib/auth";
import { handleRouteError } from "@/lib/api-errors";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { quizId, answers } = await request.json();
    const currentUser = await getAuthenticatedUserOrThrow();

    if (!quizId || !answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "quizId and answers are required" },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(quizId) },
      include: {
        questions: {
          select: { id: true, correctOptionId: true },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz.questions.length === 0) {
      return NextResponse.json({ error: "Quiz has no questions" }, { status: 400 });
    }

    let score = 0;

    for (const question of quiz.questions) {
      const userAnswer = answers[question.id] ?? answers[String(question.id)];

      if (userAnswer === question.correctOptionId) {
        score++;
      }
    }

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: currentUser.id,
        quizId: quiz.id,
        score,
        totalQuestions: quiz.questions.length,
      },
    });

    return NextResponse.json(
      {
        ...attempt,
        score,
        totalQuestions: quiz.questions.length,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleRouteError(error, "Failed to create quiz attempt");
  }
}

export async function GET() {
  try {
    const currentUser = await getAuthenticatedUserOrThrow();

    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: currentUser.id },
      include: {
        user: { select: { id: true, name: true } },
        quiz: { select: { id: true, title: true } },
      },
      orderBy: { completedAt: "desc" },
    });

    return NextResponse.json(attempts);
  } catch (error) {
    return handleRouteError(error, "Failed to fetch attempts");
  }
}
