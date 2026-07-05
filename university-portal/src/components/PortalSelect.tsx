import { useNavigate } from "react-router-dom";

export default function PortalSelect() {
  const navigate = useNavigate();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center gap-10 px-4 py-12"
      style={{ backgroundColor: "var(--neu-bg)" }}
    >
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-3">
        <div
          className="neu-icon-box w-24 h-24"
          style={{ borderRadius: "var(--neu-radius-md)" }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="var(--neu-accent)" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold" style={{ color: "var(--neu-text)" }}>
          University Management System
        </h1>
        <p className="text-sm" style={{ color: "var(--neu-muted)" }}>
          Select your portal to continue
        </p>
      </div>

      {/* Portal cards */}
      <div className="flex flex-row gap-10 justify-center">
        {/* Student card */}
        <button
          onClick={() => navigate("/student/login")}
          className="neu-card flex flex-col items-center justify-center gap-5 cursor-pointer transition-all hover:scale-[1.02] group"
          style={{
            borderRadius: "var(--neu-radius-lg)",
            width: "260px",
            height: "260px",
            flexShrink: 0,
            padding: "2rem",
          }}
        >
          <div
            className="neu-icon-box w-16 h-16 transition-all group-hover:scale-110"
            style={{ borderRadius: "var(--neu-radius-md)" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="var(--neu-accent)" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg" style={{ color: "var(--neu-text)" }}>Student</p>
            <p className="text-xs mt-1" style={{ color: "var(--neu-muted)" }}>
              Courses, grades & schedule
            </p>
          </div>
          <span
            className="text-xs font-semibold tracking-widest px-4 py-1.5 rounded-full"
            style={{
              color: "var(--neu-accent)",
              boxShadow: "inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff",
              background: "var(--neu-bg)",
              whiteSpace: "nowrap",
            }}
          >
            STUDENT PORTAL
          </span>
        </button>

        {/* Teacher card */}
        <button
          onClick={() => navigate("/teacher/login")}
          className="neu-card flex flex-col items-center justify-center gap-5 cursor-pointer transition-all hover:scale-[1.02] group"
          style={{
            borderRadius: "var(--neu-radius-lg)",
            width: "260px",
            height: "260px",
            flexShrink: 0,
            padding: "2rem",
          }}
        >
          <div
            className="neu-icon-box w-16 h-16 transition-all group-hover:scale-110"
            style={{ borderRadius: "var(--neu-radius-md)" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="var(--neu-accent2)" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
              <path d="M9 9h6M9 12h4" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg" style={{ color: "var(--neu-text)" }}>Teacher</p>
            <p className="text-xs mt-1" style={{ color: "var(--neu-muted)" }}>
              Classes, grades & students
            </p>
          </div>
          <span
            className="text-xs font-semibold tracking-widest px-4 py-1.5 rounded-full"
            style={{
              color: "var(--neu-accent2)",
              boxShadow: "inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff",
              background: "var(--neu-bg)",
              whiteSpace: "nowrap",
            }}
          >
            FACULTY PORTAL
          </span>
        </button>
      </div>

      <p className="text-xs" style={{ color: "var(--neu-muted)" }}>
        © 2026 University Management System
      </p>
    </main>
  );
}
