import { CircularProgress, HBar, SegBar } from "./AdminShared";

export default function AdminOverview({ analytics, notifications, unread, loading, setActiveTab, markAllRead, openTickets }) {
  const A         = analytics || {};
  const products_ = Number(A.products    || 0);
  const stores_   = Number(A.stores      || 0);
  const prices_   = Number(A.prices      || 0);
  const users_    = Number(A.users       || 0);
  const pending_  = Number(A.pending     || 0);
  const banned_   = Number(A.banned      || 0);
  const newWeek_  = Number(A.newThisWeek || 0);
  const pricePct  = products_ > 0 ? Math.round((prices_  / products_) * 100) : 0;
  const pendPct   = products_ > 0 ? Math.round((pending_ / products_) * 100) : 0;
  const bannPct   = users_    > 0 ? Math.round((banned_  / users_)    * 100) : 0;

  const tableRows = [
    { label: "إجمالي المنتجات",  value: products_, pct: Math.min(products_ / 5, 100), color: "#3b82f6", status: "normal",   statusLabel: "نشط" },
    { label: "المتاجر الشريكة",  value: stores_,   pct: Math.min(stores_ * 10, 100),  color: "#22c55e", status: "achieved", statusLabel: "✓ نشط" },
    { label: "الأسعار المسجلة",  value: prices_,   pct: Math.min(pricePct, 100),       color: "#f59e0b", status: "normal",   statusLabel: "نشط" },
    { label: "المستخدمون",       value: users_,    pct: Math.min(users_ * 5, 100),     color: "#8b5cf6", status: "normal",   statusLabel: "نشط" },
    { label: "بانتظار الموافقة", value: pending_,  pct: pendPct,                        color: "#f97316", status: pending_ > 0 ? "risk" : "achieved", statusLabel: pending_ > 0 ? "⚠ معلق" : "✓ نظيف" },
    { label: "محظورون",          value: banned_,   pct: bannPct,                        color: "#ef4444", status: banned_  > 0 ? "risk" : "achieved", statusLabel: banned_  > 0 ? "⚠ خطر"  : "✓ نظيف" },
    { label: "جديد هذا الأسبوع", value: newWeek_,  pct: Math.min(newWeek_ * 10, 100),  color: "#06b6d4", status: "normal",   statusLabel: "هذا الأسبوع" },
  ];
  const statusCfg = { risk: { color: "#dc2626", bg: "#fef2f2" }, achieved: { color: "#15803d", bg: "#f0fdf4" }, normal: { color: "#64748b", bg: "#f8fafc" } };

  if (loading && !analytics) return <p style={{ color: "#94a3b8" }}>جاري التحميل...</p>;

  return (
    <div>
      {/* عنوان */}
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

      {/* الصف الأول: 4 كاردات */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>

        {/* كارد المنتجات */}
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

        {/* كارد المتاجر */}
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

        {/* كارد المستخدمين */}
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

        {/* كارد ملخص عام */}
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

      {/* الصف الثاني: جدول الإحصائيات + إجراءات وإشعارات */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "16px" }}>

        {/* جدول الإحصائيات */}
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e8eaf0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.7px" }}>تقدم المؤشرات</p>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>إحصائيات الموقع التفصيلية</h3>
          </div>
          <div style={{ padding: "0 22px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 130px", gap: "8px", padding: "11px 0 8px", borderBottom: "1px solid #f1f5f9" }}>
              {["المقياس", "القيمة", "الحالة", "شريط التقدم"].map((col, i) => (
                <span key={i} style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{col}</span>
              ))}
            </div>
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
                { to: "pending",  icon: "⏳", label: "المعلقة",    color: "#f97316", n: pending_   },
                { to: "products", icon: "📦", label: "المنتجات",   color: "#3b82f6", n: products_  },
                { to: "stores",   icon: "🏪", label: "المتاجر",    color: "#22c55e", n: stores_    },
                { to: "users",    icon: "👥", label: "المستخدمون", color: "#8b5cf6", n: users_     },
                { to: "tickets",  icon: "🎫", label: "الدعم",      color: "#06b6d4", n: openTickets },
                { to: "ai",       icon: "🤖", label: "تحليل AI",   color: "#f43f5e", n: null       },
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
  );
}
