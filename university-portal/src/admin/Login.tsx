import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export default function AdminLogin() {
  const [form, setForm]       = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState("");
  const navigate              = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.username === ADMIN_USERNAME && form.password === ADMIN_PASSWORD) {
      localStorage.setItem("ums_role",  "admin");
      localStorage.setItem("ums_token", "admin-session");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--neu-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      {/* Back link */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute", top: "1.5rem", left: "1.5rem",
          display: "flex", alignItems: "center", gap: "6px",
          background: "none", border: "none", cursor: "pointer",
          fontSize: "0.82rem", color: "var(--neu-muted)",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--neu-text)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--neu-muted)")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back to Home
      </button>

      {/* Card */}
      <div
        style={{
          background: "var(--neu-bg)",
          borderRadius: "24px",
          boxShadow: "9px 9px 16px #bebebe, -9px -9px 16px #ffffff",
          padding: "3rem 3.5rem",
          width: "100%", maxWidth: "420px",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "1.75rem",
        }}
      >
        {/* Icon */}
        <div style={{
          width: "72px", height: "72px", borderRadius: "18px",
          background: "var(--neu-bg)",
          boxShadow: "inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
            stroke="#e05c5c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            <circle cx="12" cy="16" r="1" fill="#e05c5c" stroke="none"/>
          </svg>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--neu-text)" }}>
            Administration
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--neu-muted)", marginTop: "4px" }}>
            Restricted access — authorised personnel only
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", width: "100%", background: "linear-gradient(to right, transparent, #bebebe, transparent)" }} />

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Username */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--neu-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Username
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--neu-muted)", pointerEvents: "none" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Enter username"
                value={form.username}
                onChange={handleChange}
                className="neu-input"
                style={{ paddingLeft: "2.75rem" }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--neu-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--neu-muted)", pointerEvents: "none" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                name="password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                className="neu-input"
                style={{ paddingLeft: "2.75rem", paddingRight: "3rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--neu-muted)" }}
                aria-label="Toggle password"
              >
                {showPass ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: "10px 14px", borderRadius: "10px",
              background: "rgba(224,92,92,0.1)",
              boxShadow: "inset 3px 3px 6px #d4b4b4, inset -3px -3px 6px #ffffff",
              fontSize: "0.82rem", color: "#c0392b", fontWeight: 500,
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            style={{
              padding: "0.85rem",
              borderRadius: "12px",
              border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #e05c5c, #f07070)",
              boxShadow: "6px 6px 14px #d4b0b0, -4px -4px 10px #ffffff",
              fontSize: "0.9rem", fontWeight: 700, color: "#fff",
              marginTop: "0.25rem",
              transition: "filter 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
          >
            Sign In
          </button>
        </form>
      </div>

      <p style={{ fontSize: "0.72rem", color: "var(--neu-muted)", marginTop: "2rem", opacity: 0.6 }}>
        © 2026 Namal University Mianwali
      </p>
    </main>
  );
}
