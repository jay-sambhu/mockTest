import Link from "next/link";

export default function HomePage() {
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

        <div className="button-row">
          <Link className="link-button link-button-primary" href="/quizzes/new">
            Create quiz
          </Link>
          <Link className="link-button link-button-secondary" href="/quizzes">
            Browse quizzes
          </Link>
        </div>
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
                <strong>SEO ready</strong>
                <p className="muted">Metadata, Open Graph, and semantic structure.</p>
              </div>
              <div className="stats-card">
                <strong>Database backed</strong>
                <p className="muted">Prisma models, route handlers, and seeded demo data.</p>
              </div>
              <div className="stats-card">
                <strong>Responsive UI</strong>
                <p className="muted">Layouts that adapt cleanly across desktop and mobile.</p>
              </div>
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
          </aside>
        </div>
      </section>
    </main>
  );
}