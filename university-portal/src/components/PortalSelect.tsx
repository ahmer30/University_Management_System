import { useNavigate } from "react-router-dom";

const SH_OUT   = "9px 9px 16px #bebebe, -9px -9px 16px #ffffff";
const SH_HOVER = "12px 12px 22px #bebebe, -12px -12px 22px #ffffff";
const SH_IN_SM = "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff";

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--neu-accent)"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5"/>
      </svg>
    ),
    title: "Student Portal",
    desc:  "Students can view their enrolled courses, track grades, check attendance, and manage their academic schedule — all in one place.",
    color: "var(--neu-accent)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#48c97e"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
        <path d="M9 9h6M9 12h4"/>
      </svg>
    ),
    title: "Faculty Portal",
    desc:  "Teachers can manage their courses, create assessments (quizzes, assignments, exams), enter student marks in bulk, and post announcements.",
    color: "#48c97e",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f5a623"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 9h6M9 12h6M9 15h4"/>
      </svg>
    ),
    title: "Course Management",
    desc:  "Administrators manage the full course catalog — adding departments, assigning teachers, enrolling students, and monitoring progress.",
    color: "#f5a623",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e05c5c"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6"  y1="20" x2="6"  y2="14"/>
        <line x1="2"  y1="20" x2="22" y2="20"/>
      </svg>
    ),
    title: "Academic Analytics",
    desc:  "Track GPA trends, attendance rates, and assessment performance across all departments with clear, structured records.",
    color: "#e05c5c",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9b59b6"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Multi-Department Support",
    desc:  "Supports Computer Science, Electrical Engineering, Mathematics, and Business Administration under one unified system.",
    color: "#9b59b6",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#29b6c8"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: "Secure Access",
    desc:  "Each user type — student, teacher, and admin — has separate login credentials and role-based access so data stays protected.",
    color: "#29b6c8",
  },
];

export default function PortalSelect() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "var(--neu-bg)", minHeight: "100vh", color: "var(--neu-text)" }}>

      {/* ── Top navbar ── */}
      <nav
        style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "var(--neu-bg)",
          boxShadow: "0 4px 16px #bebebe, 0 -2px 6px #ffffff",
          padding: "0 3rem",
          height: "64px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "10px",
            background: "var(--neu-bg)", boxShadow: SH_OUT,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="var(--neu-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--neu-text)" }}>
            Namal UMS
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {[
            { label: "Student Login",  onClick: () => navigate("/student/login"),  color: "var(--neu-accent)"  },
            { label: "Faculty Login",  onClick: () => navigate("/teacher/login"),  color: "#48c97e"            },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.onClick}
              style={{
                padding: "8px 18px", borderRadius: "12px",
                border: "none", cursor: "pointer",
                background: "var(--neu-bg)", boxShadow: SH_OUT,
                fontSize: "0.82rem", fontWeight: 600, color: btn.color,
                transition: "box-shadow 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = SH_IN_SM)}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = SH_OUT)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Hero section ── */}
      <section
        style={{
          padding: "5rem 3rem 4rem",
          display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center", gap: "1.5rem",
        }}
      >
        {/* Badge */}
        <span style={{
          fontSize: "0.75rem", fontWeight: 700,
          padding: "5px 16px", borderRadius: "999px",
          background: "var(--neu-bg)", boxShadow: SH_IN_SM,
          color: "var(--neu-accent)", letterSpacing: "0.8px",
          textTransform: "uppercase",
        }}>
          Namal University Mianwali
        </span>

        <h1 style={{ fontSize: "2.8rem", fontWeight: 900, lineHeight: 1.15, maxWidth: "700px", color: "var(--neu-text)" }}>
          University Management <br />
          <span style={{ color: "var(--neu-accent)" }}>System</span>
        </h1>

        <p style={{ fontSize: "1rem", color: "var(--neu-muted)", maxWidth: "560px", lineHeight: 1.7 }}>
          A unified digital platform for students, faculty, and administration.
          Manage courses, track performance, and stay connected — all in one place.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.5rem" }}>
          <button
            onClick={() => navigate("/student/login")}
            style={{
              padding: "12px 28px", borderRadius: "14px",
              border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #6c63ff, #8b85ff)",
              boxShadow: "6px 6px 14px #a9a3e8, -4px -4px 10px #ffffff",
              fontSize: "0.9rem", fontWeight: 700, color: "#fff",
              transition: "filter 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
          >
            Student Login →
          </button>
          <button
            onClick={() => navigate("/teacher/login")}
            style={{
              padding: "12px 28px", borderRadius: "14px",
              border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #48c97e, #5dd891)",
              boxShadow: "6px 6px 14px #b3ddc5, -4px -4px 10px #ffffff",
              fontSize: "0.9rem", fontWeight: 700, color: "#fff",
              transition: "filter 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
          >
            Faculty Login →
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "2rem", marginTop: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { val: "4",   label: "Departments"       },
            { val: "20+", label: "Demo Students"     },
            { val: "8",   label: "Faculty Members"   },
            { val: "8",   label: "Active Courses"    },
          ].map((s) => (
            <div key={s.label} style={{
              background: "var(--neu-bg)", borderRadius: "16px",
              boxShadow: SH_OUT, padding: "1rem 1.5rem", textAlign: "center",
            }}>
              <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--neu-accent)", lineHeight: 1 }}>{s.val}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--neu-muted)", marginTop: "4px" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #bebebe, transparent)", margin: "0 3rem" }} />

      {/* ── Features section ── */}
      <section style={{ padding: "4rem 3rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--neu-text)" }}>
            What the system offers
          </h2>
          <p style={{ fontSize: "0.88rem", color: "var(--neu-muted)", marginTop: "6px" }}>
            Built for students, faculty, and administration at Namal University
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.25rem",
          maxWidth: "1100px", margin: "0 auto",
        }}>
          {features.map((f) => (
            <div key={f.title} style={{
              background: "var(--neu-bg)", borderRadius: "18px",
              boxShadow: SH_OUT, padding: "1.5rem",
              display: "flex", flexDirection: "column", gap: "0.75rem",
              borderTop: `3px solid ${f.color}`,
              transition: "box-shadow 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = SH_HOVER;
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = SH_OUT;
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            }}
            >
              <div style={{
                width: "50px", height: "50px", borderRadius: "14px",
                background: "var(--neu-bg)", boxShadow: SH_IN_SM,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {f.icon}
              </div>
              <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--neu-text)" }}>{f.title}</p>
              <p style={{ fontSize: "0.82rem", color: "var(--neu-muted)", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #bebebe, transparent)", margin: "0 3rem" }} />

      {/* ── About / Portal selection ── */}
      <section style={{ padding: "4rem 3rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--neu-text)", marginBottom: "0.5rem" }}>
          Choose your portal
        </h2>
        <p style={{ fontSize: "0.88rem", color: "var(--neu-muted)", marginBottom: "2.5rem" }}>
          Each role has a dedicated space tailored to their needs
        </p>

        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          {/* Student */}
          <button
            onClick={() => navigate("/student/login")}
            style={{
              width: "240px", height: "240px",
              background: "var(--neu-bg)", borderRadius: "24px",
              boxShadow: SH_OUT, border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "1rem",
              transition: "box-shadow 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = SH_HOVER;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = SH_OUT;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            <div style={{ width:"60px",height:"60px",borderRadius:"16px",background:"var(--neu-bg)",boxShadow:SH_IN_SM,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--neu-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5"/>
              </svg>
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--neu-text)" }}>Student</p>
              <p style={{ fontSize: "0.75rem", color: "var(--neu-muted)", marginTop: "3px" }}>Courses, grades & schedule</p>
            </div>
            <span style={{ fontSize:"0.7rem",fontWeight:700,padding:"3px 12px",borderRadius:"999px",background:"var(--neu-bg)",boxShadow:SH_IN_SM,color:"var(--neu-accent)",letterSpacing:"0.5px" }}>
              STUDENT PORTAL
            </span>
          </button>

          {/* Teacher */}
          <button
            onClick={() => navigate("/teacher/login")}
            style={{
              width: "240px", height: "240px",
              background: "var(--neu-bg)", borderRadius: "24px",
              boxShadow: SH_OUT, border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "1rem",
              transition: "box-shadow 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = SH_HOVER;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = SH_OUT;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            <div style={{ width:"60px",height:"60px",borderRadius:"16px",background:"var(--neu-bg)",boxShadow:SH_IN_SM,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#48c97e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <path d="M8 21h8M12 17v4"/>
                <path d="M9 9h6M9 12h4"/>
              </svg>
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--neu-text)" }}>Teacher</p>
              <p style={{ fontSize: "0.75rem", color: "var(--neu-muted)", marginTop: "3px" }}>Classes, grades & students</p>
            </div>
            <span style={{ fontSize:"0.7rem",fontWeight:700,padding:"3px 12px",borderRadius:"999px",background:"var(--neu-bg)",boxShadow:SH_IN_SM,color:"#48c97e",letterSpacing:"0.5px" }}>
              FACULTY PORTAL
            </span>
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: "1px solid #d0d0d0",
        padding: "1.5rem 3rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "0.75rem",
      }}>
        <p style={{ fontSize: "0.78rem", color: "var(--neu-muted)" }}>
          © 2026 Namal University Mianwali — University Management System
        </p>

        {/* Subtle admin link — not highlighted, easy to miss */}
        <button
          onClick={() => navigate("/admin/login")}
          style={{
            fontSize: "0.72rem", color: "var(--neu-muted)",
            background: "none", border: "none", cursor: "pointer",
            opacity: 0.5, transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
        >
          Management
        </button>
      </footer>
    </div>
  );
}
