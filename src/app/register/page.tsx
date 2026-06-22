"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to register");
      }

      router.replace("/quizzes");
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="site-container">
      <section className="form-card">
        <span className="pill">Create account</span>
        <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
          Register for Quiz Master
        </h1>
        <p className="section-subtitle">Create your profile once and use it to manage quizzes and attempts.</p>

        <form onSubmit={handleSubmit} className="question-grid" style={{ marginTop: "1.5rem" }}>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input className="input" id="name" value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input className="input" id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input className="input" id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          {error && <p style={{ color: "#b42318" }}>{error}</p>}
          <div className="button-row">
            <button className="button button-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Register"}
            </button>
            <a className="link-button link-button-secondary" href="/login">
              Log in
            </a>
          </div>
        </form>
      </section>
    </main>
  );
}
