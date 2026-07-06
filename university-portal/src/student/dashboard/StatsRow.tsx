import { studentProfile, courses } from "../data";

export default function StatsRow() {
  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);

  const stats = [
    {
      label:   "CGPA",
      value:   String(studentProfile.gpa),
      sub:     "Cumulative GPA",
      color:   "var(--neu-accent)",
      big:     true,   // larger display — this is the headline number
    },
    {
      label:   "Enrolled Courses",
      value:   String(courses.length),
      sub:     studentProfile.semester,
      color:   "#48c97e",
      big:     false,
    },
    {
      label:   "Total Credits",
      value:   String(totalCredits),
      sub:     "This semester",
      color:   "#f5a623",
      big:     false,
    },
    {
      label:   "Semester",
      value:   `${studentProfile.currentSem}`,
      sub:     `Batch ${studentProfile.batchYear}`,
      color:   "#29b6c8",
      big:     false,
    },
  ];

  return (
    <div
      style={{
        display:             "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap:                 "1.25rem",
        marginBottom:        "2rem",
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background:   "var(--neu-bg)",
            borderRadius: "18px",
            boxShadow:    "9px 9px 16px #bebebe, -9px -9px 16px #ffffff",
            padding:      "1.4rem 1.5rem",
            borderTop:    `4px solid ${s.color}`,
            transition:   "box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.boxShadow =
              "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.boxShadow =
              "9px 9px 16px #bebebe, -9px -9px 16px #ffffff")
          }
        >
          <p
            style={{
              fontSize:   s.big ? "2.4rem" : "2rem",
              fontWeight: 800,
              color:      s.color,
              lineHeight: 1,
            }}
          >
            {s.value}
          </p>
          <p
            style={{
              fontSize:   "0.88rem",
              fontWeight: 600,
              color:      "var(--neu-text)",
              marginTop:  "9px",
            }}
          >
            {s.label}
          </p>
          <p style={{ fontSize: "0.78rem", color: "var(--neu-muted)", marginTop: "3px" }}>
            {s.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
