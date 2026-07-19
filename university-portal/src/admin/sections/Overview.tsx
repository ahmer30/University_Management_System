import { SH_OUT, SH_IN_SM, StatPill } from "../components/AdminUI";

const DEPT_COLORS: Record<string, string> = {
  "Computer Science":       "#6c63ff",
  "Electrical Engineering": "#e05c5c",
  "Mathematics":            "#48c97e",
  "Business Administration":"#f5a623",
};

const DEPT_CODES: Record<string, string> = {
  "Computer Science":       "CS",
  "Electrical Engineering": "EE",
  "Mathematics":            "MATH",
  "Business Administration":"BBA",
};

export default function OverviewSection({ teachers, students, offerings, departments }: {
  teachers: any[];
  students: any[];     // flat array from DB
  offerings: any[];
  departments: any[];
}) {
  const stats = [
    { label: "Total Students",   value: String(students.length),    color: "#6c63ff" },
    { label: "Faculty Members",  value: String(teachers.length),    color: "#48c97e" },
    { label: "Active Offerings", value: String(offerings.length),   color: "#f5a623" },
    { label: "Departments",      value: String(departments.length), color: "#e05c5c" },
  ];

  return (
    <div>
      <div style={{ background: "var(--neu-bg)", borderRadius: "20px", boxShadow: SH_OUT, padding: "1.75rem 2rem", marginBottom: "2rem", borderLeft: "4px solid #e05c5c" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--neu-text)" }}>Welcome, Administrator 👋</h2>
        <p style={{ fontSize: "0.88rem", color: "var(--neu-muted)", marginTop: "4px" }}>Namal University Management System — Live Database Overview</p>
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
          const color        = DEPT_COLORS[d.department_name] ?? "#888";
          const code         = DEPT_CODES[d.department_name]  ?? d.department_name.substring(0, 3).toUpperCase();
          const deptStudents = students.filter(s => s.department_name === d.department_name).length;
          const deptTeachers = teachers.filter(t => t.department_name === d.department_name).length;
          const deptOfferings = offerings.filter(o => o.department_name === d.department_name).length;

          return (
            <div key={d.department_id} style={{ background: "var(--neu-bg)", borderRadius: "16px", boxShadow: SH_OUT, padding: "1.1rem 1.5rem", display: "flex", alignItems: "center", gap: "1.25rem", borderLeft: `4px solid ${color}` }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "var(--neu-bg)", boxShadow: SH_IN_SM, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.72rem", color, flexShrink: 0 }}>
                {code}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--neu-text)" }}>{d.department_name}</p>
                <p style={{ fontSize: "0.82rem", color: "var(--neu-muted)", marginTop: "3px" }}>HOD: {d.hod_name ?? "Unassigned"} &nbsp;·&nbsp; {deptTeachers} Faculty Members</p>
              </div>
              <StatPill val={String(deptStudents)}  label="students" />
              <StatPill val={String(deptOfferings)} label="offered"  />
            </div>
          );
        })}
      </div>
    </div>
  );
}
