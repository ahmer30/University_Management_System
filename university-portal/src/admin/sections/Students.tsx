import { useState, useMemo } from "react";
import { addStudent, deleteStudent } from "../../api";
import { SH_OUT, SH_IN_SM, SH_BTN, SectionHeader, TblHead, TblRow, C, ProgBadge, Empty, FieldLabel, selStyle } from "../components/AdminUI";

export default function StudentsSection({ students, programs, onRefresh }: {
  students: any[];
  programs: any[];
  departments: any[];
  onRefresh: () => Promise<void>;
}) {
  const [activeYear, setActiveYear] = useState<string>("all");
  const [showAdd,    setShowAdd]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [errMsg,     setErrMsg]     = useState("");
  const [formData,   setFormData]   = useState({
    id: "", name: "", email: "", program_id: "", batch_year: "",
  });

  // Derive unique batch years from the DB data
  const years: string[] = useMemo(() => {
    const ys = [...new Set(students.map(s => String(s.batch_year)))].sort((a, b) => Number(b) - Number(a));
    return ys;
  }, [students]);

  const filtered = activeYear === "all" ? students : students.filter(s => String(s.batch_year) === activeYear);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg("");
    if (!formData.id || !formData.name || !formData.email || !formData.program_id || !formData.batch_year) {
      setErrMsg("Please fill in all fields.");
      return;
    }
    setSaving(true);
    try {
      await addStudent({
        student_id: formData.id,
        full_name:  formData.name,
        email:      formData.email,
        program_id: Number(formData.program_id),
        batch_year: Number(formData.batch_year),
      });
      setFormData({ id: "", name: "", email: "", program_id: "", batch_year: "" });
      setShowAdd(false);
      await onRefresh();
    } catch (err: any) {
      setErrMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (student_id: string) => {
    if (!confirm("Remove this student from records?")) return;
    try {
      await deleteStudent(student_id);
      await onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <SectionHeader title="Enrolled Students" sub={`${students.length} students across all years`} />
        <button onClick={() => { setShowAdd(!showAdd); setErrMsg(""); }}
          style={{ padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer",
            background: showAdd ? "var(--neu-bg)" : "linear-gradient(135deg,#6c63ff,#8b85ff)",
            boxShadow: showAdd ? SH_IN_SM : "6px 6px 14px #a9a3e8,-4px -4px 10px #ffffff",
            color: showAdd ? "var(--neu-text)" : "#fff", fontWeight: 700, fontSize: "0.85rem", transition: "all 0.2s" }}>
          {showAdd ? "Cancel" : "+ Register Student"}
        </button>
      </div>

      {showAdd && (
        <div style={{ background: "var(--neu-bg)", borderRadius: "20px", boxShadow: SH_OUT, padding: "2rem", marginBottom: "2rem", borderTop: "4px solid #6c63ff" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--neu-text)", marginBottom: "1.5rem" }}>Register New Student</h3>
          <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
            <div>
              <FieldLabel>Roll Number</FieldLabel>
              <input type="text" className="neu-input" value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} placeholder="NUM-CS-2026-06" />
            </div>
            <div>
              <FieldLabel>Full Name</FieldLabel>
              <input type="text" className="neu-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Jane Doe" />
            </div>
            <div>
              <FieldLabel>Email Address</FieldLabel>
              <input type="email" className="neu-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="student@namal.edu.pk" />
            </div>
            <div>
              <FieldLabel>Program</FieldLabel>
              <select className="neu-input" style={selStyle} value={formData.program_id} onChange={e => setFormData({ ...formData, program_id: e.target.value })}>
                <option value="">— Select Program —</option>
                {programs.map(p => <option key={p.program_id} value={p.program_id}>{p.program_name}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Batch Year</FieldLabel>
              <input type="number" className="neu-input" value={formData.batch_year} onChange={e => setFormData({ ...formData, batch_year: e.target.value })} placeholder="2026" min="2020" max="2030" />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button type="submit" disabled={saving}
                style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "none", cursor: saving ? "not-allowed" : "pointer", background: "linear-gradient(135deg,#6c63ff,#8b85ff)", boxShadow: "6px 6px 14px #a9a3e8,-4px -4px 10px #ffffff", color: "#fff", fontWeight: 800, fontSize: "0.9rem", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving…" : "Confirm Registration"}
              </button>
            </div>
            {errMsg && <div style={{ gridColumn: "span 3", fontSize: "0.82rem", color: "#e05c5c", fontWeight: 600 }}>⚠ {errMsg}</div>}
          </form>
        </div>
      )}

      {/* Year filter tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <button onClick={() => setActiveYear("all")}
          style={{ padding: "8px 18px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", background: "var(--neu-bg)", boxShadow: activeYear === "all" ? SH_IN_SM : SH_BTN, color: activeYear === "all" ? "#6c63ff" : "var(--neu-muted)", transition: "box-shadow 0.15s,color 0.15s" }}>
          All <span style={{ fontSize: "0.72rem", color: "var(--neu-muted)" }}>({students.length})</span>
        </button>
        {years.map(y => (
          <button key={y} onClick={() => setActiveYear(y)}
            style={{ padding: "8px 18px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", background: "var(--neu-bg)", boxShadow: activeYear === y ? SH_IN_SM : SH_BTN, color: activeYear === y ? "#6c63ff" : "var(--neu-muted)", transition: "box-shadow 0.15s,color 0.15s" }}>
            {y} <span style={{ fontSize: "0.72rem", color: "var(--neu-muted)" }}>({students.filter(s => String(s.batch_year) === y).length})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <Empty msg="No students found." />
        : (
          <div style={{ background: "var(--neu-bg)", borderRadius: "20px", boxShadow: SH_OUT, overflow: "hidden" }}>
            <TblHead cols={["#", "Roll Number", "Full Name", "Program", "Department", "Batch", "Action"]} />
            {filtered.map((s, i) => (
              <TblRow key={s.student_id} i={i}>
                <C w="32px">{i + 1}</C>
                <C flex={1.5} mono color="#6c63ff">{s.student_id}</C>
                <C flex={1.5} bold>{s.full_name}</C>
                <C flex={0.8}><ProgBadge p={s.program_name?.replace("BS ", "BS").replace("BS Computer Science","BSCS").replace("BS Electrical Engineering","BSEE").replace("BS Mathematics","BSMATH").replace("BS Business Administration","BSBBA") || s.program_name} /></C>
                <C flex={1.4}>{s.department_name}</C>
                <C flex={0.6}>{s.batch_year}</C>
                <C flex={0.5}>
                  <button onClick={() => handleDelete(s.student_id)}
                    style={{ padding: "6px", borderRadius: "8px", border: "none", background: "none", cursor: "pointer", color: "#e05c5c", opacity: 0.7 }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0.7")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </C>
              </TblRow>
            ))}
          </div>
        )
      }
    </div>
  );
}
