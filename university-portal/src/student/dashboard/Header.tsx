import { studentProfile } from "../data";
import { IconMenu, IconBell } from "./icons";

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenProfile: () => void;
  activeSection: string;
}

const sectionTitles: Record<string, string> = {
  dashboard:  "Dashboard",
  courses:    "My Courses",
  grades:     "Grades",
  attendance: "Attendance",
  timetable:  "Timetable",
  messages:   "Messages",
  settings:   "Settings",
};

export default function Header({ onToggleSidebar, onOpenProfile, activeSection }: HeaderProps) {
  const p = studentProfile;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <header
      style={{
        height: "68px",
        background: "var(--neu-bg)",
        boxShadow: "0 4px 16px #bebebe, 0 -2px 6px #ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        position: "sticky",
        top: 0,
        zIndex: 20,
        gap: "1rem",
      }}
    >
      {/* Left: hamburger + title */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          style={{
            width: "38px", height: "38px",
            borderRadius: "10px",
            border: "none", cursor: "pointer",
            background: "var(--neu-bg)",
            boxShadow: "9px 9px 16px #bebebe, -9px -9px 16px #ffffff",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--neu-muted)",
            transition: "box-shadow 0.2s ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "9px 9px 16px #bebebe, -9px -9px 16px #ffffff")}
        >
          <IconMenu size={19} />
        </button>

        <div>
          <h1 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--neu-text)", lineHeight: 1.2 }}>
            {sectionTitles[activeSection] ?? "Dashboard"}
          </h1>
          <p style={{ fontSize: "0.75rem", color: "var(--neu-muted)" }}>
            {greeting}, {p.name.split(" ")[0]} 👋
          </p>
        </div>
      </div>

      {/* Right: bell + profile avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>

        {/* Notification bell */}
        <button
          aria-label="Notifications"
          style={{
            width: "38px", height: "38px",
            borderRadius: "10px",
            border: "none", cursor: "pointer",
            background: "var(--neu-bg)",
            boxShadow: "9px 9px 16px #bebebe, -9px -9px 16px #ffffff",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--neu-muted)",
            position: "relative",
            transition: "box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "9px 9px 16px #bebebe, -9px -9px 16px #ffffff")}
        >
          <IconBell size={19} />
          {/* red dot */}
          <span
            style={{
              position: "absolute", top: "7px", right: "7px",
              width: "8px", height: "8px", borderRadius: "50%",
              background: "#e05c5c",
              border: "1.5px solid var(--neu-bg)",
            }}
          />
        </button>

        {/* Profile avatar — clicking opens profile panel */}
        <button
          onClick={onOpenProfile}
          aria-label="Open profile"
          style={{
            width: "42px", height: "42px",
            borderRadius: "50%",
            border: "none", cursor: "pointer",
            background: "var(--neu-bg)",
            boxShadow: "9px 9px 16px #bebebe, -9px -9px 16px #ffffff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: "1rem",
            color: "var(--neu-accent)",
            transition: "box-shadow 0.2s ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "9px 9px 16px #bebebe, -9px -9px 16px #ffffff")}
        >
          {p.name.charAt(0)}
        </button>

        {/* Name beside avatar */}
        <div style={{ lineHeight: 1.3 }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--neu-text)", whiteSpace: "nowrap" }}>
            {p.name}
          </p>
          <p style={{ fontSize: "0.72rem", color: "var(--neu-muted)" }}>{p.id}</p>
        </div>

      </div>
    </header>
  );
}
