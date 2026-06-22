const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const connectionString =
  process.env.DIRECT_URL || process.env.DATABASE_URL || "";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  await prisma.quizAttempt.deleteMany();
  await prisma.questionOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: "admin@quizapp.com",
      name: "Quiz Admin",
    },
  });

  const quizzes = [
    {
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of core JavaScript concepts.",
      questions: [
        {
          text: "Which keyword is used to declare a block-scoped variable?",
          options: ["var", "let", "function", "const"],
          correctIndex: 1,
        },
        {
          text: "What does JSON stand for?",
          options: [
            "JavaScript Object Notation",
            "Java Source Open Network",
            "JavaScript Output Name",
            "Just Simple Object Notation",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      title: "Next.js Basics",
      description: "Build confidence with the App Router and server components.",
      questions: [
        {
          text: "Which folder is commonly used for route handlers in the App Router?",
          options: ["pages", "routes", "app", "components"],
          correctIndex: 2,
        },
        {
          text: "What does the 'use client' directive do?",
          options: [
            "Enables CSS modules",
            "Marks a component for client-side rendering",
            "Creates a server action",
            "Builds static pages only",
          ],
          correctIndex: 1,
        },
      ],
    },
  ];

  for (const quizData of quizzes) {
    const quiz = await prisma.quiz.create({
      data: {
        title: quizData.title,
        description: quizData.description,
        userId: user.id,
      },
    });

    for (const questionData of quizData.questions) {
      const question = await prisma.question.create({
        data: {
          text: questionData.text,
          quizId: quiz.id,
        },
      });

      const options = await Promise.all(
        questionData.options.map((text) =>
          prisma.questionOption.create({
            data: {
              text,
              questionId: question.id,
            },
          })
        )
      );

      await prisma.question.update({
        where: { id: question.id },
        data: {
          correctOptionId: options[questionData.correctIndex].id,
        },
      });
    }
  }

  const firstQuiz = await prisma.quiz.findFirst({ orderBy: { id: "asc" } });

  if (firstQuiz) {
    await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: firstQuiz.id,
        score: 2,
        totalQuestions: 2,
      },
    });
  }

  console.log("Seed data created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
