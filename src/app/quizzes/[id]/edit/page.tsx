"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface QuestionDraft {
  text: string;
  options: string[];
  correctOptionIndex: number;
}

const createEmptyQuestion = (): QuestionDraft => ({
  text: "",
  options: ["", "", "", ""],
  correctOptionIndex: 0,
});

export default function EditQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = Number(params.id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>([createEmptyQuestion()]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const response = await fetch(`/api/quizzes/${quizId}`);
        if (!response.ok) throw new Error("Failed to load quiz");
        const data = await response.json();

        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
        setQuestions(
          data.questions?.length
            ? data.questions.map((question: {
                text: string;
                options: { id: number; text: string }[];
                correctOptionId: number | null;
              }) => ({
                text: question.text,
                options: question.options.map((option) => option.text),
                correctOptionIndex: Math.max(
                  0,
                  question.options.findIndex((option) => option.id === question.correctOptionId)
                ),
              }))
            : [createEmptyQuestion()]
        );
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  const updateQuestion = (index: number, value: Partial<QuestionDraft>) => {
    setQuestions((current) =>
      current.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...value } : question
      )
    );
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setQuestions((current) =>
      current.map((question, currentQuestionIndex) => {
        if (currentQuestionIndex !== questionIndex) return question;
        const options = [...question.options];
        options[optionIndex] = value;
        return { ...question, options };
      })
    );
  };

  const addQuestion = () => {
    setQuestions((current) => [...current, createEmptyQuestion()]);
  };

  const removeQuestion = (questionIndex: number) => {
    setQuestions((current) => current.filter((_, index) => index !== questionIndex));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          questions: questions.map((question) => ({
            text: question.text,
            options: question.options,
            correctOptionIndex: question.correctOptionIndex,
          })),
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || "Failed to update quiz");
      }

      router.push(`/quizzes/${quizId}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <main className="site-container">Loading quiz...</main>;
  }

  return (
    <main className="site-container">
      <section className="form-card">
        <span className="pill">Edit quiz</span>
        <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
          Update quiz
        </h1>

        <form className="question-grid" onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
          <div className="field">
            <label htmlFor="title">Quiz title</label>
            <input className="input" id="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea className="textarea" id="description" value={description} onChange={(event) => setDescription(event.target.value)} />
          </div>

          <div className="divider" />

          <div className="site-header" style={{ marginBottom: "1rem" }}>
            <div>
              <h2 className="section-title">Questions</h2>
              <p className="section-subtitle">Update each question and publish the changes.</p>
            </div>
            <button className="button button-secondary" type="button" onClick={addQuestion}>
              Add question
            </button>
          </div>

          {questions.map((question, questionIndex) => (
            <section key={questionIndex} className="quiz-card">
              <div className="site-header" style={{ marginBottom: "1rem" }}>
                <h3 className="section-title">Question {questionIndex + 1}</h3>
                {questions.length > 1 && (
                  <button className="button button-secondary" type="button" onClick={() => removeQuestion(questionIndex)}>
                    Remove
                  </button>
                )}
              </div>

              <div className="field">
                <label>Question text</label>
                <textarea
                  className="textarea"
                  value={question.text}
                  onChange={(event) => updateQuestion(questionIndex, { text: event.target.value })}
                  required
                />
              </div>

              <div className="card-grid" style={{ marginTop: "1rem" }}>
                {question.options.map((option, optionIndex) => (
                  <div className="field" key={optionIndex}>
                    <label>Option {optionIndex + 1}</label>
                    <input
                      className="input"
                      value={option}
                      onChange={(event) => updateOption(questionIndex, optionIndex, event.target.value)}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="field" style={{ marginTop: "1rem" }}>
                <label>Correct answer</label>
                <select
                  className="select"
                  value={question.correctOptionIndex}
                  onChange={(event) =>
                    updateQuestion(questionIndex, {
                      correctOptionIndex: Number(event.target.value),
                    })
                  }
                >
                  {question.options.map((_, optionIndex) => (
                    <option key={optionIndex} value={optionIndex}>
                      Option {optionIndex + 1}
                    </option>
                  ))}
                </select>
              </div>
            </section>
          ))}

          {error && <p style={{ color: "#b42318" }}>{error}</p>}

          <div className="button-row">
            <button className="button button-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
            <button className="button button-secondary" type="button" onClick={() => router.push(`/quizzes/${quizId}`)}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}