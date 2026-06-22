"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface QuizAttempt {
  id: number;
  userId: number;
  quizId: number;
  score: number;
  totalQuestions: number;
  completedAt: Date;
  user: {
    id: number;
    name: string;
  };
  quiz: {
    id: number;
    title: string;
  };
}

export default function AttemptsPage() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/attempts");
        if (!response.ok) throw new Error("Failed to fetch attempts");
        const data = await response.json();
        setAttempts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  return (
    <main className="site-container">
      <header className="site-header">
        <div>
          <span className="pill">Results dashboard</span>
          <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
            Your quiz attempts
          </h1>
          <p className="section-subtitle">Review scores and completion dates.</p>
        </div>
        <div className="button-row">
          <Link className="link-button link-button-secondary" href="/quizzes">
            Browse quizzes
          </Link>
          <Link className="link-button link-button-secondary" href="/">
            Back home
          </Link>
        </div>
      </header>

      {error && <div>{error}</div>}

      {isLoading ? (
        <div className="panel">Loading attempts...</div>
      ) : attempts.length === 0 ? (
        <div className="panel">
          <p className="section-subtitle">No quiz attempts yet. Start by taking a quiz!</p>
          <div className="button-row" style={{ marginTop: "1rem" }}>
            <Link className="link-button link-button-primary" href="/quizzes">
              Browse quizzes
            </Link>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Quiz Title</th>
              <th>Score</th>
              <th>Percentage</th>
              <th>Date Completed</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt.id}>
                <td>{attempt.quiz.title}</td>
                <td>
                  {attempt.score} / {attempt.totalQuestions}
                </td>
                <td>
                  {Math.round(
                    (attempt.score / attempt.totalQuestions) * 100
                  )}
                  %
                </td>
                <td>{new Date(attempt.completedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </main>
  );
}
