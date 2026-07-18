import { courses } from "../data";
import { SH_OUT, SH_IN_SM, StatPill } from "../components/AdminUI";
import { type Student, type CourseOffering } from "../data";

export default function OverviewSection({ teachers, students, offerings, departments }: { teachers: any[], students: Record<string, Student[]>, offerings: CourseOffering[], departments: any[] }) {
  const totalStudents = Object.values(students).reduce((s, a) => s + a.length, 0);

  // Calculate active courses based on unique courseIds in offerings
  const activeCourseCount = new Set(offerings.map(o => o.courseId)).size;

  const stats = [
    { label: "Total Students",  value: String(totalStudents),      color: "#6c63ff" },
    { label: "Faculty Members", value: String(teachers.length),    color: "#48c97e" },
    { label: "Active Offerings",value: String(offerings.length),   color: "#f5a623" },
    { label: "Departments",     value: String(departments.length), color: "#e05c5c" },
  ];

  return (
    <div>
      <div style={{ background: "var(--neu-bg)", borderRadius: "20px", boxShadow: SH_OUT, padding: "1.75rem 2rem", marginBottom: "2rem", borderLeft: "4px solid #e05c5c" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--neu-text)" }}>Welcome, Administrator 👋</h2>
        <p style={{ fontSize: "0.88rem", color: "var(--neu-muted)", marginTop: "4px" }}>Namal University Management System — Live Data Overview</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.25rem", marginBottom: "2rem" }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: "var(--neu-bg)", borderRadius: "18px", boxShadow: SH_OUT, padding: "1.4rem 1.5rem", borderTop: `3px solid ${s.color}` }}>
            <p style={{ fontSize: "2.2rem", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--neu-text)", marginTop: "8px" }}>{s.label}</p>
          </div>
        ))}
      </div>
      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--neu-text)", marginBottom: "1rem" }}>Department Activity</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {departments.map(d => {
          const deptStudents = Object.values(students).flat().filter(s => s.dept === d.name).length;
          const deptTeachers = teachers.filter(t => t.dept === d.name).length;
          const deptOfferings = offerings.filter(o => {
              const course = courses.find(c => c.id === o.courseId);
              return course?.dept === d.name;
          }).length;

          return (
            <div key={d.id} style={{ background: "var(--neu-bg)", borderRadius: "16px", boxShadow: SH_OUT, padding: "1.1rem 1.5rem", display: "flex", alignItems: "center", gap: "1.25rem", borderLeft: `4px solid ${d.color}` }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "var(--neu-bg)", boxShadow: SH_IN_SM, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.72rem", color: d.color, flexShrink: 0 }}>{d.code}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--neu-text)" }}>{d.name}</p>
                <p style={{ fontSize: "0.82rem", color: "var(--neu-muted)", marginTop: "3px" }}>{deptTeachers} Faculty Members</p>
              </div>
              <StatPill val={String(deptStudents)} label="students" />
              <StatPill val={String(deptOfferings)} label="offered" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
