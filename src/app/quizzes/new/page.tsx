"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function NewQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>([createEmptyQuestion()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          creatorName,
          creatorEmail,
          questions: questions.map((question) => ({
            text: question.text,
            options: question.options,
            correctOptionIndex: question.correctOptionIndex,
          })),
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || "Failed to create quiz");
      }

      const createdQuiz = await response.json();
      router.push(`/quizzes/${createdQuiz.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="site-container">
      <header className="site-header">
        <div>
          <span className="pill">Quiz Builder</span>
          <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
            Create a new quiz
          </h1>
          <p className="section-subtitle">
            Add a title, creator details, and multiple-choice questions in a SEO-friendly admin flow.
          </p>
        </div>
      </header>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="card-grid">
          <div className="field">
            <label htmlFor="title">Quiz title</label>
            <input
              id="title"
              className="input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="JavaScript Fundamentals"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="creatorName">Creator name</label>
            <input
              id="creatorName"
              className="input"
              value={creatorName}
              onChange={(event) => setCreatorName(event.target.value)}
              placeholder="Quiz Admin"
            />
          </div>
        </div>

        <div className="card-grid" style={{ marginTop: "1rem" }}>
          <div className="field">
            <label htmlFor="creatorEmail">Creator email</label>
            <input
              id="creatorEmail"
              className="input"
              type="email"
              value={creatorEmail}
              onChange={(event) => setCreatorEmail(event.target.value)}
              placeholder="admin@quizapp.com"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="textarea"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what this quiz covers"
            />
          </div>
        </div>

        <div className="divider" />

        <div className="site-header" style={{ marginBottom: "1rem" }}>
          <div>
            <h2 className="section-title">Questions</h2>
            <p className="section-subtitle">Each question needs at least two answer options.</p>
          </div>
          <button className="button button-secondary" type="button" onClick={addQuestion}>
            Add question
          </button>
        </div>

        <div className="question-grid">
          {questions.map((question, questionIndex) => (
            <section key={questionIndex} className="quiz-card">
              <div className="site-header" style={{ marginBottom: "1rem" }}>
                <h3 className="section-title">Question {questionIndex + 1}</h3>
                {questions.length > 1 && (
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="field">
                <label>Question text</label>
                <textarea
                  className="textarea"
                  value={question.text}
                  onChange={(event) =>
                    updateQuestion(questionIndex, { text: event.target.value })
                  }
                  placeholder="What is the output of console.log(2 + 2)?"
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
                      onChange={(event) =>
                        updateOption(questionIndex, optionIndex, event.target.value)
                      }
                      placeholder={`Answer option ${optionIndex + 1}`}
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
        </div>

        {error && <p style={{ color: "#b42318", marginTop: "1rem" }}>{error}</p>}

        <div className="button-row" style={{ marginTop: "1.25rem" }}>
          <button className="button button-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating quiz..." : "Publish quiz"}
          </button>
          <button className="button button-secondary" type="button" onClick={() => router.push("/") }>
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
