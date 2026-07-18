import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./dashboard/Sidebar";
import { type CourseOffering, teachers as initialTeachers, studentsByYear as initialStudentsByYear, departments as initialDepartments, courses as initialCourses, type Student } from "./data";
import { SH_BTN, SH_BTN_P, SH_OUT } from "./components/AdminUI";

// Sections
import OverviewSection        from "./sections/Overview";
import TeachersSection        from "./sections/Teachers";
import StudentsSection        from "./sections/Students";
import CoursesSection         from "./sections/Courses";
import DepartmentsSection     from "./sections/Departments";
import ManageOfferingsSection from "./sections/ManageOfferings";
import OfferedCoursesSection  from "./sections/OfferedCourses";

const sectionTitles: Record<string, string> = {
  overview: "Overview", teachers: "Teachers", students: "Students",
  courses: "Courses", departments: "Departments",
  manage: "Manage Offerings", offerings: "Offered Courses",
};

function loadOfferings(): CourseOffering[] {
  try { return JSON.parse(localStorage.getItem("ums_offerings") || "[]"); }
  catch { return []; }
}

function loadTeachers(): any[] {
  try { return JSON.parse(localStorage.getItem("ums_teachers") || JSON.stringify(initialTeachers)); }
  catch { return initialTeachers; }
}

function loadStudents(): Record<string, Student[]> {
  try { return JSON.parse(localStorage.getItem("ums_students") || JSON.stringify(initialStudentsByYear)); }
  catch { return initialStudentsByYear; }
}

function loadDepartments(): any[] {
  try { return JSON.parse(localStorage.getItem("ums_departments") || JSON.stringify(initialDepartments)); }
  catch { return initialDepartments; }
}

function loadCourses(): any[] {
  try { return JSON.parse(localStorage.getItem("ums_courses") || JSON.stringify(initialCourses)); }
  catch { return initialCourses; }
}

export default function AdminDashboard() {
  const [active,    setActive]    = useState("overview");
  const [collapsed, setCollapsed] = useState(false);

  const [offerings,   setOfferings]   = useState<CourseOffering[]>(loadOfferings);
  const [teachers,    setTeachers]    = useState<any[]>(loadTeachers);
  const [students,    setStudents]    = useState<Record<string, Student[]>>(loadStudents);
  const [departments, setDepartments] = useState<any[]>(loadDepartments);
  const [courses,     setCourses]     = useState<any[]>(loadCourses);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("ums_admin")) navigate("/admin/login");
  }, []);

  const saveOfferings = (data: CourseOffering[]) => {
    setOfferings(data);
    localStorage.setItem("ums_offerings", JSON.stringify(data));
  };

  const saveTeachers = (data: any[]) => {
    setTeachers(data);
    localStorage.setItem("ums_teachers", JSON.stringify(data));
  };

  const saveStudents = (data: Record<string, Student[]>) => {
    setStudents(data);
    localStorage.setItem("ums_students", JSON.stringify(data));
  };

  const saveDepartments = (data: any[]) => {
    setDepartments(data);
    localStorage.setItem("ums_departments", JSON.stringify(data));
  };

  const saveCourses = (data: any[]) => {
    setCourses(data);
    localStorage.setItem("ums_courses", JSON.stringify(data));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--neu-bg)" }}>
      <AdminSidebar active={active} onSelect={setActive} collapsed={collapsed} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Header */}
        <header style={{ height: "68px", background: "var(--neu-bg)", boxShadow: "0 4px 16px #bebebe, 0 -2px 6px #ffffff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", position: "sticky", top: 0, zIndex: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={() => setCollapsed(v => !v)}
              style={{ width: "38px", height: "38px", borderRadius: "10px", border: "none", cursor: "pointer", background: "var(--neu-bg)", boxShadow: SH_BTN, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--neu-muted)", transition: "box-shadow 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = SH_BTN_P)}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = SH_BTN)}>
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

        {/* Main Content Area */}
        <main style={{ flex: 1, overflowY: "auto", padding: "2rem 2rem 3rem" }}>
          {active === "overview"    && <OverviewSection teachers={teachers} students={students} offerings={offerings} departments={departments} />}
          {active === "teachers"    && <TeachersSection teachers={teachers} departments={departments} onSave={saveTeachers} />}
          {active === "students"    && <StudentsSection studentsByYear={students} departments={departments} onSave={saveStudents} />}
          {active === "courses"     && <CoursesSection courses={courses} departments={departments} onSave={saveCourses} />}
          {active === "departments" && <DepartmentsSection teachers={teachers} studentsByYear={students} departments={departments} courses={courses} onSave={saveDepartments} />}
          {active === "manage"      && <ManageOfferingsSection offerings={offerings} departments={departments} teachers={teachers} studentsByYear={students} courses={courses} onSave={saveOfferings} />}
          {active === "offerings"   && <OfferedCoursesSection  offerings={offerings} courses={courses} onSave={saveOfferings} />}
        </main>
      </div>
    </div>
  );
}
