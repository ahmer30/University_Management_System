import { useState } from "react";
import { SH_OUT, SH_IN_SM, SH_BTN, SectionHeader, TblHead, TblRow, C, StatusBadge, FieldLabel, selStyle } from "../components/AdminUI";

export default function TeachersSection({ teachers, departments, onSave }: { teachers: any[], departments: any[], onSave: (data: any[]) => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    designation: "Lecturer",
    dept: "",
    office: "",
  });

  const handleDelete = (id: string) => {
    if (confirm("Remove this teacher from records?")) {
      onSave(teachers.filter(t => t.id !== id));
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.name || !formData.email || !formData.dept) {
      alert("Please fill in all required fields.");
      return;
    }
    onSave([...teachers, { ...formData, status: "Active" }]);
    setFormData({ id: "", name: "", email: "", designation: "Lecturer", dept: "", office: "" });
    setShowAdd(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <SectionHeader title="Faculty List" sub={`${teachers.length} teachers across all departments`} />
        <button onClick={() => setShowAdd(!showAdd)}
          style={{ padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer", background: showAdd ? "var(--neu-bg)" : "linear-gradient(135deg,#48c97e,#5dd891)",
          boxShadow: showAdd ? SH_IN_SM : "6px 6px 14px #b3ddc5,-4px -4px 10px #ffffff", color: showAdd ? "var(--neu-text)" : "#fff", fontWeight: 700, fontSize: "0.85rem", transition: "all 0.2s" }}>
          {showAdd ? "Cancel" : "+ Add Teacher"}
        </button>
      </div>

      {showAdd && (
        <div style={{ background: "var(--neu-bg)", borderRadius: "20px", boxShadow: SH_OUT, padding: "2rem", marginBottom: "2rem", borderTop: "4px solid #48c97e" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--neu-text)", marginBottom: "1.5rem" }}>Register New Faculty Member</h3>
          <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
            <div>
              <FieldLabel>Teacher ID (e.g. TCH-CS-06)</FieldLabel>
              <input type="text" className="neu-input" value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} placeholder="TCH-XX-00" />
            </div>
            <div>
              <FieldLabel>Full Name</FieldLabel>
              <input type="text" className="neu-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Dr. John Doe" />
            </div>
            <div>
              <FieldLabel>Email Address</FieldLabel>
              <input type="email" className="neu-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="name@namal.edu.pk" />
            </div>
            <div>
              <FieldLabel>Designation</FieldLabel>
              <select className="neu-input" style={selStyle} value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })}>
                <option>Professor</option>
                <option>Associate Professor</option>
                <option>Assistant Professor</option>
                <option>Lecturer</option>
                <option>Dr.</option>
              </select>
            </div>
            <div>
              <FieldLabel>Department</FieldLabel>
              <select className="neu-input" style={selStyle} value={formData.dept} onChange={e => setFormData({ ...formData, dept: e.target.value })}>
                <option value="">— Select Dept —</option>
                {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Office Location</FieldLabel>
              <input type="text" className="neu-input" value={formData.office} onChange={e => setFormData({ ...formData, office: e.target.value })} placeholder="Block A, Room 12" />
            </div>
            <div style={{ gridColumn: "span 3", textAlign: "right" }}>
              <button type="submit" style={{ padding: "12px 30px", borderRadius: "14px", border: "none", cursor: "pointer", background: "linear-gradient(135deg,#48c97e,#5dd891)", boxShadow: "6px 6px 14px #b3ddc5,-4px -4px 10px #ffffff", color: "#fff", fontWeight: 800, fontSize: "0.9rem" }}>
                Confirm Registration
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: "var(--neu-bg)", borderRadius: "20px", boxShadow: SH_OUT, overflow: "hidden" }}>
        <TblHead cols={["#","ID","Name","Email","Designation","Department","Status", "Action"]} />
        {teachers.map((t, i) => (
          <TblRow key={t.id} i={i}>
            <C w="32px">{i+1}</C>
            <C flex={0.8} mono color="var(--neu-muted)">{t.id}</C>
            <C flex={1.4} bold>{t.name}</C>
            <C flex={1.8}>{t.email}</C>
            <C flex={1.2}>{t.designation}</C>
            <C flex={1.4}>{t.dept}</C>
            <C flex={0.6}><StatusBadge s={t.status} /></C>
            <C flex={0.5}>
              <button onClick={() => handleDelete(t.id)} style={{ padding: "6px", borderRadius: "8px", border: "none", background: "none", cursor: "pointer", color: "#e05c5c", opacity: 0.7 }} onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.7")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </C>
          </TblRow>
        ))}
      </div>
    </div>
  );
}
