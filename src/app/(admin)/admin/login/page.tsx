"use client";

import { useState, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { getClientAuth } from "@/lib/firebase/client";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const auth = getClientAuth();
      await signInWithEmailAndPassword(auth, email, password);
      // Set session cookie so middleware allows access to /admin/*
      document.cookie = `admin-session=${encodeURIComponent(email)}; path=/; SameSite=Strict`;
      router.push(from);
    } catch {
      setError("Invalid email or password.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: 8 }}>
          Email
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "12px 16px", background: "rgba(255,255,255,.06)",
            border: "1px solid rgba(255,255,255,.15)", color: "#fff",
            fontSize: 15, outline: "none",
            fontFamily: "inherit",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--gold-500)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.15)")}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: 8 }}>
          Password
        </label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "12px 16px", background: "rgba(255,255,255,.06)",
            border: "1px solid rgba(255,255,255,.15)", color: "#fff",
            fontSize: 15, outline: "none",
            fontFamily: "inherit",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--gold-500)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.15)")}
        />
      </div>

      {error && (
        <p style={{ margin: 0, fontSize: 13, color: "#f87171", padding: "10px 14px", background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.2)" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="admin-btn gold"
        style={{ marginTop: 8, padding: "14px 24px", fontSize: 13, letterSpacing: "0.06em", opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--green-900)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Brand */}
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-wide-white.png" alt="Masar Emaar" style={{ height: 48, margin: "0 auto 16px" }} />
          <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-500)", fontWeight: 600 }}>
            CMS Admin
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,.04)",
          border: "1px solid rgba(255,255,255,.1)",
          padding: "36px 32px",
        }}>
          <h1 style={{ margin: "0 0 28px", fontSize: 22, fontWeight: 500, color: "#fff", fontFamily: "var(--font-display)" }}>
            Sign in
          </h1>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p style={{ marginTop: 24, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,.3)" }}>
          Masar Emaar CMS · Authorised access only
        </p>
      </div>
    </div>
  );
}
