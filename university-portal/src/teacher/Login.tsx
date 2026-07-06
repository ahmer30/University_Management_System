import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TeacherLogin() {
  const [showPass, setShowPass]   = useState(false);
  const [remember, setRemember]   = useState(false);
  const [form, setForm]           = useState({ email: "", password: "" });
  const navigate                  = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/teacher/dashboard");
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
            {/* Teacher / chalkboard SVG */}
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--neu-accent2)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
              <path d="M9 9h6M9 12h4" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold" style={{ color: "var(--neu-text)" }}>
              Teacher Portal
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--neu-muted)" }}>
              University Management System
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="neu-divider w-full" />

        {/* Role badge */}
        <div
          className="flex flex-row items-center gap-2 px-4 py-2"
          style={{
            borderRadius: "999px",
            background: "var(--neu-bg)",
            boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="var(--neu-accent2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          <span className="text-xs font-bold tracking-widest" style={{ color: "var(--neu-accent2)" }}>
            FACULTY ACCESS
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="teacher-email"
              className="text-sm font-semibold tracking-wide"
              style={{ color: "var(--neu-muted)" }}
            >
              FACULTY EMAIL
            </label>
            <div className="relative">
              <span
                className="absolute left-[0.875rem] top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--neu-muted)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                id="teacher-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@university.edu"
                value={form.email}
                onChange={handleChange}
                className="neu-input"
                style={{ paddingLeft: "2.75rem" }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="teacher-pass"
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
                id="teacher-pass"
                name="password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="neu-input"
                style={{ paddingLeft: "2.75rem", paddingRight: "3rem" }}
              />
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
                    stroke="var(--neu-accent2)" strokeWidth="2.5"
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
              style={{ color: "var(--neu-accent2)", background: "none", border: "none", cursor: "pointer" }}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button type="submit" className="neu-btn-green">
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="neu-divider w-full" />

        {/* Footer note */}
        <p className="text-xs text-center" style={{ color: "var(--neu-muted)" }}>
          Are you a student?{" "}
          <a
            href="/student/login"
            className="font-semibold transition-opacity hover:opacity-70"
            style={{ color: "var(--neu-accent)" }}
          >
            Student Portal →
          </a>
        </p>
      </div>
    </main>
  );
}
