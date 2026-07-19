import React from "react";

export const SH_OUT   = "9px 9px 16px #bebebe, -9px -9px 16px #ffffff";
export const SH_HOVER = "12px 12px 20px #bebebe, -12px -12px 20px #ffffff";
export const SH_IN_SM = "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff";
export const SH_BTN   = "5px 5px 10px #bebebe, -5px -5px 10px #ffffff";
export const SH_BTN_P = "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff";

export const selStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.9rem 1.2rem",
  borderRadius: "14px",
  border: "none",
  outline: "none",
  background: "var(--neu-bg)",
  boxShadow: "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff",
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "var(--neu-text)",
  cursor: "pointer",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%237a7a7a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 1rem center",
  backgroundSize: "1.1em",
  transition: "box-shadow 0.2s ease, transform 0.1s ease",
};

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--neu-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>{children}</p>;
}

export function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--neu-text)" }}>{title}</h2>
      <p style={{ fontSize: "0.82rem", color: "var(--neu-muted)", marginTop: "3px" }}>{sub}</p>
    </div>
  );
}

export function TblHead({ cols }: { cols: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "10px 16px", background: "rgba(0,0,0,0.03)", borderBottom: "1px solid #d8d8d8" }}>
      {cols.map((c, i) => <span key={i} style={{ flex: i === 0 ? undefined : 1, width: i === 0 ? "32px" : undefined, fontSize: "0.72rem", fontWeight: 700, color: "var(--neu-muted)", textTransform: "uppercase", letterSpacing: "0.4px", flexShrink: 0 }}>{c}</span>)}
    </div>
  );
}

export function TblRow({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "12px 16px", borderBottom: "1px solid #e8e8e8", background: i % 2 === 0 ? "var(--neu-bg)" : "rgba(0,0,0,0.015)", transition: "background 0.15s" }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(99,102,241,0.04)"}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = i % 2 === 0 ? "var(--neu-bg)" : "rgba(0,0,0,0.015)"}
    >
      {children}
    </div>
  );
}

export function C({ children, w, flex, bold, mono, color }: { children: React.ReactNode; w?: string; flex?: number; bold?: boolean; mono?: boolean; color?: string }) {
  return <span style={{ width: w, flex: flex ?? (w ? undefined : 1), fontSize: "0.875rem", fontWeight: bold ? 700 : 400, fontFamily: mono ? "monospace" : undefined, color: color ?? (bold ? "var(--neu-text)" : "var(--neu-muted)"), flexShrink: 0 }}>{children}</span>;
}

export function StatPill({ val, label, small }: { val: string; label: string; small?: boolean }) {
  return (
    <div style={{ background: "var(--neu-bg)", borderRadius: "10px", boxShadow: SH_IN_SM, padding: small ? "4px 10px" : "7px 14px", textAlign: "center", flex: 1 }}>
      <p style={{ fontSize: small ? "0.82rem" : "1rem", fontWeight: 800, color: "var(--neu-muted)", lineHeight: 1 }}>{val}</p>
      <p style={{ fontSize: "0.68rem", color: "var(--neu-muted)", marginTop: "2px" }}>{label}</p>
    </div>
  );
}

export function StatusBadge({ s }: { s: string }) {
  const c = s === "Active" ? "#48c97e" : s === "On Leave" ? "#f5a623" : "#e05c5c";
  return <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 9px", borderRadius: "999px", background: `${c}18`, color: c }}>{s}</span>;
}

export function ProgBadge({ p }: { p: string }) {
  const m: Record<string, string> = { BSCS: "#6c63ff", BSEE: "#e05c5c", BSM: "#48c97e", BSBBA: "#f5a623", BSMATH: "#48c97e" };
  const c = m[p] ?? "#888";
  return <span style={{ fontSize: "0.7rem", fontWeight: 800, padding: "2px 9px", borderRadius: "999px", background: `${c}18`, color: c }}>{p}</span>;
}

export function Empty({ msg }: { msg: string }) {
  return (
    <div style={{ background: "var(--neu-bg)", borderRadius: "18px", boxShadow: SH_OUT, padding: "3rem", textAlign: "center", color: "var(--neu-muted)" }}>
      <p style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📂</p>
      <p style={{ fontSize: "0.88rem" }}>{msg}</p>
    </div>
  );
}

export function StepLabel({ num, title, active }: { num: string; title: string; active: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "var(--neu-bg)", boxShadow: active ? SH_OUT : SH_IN_SM, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, color: active ? "var(--neu-accent)" : "var(--neu-muted)" }}>
        {num}
      </div>
      <h4 style={{ fontSize: "0.82rem", fontWeight: 800, color: active ? "var(--neu-text)" : "var(--neu-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {title}
      </h4>
    </div>
  );
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete" }: { isOpen: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void; confirmText?: string }) {
  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.15)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ width: "380px", background: "var(--neu-bg)", borderRadius: "24px", boxShadow: SH_OUT, padding: "2rem", textAlign: "center" }}>
        <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "var(--neu-bg)", boxShadow: SH_IN_SM, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", color: "#e05c5c" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--neu-text)", marginBottom: "0.5rem" }}>{title}</h3>
        <p style={{ fontSize: "0.88rem", color: "var(--neu-muted)", marginBottom: "2rem", lineHeight: 1.6 }}>{message}</p>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", cursor: "pointer", background: "var(--neu-bg)", boxShadow: SH_BTN, fontWeight: 700, color: "var(--neu-muted)", transition: "all 0.15s" }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", cursor: "pointer", background: "linear-gradient(135deg, #e05c5c, #f17b7b)", boxShadow: "6px 6px 12px #d4b4b4, -4px -4px 10px #ffffff", fontWeight: 700, color: "#fff", transition: "all 0.15s" }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
