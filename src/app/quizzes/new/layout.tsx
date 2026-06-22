import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Quiz",
  description: "Create a new quiz with multiple-choice questions and published metadata.",
};

export default function NewQuizLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}