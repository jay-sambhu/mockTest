import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

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

    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { title, description } = await request.json();

    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.quiz.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}
