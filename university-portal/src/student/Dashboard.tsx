import { useState } from "react";
import Sidebar from "./dashboard/Sidebar";
import Header from "./dashboard/Header";
import StatsRow from "./dashboard/StatsRow";
import CoursesGrid from "./dashboard/CoursesGrid";
import ProfilePanel from "./dashboard/ProfilePanel";

export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--neu-bg)",
      }}
    >
      {/* ── Sidebar ── */}
      <Sidebar
        active={activeSection}
        onSelect={setActiveSection}
        collapsed={sidebarCollapsed}
      />

      {/* ── Main column ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* ── Header ── */}
        <Header
          onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
          onOpenProfile={() => setProfileOpen(true)}
          activeSection={activeSection}
        />

        {/* ── Scrollable content ── */}
        <main
          style={{
            flex: 1,
            padding: "2rem 2.25rem",
            overflowY: "auto",
          }}
        >
          {activeSection === "dashboard" && (
            <>
              <StatsRow />
              <CoursesGrid />
            </>
          )}

          {activeSection === "courses" && (
            <>
              <StatsRow />
              <CoursesGrid />
            </>
          )}

          {/* Placeholder sections — to be built out */}
          {["grades", "attendance", "timetable", "messages", "settings"].includes(activeSection) && (
            <div
              style={{
                background: "var(--neu-bg)",
                borderRadius: "18px",
                boxShadow: "6px 6px 14px #bebebe, -6px -6px 14px #ffffff",
                padding: "3rem 2rem",
                textAlign: "center",
                color: "var(--neu-muted)",
                fontSize: "0.95rem",
              }}
            >
              <p style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🚧</p>
              <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--neu-text)", marginBottom: "6px" }}>
                Coming Soon
              </p>
              <p>This section is being built out. Stay tuned!</p>
            </div>
          )}
        </main>
      </div>

      {/* ── Profile slide-in panel ── */}
      {profileOpen && (
        <ProfilePanel onClose={() => setProfileOpen(false)} />
      )}
    </div>
  );
}
