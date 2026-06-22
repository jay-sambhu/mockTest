"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          router.replace("/quizzes");
        }
      })
      .catch(() => undefined);
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to log in");
      }

      router.replace("/quizzes");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="site-container">
      <section className="form-card">
        <span className="pill">Welcome back</span>
        <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
          Log in to Quiz Master
        </h1>
        <p className="section-subtitle">Use your account to create quizzes and submit attempts without typing your details every time.</p>

        <form onSubmit={handleSubmit} className="question-grid" style={{ marginTop: "1.5rem" }}>
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
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
            <a className="link-button link-button-secondary" href="/register">
              Create account
            </a>
          </div>
        </form>
      </section>
    </main>
  );
}
