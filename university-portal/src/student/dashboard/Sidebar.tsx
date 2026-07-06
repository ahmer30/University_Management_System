import { navItems } from "../data";
import { getNavIcon } from "./icons";

interface SidebarProps {
  active: string;
  onSelect: (id: string) => void;
  collapsed: boolean;
}

export default function Sidebar({ active, onSelect, collapsed }: SidebarProps) {
  return (
    <aside
      style={{
        width: collapsed ? "72px" : "230px",
        minHeight: "100vh",
        background: "var(--neu-bg)",
        boxShadow: "4px 0 24px #bebebe, -2px 0 8px #ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: collapsed ? "center" : "stretch",
        paddingTop: "1.5rem",
        paddingBottom: "2rem",
        transition: "width 0.25s ease",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        zIndex: 10,
      }}
    >
      {/* Logo area */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: "0.75rem",
          padding: collapsed ? "0 0 1.5rem 0" : "0 1.25rem 1.5rem 1.25rem",
          borderBottom: "1px solid #d0d0d0",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            width: "38px", height: "38px",
            borderRadius: "10px",
            background: "var(--neu-bg)",
            boxShadow: "9px 9px 16px #bebebe, -9px -9px 16px #ffffff",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="var(--neu-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          </svg>
        </div>
        {!collapsed && (
          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--neu-text)", whiteSpace: "nowrap" }}>
            UMS Portal
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", padding: collapsed ? "0 8px" : "0 12px" }}>
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.875rem",
                padding: collapsed ? "12px" : "11px 16px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontWeight: isActive ? 600 : 500,
                fontSize: "0.875rem",
                color: isActive ? "var(--neu-accent)" : "var(--neu-muted)",
                background: "var(--neu-bg)",
                boxShadow: isActive
                  ? "inset 9px 9px 16px #bebebe, inset -9px -9px 16px #ffffff"
                  : "none",
                transition: "box-shadow 0.2s ease, color 0.2s ease",
                justifyContent: collapsed ? "center" : "flex-start",
                whiteSpace: "nowrap",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "9px 9px 16px #bebebe, -9px -9px 16px #ffffff";
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
              {getNavIcon(item.icon, 19, isActive ? "var(--neu-accent)" : "currentColor")}
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Semester badge */}
      {!collapsed && (
        <div
          style={{
            margin: "0 12px",
            padding: "10px 14px",
            borderRadius: "12px",
            background: "var(--neu-bg)",
            boxShadow: "inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff",
            fontSize: "0.75rem",
            color: "var(--neu-muted)",
            lineHeight: 1.5,
          }}
        >
          <p style={{ fontWeight: 700, color: "var(--neu-accent)", marginBottom: "2px" }}>Fall 2026</p>
          <p>Current Semester</p>
        </div>
      )}
    </aside>
  );
}
