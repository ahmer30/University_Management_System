import { useState, useMemo } from "react";
import { departments, teachers, courses, studentsByYear, YEARS, type CourseOffering, type Student } from "../data";
import { SH_OUT, SH_IN_SM, SH_BTN, SectionHeader, ProgBadge, StepLabel, FieldLabel, selStyle } from "../components/AdminUI";

export default function ManageOfferingsSection({ offerings, departments, teachers, studentsByYear, onSave }: { offerings: CourseOffering[], departments: any[], teachers: any[], studentsByYear: Record<string, Student[]>, onSave: (d: CourseOffering[]) => void }) {
  const [selDept,    setSelDept]    = useState("");
  const [selYears,   setSelYears]   = useState<string[]>([]);
  const [selected,   setSelected]   = useState<string[]>([]);
  const [courseId,   setCourseId]   = useState("");
  const [teacherId,  setTeacherId]  = useState("");
  const [msg,        setMsg]        = useState({ text: "", ok: true });

  // Logical Helpers
  const step1Done = !!selDept;
  const step2Done = selYears.length > 0;
  const step3Done = selected.length > 0;
  const step4Done = !!courseId;

  // Filter students by selected years and department
  const filteredStudents = useMemo(() => {
    let list: Student[] = [];
    selYears.forEach(y => {
      list = [...list, ...(studentsByYear[y] || [])];
    });
    return list.filter(s => s.dept === selDept);
  }, [selYears, selDept]);

  // Filter courses and teachers by department
  const filteredCourses = courses.filter(c => !selDept || c.dept === selDept);
  const filteredTeachers = teachers.filter(t => !selDept || t.dept === selDept);

  const toggleYear = (y: string) => {
    setSelYears(prev => prev.includes(y) ? prev.filter(x => x !== y) : [...prev, y]);
    setSelected([]); // Reset students when years change
  };

  const toggleStudent = (id: string) => setSelected(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);
  const toggleAll     = () => setSelected(selected.length === filteredStudents.length ? [] : filteredStudents.map(s => s.id));

  const handleCreate = () => {
    if (!step1Done || !step2Done || !step3Done || !step4Done || !teacherId) return;

    const course  = courses.find(c => String(c.id) === courseId);
    const teacher = teachers.find(t => t.id === teacherId);

    const newOffering: CourseOffering = {
      id: Math.random().toString(36).substr(2, 9),
      courseId: Number(courseId),
      courseCode: course?.code || "",
      courseTitle: course?.title || "",
      teacherId,
      teacherName: teacher?.name || "",
      year: selYears.join(", "),
      students: filteredStudents.filter(s => selected.includes(s.id)),
      createdAt: new Date().toLocaleDateString(),
    };

    onSave([newOffering, ...offerings]);
    setMsg({ text: "Offering created successfully!", ok: true });

    // Full reset
    setSelDept(""); setSelYears([]); setSelected([]); setCourseId(""); setTeacherId("");
  };

  return (
    <div>
      <SectionHeader title="Create Course Offering" sub="Follow the steps to configure the curriculum" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", maxWidth: "1000px" }}>

        {/* LEFT COLUMN: Configuration */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {/* STEP 1: DEPARTMENT (Single Select Chips) */}
          <section>
            <StepLabel num="1" title="Select Department" active={true} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px" }}>
              {departments.map(d => {
                const isActive = selDept === d.name;
                return (
                  <button key={d.id} onClick={() => { setSelDept(d.name); setSelYears([]); setSelected([]); setCourseId(""); setTeacherId(""); }}
                    style={{ padding: "10px 18px", borderRadius: "14px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.82rem", background: "var(--neu-bg)",
                    boxShadow: isActive ? SH_IN_SM : SH_BTN, color: isActive ? d.color : "var(--neu-muted)", transition: "all 0.2s" }}>
                    {d.name}
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 2: YEARS (Multi Select Chips) */}
          <section style={{ opacity: step1Done ? 1 : 0.4, pointerEvents: step1Done ? "auto" : "none" }}>
            <StepLabel num="2" title="Academic Years" active={step1Done} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px" }}>
              {YEARS.map(y => {
                const isActive = selYears.includes(y);
                return (
                  <button key={y} onClick={() => toggleYear(y)}
                    style={{ padding: "10px 18px", borderRadius: "14px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.82rem", background: "var(--neu-bg)",
                    boxShadow: isActive ? SH_IN_SM : SH_BTN, color: isActive ? "var(--neu-accent)" : "var(--neu-muted)", transition: "all 0.2s" }}>
                    {isActive && "✓ "}{y}
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 4: COURSE (Dropdown) */}
          <section style={{ opacity: step3Done ? 1 : 0.4, pointerEvents: step3Done ? "auto" : "none" }}>
            <StepLabel num="4" title="Select Course" active={step3Done} />
            <div style={{ marginTop: "12px" }}>
              <select value={courseId} onChange={e => setCourseId(e.target.value)} style={selStyle} className="neu-input">
                <option value="">— Choose Course —</option>
                {filteredCourses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
              </select>
            </div>
          </section>

          {/* STEP 5: TEACHER (Dropdown) */}
          <section style={{ opacity: step4Done ? 1 : 0.4, pointerEvents: step4Done ? "auto" : "none" }}>
            <StepLabel num="5" title="Assign Instructor" active={step4Done} />
            <div style={{ marginTop: "12px" }}>
              <select value={teacherId} onChange={e => setTeacherId(e.target.value)} style={selStyle} className="neu-input">
                <option value="">— Choose Teacher —</option>
                {filteredTeachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.designation})</option>)}
              </select>
            </div>
          </section>

          <div style={{ marginTop: "1rem" }}>
             {msg.text && <p style={{ fontSize: "0.85rem", fontWeight: 700, color: msg.ok ? "#48c97e" : "#e05c5c", marginBottom: "1rem" }}>{msg.ok ? "✓ " : "⚠ "}{msg.text}</p>}
             <button onClick={handleCreate} disabled={!teacherId}
                style={{ padding: "14px 40px", borderRadius: "16px", border: "none", cursor: teacherId ? "pointer" : "not-allowed",
                background: teacherId ? "linear-gradient(135deg,#6c63ff,#8b85ff)" : "var(--neu-bg)",
                boxShadow: teacherId ? "6px 6px 14px #a9a3e8,-4px -4px 10px #ffffff" : SH_BTN,
                fontSize: "1rem", fontWeight: 800, color: teacherId ? "#fff" : "var(--neu-muted)", transition: "all 0.2s" }}>
                Complete Course Offering
             </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Student Roster */}
        <section style={{ opacity: step2Done ? 1 : 0.4, pointerEvents: step2Done ? "auto" : "none", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <StepLabel num="3" title={`Student Roster (${filteredStudents.length})`} active={step2Done} />
            {filteredStudents.length > 0 && (
              <button onClick={toggleAll} style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--neu-accent)", background: "none", border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {selected.length === filteredStudents.length ? "Clear All" : "Select All"}
              </button>
            )}
          </div>

          <div style={{ flex: 1, background: "var(--neu-bg)", borderRadius: "24px", boxShadow: SH_IN_SM, maxHeight: "550px", overflowY: "auto", padding: "8px" }}>
            {filteredStudents.length === 0 ? (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem", textAlign: "center" }}>
                <p style={{ fontSize: "0.88rem", color: "var(--neu-muted)", fontWeight: 500 }}>Select department and year(s) to view available students.</p>
              </div>
            ) : (
              filteredStudents.map((s, i) => {
                const isSel = selected.includes(s.id);
                return (
                  <div key={s.id} onClick={() => toggleStudent(s.id)}
                    style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px", cursor: "pointer", borderRadius: "14px", marginBottom: "4px",
                    background: isSel ? "rgba(108,99,255,0.08)" : "transparent", transition: "background 0.2s" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "8px", background: "var(--neu-bg)",
                      boxShadow: isSel ? "inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff" : "4px 4px 8px #bebebe, -4px -4px 8px #ffffff",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {isSel && <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="var(--neu-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,6 5,9 10,3" /></svg>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--neu-text)" }}>{s.name}</p>
                      <p style={{ fontSize: "0.72rem", color: "var(--neu-muted)", fontFamily: "monospace", marginTop: "2px" }}>{s.id}</p>
                    </div>
                    <ProgBadge p={s.program} />
                  </div>
                );
              })
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
