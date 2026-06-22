"use client";

import { useEffect, useState } from "react";
import { QuizList } from "@/components/QuizList";
import Link from "next/link";

interface Quiz {
  id: number;
  title: string;
  description: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string;
    email: string;
  };
  _count: {
    questions: number;
    attempts: number;
  };
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/quizzes");
        if (!response.ok) throw new Error("Failed to fetch quizzes");
        const data = await response.json();
        setQuizzes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <main className="site-container">
      <header className="site-header">
        <div>
          <span className="pill">Browse quizzes</span>
          <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
            All quizzes
          </h1>
          <p className="section-subtitle">Select a quiz to begin and track your score.</p>
        </div>
        <div className="button-row">
          <Link className="link-button link-button-secondary" href="/quizzes/new">
            Create quiz
          </Link>
          <Link className="link-button link-button-secondary" href="/">
            Back home
          </Link>
        </div>
      </header>

      {error && <div>{error}</div>}

      <QuizList quizzes={quizzes} isLoading={isLoading} />
    </main>
  );
}
