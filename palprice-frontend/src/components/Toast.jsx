import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";

/* ══════════════════════════════════════════════
   Context
══════════════════════════════════════════════ */
const ToastContext = createContext(null);

/* ══════════════════════════════════════════════
   Provider — يُغلف التطبيق مرة واحدة
══════════════════════════════════════════════ */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback(({ message, type = "info", duration = 3500 }) => {
    const id = ++counterRef.current;
    setToasts(prev => [...prev.slice(-4), { id, message, type }]); // max 5 toasts
    setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  // Shortcuts
  toast.success = (msg, opts) => toast({ message: msg, type: "success", ...opts });
  toast.error   = (msg, opts) => toast({ message: msg, type: "error",   duration: 5000, ...opts });
  toast.info    = (msg, opts) => toast({ message: msg, type: "info",    ...opts });
  toast.warn    = (msg, opts) => toast({ message: msg, type: "warn",    ...opts });

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

/* ══════════════════════════════════════════════
   Hook
══════════════════════════════════════════════ */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

/* ══════════════════════════════════════════════
   UI — حاوية الـ Toasts
══════════════════════════════════════════════ */
const STYLES = {
  success: { bg: "#f0fdf4", border: "#bbf7d0", color: "#166534", icon: "✓" },
  error:   { bg: "#fef2f2", border: "#fecaca", color: "#991b1b", icon: "✕" },
  warn:    { bg: "#fffbeb", border: "#fde68a", color: "#92400e", icon: "⚠" },
  info:    { bg: "#eff6ff", border: "#bfdbfe", color: "#1e40af", icon: "ℹ" },
};

function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;
  return (
    <div style={{
      position: "fixed", top: "80px", left: "50%", transform: "translateX(-50%)",
      zIndex: 9999, display: "flex", flexDirection: "column", gap: "8px",
      alignItems: "center", pointerEvents: "none",
    }}>
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const s = STYLES[toast.type] || STYLES.info;

  useEffect(() => {
    // fade in
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      onClick={() => onDismiss(toast.id)}
      style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "12px 18px", borderRadius: "12px",
        background: s.bg, border: `1.5px solid ${s.border}`, color: s.color,
        fontSize: "14px", fontWeight: "600", fontFamily: "Tajawal, sans-serif",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        cursor: "pointer", pointerEvents: "auto",
        maxWidth: "360px", minWidth: "200px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-12px)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
        direction: "rtl",
      }}
    >
      <span style={{ fontSize: "16px", flexShrink: 0 }}>{s.icon}</span>
      <span style={{ flex: 1 }}>{toast.message}</span>
    </div>
  );
}
