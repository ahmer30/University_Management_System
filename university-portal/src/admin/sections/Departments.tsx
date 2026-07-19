import { useState } from "react";
import { addDepartment, deleteDepartment } from "../../api";
import { SH_OUT, SH_HOVER, SH_IN_SM, SH_BTN, SectionHeader, StatPill, FieldLabel } from "../components/AdminUI";

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

export default function DepartmentsSection({ teachers, students, departments, courses, onRefresh }: {
  teachers: any[];
  students: any[];
  departments: any[];
  courses: any[];
  onRefresh: () => Promise<void>;
}) {
  const [showAdd,          setShowAdd]          = useState(false);
  const [isDeleteMode,     setIsDeleteMode]     = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<number[]>([]);
  const [saving,           setSaving]           = useState(false);
  const [errMsg,           setErrMsg]           = useState("");
  const [formData,         setFormData]         = useState({ name: "" });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg("");
    if (!formData.name) return;
    setSaving(true);
    try {
      await addDepartment({ department_name: formData.name });
      setFormData({ name: "" });
      setShowAdd(false);
      await onRefresh();
    } catch (err: any) {
      setErrMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleSelectDelete = (id: number) => {
    setSelectedToDelete(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const executeDelete = async () => {
    if (selectedToDelete.length === 0) { setIsDeleteMode(false); return; }
    if (!confirm(`Delete ${selectedToDelete.length} department(s)? This will fail if they have linked records.`)) return;
    try {
      for (const id of selectedToDelete) {
        await deleteDepartment(id);
      }
      setSelectedToDelete([]);
      setIsDeleteMode(false);
      await onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <SectionHeader title="Departments" sub={`${departments.length} departments at Namal University Mianwali`} />
        <div style={{ display: "flex", gap: "10px" }}>
          {!isDeleteMode ? (
            <>
              <button onClick={() => setIsDeleteMode(true)}
                style={{ padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer", background: "var(--neu-bg)", boxShadow: SH_BTN, color: "#e05c5c", fontWeight: 700, fontSize: "0.85rem" }}>
                Manage Deletion
              </button>
              <button onClick={() => { setShowAdd(!showAdd); setErrMsg(""); }}
                style={{ padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer",
                  background: showAdd ? "var(--neu-bg)" : "linear-gradient(135deg,#e05c5c,#e87070)",
                  boxShadow: showAdd ? SH_IN_SM : "6px 6px 14px #d4b4b4,-4px -4px 10px #ffffff",
                  color: showAdd ? "var(--neu-text)" : "#fff", fontWeight: 700, fontSize: "0.85rem" }}>
                {showAdd ? "Cancel" : "+ Add Department"}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setIsDeleteMode(false); setSelectedToDelete([]); }}
                style={{ padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer", background: "var(--neu-bg)", boxShadow: SH_BTN, color: "var(--neu-muted)", fontWeight: 700, fontSize: "0.85rem" }}>
                Exit Deletion
              </button>
              <button onClick={executeDelete}
                style={{ padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer", background: "#e05c5c", boxShadow: "6px 6px 14px #d4b4b4,-4px -4px 10px #ffffff", color: "#fff", fontWeight: 700, fontSize: "0.85rem" }}>
                Confirm Delete ({selectedToDelete.length})
              </button>
            </>
          )}
        </div>
      </div>

      {showAdd && !isDeleteMode && (
        <div style={{ background: "var(--neu-bg)", borderRadius: "20px", boxShadow: SH_OUT, padding: "2rem", marginBottom: "2rem", borderTop: "4px solid #e05c5c" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--neu-text)", marginBottom: "1.5rem" }}>Create New Department</h3>
          <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <FieldLabel>Department Name</FieldLabel>
              <input type="text" className="neu-input" value={formData.name} onChange={e => setFormData({ name: e.target.value })} placeholder="e.g. Physics" />
            </div>
            {errMsg && <div style={{ gridColumn: "span 2", fontSize: "0.82rem", color: "#e05c5c", fontWeight: 600 }}>⚠ {errMsg}</div>}
            <div style={{ gridColumn: "span 2", textAlign: "right" }}>
              <button type="submit" disabled={saving}
                style={{ padding: "12px 30px", borderRadius: "14px", border: "none", cursor: saving ? "not-allowed" : "pointer", background: "linear-gradient(135deg,#e05c5c,#e87070)", boxShadow: "6px 6px 14px #d4b4b4,-4px -4px 10px #ffffff", color: "#fff", fontWeight: 800, fontSize: "0.9rem", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving…" : "Establish Department"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.25rem" }}>
        {departments.map(d => {
          const color     = DEPT_COLORS[d.department_name] ?? "#888";
          const code      = DEPT_CODES[d.department_name]  ?? d.department_name.substring(0, 3).toUpperCase();
          const dt        = teachers.filter(t => t.department_name === d.department_name);
          const dc        = courses.filter(c => c.department_name === d.department_name);
          const ds        = students.filter(s => s.department_name === d.department_name);
          const isSelected = selectedToDelete.includes(d.department_id);

          return (
            <div key={d.department_id}
              onClick={() => isDeleteMode && toggleSelectDelete(d.department_id)}
              style={{ position: "relative", background: "var(--neu-bg)", borderRadius: "20px",
                boxShadow: isSelected ? SH_IN_SM : SH_OUT, padding: "1.5rem", borderTop: `3px solid ${color}`,
                transition: "all 0.2s", cursor: isDeleteMode ? "pointer" : "default" }}
              onMouseEnter={e => { if (!isDeleteMode) { (e.currentTarget as HTMLDivElement).style.boxShadow = SH_HOVER; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; } }}
              onMouseLeave={e => { if (!isDeleteMode) { (e.currentTarget as HTMLDivElement).style.boxShadow = SH_OUT; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; } }}>

              {isDeleteMode && (
                <div style={{ position: "absolute", top: "12px", right: "12px", width: "22px", height: "22px", borderRadius: "6px", background: "var(--neu-bg)", boxShadow: isSelected ? "inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff" : SH_BTN, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isSelected && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#e05c5c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,6 5,9 10,3" /></svg>}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "var(--neu-bg)", boxShadow: SH_IN_SM, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.8rem", color }}>
                  {code}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--neu-text)" }}>{d.department_name}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--neu-muted)", marginTop: "2px" }}>HOD: {d.hod_name ?? "Unassigned"}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <StatPill val={String(ds.length)} label="students" />
                <StatPill val={String(dt.length)} label="teachers" />
                <StatPill val={String(dc.length)} label="courses"  />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
