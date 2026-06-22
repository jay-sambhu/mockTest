"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthBar } from "@/components/AuthBar";

interface HomeStats {
  quizCount: number;
  questionCount: number;
  attemptCount: number;
  userCount: number;
  recentQuiz: { id: number; title: string } | null;
  recentAttempt: { score: number; totalQuestions: number; quiz: { title: string } } | null;
}

export default function HomePage() {
  const [stats, setStats] = useState<HomeStats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  return (
    <main className="site-container">
      <header className="site-header">
        <div className="brand-lockup">
          <span className="pill" style={{ width: "fit-content" }}>
            Quiz Builder
          </span>
          <h1 className="section-title" style={{ fontSize: "clamp(2.4rem, 5vw, 4.8rem)" }}>
            Build quizzes that look sharp and feel fast.
          </h1>
          <p className="section-subtitle" style={{ maxWidth: 720 }}>
            Create quizzes, track attempts, and present polished results with a database-backed
            Next.js experience designed for search, sharing, and production use.
          </p>
        </div>

        <AuthBar />
      </header>

      <section className="hero">
        <div className="hero-grid">
          <div className="hero-card">
            <h2 className="section-title">Everything in one flow</h2>
            <p className="section-subtitle">
              Publish quizzes, let users submit answers, and store results without hardcoded IDs or
              static content.
            </p>

            <div className="meta-grid" style={{ marginTop: "1.25rem" }}>
              <div className="stats-card">
                <strong>{stats?.quizCount ?? "--"} quizzes</strong>
                <p className="muted">Published in the database.</p>
              </div>
              <div className="stats-card">
                <strong>{stats?.questionCount ?? "--"} questions</strong>
                <p className="muted">Ready for learner sessions.</p>
              </div>
              <div className="stats-card">
                <strong>{stats?.attemptCount ?? "--"} attempts</strong>
                <p className="muted">Completed responses stored safely.</p>
              </div>
            </div>

            <div className="button-row" style={{ marginTop: "1.25rem" }}>
              <Link className="link-button link-button-primary" href="/quizzes/new">
                Create quiz
              </Link>
              <Link className="link-button link-button-secondary" href="/quizzes">
                Browse quizzes
              </Link>
            </div>
          </div>

          <aside className="panel">
            <h2 className="section-title">Quick actions</h2>
            <div className="divider" />
            <nav className="meta-grid">
              <Link className="quiz-list-item" href="/quizzes">
                <h3>Take a quiz</h3>
                <p className="muted">Launch a quiz and submit your score.</p>
              </Link>
              <Link className="quiz-list-item" href="/attempts">
                <h3>Review attempts</h3>
                <p className="muted">See completed results in a table.</p>
              </Link>
              <Link className="quiz-list-item" href="/quizzes/new">
                <h3>Create content</h3>
                <p className="muted">Add a new quiz with questions and options.</p>
              </Link>
            </nav>

            <div className="divider" />
            <p className="muted">
              {stats?.recentQuiz
                ? `Latest quiz: ${stats.recentQuiz.title}`
                : "No quizzes yet."}
            </p>
            <p className="muted">
              {stats?.recentAttempt
                ? `Latest score: ${stats.recentAttempt.score}/${stats.recentAttempt.totalQuestions} on ${stats.recentAttempt.quiz.title}`
                : "No quiz attempts yet."}
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}