import { useEffect, useState, useCallback } from "react";
import NotificationBell from "./components/NotificationBell";

const API        = "/api/admin";
const TICKETS_API = "/api/tickets";

const SIDEBAR_ITEMS = [
  { key: "overview",   icon: "📊", label: "نظرة عامة",        badge: null },
  { key: "ai",         icon: "🤖", label: "تحليل ذكي",         badge: null },
  { key: "pending",    icon: "⏳", label: "بانتظار الموافقة",  badge: "pending" },
  { key: "tickets",    icon: "🎫", label: "تذاكر الدعم",       badge: "tickets" },
  { key: "products",   icon: "📦", label: "المنتجات",          badge: null },
  { key: "stores",     icon: "🏪", label: "المتاجر",           badge: null },
  { key: "users",      icon: "👥", label: "المستخدمون",        badge: null },
  { key: "moderators", icon: "🛡️", label: "فريق الإدارة",     badge: null },
];

/* ══════════════════════════════════════
   مكونات AnalyzeForce Style
══════════════════════════════════════ */

// شريط تقدم دائري
function CircularProgress({ pct = 0, size = 110, stroke = 10, color = "#6366f1", bg = "rgba(255,255,255,0.2)", children }) {
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

// شريط تقدم أفقي
function HBar({ pct = 0, color = "#6366f1", height = 8, bg = "#f1f5f9" }) {
  return (
    <div style={{ height, borderRadius: 99, background: bg, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 99, transition: "width 1.2s ease" }} />
    </div>
  );
}

// شريط مقسّم (Segmented)
function SegBar({ value = 0, max = 10, color = "#22c55e" }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {Array.from({ length: Math.min(max, 10) }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: "6px", borderRadius: "99px", background: i < value ? color : "#e2e8f0", transition: "background 0.4s" }} />
      ))}
    </div>
  );
}

// badge للسايدبار
function SBadge({ n, color = "#ef4444" }) {
  if (!n || n === 0) return null;
  return (
    <span style={{ background: color, color: "white", borderRadius: "99px", fontSize: "10px", fontWeight: "800", padding: "2px 7px", marginRight: "auto" }}>{n}</span>
  );
}

// نافذة تأكيد
function Modal({ title, confirmLabel, confirmColor = "#ef4444", onConfirm, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "420px", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}>
        <h3 style={{ color: "#0f172a", margin: "0 0 18px", fontSize: "16px", fontWeight: "700" }}>{title}</h3>
        {children}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button onClick={onConfirm} style={{ flex: 1, padding: "11px", background: confirmColor, color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "700", fontFamily: "Tajawal, sans-serif" }}>{confirmLabel}</button>
          <button onClick={onClose}   style={{ flex: 1, padding: "11px", background: "#f1f5f9",   color: "#64748b", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontFamily: "Tajawal, sans-serif" }}>إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// علامة حالة الصف
function StatusPill({ status }) {
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

/* ══════════════════════════════════════
   المكوّن الرئيسي
══════════════════════════════════════ */
export default function AdminDashboard() {
  const [activeTab,   setActiveTab]   = useState("overview");
  const [token,       setToken]       = useState(localStorage.getItem("adminToken"));
  const [adminUser,   setAdminUser]   = useState(() => {
    const r = localStorage.getItem("adminRole");
    const n = localStorage.getItem("adminName");
    return r ? { role: r, name: n } : null;
  });

  const [analytics,      setAnalytics]      = useState(null);
  const [products,       setProducts]       = useState([]);
  const [productsTotal,  setProductsTotal]  = useState(0);
  const [stores,         setStores]         = useState([]);
  const [users,          setUsers]          = useState([]);
  const [usersTotal,     setUsersTotal]     = useState(0);
  const [moderators,     setModerators]     = useState([]);
  const [notifications,  setNotifications]  = useState([]);
  const [unread,         setUnread]         = useState(0);
  const [loading,        setLoading]        = useState(false);
  const [tickets,        setTickets]        = useState([]);
  const [activeTicket,   setActiveTicket]   = useState(null);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [ticketReply,    setTicketReply]    = useState("");
  const [sendingReply,   setSendingReply]   = useState(false);
  const [openTickets,    setOpenTickets]    = useState(0);
  const [aiReport,       setAiReport]       = useState(null);
  const [aiLoading,      setAiLoading]      = useState(false);
  const [aiChat,         setAiChat]         = useState([]);
  const [aiInput,        setAiInput]        = useState("");
  const [aiChatLoading,  setAiChatLoading]  = useState(false);
  const [reportType,     setReportType]     = useState("full");
  const [search,         setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter,     setRoleFilter]     = useState("");
  const [page,           setPage]           = useState(1);
  const [loginEmail,     setLoginEmail]     = useState("");
  const [loginPwd,       setLoginPwd]       = useState("");
  const [loginError,     setLoginError]     = useState("");
  const [banModal,       setBanModal]       = useState(null);
  const [banReason,      setBanReason]      = useState("");
  const [rejectModal,    setRejectModal]    = useState(null);
  const [rejectReason,   setRejectReason]   = useState("");
  const [productDetail,  setProductDetail]  = useState(null);
  const [collapsed,      setCollapsed]      = useState(false);

  const h = useCallback(() => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }), [token]);

  useEffect(() => { if (token) { setPage(1); load(); } }, [token, activeTab]);
  useEffect(() => { if (token) load(); }, [page]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/notifications`, { headers: h() }).then(r => r.json())
      .then(d => { if (Array.isArray(d)) setUnread(d.filter(n => !n.is_read).length); }).catch(() => {});
    fetch(`${TICKETS_API}/admin`, { headers: h() }).then(r => r.json())
      .then(d => { if (Array.isArray(d)) setOpenTickets(d.filter(t => t.status !== "closed").length); }).catch(() => {});

    function handleNav(e) {
      const link = e.detail?.link || "";
      if (link.includes("/tickets/")) {
        const tId = link.split("/tickets/")[1];
        setActiveTab("tickets");
        if (tId) fetch(`${TICKETS_API}/${tId}/admin`, { headers: h() }).then(r => r.json())
          .then(data => { setActiveTicket(data.ticket); setTicketMessages(data.messages || []); });
      } else if (link.includes("pending")) setActiveTab("pending");
      else if (link.includes("tickets")) setActiveTab("tickets");
    }
    window.addEventListener("admin-navigate", handleNav);
    return () => window.removeEventListener("admin-navigate", handleNav);
  }, [token]);

  async function load() {
    setLoading(true);
    try {
      const heads = h();
      if (activeTab === "overview") {
        const [a, n] = await Promise.all([
          fetch(`${API}/analytics`, { headers: heads }).then(r => r.json()),
          fetch(`${API}/notifications`, { headers: heads }).then(r => r.json()),
        ]);
        setAnalytics(a);
        if (Array.isArray(n)) { setNotifications(n.slice(0, 10)); setUnread(n.filter(x => !x.is_read).length); }
      } else if (activeTab === "pending") {
        const d = await fetch(`${API}/products?status=pending&page=${page}`, { headers: heads }).then(r => r.json());
        setProducts(d.products || []); setProductsTotal(d.total || 0);
      } else if (activeTab === "products") {
        const d = await fetch(`${API}/products?search=${search}&page=${page}`, { headers: heads }).then(r => r.json());
        setProducts(d.products || []); setProductsTotal(d.total || 0);
      } else if (activeTab === "stores") {
        const d = await fetch(`${API}/stores?search=${search}&page=${page}`, { headers: heads }).then(r => r.json());
        setStores(d.stores || []);
      } else if (activeTab === "users") {
        const d = await fetch(`${API}/users?role=${roleFilter}&search=${search}&page=${page}`, { headers: heads }).then(r => r.json());
        setUsers(d.users || []); setUsersTotal(d.total || 0);
      } else if (activeTab === "tickets") {
        const data = await fetch(`${TICKETS_API}/admin`, { headers: heads }).then(r => r.json());
        if (Array.isArray(data)) { setTickets(data); setOpenTickets(data.filter(t => t.status !== "closed").length); }
      } else if (activeTab === "moderators") {
        const d = await fetch(`${API}/moderators`, { headers: heads }).then(r => r.json());
        setModerators(Array.isArray(d) ? d : []);
      }
    } catch {}
    setLoading(false);
  }

  async function handleLogin() {
    setLoginError("");
    try {
      const res  = await fetch(`${API}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: loginEmail, password: loginPwd }) });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.error || "خطأ في تسجيل الدخول"); return; }
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminRole",  data.user.role);
      localStorage.setItem("adminName",  data.user.name);
      setToken(data.token); setAdminUser(data.user);
    } catch { setLoginError("تعذر الاتصال بالسيرفر"); }
  }

  function handleLogout() {
    ["adminToken", "adminRole", "adminName"].forEach(k => localStorage.removeItem(k));
    setToken(null); setAdminUser(null);
  }

  const isAdmin     = adminUser?.role === "admin";
  const totalPages  = (total, lim = 15) => Math.ceil(total / lim);
  const inp         = { padding: "9px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", outline: "none", background: "white", color: "#0f172a" };

  async function approveProduct(id) {
    await fetch(`${API}/products/${id}/approve`, { method: "PUT", headers: h() });
    setProducts(p => p.filter(x => x.id !== id));
    if (analytics) setAnalytics(a => ({ ...a, pending: Math.max(0, parseInt(a.pending) - 1) }));
  }
  async function rejectProduct(id, reason) {
    await fetch(`${API}/products/${id}/reject`, { method: "PUT", headers: h(), body: JSON.stringify({ reason }) });
    setProducts(p => p.filter(x => x.id !== id));
    setRejectModal(null); setRejectReason("");
    if (analytics) setAnalytics(a => ({ ...a, pending: Math.max(0, parseInt(a.pending) - 1) }));
  }
  async function deleteProduct(id) {
    if (!window.confirm("حذف هذا المنتج؟")) return;
    await fetch(`${API}/products/${id}`, { method: "DELETE", headers: h() });
    setProducts(p => p.filter(x => x.id !== id));
  }
  async function toggleStore(id, active) {
    await fetch(`${API}/stores/${id}/status`, { method: "PUT", headers: h(), body: JSON.stringify({ is_active: active }) });
    setStores(s => s.map(x => x.id === id ? { ...x, is_active: active } : x));
  }
  async function banUser(id, banned, reason) {
    await fetch(`${API}/users/${id}/ban`, { method: "PUT", headers: h(), body: JSON.stringify({ banned, reason }) });
    setUsers(u => u.map(x => x.id === id ? { ...x, is_banned: banned } : x));
    setBanModal(null); setBanReason("");
  }
  async function changeRole(id, role) {
    if (!isAdmin) return;
    await fetch(`${API}/users/${id}/role`, { method: "PUT", headers: h(), body: JSON.stringify({ role }) });
    setUsers(u => u.map(x => x.id === id ? { ...x, role } : x));
  }
  async function markAllRead() {
    await fetch(`${API}/notifications/read-all`, { method: "PUT", headers: h() });
    setNotifications(n => n.map(x => ({ ...x, is_read: true }))); setUnread(0);
  }
  async function handleTicketReply() {
    if (!ticketReply.trim() || sendingReply || !activeTicket) return;
    setSendingReply(true);
    await fetch(`${TICKETS_API}/${activeTicket.id}/reply/admin`, { method: "POST", headers: h(), body: JSON.stringify({ message: ticketReply.trim() }) });
    setTicketReply("");
    const data = await fetch(`${TICKETS_API}/${activeTicket.id}/admin`, { headers: h() }).then(r => r.json());
    setTicketMessages(data.messages || []); setActiveTicket(data.ticket);
    setSendingReply(false);
  }
  async function generateReport(type) {
    if (!analytics) return;
    setAiLoading(true); setAiReport(null); setReportType(type);
    const ctx = `PalPrice: منتجات ${analytics.products} | متاجر ${analytics.stores} | أسعار ${analytics.prices} | مستخدمون ${analytics.users} | معلق ${analytics.pending} | محظورون ${analytics.banned} | جديد هذا الأسبوع ${analytics.newThisWeek} | الأكثر مشاهدة: ${analytics.mostViewed}`;
    const prompts = {
      full:     `أنت محلل بيانات خبير. حلّل موقع PalPrice.\n${ctx}\nاكتب تقريراً شاملاً:\n1. **ملخص تنفيذي**\n2. **نقاط القوة**\n3. **نقاط الضعف**\n4. **تحليل الأرقام**\n5. **توصيات فورية**\n6. **توقعات الشهر القادم**`,
      security: `أنت خبير أمن. حلّل مخاطر PalPrice.\n${ctx}\n1. **تقييم المخاطر**\n2. **مؤشرات مشبوهة**\n3. **توصيات أمنية فورية**\n4. **سياسات يجب تطبيقها**`,
      growth:   `أنت خبير نمو. حلّل إمكانيات PalPrice.\n${ctx}\n1. **وضع النمو الحالي**\n2. **فرص غير مستغلة**\n3. **استراتيجيات**\n4. **KPIs**\n5. **خطة 90 يوم**`,
    };
    try {
      const res  = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content: prompts[type] }] }) });
      const data = await res.json();
      setAiReport({ text: data.content?.map(c => c.text || "").join("") || "تعذر الحصول على التقرير", type, time: new Date().toLocaleString("ar-PS") });
    } catch { setAiReport({ text: "❌ تعذر الاتصال بالسيرفر", type, time: "" }); }
    setAiLoading(false);
  }
  async function sendAiMessage() {
    if (!aiInput.trim() || aiChatLoading) return;
    const msg = aiInput.trim(); setAiInput("");
    setAiChat(prev => [...prev, { role: "user", content: msg }]);
    setAiChatLoading(true);
    const ctx = analytics ? `PalPrice: منتجات ${analytics.products} | متاجر ${analytics.stores} | مستخدمون ${analytics.users} | معلق ${analytics.pending}` : "";
    try {
      const res  = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content: `${ctx ? ctx + "\n\n" : ""}أنت مساعد إدارة PalPrice. أجب بالعربية بإيجاز:\n${msg}` }] }) });
      const data = await res.json();
      setAiChat(prev => [...prev, { role: "assistant", content: data.content?.map(c => c.text || "").join("") || "تعذر الرد" }]);
    } catch { setAiChat(prev => [...prev, { role: "assistant", content: "❌ خطأ في الاتصال" }]); }
    setAiChatLoading(false);
  }

  /* ── صفحة تسجيل الدخول ── */
  if (!token) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0d3320 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Tajawal, sans-serif" }}>
      <div style={{ background: "white", borderRadius: "20px", padding: "48px", width: "100%", maxWidth: "400px", boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "28px" }}>🛡️</div>
          <h1 style={{ color: "#0f172a", fontSize: "22px", fontWeight: "900", margin: "0 0 6px", fontFamily: "Cairo, sans-serif" }}>PalPrice Admin</h1>
          <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>لوحة تحكم الإدارة</p>
        </div>
        {loginError && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "10px", fontSize: "13px", marginBottom: "18px" }}>{loginError}</div>}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>البريد الإلكتروني</label>
          <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="admin@palprice.ps" style={{ ...inp, width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: "10px" }} />
        </div>
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>كلمة المرور</label>
          <input type="password" value={loginPwd} onChange={e => setLoginPwd(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="••••••••" style={{ ...inp, width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: "10px" }} />
        </div>
        <button onClick={handleLogin} style={{ width: "100%", padding: "13px", background: "#0f172a", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>تسجيل الدخول 🛡️</button>
        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "12px", color: "#94a3b8" }}>للمدراء والمشرفين فقط</p>
      </div>
    </div>
  );

  /* ── إحصائيات Overview ── */
  const A         = analytics || {};
  const products_ = Number(A.products   || 0);
  const stores_   = Number(A.stores     || 0);
  const prices_   = Number(A.prices     || 0);
  const users_    = Number(A.users      || 0);
  const pending_  = Number(A.pending    || 0);
  const banned_   = Number(A.banned     || 0);
  const newWeek_  = Number(A.newThisWeek || 0);
  const pricePct  = products_ > 0 ? Math.round((prices_   / products_) * 100) : 0;
  const pendPct   = products_ > 0 ? Math.round((pending_  / products_) * 100) : 0;
  const bannPct   = users_    > 0 ? Math.round((banned_   / users_)    * 100) : 0;

  const tableRows = [
    { label: "إجمالي المنتجات",        value: products_, pct: Math.min(products_ / 5, 100), color: "#3b82f6", status: "normal",   statusLabel: "نشط" },
    { label: "المتاجر الشريكة",        value: stores_,   pct: Math.min(stores_ * 10, 100),  color: "#22c55e", status: "achieved", statusLabel: "✓ نشط" },
    { label: "الأسعار المسجلة",        value: prices_,   pct: Math.min(pricePct, 100),       color: "#f59e0b", status: "normal",   statusLabel: "نشط" },
    { label: "المستخدمون",             value: users_,    pct: Math.min(users_ * 5, 100),     color: "#8b5cf6", status: "normal",   statusLabel: "نشط" },
    { label: "بانتظار الموافقة",       value: pending_,  pct: pendPct,                        color: "#f97316", status: pending_ > 0 ? "risk" : "achieved", statusLabel: pending_ > 0 ? "⚠ معلق" : "✓ نظيف" },
    { label: "محظورون",                value: banned_,   pct: bannPct,                        color: "#ef4444", status: banned_  > 0 ? "risk" : "achieved", statusLabel: banned_  > 0 ? "⚠ خطر"  : "✓ نظيف" },
    { label: "جديد هذا الأسبوع",       value: newWeek_,  pct: Math.min(newWeek_ * 10, 100),  color: "#06b6d4", status: "normal",   statusLabel: "هذا الأسبوع" },
  ];

  const statusCfg = { risk: { color: "#dc2626", bg: "#fef2f2" }, achieved: { color: "#15803d", bg: "#f0fdf4" }, normal: { color: "#64748b", bg: "#f8fafc" } };

  /* ── اللوحة الرئيسية ── */
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f6fa", fontFamily: "Tajawal, sans-serif", direction: "rtl" }}>

      {/* ══ السايدبار ══ */}
      <aside style={{ width: collapsed ? "60px" : "230px", background: "#0f172a", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0, transition: "width 0.2s", overflow: "hidden", zIndex: 50 }}>

        {/* شعار + زر طي */}
        <div style={{ padding: "18px 14px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {!collapsed && <p style={{ color: "#22c55e", fontSize: "18px", fontWeight: "900", margin: 0, fontFamily: "Cairo, sans-serif" }}>PalPrice</p>}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {!collapsed && <NotificationBell mode="admin" token={token} dropdownSide="right" notifications={notifications} setNotifications={setNotifications}/>}
            <button onClick={() => setCollapsed(p => !p)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #1e293b", borderRadius: "8px", color: "#64748b", cursor: "pointer", fontSize: "12px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {collapsed ? "▶" : "◀"}
            </button>
          </div>
        </div>

        {/* معلومات المدير */}
        {!collapsed && (
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #1e293b" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>👤</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "white",     fontSize: "13px", fontWeight: "600", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{adminUser?.name || "Admin"}</p>
                <p style={{ color: adminUser?.role === "admin" ? "#22c55e" : "#f59e0b", fontSize: "11px", margin: 0, fontWeight: "600" }}>
                  {adminUser?.role === "admin" ? "🛡️ Super Admin" : "👮 Moderator"}
                </p>
              </div>
              <button onClick={handleLogout} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", color: "#ef4444", cursor: "pointer", fontSize: "13px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>🚪</button>
            </div>
          </div>
        )}

        {/* روابط التنقل */}
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto", scrollbarWidth: "none" }}>
          {SIDEBAR_ITEMS.map(item => {
            const active = activeTab === item.key;
            return (
              <button key={item.key} onClick={() => { setActiveTab(item.key); setSearch(""); setPage(1); }} title={collapsed ? item.label : ""}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "9px", padding: collapsed ? "10px" : "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer", background: active ? "rgba(34,197,94,0.15)" : "transparent", color: active ? "#22c55e" : "#64748b", fontSize: "13px", fontWeight: active ? "700" : "400", fontFamily: "Tajawal, sans-serif", textAlign: "right", marginBottom: "2px", transition: "all 0.15s", borderRight: active ? "3px solid #22c55e" : "3px solid transparent", justifyContent: collapsed ? "center" : "flex-start" }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                {!collapsed && item.badge === "pending"  && <SBadge n={analytics?.pending} color="#f59e0b" />}
                {!collapsed && item.badge === "tickets"  && <SBadge n={openTickets} color="#3b82f6" />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ══ المحتوى الرئيسي ══ */}
      <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

        {/* ════════════════ نظرة عامة ════════════════ */}
        {activeTab === "overview" && (
          <div>
            {/* عنوان الصفحة */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>📊 نظرة عامة على الموقع</h1>
                <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0" }}>
                  {new Date().toLocaleDateString("ar-PS", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              {pending_ > 0 && (
                <button onClick={() => setActiveTab("pending")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: "10px", color: "#b45309", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                  ⏳ {pending_} منتج بانتظار مراجعتك
                </button>
              )}
            </div>

            {/* ── الصف الأول: 3 Gauge Cards + Summary Card ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>

              {/* كارد 1 - المنتجات (Horizontal Gauge) */}
              <div style={{ background: "white", borderRadius: "16px", padding: "22px 20px", border: "1px solid #e8eaf0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-12px", right: "-12px", width: "70px", height: "70px", borderRadius: "50%", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>📦</div>
                <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.7px" }}>إجمالي المنتجات</p>
                <p style={{ fontSize: "34px", fontWeight: "900", color: "#0f172a", margin: "0 0 2px", fontFamily: "Cairo, sans-serif", lineHeight: 1 }}>{products_}</p>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 14px" }}>منتج مسجّل في الموقع</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>نسبة التسعير: {Math.min(pricePct, 100)}%</span>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>الهدف: {prices_} سعر</span>
                </div>
                <HBar pct={Math.min(pricePct, 100)} color="#f97316" height={9} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                  <span style={{ fontSize: "10px", color: "#94a3b8" }}>بدون سعر:</span>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#f97316" }}>{Math.max(0, products_ - prices_)} منتج</span>
                </div>
              </div>

              {/* كارد 2 - المتاجر (Segmented) */}
              <div style={{ background: "white", borderRadius: "16px", padding: "22px 20px", border: "1px solid #e8eaf0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-12px", right: "-12px", width: "70px", height: "70px", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🏪</div>
                <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.7px" }}>المتاجر الشريكة</p>
                <p style={{ fontSize: "34px", fontWeight: "900", color: "#0f172a", margin: "0 0 2px", fontFamily: "Cairo, sans-serif", lineHeight: 1 }}>{stores_}</p>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 14px" }}>متجر شريك نشط</p>
                <p style={{ fontSize: "10px", color: "#64748b", fontWeight: "600", margin: "0 0 7px" }}>{stores_} / 10 متجر مُفعَّل</p>
                <SegBar value={Math.min(stores_, 10)} max={10} color="#22c55e" />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                  <span style={{ fontSize: "10px", background: "#f0fdf4", color: "#15803d", padding: "2px 8px", borderRadius: "99px", fontWeight: "700" }}>✓ {newWeek_} منتج جديد هذا الأسبوع</span>
                </div>
              </div>

              {/* كارد 3 - المستخدمون (Classic Progress) */}
              <div style={{ background: "white", borderRadius: "16px", padding: "22px 20px", border: "1px solid #e8eaf0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-12px", right: "-12px", width: "70px", height: "70px", borderRadius: "50%", background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>👥</div>
                <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.7px" }}>المستخدمون</p>
                <p style={{ fontSize: "34px", fontWeight: "900", color: "#0f172a", margin: "0 0 2px", fontFamily: "Cairo, sans-serif", lineHeight: 1 }}>{users_}</p>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 14px" }}>مستخدم مسجّل</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>59% من الهدف</span>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>الهدف: 100 مستخدم</span>
                </div>
                <HBar pct={Math.min(users_, 100)} color="#8b5cf6" height={9} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                  <span style={{ fontSize: "10px", color: "#94a3b8" }}>المحظورون:</span>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: banned_ > 0 ? "#ef4444" : "#15803d" }}>{banned_} مستخدم</span>
                </div>
              </div>

              {/* كارد 4 - Summary (بنفسجي دائري) */}
              <div style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #a855f7 100%)", borderRadius: "16px", padding: "22px 20px", color: "white", boxShadow: "0 8px 28px rgba(99,102,241,0.35)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-20px", right: "-20px",  width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                <div style={{ position: "absolute", bottom: "-15px", left: "-15px", width: "70px",  height: "70px",  borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                <div style={{ position: "absolute", top: "12px", right: "12px", width: "28px", height: "28px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🎯</div>
                <p style={{ fontSize: "10px", fontWeight: "700", margin: "0 0 12px", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.8px" }}>ملخص عام</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <CircularProgress pct={pending_ > 0 ? Math.max(5, 100 - pendPct) : 100} size={100} stroke={9} color="white" bg="rgba(255,255,255,0.2)">
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "18px", fontWeight: "900", margin: 0, color: "white", fontFamily: "Cairo, sans-serif" }}>{pending_ > 0 ? (100 - pendPct) : 100}%</p>
                      <p style={{ fontSize: "9px", margin: 0, opacity: 0.8, lineHeight: 1.3, color: "white" }}>معتمد</p>
                    </div>
                  </CircularProgress>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      { label: "المنتجات",    value: products_ },
                      { label: "المستخدمون", value: users_    },
                      { label: "بانتظار",     value: pending_  },
                      { label: "محظورون",     value: banned_   },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "11px", opacity: 0.75 }}>{item.label}</span>
                        <span style={{ fontSize: "13px", fontWeight: "700" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── الصف الثاني: جدول الإحصائيات + الإشعارات والإجراءات ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "16px" }}>

              {/* جدول الإحصائيات التفصيلية */}
              <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e8eaf0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ padding: "16px 22px", borderBottom: "1px solid #f1f5f9" }}>
                  <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.7px" }}>تقدم المؤشرات</p>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>إحصائيات الموقع التفصيلية</h3>
                </div>
                <div style={{ padding: "0 22px" }}>
                  {/* رأس الجدول */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 130px", gap: "8px", padding: "11px 0 8px", borderBottom: "1px solid #f1f5f9" }}>
                    {["المقياس", "القيمة", "الحالة", "شريط التقدم"].map((h, i) => (
                      <span key={i} style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
                    ))}
                  </div>
                  {/* صفوف الجدول */}
                  {tableRows.map((row, i) => {
                    const cfg = statusCfg[row.status] || statusCfg.normal;
                    return (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 130px", gap: "8px", padding: "12px 0", borderBottom: i < tableRows.length - 1 ? "1px solid #f8fafc" : "none", alignItems: "center" }}>
                        <span style={{ fontSize: "13px", color: "#0f172a", fontWeight: "500" }}>{row.label}</span>
                        <span style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a", fontFamily: "Cairo, sans-serif" }}>{row.value}</span>
                        <span style={{ fontSize: "10px", fontWeight: "700", color: cfg.color, background: cfg.bg, padding: "3px 8px", borderRadius: "99px", textAlign: "center" }}>{row.statusLabel}</span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                          <HBar pct={row.pct} color={row.color} height={7} />
                          <span style={{ fontSize: "10px", color: "#94a3b8" }}>{Math.round(row.pct)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* عمود الإجراءات والإشعارات */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                {/* إجراءات سريعة */}
                <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e8eaf0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>⚡ إجراءات سريعة</h3>
                  </div>
                  <div style={{ padding: "10px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {[
                      { to: "pending",    icon: "⏳", label: "المعلقة",    color: "#f97316", n: pending_  },
                      { to: "products",   icon: "📦", label: "المنتجات",   color: "#3b82f6", n: products_ },
                      { to: "stores",     icon: "🏪", label: "المتاجر",    color: "#22c55e", n: stores_   },
                      { to: "users",      icon: "👥", label: "المستخدمون", color: "#8b5cf6", n: users_    },
                      { to: "tickets",    icon: "🎫", label: "الدعم",      color: "#06b6d4", n: openTickets },
                      { to: "ai",         icon: "🤖", label: "تحليل AI",   color: "#f43f5e", n: null      },
                    ].map((s, i) => (
                      <button key={i} onClick={() => setActiveTab(s.to)}
                        style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "white", cursor: "pointer", textAlign: "right", transition: "all 0.2s", fontFamily: "Tajawal, sans-serif" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = `${s.color}08`; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "white"; }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", flexShrink: 0 }}>{s.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "11px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{s.label}</p>
                          {s.n !== null && <p style={{ fontSize: "10px", color: "#94a3b8", margin: 0 }}>{s.n}</p>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* آخر الإشعارات */}
                <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e8eaf0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", flex: 1 }}>
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                      🔔 الإشعارات {unread > 0 && <span style={{ background: "#ef4444", color: "white", borderRadius: "99px", fontSize: "10px", padding: "1px 6px", marginRight: "4px" }}>{unread}</span>}
                    </h3>
                    {unread > 0 && <button onClick={markAllRead} style={{ padding: "3px 10px", background: "#f1f5f9", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "11px", color: "#64748b", fontFamily: "Tajawal, sans-serif" }}>قراءة الكل</button>}
                  </div>
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: "30px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>🔔 لا توجد إشعارات</div>
                    ) : notifications.slice(0, 6).map((n, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "10px 18px", borderBottom: i < 5 ? "1px solid #f8fafc" : "none", background: n.is_read ? "white" : "#f0fdf4" }}>
                        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: n.is_read ? "#e2e8f0" : "#22c55e", flexShrink: 0, marginTop: "5px" }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: n.is_read ? "#64748b" : "#0f172a", fontSize: "12px", margin: "0 0 2px", fontWeight: n.is_read ? "400" : "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.message}</p>
                          <p style={{ color: "#cbd5e1", fontSize: "10px", margin: 0 }}>{new Date(n.created_at).toLocaleString("ar-PS")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ تحليل ذكي ════════════════ */}
        {activeTab === "ai" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>🤖 تحليل ذكي بـ Claude AI</h1>
              <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0" }}>احصل على تقارير وتحليلات ذكية لموقعك</p>
            </div>
            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px" }}>📋 توليد تقرير</h3>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
                {[
                  { key: "full",     icon: "📊", label: "تقرير شامل",   color: "#3b82f6" },
                  { key: "security", icon: "🔒", label: "تقرير أمني",   color: "#ef4444" },
                  { key: "growth",   icon: "📈", label: "تقرير النمو",  color: "#22c55e" },
                ].map(r => (
                  <button key={r.key} onClick={() => generateReport(r.key)} disabled={aiLoading}
                    style={{ padding: "10px 20px", borderRadius: "10px", border: `1.5px solid ${r.color}`, background: reportType === r.key && aiReport ? r.color : "white", color: reportType === r.key && aiReport ? "white" : r.color, cursor: aiLoading ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "Tajawal, sans-serif", display: "flex", alignItems: "center", gap: "7px" }}>
                    {r.icon} {r.label}
                  </button>
                ))}
              </div>
              {aiLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
                  <div style={{ width: "18px", height: "18px", border: "2px solid #e2e8f0", borderTop: "2px solid #3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>Claude AI يحلل البيانات...</p>
                </div>
              )}
              {aiReport && !aiLoading && (
                <div style={{ background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", background: "#0f172a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#22c55e", fontSize: "12px", fontWeight: "600" }}>🤖 Claude AI • {aiReport.time}</span>
                    <button onClick={() => { const blob = new Blob([aiReport.text], { type: "text/plain;charset=utf-8" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "palprice-report.txt"; a.click(); }} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontFamily: "Tajawal, sans-serif" }}>⬇️ تحميل</button>
                  </div>
                  <div style={{ padding: "20px", maxHeight: "400px", overflowY: "auto" }}>
                    {aiReport.text.split("\n").map((line, i) => {
                      const isBold = line.startsWith("**");
                      const isH    = line.startsWith("#");
                      const cleaned = line.replace(/\*\*/g, "").replace(/^#+\s*/, "");
                      if (!cleaned.trim()) return <br key={i} />;
                      return <p key={i} style={{ margin: "4px 0", fontSize: isH ? "15px" : "13px", fontWeight: isBold || isH ? "700" : "400", color: isH ? "#0f172a" : "#475569", lineHeight: 1.7 }}>{cleaned}</p>;
                    })}
                  </div>
                </div>
              )}
            </div>
            {/* محادثة AI */}
            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>🤖</div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#0f172a", fontSize: "14px", fontWeight: "600", margin: 0 }}>Claude AI Assistant</p>
                  <p style={{ color: "#94a3b8", fontSize: "11px", margin: 0 }}>اسأل عن أي شيء في موقعك</p>
                </div>
                {aiChat.length > 0 && <button onClick={() => setAiChat([])} style={{ padding: "4px 12px", background: "#f1f5f9", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", color: "#64748b", fontFamily: "Tajawal, sans-serif" }}>مسح</button>}
              </div>
              <div style={{ height: "300px", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {aiChat.length === 0 && (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                    <span style={{ fontSize: "36px", marginBottom: "10px" }}>💬</span>
                    <p style={{ fontSize: "13px", textAlign: "center", marginBottom: "14px" }}>ابدأ محادثة مع Claude AI</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                      {["ما هي نقاط ضعف الموقع؟", "كيف أزيد المستخدمين؟", "هل الأرقام جيدة؟"].map((q, i) => (
                        <button key={i} onClick={() => setAiInput(q)} style={{ padding: "6px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "99px", cursor: "pointer", fontSize: "12px", color: "#475569", fontFamily: "Tajawal, sans-serif" }}>{q}</button>
                      ))}
                    </div>
                  </div>
                )}
                {aiChat.map((msg, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-start" : "flex-end", gap: "8px" }}>
                    {msg.role === "assistant" && <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0 }}>🤖</div>}
                    <div style={{ maxWidth: "75%", padding: "9px 13px", borderRadius: "12px", background: msg.role === "user" ? "#0f172a" : "#f8fafc", border: msg.role === "assistant" ? "1px solid #e2e8f0" : "none" }}>
                      <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.6, color: msg.role === "user" ? "white" : "#475569", whiteSpace: "pre-wrap" }}>{msg.content}</p>
                    </div>
                  </div>
                ))}
                {aiChatLoading && (
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>🤖</div>
                    <div style={{ padding: "9px 13px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", gap: "4px" }}>
                      {[0,1,2].map(j => <div key={j} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#94a3b8", animation: `bounce 0.8s ${j * 0.15}s infinite` }} />)}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "10px" }}>
                <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendAiMessage()} placeholder="اسأل Claude AI..." disabled={aiChatLoading}
                  style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", outline: "none" }}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                <button onClick={sendAiMessage} disabled={aiChatLoading || !aiInput.trim()}
                  style={{ padding: "10px 18px", background: aiInput.trim() ? "#0f172a" : "#f1f5f9", color: aiInput.trim() ? "white" : "#94a3b8", border: "none", borderRadius: "10px", cursor: aiInput.trim() ? "pointer" : "not-allowed", fontSize: "13px", fontFamily: "Tajawal, sans-serif", fontWeight: "600" }}>
                  {aiChatLoading ? "..." : "إرسال"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ بانتظار الموافقة ════════════════ */}
        {activeTab === "pending" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>⏳ بانتظار الموافقة</h1>
              <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0" }}>راجع كل منتج قبل نشره على الموقع</p>
            </div>
            {loading ? <p style={{ color: "#94a3b8" }}>جاري التحميل...</p>
              : products.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px", background: "white", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
                  <p style={{ color: "#94a3b8", fontSize: "15px" }}>لا توجد منتجات بانتظار الموافقة</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {products.map(p => (
                    <div key={p.id} style={{ background: "white", borderRadius: "14px", padding: "18px 22px", border: "1.5px solid #e2e8f0", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", cursor: "pointer", transition: "all 0.2s" }}
                      onClick={() => setProductDetail(p)}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(34,197,94,0.1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}>
                      <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={p.image} alt="" style={{ maxWidth: "48px", maxHeight: "48px", objectFit: "contain" }} onError={e => e.target.style.display = "none"} />
                      </div>
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <p style={{ color: "#0f172a", fontWeight: "700", margin: "0 0 6px", fontSize: "14px" }}>{p.name}</p>
                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                          {[p.brand && `🏷️ ${p.brand}`, p.category_name && `📂 ${p.category_name}`].filter(Boolean).map((txt, i) => (
  <span key={i} style={{ color: "#94a3b8", fontSize: "12px" }}>{txt}</span>
))}
{p.store_name && (
  <a href={`/store/${p.store_id}`} target="_blank" rel="noreferrer"
    style={{ color: "#22c55e", fontSize: "12px", textDecoration: "none", fontWeight: "600" }}
    onClick={e => e.stopPropagation()}>
    🏪 {p.store_name}
  </a>
)}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => approveProduct(p.id)} style={{ padding: "9px 18px", background: "#15803d", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "700", fontFamily: "Tajawal, sans-serif" }}>✓ موافقة</button>
                        <button onClick={() => setRejectModal(p)} style={{ padding: "9px 18px", background: "#fef2f2", color: "#ef4444", border: "1.5px solid #fecaca", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "700", fontFamily: "Tajawal, sans-serif" }}>✕ رفض</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* ════════════════ تذاكر الدعم ════════════════ */}
        {activeTab === "tickets" && !activeTicket && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>🎫 تذاكر الدعم</h1>
                <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0" }}>تواصل التجار مع الإدارة</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {[{ key: "", label: "الكل" }, { key: "open", label: "مفتوحة", color: "#3b82f6" }, { key: "in_progress", label: "قيد المتابعة", color: "#f59e0b" }, { key: "closed", label: "مغلقة", color: "#64748b" }].map(f => (
                  <button key={f.key} onClick={async () => { const url = f.key ? `${TICKETS_API}/admin?status=${f.key}` : `${TICKETS_API}/admin`; const d = await fetch(url, { headers: h() }).then(r => r.json()); if (Array.isArray(d)) setTickets(d); }}
                    style={{ padding: "7px 14px", borderRadius: "8px", border: "1.5px solid #e2e8f0", background: "white", color: f.color || "#64748b", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>{f.label}</button>
                ))}
              </div>
            </div>
            {tickets.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px", background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", color: "#94a3b8" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎫</div>
                <p>لا توجد تذاكر</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {tickets.map(ticket => {
                  const cfg = { open: { label: "مفتوحة", color: "#3b82f6", bg: "#eff6ff" }, in_progress: { label: "قيد المتابعة", color: "#f59e0b", bg: "#fffbeb" }, closed: { label: "مغلقة", color: "#64748b", bg: "#f8fafc" } }[ticket.status] || { label: "مفتوحة", color: "#3b82f6", bg: "#eff6ff" };
                  return (
                    <div key={ticket.id} onClick={async () => { const data = await fetch(`${TICKETS_API}/${ticket.id}/admin`, { headers: h() }).then(r => r.json()); setActiveTicket(data.ticket); setTicketMessages(data.messages || []); }}
                      style={{ background: "white", borderRadius: "14px", border: `1.5px solid ${Number(ticket.unread_count) > 0 ? "#3b82f6" : "#e2e8f0"}`, padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "14px", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>🎫</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <p style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ticket.subject}</p>
                          {Number(ticket.unread_count) > 0 && <span style={{ background: "#3b82f6", color: "white", borderRadius: "99px", fontSize: "10px", fontWeight: "700", padding: "1px 6px", flexShrink: 0 }}>{ticket.unread_count} جديد</span>}
                        </div>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>🏪 {ticket.store_name}</span>
                      </div>
                      <span style={{ padding: "4px 12px", borderRadius: "99px", fontSize: "11px", fontWeight: "700", background: cfg.bg, color: cfg.color, flexShrink: 0 }}>{cfg.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {activeTab === "tickets" && activeTicket && (
          <div>
            <button onClick={() => { setActiveTicket(null); setTicketMessages([]); load(); }} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "13px", fontFamily: "Tajawal, sans-serif", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>← رجوع للتذاكر</button>
            <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "16px 20px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px" }}>🎫 {activeTicket.subject}</h2>
                  <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>🏪 {activeTicket.store_name}</p>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>الحالة:</span>
                  {["open", "in_progress", "closed"].map(s => {
                    const colors = { open: "#3b82f6", in_progress: "#f59e0b", closed: "#64748b" };
                    const labels = { open: "مفتوحة", in_progress: "قيد المتابعة", closed: "مغلقة" };
                    return (
                      <button key={s} onClick={async () => { await fetch(`${TICKETS_API}/${activeTicket.id}/status`, { method: "PUT", headers: h(), body: JSON.stringify({ status: s }) }); setActiveTicket(prev => ({ ...prev, status: s })); }}
                        style={{ padding: "5px 12px", borderRadius: "8px", border: `1.5px solid ${activeTicket.status === s ? colors[s] : "#e2e8f0"}`, background: activeTicket.status === s ? `${colors[s]}15` : "white", color: activeTicket.status === s ? colors[s] : "#64748b", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                        {labels[s]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: "14px" }}>
              <div style={{ maxHeight: "400px", overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {ticketMessages.map((msg, i) => {
                  const isAdm = msg.sender_type === "admin";
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: isAdm ? "flex-end" : "flex-start", gap: "10px" }}>
                      {!isAdm && <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>🏪</div>}
                      <div style={{ maxWidth: "70%" }}>
                        <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 4px" }}>{msg.sender_name} • {new Date(msg.created_at).toLocaleString("ar-PS")}</p>
                        <div style={{ padding: "11px 15px", borderRadius: "14px", borderBottomRightRadius: isAdm ? "4px" : "14px", borderBottomLeftRadius: isAdm ? "14px" : "4px", background: isAdm ? "#0f172a" : "#f8fafc", border: isAdm ? "none" : "1px solid #e2e8f0" }}>
                          <p style={{ margin: 0, fontSize: "13px", color: isAdm ? "white" : "#0f172a", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{msg.message}</p>
                        </div>
                      </div>
                      {isAdm && <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>👮</div>}
                    </div>
                  );
                })}
              </div>
            </div>
            {activeTicket.status !== "closed" && (
              <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "14px", display: "flex", gap: "10px" }}>
                <textarea value={ticketReply} onChange={e => setTicketReply(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleTicketReply(); } }} placeholder="اكتب ردك..." rows={2}
                  style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "14px", fontFamily: "Tajawal, sans-serif", outline: "none", resize: "none" }}
                  onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                <button onClick={handleTicketReply} disabled={sendingReply || !ticketReply.trim()}
                  style={{ padding: "10px 20px", background: ticketReply.trim() ? "#0f172a" : "#f1f5f9", color: ticketReply.trim() ? "white" : "#94a3b8", border: "none", borderRadius: "10px", cursor: ticketReply.trim() ? "pointer" : "not-allowed", fontSize: "14px", fontWeight: "700", fontFamily: "Tajawal, sans-serif", alignSelf: "flex-end" }}>
                  {sendingReply ? "⏳" : "إرسال"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ════════════════ المنتجات ════════════════ */}
        {activeTab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>📦 كل المنتجات <span style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "400" }}>({productsTotal})</span></h1>
              <div style={{ display: "flex", gap: "8px" }}>
                <input placeholder="ابحث عن منتج..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && load()} style={{ ...inp, width: "220px" }} />
<select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); load(); }}
  style={{ ...inp, width: "130px", cursor: "pointer" }}>
  <option value="">كل الحالات</option>
  <option value="approved">✅ مقبول</option>
  <option value="pending">⏳ معلق</option>
  <option value="rejected">❌ مرفوض</option>
</select>
<button onClick={() => { setPage(1); load(); }} style={{ padding: "9px 16px", background: "#0f172a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "Tajawal, sans-serif" }}>🔍</button>
              </div>
            </div>
            <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    {["#", "المنتج", "الفئة", "المتجر", "الحالة", "المشاهدات", ""].map((col, i) => (
                      <th key={i} style={{ padding: "12px 16px", textAlign: "right", color: "#94a3b8", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>جاري التحميل...</td></tr>
                  ) : products.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>لا توجد منتجات</td></tr>
                  ) : products.map(p => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #f8fafc" }} onMouseEnter={e => e.currentTarget.style.background = "#fafafa"} onMouseLeave={e => e.currentTarget.style.background = "white"}>
                      <td style={{ padding: "12px 16px", color: "#cbd5e1", fontSize: "12px" }}>{p.id}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#f8fafc", border: "1px solid #e2e8f0", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img src={p.image} style={{ maxWidth: "32px", maxHeight: "32px", objectFit: "contain" }} onError={e => e.target.style.display = "none"} />
                          </div>
                          <div>
                            <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "600", margin: 0, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                            {p.brand && <p style={{ color: "#94a3b8", fontSize: "11px", margin: 0 }}>{p.brand}</p>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "12px" }}>{p.category_name || "—"}</td>
                      <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "12px" }}>{p.store_name || "—"}</td>
                      <td style={{ padding: "12px 16px" }}><StatusPill status={p.status} /></td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <HBar pct={Math.min((p.views || 0) / 3, 100)} color="#4ade80" height={5} bg="#f1f5f9" />
                          <span style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap" }}>{p.views || 0}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {p.status === "pending" && <button onClick={() => approveProduct(p.id)} style={{ padding: "5px 10px", background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "700" }}>✓</button>}
                          <button onClick={() => deleteProduct(p.id)} style={{ padding: "5px 10px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>حذف</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {productsTotal > 15 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "16px" }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", color: "#64748b", fontSize: "13px" }}>←</button>
                <span style={{ color: "#64748b", fontSize: "13px" }}>صفحة {page} / {totalPages(productsTotal)}</span>
                <button onClick={() => setPage(p => Math.min(totalPages(productsTotal), p + 1))} disabled={page >= totalPages(productsTotal)} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", color: "#64748b", fontSize: "13px" }}>→</button>
              </div>
            )}
          </div>
        )}

        {/* ════════════════ المتاجر ════════════════ */}
        {activeTab === "stores" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>🏪 المتاجر</h1>
              <input placeholder="ابحث..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && load()} style={{ ...inp, width: "220px" }} />
            </div>
            {stores.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px", background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", color: "#94a3b8" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🏪</div>
                <p>لا توجد متاجر</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                {stores.map(s => (
                  <div key={s.id} onClick={() => window.open(`/store/${s.id}`, '_blank')}
                   style={{ background: "white", borderRadius: "16px", padding: "20px", cursor: "pointer", border: `1.5px solid ${s.is_active ? "#e2e8f0" : "#fecaca"}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                        {s.logo ? <img src={s.logo.startsWith("/") ? `/api${s.logo}` : s.logo} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : <span style={{ fontSize: "22px" }}>🏪</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: "#0f172a", fontWeight: "700", margin: 0, fontSize: "15px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</p>
                        <p style={{ color: "#94a3b8", fontSize: "12px", margin: "3px 0 0" }}>📍 {s.city || "—"} • 📦 {s.product_count} منتج</p>
                      </div>
                      <span style={{ padding: "4px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "700", background: s.is_active ? "#f0fdf4" : "#fef2f2", color: s.is_active ? "#15803d" : "#ef4444", flexShrink: 0 }}>
                        {s.is_active ? "✓ نشط" : "⏸ معلق"}
                      </span>
                    </div>
                    <p style={{ color: "#cbd5e1", fontSize: "11px", margin: "0 0 14px" }}>📧 {s.email || "—"}</p>
                    <button onClick={() => toggleStore(s.id, !s.is_active)} style={{ width: "100%", padding: "9px", background: s.is_active ? "#fef2f2" : "#f0fdf4", color: s.is_active ? "#ef4444" : "#15803d", border: `1.5px solid ${s.is_active ? "#fecaca" : "#bbf7d0"}`, borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontFamily: "Tajawal, sans-serif", fontWeight: "700" }}>
                      {s.is_active ? "⏸ تعليق المتجر" : "▶ تفعيل المتجر"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════ المستخدمون ════════════════ */}
        {activeTab === "users" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>👥 المستخدمون <span style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "400" }}>({usersTotal})</span></h1>
              <div style={{ display: "flex", gap: "8px" }}>
                <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); setTimeout(load, 0); }} style={{ ...inp }}>
                  <option value="">كل الصلاحيات</option>
                  <option value="user">user</option>
                  <option value="moderator">moderator</option>
                  <option value="admin">admin</option>
                </select>
                <input placeholder="ابحث..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && load()} style={{ ...inp, width: "180px" }} />
              </div>
            </div>
            <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    {["#", "المستخدم", "البريد الإلكتروني", "الصلاحية", "الحالة", ""].map((col, i) => (
                      <th key={i} style={{ padding: "12px 16px", textAlign: "right", color: "#94a3b8", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>جاري التحميل...</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>لا يوجد مستخدمون</td></tr>
                  ) : users.map(u => (
                    <tr key={u.id} style={{ borderBottom: "1px solid #f8fafc" }} onMouseEnter={e => e.currentTarget.style.background = "#fafafa"} onMouseLeave={e => e.currentTarget.style.background = "white"}>
                      <td style={{ padding: "12px 16px", color: "#cbd5e1", fontSize: "12px" }}>{u.id}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>👤</div>
                          <div>
                            <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "600", margin: 0 }}>{u.name}</p>
                            {u.is_banned && <span style={{ background: "#fef2f2", color: "#ef4444", fontSize: "10px", padding: "1px 5px", borderRadius: "4px", fontWeight: "700" }}>محظور</span>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#94a3b8", fontSize: "12px" }}>{u.email}</td>
                      <td style={{ padding: "12px 16px" }}>
                        {isAdmin ? (
                          <select value={u.role} onChange={e => changeRole(u.id, e.target.value)} style={{ ...inp, padding: "4px 8px", color: u.role === "admin" ? "#15803d" : u.role === "moderator" ? "#d97706" : "#64748b", cursor: "pointer" }}>
                            <option value="user">user</option>
                            <option value="moderator">moderator</option>
                            <option value="admin">admin</option>
                          </select>
                        ) : <span style={{ color: "#64748b", fontSize: "12px" }}>{u.role}</span>}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "700", background: u.is_banned ? "#fef2f2" : "#f0fdf4", color: u.is_banned ? "#ef4444" : "#15803d" }}>
                          {u.is_banned ? "محظور" : "نشط"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {u.is_banned
                          ? <button onClick={() => banUser(u.id, false, null)} style={{ padding: "5px 10px", background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "700" }}>رفع الحظر</button>
                          : <button onClick={() => setBanModal(u)} style={{ padding: "5px 10px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "700" }}>حظر</button>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {usersTotal > 15 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", color: "#64748b", fontSize: "13px" }}>←</button>
                <span style={{ color: "#64748b", fontSize: "13px" }}>{page} / {totalPages(usersTotal)}</span>
                <button onClick={() => setPage(p => Math.min(totalPages(usersTotal), p + 1))} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", color: "#64748b", fontSize: "13px" }}>→</button>
              </div>
            )}
          </div>
        )}

        {/* ════════════════ فريق الإدارة ════════════════ */}
        {activeTab === "moderators" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>🛡️ فريق الإدارة</h1>
              <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0" }}>لتعيين مشرف جديد: اذهب لقسم المستخدمين وغيّر صلاحيته</p>
            </div>
            {moderators.length === 0 ? (
              <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "60px", textAlign: "center", color: "#94a3b8" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🛡️</div>
                <p>لا يوجد فريق بعد — عيّن من قسم المستخدمين</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
                {moderators.map(m => (
                  <div key={m.id} style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1.5px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: m.role === "admin" ? "#0f172a" : "#fffbeb", border: `2px solid ${m.role === "admin" ? "#22c55e" : "#fde68a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                        {m.role === "admin" ? "🛡️" : "👮"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: "#0f172a", fontWeight: "700", margin: "0 0 3px", fontSize: "15px" }}>{m.name}</p>
                        <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.email}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                      <span style={{ padding: "5px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "700", background: m.role === "admin" ? "#f0fdf4" : "#fffbeb", color: m.role === "admin" ? "#15803d" : "#d97706" }}>
                        {m.role === "admin" ? "🛡️ Super Admin" : "👮 Moderator"}
                      </span>
                      <span style={{ color: "#cbd5e1", fontSize: "11px" }}>{new Date(m.created_at).toLocaleDateString("ar-PS")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ══ النوافذ المنبثقة ══ */}
      {banModal && (
        <Modal title={`🚫 حظر: ${banModal.name}`} confirmLabel="تأكيد الحظر" onConfirm={() => banUser(banModal.id, true, banReason)} onClose={() => { setBanModal(null); setBanReason(""); }}>
          <textarea placeholder="سبب الحظر (اختياري)" value={banReason} onChange={e => setBanReason(e.target.value)} rows={3}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", resize: "none", outline: "none", boxSizing: "border-box" }} />
        </Modal>
      )}
      {rejectModal && (
        <Modal title={`✕ رفض: ${rejectModal.name}`} confirmLabel="تأكيد الرفض" onConfirm={() => rejectProduct(rejectModal.id, rejectReason)} onClose={() => { setRejectModal(null); setRejectReason(""); }}>
          <textarea placeholder="سبب الرفض (اختياري)" value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", resize: "none", outline: "none", boxSizing: "border-box" }} />
        </Modal>
      )}
      {productDetail && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "20px", width: "100%", maxWidth: "540px", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: 0 }}>📦 تفاصيل المنتج</h3>
              <button onClick={() => setProductDetail(null)} style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b", fontSize: "16px" }}>✕</button>
            </div>
            <div style={{ padding: "22px 24px", overflowY: "auto", flex: 1 }}>
              <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
                <div style={{ width: "96px", height: "96px", borderRadius: "14px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                  <img src={productDetail.image} alt="" style={{ maxWidth: "84px", maxHeight: "84px", objectFit: "contain" }} onError={e => e.target.style.display = "none"} />
                </div>
                <div>
                  <h2 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "800", margin: "0 0 8px" }}>{productDetail.name}</h2>
                  {[productDetail.brand && `🏷️ ${productDetail.brand}`, productDetail.store_name && `🏪 ${productDetail.store_name}`, productDetail.category_name && `📂 ${productDetail.category_name}`].filter(Boolean).map((x, i) => (
                    <p key={i} style={{ color: "#64748b", fontSize: "13px", margin: "0 0 4px" }}>{x}</p>
                  ))}
                </div>
              </div>
              <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "14px 16px", marginBottom: "16px" }}>
                {[
                  { label: "الحالة",        value: productDetail.status },
                  { label: "المشاهدات",     value: productDetail.views || 0 },
                  { label: "تاريخ الإضافة", value: productDetail.created_at ? new Date(productDetail.created_at).toLocaleDateString("ar-PS") : "—" },
                ].map((row, i, arr) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < arr.length - 1 ? "1px solid #e2e8f0" : "none" }}>
                    <span style={{ color: "#94a3b8", fontSize: "13px" }}>{row.label}</span>
                    <span style={{ color: "#0f172a", fontSize: "13px", fontWeight: "600" }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <a href={`http://localhost:5173/product/${productDetail.id}`} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", padding: "9px", background: "#f1f5f9", borderRadius: "10px", textDecoration: "none", color: "#475569", fontSize: "13px", fontWeight: "600" }}>
                🔗 عرض صفحة المنتج
              </a>
            </div>
            <div style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "10px" }}>
              <button onClick={() => { approveProduct(productDetail.id); setProductDetail(null); }} style={{ flex: 1, padding: "12px", background: "#15803d", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "700", fontFamily: "Tajawal, sans-serif" }}>✓ موافقة على النشر</button>
              <button onClick={() => { setRejectModal(productDetail); setProductDetail(null); }} style={{ flex: 1, padding: "12px", background: "#fef2f2", color: "#ef4444", border: "1.5px solid #fecaca", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "700", fontFamily: "Tajawal, sans-serif" }}>✕ رفض</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-5px); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}