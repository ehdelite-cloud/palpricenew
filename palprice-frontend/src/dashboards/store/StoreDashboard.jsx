import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../../components/DashboardSidebar";

/* ── Circular Progress SVG ── */
function CircularProgress({ pct = 0, size = 110, stroke = 9, color = "#6366f1", bg = "#e8e8f0", children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s ease" }} />
      <foreignObject x={stroke} y={stroke} width={size - stroke * 2} height={size - stroke * 2}>
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(90deg)" }}>
          {children}
        </div>
      </foreignObject>
    </svg>
  );
}

/* ── Horizontal Progress Bar ── */
function HBar({ pct = 0, color = "#6366f1", height = 8, bg = "#f1f5f9", animated = true }) {
  return (
    <div style={{ height, borderRadius: 99, background: bg, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 99, transition: animated ? "width 1s ease" : "none" }} />
    </div>
  );
}

/* ── Segmented Progress (like AnalyzeForce Style 2) ── */
function SegmentedBar({ value = 0, target = 10, color = "#22c55e" }) {
  const segments = target;
  const filled = Math.min(value, segments);
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {Array.from({ length: segments }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: "6px", borderRadius: "99px", background: i < filled ? color : "#e2e8f0", transition: "background 0.5s ease" }} />
      ))}
    </div>
  );
}

/* ── Gauge Card (Style 1 - Horizontal Gauge) ── */
function GaugeCard({ icon, iconBg, label, value, sub, target, targetLabel, current, remaining, remainingLabel, color = "#f97316" }) {
  const pct = target ? Math.round((current / target) * 100) : 0;
  return (
    <div style={{ background: "white", borderRadius: "16px", padding: "22px 24px", border: "1px solid #e8eaf0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
      {/* Icon top right */}
      <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "72px", height: "72px", borderRadius: "50%", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", opacity: 0.85 }}>{icon}</div>
      <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.7px" }}>{label}</p>
      <p style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a", margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{value}</p>
      <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 16px" }}>{sub}</p>
      {target !== undefined && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "500" }}>Progress: {pct}%</span>
            <span style={{ fontSize: "11px", color: "#64748b" }}>Target: {targetLabel}</span>
          </div>
          <HBar pct={pct} color={color} height={10} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>{remainingLabel}</span>
            <span style={{ fontSize: "12px", fontWeight: "700", color }}>
              {remaining}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Summary Card (Style 5 - Circular, Purple gradient) ── */
function SummaryCard({ totalProducts, productsWithPrice, avgPrice, topViews, totalViews }) {
  const pricePct = totalProducts > 0 ? Math.round((productsWithPrice / totalProducts) * 100) : 0;
  return (
    <div style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)", borderRadius: "20px", padding: "24px", color: "white", boxShadow: "0 8px 32px rgba(99,102,241,0.35)", position: "relative", overflow: "hidden" }}>
      {/* BG decoration */}
      <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "140px", height: "140px", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
      <div style={{ position: "absolute", bottom: "-20px", left: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
      <div style={{ position: "absolute", top: "14px", right: "14px", width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🎯</div>

      <p style={{ fontSize: "11px", fontWeight: "700", margin: "0 0 16px", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.8px" }}>Summary</p>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Circular */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <CircularProgress pct={pricePct} size={110} stroke={10} color="white" bg="rgba(255,255,255,0.2)">
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "22px", fontWeight: "900", margin: 0, fontFamily: "Cairo, sans-serif", color: "white" }}>{pricePct}%</p>
              <p style={{ fontSize: "9px", margin: 0, opacity: 0.8, lineHeight: 1.2 }}>منتجات<br />بسعر</p>
            </div>
          </CircularProgress>
        </div>

        {/* Stats */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { label: "إجمالي المنتجات", value: totalProducts },
            { label: "لديها سعر", value: `${productsWithPrice} / ${totalProducts}` },
            { label: "متوسط السعر", value: avgPrice ? `${avgPrice} ₪` : "—" },
            { label: "إجمالي المشاهدات", value: totalViews },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", opacity: 0.75 }}>{item.label}</span>
              <span style={{ fontSize: "13px", fontWeight: "700" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function StoreDashboard({ lang = "ar" }) {
  const storeId = localStorage.getItem("storeId");
  const storeName = localStorage.getItem("storeName") || "";
  const [products, setProducts] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) { setLoading(false); return; }
    Promise.all([
      fetch(`/api/stores/${storeId}/products`).then(r => r.json()),
      fetch(`/api/stores/${storeId}/weekly-stats`).then(r => r.json()).catch(() => null),
    ]).then(([prods, weekly]) => {
      if (Array.isArray(prods)) setProducts(prods);
      if (weekly && !weekly.error) setWeeklyStats(weekly);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [storeId]);

  const totalProducts     = products.length;
  const productsWithPrice = products.filter(p => p.best_price).length;
  const productsNoPrice   = totalProducts - productsWithPrice;
  const totalViews        = products.reduce((s, p) => s + Number(p.views || 0), 0);
  const avgPrice          = productsWithPrice > 0
    ? Math.round(products.filter(p => p.best_price).reduce((s, p) => s + Number(p.best_price), 0) / productsWithPrice)
    : 0;
  const mostViewed = [...products].sort((a, b) => Number(b.views || 0) - Number(a.views || 0)).slice(0, 5);
  const maxViews   = mostViewed[0] ? Number(mostViewed[0].views || 1) : 1;
  const pricePct   = totalProducts > 0 ? Math.round((productsWithPrice / totalProducts) * 100) : 0;

  const today = new Date().toLocaleDateString("ar-PS", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  if (loading) return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <DashboardSidebar lang={lang} />
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#94a3b8" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid #e2e8f0", borderTop: "3px solid #6366f1", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
          <p>جاري التحميل...</p>
        </div>
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f6fa", fontFamily: "Tajawal, sans-serif", direction: "rtl" }}>
      <DashboardSidebar lang={lang} />
      <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              مرحباً، {storeName || "متجرك"} 👋
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "12px", margin: "4px 0 0" }}>{today}</p>
          </div>
          {productsNoPrice > 0 && (
            <Link to="/store/dashboard/products" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", padding: "9px 16px", background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: "10px", color: "#b45309", fontSize: "12px", fontWeight: "700" }}>
              ⚠️ {productsNoPrice} منتج بدون سعر — أضف الآن
            </Link>
          )}
        </div>

        {/* ── Row 1: 3 Gauge Cards + Summary ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", marginBottom: "20px" }}>

          {/* Style 1 - Gauge */}
          <GaugeCard
            icon="📦" iconBg="#fff7ed"
            label="Style 1 - منتجاتي"
            value={totalProducts}
            sub="إجمالي المنتجات"
            current={productsWithPrice} target={totalProducts}
            targetLabel={`${totalProducts} منتج`}
            remaining={`${productsNoPrice} بدون سعر`}
            remainingLabel="المتبقي:"
            color="#f97316"
          />

          {/* Style 2 - Segmented */}
          <div style={{ background: "white", borderRadius: "16px", padding: "22px 24px", border: "1px solid #e8eaf0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "72px", height: "72px", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", opacity: 0.9 }}>🔥</div>
            <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.7px" }}>Style 2 - أكثر مشاهدة</p>
            <p style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mostViewed[0]?.name || "—"}</p>
            <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 16px" }}>{mostViewed[0]?.views || 0} مشاهدة</p>
            <p style={{ fontSize: "11px", color: "#64748b", fontWeight: "500", margin: "0 0 8px" }}>
              {weeklyStats?.new_products_this_week ?? 0} منتج جديد هذا الأسبوع
            </p>
            <SegmentedBar
              value={weeklyStats?.new_products_this_week ?? 0}
              target={10}
              color="#22c55e"
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <span style={{ fontSize: "11px", background: "#f0fdf4", color: "#15803d", padding: "2px 8px", borderRadius: "99px", fontWeight: "700" }}>
                ✓ {weeklyStats?.new_products_this_week ?? 0} هذا الأسبوع
              </span>
            </div>
          </div>

          {/* Style 3 - Classic */}
          <div style={{ background: "white", borderRadius: "16px", padding: "22px 24px", border: "1px solid #e8eaf0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "72px", height: "72px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", opacity: 0.9 }}>💰</div>
            <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.7px" }}>Style 3 - المشاهدات</p>
            <p style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a", margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{totalViews}</p>
            <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 16px" }}>إجمالي مشاهدة المنتجات</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", color: "#64748b" }}>{pricePct}% لديها سعر</span>
              <span style={{ fontSize: "11px", color: "#64748b" }}>Target: {totalProducts} منتج</span>
            </div>
            <HBar pct={pricePct} color="#3b82f6" height={10} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>المتبقي:</span>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#ef4444" }}>{productsNoPrice} منتج</span>
            </div>
          </div>

          {/* Style 5 - Summary (Purple Gradient) */}
          <SummaryCard
            totalProducts={totalProducts}
            productsWithPrice={productsWithPrice}
            avgPrice={avgPrice}
            topViews={mostViewed[0]?.views || 0}
            totalViews={totalViews}
          />
        </div>

        {/* ── Row 2: Style 4 Table + Quick Actions ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "16px", marginBottom: "20px" }}>

          {/* Style 4 - Table with Progress */}
          <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e8eaf0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.7px" }}>Style 4 - Category Progress</p>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>الأكثر مشاهدة في متجرك</h3>
              </div>
              <Link to="/store/dashboard/products" style={{ textDecoration: "none", padding: "6px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                عرض الكل →
              </Link>
            </div>
            <div style={{ padding: "0 22px" }}>
              {/* Table Header */}
              <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 80px 80px 80px 100px", gap: "8px", padding: "12px 0 8px", borderBottom: "1px solid #f1f5f9" }}>
                {["", "المنتج", "الحالة", "السعر", "مشاهدة", "التقدم"].map((h, i) => (
                  <span key={i} style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
                ))}
              </div>
              {/* Rows */}
              {mostViewed.length === 0 ? (
                <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>لا توجد منتجات بعد</div>
              ) : mostViewed.map((p, i) => {
                const viewPct = maxViews > 0 ? Math.round((Number(p.views || 0) / maxViews) * 100) : 0;
                const medals = ["🥇", "🥈", "🥉", "4", "5"];
                const statusColors = p.best_price
                  ? { color: "#15803d", bg: "#f0fdf4", label: "✓ بسعر" }
                  : { color: "#dc2626", bg: "#fef2f2", label: "⚠ بدون" };
                return (
                  <div key={p.id} style={{ display: "grid", gridTemplateColumns: "40px 1fr 80px 80px 80px 100px", gap: "8px", padding: "12px 0", borderBottom: i < mostViewed.length - 1 ? "1px solid #f8fafc" : "none", alignItems: "center" }}>
                    {/* Avatar/Medal */}
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f8fafc", border: "1px solid #e2e8f0", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>
                      <img src={p.image} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; e.target.parentNode.textContent = medals[i] || "📦"; }} />
                    </div>
                    {/* Name */}
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                      {p.brand && <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>{p.brand}</p>}
                    </div>
                    {/* Status */}
                    <span style={{ fontSize: "10px", fontWeight: "700", color: statusColors.color, background: statusColors.bg, padding: "3px 8px", borderRadius: "99px", textAlign: "center", whiteSpace: "nowrap" }}>{statusColors.label}</span>
                    {/* Price */}
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>{p.best_price ? `${p.best_price}₪` : "—"}</span>
                    {/* Views */}
                    <span style={{ fontSize: "12px", color: "#64748b" }}>👁 {p.views || 0}</span>
                    {/* Progress */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                      <HBar pct={viewPct} color={i === 0 ? "#6366f1" : i === 1 ? "#3b82f6" : "#94a3b8"} height={6} />
                      <span style={{ fontSize: "10px", color: "#94a3b8" }}>{viewPct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e8eaf0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid #f1f5f9" }}>
              <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.7px" }}>Quick Actions</p>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>إجراءات سريعة</h3>
            </div>
            <div style={{ padding: "14px" }}>
              {[
                { to: "/store/dashboard/add-product", icon: "➕", label: "إضافة منتج", desc: "أضف منتجاً أو سعراً جديداً", color: "#22c55e" },
                { to: "/store/dashboard/products",    icon: "📦", label: "إدارة المنتجات", desc: "تعديل وحذف منتجاتك",      color: "#3b82f6" },
                { to: "/store/dashboard/competition", icon: "⚡", label: "مراقبة المنافسة", desc: "قارن أسعارك مع المنافسين", color: "#f59e0b" },
                { to: "/store/dashboard/analytics",   icon: "📊", label: "الإحصائيات",    desc: "تقارير وتحليلات متجرك",    color: "#8b5cf6" },
                { to: "/store/dashboard/profile",     icon: "⚙️", label: "إعدادات المتجر", desc: "معلومات وشعار متجرك",    color: "#64748b" },
              ].map((s, i) => (
                <Link key={i} to={s.to} style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 12px", borderRadius: "10px", marginBottom: "6px", transition: "all 0.15s", cursor: "pointer" }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${s.color}08`; e.currentTarget.style.transform = "translateX(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateX(0)"; }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{s.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{s.label}</p>
                      <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>{s.desc}</p>
                    </div>
                    <span style={{ color: "#cbd5e1", fontSize: "14px" }}>←</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Weekly Comparison */}
            {weeklyStats && (
              <div style={{ margin: "0 14px 14px", padding: "14px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>مقارنة أسبوعية</p>
                {[
                  { label: "منتجات جديدة", thisWeek: weeklyStats.new_products_this_week, lastWeek: weeklyStats.new_products_last_week, color: "#6366f1" },
                  { label: "مشاهدات", thisWeek: weeklyStats.views_this_week, lastWeek: weeklyStats.views_last_week, color: "#22c55e" },
                ].map((w, i) => {
                  const diff = (w.thisWeek || 0) - (w.lastWeek || 0);
                  return (
                    <div key={i} style={{ marginBottom: i === 0 ? "10px" : 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                        <span style={{ fontSize: "11px", color: "#64748b" }}>{w.label}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>{w.thisWeek || 0}</span>
                          {diff !== 0 && <span style={{ fontSize: "10px", color: diff > 0 ? "#15803d" : "#dc2626", fontWeight: "700" }}>{diff > 0 ? `↑${diff}` : `↓${Math.abs(diff)}`}</span>}
                        </div>
                      </div>
                      <HBar pct={w.lastWeek ? Math.round(((w.thisWeek || 0) / Math.max(w.lastWeek, w.thisWeek, 1)) * 100) : 100} color={w.color} height={5} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          * { box-sizing: border-box; }
        `}</style>
      </main>
    </div>
  );
}