"use client";

import { useEffect, useState } from "react";

interface CurrentUser {
  id: number;
  name: string;
  email: string;
}

export function AuthBar() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="button-row" style={{ justifyContent: "flex-end" }}>
      {user ? (
        <>
          <span className="pill">{user.name}</span>
          <button
            className="button button-secondary"
            type="button"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.reload();
            }}
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <a className="link-button link-button-secondary" href="/login">
            Log in
          </a>
          <a className="link-button link-button-primary" href="/register">
            Register
          </a>
        </>
      )}
    </div>
  );
}
