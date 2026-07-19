import { useState } from "react";
import { deleteEnrollment } from "../../api";
import { SH_OUT, SH_IN_SM, SH_BTN, SH_BTN_P, SectionHeader, ProgBadge, Empty } from "../components/AdminUI";

const DEPT_COLORS: Record<string, string> = {
  "Computer Science":       "#6c63ff",
  "Electrical Engineering": "#e05c5c",
  "Mathematics":            "#48c97e",
  "Business Administration":"#f5a623",
};

export default function OfferedCoursesSection({ offerings, onRefresh }: {
  offerings: any[];   // DB shape: [{ course_id, course_code, course_title, credits, teacher_name, students: [...] }]
  onRefresh: () => Promise<void>;
}) {
  const [expanded,    setExpanded]    = useState<number | null>(null);
  const [activeYear,  setActiveYear]  = useState<string>("all");

  // Derive all unique batch years across all offerings
  const allYears: string[] = [...new Set(
    offerings.flatMap(o => o.students.map((s: any) => String(s.batch_year)))
  )].sort((a, b) => Number(b) - Number(a));

  // Filter offerings that have at least one student in the selected year
  const visibleOfferings = activeYear === "all"
    ? offerings
    : offerings.filter(o => o.students.some((s: any) => String(s.batch_year) === activeYear));

  const handleDeleteEnrollment = async (enrollment_id: number) => {
    if (!confirm("Remove this student from the course?")) return;
    try {
      await deleteEnrollment(enrollment_id);
      await onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <SectionHeader title="Offered Courses" sub={`${offerings.length} courses with active enrollments`} />

      {/* Year filter tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button onClick={() => setActiveYear("all")}
          style={{ padding: "8px 18px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", background: "var(--neu-bg)", boxShadow: activeYear === "all" ? SH_IN_SM : SH_BTN, color: activeYear === "all" ? "#6c63ff" : "var(--neu-muted)", transition: "box-shadow 0.15s,color 0.15s" }}>
          All <span style={{ fontSize: "0.72rem", color: "var(--neu-muted)" }}>({offerings.length})</span>
        </button>
        {allYears.map(y => {
          const count = offerings.filter(o => o.students.some((s: any) => String(s.batch_year) === y)).length;
          return (
            <button key={y} onClick={() => setActiveYear(y)}
              style={{ padding: "8px 18px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", background: "var(--neu-bg)", boxShadow: activeYear === y ? SH_IN_SM : SH_BTN, color: activeYear === y ? "#6c63ff" : "var(--neu-muted)", transition: "box-shadow 0.15s,color 0.15s" }}>
              {y} <span style={{ fontSize: "0.72rem", color: "var(--neu-muted)" }}>({count})</span>
            </button>
          );
        })}
      </div>

      {visibleOfferings.length === 0
        ? <Empty msg="No course offerings found. Go to 'Manage Offerings' to create one." />
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {visibleOfferings.map(o => {
              const isOpen  = expanded === o.course_id;
              const color   = DEPT_COLORS[o.department_name] ?? "#888";
              // Filter enrolled students to the selected year tab
              const yearStudents = activeYear === "all"
                ? o.students
                : o.students.filter((s: any) => String(s.batch_year) === activeYear);

              return (
                <div key={o.course_id} style={{ background: "var(--neu-bg)", borderRadius: "18px", boxShadow: SH_OUT, overflow: "hidden", borderLeft: `4px solid ${color}` }}>
                  {/* Row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.5rem" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "3px 10px", borderRadius: "999px", background: "var(--neu-bg)", boxShadow: SH_IN_SM, color, flexShrink: 0 }}>{o.course_code}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--neu-text)" }}>{o.course_title}</p>
                      <p style={{ fontSize: "0.8rem", color: "var(--neu-muted)", marginTop: "2px" }}>
                        👨‍🏫 {o.teacher_name ?? "Unassigned"} &nbsp;·&nbsp; 👥 {yearStudents.length} students &nbsp;·&nbsp; 🎓 {o.credits} credits
                      </p>
                    </div>
                    <button onClick={() => setExpanded(isOpen ? null : o.course_id)}
                      style={{ padding: "6px 14px", borderRadius: "10px", border: "none", cursor: "pointer", background: "var(--neu-bg)", boxShadow: SH_BTN, fontSize: "0.78rem", fontWeight: 600, color: "var(--neu-muted)", transition: "box-shadow 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = SH_BTN_P)}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = SH_BTN)}>
                      {isOpen ? "Hide ▲" : "View ▼"}
                    </button>
                  </div>

                  {/* Student list */}
                  {isOpen && (
                    <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)", padding: "1rem 1.5rem" }}>
                      <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--neu-muted)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "10px" }}>
                        Enrolled Students ({yearStudents.length})
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {yearStudents.length === 0
                          ? <p style={{ fontSize: "0.82rem", color: "var(--neu-muted)" }}>No students for batch {activeYear} in this offering.</p>
                          : yearStudents.map((s: any, i: number) => {
                              const prog = s.program_name?.replace("BS Computer Science","BSCS").replace("BS Electrical Engineering","BSEE").replace("BS Mathematics","BSMATH").replace("BS Business Administration","BSBBA") || "—";
                              return (
                                <div key={s.enrollment_id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "8px 12px", borderRadius: "10px", background: "var(--neu-bg)", boxShadow: SH_IN_SM }}>
                                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--neu-muted)", width: "24px" }}>{i + 1}</span>
                                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#6c63ff", fontFamily: "monospace", flex: 1 }}>{s.student_id}</span>
                                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--neu-text)", flex: 1 }}>{s.student_name}</span>
                                  <ProgBadge p={prog} />
                                  <span style={{ fontSize: "0.72rem", color: "var(--neu-muted)" }}>{s.batch_year}</span>
                                  <button onClick={() => handleDeleteEnrollment(s.enrollment_id)}
                                    style={{ padding: "4px", borderRadius: "6px", border: "none", background: "none", cursor: "pointer", color: "#e05c5c", opacity: 0.6, flexShrink: 0 }}
                                    title="Remove enrollment"
                                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                                    onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                  </button>
                                </div>
                              );
                            })
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
