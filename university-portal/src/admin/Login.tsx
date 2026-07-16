import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SH_OUT   = "9px 9px 16px #bebebe, -9px -9px 16px #ffffff";
const SH_IN_SM = "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff";

export default function AdminLogin() {
  const [form,    setForm]    = useState({ username: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass,setShowPass]= useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) {
      setError("Please enter username and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Simple credential check — replace with API call when backend is ready
      if (form.username === "admin" && form.password === "admin123") {
        localStorage.setItem("ums_admin", "true");
        navigate("/admin/dashboard");
      } else {
        setError("Invalid username or password.");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--neu-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {/* Back link */}
      <button
        onClick={() => navigate("/")}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: "none", border: "none", cursor: "pointer",
          fontSize: "0.82rem", color: "var(--neu-muted)",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--neu-text)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--neu-muted)")}
      >
        ← Back to main site
      </button>

      {/* Card */}
      <div
        style={{
          background: "var(--neu-bg)",
          borderRadius: "24px",
          boxShadow: SH_OUT,
          padding: "3.5rem",
          width: "100%",
          maxWidth: "440px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.75rem",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "78px", height: "78px", borderRadius: "20px",
            background: "var(--neu-bg)", boxShadow: SH_IN_SM,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
            stroke="#e05c5c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--neu-text)" }}>
            Admin Portal
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--neu-muted)", marginTop: "4px" }}>
            Namal University Management System
          </p>
        </div>

        {/* Warning badge */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "7px 16px", borderRadius: "999px",
            background: "var(--neu-bg)", boxShadow: SH_IN_SM,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="#e05c5c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#e05c5c", letterSpacing: "0.5px" }}>
            RESTRICTED ACCESS
          </span>
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
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--neu-muted)", pointerEvents: "none" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </span>
              <input
                type="text"
                placeholder="admin"
                value={form.username}
                onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
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
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--neu-muted)", pointerEvents: "none" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                className="neu-input"
                style={{ paddingLeft: "2.75rem", paddingRight: "3rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--neu-muted)" }}
              >
                {showPass
                  ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(224,92,92,0.1)", boxShadow: SH_IN_SM, fontSize: "0.82rem", color: "#c0392b", fontWeight: 500 }}>
              ⚠ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "0.25rem",
              padding: "0.85rem",
              borderRadius: "14px",
              border: "none", cursor: loading ? "not-allowed" : "pointer",
              background: "linear-gradient(135deg, #e05c5c, #e87070)",
              boxShadow: "6px 6px 14px #d4b4b4, -4px -4px 10px #ffffff",
              fontSize: "0.92rem", fontWeight: 700, color: "#fff",
              transition: "filter 0.15s ease",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.filter = "brightness(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
          >
            {loading ? "Signing in…" : "Sign In to Admin"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ height: "1px", width: "100%", background: "linear-gradient(to right, transparent, #bebebe, transparent)" }} />

        <p style={{ fontSize: "0.75rem", color: "var(--neu-muted)", textAlign: "center" }}>
          This portal is restricted to university administrators only.
        </p>
      </div>
    </main>
  );
}
