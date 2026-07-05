import { studentProfile, courses } from "../data";

const stats = [
  { label: "Current GPA",     value: String(studentProfile.gpa), sub: "This semester",   color: "var(--neu-accent)" },
  { label: "Enrolled Courses",value: String(courses.length),     sub: "Fall 2026",        color: "#48c97e" },
  { label: "Total Credits",   value: String(courses.reduce((s, c) => s + c.credits, 0)), sub: "This semester", color: "#f5a623" },
  { label: "Avg Progress",    value: `${Math.round(courses.reduce((s, c) => s + c.progress, 0) / courses.length)}%`, sub: "Across courses", color: "#29b6c8" },
];

export default function StatsRow() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem",
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: "var(--neu-bg)",
            borderRadius: "16px",
            boxShadow: "6px 6px 14px #bebebe, -6px -6px 14px #ffffff",
            padding: "1.25rem 1.1rem",
            borderTop: `3px solid ${s.color}`,
          }}
        >
          <p style={{ fontSize: "1.7rem", fontWeight: 800, color: s.color, lineHeight: 1 }}>
            {s.value}
          </p>
          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--neu-text)", marginTop: "6px" }}>
            {s.label}
          </p>
          <p style={{ fontSize: "0.72rem", color: "var(--neu-muted)", marginTop: "2px" }}>
            {s.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
