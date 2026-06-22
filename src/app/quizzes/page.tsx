"use client";

import { useEffect, useState } from "react";
import { QuizList } from "@/components/QuizList";
import Link from "next/link";
import { AuthBar } from "@/components/AuthBar";

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

  const refreshQuizzes = async () => {
    const response = await fetch("/api/quizzes");
    if (!response.ok) throw new Error("Failed to fetch quizzes");
    const data = await response.json();
    setQuizzes(data);
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setIsLoading(true);
        await refreshQuizzes();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId: number) => {
    const response = await fetch(`/api/quizzes/${quizId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const payload = await response.json();
      throw new Error(payload.error || "Failed to delete quiz");
    }

    await refreshQuizzes();
  };

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
        <AuthBar />
      </header>

      <div className="button-row" style={{ marginBottom: "1rem" }}>
        <Link className="link-button link-button-secondary" href="/quizzes/new">
          Create quiz
        </Link>
        <Link className="link-button link-button-secondary" href="/">
          Back home
        </Link>
      </div>

      <section className="panel" style={{ marginBottom: "1rem" }}>
        <h2 className="section-title">Quiz management</h2>
        <p className="section-subtitle">Edit or delete quizzes you own using the buttons below.</p>
        <div className="button-row" style={{ marginTop: "1rem" }}>
          {quizzes.slice(0, 3).map((quiz) => (
            <div key={quiz.id} className="button-row">
              <Link className="link-button link-button-primary" href={`/quizzes/${quiz.id}/edit`}>
                Edit {quiz.title}
              </Link>
              <button
                className="button button-secondary"
                type="button"
                onClick={async () => {
                  if (confirm(`Delete ${quiz.title}?`)) {
                    try {
                      await handleDelete(quiz.id);
                    } catch (deleteError) {
                      setError(deleteError instanceof Error ? deleteError.message : "Unknown error");
                    }
                  }
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      {error && <div>{error}</div>}

      <QuizList quizzes={quizzes} isLoading={isLoading} />
    </main>
  );
}
