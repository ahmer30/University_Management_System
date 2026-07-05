import { courses } from "../data";
import { IconChevronRight } from "./icons";

export default function CoursesGrid() {
  return (
    <div>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--neu-text)" }}>
            Enrolled Courses
          </h2>
          <p style={{ fontSize: "0.8rem", color: "var(--neu-muted)", marginTop: "2px" }}>
            Fall 2026 — {courses.length} courses
          </p>
        </div>
        <button
          style={{
            display: "flex", alignItems: "center", gap: "4px",
            padding: "7px 14px",
            borderRadius: "10px",
            border: "none", cursor: "pointer",
            background: "var(--neu-bg)",
            boxShadow: "3px 3px 7px #bebebe, -3px -3px 7px #ffffff",
            fontSize: "0.8rem", fontWeight: 600,
            color: "var(--neu-accent)",
            transition: "box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "inset 3px 3px 7px #bebebe, inset -3px -3px 7px #ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "3px 3px 7px #bebebe, -3px -3px 7px #ffffff")}
        >
          View All <IconChevronRight size={14} />
        </button>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: typeof courses[0] }) {
  return (
    <div
      style={{
        background: "var(--neu-bg)",
        borderRadius: "18px",
        boxShadow: "6px 6px 14px #bebebe, -6px -6px 14px #ffffff",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        cursor: "pointer",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        borderTop: `3px solid ${course.color}`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "10px 10px 20px #bebebe, -10px -10px 20px #ffffff";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "6px 6px 14px #bebebe, -6px -6px 14px #ffffff";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Top row: code badge + grade */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: "0.72rem", fontWeight: 800,
            padding: "3px 10px", borderRadius: "999px",
            background: "var(--neu-bg)",
            boxShadow: "inset 2px 2px 5px #bebebe, inset -2px -2px 5px #ffffff",
            color: course.color,
            letterSpacing: "0.5px",
          }}
        >
          {course.code}
        </span>
        <span
          style={{
            fontSize: "0.8rem", fontWeight: 700,
            color: course.color,
          }}
        >
          {course.grade}
        </span>
      </div>

      {/* Title + instructor */}
      <div>
        <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--neu-text)", lineHeight: 1.3 }}>
          {course.title}
        </p>
        <p style={{ fontSize: "0.78rem", color: "var(--neu-muted)", marginTop: "4px" }}>
          {course.instructor}
        </p>
        <p style={{ fontSize: "0.74rem", color: "var(--neu-muted)", marginTop: "2px" }}>
          🕐 {course.schedule}
        </p>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--neu-muted)", marginBottom: "6px" }}>
          <span>Progress</span>
          <span style={{ fontWeight: 600 }}>{course.progress}%</span>
        </div>
        <div
          style={{
            height: "7px", borderRadius: "999px",
            background: "var(--neu-bg)",
            boxShadow: "inset 2px 2px 4px #bebebe, inset -2px -2px 4px #ffffff",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${course.progress}%`,
              borderRadius: "999px",
              background: course.color,
              transition: "width 0.8s ease",
            }}
          />
        </div>
      </div>

      {/* Credits + Open button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--neu-muted)" }}>
          {course.credits} credits
        </span>
        <button
          style={{
            display: "flex", alignItems: "center", gap: "4px",
            padding: "6px 14px",
            borderRadius: "10px",
            border: "none", cursor: "pointer",
            background: "var(--neu-bg)",
            boxShadow: "3px 3px 7px #bebebe, -3px -3px 7px #ffffff",
            fontSize: "0.78rem", fontWeight: 600,
            color: course.color,
            transition: "box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "inset 3px 3px 7px #bebebe, inset -3px -3px 7px #ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "3px 3px 7px #bebebe, -3px -3px 7px #ffffff")}
        >
          Open <IconChevronRight size={13} color={course.color} />
        </button>
      </div>
    </div>
  );
}
