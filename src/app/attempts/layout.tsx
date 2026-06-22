import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz Attempts",
  description: "Review completed quiz attempts and scores.",
};

export default function AttemptsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}