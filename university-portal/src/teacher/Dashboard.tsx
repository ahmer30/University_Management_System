import { useState } from "react";
import TeacherSidebar from "./dashboard/Sidebar";
import TeacherHeader  from "./dashboard/Header";
import AssessmentManager from "./dashboard/AssessmentManager";
import { teacherCourses, teacherProfile, assessmentInstances } from "./data";
import { IconChevronRight } from "./dashboard/icons";

const SH_OUT   = "9px 9px 16px #bebebe, -9px -9px 16px #ffffff";
const SH_HOVER = "12px 12px 20px #bebebe, -12px -12px 20px #ffffff";
const SH_IN_SM = "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff";
const SH_BTN   = "5px 5px 10px #bebebe, -5px -5px 10px #ffffff";
const SH_BTN_P = "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff";

export default function TeacherDashboard() {
  const [activeSection,    setActiveSection]    = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  // When a course is clicked from any section, open its assessment manager
  const openCourse = (id: number) => {
    setSelectedCourseId(id);
    setActiveSection("assessments");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--neu-bg)" }}>
      <TeacherSidebar
        active={activeSection}
        onSelect={(id) => { setActiveSection(id); setSelectedCourseId(null); }}
        collapsed={sidebarCollapsed}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TeacherHeader
          onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
          activeSection={activeSection}
        />

        <main style={{ flex: 1, overflowY: "auto", padding: "2rem 2rem 3rem" }}>

          {/* ════ DASHBOARD ════ */}
          {activeSection === "dashboard" && (
            <DashboardHome onOpenCourse={openCourse} />
          )}

          {/* ════ ASSESSMENTS — course list or detail ════ */}
          {activeSection === "assessments" && !selectedCourseId && (
            <CourseList title="Select a Course" onOpen={openCourse} />
          )}
          {activeSection === "assessments" && selectedCourseId && (
            <AssessmentManager
              courseId={selectedCourseId}
              onBack={() => setSelectedCourseId(null)}
            />
          )}

          {/* ════ MY COURSES ════ */}
          {activeSection === "courses" && (
            <CourseList title="My Courses" onOpen={openCourse} />
          )}

          {/* ════ PLACEHOLDERS ════ */}
          {["students", "settings"].includes(activeSection) && <ComingSoon />}
        </main>
      </div>
    </div>
  );
}

// ── Dashboard home ────────────────────────────────────────────────────────────
function DashboardHome({ onOpenCourse }: { onOpenCourse: (id: number) => void }) {
  const t    = teacherProfile;
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  // Summary numbers
  const totalStudents  = teacherCourses.reduce((s, c) => s + c.studentCount, 0);
  const pendingResults = assessmentInstances.reduce((acc, inst) => {
    return acc + Object.values(inst.results).filter((v) => v === null).length;
  }, 0);

  return (
    <div>
      {/* Welcome banner */}
      <div
        style={{
          background: "var(--neu-bg)", borderRadius: "20px",
          boxShadow: SH_OUT, padding: "1.75rem 2rem",
          marginBottom: "2rem",
          borderLeft: "4px solid var(--neu-accent2)",
        }}
      >
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--neu-text)" }}>
          {greet}, {t.name} 👋
        </h2>
        <p style={{ fontSize: "0.88rem", color: "var(--neu-muted)", marginTop: "4px" }}>
          {t.designation} · {t.department} · Fall 2026
        </p>
        <p style={{ fontSize: "0.82rem", color: "var(--neu-muted)", marginTop: "2px" }}>
          🏢 {t.office} &nbsp;·&nbsp; 🕐 {t.officeHours}
        </p>
      </div>

      {/* Quick stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        {[
          { label: "Courses Teaching", value: String(teacherCourses.length), color: "var(--neu-accent2)" },
          { label: "Total Students",   value: String(totalStudents),          color: "#6c63ff"           },
          { label: "Pending Results",  value: String(pendingResults),         color: pendingResults > 0 ? "#f5a623" : "#48c97e" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--neu-bg)", borderRadius: "18px",
              boxShadow: SH_OUT, padding: "1.4rem 1.5rem",
              borderTop: `3px solid ${s.color}`,
            }}
          >
            <p style={{ fontSize: "2.2rem", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--neu-text)", marginTop: "8px" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Course cards */}
      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--neu-text)", marginBottom: "1rem" }}>
        Your Courses This Semester
      </h3>
      <CourseList title="" onOpen={onOpenCourse} />
    </div>
  );
}

// ── Reusable course list ──────────────────────────────────────────────────────
function CourseList({ title, onOpen }: { title: string; onOpen: (id: number) => void }) {
  return (
    <div>
      {title && (
        <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--neu-text)", marginBottom: "1.25rem" }}>
          {title}
        </h2>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {teacherCourses.map((course) => {
          const assessCount = assessmentInstances.filter((a) => a.courseId === course.id).length;
          return (
            <div
              key={course.id}
              style={{
                background: "var(--neu-bg)", borderRadius: "18px",
                boxShadow: SH_OUT, padding: "1.25rem 1.5rem",
                display: "flex", alignItems: "center", gap: "1.25rem",
                borderLeft: `4px solid ${course.color}`,
                cursor: "pointer", transition: "box-shadow 0.2s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = SH_HOVER;
                (e.currentTarget as HTMLElement).style.transform = "translateX(3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = SH_OUT;
                (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
              }}
              onClick={() => onOpen(course.id)}
            >
              {/* Icon box */}
              <div style={{
                width: "46px", height: "46px", borderRadius: "14px",
                background: "var(--neu-bg)", boxShadow: SH_IN_SM,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: course.color }}>
                  {course.code.split("-")[0]}
                </span>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{
                    fontSize: "0.72rem", fontWeight: 800, padding: "2px 10px",
                    borderRadius: "999px", background: "var(--neu-bg)",
                    boxShadow: SH_IN_SM, color: course.color, letterSpacing: "0.4px",
                  }}>
                    {course.code}
                  </span>
                  <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--neu-text)" }}>
                    {course.title}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "1.25rem", marginTop: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.84rem", color: "var(--neu-muted)" }}>🕐 {course.schedule}</span>
                  <span style={{ fontSize: "0.84rem", color: "var(--neu-muted)" }}>📍 {course.room}</span>
                </div>
              </div>

              {/* Right stats */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                <div style={{
                  background: "var(--neu-bg)", borderRadius: "12px",
                  boxShadow: SH_IN_SM, padding: "8px 14px", textAlign: "center",
                }}>
                  <p style={{ fontSize: "1.2rem", fontWeight: 800, color: "#6c63ff", lineHeight: 1 }}>
                    {course.studentCount}
                  </p>
                  <p style={{ fontSize: "0.68rem", color: "var(--neu-muted)", marginTop: "2px" }}>students</p>
                </div>
                <div style={{
                  background: "var(--neu-bg)", borderRadius: "12px",
                  boxShadow: SH_IN_SM, padding: "8px 14px", textAlign: "center",
                }}>
                  <p style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--neu-accent2)", lineHeight: 1 }}>
                    {assessCount}
                  </p>
                  <p style={{ fontSize: "0.68rem", color: "var(--neu-muted)", marginTop: "2px" }}>assessments</p>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); onOpen(course.id); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "4px",
                    padding: "8px 16px", borderRadius: "12px",
                    border: "none", cursor: "pointer", background: "var(--neu-bg)",
                    boxShadow: SH_BTN, fontSize: "0.82rem", fontWeight: 600,
                    color: course.color, transition: "box-shadow 0.15s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = SH_BTN_P)}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = SH_BTN)}
                >
                  Manage <IconChevronRight size={14} color={course.color} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Coming Soon ───────────────────────────────────────────────────────────────
function ComingSoon() {
  return (
    <div style={{
      background: "var(--neu-bg)", borderRadius: "20px",
      boxShadow: SH_OUT, padding: "4rem 2rem",
      textAlign: "center", color: "var(--neu-muted)",
    }}>
      <p style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🚧</p>
      <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--neu-text)", marginBottom: "6px" }}>Coming Soon</p>
      <p style={{ fontSize: "0.875rem" }}>This section is being built out.</p>
    </div>
  );
}
