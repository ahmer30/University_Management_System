import { useState } from "react";
import { courses, type Student } from "../data";
import { SH_OUT, SH_HOVER, SH_IN_SM, SectionHeader, StatPill, FieldLabel, selStyle } from "../components/AdminUI";

export default function DepartmentsSection({ teachers = [], studentsByYear = {}, departments = [], courses = [], onSave }: { teachers: any[], studentsByYear: Record<string, Student[]>, departments: any[], courses: any[], onSave: (data: any[]) => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<number[]>([]);
  const [formData, setFormData] = useState({ name: "", code: "", color: "#6c63ff" });

  // Aggregate all students into a flat list for filtering (with safety check)
  const allStudents = Object.values(studentsByYear || {}).flat();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    const newDept = {
      id: Date.now(),
      ...formData,
      hod: "Unassigned",
      students: 0,
      courses: 0
    };

    onSave([...departments, newDept]);
    setShowAdd(false);
    setFormData({ name: "", code: "", color: "#6c63ff" });
  };

  const toggleSelectDelete = (id: number) => {
    setSelectedToDelete(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const executeDelete = () => {
    if (selectedToDelete.length === 0) {
      setIsDeleteMode(false);
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedToDelete.length} department(s)?`)) {
      onSave(departments.filter(d => !selectedToDelete.includes(d.id)));
      setSelectedToDelete([]);
      setIsDeleteMode(false);
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
                style={{ padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer", background: "var(--neu-bg)",
                boxShadow: SH_BTN, color: "#e05c5c", fontWeight: 700, fontSize: "0.85rem", transition: "all 0.2s" }}>
                Manage Deletion
              </button>
              <button onClick={() => setShowAdd(!showAdd)}
                style={{ padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer", background: showAdd ? "var(--neu-bg)" : "linear-gradient(135deg,#e05c5c,#e87070)",
                boxShadow: showAdd ? SH_IN_SM : "6px 6px 14px #d4b4b4,-4px -4px 10px #ffffff", color: showAdd ? "var(--neu-text)" : "#fff", fontWeight: 700, fontSize: "0.85rem", transition: "all 0.2s" }}>
                {showAdd ? "Cancel" : "+ Add Department"}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setIsDeleteMode(false); setSelectedToDelete([]); }}
                style={{ padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer", background: "var(--neu-bg)",
                boxShadow: SH_BTN, color: "var(--neu-muted)", fontWeight: 700, fontSize: "0.85rem" }}>
                Exit Deletion
              </button>
              <button onClick={executeDelete}
                style={{ padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer", background: "#e05c5c",
                boxShadow: "6px 6px 14px #d4b4b4,-4px -4px 10px #ffffff", color: "#fff", fontWeight: 700, fontSize: "0.85rem" }}>
                Confirm Delete ({selectedToDelete.length})
              </button>
            </>
          )}
        </div>
      </div>

      {showAdd && !isDeleteMode && (
        <div style={{ background: "var(--neu-bg)", borderRadius: "20px", boxShadow: SH_OUT, padding: "2rem", marginBottom: "2rem", borderTop: "4px solid #e05c5c" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--neu-text)", marginBottom: "1.5rem" }}>Create New Department</h3>
          <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
            <div>
              <FieldLabel>Department Name</FieldLabel>
              <input type="text" className="neu-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Physics" />
            </div>
            <div>
              <FieldLabel>Dept Code (Short)</FieldLabel>
              <input type="text" className="neu-input" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. PHY" />
            </div>
            <div>
              <FieldLabel>Theme Color</FieldLabel>
              <input type="color" className="neu-input" style={{ padding: "4px", height: "46px" }} value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} />
            </div>
            <div style={{ gridColumn: "span 3", textAlign: "right" }}>
              <button type="submit" style={{ padding: "12px 30px", borderRadius: "14px", border: "none", cursor: "pointer", background: "linear-gradient(135deg,#e05c5c,#e87070)", boxShadow: "6px 6px 14px #d4b4b4,-4px -4px 10px #ffffff", color: "#fff", fontWeight: 800, fontSize: "0.9rem" }}>
                Establish Department
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.25rem" }}>
        {departments.map(d => {
          const dt = teachers.filter(t => t.dept === d.name);
          const dc = courses.filter(c => c.dept === d.name);
          const ds = allStudents.filter(s => s.dept === d.name);
          const isSelected = selectedToDelete.includes(d.id);

          return (
            <div key={d.id}
              onClick={() => isDeleteMode && toggleSelectDelete(d.id)}
              style={{ position: "relative", background: "var(--neu-bg)", borderRadius: "20px",
              boxShadow: isSelected ? SH_IN_SM : SH_OUT, padding: "1.5rem", borderTop: `3px solid ${d.color}`,
              transition: "all 0.2s", cursor: isDeleteMode ? "pointer" : "default" }}
              onMouseEnter={e => { if(!isDeleteMode) { (e.currentTarget as HTMLDivElement).style.boxShadow = SH_HOVER; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; } }}
              onMouseLeave={e => { if(!isDeleteMode) { (e.currentTarget as HTMLDivElement).style.boxShadow = SH_OUT; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; } }}>

              {isDeleteMode && (
                <div style={{ position: "absolute", top: "12px", right: "12px", width: "22px", height: "22px", borderRadius: "6px", background: "var(--neu-bg)", boxShadow: isSelected ? "inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff" : SH_BTN, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isSelected && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#e05c5c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,6 5,9 10,3" /></svg>}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "var(--neu-bg)", boxShadow: SH_IN_SM, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.8rem", color: d.color }}>{d.code}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--neu-text)" }}>{d.name}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--neu-muted)", marginTop: "2px" }}>HOD: {d.hod || "Unassigned"}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <StatPill val={String(ds.length)} label="students" />
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
