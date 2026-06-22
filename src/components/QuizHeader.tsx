interface QuizHeaderProps {
  quizTitle: string;
  userName?: string;
  onExit?: () => void;
}

export function QuizHeader({
  quizTitle,
  userName,
  onExit,
}: QuizHeaderProps) {
  return (
    <header className="site-header" style={{ marginBottom: "1rem" }}>
      <div className="brand-lockup">
        <span className="pill" style={{ width: "fit-content" }}>
          Live quiz
        </span>
        <h1 className="section-title" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
          {quizTitle}
        </h1>
        {userName && <p className="section-subtitle">Taking quiz as: {userName}</p>}
      </div>
      <nav>{onExit && <button className="button button-secondary" onClick={onExit}>Exit quiz</button>}</nav>
    </header>
  );
}
