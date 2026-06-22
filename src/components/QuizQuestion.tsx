interface QuestionWithOptions {
  id: number;
  text: string;
  quizId: number;
  correctOptionId: number | null;
  options: Array<{
    id: number;
    text: string;
  }>;
}

interface QuizQuestionProps {
  question: QuestionWithOptions;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSelect: (optionId: number) => void;
  selectedAnswer?: number;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSelect,
  selectedAnswer,
}: QuizQuestionProps) {
  return (
    <section className="quiz-card question-grid">
      <div>
        <span className="pill">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="progress" style={{ marginTop: "0.75rem" }}>
          <div
            className="progress-bar"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="section-title">{question.text}</h3>

      <fieldset className="option-grid" style={{ border: 0, padding: 0 }}>
        <legend className="muted" style={{ marginBottom: "0.25rem" }}>
          Select your answer
        </legend>
        {question.options.map((option) => (
          <label key={option.id} className="option-item">
            <input
              style={{ marginRight: "0.75rem" }}
              type="radio"
              name={`question-${question.id}`}
              value={option.id}
              checked={selectedAnswer === option.id}
              onChange={() => onAnswerSelect(option.id)}
            />
            {option.text}
          </label>
        ))}
      </fieldset>
    </section>
  );
}
