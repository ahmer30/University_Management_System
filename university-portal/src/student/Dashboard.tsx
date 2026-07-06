import { useState } from "react";
import Sidebar from "./dashboard/Sidebar";
import Header from "./dashboard/Header";
import CoursesGrid from "./dashboard/CoursesGrid";
import ProfilePanel from "./dashboard/ProfilePanel";
import { DeadlinesWidget, AnnouncementsWidget } from "./dashboard/DashboardWidgets";

export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--neu-bg)" }}>

      {/* ── Left sidebar ── */}
      <Sidebar
        active={activeSection}
        onSelect={setActiveSection}
        collapsed={sidebarCollapsed}
      />

      {/* ── Main column ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* ── Sticky header ── */}
        <Header
          onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
          onOpenProfile={() => setProfileOpen(true)}
          activeSection={activeSection}
        />

        {/* ── Page content ── */}
        <main style={{ flex: 1, overflowY: "auto", padding: "2rem 2rem 3rem" }}>

          {/* ════ DASHBOARD ════ */}
          {activeSection === "dashboard" && (
            <div>
              {/* Two-column layout: courses (left wide) + sidebar widgets (right) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 310px",
                  gap: "1.5rem",
                  alignItems: "start",
                }}
              >
                {/* Left — course cards */}
                <CoursesGrid />

                {/* Right — deadlines + announcements stacked */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "sticky", top: "1.5rem" }}>
                  <DeadlinesWidget />
                  <AnnouncementsWidget />
                </div>
              </div>
            </div>
          )}

          {/* ════ MY COURSES (full width, no sidebar widgets) ════ */}
          {activeSection === "courses" && (
            <div>
              <CoursesGrid />
            </div>
          )}

          {/* ════ PLACEHOLDER SECTIONS ════ */}
          {["grades", "attendance", "timetable", "messages", "settings"].includes(activeSection) && (
            <ComingSoon />
          )}
        </main>
      </div>

      {/* ── Profile slide-in panel ── */}
      {profileOpen && <ProfilePanel onClose={() => setProfileOpen(false)} />}
    </div>
  );
}

// ── Coming Soon placeholder ──────────────────────────────────────────────────
function ComingSoon() {
  return (
    <div
      style={{
        background: "var(--neu-bg)",
        borderRadius: "20px",
        boxShadow: "9px 9px 16px #bebebe, -9px -9px 16px #ffffff",
        padding: "4rem 2rem",
        textAlign: "center",
        color: "var(--neu-muted)",
      }}
    >
      <div
        style={{
          width: "72px", height: "72px",
          margin: "0 auto 1.25rem",
          borderRadius: "18px",
          background: "var(--neu-bg)",
          boxShadow: "inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2rem",
        }}
      >
        🚧
      </div>
      <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--neu-text)", marginBottom: "6px" }}>
        Coming Soon
      </p>
      <p style={{ fontSize: "0.875rem" }}>This section is being built out.</p>
    </div>
  );
}
