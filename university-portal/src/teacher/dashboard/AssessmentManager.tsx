import { useState } from "react";
import {
  courseStudents, assessmentInstances, ASSESSMENT_TYPES,
  type AssessmentInstance, type AssessmentType, teacherCourses,
} from "../data";
import { IconPlus, IconChevronLeft, IconX } from "./icons";

const SH_OUT   = "9px 9px 16px #bebebe, -9px -9px 16px #ffffff";
const SH_IN_SM = "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff";
const SH_BTN   = "5px 5px 10px #bebebe, -5px -5px 10px #ffffff";
const SH_BTN_P = "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff";

interface Props {
  courseId: number;
  onBack:   () => void;
}

type DraftMarks = Record<string, string>; // studentId → raw input string

export default function AssessmentManager({ courseId, onBack }: Props) {
  const course   = teacherCourses.find((c) => c.id === courseId)!;
  const students = courseStudents[courseId] ?? [];
  const existing = assessmentInstances.filter((a) => a.courseId === courseId);

  const [instances, setInstances]   = useState<AssessmentInstance[]>(existing);
  const [showForm, setShowForm]      = useState(false);

  // Form state
  const [title,     setTitle]     = useState("");
  const [type,      setType]      = useState<AssessmentType>("Quiz");
  const [date,      setDate]      = useState("");
  const [total,     setTotal]     = useState("20");
  const [weightage, setWeightage] = useState("10");
  const [marks,     setMarks]     = useState<DraftMarks>({});

  const resetForm = () => {
    setTitle(""); setType("Quiz"); setDate("");
    setTotal("20"); setWeightage("10"); setMarks({});
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!title.trim() || !date) return;
    const results: Record<string, number | null> = {};
    students.forEach((s) => {
      const v = parseFloat(marks[s.id]);
      results[s.id] = isNaN(v) ? null : v;
    });
    const newInstance: AssessmentInstance = {
      id:         Date.now(),
      courseId,
      title:      title.trim(),
      type,
      date,
      totalMarks: parseFloat(total) || 0,
      weightage:  parseFloat(weightage) || 0,
      results,
    };
    setInstances((prev) => [...prev, newInstance]);
    resetForm();
  };

  const typeColor: Record<string, string> = {
    Quiz: "#6c63ff", Assignment: "#f5a623", Exam: "#e05c5c",
    Project: "#9b59b6", Lab: "#29b6c8",
  };

  return (
    <div>
      {/* Back + heading */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem" }}>
        <button
          onClick={onBack}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "8px 14px", borderRadius: "12px",
            border: "none", cursor: "pointer",
            background: "var(--neu-bg)", boxShadow: SH_BTN,
            fontSize: "0.82rem", fontWeight: 600, color: "var(--neu-muted)",
            transition: "box-shadow 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = SH_BTN_P)}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = SH_BTN)}
        >
          <IconChevronLeft size={15} /> Back
        </button>
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--neu-text)" }}>
            {course.code} — Assessments
          </h2>
          <p style={{ fontSize: "0.8rem", color: "var(--neu-muted)", marginTop: "2px" }}>
            {course.title} &nbsp;·&nbsp; {students.length} students enrolled
          </p>
        </div>

        {/* Add button */}
        <button
          onClick={() => setShowForm(true)}
          style={{
            marginLeft: "auto",
            display: "flex", alignItems: "center", gap: "6px",
            padding: "9px 18px", borderRadius: "12px",
            border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #48c97e, #5dd891)",
            boxShadow: "6px 6px 14px #b3ddc5, -4px -4px 10px #ffffff",
            fontSize: "0.85rem", fontWeight: 700, color: "#fff",
            transition: "filter 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
        >
          <IconPlus size={16} color="#fff" /> Add Assessment
        </button>
      </div>

      {/* ── Add Assessment Form ── */}
      {showForm && (
        <div
          style={{
            background: "var(--neu-bg)", borderRadius: "20px",
            boxShadow: SH_OUT, padding: "1.75rem",
            marginBottom: "1.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--neu-text)" }}>
              New Assessment
            </h3>
            <button
              onClick={resetForm}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--neu-muted)" }}
            >
              <IconX size={18} />
            </button>
          </div>

          {/* Meta fields */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
            {/* Title */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Assessment Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Quiz 2, Midterm Exam…"
                style={inputStyle}
              />
            </div>

            {/* Type */}
            <div>
              <label style={labelStyle}>Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AssessmentType)}
                style={inputStyle}
              >
                {ASSESSMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Date */}
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
            </div>

            {/* Total marks */}
            <div>
              <label style={labelStyle}>Total Marks</label>
              <input
                type="number" min="1" value={total}
                onChange={(e) => setTotal(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Weightage */}
            <div>
              <label style={labelStyle}>Weightage (%)</label>
              <input
                type="number" min="0" max="100" value={weightage}
                onChange={(e) => setWeightage(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Per-student marks table */}
          <div
            style={{
              background: "var(--neu-bg)", borderRadius: "14px",
              boxShadow: SH_IN_SM, overflow: "hidden", marginBottom: "1.25rem",
            }}
          >
            {/* Table header */}
            <div style={tableHeaderStyle}>
              <span style={{ flex: 1 }}>Student</span>
              <span style={{ flex: 1 }}>Student ID</span>
              <span style={{ width: "130px", textAlign: "center" }}>
                Marks Obtained / {total || "—"}
              </span>
            </div>

            {/* Student rows */}
            {students.map((s, i) => (
              <div
                key={s.id}
                style={{
                  ...tableRowStyle,
                  background: i % 2 === 0 ? "var(--neu-bg)" : "rgba(0,0,0,0.015)",
                }}
              >
                <span style={{ flex: 1, fontWeight: 600, fontSize: "0.88rem", color: "var(--neu-text)" }}>
                  {s.name}
                </span>
                <span style={{ flex: 1, fontSize: "0.82rem", color: "var(--neu-muted)" }}>
                  {s.id}
                </span>
                <div style={{ width: "130px", textAlign: "center" }}>
                  <input
                    type="number"
                    min="0"
                    max={total}
                    placeholder="—"
                    value={marks[s.id] ?? ""}
                    onChange={(e) => setMarks((prev) => ({ ...prev, [s.id]: e.target.value }))}
                    style={{
                      width: "90px",
                      padding: "6px 10px",
                      borderRadius: "10px",
                      border: "none", outline: "none",
                      background: "var(--neu-bg)",
                      boxShadow: SH_IN_SM,
                      fontSize: "0.88rem",
                      color: "var(--neu-text)",
                      textAlign: "center",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button
              onClick={resetForm}
              style={{
                padding: "9px 20px", borderRadius: "12px",
                border: "none", cursor: "pointer",
                background: "var(--neu-bg)", boxShadow: SH_BTN,
                fontSize: "0.85rem", fontWeight: 600, color: "var(--neu-muted)",
                transition: "box-shadow 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = SH_BTN_P)}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = SH_BTN)}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              style={{
                padding: "9px 24px", borderRadius: "12px",
                border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #6c63ff, #8b85ff)",
                boxShadow: "6px 6px 14px #a9a3e8, -4px -4px 10px #ffffff",
                fontSize: "0.85rem", fontWeight: 700, color: "#fff",
                transition: "filter 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            >
              Save Assessment
            </button>
          </div>
        </div>
      )}

      {/* ── Existing assessments list ── */}
      {instances.length === 0 ? (
        <div
          style={{
            background: "var(--neu-bg)", borderRadius: "18px",
            boxShadow: SH_OUT, padding: "3rem 2rem",
            textAlign: "center", color: "var(--neu-muted)",
          }}
        >
          <p style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📋</p>
          <p style={{ fontWeight: 600, color: "var(--neu-text)", marginBottom: "4px" }}>No assessments yet</p>
          <p style={{ fontSize: "0.85rem" }}>Click "Add Assessment" to create the first one.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {instances.map((inst) => {
            const submitted = Object.values(inst.results).filter((v) => v !== null).length;
            const pending   = students.length - submitted;
            const avg       = submitted > 0
              ? (Object.values(inst.results).filter((v) => v !== null).reduce((a, b) => a + (b ?? 0), 0) / submitted).toFixed(1)
              : "—";

            return (
              <div
                key={inst.id}
                style={{
                  background: "var(--neu-bg)", borderRadius: "18px",
                  boxShadow: SH_OUT, padding: "1.25rem 1.5rem",
                  borderLeft: `4px solid ${typeColor[inst.type] ?? "#888"}`,
                }}
              >
                {/* Top row */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: "0.72rem", fontWeight: 800,
                      padding: "3px 10px", borderRadius: "999px",
                      background: "var(--neu-bg)", boxShadow: SH_IN_SM,
                      color: typeColor[inst.type] ?? "#888",
                    }}
                  >
                    {inst.type}
                  </span>
                  <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--neu-text)" }}>
                    {inst.title}
                  </p>
                  <span style={{ fontSize: "0.8rem", color: "var(--neu-muted)", marginLeft: "auto" }}>
                    📅 {inst.date}
                  </span>
                </div>

                {/* Stats row */}
                <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.9rem", flexWrap: "wrap" }}>
                  <Stat label="Total Marks"  value={String(inst.totalMarks)} />
                  <Stat label="Weightage"    value={`${inst.weightage}%`} />
                  <Stat label="Submitted"    value={`${submitted} / ${students.length}`} />
                  <Stat label="Pending"      value={String(pending)} color={pending > 0 ? "#f5a623" : "#48c97e"} />
                  <Stat label="Class Avg"    value={avg === "—" ? "—" : `${avg} / ${inst.totalMarks}`} />
                </div>

                {/* Per-student results */}
                <div
                  style={{
                    marginTop: "1rem",
                    background: "var(--neu-bg)", borderRadius: "12px",
                    boxShadow: SH_IN_SM, overflow: "hidden",
                  }}
                >
                  <div style={tableHeaderStyle}>
                    <span style={{ flex: 1 }}>Student</span>
                    <span style={{ flex: 1 }}>ID</span>
                    <span style={{ width: "120px", textAlign: "center" }}>Score</span>
                    <span style={{ width: "90px",  textAlign: "center" }}>Status</span>
                  </div>
                  {students.map((s, i) => {
                    const obtained = inst.results[s.id];
                    const pct      = obtained !== null && obtained !== undefined
                      ? Math.round((obtained / inst.totalMarks) * 100)
                      : null;
                    return (
                      <div
                        key={s.id}
                        style={{ ...tableRowStyle, background: i % 2 === 0 ? "var(--neu-bg)" : "rgba(0,0,0,0.015)" }}
                      >
                        <span style={{ flex: 1, fontWeight: 600, fontSize: "0.88rem", color: "var(--neu-text)" }}>
                          {s.name}
                        </span>
                        <span style={{ flex: 1, fontSize: "0.82rem", color: "var(--neu-muted)" }}>{s.id}</span>
                        <span style={{ width: "120px", textAlign: "center", fontSize: "0.88rem", fontWeight: 600, color: "var(--neu-text)" }}>
                          {obtained !== null && obtained !== undefined ? `${obtained} / ${inst.totalMarks}` : "—"}
                        </span>
                        <span style={{ width: "90px", textAlign: "center" }}>
                          <span
                            style={{
                              fontSize: "0.7rem", fontWeight: 700,
                              padding: "2px 9px", borderRadius: "999px",
                              background: obtained !== null && obtained !== undefined
                                ? (pct! >= 80 ? "rgba(72,201,126,0.15)" : pct! >= 50 ? "rgba(245,166,35,0.15)" : "rgba(224,92,92,0.15)")
                                : "rgba(0,0,0,0.06)",
                              color: obtained !== null && obtained !== undefined
                                ? (pct! >= 80 ? "#48c97e" : pct! >= 50 ? "#f5a623" : "#e05c5c")
                                : "var(--neu-muted)",
                            }}
                          >
                            {obtained !== null && obtained !== undefined ? `${pct}%` : "Pending"}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Shared style helpers ──────────────────────────────────────────────────────
function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{
      background: "var(--neu-bg)", borderRadius: "10px",
      boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
      padding: "7px 14px", textAlign: "center",
    }}>
      <p style={{ fontSize: "1rem", fontWeight: 800, color: color ?? "var(--neu-accent2)", lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: "0.68rem", color: "var(--neu-muted)", marginTop: "3px" }}>{label}</p>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.72rem", fontWeight: 700,
  color: "var(--neu-muted)", textTransform: "uppercase",
  letterSpacing: "0.5px", marginBottom: "5px",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.75rem 1rem",
  borderRadius: "12px", border: "none", outline: "none",
  background: "var(--neu-bg)",
  boxShadow: "inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff",
  fontSize: "0.875rem", color: "var(--neu-text)",
};

const tableHeaderStyle: React.CSSProperties = {
  display: "flex", alignItems: "center",
  padding: "9px 14px",
  background: "rgba(0,0,0,0.03)",
  borderBottom: "1px solid #d8d8d8",
  fontSize: "0.72rem", fontWeight: 700,
  color: "var(--neu-muted)", textTransform: "uppercase",
  letterSpacing: "0.4px", gap: "1rem",
};

const tableRowStyle: React.CSSProperties = {
  display: "flex", alignItems: "center",
  padding: "10px 14px",
  borderBottom: "1px solid #e8e8e8",
  gap: "1rem",
};
