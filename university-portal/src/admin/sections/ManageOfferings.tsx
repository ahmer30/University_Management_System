import { useState, useMemo } from "react";
import { createOffering } from "../../api";
import { SH_IN_SM, SH_BTN, SectionHeader, ProgBadge, StepLabel, selStyle } from "../components/AdminUI";

export default function ManageOfferingsSection({ departments, teachers, students, courses, onRefresh }: {
  offerings: any[];
  departments: any[];
  teachers: any[];
  students: any[];   // flat DB array: { student_id, full_name, batch_year, program_name, department_name }
  courses: any[];    // DB array: { course_id, course_code, course_title, department_name, ... }
  onRefresh: () => Promise<void>;
}) {
  const [selDept,   setSelDept]   = useState("");
  const [selYears,  setSelYears]  = useState<string[]>([]);
  const [selected,  setSelected]  = useState<string[]>([]);
  const [courseId,  setCourseId]  = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState({ text: "", ok: true });

  // Derive unique batch years for the selected department
  const availableYears: string[] = useMemo(() => {
    const base = selDept ? students.filter(s => s.department_name === selDept) : students;
    return [...new Set(base.map(s => String(s.batch_year)))].sort((a, b) => Number(b) - Number(a));
  }, [students, selDept]);

  const step1Done = !!selDept;
  const step2Done = selYears.length > 0;
  const step3Done = selected.length > 0;
  const step4Done = !!courseId;

  // Students filtered by dept + year
  const filteredStudents = useMemo(() => {
    return students.filter(s =>
      s.department_name === selDept && selYears.includes(String(s.batch_year))
    );
  }, [students, selDept, selYears]);

  const filteredCourses  = courses.filter(c  => !selDept || c.department_name === selDept);
  const filteredTeachers = teachers.filter(t => !selDept || t.department_name === selDept);

  const toggleYear = (y: string) => {
    setSelYears(prev => prev.includes(y) ? prev.filter(x => x !== y) : [...prev, y]);
    setSelected([]);
  };

  const toggleStudent = (id: string) => setSelected(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);
  const toggleAll     = () => setSelected(selected.length === filteredStudents.length ? [] : filteredStudents.map(s => s.student_id));

  const handleCreate = async () => {
    if (!step1Done || !step2Done || !step3Done || !step4Done || !teacherId) return;
    setSaving(true);
    setMsg({ text: "", ok: true });
    try {
      const result = await createOffering({
        course_id:   Number(courseId),
        teacher_id:  teacherId,
        student_ids: selected,
      });
      setMsg({ text: result.message || "Offering created successfully!", ok: true });
      // Reset
      setSelDept(""); setSelYears([]); setSelected([]); setCourseId(""); setTeacherId("");
      await onRefresh();
    } catch (err: any) {
      setMsg({ text: err.message, ok: false });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <SectionHeader title="Create Course Offering" sub="Follow the steps to configure the curriculum" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", maxWidth: "1000px" }}>

        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {/* STEP 1: DEPARTMENT */}
          <section>
            <StepLabel num="1" title="Select Department" active={true} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px" }}>
              {departments.map(d => {
                const isActive = selDept === d.department_name;
                return (
                  <button key={d.department_id} onClick={() => { setSelDept(d.department_name); setSelYears([]); setSelected([]); setCourseId(""); setTeacherId(""); }}
                    style={{ padding: "10px 18px", borderRadius: "14px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.82rem", background: "var(--neu-bg)", boxShadow: isActive ? SH_IN_SM : SH_BTN, color: isActive ? "var(--neu-accent)" : "var(--neu-muted)", transition: "all 0.2s" }}>
                    {d.department_name}
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 2: BATCH YEARS */}
          <section style={{ opacity: step1Done ? 1 : 0.4, pointerEvents: step1Done ? "auto" : "none" }}>
            <StepLabel num="2" title="Batch Years" active={step1Done} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px" }}>
              {availableYears.map(y => {
                const isActive = selYears.includes(y);
                return (
                  <button key={y} onClick={() => toggleYear(y)}
                    style={{ padding: "10px 18px", borderRadius: "14px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.82rem", background: "var(--neu-bg)", boxShadow: isActive ? SH_IN_SM : SH_BTN, color: isActive ? "var(--neu-accent)" : "var(--neu-muted)", transition: "all 0.2s" }}>
                    {isActive && "✓ "}{y}
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 4: COURSE */}
          <section style={{ opacity: step3Done ? 1 : 0.4, pointerEvents: step3Done ? "auto" : "none" }}>
            <StepLabel num="4" title="Select Course" active={step3Done} />
            <div style={{ marginTop: "12px" }}>
              <select value={courseId} onChange={e => setCourseId(e.target.value)} style={selStyle} className="neu-input">
                <option value="">— Choose Course —</option>
                {filteredCourses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_code} — {c.course_title}</option>)}
              </select>
            </div>
          </section>

          {/* STEP 5: TEACHER */}
          <section style={{ opacity: step4Done ? 1 : 0.4, pointerEvents: step4Done ? "auto" : "none" }}>
            <StepLabel num="5" title="Assign Instructor" active={step4Done} />
            <div style={{ marginTop: "12px" }}>
              <select value={teacherId} onChange={e => setTeacherId(e.target.value)} style={selStyle} className="neu-input">
                <option value="">— Choose Teacher —</option>
                {filteredTeachers.map(t => <option key={t.teacher_id} value={t.teacher_id}>{t.full_name} ({t.designation})</option>)}
              </select>
            </div>
          </section>

          <div style={{ marginTop: "1rem" }}>
            {msg.text && <p style={{ fontSize: "0.85rem", fontWeight: 700, color: msg.ok ? "#48c97e" : "#e05c5c", marginBottom: "1rem" }}>{msg.ok ? "✓ " : "⚠ "}{msg.text}</p>}
            <button onClick={handleCreate} disabled={!teacherId || saving}
              style={{ padding: "14px 40px", borderRadius: "16px", border: "none", cursor: (teacherId && !saving) ? "pointer" : "not-allowed",
                background: (teacherId && !saving) ? "linear-gradient(135deg,#6c63ff,#8b85ff)" : "var(--neu-bg)",
                boxShadow: (teacherId && !saving) ? "6px 6px 14px #a9a3e8,-4px -4px 10px #ffffff" : SH_BTN,
                fontSize: "1rem", fontWeight: 800, color: (teacherId && !saving) ? "#fff" : "var(--neu-muted)", transition: "all 0.2s" }}>
              {saving ? "Saving to DB…" : "Complete Course Offering"}
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
              filteredStudents.map(s => {
                const isSel = selected.includes(s.student_id);
                // Shorten program name for badge
                const prog = s.program_name?.replace("BS Computer Science","BSCS").replace("BS Electrical Engineering","BSEE").replace("BS Mathematics","BSMATH").replace("BS Business Administration","BSBBA") || "—";
                return (
                  <div key={s.student_id} onClick={() => toggleStudent(s.student_id)}
                    style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px", cursor: "pointer", borderRadius: "14px", marginBottom: "4px",
                      background: isSel ? "rgba(108,99,255,0.08)" : "transparent", transition: "background 0.2s" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "8px", background: "var(--neu-bg)",
                      boxShadow: isSel ? "inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff" : "4px 4px 8px #bebebe, -4px -4px 8px #ffffff",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {isSel && <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="var(--neu-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,6 5,9 10,3" /></svg>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--neu-text)" }}>{s.full_name}</p>
                      <p style={{ fontSize: "0.72rem", color: "var(--neu-muted)", fontFamily: "monospace", marginTop: "2px" }}>{s.student_id}</p>
                    </div>
                    <ProgBadge p={prog} />
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
