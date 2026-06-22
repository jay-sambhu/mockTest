import Link from "next/link";

interface QuizListProps {
  quizzes: Array<{
    id: number;
    title: string;
    description: string | null;
    createdAt: Date;
    user: { name: string; email: string };
    _count: { questions: number; attempts: number };
  }>;
  isLoading?: boolean;
}

export function QuizList({ quizzes, isLoading }: QuizListProps) {
  if (isLoading) {
    return <div className="panel">Loading quizzes...</div>;
  }

  if (quizzes.length === 0) {
    return (
      <div className="panel">
        <h3 className="section-title">No quizzes available yet</h3>
        <p className="section-subtitle">
          Create the first quiz to start collecting results.
        </p>
        <div className="button-row" style={{ marginTop: "1rem" }}>
          <Link className="link-button link-button-primary" href="/quizzes/new">
            Create quiz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-list">
      <div className="site-header" style={{ marginBottom: 0 }}>
        <div>
          <h2 className="section-title">Available Quizzes</h2>
          <p className="section-subtitle">Browse and launch a quiz in seconds.</p>
        </div>
        <Link className="link-button link-button-primary" href="/quizzes/new">
          Create quiz
        </Link>
      </div>

      <div className="card-grid">
        {quizzes.map((quiz) => (
          <article key={quiz.id} className="quiz-list-item">
            <div className="meta-grid" style={{ marginBottom: "0.75rem" }}>
              <span className="pill">{quiz._count.questions} questions</span>
              <span className="pill">{quiz._count.attempts} attempts</span>
            </div>

            <h3>{quiz.title}</h3>
            <p className="muted">{quiz.description ?? "No description provided."}</p>

            <div className="divider" />

            <p className="muted" style={{ marginBottom: "1rem" }}>
              Created by {quiz.user.name} · {new Date(quiz.createdAt).toLocaleDateString()}
            </p>

            <Link className="link-button link-button-secondary" href={`/quizzes/${quiz.id}`}>
              Start quiz
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
