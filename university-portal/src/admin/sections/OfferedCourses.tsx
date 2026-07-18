import { useState } from "react";
import { courses, YEARS, type CourseOffering } from "../data";
import { SH_OUT, SH_IN_SM, SH_BTN, SH_BTN_P, SectionHeader, ProgBadge, Empty } from "../components/AdminUI";

export default function OfferedCoursesSection({ offerings, onSave }: { offerings: CourseOffering[]; onSave: (d: CourseOffering[]) => void }) {
  const [activeYear, setActiveYear] = useState(YEARS[0]);
  const [expanded,   setExpanded]   = useState<string | null>(null);

  const yearOfferings = offerings.filter(o => o.year.includes(activeYear) || activeYear.includes(o.year));

  const deleteOffering = (id: string) => {
    if (!confirm("Delete this course offering?")) return;
    onSave(offerings.filter(o => o.id !== id));
  };

  return (
    <div>
      <SectionHeader title="Offered Courses" sub={`${offerings.length} total offerings across all years`} />

      {/* Year tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {YEARS.map(y => {
          const count = offerings.filter(o => o.year.includes(y) || y.includes(o.year)).length;
          return (
            <button key={y} onClick={() => setActiveYear(y)} style={{ padding: "8px 18px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", background: "var(--neu-bg)", boxShadow: activeYear === y ? SH_IN_SM : SH_BTN, color: activeYear === y ? "#6c63ff" : "var(--neu-muted)", transition: "box-shadow 0.15s,color 0.15s" }}>
              {y} <span style={{ fontSize: "0.72rem", color: "var(--neu-muted)" }}>({count})</span>
            </button>
          );
        })}
      </div>

      {yearOfferings.length === 0
        ? <Empty msg={`No course offerings created for ${activeYear} yet. Go to "Manage Offerings" to create one.`} />
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {yearOfferings.map(o => {
              const isOpen = expanded === o.id;
              const color  = courses.find(c => c.id === o.courseId)?.color ?? "#888";
              // Filter students to only show those belonging to the current active year tab
              const yearNumeric = activeYear.match(/\d{4}/)?.[0] || "";
              const yearStudents = o.students.filter(s => s.id.includes(yearNumeric));

              return (
                <div key={o.id} style={{ background: "var(--neu-bg)", borderRadius: "18px", boxShadow: SH_OUT, overflow: "hidden", borderLeft: `4px solid ${color}` }}>
                  {/* Row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.5rem" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "3px 10px", borderRadius: "999px", background: "var(--neu-bg)", boxShadow: SH_IN_SM, color, flexShrink: 0 }}>{o.courseCode}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--neu-text)" }}>{o.courseTitle}</p>
                      <p style={{ fontSize: "0.8rem", color: "var(--neu-muted)", marginTop: "2px" }}>👨‍🏫 {o.teacherName} &nbsp;·&nbsp; 👥 {yearStudents.length} students &nbsp;·&nbsp; 📅 {o.createdAt}</p>
                    </div>
                    {/* Expand */}
                    <button onClick={() => setExpanded(isOpen ? null : o.id)} style={{ padding: "6px 14px", borderRadius: "10px", border: "none", cursor: "pointer", background: "var(--neu-bg)", boxShadow: SH_BTN, fontSize: "0.78rem", fontWeight: 600, color: "var(--neu-muted)", transition: "box-shadow 0.15s" }} onMouseEnter={e => (e.currentTarget.style.boxShadow = SH_BTN_P)} onMouseLeave={e => (e.currentTarget.style.boxShadow = SH_BTN)}>
                      {isOpen ? "Hide ▲" : "View ▼"}
                    </button>
                    {/* Delete */}
                    <button onClick={() => deleteOffering(o.id)} style={{ padding: "6px 14px", borderRadius: "10px", border: "none", cursor: "pointer", background: "var(--neu-bg)", boxShadow: SH_BTN, fontSize: "0.78rem", fontWeight: 600, color: "#e05c5c", transition: "box-shadow 0.15s" }} onMouseEnter={e => (e.currentTarget.style.boxShadow = SH_BTN_P)} onMouseLeave={e => (e.currentTarget.style.boxShadow = SH_BTN)}>
                      Delete
                    </button>
                  </div>

                  {/* Student list */}
                  {isOpen && (
                    <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)", padding: "1rem 1.5rem" }}>
                      <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--neu-muted)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "10px" }}>Enrolled Students ({yearStudents.length})</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {yearStudents.length === 0
                          ? <p style={{ fontSize: "0.82rem", color: "var(--neu-muted)" }}>No students for {activeYear} in this offering.</p>
                          : yearStudents.map((s, i) => (
                            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "8px 12px", borderRadius: "10px", background: "var(--neu-bg)", boxShadow: SH_IN_SM }}>
                              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--neu-muted)", width: "24px" }}>{i + 1}</span>
                              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#6c63ff", fontFamily: "monospace", flex: 1 }}>{s.id}</span>
                              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--neu-text)", flex: 1 }}>{s.name}</span>
                              <ProgBadge p={s.program} />
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
}
