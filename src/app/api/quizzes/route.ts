import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserOrThrow } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { questions: true, attempts: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(quizzes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, questions = [] } = await request.json();
    const currentUser = await getAuthenticatedUserOrThrow();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const quiz = await prisma.$transaction(async (transaction) => {
      const createdQuiz = await transaction.quiz.create({
        data: {
          title: title.trim(),
          description: description?.trim() || null,
          userId: currentUser.id,
        },
      });

      for (const questionInput of questions) {
        const questionText = questionInput?.text?.trim();
        const optionTexts = Array.isArray(questionInput?.options)
          ? questionInput.options.map((option: string) => option.trim()).filter(Boolean)
          : [];

        if (!questionText || optionTexts.length < 2) {
          continue;
        }

        const correctOptionIndex = Math.min(
          Math.max(Number(questionInput?.correctOptionIndex ?? 0), 0),
          optionTexts.length - 1
        );

        const createdQuestion = await transaction.question.create({
          data: {
            text: questionText,
            quizId: createdQuiz.id,
          },
        });

        const createdOptions = [] as Array<{ id: number }>;
        for (const optionText of optionTexts) {
          const createdOption = await transaction.questionOption.create({
            data: {
              text: optionText,
              questionId: createdQuestion.id,
            },
          });
          createdOptions.push(createdOption);
        }

        await transaction.question.update({
          where: { id: createdQuestion.id },
          data: {
            correctOptionId: createdOptions[correctOptionIndex]?.id ?? null,
          },
        });
      }

      return transaction.quiz.findUnique({
        where: { id: createdQuiz.id },
        include: {
          user: { select: { id: true, name: true, email: true } },
          _count: { select: { questions: true, attempts: true } },
        },
      });
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}
