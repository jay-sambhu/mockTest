"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuizHeader } from "@/components/QuizHeader";
import { QuizQuestion } from "@/components/QuizQuestion";
import { QuizResults } from "@/components/QuizResults";

interface Question {
  id: number;
  text: string;
  quizId: number;
  options: Array<{
    id: number;
    text: string;
  }>;
}

interface QuizData {
  id: number;
  title: string;
  description: string | null;
  questions: Question[];
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = parseInt(params.id as string);

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/quizzes/${quizId}`);
        if (!response.ok) throw new Error("Failed to fetch quiz");
        const data = await response.json();
        setQuiz(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerSelect = (optionId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [quiz!.questions[currentQuestion].id]: optionId,
    }));
  };

  const handleStartQuiz = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasStarted(true);
  };

  const handleNext = () => {
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsCompleted(true);

    try {
      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId,
          answers,
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || "Failed to submit quiz attempt");
      }

      const result = await response.json();
      setScore(result.score);
    } catch (err) {
      console.error("Failed to submit quiz attempt:", err);
      setError(err instanceof Error ? err.message : "Failed to submit quiz");
      setIsCompleted(false);
    }
  };

  const handleExit = () => {
    router.push("/quizzes");
  };

  if (isLoading) {
    return <main>Loading quiz...</main>;
  }

  if (error) {
    return <main>Error: {error}</main>;
  }

  if (!quiz) {
    return <main>Quiz not found</main>;
  }

  if (!hasStarted) {
    return (
      <main className="site-container">
        <section className="form-card">
          <span className="pill">Ready to begin</span>
          <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
            {quiz.title}
          </h1>
          <p className="section-subtitle">{quiz.description ?? "Start this quiz using your logged-in account."}</p>

          <form onSubmit={handleStartQuiz} className="question-grid" style={{ marginTop: "1.5rem" }}>
            <p className="muted">Your authenticated account will be used automatically for the attempt.</p>
            <div className="button-row">
              <button className="button button-primary" type="submit">
                Start quiz
              </button>
              <button className="button button-secondary" type="button" onClick={handleExit}>
                Back to quizzes
              </button>
            </div>
          </form>
        </section>
      </main>
    );
  }

  if (isCompleted) {
    return (
      <main className="site-container">
        <QuizResults
          score={score}
          totalQuestions={quiz.questions.length}
          quizTitle={quiz.title}
          completedAt={new Date()}
        />
      </main>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <main className="site-container">
      <QuizHeader quizTitle={quiz.title} userName="" onExit={handleExit} />

      <QuizQuestion
        question={question}
        questionNumber={currentQuestion + 1}
        totalQuestions={quiz.questions.length}
        onAnswerSelect={handleAnswerSelect}
        selectedAnswer={answers[question.id]}
      />

      <nav className="button-row" style={{ marginTop: "1rem" }}>
        <button
          className="button button-secondary"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </button>

        {currentQuestion < quiz.questions.length - 1 ? (
          <button className="button button-primary" onClick={handleNext}>
            Next
          </button>
        ) : (
          <button className="button button-primary" onClick={handleSubmit}>
            Submit Quiz
          </button>
        )}
      </nav>

      <div className="muted" style={{ marginTop: "0.75rem" }}>
        Question {currentQuestion + 1} of {quiz.questions.length}
      </div>
    </main>
  );
}
