import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="site-container">
          <div className="panel">Loading...</div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
