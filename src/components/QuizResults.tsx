import Link from "next/link";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  quizTitle: string;
  completedAt: Date;
}

export function QuizResults({
  score,
  totalQuestions,
  quizTitle,
  completedAt,
}: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 60;

  return (
    <section className="results-card">
      <span className="pill">Quiz complete</span>
      <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
        {quizTitle}
      </h2>

      <div className="hero-grid" style={{ alignItems: "stretch", marginTop: "1rem" }}>
        <div className="panel">
          <div className="stats-row">
            <span className="pill">{score} correct</span>
            <span className="pill">{totalQuestions} total</span>
            <span className="pill">{percentage}% score</span>
          </div>

          <div className="divider" />

          {passed ? (
            <div>
              <h3 className="section-title">Congratulations</h3>
              <p className="section-subtitle">You passed the quiz and can review or share the result.</p>
            </div>
          ) : (
            <div>
              <h3 className="section-title">Try again</h3>
              <p className="section-subtitle">
                You need {Math.ceil(totalQuestions * 0.6 - score)} more correct answers to pass.
              </p>
            </div>
          )}

          <p className="muted">Completed at: {completedAt.toLocaleString()}</p>
        </div>

        <aside className="panel">
          <h3 className="section-title">Next steps</h3>
          <div className="divider" />
          <div className="button-row">
            <Link className="link-button link-button-primary" href="/quizzes">
              View quizzes
            </Link>
            <Link className="link-button link-button-secondary" href="/">
              Back home
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
