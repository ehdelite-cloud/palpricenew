/* ══════════════════════════════════════
   مكوّنات مشتركة للوحة الإدارة
══════════════════════════════════════ */

export function CircularProgress({ pct = 0, size = 110, stroke = 10, color = "#6366f1", bg = "rgba(255,255,255,0.2)", children }) {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(pct, 100) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", display: "block", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1.2s ease" }} />
      <foreignObject x={stroke} y={stroke} width={size - stroke * 2} height={size - stroke * 2}>
        <div xmlns="http://www.w3.org/1999/xhtml"
          style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(90deg)" }}>
          {children}
        </div>
      </foreignObject>
    </svg>
  );
}

export function HBar({ pct = 0, color = "#6366f1", height = 8, bg = "#f1f5f9" }) {
  return (
    <div style={{ height, borderRadius: 99, background: bg, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 99, transition: "width 1.2s ease" }} />
    </div>
  );
}

export function SegBar({ value = 0, max = 10, color = "#22c55e" }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {Array.from({ length: Math.min(max, 10) }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: "6px", borderRadius: "99px", background: i < value ? color : "#e2e8f0", transition: "background 0.4s" }} />
      ))}
    </div>
  );
}

export function SBadge({ n, color = "#ef4444" }) {
  if (!n || n === 0) return null;
  return (
    <span style={{ background: color, color: "white", borderRadius: "99px", fontSize: "10px", fontWeight: "800", padding: "2px 7px", marginRight: "auto" }}>{n}</span>
  );
}

export function Modal({ title, confirmLabel, confirmColor = "#ef4444", onConfirm, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "420px", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}>
        <h3 style={{ color: "#0f172a", margin: "0 0 18px", fontSize: "16px", fontWeight: "700" }}>{title}</h3>
        {children}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button onClick={onConfirm} style={{ flex: 1, padding: "11px", background: confirmColor, color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "700", fontFamily: "Tajawal, sans-serif" }}>{confirmLabel}</button>
          <button onClick={onClose}   style={{ flex: 1, padding: "11px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontFamily: "Tajawal, sans-serif" }}>إلغاء</button>
        </div>
      </div>
    </div>
  );
}

export function StatusPill({ status }) {
  const map = {
    approved: { color: "#15803d", bg: "#f0fdf4", label: "مقبول" },
    pending:  { color: "#b45309", bg: "#fffbeb", label: "معلق"  },
    rejected: { color: "#dc2626", bg: "#fef2f2", label: "مرفوض" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "700", color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
}
