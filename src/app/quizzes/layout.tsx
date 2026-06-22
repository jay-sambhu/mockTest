import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Quizzes",
  description: "Explore published quizzes and start a quiz session in seconds.",
};

export default function QuizzesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}