import { teacherNavItems } from "../data";
import { getNavIcon } from "./icons";

const SH_OUT   = "9px 9px 16px #bebebe, -9px -9px 16px #ffffff";
const SH_IN    = "inset 9px 9px 16px #bebebe, inset -9px -9px 16px #ffffff";

interface SidebarProps {
  active: string;
  onSelect: (id: string) => void;
  collapsed: boolean;
}

export default function TeacherSidebar({ active, onSelect, collapsed }: SidebarProps) {
  return (
    <aside
      style={{
        width:          collapsed ? "72px" : "230px",
        height:         "100vh",
        background:     "var(--neu-bg)",
        boxShadow:      "4px 0 20px #bebebe, -2px 0 6px #ffffff",
        display:        "flex",
        flexDirection:  "column",
        paddingTop:     "1.5rem",
        paddingBottom:  "2rem",
        transition:     "width 0.25s ease",
        flexShrink:     0,
        position:       "sticky",
        top:            0,
        overflowY:      "auto",
        overflowX:      "hidden",
        zIndex:         10,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap:            "0.75rem",
          padding:        collapsed ? "0 0 1.5rem 0" : "0 1.25rem 1.5rem 1.25rem",
          borderBottom:   "1px solid #d0d0d0",
          marginBottom:   "1rem",
        }}
      >
        <div
          style={{
            width: "38px", height: "38px", borderRadius: "10px",
            background: "var(--neu-bg)", boxShadow: SH_OUT,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="var(--neu-accent2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
          </svg>
        </div>
        {!collapsed && (
          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--neu-text)", whiteSpace: "nowrap" }}>
            UMS Faculty
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", padding: collapsed ? "0 8px" : "0 12px" }}>
        {teacherNavItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                display:        "flex",
                alignItems:     "center",
                gap:            "0.875rem",
                padding:        collapsed ? "12px" : "11px 16px",
                borderRadius:   "12px",
                border:         "none",
                cursor:         "pointer",
                fontWeight:     isActive ? 600 : 500,
                fontSize:       "0.875rem",
                color:          isActive ? "var(--neu-accent2)" : "var(--neu-muted)",
                background:     "var(--neu-bg)",
                boxShadow:      isActive ? SH_IN : "none",
                transition:     "box-shadow 0.2s ease, color 0.2s ease",
                justifyContent: collapsed ? "center" : "flex-start",
                whiteSpace:     "nowrap",
                width:          "100%",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = SH_OUT;
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--neu-text)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--neu-muted)";
                }
              }}
            >
              {getNavIcon(item.icon, 19, isActive ? "var(--neu-accent2)" : "currentColor")}
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Semester badge */}
      {!collapsed && (
        <div
          style={{
            margin: "0 12px", padding: "10px 14px", borderRadius: "12px",
            background: "var(--neu-bg)",
            boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
            fontSize: "0.75rem", color: "var(--neu-muted)", lineHeight: 1.5,
          }}
        >
          <p style={{ fontWeight: 700, color: "var(--neu-accent2)", marginBottom: "2px" }}>Fall 2026</p>
          <p>Current Semester</p>
        </div>
      )}
    </aside>
  );
}
