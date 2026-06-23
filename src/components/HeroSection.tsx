import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="hero glass fade-in hero-bg">
      <div className="hero-grid">
        <div className="hero-card">
          <h1 className="section-title">Mock Test Platform</h1>
          <p className="section-subtitle">
            Create, share, and take quizzes with a sleek, fast UI.
          </p>
          <div className="button-row" style={{ marginTop: "1rem" }}>
            <Link href="/quizzes/new" className="link-button link-button-primary">
              Create Quiz
            </Link>
            <Link href="/quizzes" className="link-button link-button-secondary">
              Browse Quizzes
            </Link>
          </div>
        </div>
        <aside className="panel">
          <h2 className="section-title">Quick actions</h2>
          <nav className="meta-grid">
            <Link href="/quizzes" className="quiz-list-item glass">
              <h3>Take a quiz</h3>
              <p className="muted">Launch a quiz and submit your score.</p>
            </Link>
            <Link href="/attempts" className="quiz-list-item glass">
              <h3>Review attempts</h3>
              <p className="muted">See completed results in a table.</p>
            </Link>
            <Link href="/quizzes/new" className="quiz-list-item glass">
              <h3>Create content</h3>
              <p className="muted">Add a new quiz with questions and options.</p>
            </Link>
          </nav>
        </aside>
      </div>
    </section>
  );
}
