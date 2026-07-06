import { teacherProfile } from "../data";
import { IconMenu, IconBell } from "./icons";

const SH_BTN   = "9px 9px 16px #bebebe, -9px -9px 16px #ffffff";
const SH_BTN_P = "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff";

const sectionTitles: Record<string, string> = {
  dashboard:   "Dashboard",
  courses:     "My Courses",
  assessments: "Assessments",
  students:    "Students",
  settings:    "Settings",
};

interface HeaderProps {
  onToggleSidebar: () => void;
  activeSection:   string;
}

export default function TeacherHeader({ onToggleSidebar, activeSection }: HeaderProps) {
  const t    = teacherProfile;
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <header
      style={{
        height:         "68px",
        background:     "var(--neu-bg)",
        boxShadow:      "0 4px 16px #bebebe, 0 -2px 6px #ffffff",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "0 2rem",
        position:       "sticky",
        top:            0,
        zIndex:         20,
        gap:            "1rem",
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          style={{
            width: "38px", height: "38px", borderRadius: "10px",
            border: "none", cursor: "pointer", background: "var(--neu-bg)",
            boxShadow: SH_BTN, display: "flex", alignItems: "center",
            justifyContent: "center", color: "var(--neu-muted)",
            transition: "box-shadow 0.2s ease", flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = SH_BTN_P)}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = SH_BTN)}
        >
          <IconMenu size={19} />
        </button>

        <div>
          <h1 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--neu-text)", lineHeight: 1.2 }}>
            {sectionTitles[activeSection] ?? "Dashboard"}
          </h1>
          <p style={{ fontSize: "0.75rem", color: "var(--neu-muted)" }}>
            {greet}, {t.name.split(" ")[0]} 👋
          </p>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
        <button
          aria-label="Notifications"
          style={{
            width: "38px", height: "38px", borderRadius: "10px",
            border: "none", cursor: "pointer", background: "var(--neu-bg)",
            boxShadow: SH_BTN, display: "flex", alignItems: "center",
            justifyContent: "center", color: "var(--neu-muted)",
            position: "relative", transition: "box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = SH_BTN_P)}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = SH_BTN)}
        >
          <IconBell size={19} />
          <span style={{
            position: "absolute", top: "7px", right: "7px",
            width: "8px", height: "8px", borderRadius: "50%",
            background: "#e05c5c", border: "1.5px solid var(--neu-bg)",
          }} />
        </button>

        {/* Avatar */}
        <div
          style={{
            width: "42px", height: "42px", borderRadius: "50%",
            background: "var(--neu-bg)", boxShadow: SH_BTN,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: "1rem", color: "var(--neu-accent2)",
            flexShrink: 0,
          }}
        >
          {t.name.charAt(0)}
        </div>

        <div style={{ lineHeight: 1.3 }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--neu-text)", whiteSpace: "nowrap" }}>
            {t.name}
          </p>
          <p style={{ fontSize: "0.72rem", color: "var(--neu-muted)" }}>{t.designation}</p>
        </div>
      </div>
    </header>
  );
}
