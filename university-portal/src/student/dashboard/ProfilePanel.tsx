import { studentProfile } from "../data";

interface ProfilePanelProps {
  onClose: () => void;
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div
    style={{
      background: "var(--neu-bg)",
      borderRadius: "10px",
      boxShadow: "inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff",
      padding: "10px 14px",
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    }}
  >
    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--neu-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
      {label}
    </span>
    <span style={{ fontSize: "0.875rem", color: "var(--neu-text)", fontWeight: 500 }}>{value}</span>
  </div>
);

export default function ProfilePanel({ onClose }: ProfilePanelProps) {
  const p = studentProfile || { name: "Student", id: "0000", gpa: 0, program: "N/A", semester: "N/A", enrollmentDate: "N/A", advisor: "N/A", email: "N/A", phone: "N/A", dob: "N/A", address: "N/A" };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(180,180,180,0.35)",
          zIndex: 40,
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Slide-in panel */}
      <aside
        style={{
          position: "fixed",
          top: 0, right: 0,
          width: "340px",
          height: "100vh",
          background: "var(--neu-bg)",
          boxShadow: "-6px 0 32px #bebebe, 2px 0 8px #ffffff",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          padding: "2rem 1.75rem",
          gap: "1.25rem",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            alignSelf: "flex-end",
            width: "34px", height: "34px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            background: "var(--neu-bg)",
            boxShadow: "3px 3px 6px #bebebe, -3px -3px 6px #ffffff",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--neu-muted)",
            flexShrink: 0,
          }}
          aria-label="Close profile"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6"  y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Avatar + name */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "90px", height: "90px",
              borderRadius: "50%",
              background: "var(--neu-bg)",
              boxShadow: "6px 6px 12px #bebebe, -6px -6px 12px #ffffff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", fontWeight: 800,
              color: "var(--neu-accent)",
            }}
          >
            {(p.name || "S").charAt(0)}
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--neu-text)" }}>{p.name}</p>
            <p style={{ fontSize: "0.8rem", color: "var(--neu-muted)", marginTop: "2px" }}>{p.id}</p>
          </div>

          {/* GPA badge */}
          <div
            style={{
              padding: "5px 18px",
              borderRadius: "999px",
              background: "var(--neu-bg)",
              boxShadow: "inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff",
              fontSize: "0.8rem", fontWeight: 700,
              color: "var(--neu-accent)",
            }}
          >
            GPA {p.gpa}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #bebebe, transparent)" }} />

        {/* Info rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--neu-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>
            Personal Information
          </p>
          <Row label="Program"         value={p.program} />
          <Row label="Semester"        value={p.semester} />
          <Row label="Enrollment Date" value={p.enrollmentDate} />
          <Row label="Academic Advisor" value={p.advisor} />
        </div>

        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #bebebe, transparent)" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--neu-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>
            Contact Details
          </p>
          <Row label="Email"   value={p.email} />
          <Row label="Phone"   value={p.phone} />
          <Row label="DOB"     value={p.dob} />
          <Row label="Address" value={p.address} />
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #bebebe, transparent)" }} />

        {/* Sign out */}
        <button
          style={{
            marginTop: "auto",
            padding: "11px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "#e05c5c",
            background: "var(--neu-bg)",
            boxShadow: "4px 4px 8px #bebebe, -4px -4px 8px #ffffff",
            transition: "box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "4px 4px 8px #bebebe, -4px -4px 8px #ffffff")}
        >
          Sign Out
        </button>
      </aside>
    </>
  );
}
