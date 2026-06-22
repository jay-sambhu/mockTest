import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserOrThrow, getCurrentUser } from "@/lib/auth";
import { handleRouteError } from "@/lib/api-errors";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        questions: {
          include: {
            options: {
              select: { id: true, text: true },
            },
          },
        },
        attempts: {
          select: { id: true, score: true, completedAt: true },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const currentUser = await getCurrentUser();
    const isOwner = currentUser?.id === quiz.userId;

    const sanitizedQuiz = {
      ...quiz,
      questions: quiz.questions.map((question) => {
        if (isOwner) {
          return question;
        }

        return {
          id: question.id,
          text: question.text,
          quizId: question.quizId,
          options: question.options,
          createdAt: question.createdAt,
          updatedAt: question.updatedAt,
        };
      }),
    };

    return NextResponse.json(sanitizedQuiz);
  } catch (error) {
    return handleRouteError(error, "Failed to fetch quiz");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const { title, description, questions = [] } = await request.json();
    const currentUser = await getAuthenticatedUserOrThrow();

    const existingQuiz = await prisma.quiz.findUnique({ where: { id } });

    if (!existingQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (existingQuiz.userId !== currentUser.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const quiz = await prisma.$transaction(async (transaction) => {
      await transaction.quiz.update({
        where: { id },
        data: {
          title: title.trim(),
          description: description?.trim() || null,
        },
      });

      if (Array.isArray(questions)) {
        await transaction.questionOption.deleteMany({
          where: {
            question: {
              quizId: id,
            },
          },
        });

        await transaction.question.deleteMany({ where: { quizId: id } });

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
              quizId: id,
            },
          });

          const createdOptions: Array<{ id: number }> = [];

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
      }

      return transaction.quiz.findUnique({
        where: { id },
        include: {
          user: { select: { id: true, name: true, email: true } },
          questions: {
            include: {
              options: {
                select: { id: true, text: true },
              },
            },
          },
          attempts: {
            select: { id: true, score: true, completedAt: true },
          },
        },
      });
    });

    return NextResponse.json(quiz);
  } catch (error) {
    return handleRouteError(error, "Failed to update quiz");
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const currentUser = await getAuthenticatedUserOrThrow();

    const existingQuiz = await prisma.quiz.findUnique({ where: { id } });

    if (!existingQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (existingQuiz.userId !== currentUser.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.quiz.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    return handleRouteError(error, "Failed to delete quiz");
  }
}
