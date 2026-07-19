import { useState } from "react";
import { addCourse, deleteCourse } from "../../api";
import { SH_OUT, SH_IN_SM, SectionHeader, TblHead, TblRow, C, FieldLabel, selStyle, ConfirmModal } from "../components/AdminUI";

// dept color map (mirrors data.ts)
const DEPT_COLORS: Record<string, string> = {
  "Computer Science":      "#6c63ff",
  "Electrical Engineering":"#e05c5c",
  "Mathematics":           "#48c97e",
  "Business Administration":"#f5a623",
};

export default function CoursesSection({ courses, departments, onRefresh }: {
  courses: any[];
  departments: any[];
  onRefresh: () => Promise<void>;
}) {
  const [showAdd,  setShowAdd]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [errMsg,   setErrMsg]   = useState("");
  const [formData, setFormData] = useState({
    code: "", title: "", dept_id: "", credits: "3", room: "",
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg("");
    if (!formData.code || !formData.title || !formData.dept_id) {
      setErrMsg("Course code, title and department are required.");
      return;
    }
    setSaving(true);
    try {
      await addCourse({
        course_code:   formData.code,
        course_title:  formData.title,
        credits:       Number(formData.credits),
        department_id: Number(formData.dept_id),
        room_location: formData.room,
      });
      setFormData({ code: "", title: "", dept_id: "", credits: "3", room: "" });
      setShowAdd(false);
      await onRefresh();
    } catch (err: any) {
      setErrMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteCourse(deletingId);
      await onRefresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <SectionHeader title="Course Catalog" sub={`${courses.length} courses registered`} />
        <button onClick={() => { setShowAdd(!showAdd); setErrMsg(""); }}
          style={{ padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer",
            background: showAdd ? "var(--neu-bg)" : "linear-gradient(135deg,#f5a623,#f7b731)",
            boxShadow: showAdd ? SH_IN_SM : "6px 6px 14px #e8d1a3,-4px -4px 10px #ffffff",
            color: showAdd ? "var(--neu-text)" : "#fff", fontWeight: 700, fontSize: "0.85rem", transition: "all 0.2s" }}>
          {showAdd ? "Cancel" : "+ Add Course"}
        </button>
      </div>

      {showAdd && (
        <div style={{ background: "var(--neu-bg)", borderRadius: "20px", boxShadow: SH_OUT, padding: "2rem", marginBottom: "2rem", borderTop: "4px solid #f5a623" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--neu-text)", marginBottom: "1.5rem" }}>Register New Course</h3>
          <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
            <div>
              <FieldLabel>Course Code</FieldLabel>
              <input type="text" className="neu-input" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. CS-401" />
            </div>
            <div>
              <FieldLabel>Course Title</FieldLabel>
              <input type="text" className="neu-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Intro to AI" />
            </div>
            <div>
              <FieldLabel>Department</FieldLabel>
              <select className="neu-input" style={selStyle} value={formData.dept_id} onChange={e => setFormData({ ...formData, dept_id: e.target.value })}>
                <option value="">— Select Dept —</option>
                {departments.map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Credit Hours</FieldLabel>
              <input type="number" className="neu-input" value={formData.credits} onChange={e => setFormData({ ...formData, credits: e.target.value })} min="1" max="4" />
            </div>
            <div>
              <FieldLabel>Room / Hall</FieldLabel>
              <input type="text" className="neu-input" value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })} placeholder="e.g. Hall-1" />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button type="submit" disabled={saving}
                style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "none", cursor: saving ? "not-allowed" : "pointer", background: "linear-gradient(135deg,#f5a623,#f7b731)", boxShadow: "6px 6px 14px #e8d1a3,-4px -4px 10px #ffffff", color: "#fff", fontWeight: 800, fontSize: "0.9rem", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving…" : "Establish Course"}
              </button>
            </div>
            {errMsg && <div style={{ gridColumn: "span 3", fontSize: "0.82rem", color: "#e05c5c", fontWeight: 600 }}>⚠ {errMsg}</div>}
          </form>
        </div>
      )}

      <div style={{ background: "var(--neu-bg)", borderRadius: "20px", boxShadow: SH_OUT, overflow: "hidden" }}>
        <TblHead cols={["#", "Code", "Title", "Department", "Instructor", "Room", "Cr", "Action"]} />
        {courses.map((c, i) => {
          const color = DEPT_COLORS[c.department_name] ?? "#888";
          return (
            <TblRow key={c.course_id} i={i}>
              <C w="32px">{i + 1}</C>
              <C flex={0.8}><span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "3px 10px", borderRadius: "999px", background: "var(--neu-bg)", boxShadow: SH_IN_SM, color }}>{c.course_code}</span></C>
              <C flex={1.6} bold>{c.course_title}</C>
              <C flex={1.3}>{c.department_name}</C>
              <C flex={1.3}>{c.teacher_name ?? "Unassigned"}</C>
              <C flex={0.7}>{c.room_location ?? "—"}</C>
              <C flex={0.5}>{c.credits}</C>
              <C flex={0.5}>
                <button onClick={() => setDeletingId(c.course_id)}
                  style={{ padding: "6px", borderRadius: "8px", border: "none", background: "none", cursor: "pointer", color: "#e05c5c", opacity: 0.7 }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "0.7")}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </C>
            </TblRow>
          );
        })}
      </div>

      <ConfirmModal
        isOpen={!!deletingId}
        title="Remove Course"
        message="Are you sure you want to remove this course from the catalog? This will affect enrollments."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
