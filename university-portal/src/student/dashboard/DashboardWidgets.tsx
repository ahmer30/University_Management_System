import { announcements, upcomingAssessments, courses } from "../data";

// Shadow tokens — matches design system spec
const SH_OUT   = "9px 9px 16px #bebebe, -9px -9px 16px #ffffff";
const SH_IN_SM = "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff";

const TYPE_COLOR: Record<string, string> = {
  Exam:       "#e05c5c",
  Assignment: "#f5a623",
  Quiz:       "#6c63ff",
  Project:    "#9b59b6",
  Lab:        "#29b6c8",
};

// ─── Upcoming Deadlines widget ────────────────────────────────────────────────
export function DeadlinesWidget() {
  return (
    <div
      style={{
        background:   "var(--neu-bg)",
        borderRadius: "20px",
        boxShadow:    SH_OUT,
        padding:      "1.4rem",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.1rem" }}>
        <div
          style={{
            width: "32px", height: "32px",
            borderRadius: "10px",
            background: "var(--neu-bg)",
            boxShadow: SH_IN_SM,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem",
          }}
        >
          📅
        </div>
        <h3 style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--neu-text)" }}>
          Upcoming Deadlines
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
        {upcomingAssessments.map((a, i) => {
          const course   = courses.find((c) => c.code === a.courseCode);
          const dotColor = TYPE_COLOR[a.type] ?? "#888";

          return (
            <div
              key={i}
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          "10px",
                padding:      "10px 12px",
                borderRadius: "14px",
                background:   "var(--neu-bg)",
                boxShadow:    SH_IN_SM,
              }}
            >
              {/* color dot for type */}
              <span
                style={{
                  width: "9px", height: "9px",
                  borderRadius: "50%",
                  background: dotColor,
                  flexShrink: 0,
                }}
              />

              {/* title + meta */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: "0.8rem", fontWeight: 600,
                  color: "var(--neu-text)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {a.title}
                </p>
                <p style={{ fontSize: "0.7rem", color: "var(--neu-muted)", marginTop: "1px" }}>
                  {a.courseCode} · {a.type}
                </p>
              </div>

              {/* due date + weight */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.7rem", fontWeight: 700,
                    padding: "2px 9px", borderRadius: "999px",
                    background: `${course?.color ?? "#888"}1a`,
                    color: course?.color ?? "#888",
                  }}
                >
                  {a.dueDate}
                </span>
                <p style={{ fontSize: "0.67rem", color: "var(--neu-muted)", marginTop: "2px" }}>
                  {a.weightage}% weight
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Announcements Feed widget ────────────────────────────────────────────────
export function AnnouncementsWidget() {
  // pinned first, then rest
  const ordered = [
    ...announcements.filter((a) => a.pinned),
    ...announcements.filter((a) => !a.pinned),
  ];

  return (
    <div
      style={{
        background:   "var(--neu-bg)",
        borderRadius: "20px",
        boxShadow:    SH_OUT,
        padding:      "1.4rem",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.1rem" }}>
        <div
          style={{
            width: "32px", height: "32px",
            borderRadius: "10px",
            background: "var(--neu-bg)",
            boxShadow: SH_IN_SM,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem",
          }}
        >
          📢
        </div>
        <h3 style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--neu-text)" }}>
          Announcements
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
        {ordered.map((a, i) => {
          const course = courses.find((c) => c.code === a.courseCode);
          return (
            <div
              key={i}
              style={{
                padding:      "11px 13px",
                borderRadius: "14px",
                background:   "var(--neu-bg)",
                /* recessed — from the spec */
                boxShadow:    SH_IN_SM,
                /* left accent line using a gradient border trick */
                borderLeft:   `3px solid ${course?.color ?? "#aaa"}`,
              }}
            >
              {/* course code + pin badge */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <span
                  style={{
                    fontSize: "0.68rem", fontWeight: 800,
                    color: course?.color ?? "#888",
                    letterSpacing: "0.4px",
                    textTransform: "uppercase",
                  }}
                >
                  {a.courseCode}
                </span>
                {a.pinned && (
                  <span style={{ fontSize: "0.64rem", color: "#f5a623", fontWeight: 700 }}>
                    📌 PINNED
                  </span>
                )}
              </div>

              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--neu-text)" }}>
                {a.title}
              </p>
              <p style={{ fontSize: "0.74rem", color: "var(--neu-muted)", marginTop: "3px", lineHeight: 1.45 }}>
                {a.body}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
