import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentLogin() {
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [form, setForm] = useState({ id: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to dashboard (auth logic goes here later)
    navigate("/student/dashboard");
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: "var(--neu-bg)" }}
    >
      {/* Outer card */}
      <div
        className="neu-card w-full max-w-lg flex flex-col items-center gap-6"
        style={{
          borderRadius: "var(--neu-radius-lg)",
          padding: "3.5rem 3.5rem",
        }}
      >
        {/* Logo / icon */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="neu-icon-box w-20 h-20"
            style={{ borderRadius: "var(--neu-radius-md)" }}
          >
            {/* Graduation cap SVG */}
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--neu-accent)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold" style={{ color: "var(--neu-text)" }}>
              Student Portal
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--neu-muted)" }}>
              University Management System
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="neu-divider w-full" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          {/* Student ID */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="student-id"
              className="text-sm font-semibold tracking-wide"
              style={{ color: "var(--neu-muted)" }}
            >
              STUDENT ID
            </label>
            <div className="relative">
              {/* inset icon */}
              <span
                className="absolute left-[0.875rem] top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--neu-muted)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                id="student-id"
                name="id"
                type="text"
                autoComplete="username"
                placeholder="e.g. 2021-CS-0042"
                value={form.id}
                onChange={handleChange}
                className="neu-input"
                style={{ paddingLeft: "2.75rem" }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="student-pass"
              className="text-sm font-semibold tracking-wide"
              style={{ color: "var(--neu-muted)" }}
            >
              PASSWORD
            </label>
            <div className="relative">
              <span
                className="absolute left-[0.875rem] top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--neu-muted)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="student-pass"
                name="password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="neu-input"
                style={{ paddingLeft: "2.75rem", paddingRight: "3rem" }}
              />
              {/* Show/hide toggle */}
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--neu-muted)", background: "none", border: "none", cursor: "pointer" }}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between">
            {/* Neumorphic checkbox */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <button
                type="button"
                onClick={() => setRemember((v) => !v)}
                aria-checked={remember}
                role="checkbox"
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "6px",
                  background: "var(--neu-bg)",
                  boxShadow: remember
                    ? "inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff"
                    : "3px 3px 6px #bebebe, -3px -3px 6px #ffffff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "box-shadow 0.2s ease",
                  flexShrink: 0,
                }}
              >
                {remember && (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                    stroke="var(--neu-accent)" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2,6 5,9 10,3" />
                  </svg>
                )}
              </button>
              <span className="text-xs" style={{ color: "var(--neu-muted)" }}>Remember me</span>
            </label>

            <button
              type="button"
              className="text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--neu-accent)", background: "none", border: "none", cursor: "pointer" }}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button type="submit" className="neu-btn-accent">
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="neu-divider w-full" />

        {/* Footer note */}
        <p className="text-xs text-center" style={{ color: "var(--neu-muted)" }}>
          Are you a teacher?{" "}
          <a
            href="/teacher/login"
            className="font-semibold transition-opacity hover:opacity-70"
            style={{ color: "var(--neu-accent)" }}
          >
            Teacher Portal →
          </a>
        </p>
      </div>
    </main>
  );
}
