import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./dashboard/Sidebar";
import { SH_BTN, SH_BTN_P, SH_OUT } from "./components/AdminUI";
import {
  fetchDepartments, fetchTeachers, fetchStudents, fetchCourses, fetchOfferings, fetchPrograms,
} from "../api";

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

export default function AdminDashboard() {
  const [active,      setActive]      = useState("overview");
  const [collapsed,   setCollapsed]   = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");

  // All data lives here — sourced from DB
  const [departments, setDepartments] = useState<any[]>([]);
  const [programs,    setPrograms]    = useState<any[]>([]);
  const [teachers,    setTeachers]    = useState<any[]>([]);
  const [students,    setStudents]    = useState<any[]>([]);
  const [courses,     setCourses]     = useState<any[]>([]);
  const [offerings,   setOfferings]   = useState<any[]>([]);

  const navigate = useNavigate();

  // Load all data from backend on mount
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [depts, progs, tchs, studs, crs, offs] = await Promise.all([
        fetchDepartments(),
        fetchPrograms(),
        fetchTeachers(),
        fetchStudents(),
        fetchCourses(),
        fetchOfferings(),
      ]);
      setDepartments(depts);
      setPrograms(progs);
      setTeachers(tchs);
      setStudents(studs);
      setCourses(crs);
      setOfferings(offs);
    } catch (e: any) {
      setError(e.message || "Failed to load data from server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("ums_admin")) {
      navigate("/admin/login");
      return;
    }
    loadAll();
  }, []);

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
            {/* Refresh button */}
            <button onClick={loadAll} title="Refresh data from DB"
              style={{ width: "38px", height: "38px", borderRadius: "10px", border: "none", cursor: "pointer", background: "var(--neu-bg)", boxShadow: SH_BTN, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--neu-muted)", transition: "box-shadow 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = SH_BTN_P)}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = SH_BTN)}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            </button>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "var(--neu-bg)", boxShadow: SH_OUT, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem", color: "#e05c5c" }}>A</div>
            <div>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--neu-text)" }}>Administrator</p>
              <p style={{ fontSize: "0.72rem", color: "var(--neu-muted)" }}>Full Access</p>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main style={{ flex: 1, overflowY: "auto", padding: "2rem 2rem 3rem" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", gap: "1rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "4px solid var(--neu-bg)", borderTop: "4px solid #6c63ff", animation: "spin 0.8s linear infinite" }} />
              <p style={{ fontSize: "0.88rem", color: "var(--neu-muted)" }}>Loading data from database…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : error ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontSize: "1rem", color: "#e05c5c", fontWeight: 700 }}>⚠ {error}</p>
              <button onClick={loadAll} style={{ padding: "10px 24px", borderRadius: "12px", border: "none", cursor: "pointer", background: "linear-gradient(135deg,#6c63ff,#8b85ff)", color: "#fff", fontWeight: 700 }}>Retry</button>
            </div>
          ) : (
            <>
              {active === "overview"    && <OverviewSection teachers={teachers} students={students} offerings={offerings} departments={departments} />}
              {active === "teachers"    && <TeachersSection teachers={teachers} departments={departments} onRefresh={loadAll} />}
              {active === "students"    && <StudentsSection students={students} programs={programs} departments={departments} onRefresh={loadAll} />}
              {active === "courses"     && <CoursesSection courses={courses} departments={departments} onRefresh={loadAll} />}
              {active === "departments" && <DepartmentsSection teachers={teachers} students={students} departments={departments} courses={courses} onRefresh={loadAll} />}
              {active === "manage"      && <ManageOfferingsSection offerings={offerings} departments={departments} teachers={teachers} students={students} courses={courses} onRefresh={loadAll} />}
              {active === "offerings"   && <OfferedCoursesSection offerings={offerings} onRefresh={loadAll} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
