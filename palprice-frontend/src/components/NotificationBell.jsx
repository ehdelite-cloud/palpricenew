import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const TYPE_CONFIG = {
  // إشعارات الأدمن
  new_ticket:          { icon: "🎫", color: "#3b82f6", clickable: true  },
  ticket_reply:        { icon: "💬", color: "#8b5cf6", clickable: true  },
  new_product:         { icon: "📦", color: "#f59e0b", clickable: true  },
  product_approved:    { icon: "✅", color: "#22c55e", clickable: false },
  product_rejected:    { icon: "❌", color: "#ef4444", clickable: false },
  product_resubmitted: { icon: "🔄", color: "#f97316", clickable: true  },
  user_banned:         { icon: "🚫", color: "#ef4444", clickable: false },
  user_unbanned:       { icon: "✅", color: "#22c55e", clickable: false },
  role_change:         { icon: "🛡️", color: "#64748b", clickable: false },
  store_suspended:     { icon: "⏸️", color: "#ef4444", clickable: false },
  store_activated:     { icon: "▶️", color: "#22c55e", clickable: false },
  // إشعارات التاجر
  ticket_reply_store:  { icon: "💬", color: "#3b82f6", clickable: true  },
  ticket_status:       { icon: "🎫", color: "#f59e0b", clickable: true  },
  // إشعارات المستخدم
  price_drop:          { icon: "📉", color: "#ef4444", clickable: true  },
  price_alert:         { icon: "🔔", color: "#f59e0b", clickable: true  },
  campaign:            { icon: "📢", color: "#8b5cf6", clickable: true  },
  welcome:             { icon: "👋", color: "#22c55e", clickable: false },
  recommendation:      { icon: "⭐", color: "#8b5cf6", clickable: true  },
};

function timeAgo(date, lang = "ar") {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60)    return lang === "ar" ? "الآن"                        : "now";
  if (diff < 3600)  return lang === "ar" ? `${Math.floor(diff / 60)} د`  : `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return lang === "ar" ? `${Math.floor(diff / 3600)} س`: `${Math.floor(diff / 3600)}h`;
  return lang === "ar" ? `${Math.floor(diff / 86400)} ي` : `${Math.floor(diff / 86400)}d`;
}

function NotificationBell({ mode = "admin", token, lang = "ar", dropdownSide = "left", notifications = [], setNotifications }) {
  const navigate  = useNavigate();
  const [open,         setOpen]         = useState(false);
  const [markingRead,  setMarkingRead]  = useState(false);
  const ref = useRef(null);
  const touchActivated = useRef(false);

  const unread = notifications.filter(n => !n.is_read).length;

  // ── API endpoints ──
  const API_BASE = mode === "store" ? "/api/tickets/notifications/store"
    : mode === "user" ? "/api/users/notifications"
    : "/api/admin/notifications";

  // ── قراءة الـ token من localStorage حسب الـ mode ──
  function getToken() {
    if (mode === "store") {
      // ← إصلاح: نجرب storeToken أولاً ثم token
      return localStorage.getItem("storeToken") || localStorage.getItem("token");
    }
    if (mode === "user") return localStorage.getItem("userToken");
    return localStorage.getItem("adminToken") || token;
  }

  // ── Dropdown position ──
  const dropdownStyle = (() => {
    const buttonEl = ref.current?.querySelector("button");
    const base = {
      position: "fixed", width: "min(92vw, 360px)", background: "white",
      borderRadius: "14px", border: "1px solid #e2e8f0",
      boxShadow: "0 16px 48px rgba(0,0,0,0.16)", zIndex: 9999, overflow: "hidden",
    };
    if (!buttonEl) return { ...base, top: "60px", left: "20px", right: "20px" };

    const rect  = buttonEl.getBoundingClientRect();
    const dw    = Math.min(window.innerWidth * 0.92, 360);
    const offset = 8;
    const boundedLeft = Math.max(offset, Math.min(rect.left, window.innerWidth - dw - offset));
    const positional  = { left: `${boundedLeft}px`, right: "auto" };

    if (dropdownSide === "top") {
      const bottom = Math.max(window.innerHeight - rect.top + 8, 8);
      return { ...base, width: `${dw}px`, top: "auto", bottom: `${bottom}px`, ...positional };
    }
    const top = Math.min(rect.bottom + 8, window.innerHeight - 8);
    return { ...base, width: `${dw}px`, top: `${top}px`, bottom: "auto", ...positional };
  })();

  // ── جلب الإشعارات عند الفتح الأول فقط (Socket.IO يتولى التحديثات بعدها) ──
  useEffect(() => {
    if (notifications.length === 0) fetchNotifications();
  }, []);

  // ── close on outside click ──
  useEffect(() => {
    if (!open) return;
    function handleOut(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOut);
    return () => document.removeEventListener("mousedown", handleOut);
  }, [open]);

  async function fetchNotifications() {
    const t = getToken();
    if (!t) return;
    try {
      const res = await fetch(API_BASE, { headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" } });
      if (!res.ok) { console.warn(`NotificationBell [${mode}]: ${res.status} from ${API_BASE}`); return; }
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch (err) {
      console.warn(`NotificationBell [${mode}] fetch error:`, err);
    }
  }

  function toggleDropdown() {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
      if (unread > 0) markAllRead();
    }
  }

  async function handleClick(n) {
    const t = getToken();
    const h = { Authorization: `Bearer ${t}`, "Content-Type": "application/json" };
    try {
      if (mode === "store") {
        await fetch(`${API_BASE}/read/${n.id}`, { method: "PUT", headers: h });
      } else if (mode === "user") {
        await fetch(`/api/users/notifications/${n.id}/read`, { method: "PUT", headers: h });
      } else {
        await fetch(`/api/admin/notifications/${n.id}/read`, { method: "PUT", headers: h });
      }
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x));
    } catch {}

    const config = TYPE_CONFIG[n.type] || {};
    if (config.clickable && n.link) {
      setOpen(false);
      if (mode === "admin") {
        window.dispatchEvent(new CustomEvent("admin-navigate", { detail: { link: n.link } }));
      } else {
        navigate(n.link);
      }
    }
  }

  async function markAllRead() {
    if (markingRead) return;
    setMarkingRead(true);
    const t = getToken();
    const h = { Authorization: `Bearer ${t}`, "Content-Type": "application/json" };
    try {
      if (mode === "store") {
        await fetch(`${API_BASE}/read-all`, { method: "PUT", headers: h });
      } else if (mode === "user") {
        await fetch("/api/users/notifications/read-all", { method: "PUT", headers: h });
      } else {
        await fetch("/api/admin/notifications/read-all", { method: "PUT", headers: h });
      }
      setNotifications(prev => prev.map(x => ({ ...x, is_read: true })));
    } catch (err) {
      console.warn("markAllRead error", err);
    } finally {
      setMarkingRead(false);
    }
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* زر الجرس */}
      <button
        onTouchStart={() => { touchActivated.current = true; toggleDropdown(); }}
        onClick={() => { if (touchActivated.current) { touchActivated.current = false; return; } toggleDropdown(); }}
        style={{
          position: "relative", width: "48px", height: "48px", minWidth: "48px",
          borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)",
          background: open ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.1)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", transition: "all 0.2s",
          touchAction: "manipulation", WebkitTapHighlightColor: "transparent",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(34,197,94,0.2)"}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}>
        🔔
        {unread > 0 && (
          <span style={{ position: "absolute", top: "-4px", right: "-4px", background: "#ef4444", color: "white", borderRadius: "99px", fontSize: "10px", fontWeight: "700", padding: "1px 5px", minWidth: "16px", textAlign: "center", border: "2px solid white" }}>
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={dropdownStyle}>
          {/* Header */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px" }}>🔔</span>
              <span style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a" }}>{lang === "ar" ? "الإشعارات" : "Notifications"}</span>
              {unread > 0 && <span style={{ background: "#ef4444", color: "white", borderRadius: "99px", fontSize: "11px", fontWeight: "700", padding: "1px 7px" }}>{unread}</span>}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} style={{ background: "none", border: "none", color: "#22c55e", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                {lang === "ar" ? "قراءة الكل" : "Mark all read"}
              </button>
            )}
          </div>

          {/* القائمة */}
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔔</div>
                <p style={{ margin: 0, fontSize: "13px" }}>{lang === "ar" ? "لا توجد إشعارات" : "No notifications"}</p>
              </div>
            ) : notifications.map(n => {
              const config = TYPE_CONFIG[n.type] || { icon: "📢", color: "#64748b", clickable: false };
              return (
                <div key={n.id} onClick={() => handleClick(n)}
                  style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 16px", background: n.is_read ? "white" : "#f8faff", borderBottom: "1px solid #f8fafc", cursor: config.clickable ? "pointer" : "default", transition: "background 0.15s" }}
                  onMouseEnter={e => { if (config.clickable) e.currentTarget.style.background = "#f1f5f9"; }}
                  onMouseLeave={e => e.currentTarget.style.background = n.is_read ? "white" : "#f8faff"}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0, background: `${config.color}15`, border: `1px solid ${config.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                    {config.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: "0 0 3px", fontSize: "13px", lineHeight: 1.5, color: n.is_read ? "#64748b" : "#0f172a", fontWeight: n.is_read ? "400" : "500" }}>
                      {n.message}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>{timeAgo(n.created_at, lang)}</span>
                      {config.clickable && <span style={{ fontSize: "11px", color: config.color, fontWeight: "600" }}>{lang === "ar" ? "← اضغط للعرض" : "← View"}</span>}
                    </div>
                  </div>
                  {!n.is_read && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6", flexShrink: 0, marginTop: "4px" }} />}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>{notifications.length} {lang === "ar" ? "إشعار" : "notifications"}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;