import { useEffect, useState, useCallback } from "react";
import NotificationBell from "./components/NotificationBell";

const API = "/api/admin";
const TICKETS_API = "/api/tickets";

const SIDEBAR = [
  { key: "overview",       icon: "📊", ar: "نظرة عامة",        en: "Overview",      roles: ["admin","moderator"] },
  { key: "ai",             icon: "🤖", ar: "تحليل ذكي",         en: "AI Analysis",   roles: ["admin","moderator"] },
  { key: "pending",        icon: "⏳", ar: "بانتظار الموافقة", en: "Pending",       roles: ["admin","moderator"], badge: "pending" },
  { key: "tickets",        icon: "🎫", ar: "تذاكر الدعم",       en: "Support",       roles: ["admin","moderator"], badge: "tickets" },
  { key: "products",       icon: "📦", ar: "المنتجات",          en: "Products",      roles: ["admin","moderator"] },
  { key: "stores",         icon: "🏪", ar: "المتاجر",           en: "Stores",        roles: ["admin","moderator"] },
  { key: "users",          icon: "👥", ar: "المستخدمون",        en: "Users",         roles: ["admin","moderator"] },
  { key: "moderators",     icon: "🛡️", ar: "فريق الإدارة",     en: "Team",          roles: ["admin","moderator"] },
];

function Badge({ n, color = "#ef4444" }) {
  if (!n || n === "0" || n === 0) return null;
  return <span style={{ background: color, color: "white", borderRadius: "99px", fontSize: "10px", fontWeight: "700", padding: "1px 7px", marginRight: "auto" }}>{n}</span>;
}

function Stat({ icon, label, value, color, onClick, isText }) {
  return (
    <div onClick={onClick} style={{
      background: "white", borderRadius: "12px", padding: "20px",
      border: "1px solid #e2e8f0", borderTop: `3px solid ${color}`,
      cursor: onClick ? "pointer" : "default", transition: "all 0.2s",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
    }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <span style={{ fontSize: "22px" }}>{icon}</span>
      <p style={{ color: "#94a3b8", fontSize: "12px", margin: "10px 0 4px", fontWeight: "500" }}>{label}</p>
      <p style={{ fontSize: isText ? "15px" : "24px", fontWeight: "700", color: "#0f172a", margin: 0, lineHeight: 1.2 }}>{value ?? "—"}</p>
    </div>
  );
}

function Modal({ title, onConfirm, onClose, confirmLabel, confirmColor = "#ef4444", children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
      <div style={{ background: "white", borderRadius: "14px", padding: "28px", width: "100%", maxWidth: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <h3 style={{ color: "#0f172a", margin: "0 0 16px", fontSize: "16px", fontWeight: "700" }}>{title}</h3>
        {children}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button onClick={onConfirm} style={{ flex: 1, padding: "10px", background: confirmColor, color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "Tajawal, sans-serif" }}>{confirmLabel}</button>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontFamily: "Tajawal, sans-serif" }}>إلغاء</button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { approved: ["#22c55e", "#f0fdf4"], pending: ["#f59e0b", "#fffbeb"], rejected: ["#ef4444", "#fef2f2"] };
  const [color, bg] = map[status] || ["#64748b", "#f8fafc"];
  return <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "600", color, background: bg, border: `1px solid ${color}30` }}>{status}</span>;
}

export default function AdminDashboard({ lang = "ar" }) {
  const t = (ar, en) => lang === "ar" ? ar : en;

  const [activeTab, setActiveTab] = useState("overview");
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [adminUser, setAdminUser] = useState(() => {
    const r = localStorage.getItem("adminRole");
    const n = localStorage.getItem("adminName");
    return r ? { role: r, name: n } : null;
  });

  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsTotal, setProductsTotal] = useState(0);
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [moderators, setModerators] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);

  // Tickets
  const [tickets, setTickets]           = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [ticketReply, setTicketReply]   = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [openTicketsCount, setOpenTicketsCount] = useState(0);

  // AI Analysis
  const [aiReport, setAiReport]             = useState(null);
  const [aiLoading, setAiLoading]           = useState(false);
  const [aiChat, setAiChat]                 = useState([]);
  const [aiInput, setAiInput]               = useState("");
  const [aiChatLoading, setAiChatLoading]   = useState(false);
  const [reportType, setReportType]         = useState("full");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const [loginError, setLoginError] = useState("");

  const [banModal, setBanModal] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const h = useCallback(() => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" }), [token]);

  useEffect(() => { if (token) { setPage(1); load(); } }, [token, activeTab]);
  useEffect(() => { if (token) load(); }, [page]);
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/notifications`, { headers: h() }).then(r => r.json()).then(d => { if (Array.isArray(d)) setUnread(d.filter(n => !n.is_read).length); }).catch(() => {});
    fetch(`${TICKETS_API}/admin`, { headers: h() }).then(r => r.json()).then(d => { if (Array.isArray(d)) setOpenTicketsCount(d.filter(t => t.status !== "closed").length); }).catch(() => {});

    // استقبال navigate من NotificationBell
    function handleAdminNavigate(e) {
      const link = e.detail?.link || "";
      if (link.includes("/tickets/")) {
        const parts = link.split("/tickets/");
        const tId = parts[1];
        setActiveTab("tickets");
        if (tId) {
          fetch(`${TICKETS_API}/${tId}/admin`, { headers: h() })
            .then(r => r.json())
            .then(data => { setActiveTicket(data.ticket); setTicketMessages(data.messages || []); });
        }
      } else if (link.includes("pending")) {
        setActiveTab("pending");
      } else if (link.includes("tickets")) {
        setActiveTab("tickets");
      }
    }
    window.addEventListener("admin-navigate", handleAdminNavigate);
    return () => window.removeEventListener("admin-navigate", handleAdminNavigate);
  }, [token]);

  async function load() {
    setLoading(true);
    try {
      const heads = h();
      switch (activeTab) {
        case "overview": {
          const [a, n] = await Promise.all([
            fetch(`${API}/analytics`, { headers: heads }).then(r => r.json()),
            fetch(`${API}/notifications`, { headers: heads }).then(r => r.json()),
          ]);
          setAnalytics(a);
          if (Array.isArray(n)) { setNotifications(n.slice(0, 8)); setUnread(n.filter(x => !x.is_read).length); }
          break;
        }
        case "pending": {
          const d = await fetch(`${API}/products?status=pending&page=${page}`, { headers: heads }).then(r => r.json());
          setProducts(d.products || []); setProductsTotal(d.total || 0);
          break;
        }
        case "products": {
          const d = await fetch(`${API}/products?search=${search}&page=${page}`, { headers: heads }).then(r => r.json());
          setProducts(d.products || []); setProductsTotal(d.total || 0);
          break;
        }
        case "stores": {
          const d = await fetch(`${API}/stores?search=${search}&page=${page}`, { headers: heads }).then(r => r.json());
          setStores(d.stores || []);
          break;
        }
        case "users": {
          const d = await fetch(`${API}/users?role=${roleFilter}&search=${search}&page=${page}`, { headers: heads }).then(r => r.json());
          setUsers(d.users || []); setUsersTotal(d.total || 0);
          break;
        }
        case "tickets": {
          const res = await fetch(`${TICKETS_API}/admin`, { headers: heads });
          const data = await res.json();
          if (Array.isArray(data)) {
            setTickets(data);
            setOpenTicketsCount(data.filter(t => t.status !== "closed").length);
          }
          break;
        }
        case "moderators": {
          const d = await fetch(`${API}/moderators`, { headers: heads }).then(r => r.json());
          setModerators(Array.isArray(d) ? d : []);
          break;
        }
        case "notifications": {
          const d = await fetch(`${API}/notifications`, { headers: heads }).then(r => r.json());
          if (Array.isArray(d)) { setNotifications(d); setUnread(d.filter(n => !n.is_read).length); }
          break;
        }
      }
    } catch { }
    setLoading(false);
  }

  async function handleLogin() {
    setLoginError("");
    try {
      const res = await fetch(`${API}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: loginEmail, password: loginPwd }) });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.error || "خطأ"); return; }
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminRole", data.user.role);
      localStorage.setItem("adminName", data.user.name);
      setToken(data.token);
      setAdminUser(data.user);
    } catch { setLoginError("تعذر الاتصال بالسيرفر"); }
  }

  function handleLogout() {
    ["adminToken", "adminRole", "adminName"].forEach(k => localStorage.removeItem(k));
    setToken(null); setAdminUser(null);
  }

  const isAdmin = adminUser?.role === "admin";
  const [productDetail, setProductDetail] = useState(null); // modal لتفاصيل المنتج

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
    if (!window.confirm(t("حذف هذا المنتج؟", "Delete?"))) return;
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
    if (!isAdmin) return alert(t("صلاحية المدير فقط", "Admin only"));
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
    try {
      await fetch(`${TICKETS_API}/${activeTicket.id}/reply/admin`, {
        method: "POST", headers: h(),
        body: JSON.stringify({ message: ticketReply.trim() })
      });
      setTicketReply("");
      // إعادة تحميل الرسائل
      const res = await fetch(`${TICKETS_API}/${activeTicket.id}/admin`, { headers: h() });
      const data = await res.json();
      setTicketMessages(data.messages || []);
      setActiveTicket(data.ticket);
    } catch { }
    setSendingReply(false);
  }

  const totalPages = (total, limit = 15) => Math.ceil(total / limit);

  // ========== AI FUNCTIONS ==========

  async function generateReport(type = "full") {
    if (!analytics) { alert(t("افتح نظرة عامة أولاً", "Load overview first")); return; }
    setAiLoading(true);
    setAiReport(null);

    const prompts = {
      full: `أنت محلل بيانات متخصص في منصات التجارة الإلكترونية. حلّل بيانات موقع PalPrice الفلسطيني لمقارنة الأسعار وأعطني تقريراً شاملاً بالعربية.

البيانات الحالية:
- عدد المنتجات: ${analytics.products}
- عدد المتاجر: ${analytics.stores}
- عدد الأسعار المسجلة: ${analytics.prices}
- عدد المستخدمين: ${analytics.users}
- منتجات بانتظار الموافقة: ${analytics.pending}
- مستخدمون محظورون: ${analytics.banned}
- منتجات جديدة هذا الأسبوع: ${analytics.newThisWeek}
- المنتج الأكثر مشاهدة: ${analytics.mostViewed}

اكتب تقريراً احترافياً يشمل:
1. **ملخص تنفيذي** — حالة الموقع العامة
2. **نقاط القوة** — ما يسير بشكل جيد
3. **نقاط الضعف** — ما يحتاج تحسين
4. **تحليل الأرقام** — ما تعنيه هذه الأرقام
5. **توصيات فورية** — 3 إجراءات يجب اتخاذها الآن
6. **توقعات** — ما يمكن تحقيقه خلال الشهر القادم`,

      security: `أنت خبير أمن معلومات. حلّل بيانات موقع PalPrice وابحث عن مخاطر أمنية محتملة.

البيانات:
- مستخدمون محظورون: ${analytics.banned} من أصل ${analytics.users}
- منتجات مرفوضة أو معلقة: ${analytics.pending}
- عدد المتاجر: ${analytics.stores}

قدّم تقرير أمني يشمل:
1. **تقييم المخاطر الحالية**
2. **مؤشرات مشبوهة** في الأرقام
3. **توصيات أمنية** فورية
4. **سياسات** يجب تطبيقها`,

      growth: `أنت خبير نمو في مجال التجارة الإلكترونية. حلّل إمكانيات النمو لموقع PalPrice.

البيانات:
- منتجات: ${analytics.products} | متاجر: ${analytics.stores}
- مستخدمون: ${analytics.users}
- منتجات جديدة هذا الأسبوع: ${analytics.newThisWeek}
- أسعار مسجلة: ${analytics.prices}

قدّم خطة نمو تشمل:
1. **تحليل وضع النمو الحالي**
2. **فرص النمو** غير المستغلة
3. **استراتيجيات** لزيادة المستخدمين والمتاجر
4. **KPIs** يجب متابعتها
5. **خطة 90 يوم** للنمو`
    };

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompts[type] || prompts.full }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "تعذر الحصول على التقرير";
      setAiReport({ text, type, time: new Date().toLocaleString("ar-PS") });
    } catch (err) {
      setAiReport({ text: "❌ تعذر الاتصال بالسيرفر. تأكد من إضافة ANTHROPIC_API_KEY في ملف .env", type, time: new Date().toLocaleString("ar-PS") });
    }
    setAiLoading(false);
  }

  async function sendAiMessage() {
    if (!aiInput.trim() || aiChatLoading) return;
    const userMsg = aiInput.trim();
    setAiInput("");
    setAiChat(prev => [...prev, { role: "user", content: userMsg }]);
    setAiChatLoading(true);

    const context = analytics ? `
معلومات موقع PalPrice:
- منتجات: ${analytics.products} | متاجر: ${analytics.stores} | أسعار: ${analytics.prices}
- مستخدمون: ${analytics.users} | محظورون: ${analytics.banned}
- pending: ${analytics.pending} | جديد هذا الأسبوع: ${analytics.newThisWeek}
- الأكثر مشاهدة: ${analytics.mostViewed}
` : "";

    const messages = [
      { role: "user", content: `${context}\n\nأنت مساعد ذكي لإدارة موقع PalPrice. أجب على هذا السؤال بالعربية بشكل مختصر ومفيد:\n${userMsg}` },
      ...aiChat.slice(-6).map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: userMsg }
    ];

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `${context ? `معلومات الموقع:\n${context}\n\n` : ""}أنت مساعد ذكي لإدارة موقع PalPrice. أجب بالعربية بشكل مختصر ومفيد:\n${userMsg}` }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "تعذر الحصول على رد";
      setAiChat(prev => [...prev, { role: "assistant", content: text }]);
    } catch {
      setAiChat(prev => [...prev, { role: "assistant", content: "❌ تعذر الاتصال بالسيرفر" }]);
    }
    setAiChatLoading(false);
  }

  const inp = { padding: "9px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", outline: "none", background: "white", color: "#0f172a" };
  const textarea = { ...inp, width: "100%", boxSizing: "border-box", resize: "none", display: "block" };

  /* ========== LOGIN ========== */
  if (!token) return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Tajawal, sans-serif" }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "44px", width: "100%", maxWidth: "380px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: "24px" }}>🛡️</div>
          <h1 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "800", margin: "0 0 4px" }}>PalPrice Admin</h1>
          <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>{t("لوحة تحكم الإدارة", "Admin Dashboard")}</p>
        </div>
        {loginError && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>{loginError}</div>}
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>{t("البريد الإلكتروني", "Email")}</label>
          <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ ...inp, width: "100%", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>{t("كلمة المرور", "Password")}</label>
          <input type="password" value={loginPwd} onChange={e => setLoginPwd(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ ...inp, width: "100%", boxSizing: "border-box" }} />
        </div>
        <button onClick={handleLogin} style={{ width: "100%", padding: "12px", background: "#0f172a", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
          {t("تسجيل الدخول", "Login")}
        </button>
        <p style={{ textAlign: "center", marginTop: "14px", fontSize: "12px", color: "#94a3b8" }}>{t("للمدراء والمشرفين فقط", "Admins & Moderators only")}</p>
      </div>
    </div>
  );

  /* ========== DASHBOARD ========== */
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "Tajawal, sans-serif" }}>

      {/* Sidebar */}
      <aside style={{ width: "220px", background: "white", borderLeft: "1px solid #e2e8f0", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0, boxShadow: "2px 0 8px rgba(0,0,0,0.04)", overflow: "visible", zIndex: 50 }}>

        {/* Logo + Logout */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ color: "#0f172a", fontSize: "17px", fontWeight: "800", margin: 0 }}>PalPrice</p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <NotificationBell mode="admin" token={token} lang={lang} dropdownSide="right" />
              <button onClick={handleLogout} title={t("خروج", "Logout")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#94a3b8", padding: "4px" }}>🚪</button>
            </div>
          </div>
          <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>👤</div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "600", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{adminUser?.name || "Admin"}</p>
              <p style={{ color: adminUser?.role === "admin" ? "#22c55e" : "#f59e0b", fontSize: "11px", margin: 0, fontWeight: "600" }}>
                {adminUser?.role === "admin" ? "🛡️ Super Admin" : "👮 Moderator"}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {SIDEBAR.map(item => (
            <button key={item.key} onClick={() => { setActiveTab(item.key); setSearch(""); setPage(1); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "9px",
                padding: "9px 10px", borderRadius: "8px", border: "none", cursor: "pointer",
                background: activeTab === item.key ? "#0f172a" : "transparent",
                color: activeTab === item.key ? "white" : "#64748b",
                fontSize: "13px", fontWeight: activeTab === item.key ? "600" : "400",
                fontFamily: "Tajawal, sans-serif", textAlign: "right", marginBottom: "2px",
                transition: "all 0.15s"
              }}
              onMouseEnter={e => { if (activeTab !== item.key) e.currentTarget.style.background = "#f8fafc"; }}
              onMouseLeave={e => { if (activeTab !== item.key) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: "14px" }}>{item.icon}</span>
              {lang === "ar" ? item.ar : item.en}
              {item.badge === "pending" && <Badge n={analytics?.pending} color="#f59e0b" />}
              {item.badge === "unread" && <Badge n={unread} />}
              {item.badge === "tickets" && <Badge n={openTicketsCount} color="#3b82f6" />}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "28px", overflowY: "auto" }}>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <h1 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}>📊 {t("نظرة عامة", "Overview")}</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px", marginBottom: "24px" }}>
              <Stat icon="📦" label={t("المنتجات", "Products")} value={analytics?.products} color="#3b82f6" />
              <Stat icon="🏪" label={t("المتاجر", "Stores")} value={analytics?.stores} color="#22c55e" />
              <Stat icon="💰" label={t("الأسعار", "Prices")} value={analytics?.prices} color="#f59e0b" />
              <Stat icon="👥" label={t("المستخدمون", "Users")} value={analytics?.users} color="#8b5cf6" />
              <Stat icon="⏳" label={t("بانتظار الموافقة", "Pending")} value={analytics?.pending} color="#f97316" onClick={() => setActiveTab("pending")} />
              <Stat icon="🆕" label={t("هذا الأسبوع", "This Week")} value={analytics?.newThisWeek} color="#06b6d4" />
              <Stat icon="🚫" label={t("محظورون", "Banned")} value={analytics?.banned} color="#ef4444" />
              <Stat icon="🔥" label={t("الأكثر مشاهدة", "Top Product")} value={analytics?.mostViewed} color="#f43f5e" isText />
            </div>

            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px" }}>
              <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "600", marginBottom: "16px" }}>🔔 {t("آخر الإشعارات", "Recent Notifications")}</h3>
              {notifications.map((n, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 0", borderBottom: i < notifications.length - 1 ? "1px solid #f8fafc" : "none" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: n.is_read ? "#e2e8f0" : "#22c55e", flexShrink: 0 }} />
                  <p style={{ color: n.is_read ? "#94a3b8" : "#475569", fontSize: "13px", margin: 0, flex: 1 }}>{n.message}</p>
                  <span style={{ color: "#cbd5e1", fontSize: "11px", whiteSpace: "nowrap" }}>{new Date(n.created_at).toLocaleDateString("ar-PS")}</span>
                </div>
              ))}
              {!notifications.length && <p style={{ color: "#94a3b8", fontSize: "13px", textAlign: "center", padding: "16px 0" }}>لا توجد إشعارات</p>}
            </div>
          </div>
        )}

        {/* AI ANALYSIS */}
        {activeTab === "ai" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: "0 0 4px" }}>
                🤖 {t("تحليل ذكي بـ Claude AI", "AI Analysis with Claude")}
              </h1>
              <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
                {t("احصل على تقارير وتحليلات ذكية لموقعك", "Get smart reports and insights for your site")}
              </p>
            </div>

            {/* Report Buttons */}
            <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px", marginBottom: "20px" }}>
              <h3 style={{ color: "#0f172a", fontSize: "14px", fontWeight: "600", margin: "0 0 16px" }}>
                📋 {t("توليد تقرير", "Generate Report")}
              </h3>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
                {[
                  { key: "full", icon: "📊", label: t("تقرير شامل", "Full Report"), color: "#3b82f6" },
                  { key: "security", icon: "🔒", label: t("تقرير أمني", "Security Report"), color: "#ef4444" },
                  { key: "growth", icon: "📈", label: t("تقرير النمو", "Growth Report"), color: "#22c55e" },
                ].map(r => (
                  <button key={r.key} onClick={() => { setReportType(r.key); generateReport(r.key); }}
                    disabled={aiLoading}
                    style={{
                      padding: "10px 20px", borderRadius: "10px", border: `1.5px solid ${r.color}`,
                      background: reportType === r.key && aiReport ? r.color : "white",
                      color: reportType === r.key && aiReport ? "white" : r.color,
                      cursor: aiLoading ? "not-allowed" : "pointer", fontSize: "13px",
                      fontWeight: "600", fontFamily: "Tajawal, sans-serif",
                      display: "flex", alignItems: "center", gap: "7px", transition: "all 0.2s"
                    }}>
                    <span>{r.icon}</span> {r.label}
                  </button>
                ))}
              </div>

              {/* Loading */}
              {aiLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "20px", background: "#f8fafc", borderRadius: "10px" }}>
                  <div style={{ width: "20px", height: "20px", border: "2px solid #e2e8f0", borderTop: "2px solid #3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>
                    {t("Claude AI يحلل البيانات...", "Claude AI is analyzing...")}
                  </p>
                </div>
              )}

              {/* Report */}
              {aiReport && !aiLoading && (
                <div style={{ background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", background: "#0f172a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#22c55e", fontSize: "13px", fontWeight: "600" }}>
                      🤖 Claude AI • {aiReport.time}
                    </span>
                    <button onClick={() => {
                      const blob = new Blob([aiReport.text], { type: "text/plain;charset=utf-8" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url; a.download = `palprice-report-${Date.now()}.txt`; a.click();
                    }} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontFamily: "Tajawal, sans-serif" }}>
                      ⬇️ {t("تحميل", "Download")}
                    </button>
                  </div>
                  <div style={{ padding: "20px", maxHeight: "480px", overflowY: "auto" }}>
                    {aiReport.text.split("\n").map((line, i) => {
                      const isBold = line.startsWith("**") && line.includes("**");
                      const isHeader = line.startsWith("##") || line.startsWith("#");
                      const cleaned = line.replace(/\*\*/g, "").replace(/^#+\s*/, "");
                      if (!cleaned.trim()) return <br key={i} />;
                      return (
                        <p key={i} style={{
                          margin: "4px 0",
                          fontSize: isHeader ? "15px" : "13px",
                          fontWeight: isBold || isHeader ? "700" : "400",
                          color: isHeader ? "#0f172a" : "#475569",
                          lineHeight: 1.7
                        }}>
                          {cleaned}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* AI Chat */}
            <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🤖</div>
                <div>
                  <p style={{ color: "#0f172a", fontSize: "14px", fontWeight: "600", margin: 0 }}>Claude AI Assistant</p>
                  <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>{t("اسأل عن أي شيء في موقعك", "Ask anything about your site")}</p>
                </div>
                {aiChat.length > 0 && (
                  <button onClick={() => setAiChat([])} style={{ marginRight: "auto", padding: "5px 12px", background: "#f1f5f9", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", color: "#64748b", fontFamily: "Tajawal, sans-serif" }}>
                    {t("مسح", "Clear")}
                  </button>
                )}
              </div>

              {/* Messages */}
              <div style={{ height: "320px", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {aiChat.length === 0 && (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                    <span style={{ fontSize: "40px", marginBottom: "10px" }}>💬</span>
                    <p style={{ fontSize: "13px", textAlign: "center" }}>
                      {t("ابدأ محادثة مع Claude AI\nمثلاً: \"ما هي أكثر فئة منتجات مبيعاً؟\"", "Start chatting with Claude AI")}
                    </p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginTop: "12px" }}>
                      {[
                        t("ما هي نقاط ضعف الموقع؟", "What are the site's weaknesses?"),
                        t("كيف أزيد المستخدمين؟", "How to increase users?"),
                        t("هل الأسعار تنافسية؟", "Are prices competitive?"),
                      ].map((q, i) => (
                        <button key={i} onClick={() => { setAiInput(q); }}
                          style={{ padding: "6px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "99px", cursor: "pointer", fontSize: "12px", color: "#475569", fontFamily: "Tajawal, sans-serif" }}>
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {aiChat.map((msg, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-start" : "flex-end", gap: "8px" }}>
                    {msg.role === "assistant" && (
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", flexShrink: 0, marginTop: "2px" }}>🤖</div>
                    )}
                    <div style={{
                      maxWidth: "75%", padding: "10px 14px", borderRadius: "12px",
                      background: msg.role === "user" ? "#0f172a" : "#f8fafc",
                      border: msg.role === "assistant" ? "1px solid #e2e8f0" : "none",
                      borderBottomRightRadius: msg.role === "user" ? "4px" : "12px",
                      borderBottomLeftRadius: msg.role === "assistant" ? "4px" : "12px",
                    }}>
                      <p style={{
                        margin: 0, fontSize: "13px", lineHeight: 1.6,
                        color: msg.role === "user" ? "white" : "#475569",
                        whiteSpace: "pre-wrap"
                      }}>{msg.content}</p>
                    </div>
                  </div>
                ))}

                {aiChatLoading && (
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>🤖</div>
                    <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                      <div style={{ display: "flex", gap: "4px" }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#94a3b8", animation: `bounce ${0.6 + i * 0.2}s infinite` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div style={{ padding: "14px 16px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "10px" }}>
                <input
                  value={aiInput} onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendAiMessage()}
                  placeholder={t("اسأل Claude AI...", "Ask Claude AI...")}
                  disabled={aiChatLoading}
                  style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", outline: "none", background: "#f8fafc" }}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
                <button onClick={sendAiMessage} disabled={aiChatLoading || !aiInput.trim()}
                  style={{ padding: "10px 18px", background: aiInput.trim() ? "#0f172a" : "#f1f5f9", color: aiInput.trim() ? "white" : "#94a3b8", border: "none", borderRadius: "10px", cursor: aiInput.trim() ? "pointer" : "not-allowed", fontSize: "13px", fontFamily: "Tajawal, sans-serif", fontWeight: "600", transition: "all 0.2s" }}>
                  {aiChatLoading ? "..." : t("إرسال", "Send")}
                </button>
              </div>
            </div>

            <style>{`
              @keyframes spin { to { transform: rotate(360deg); } }
              @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
            `}</style>
          </div>
        )}

        {/* PENDING */}
        {activeTab === "pending" && (
          <div>
            <h1 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", marginBottom: "6px" }}>⏳ {t("بانتظار الموافقة", "Pending Approval")}</h1>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "20px" }}>{t("راجع كل منتج قبل نشره على الموقع", "Review before publishing")}</p>

            {loading ? <p style={{ color: "#94a3b8" }}>جاري التحميل...</p>
              : products.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "44px", marginBottom: "10px" }}>✅</div>
                  <p style={{ color: "#94a3b8" }}>{t("لا توجد منتجات بانتظار الموافقة", "No pending products")}</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {products.map(p => (
                    <div key={p.id}
                      style={{ background: "white", borderRadius: "12px", padding: "16px 20px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", cursor: "pointer", transition: "all 0.2s" }}
                      onClick={() => setProductDetail(p)}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#22c55e"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
                      <div style={{ width: "52px", height: "52px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={p.image} alt="" style={{ maxWidth: "44px", maxHeight: "44px", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} />
                      </div>
                      <div style={{ flex: 1, minWidth: "180px" }}>
                        <p style={{ color: "#0f172a", fontWeight: "600", margin: "0 0 4px", fontSize: "14px" }}>{p.name}</p>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                          {[p.brand && `🏷️ ${p.brand}`, p.category_name && `📂 ${p.category_name}`, p.store_name && `🏪 ${p.store_name}`].filter(Boolean).map((txt, i) => (
                            <span key={i} style={{ color: "#94a3b8", fontSize: "12px" }}>{txt}</span>
                          ))}
                        </div>
                      </div>
                      <span style={{ fontSize: "12px", color: "#22c55e", background: "#f0fdf4", padding: "4px 10px", borderRadius: "6px", border: "1px solid #bbf7d0", flexShrink: 0 }}>
                        👁 {t("التفاصيل", "Details")}
                      </span>
                      <div style={{ display: "flex", gap: "8px" }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => approveProduct(p.id)} style={{ padding: "8px 16px", background: "#22c55e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "Tajawal, sans-serif" }}>✓ {t("موافقة", "Approve")}</button>
                        <button onClick={() => setRejectModal(p)} style={{ padding: "8px 16px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "Tajawal, sans-serif" }}>✕ {t("رفض", "Reject")}</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* TICKETS */}
        {activeTab === "tickets" && (
          <div>
            {!activeTicket ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <h1 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: 0 }}>🎫 {t("تذاكر الدعم", "Support Tickets")}</h1>
                    <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>{t("تواصل التجار مع الإدارة", "Store owners contact")}</p>
                  </div>
                  {/* فلتر الحالة */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[
                      { key: "", label: t("الكل", "All") },
                      { key: "open", label: t("مفتوحة", "Open"), color: "#3b82f6" },
                      { key: "in_progress", label: t("قيد المتابعة", "In Progress"), color: "#f59e0b" },
                      { key: "closed", label: t("مغلقة", "Closed"), color: "#64748b" },
                    ].map(f => (
                      <button key={f.key}
                        onClick={async () => {
                          const url = f.key ? `${TICKETS_API}/admin?status=${f.key}` : `${TICKETS_API}/admin`;
                          const res = await fetch(url, { headers: h() });
                          const data = await res.json();
                          if (Array.isArray(data)) setTickets(data);
                        }}
                        style={{ padding: "6px 14px", borderRadius: "8px", border: "1.5px solid #e2e8f0", background: "white", color: f.color || "#64748b", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {tickets.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", color: "#94a3b8" }}>
                    <div style={{ fontSize: "44px", marginBottom: "12px" }}>🎫</div>
                    <p>{t("لا توجد تذاكر", "No tickets")}</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {tickets.map(ticket => {
                      const statusMap = {
                        open:        { label: t("مفتوحة", "Open"),            color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
                        in_progress: { label: t("قيد المتابعة", "In Progress"), color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
                        closed:      { label: t("مغلقة", "Closed"),           color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" },
                      };
                      const cfg = statusMap[ticket.status] || statusMap.open;
                      return (
                        <div key={ticket.id}
                          onClick={async () => {
                            const res = await fetch(`${TICKETS_API}/${ticket.id}/admin`, { headers: h() });
                            const data = await res.json();
                            setActiveTicket(data.ticket);
                            setTicketMessages(data.messages || []);
                          }}
                          style={{ background: "white", borderRadius: "12px", border: `1.5px solid ${Number(ticket.unread_count) > 0 ? "#3b82f6" : "#e2e8f0"}`, padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "14px", transition: "all 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                          onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>

                          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: cfg.bg, border: `1px solid ${cfg.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>🎫</div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                              <p style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ticket.subject}</p>
                              {Number(ticket.unread_count) > 0 && (
                                <span style={{ background: "#3b82f6", color: "white", borderRadius: "99px", fontSize: "10px", fontWeight: "700", padding: "1px 6px", flexShrink: 0 }}>
                                  {ticket.unread_count} {t("جديد", "new")}
                                </span>
                              )}
                            </div>
                            <div style={{ display: "flex", gap: "12px" }}>
                              <span style={{ fontSize: "12px", color: "#64748b" }}>🏪 {ticket.store_name}</span>
                              {ticket.assigned_name && <span style={{ fontSize: "12px", color: "#94a3b8" }}>👮 {ticket.assigned_name}</span>}
                              <span style={{ fontSize: "12px", color: "#94a3b8" }}>{ticket.last_message_at ? new Date(ticket.last_message_at).toLocaleDateString("ar-PS") : ""}</span>
                            </div>
                          </div>

                          <span style={{ padding: "3px 12px", borderRadius: "99px", fontSize: "11px", fontWeight: "600", background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, flexShrink: 0 }}>
                            {cfg.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              /* تفاصيل التذكرة */
              <div>
                <button onClick={() => { setActiveTicket(null); setTicketMessages([]); load(); }}
                  style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "13px", fontFamily: "Tajawal, sans-serif", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                  ← {t("رجوع للتذاكر", "Back to tickets")}
                </button>

                {/* Header التذكرة */}
                <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "16px 20px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                    <div>
                      <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px" }}>🎫 {activeTicket.subject}</h2>
                      <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>🏪 {activeTicket.store_name}</p>
                    </div>
                    {/* تغيير الحالة */}
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>{t("الحالة:", "Status:")}</span>
                      {["open", "in_progress", "closed"].map(s => {
                        const labels = { open: t("مفتوحة", "Open"), in_progress: t("قيد المتابعة", "In Progress"), closed: t("مغلقة", "Closed") };
                        const colors = { open: "#3b82f6", in_progress: "#f59e0b", closed: "#64748b" };
                        return (
                          <button key={s}
                            onClick={async () => {
                              await fetch(`${TICKETS_API}/${activeTicket.id}/status`, {
                                method: "PUT", headers: h(),
                                body: JSON.stringify({ status: s })
                              });
                              setActiveTicket(prev => ({ ...prev, status: s }));
                            }}
                            style={{ padding: "5px 12px", borderRadius: "8px", border: `1.5px solid ${activeTicket.status === s ? colors[s] : "#e2e8f0"}`, background: activeTicket.status === s ? `${colors[s]}15` : "white", color: activeTicket.status === s ? colors[s] : "#64748b", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                            {labels[s]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* الرسائل */}
                <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: "14px" }}>
                  <div style={{ maxHeight: "420px", overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                    {ticketMessages.map((msg, i) => {
                      const isAdmin = msg.sender_type === "admin";
                      return (
                        <div key={i} style={{ display: "flex", justifyContent: isAdmin ? "flex-end" : "flex-start", gap: "10px" }}>
                          {!isAdmin && (
                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>🏪</div>
                          )}
                          <div style={{ maxWidth: "70%" }}>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "4px", justifyContent: isAdmin ? "flex-end" : "flex-start" }}>
                              <span style={{ fontSize: "11px", color: "#94a3b8" }}>{msg.sender_name}</span>
                              <span style={{ fontSize: "11px", color: "#cbd5e1" }}>{new Date(msg.created_at).toLocaleString("ar-PS")}</span>
                            </div>
                            <div style={{
                              padding: "11px 15px", borderRadius: "14px",
                              borderBottomRightRadius: isAdmin ? "4px" : "14px",
                              borderBottomLeftRadius: isAdmin ? "14px" : "4px",
                              background: isAdmin ? "#0f172a" : "#f8fafc",
                              border: isAdmin ? "none" : "1px solid #e2e8f0"
                            }}>
                              <p style={{ margin: 0, fontSize: "13px", color: isAdmin ? "white" : "#0f172a", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{msg.message}</p>
                            </div>
                          </div>
                          {isAdmin && (
                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>👮</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* الرد */}
                {activeTicket.status !== "closed" && (
                  <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "14px", display: "flex", gap: "10px" }}>
                    <textarea
                      value={ticketReply}
                      onChange={e => setTicketReply(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleTicketReply(); } }}
                      placeholder={t("اكتب ردك هنا... (Enter للإرسال)", "Type reply... (Enter to send)")}
                      rows={2}
                      style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "14px", fontFamily: "Tajawal, sans-serif", outline: "none", resize: "none" }}
                      onFocus={e => e.target.style.borderColor = "#22c55e"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />
                    <button onClick={handleTicketReply} disabled={sendingReply || !ticketReply.trim()}
                      style={{ padding: "10px 20px", background: ticketReply.trim() ? "#0f172a" : "#f1f5f9", color: ticketReply.trim() ? "white" : "#94a3b8", border: "none", borderRadius: "10px", cursor: ticketReply.trim() ? "pointer" : "not-allowed", fontSize: "14px", fontWeight: "600", fontFamily: "Tajawal, sans-serif", alignSelf: "flex-end" }}>
                      {sendingReply ? "⏳" : t("إرسال", "Send")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
              <h1 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: 0 }}>📦 {t("كل المنتجات", "All Products")} <span style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "400" }}>({productsTotal})</span></h1>
              <div style={{ display: "flex", gap: "8px" }}>
                <input placeholder={t("ابحث عن منتج...", "Search...")} value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && load()} style={{ ...inp, width: "200px" }} />
                <button onClick={() => { setPage(1); load(); }} style={{ padding: "9px 16px", background: "#0f172a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "Tajawal, sans-serif" }}>🔍</button>
              </div>
            </div>

            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  {["#", t("المنتج", "Product"), t("الفئة", "Cat"), t("المتجر", "Store"), t("الحالة", "Status"), t("مشاهدة", "Views"), ""].map((h, i) => (
                    <th key={i} style={{ padding: "11px 14px", textAlign: "right", color: "#94a3b8", fontSize: "11px", fontWeight: "600" }}>{h}</th>
                  ))}</tr></thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>جاري التحميل...</td></tr>
                  ) : products.map(p => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #f8fafc" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                      onMouseLeave={e => e.currentTarget.style.background = "white"}>
                      <td style={{ padding: "12px 14px", color: "#cbd5e1", fontSize: "12px" }}>{p.id}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                            <img src={p.image} style={{ maxWidth: "30px", maxHeight: "30px", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} />
                          </div>
                          <div>
                            <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "500", margin: 0 }}>{p.name}</p>
                            {p.brand && <p style={{ color: "#94a3b8", fontSize: "11px", margin: 0 }}>{p.brand}</p>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", color: "#64748b", fontSize: "12px" }}>{p.category_name || "—"}</td>
                      <td style={{ padding: "12px 14px", color: "#64748b", fontSize: "12px" }}>{p.store_name || "—"}</td>
                      <td style={{ padding: "12px 14px" }}><StatusBadge status={p.status} /></td>
                      <td style={{ padding: "12px 14px", color: "#94a3b8", fontSize: "12px" }}>{p.views || 0}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {p.status === "pending" && <button onClick={() => approveProduct(p.id)} style={{ padding: "4px 10px", background: "#f0fdf4", color: "#22c55e", border: "1px solid #bbf7d0", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>✓</button>}
                          <button onClick={() => deleteProduct(p.id)} style={{ padding: "4px 10px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>{t("حذف", "Del")}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {productsTotal > 15 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "16px" }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "white", cursor: page === 1 ? "not-allowed" : "pointer", color: "#64748b", fontSize: "13px" }}>←</button>
                <span style={{ color: "#64748b", fontSize: "13px" }}>{t("صفحة", "Page")} {page} / {totalPages(productsTotal)}</span>
                <button onClick={() => setPage(p => Math.min(totalPages(productsTotal), p + 1))} disabled={page >= totalPages(productsTotal)} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", color: "#64748b", fontSize: "13px" }}>→</button>
              </div>
            )}
          </div>
        )}

        {/* STORES */}
        {activeTab === "stores" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
              <h1 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: 0 }}>🏪 {t("المتاجر", "Stores")}</h1>
              <input placeholder={t("ابحث...", "Search...")} value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && load()} style={{ ...inp, width: "200px" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
              {stores.map(s => (
                <div key={s.id} style={{ background: "white", borderRadius: "12px", padding: "18px", border: `1px solid ${s.is_active ? "#e2e8f0" : "#fecaca"}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                      {s.logo ? <img src={s.logo.startsWith("/") ? `/api${s.logo}` : s.logo} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : "🏪"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: "#0f172a", fontWeight: "600", margin: 0, fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</p>
                      <p style={{ color: "#94a3b8", fontSize: "12px", margin: "2px 0 0" }}>📍{s.city || "—"} • 📦{s.product_count}</p>
                    </div>
                    <span style={{ padding: "3px 9px", borderRadius: "99px", fontSize: "11px", fontWeight: "600", background: s.is_active ? "#f0fdf4" : "#fef2f2", color: s.is_active ? "#22c55e" : "#ef4444", flexShrink: 0 }}>
                      {s.is_active ? t("نشط", "Active") : t("معلق", "Off")}
                    </span>
                  </div>
                  <p style={{ color: "#cbd5e1", fontSize: "11px", margin: "0 0 12px" }}>📧 {s.email}</p>
                  <button onClick={() => toggleStore(s.id, !s.is_active)} style={{ width: "100%", padding: "7px", background: s.is_active ? "#fef2f2" : "#f0fdf4", color: s.is_active ? "#ef4444" : "#22c55e", border: `1px solid ${s.is_active ? "#fecaca" : "#bbf7d0"}`, borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontFamily: "Tajawal, sans-serif", fontWeight: "500" }}>
                    {s.is_active ? t("⏸ تعليق المتجر", "⏸ Suspend") : t("▶ تفعيل المتجر", "▶ Activate")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
              <h1 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: 0 }}>👥 {t("المستخدمون", "Users")} <span style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "400" }}>({usersTotal})</span></h1>
              <div style={{ display: "flex", gap: "8px" }}>
                <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); setTimeout(() => load(), 0); }} style={{ ...inp }}>
                  <option value="">{t("كل الصلاحيات", "All Roles")}</option>
                  <option value="user">user</option>
                  <option value="moderator">moderator</option>
                  <option value="admin">admin</option>
                </select>
                <input placeholder={t("ابحث...", "Search...")} value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && load()} style={{ ...inp, width: "160px" }} />
              </div>
            </div>
            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  {["#", t("المستخدم", "User"), "Email", t("الصلاحية", "Role"), t("الحالة", "Status"), ""].map((h, i) => (
                    <th key={i} style={{ padding: "11px 14px", textAlign: "right", color: "#94a3b8", fontSize: "11px", fontWeight: "600" }}>{h}</th>
                  ))}</tr></thead>
                <tbody>
                  {loading ? <tr><td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>جاري التحميل...</td></tr>
                    : users.map(u => (
                      <tr key={u.id} style={{ borderBottom: "1px solid #f8fafc" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                        onMouseLeave={e => e.currentTarget.style.background = "white"}>
                        <td style={{ padding: "12px 14px", color: "#cbd5e1", fontSize: "12px" }}>{u.id}</td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0 }}>👤</div>
                            <div>
                              <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "500", margin: 0 }}>{u.name}</p>
                              {u.is_banned && <span style={{ background: "#fef2f2", color: "#ef4444", fontSize: "10px", padding: "1px 5px", borderRadius: "4px" }}>محظور</span>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px", color: "#94a3b8", fontSize: "12px" }}>{u.email}</td>
                        <td style={{ padding: "12px 14px" }}>
                          {isAdmin ? (
                            <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}
                              style={{ ...inp, padding: "4px 8px", color: u.role === "admin" ? "#22c55e" : u.role === "moderator" ? "#f59e0b" : "#64748b", cursor: "pointer" }}>
                              <option value="user">user</option>
                              <option value="moderator">moderator</option>
                              <option value="admin">admin</option>
                            </select>
                          ) : (
                            <span style={{ color: "#64748b", fontSize: "12px" }}>{u.role}</span>
                          )}
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ padding: "3px 9px", borderRadius: "99px", fontSize: "11px", fontWeight: "600", background: u.is_banned ? "#fef2f2" : "#f0fdf4", color: u.is_banned ? "#ef4444" : "#22c55e" }}>
                            {u.is_banned ? t("محظور", "Banned") : t("نشط", "Active")}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          {u.is_banned
                            ? <button onClick={() => banUser(u.id, false, null)} style={{ padding: "4px 10px", background: "#f0fdf4", color: "#22c55e", border: "1px solid #bbf7d0", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>{t("رفع الحظر", "Unban")}</button>
                            : <button onClick={() => setBanModal(u)} style={{ padding: "4px 10px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>{t("حظر", "Ban")}</button>
                          }
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {usersTotal > 15 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", color: "#64748b", fontSize: "13px" }}>←</button>
                <span style={{ color: "#64748b", fontSize: "13px" }}>{page} / {totalPages(usersTotal)}</span>
                <button onClick={() => setPage(p => Math.min(totalPages(usersTotal), p + 1))} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", color: "#64748b", fontSize: "13px" }}>→</button>
              </div>
            )}
          </div>
        )}

        {/* MODERATORS */}
        {activeTab === "moderators" && (
          <div>
            <h1 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", marginBottom: "6px" }}>🛡️ {t("فريق الإدارة", "Admin Team")}</h1>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "20px" }}>
              {isAdmin ? t("لتعيين مشرف: اذهب لقسم المستخدمين وغيّر الصلاحية", "To assign: go to Users and change role") : t("عرض الفريق فقط", "View only")}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px" }}>
              {moderators.map(m => (
                <div key={m.id} style={{ background: "white", borderRadius: "12px", padding: "18px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: m.role === "admin" ? "#f0fdf4" : "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0, border: `2px solid ${m.role === "admin" ? "#bbf7d0" : "#fde68a"}` }}>👤</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: "#0f172a", fontWeight: "600", margin: "0 0 2px", fontSize: "14px" }}>{m.name}</p>
                      <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.email}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                    <span style={{ padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "700", background: m.role === "admin" ? "#f0fdf4" : "#fffbeb", color: m.role === "admin" ? "#22c55e" : "#d97706" }}>
                      {m.role === "admin" ? "🛡️ Super Admin" : "👮 Moderator"}
                    </span>
                    <span style={{ color: "#cbd5e1", fontSize: "11px" }}>{new Date(m.created_at).toLocaleDateString("ar-PS")}</span>
                  </div>
                </div>
              ))}
              {!moderators.length && <p style={{ color: "#94a3b8", fontSize: "14px" }}>{t("لا يوجد فريق بعد — عيّن من قسم المستخدمين", "No team yet")}</p>}
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h1 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", margin: 0 }}>🔔 {t("الإشعارات", "Notifications")}</h1>
              {unread > 0 && <button onClick={markAllRead} style={{ padding: "7px 14px", background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "Tajawal, sans-serif" }}>{t("قراءة الكل", "Mark all read")}</button>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {notifications.map(n => (
                <div key={n.id} style={{ background: "white", borderRadius: "10px", padding: "13px 16px", border: `1px solid ${n.is_read ? "#f1f5f9" : "#22c55e30"}`, display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: n.is_read ? "#e2e8f0" : "#22c55e", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ color: n.is_read ? "#94a3b8" : "#475569", fontSize: "13px", margin: 0, fontWeight: n.is_read ? "400" : "500" }}>{n.message}</p>
                    <p style={{ color: "#cbd5e1", fontSize: "11px", margin: "3px 0 0" }}>{n.type} • {new Date(n.created_at).toLocaleString("ar-PS")}</p>
                  </div>
                </div>
              ))}
              {!notifications.length && <div style={{ textAlign: "center", padding: "50px", color: "#94a3b8" }}><div style={{ fontSize: "36px", marginBottom: "10px" }}>🔔</div><p>{t("لا توجد إشعارات", "No notifications")}</p></div>}
            </div>
          </div>
        )}

      </main>

      {/* BAN MODAL */}
      {banModal && (
        <Modal title={`🚫 ${t("حظر", "Ban")}: ${banModal.name}`} confirmLabel={t("تأكيد الحظر", "Confirm Ban")} onConfirm={() => banUser(banModal.id, true, banReason)} onClose={() => { setBanModal(null); setBanReason(""); }}>
          <textarea placeholder={t("سبب الحظر (اختياري)", "Reason (optional)")} value={banReason} onChange={e => setBanReason(e.target.value)} rows={3} style={textarea} />
        </Modal>
      )}

      {/* REJECT MODAL */}
      {rejectModal && (
        <Modal title={`✕ ${t("رفض", "Reject")}: ${rejectModal.name}`} confirmLabel={t("تأكيد الرفض", "Confirm Reject")} onConfirm={() => rejectProduct(rejectModal.id, rejectReason)} onClose={() => { setRejectModal(null); setRejectReason(""); }}>
          <textarea placeholder={t("سبب الرفض (اختياري)", "Reason (optional)")} value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} style={textarea} />
        </Modal>
      )}

      {/* PRODUCT DETAIL MODAL */}
      {productDetail && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "16px", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ padding: "16px 22px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ color: "#0f172a", fontSize: "15px", fontWeight: "700", margin: 0 }}>📦 {t("تفاصيل المنتج", "Product Details")}</h3>
              <button onClick={() => setProductDetail(null)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#94a3b8" }}>✕</button>
            </div>
            <div style={{ padding: "20px 22px", overflowY: "auto", flex: 1 }}>
              <div style={{ display: "flex", gap: "16px", marginBottom: "18px" }}>
                <div style={{ width: "90px", height: "90px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                  <img src={productDetail.image} alt="" style={{ maxWidth: "80px", maxHeight: "80px", objectFit: "contain" }} onError={e => e.target.style.display = "none"} />
                </div>
                <div>
                  <h2 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "700", margin: "0 0 6px" }}>{productDetail.name}</h2>
                  {[productDetail.brand && `🏷️ ${productDetail.brand}`, productDetail.store_name && `🏪 ${productDetail.store_name}`, productDetail.category_name && `📂 ${productDetail.category_name}`].filter(Boolean).map((x, i) => (
                    <p key={i} style={{ color: "#64748b", fontSize: "13px", margin: "0 0 3px" }}>{x}</p>
                  ))}
                </div>
              </div>
              <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "12px 14px", marginBottom: "14px" }}>
                {[
                  { label: t("الحالة", "Status"), value: productDetail.status },
                  { label: t("المشاهدات", "Views"), value: productDetail.views || 0 },
                  { label: t("تاريخ الإضافة", "Added"), value: productDetail.created_at ? new Date(productDetail.created_at).toLocaleDateString("ar-PS") : "—" },
                ].map((row, i, arr) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < arr.length - 1 ? "1px solid #e2e8f0" : "none" }}>
                    <span style={{ color: "#94a3b8", fontSize: "13px" }}>{row.label}</span>
                    <span style={{ color: "#0f172a", fontSize: "13px", fontWeight: "500" }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <a href={`http://localhost:5173/product/${productDetail.id}`} target="_blank" rel="noreferrer"
                style={{ display: "block", textAlign: "center", padding: "8px", background: "#f1f5f9", borderRadius: "8px", textDecoration: "none", color: "#475569", fontSize: "13px" }}>
                🔗 {t("عرض صفحة المنتج", "View Product Page")}
              </a>
            </div>
            <div style={{ padding: "14px 22px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "10px" }}>
              <button onClick={() => { approveProduct(productDetail.id); setProductDetail(null); }}
                style={{ flex: 1, padding: "11px", background: "#22c55e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "Tajawal, sans-serif" }}>
                ✓ {t("موافقة على النشر", "Approve")}
              </button>
              <button onClick={() => { setRejectModal(productDetail); setProductDetail(null); }}
                style={{ flex: 1, padding: "11px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontFamily: "Tajawal, sans-serif" }}>
                ✕ {t("رفض", "Reject")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}