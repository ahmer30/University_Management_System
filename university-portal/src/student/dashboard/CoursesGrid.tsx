import { courses } from "../data";
import { IconChevronRight } from "./icons";

type Course = typeof courses[0];

interface CoursesGridProps {
  onCourseClick?: (courseId: number) => void;
}

const SH_OUT   = "9px 9px 16px #bebebe, -9px -9px 16px #ffffff";
const SH_HOVER = "12px 12px 20px #bebebe, -12px -12px 20px #ffffff";
const SH_IN_SM = "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff";
const SH_BTN   = "5px 5px 10px #bebebe, -5px -5px 10px #ffffff";
const SH_BTN_P = "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff";

export default function CoursesGrid({ onCourseClick }: CoursesGridProps) {
  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);

  return (
    <section>
      {/* Header row */}
      <div
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          marginBottom:   "1.25rem",
          flexWrap:       "wrap",
          gap:            "0.5rem",
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--neu-text)" }}>
            Current Courses
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--neu-muted)", marginTop: "3px" }}>
            Fall 2026 &nbsp;·&nbsp; {courses.length} courses &nbsp;·&nbsp; {totalCredits} credits
          </p>
        </div>
      </div>

      {/* Stacked list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {courses.map((course) => (
          <CourseRow key={course.id} course={course} onClick={onCourseClick} />
        ))}
      </div>
    </section>
  );
}

function CourseRow({ course, onClick }: { course: Course; onClick?: (id: number) => void }) {
  return (
    <article
      style={{
        background:     "var(--neu-bg)",
        borderRadius:   "18px",
        boxShadow:      SH_OUT,
        padding:        "1.1rem 1.5rem",
        display:        "flex",
        alignItems:     "center",
        gap:            "1.25rem",
        cursor:         "pointer",
        transition:     "box-shadow 0.2s ease, transform 0.2s ease",
        borderLeft:     `4px solid ${course.color}`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = SH_HOVER;
        (e.currentTarget as HTMLElement).style.transform = "translateX(3px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = SH_OUT;
        (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
      }}
      onClick={() => onClick?.(course.id)}
    >
      {/* Color dot / index icon */}
      <div
        style={{
          width:          "44px",
          height:         "44px",
          borderRadius:   "14px",
          background:     "var(--neu-bg)",
          boxShadow:      SH_IN_SM,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          flexShrink:     0,
        }}
      >
        <span style={{ fontSize: "0.72rem", fontWeight: 800, color: course.color, letterSpacing: "0.3px" }}>
          {course.code.split("-")[0]}
        </span>
      </div>

      {/* Main info — takes up remaining space */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Code badge + title on same line */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <span
            style={{
              fontSize:      "0.72rem",
              fontWeight:    800,
              padding:       "2px 10px",
              borderRadius:  "999px",
              background:    "var(--neu-bg)",
              boxShadow:     SH_IN_SM,
              color:         course.color,
              letterSpacing: "0.4px",
              flexShrink:    0,
            }}
          >
            {course.code}
          </span>
          <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--neu-text)", lineHeight: 1.2 }}>
            {course.title}
          </p>
        </div>

        {/* Instructor + schedule on next line */}
        <div
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        "1.25rem",
            marginTop:  "6px",
            flexWrap:   "wrap",
          }}
        >
          <span style={{ fontSize: "0.86rem", color: "var(--neu-muted)" }}>
            👨‍🏫 {course.instructor}
          </span>
          <span style={{ fontSize: "0.84rem", color: "var(--neu-muted)" }}>
            🕐 {course.schedule}
          </span>
          <span style={{ fontSize: "0.82rem", color: "var(--neu-muted)" }}>
            📍 {course.room}
          </span>
        </div>
      </div>

      {/* Right side — credits pill + open button */}
      <div
        style={{
          display:    "flex",
          alignItems: "center",
          gap:        "0.75rem",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize:     "0.78rem",
            fontWeight:   600,
            padding:      "4px 12px",
            borderRadius: "999px",
            background:   "var(--neu-bg)",
            boxShadow:    SH_IN_SM,
            color:        "var(--neu-muted)",
            whiteSpace:   "nowrap",
          }}
        >
          {course.credits} cr.
        </span>

        <button
          onClick={(e) => { e.stopPropagation(); onClick?.(course.id); }}
          style={{
            display:      "flex",
            alignItems:   "center",
            gap:          "4px",
            padding:      "8px 16px",
            borderRadius: "12px",
            border:       "none",
            cursor:       "pointer",
            background:   "var(--neu-bg)",
            boxShadow:    SH_BTN,
            fontSize:     "0.82rem",
            fontWeight:   600,
            color:        course.color,
            transition:   "box-shadow 0.15s ease, transform 0.15s ease",
            whiteSpace:   "nowrap",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = SH_BTN_P)}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = SH_BTN)}
          onMouseDown={(e)  => (e.currentTarget.style.transform  = "scale(0.97)")}
          onMouseUp={(e)    => (e.currentTarget.style.transform  = "scale(1)")}
        >
          Open <IconChevronRight size={14} color={course.color} />
        </button>
      </div>
    </article>
  );
}
