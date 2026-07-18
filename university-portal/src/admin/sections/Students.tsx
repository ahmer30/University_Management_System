import { useState } from "react";
import { YEARS, type Student } from "../data";
import { SH_OUT, SH_IN_SM, SH_BTN, SectionHeader, TblHead, TblRow, C, ProgBadge, Empty, FieldLabel, selStyle } from "../components/AdminUI";

export default function StudentsSection({ studentsByYear, departments, onSave }: { studentsByYear: Record<string, Student[]>, departments: any[], onSave: (data: Record<string, Student[]>) => void }) {
  const [activeYr, setYr] = useState(YEARS[0]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    program: "BSCS",
    dept: "Computer Science",
    year: YEARS[0]
  });

  const progToDept: Record<string, string> = {
    "BSCS": "Computer Science",
    "BSEE": "Electrical Engineering",
    "BSMATH": "Mathematics",
    "BSBBA": "Business Administration"
  };

  const handleProgChange = (prog: string) => {
    setFormData({
      ...formData,
      program: prog,
      dept: progToDept[prog] || ""
    });
  };

  const years = Object.keys(studentsByYear);
  const list  = studentsByYear[activeYr] ?? [];
  const total = Object.values(studentsByYear).reduce((s, a) => s + a.length, 0);

  const handleDelete = (id: string) => {
    if (confirm("Remove this student from records?")) {
      const updated = { ...studentsByYear };
      updated[activeYr] = updated[activeYr].filter(s => s.id !== id);
      onSave(updated);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.name || !formData.dept) {
      alert("Please fill in all fields.");
      return;
    }
    const updated = { ...studentsByYear };
    const targetYear = formData.year;
    if (!updated[targetYear]) updated[targetYear] = [];
    updated[targetYear] = [...updated[targetYear], { id: formData.id, name: formData.name, program: formData.program, dept: formData.dept }];
    onSave(updated);
    setShowAdd(false);
    setFormData({ id: "", name: "", program: "BSCS", dept: "Computer Science", year: activeYr });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <SectionHeader title="Enrolled Students" sub={`${total} students across all years`} />
        <button onClick={() => setShowAdd(!showAdd)}
          style={{ padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer", background: showAdd ? "var(--neu-bg)" : "linear-gradient(135deg,#6c63ff,#8b85ff)",
          boxShadow: showAdd ? SH_IN_SM : "6px 6px 14px #a9a3e8,-4px -4px 10px #ffffff", color: showAdd ? "var(--neu-text)" : "#fff", fontWeight: 700, fontSize: "0.85rem", transition: "all 0.2s" }}>
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
              <FieldLabel>Academic Year</FieldLabel>
              <select className="neu-input" style={selStyle} value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })}>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Program</FieldLabel>
              <select className="neu-input" style={selStyle} value={formData.program} onChange={e => handleProgChange(e.target.value)}>
                <option>BSCS</option>
                <option>BSEE</option>
                <option>BSMATH</option>
                <option>BSBBA</option>
              </select>
            </div>
            <div>
              <FieldLabel>Department (Auto-linked)</FieldLabel>
              <input type="text" className="neu-input" value={formData.dept} readOnly style={{ opacity: 0.7, cursor: "not-allowed" }} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button type="submit" style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "none", cursor: "pointer", background: "linear-gradient(135deg,#6c63ff,#8b85ff)", boxShadow: "6px 6px 14px #a9a3e8,-4px -4px 10px #ffffff", color: "#fff", fontWeight: 800, fontSize: "0.9rem" }}>
                Confirm Registration
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: "flex", gap: "6px", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {years.map(y => (
          <button key={y} onClick={() => setYr(y)} style={{ padding: "8px 18px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", background: "var(--neu-bg)", boxShadow: activeYr === y ? SH_IN_SM : SH_BTN, color: activeYr === y ? "#6c63ff" : "var(--neu-muted)", transition: "box-shadow 0.15s,color 0.15s" }}>
            {y} <span style={{ fontSize: "0.72rem", color: "var(--neu-muted)" }}>({studentsByYear[y]?.length || 0})</span>
          </button>
        ))}
      </div>
      {list.length === 0
        ? <Empty msg="No students in this year yet." />
        : (
          <div style={{ background: "var(--neu-bg)", borderRadius: "20px", boxShadow: SH_OUT, overflow: "hidden" }}>
            <TblHead cols={["#","Roll Number","Full Name","Program","Department", "Action"]} />
            {list.map((s, i) => (
              <TblRow key={s.id} i={i}>
                <C w="32px">{i+1}</C>
                <C flex={1.5} mono color="#6c63ff">{s.id}</C>
                <C flex={1.5} bold>{s.name}</C>
                <C flex={0.8}><ProgBadge p={s.program} /></C>
                <C flex={1.4}>{s.dept}</C>
                <C flex={0.5}>
                  <button onClick={() => handleDelete(s.id)} style={{ padding: "6px", borderRadius: "8px", border: "none", background: "none", cursor: "pointer", color: "#e05c5c", opacity: 0.7 }} onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.7")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
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
