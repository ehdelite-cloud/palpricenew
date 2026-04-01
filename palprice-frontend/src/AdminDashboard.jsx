import { useEffect, useState, useCallback } from "react";
import NotificationBell from "./components/NotificationBell";
import { SBadge, Modal } from "./admin/AdminShared";
import AdminOverview    from "./admin/AdminOverview";
import AdminAI          from "./admin/AdminAI";
import AdminPending     from "./admin/AdminPending";
import AdminTickets     from "./admin/AdminTickets";
import AdminProducts    from "./admin/AdminProducts";
import AdminStores      from "./admin/AdminStores";
import AdminUsers       from "./admin/AdminUsers";
import AdminModerators  from "./admin/AdminModerators";

const API         = "/api/admin";
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
  const [statusFilter,   setStatusFilter]   = useState("");
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
        const d = await fetch(`${API}/products?status=${statusFilter}&search=${search}&page=${page}`, { headers: heads }).then(r => r.json());
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

  const isAdmin = adminUser?.role === "admin";
  const inp     = { padding: "9px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", outline: "none", background: "white", color: "#0f172a" };

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

  /* ── اللوحة الرئيسية ── */
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f6fa", fontFamily: "Tajawal, sans-serif", direction: "rtl" }}>

      {/* ══ السايدبار ══ */}
      <aside style={{ width: collapsed ? "60px" : "230px", background: "#0f172a", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0, transition: "width 0.2s", overflow: "hidden", zIndex: 50 }}>

        {/* شعار + زر طي */}
        <div style={{ padding: "18px 14px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {!collapsed && <p style={{ color: "#22c55e", fontSize: "18px", fontWeight: "900", margin: 0, fontFamily: "Cairo, sans-serif" }}>PalPrice</p>}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {!collapsed && <NotificationBell mode="admin" token={token} dropdownSide="right" notifications={notifications} setNotifications={setNotifications} />}
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
                <p style={{ color: "white", fontSize: "13px", fontWeight: "600", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{adminUser?.name || "Admin"}</p>
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

        {activeTab === "overview" && (
          <AdminOverview
            analytics={analytics} notifications={notifications} unread={unread}
            loading={loading} setActiveTab={setActiveTab} markAllRead={markAllRead}
            openTickets={openTickets}
          />
        )}

        {activeTab === "ai" && (
          <AdminAI
            analytics={analytics} aiReport={aiReport} aiLoading={aiLoading}
            aiChat={aiChat} aiInput={aiInput} aiChatLoading={aiChatLoading}
            reportType={reportType} generateReport={generateReport}
            sendAiMessage={sendAiMessage} setAiChat={setAiChat} setAiInput={setAiInput}
          />
        )}

        {activeTab === "pending" && (
          <AdminPending
            products={products} loading={loading}
            approveProduct={approveProduct} setRejectModal={setRejectModal} setProductDetail={setProductDetail}
          />
        )}

        {activeTab === "tickets" && (
          <AdminTickets
            tickets={tickets} loading={loading}
            activeTicket={activeTicket} ticketMessages={ticketMessages}
            ticketReply={ticketReply} sendingReply={sendingReply}
            setTickets={setTickets} setActiveTicket={setActiveTicket}
            setTicketMessages={setTicketMessages} setTicketReply={setTicketReply}
            handleTicketReply={handleTicketReply} load={load} h={h}
          />
        )}

        {activeTab === "products" && (
          <AdminProducts
            products={products} productsTotal={productsTotal} loading={loading}
            search={search} setSearch={setSearch}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            page={page} setPage={setPage} load={load}
            approveProduct={approveProduct} deleteProduct={deleteProduct} setRejectModal={setRejectModal}
          />
        )}

        {activeTab === "stores" && (
          <AdminStores
            stores={stores} loading={loading}
            search={search} setSearch={setSearch}
            load={load} toggleStore={toggleStore}
          />
        )}

        {activeTab === "users" && (
          <AdminUsers
            users={users} usersTotal={usersTotal} loading={loading}
            roleFilter={roleFilter} setRoleFilter={setRoleFilter}
            search={search} setSearch={setSearch}
            page={page} setPage={setPage} load={load}
            banUser={banUser} changeRole={changeRole} setBanModal={setBanModal}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === "moderators" && (
          <AdminModerators moderators={moderators} loading={loading} />
        )}

      </main>

      {/* ══ النوافذ المنبثقة ══ */}
      {banModal && (
        <Modal title={`🚫 حظر: ${banModal.name}`} confirmLabel="تأكيد الحظر"
          onConfirm={() => banUser(banModal.id, true, banReason)}
          onClose={() => { setBanModal(null); setBanReason(""); }}>
          <textarea placeholder="سبب الحظر (اختياري)" value={banReason} onChange={e => setBanReason(e.target.value)} rows={3}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", resize: "none", outline: "none", boxSizing: "border-box" }} />
        </Modal>
      )}
      {rejectModal && (
        <Modal title={`✕ رفض: ${rejectModal.name}`} confirmLabel="تأكيد الرفض"
          onConfirm={() => rejectProduct(rejectModal.id, rejectReason)}
          onClose={() => { setRejectModal(null); setRejectReason(""); }}>
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
              <a href={`/product/${productDetail.id}`} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", padding: "9px", background: "#f1f5f9", borderRadius: "10px", textDecoration: "none", color: "#475569", fontSize: "13px", fontWeight: "600" }}>
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
