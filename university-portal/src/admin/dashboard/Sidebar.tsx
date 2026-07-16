import { adminNavItems } from "../data";

const SH_OUT = "9px 9px 16px #bebebe, -9px -9px 16px #ffffff";
const SH_IN  = "inset 9px 9px 16px #bebebe, inset -9px -9px 16px #ffffff";

function Icon({ id, size = 19, color = "currentColor" }: { id: string; size?: number; color?: string }) {
  const s = { width: size, height: size };
  switch (id) {
    case "home":     return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case "users":    return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "graduate": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5"/></svg>;
    case "book":     return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
    case "building": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>;
    case "plus":     return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
    case "list":     return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
    default:         return null;
  }
}

interface Props { active: string; onSelect: (id: string) => void; collapsed: boolean; }

export default function AdminSidebar({ active, onSelect, collapsed }: Props) {
  return (
    <aside style={{
      width: collapsed ? "72px" : "230px",
      height: "100vh", background: "var(--neu-bg)",
      boxShadow: "4px 0 20px #bebebe, -2px 0 6px #ffffff",
      display: "flex", flexDirection: "column",
      paddingTop: "1.5rem", paddingBottom: "2rem",
      transition: "width 0.25s ease",
      flexShrink: 0, position: "sticky", top: 0,
      overflowY: "auto", overflowX: "hidden", zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: "0.75rem",
        padding: collapsed ? "0 0 1.5rem 0" : "0 1.25rem 1.5rem 1.25rem",
        borderBottom: "1px solid #d0d0d0", marginBottom: "1rem",
      }}>
        <div style={{ width:"38px",height:"38px",borderRadius:"10px",background:"var(--neu-bg)",boxShadow:SH_OUT,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e05c5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        {!collapsed && <span style={{ fontWeight:800,fontSize:"0.9rem",color:"var(--neu-text)",whiteSpace:"nowrap" }}>Admin Panel</span>}
      </div>

      {/* Nav */}
      <nav style={{ display:"flex",flexDirection:"column",gap:"4px",padding:collapsed?"0 8px":"0 12px" }}>
        {adminNavItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onSelect(item.id)} title={collapsed ? item.label : undefined}
              style={{
                display:"flex",alignItems:"center",gap:"0.875rem",
                padding:collapsed?"12px":"11px 16px",
                borderRadius:"12px",border:"none",cursor:"pointer",
                fontWeight:isActive?600:500,fontSize:"0.875rem",
                color:isActive?"#e05c5c":"var(--neu-muted)",
                background:"var(--neu-bg)",
                boxShadow:isActive?SH_IN:"none",
                transition:"box-shadow 0.2s ease,color 0.2s ease",
                justifyContent:collapsed?"center":"flex-start",
                whiteSpace:"nowrap",width:"100%",
              }}
              onMouseEnter={(e) => { if(!isActive){ (e.currentTarget as HTMLButtonElement).style.boxShadow=SH_OUT; (e.currentTarget as HTMLButtonElement).style.color="var(--neu-text)"; }}}
              onMouseLeave={(e) => { if(!isActive){ (e.currentTarget as HTMLButtonElement).style.boxShadow="none"; (e.currentTarget as HTMLButtonElement).style.color="var(--neu-muted)"; }}}
            >
              <Icon id={item.icon} size={19} color={isActive?"#e05c5c":"currentColor"} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div style={{ flex:1 }} />

      {/* Sign out */}
      {!collapsed && (
        <div style={{ margin:"0 12px" }}>
          <button
            onClick={() => { localStorage.removeItem("ums_admin"); window.location.href="/"; }}
            style={{
              width:"100%",padding:"10px 14px",borderRadius:"12px",
              border:"none",cursor:"pointer",
              background:"var(--neu-bg)",boxShadow:SH_OUT,
              fontSize:"0.82rem",fontWeight:600,color:"#e05c5c",
              transition:"box-shadow 0.15s ease",
            }}
            onMouseEnter={(e)=>(e.currentTarget.style.boxShadow=SH_IN)}
            onMouseLeave={(e)=>(e.currentTarget.style.boxShadow=SH_OUT)}
          >
            ← Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}
