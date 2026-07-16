import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./dashboard/Sidebar";
import {
  departments, teachers, courses, studentsByYear, YEARS,
  type CourseOffering,
} from "./data";
import {
  fetchStudents, fetchTeachers, fetchCourses, fetchDepartments,
  createOffering as createOfferingAPI,
} from "../api";

const SH_OUT   = "9px 9px 16px #bebebe, -9px -9px 16px #ffffff";
const SH_HOVER = "12px 12px 20px #bebebe, -12px -12px 20px #ffffff";
const SH_IN_SM = "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff";
const SH_BTN   = "5px 5px 10px #bebebe, -5px -5px 10px #ffffff";
const SH_BTN_P = "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff";

const sectionTitles: Record<string, string> = {
  overview: "Overview", teachers: "Teachers", students: "Students",
  courses: "Courses", departments: "Departments",
  manage: "Manage Offerings", offerings: "Offered Courses",
};

function loadOfferings(): CourseOffering[] {
  try { return JSON.parse(localStorage.getItem("ums_offerings") || "[]"); }
  catch { return []; }
}

export default function AdminDashboard() {
  const [active,    setActive]    = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [offerings, setOfferings] = useState<CourseOffering[]>(loadOfferings);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("ums_admin")) navigate("/admin/login");
  }, []);

  const saveOfferings = (data: CourseOffering[]) => {
    setOfferings(data);
    localStorage.setItem("ums_offerings", JSON.stringify(data));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--neu-bg)" }}>
      <AdminSidebar active={active} onSelect={setActive} collapsed={collapsed} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Header */}
        <header style={{ height: "68px", background: "var(--neu-bg)", boxShadow: "0 4px 16px #bebebe, 0 -2px 6px #ffffff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", position: "sticky", top: 0, zIndex: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={() => setCollapsed(v => !v)} style={{ width: "38px", height: "38px", borderRadius: "10px", border: "none", cursor: "pointer", background: "var(--neu-bg)", boxShadow: SH_BTN, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--neu-muted)", transition: "box-shadow 0.2s" }} onMouseEnter={e => (e.currentTarget.style.boxShadow = SH_BTN_P)} onMouseLeave={e => (e.currentTarget.style.boxShadow = SH_BTN)}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div>
              <h1 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--neu-text)", lineHeight: 1.2 }}>{sectionTitles[active]}</h1>
              <p style={{ fontSize: "0.75rem", color: "var(--neu-muted)" }}>Namal University — Admin Portal</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "var(--neu-bg)", boxShadow: SH_OUT, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem", color: "#e05c5c" }}>A</div>
            <div>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--neu-text)" }}>Administrator</p>
              <p style={{ fontSize: "0.72rem", color: "var(--neu-muted)" }}>Full Access</p>
            </div>
          </div>
        </header>

        {/* Main */}
        <main style={{ flex: 1, overflowY: "auto", padding: "2rem 2rem 3rem" }}>
          {active === "overview"    && <OverviewSection />}
          {active === "teachers"    && <TeachersSection />}
          {active === "students"    && <StudentsSection />}
          {active === "courses"     && <CoursesSection />}
          {active === "departments" && <DepartmentsSection />}
          {active === "manage"      && <ManageOfferingsSection offerings={offerings} onSave={saveOfferings} />}          {active === "offerings"   && <OfferedCoursesSection  offerings={offerings} onSave={saveOfferings} />}
        </main>
      </div>
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────────
function OverviewSection() {
  const total = Object.values(studentsByYear).reduce((s, a) => s + a.length, 0);
  const stats = [
    { label: "Total Students",  value: String(total),              color: "#6c63ff" },
    { label: "Faculty Members", value: String(teachers.length),    color: "#48c97e" },
    { label: "Active Courses",  value: String(courses.length),     color: "#f5a623" },
    { label: "Departments",     value: String(departments.length), color: "#e05c5c" },
  ];
  return (
    <div>
      <div style={{ background: "var(--neu-bg)", borderRadius: "20px", boxShadow: SH_OUT, padding: "1.75rem 2rem", marginBottom: "2rem", borderLeft: "4px solid #e05c5c" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--neu-text)" }}>Welcome, Administrator 👋</h2>
        <p style={{ fontSize: "0.88rem", color: "var(--neu-muted)", marginTop: "4px" }}>Namal University Management System — Fall 2026</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.25rem", marginBottom: "2rem" }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: "var(--neu-bg)", borderRadius: "18px", boxShadow: SH_OUT, padding: "1.4rem 1.5rem", borderTop: `3px solid ${s.color}` }}>
            <p style={{ fontSize: "2.2rem", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--neu-text)", marginTop: "8px" }}>{s.label}</p>
          </div>
        ))}
      </div>
      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--neu-text)", marginBottom: "1rem" }}>Departments at a Glance</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {departments.map(d => (
          <div key={d.id} style={{ background: "var(--neu-bg)", borderRadius: "16px", boxShadow: SH_OUT, padding: "1.1rem 1.5rem", display: "flex", alignItems: "center", gap: "1.25rem", borderLeft: `4px solid ${d.color}` }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "var(--neu-bg)", boxShadow: SH_IN_SM, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.72rem", color: d.color, flexShrink: 0 }}>{d.code}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--neu-text)" }}>{d.name}</p>
              <p style={{ fontSize: "0.82rem", color: "var(--neu-muted)", marginTop: "3px" }}>HOD: {d.hod}</p>
            </div>
            <StatPill val={String(d.students)} label="students" />
            <StatPill val={String(d.courses)}  label="courses"  />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Teachers ──────────────────────────────────────────────────────────────────
function TeachersSection() {
  return (
    <div>
      <SectionHeader title="Faculty List" sub={`${teachers.length} teachers across all departments`} />
      <div style={{ background: "var(--neu-bg)", borderRadius: "20px", boxShadow: SH_OUT, overflow: "hidden" }}>
        <TblHead cols={["#","Name","Email","Designation","Department","Office","Status"]} />
        {teachers.map((t, i) => (
          <TblRow key={t.id} i={i}>
            <C w="32px">{i+1}</C>
            <C flex={1.4} bold>{t.name}</C>
            <C flex={1.8}>{t.email}</C>
            <C flex={1.2}>{t.designation}</C>
            <C flex={1.4}>{t.dept}</C>
            <C flex={1}>{t.office}</C>
            <C flex={0.6}><StatusBadge s={t.status} /></C>
          </TblRow>
        ))}
      </div>
    </div>
  );
}

// ── Students ──────────────────────────────────────────────────────────────────
function StudentsSection() {
  const [yr, setYr] = useState("1st Year (2024)");
  const years = Object.keys(studentsByYear);
  const list  = studentsByYear[yr] ?? [];
  const total = Object.values(studentsByYear).reduce((s, a) => s + a.length, 0);
  return (
    <div>
      <SectionHeader title="Enrolled Students" sub={`${total} students across all years`} />
      <div style={{ display: "flex", gap: "6px", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {years.map(y => (
          <button key={y} onClick={() => setYr(y)} style={{ padding: "8px 18px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", background: "var(--neu-bg)", boxShadow: yr === y ? SH_IN_SM : SH_BTN, color: yr === y ? "#e05c5c" : "var(--neu-muted)", transition: "box-shadow 0.15s,color 0.15s" }}>
            {y} <span style={{ fontSize: "0.72rem", color: "var(--neu-muted)" }}>({studentsByYear[y].length})</span>
          </button>
        ))}
      </div>
      {list.length === 0
        ? <Empty msg="No students in this year yet." />
        : (
          <div style={{ background: "var(--neu-bg)", borderRadius: "20px", boxShadow: SH_OUT, overflow: "hidden" }}>
            <TblHead cols={["#","Roll Number","Full Name","Program","Department"]} />
            {list.map((s, i) => (
              <TblRow key={s.id} i={i}>
                <C w="32px">{i+1}</C>
                <C flex={1.5} mono color="#6c63ff">{s.id}</C>
                <C flex={1.5} bold>{s.name}</C>
                <C flex={0.8}><ProgBadge p={s.program} /></C>
                <C flex={1.4}>{s.dept}</C>
              </TblRow>
            ))}
          </div>
        )
      }
    </div>
  );
}

// ── Courses ───────────────────────────────────────────────────────────────────
function CoursesSection() {
  return (
    <div>
      <SectionHeader title="Course Catalog" sub={`${courses.length} courses — Fall 2026`} />
      <div style={{ background: "var(--neu-bg)", borderRadius: "20px", boxShadow: SH_OUT, overflow: "hidden" }}>
        <TblHead cols={["#","Code","Title","Department","Instructor","Room","Cr"]} />
        {courses.map((c, i) => (
          <TblRow key={c.id} i={i}>
            <C w="32px">{i+1}</C>
            <C flex={0.8}><span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "3px 10px", borderRadius: "999px", background: "var(--neu-bg)", boxShadow: SH_IN_SM, color: c.color }}>{c.code}</span></C>
            <C flex={1.6} bold>{c.title}</C>
            <C flex={1.3}>{c.dept}</C>
            <C flex={1.3}>{c.teacher}</C>
            <C flex={0.7}>{c.room}</C>
            <C flex={0.5}>{c.credits}</C>
          </TblRow>
        ))}
      </div>
    </div>
  );
}

// ── Departments ───────────────────────────────────────────────────────────────
function DepartmentsSection() {
  return (
    <div>
      <SectionHeader title="Departments" sub="4 departments at Namal University Mianwali" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.25rem" }}>
        {departments.map(d => {
          const dt = teachers.filter(t => t.dept === d.name);
          const dc = courses.filter(c => c.dept === d.name);
          return (
            <div key={d.id} style={{ background: "var(--neu-bg)", borderRadius: "20px", boxShadow: SH_OUT, padding: "1.5rem", borderTop: `3px solid ${d.color}`, transition: "box-shadow 0.2s,transform 0.2s" }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = SH_HOVER; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = SH_OUT; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "var(--neu-bg)", boxShadow: SH_IN_SM, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.8rem", color: d.color }}>{d.code}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--neu-text)" }}>{d.name}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--neu-muted)", marginTop: "2px" }}>HOD: {d.hod}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <StatPill val={String(d.students)} label="students" />
                <StatPill val={String(dt.length)}  label="teachers" />
                <StatPill val={String(dc.length)}  label="courses"  />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Manage Offerings — reads from DB ─────────────────────────────────────────
function ManageOfferingsSection({ offerings, onSave }: { offerings: CourseOffering[]; onSave: (d: CourseOffering[]) => void }) {
  // DB data for dropdowns
  const [dbCourses,  setDbCourses]  = useState<any[]>([]);
  const [dbTeachers, setDbTeachers] = useState<any[]>([]);
  const [dbStudents, setDbStudents] = useState<any[]>([]);
  const [dbDepts,    setDbDepts]    = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [apiErr,     setApiErr]     = useState("");

  useEffect(() => {
    Promise.all([fetchCourses(), fetchTeachers(), fetchStudents(), fetchDepartments()])
      .then(([c, t, s, d]) => { setDbCourses(c); setDbTeachers(t); setDbStudents(s); setDbDepts(d); })
      .catch(() => setApiErr("Cannot reach backend. Make sure the server is running on port 5000."))
      .finally(() => setLoading(false));
  }, []);

  // Form state
  const [courseId,  setCourseId]  = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [selYears,  setSelYears]  = useState<string[]>([]);
  const [selDepts,  setSelDepts]  = useState<string[]>([]);
  const [selected,  setSelected]  = useState<string[]>([]);
  const [msg,       setMsg]       = useState({ text: "", ok: true });

  // Unique batch years from DB students
  const uniqueYears = Array.from(new Set(dbStudents.map((s: any) => String(s.batch_year)))).sort((a, b) => Number(b) - Number(a));

  // Filter students by selected years + departments
  const filteredStudents = dbStudents.filter((s: any) => {
    const yearOk = selYears.length === 0 || selYears.includes(String(s.batch_year));
    const deptOk = selDepts.length === 0 || selDepts.includes(s.department_name);
    return yearOk && deptOk;
  });

  const toggleYear    = (y: string) => { setSelYears(p => p.includes(y) ? p.filter(x => x !== y) : [...p, y]); setSelected([]); };
  const toggleDept    = (d: string) => { setSelDepts(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]); setSelected([]); };
  const toggleStudent = (id: string) => setSelected(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);
  const toggleAll     = () => setSelected(selected.length === filteredStudents.length ? [] : filteredStudents.map((s: any) => s.student_id));

  const handleCreate = async () => {
    setMsg({ text: "", ok: true });
    if (!courseId || !teacherId)   { setMsg({ text: "Select a course and teacher.", ok: false }); return; }
    if (selYears.length === 0)     { setMsg({ text: "Select at least one year.", ok: false }); return; }
    if (selected.length === 0)     { setMsg({ text: "Select at least one student.", ok: false }); return; }

    try {
      const result = await createOfferingAPI({ course_id: Number(courseId), teacher_id: teacherId, student_ids: selected });
      setMsg({ text: result.message, ok: true });
      setCourseId(""); setTeacherId(""); setSelYears([]); setSelDepts([]); setSelected([]);
    } catch (e: any) {
      setMsg({ text: e.message, ok: false });
    }
  };

  const chip = (label: string, active: boolean, onClick: () => void, color = "#e05c5c") => (
    <button key={label} onClick={onClick} style={{ padding: "6px 14px", borderRadius: "999px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.78rem", background: "var(--neu-bg)", boxShadow: active ? SH_IN_SM : SH_BTN, color: active ? color : "var(--neu-muted)", transition: "box-shadow 0.15s,color 0.15s" }}>{label}</button>
  );

  const deptColors = ["#6c63ff", "#e05c5c", "#48c97e", "#f5a623"];

  if (loading) return <p style={{ padding: "2rem", color: "var(--neu-muted)" }}>Loading from database…</p>;
  if (apiErr)  return <p style={{ padding: "2rem", color: "#e05c5c", fontWeight: 600 }}>⚠ {apiErr}</p>;

  return (
    <div>
      <SectionHeader title="Create Course Offering" sub="All dropdowns load live from the database" />
      <div style={{ background: "var(--neu-bg)", borderRadius: "20px", boxShadow: SH_OUT, padding: "2rem", maxWidth: "600px", display: "flex", flexDirection: "column", gap: "1.4rem" }}>

        {/* Course */}
        <div>
          <FieldLabel>Course</FieldLabel>
          <select value={courseId} onChange={e => setCourseId(e.target.value)} style={selStyle}>
            <option value="">— Select a course —</option>
            {dbCourses.map((c: any) => <option key={c.course_id} value={c.course_id}>{c.course_code} — {c.course_title}</option>)}
          </select>
        </div>

        {/* Teacher */}
        <div>
          <FieldLabel>Teacher</FieldLabel>
          <select value={teacherId} onChange={e => setTeacherId(e.target.value)} style={selStyle}>
            <option value="">— Select a teacher —</option>
            {dbTeachers.map((t: any) => <option key={t.teacher_id} value={t.teacher_id}>{t.full_name} ({t.department_name})</option>)}
          </select>
        </div>

        {/* Batch year chips */}
        <div>
          <FieldLabel>Batch Year <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(select one or more)</span></FieldLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "6px" }}>
            {uniqueYears.map(y => chip(y, selYears.includes(y), () => toggleYear(y)))}
          </div>
        </div>

        {/* Department chips */}
        <div>
          <FieldLabel>Department <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional filter)</span></FieldLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "6px" }}>
            {dbDepts.map((d: any, i: number) => chip(d.department_name, selDepts.includes(d.department_name), () => toggleDept(d.department_name), deptColors[i % 4]))}
          </div>
        </div>

        {/* Student list — appears only after a year is selected */}
        {selYears.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <FieldLabel>Students ({filteredStudents.length} shown)</FieldLabel>
              {filteredStudents.length > 0 && (
                <button onClick={toggleAll} style={{ fontSize: "0.75rem", fontWeight: 600, color: "#e05c5c", background: "none", border: "none", cursor: "pointer" }}>
                  {selected.length === filteredStudents.length ? "Deselect All" : "Select All"}
                </button>
              )}
            </div>
            {filteredStudents.length === 0
              ? <p style={{ fontSize: "0.82rem", color: "var(--neu-muted)" }}>No students match the selected filters.</p>
              : (
                <div style={{ background: "var(--neu-bg)", borderRadius: "14px", boxShadow: SH_IN_SM, maxHeight: "280px", overflowY: "auto" }}>
                  {filteredStudents.map((s: any, i: number) => {
                    const checked = selected.includes(s.student_id);
                    return (
                      <div key={s.student_id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "9px 14px", borderBottom: i < filteredStudents.length - 1 ? "1px solid #ebebeb" : "none", background: checked ? "rgba(224,92,92,0.04)" : "transparent" }}>
                        <button type="button" onClick={() => toggleStudent(s.student_id)} style={{ width: "20px", height: "20px", borderRadius: "6px", border: "none", cursor: "pointer", background: "var(--neu-bg)", boxShadow: checked ? "inset 3px 3px 6px #bebebe,inset -3px -3px 6px #ffffff" : "3px 3px 6px #bebebe,-3px -3px 6px #ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {checked && <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#e05c5c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,6 5,9 10,3" /></svg>}
                        </button>
                        <span style={{ flex: 1, fontSize: "0.875rem", fontWeight: 600, color: "var(--neu-text)" }}>{s.full_name}</span>
                        <span style={{ fontSize: "0.72rem", color: "var(--neu-muted)", fontFamily: "monospace" }}>{s.student_id}</span>
                        <span style={{ fontSize: "0.7rem", color: "var(--neu-muted)" }}>{s.batch_year}</span>
                      </div>
                    );
                  })}
                </div>
              )
            }
            {filteredStudents.length > 0 && <p style={{ fontSize: "0.75rem", color: "var(--neu-muted)", marginTop: "6px" }}>{selected.length} of {filteredStudents.length} selected</p>}
          </div>
        )}

        {msg.text && <p style={{ fontSize: "0.82rem", fontWeight: 600, color: msg.ok ? "#48c97e" : "#e05c5c" }}>{msg.ok ? "✔" : "⚠"} {msg.text}</p>}

        <button onClick={handleCreate} style={{ padding: "10px 28px", borderRadius: "12px", border: "none", cursor: "pointer", background: "linear-gradient(135deg,#e05c5c,#e87070)", boxShadow: "6px 6px 14px #d4b4b4,-4px -4px 10px #ffffff", fontSize: "0.88rem", fontWeight: 700, color: "#fff", alignSelf: "flex-start", transition: "filter 0.15s" }} onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.08)")} onMouseLeave={e => (e.currentTarget.style.filter = "brightness(1)")}>
          Create Offering
        </button>
      </div>
    </div>
  );
}

// ── Offered Courses ───────────────────────────────────────────────────────────
function OfferedCoursesSection({ offerings, onSave }: { offerings: CourseOffering[]; onSave: (d: CourseOffering[]) => void }) {
  const [activeYear, setActiveYear] = useState(YEARS[0]);
  const [expanded,   setExpanded]   = useState<string | null>(null);

  const yearOfferings = offerings.filter(o => o.year === activeYear);

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
          const count = offerings.filter(o => o.year === y).length;
          return (
            <button key={y} onClick={() => setActiveYear(y)} style={{ padding: "8px 18px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", background: "var(--neu-bg)", boxShadow: activeYear === y ? SH_IN_SM : SH_BTN, color: activeYear === y ? "#e05c5c" : "var(--neu-muted)", transition: "box-shadow 0.15s,color 0.15s" }}>
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
              return (
                <div key={o.id} style={{ background: "var(--neu-bg)", borderRadius: "18px", boxShadow: SH_OUT, overflow: "hidden", borderLeft: `4px solid ${color}` }}>
                  {/* Row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.5rem" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "3px 10px", borderRadius: "999px", background: "var(--neu-bg)", boxShadow: SH_IN_SM, color, flexShrink: 0 }}>{o.courseCode}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--neu-text)" }}>{o.courseTitle}</p>
                      <p style={{ fontSize: "0.8rem", color: "var(--neu-muted)", marginTop: "2px" }}>👨‍🏫 {o.teacherName} &nbsp;·&nbsp; 👥 {o.students.length} students &nbsp;·&nbsp; 📅 {o.createdAt}</p>
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
                    <div style={{ borderTop: "1px solid #e4e4e4", padding: "1rem 1.5rem" }}>
                      <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--neu-muted)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "10px" }}>Enrolled Students ({o.students.length})</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {o.students.length === 0
                          ? <p style={{ fontSize: "0.82rem", color: "var(--neu-muted)" }}>No students in this year.</p>
                          : o.students.map((s, i) => (
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

// ── Shared helpers ────────────────────────────────────────────────────────────
const selStyle: React.CSSProperties = { width: "100%", padding: "0.8rem 1rem", borderRadius: "12px", border: "none", outline: "none", background: "var(--neu-bg)", boxShadow: "inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff", fontSize: "0.875rem", color: "var(--neu-text)", cursor: "pointer" };

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--neu-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>{children}</p>;
}

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--neu-text)" }}>{title}</h2>
      <p style={{ fontSize: "0.82rem", color: "var(--neu-muted)", marginTop: "3px" }}>{sub}</p>
    </div>
  );
}

function TblHead({ cols }: { cols: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "10px 16px", background: "rgba(0,0,0,0.03)", borderBottom: "1px solid #d8d8d8" }}>
      {cols.map((c, i) => <span key={i} style={{ flex: i === 0 ? undefined : 1, width: i === 0 ? "32px" : undefined, fontSize: "0.72rem", fontWeight: 700, color: "var(--neu-muted)", textTransform: "uppercase", letterSpacing: "0.4px", flexShrink: 0 }}>{c}</span>)}
    </div>
  );
}

function TblRow({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "12px 16px", borderBottom: "1px solid #e8e8e8", background: i % 2 === 0 ? "var(--neu-bg)" : "rgba(0,0,0,0.015)", transition: "background 0.15s" }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(99,102,241,0.04)"}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = i % 2 === 0 ? "var(--neu-bg)" : "rgba(0,0,0,0.015)"}
    >
      {children}
    </div>
  );
}

function C({ children, w, flex, bold, mono, color }: { children: React.ReactNode; w?: string; flex?: number; bold?: boolean; mono?: boolean; color?: string }) {
  return <span style={{ width: w, flex: flex ?? (w ? undefined : 1), fontSize: "0.875rem", fontWeight: bold ? 700 : 400, fontFamily: mono ? "monospace" : undefined, color: color ?? (bold ? "var(--neu-text)" : "var(--neu-muted)"), flexShrink: 0 }}>{children}</span>;
}

function StatPill({ val, label, small }: { val: string; label: string; small?: boolean }) {
  return (
    <div style={{ background: "var(--neu-bg)", borderRadius: "10px", boxShadow: SH_IN_SM, padding: small ? "4px 10px" : "7px 14px", textAlign: "center", flex: 1 }}>
      <p style={{ fontSize: small ? "0.82rem" : "1rem", fontWeight: 800, color: "var(--neu-muted)", lineHeight: 1 }}>{val}</p>
      <p style={{ fontSize: "0.68rem", color: "var(--neu-muted)", marginTop: "2px" }}>{label}</p>
    </div>
  );
}

function StatusBadge({ s }: { s: string }) {
  const c = s === "Active" ? "#48c97e" : s === "On Leave" ? "#f5a623" : "#e05c5c";
  return <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 9px", borderRadius: "999px", background: `${c}18`, color: c }}>{s}</span>;
}

function ProgBadge({ p }: { p: string }) {
  const m: Record<string, string> = { BSCS: "#6c63ff", BSEE: "#e05c5c", BSM: "#48c97e", BSBBA: "#f5a623" };
  const c = m[p] ?? "#888";
  return <span style={{ fontSize: "0.7rem", fontWeight: 800, padding: "2px 9px", borderRadius: "999px", background: `${c}18`, color: c }}>{p}</span>;
}

function Empty({ msg }: { msg: string }) {
  return (
    <div style={{ background: "var(--neu-bg)", borderRadius: "18px", boxShadow: SH_OUT, padding: "3rem", textAlign: "center", color: "var(--neu-muted)" }}>
      <p style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📂</p>
      <p style={{ fontSize: "0.88rem" }}>{msg}</p>
    </div>
  );
}
