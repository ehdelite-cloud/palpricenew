import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function fixImg(url) {
  if (!url) return "";
  return url.startsWith("/") ? `/api${url}` : url;
}

function timeLeft(endsAt, lang = "ar") {
  const diff = new Date(endsAt) - new Date();
  if (diff <= 0) return null;
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return lang === "ar" ? `${days} يوم${hours > 0 ? ` و${hours} ساعة` : ""}` : `${days}d ${hours}h`;
  if (hours > 0) return lang === "ar" ? `${hours} ساعة و${mins} دقيقة` : `${hours}h ${mins}m`;
  return lang === "ar" ? `${mins} دقيقة` : `${mins}m`;
}

export default function CampaignsPage({ lang = "ar" }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [copied, setCopied]       = useState(null);
  const [filter, setFilter] = useState("active"); // "active" | "all"

  useEffect(() => {
    fetch("/api/campaigns/active")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCampaigns(data); setLoading(false); })
      .catch(() => setLoading(false));
    
  }, []);
  

  function copyCoupon(code, id) {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
    // سجّل مشاهدة
    fetch(`/api/campaigns/${id}/view`, { method: "POST" }).catch(() => {});
  }

  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #1a0533 100%)", padding: "56px 24px 44px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(139,92,246,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1240px", margin: "auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#c4b5fd", padding: "6px 16px", borderRadius: "99px", fontSize: "12px", fontWeight: "600", marginBottom: "16px" }}>
            🔥 {lang === "ar" ? "عروض حصرية من متاجر PalPrice" : "Exclusive Deals from PalPrice Stores"}
          </div>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: "900", color: "white", margin: "0 0 10px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
            {lang === "ar" ? "الحملات والعروض 🎉" : "Campaigns & Deals 🎉"}
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "15px", margin: 0 }}>
            {lang === "ar"
              ? `${campaigns.length} حملة نشطة الآن — الكوبونات محدودة الوقت!`
              : `${campaigns.length} active campaigns — limited time coupons!`}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", padding: "20px 24px 0" }}>
  {["active","all"].map(f => (
    <button key={f} onClick={() => setFilter(f)}
      style={{ padding: "8px 20px", borderRadius: "99px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "700", fontFamily: "Tajawal, sans-serif", background: filter === f ? "#8b5cf6" : "#f1f5f9", color: filter === f ? "white" : "#475569" }}>
      {f === "active" ? (lang === "ar" ? "🔥 النشطة" : "🔥 Active") : (lang === "ar" ? "📋 الكل" : "📋 All")}
    </button>
  ))}
</div>

      {/* Content */}
      <div style={{ maxWidth: "1000px", margin: "auto", padding: "36px 24px 60px" }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: "140px", borderRadius: "16px", background: "linear-gradient(90deg, #f1f5f9 25%, #e8edf2 50%, #f1f5f9 75%)", backgroundSize: "400% 100%", animation: "skeleton-loading 1.5s ease infinite" }} />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>📢</div>
            <h3 style={{ color: "#64748b", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
              {lang === "ar" ? "لا توجد حملات نشطة الآن" : "No active campaigns right now"}
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px" }}>
              {lang === "ar" ? "تحقق لاحقاً للحصول على أفضل العروض" : "Check back later for the best deals"}
            </p>
            <Link to="/" style={{ padding: "10px 24px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", borderRadius: "12px", textDecoration: "none", fontSize: "14px", fontWeight: "700" }}>
              {lang === "ar" ? "تصفح المنتجات" : "Browse Products"}
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {campaigns.map(c => {
              const remaining = timeLeft(c.ends_at, lang);
              const urgency = remaining && remaining.includes("دقيقة") || remaining?.includes("ساعة") && !remaining?.includes("يوم");
              return (
                <div key={c.id} style={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", transition: "transform 0.2s", border: "1.5px solid rgba(0,0,0,0.06)" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "none"}>

                  {/* البانر الملوّن */}
                  <div style={{ background: c.banner_color, padding: "22px 24px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>

                    {/* لوجو المتجر */}
                    <div style={{ width: "54px", height: "54px", borderRadius: "14px", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                      {c.store_logo
                        ? <img src={fixImg(c.store_logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
                        : <span style={{ fontSize: "24px" }}>🏪</span>}
                    </div>

                    {/* النص */}
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px", margin: "0 0 3px", fontWeight: "600" }}>
                        {c.store_name}
                      </p>
                      <p style={{ color: "white", fontWeight: "900", fontSize: "clamp(16px, 2vw, 20px)", margin: "0 0 3px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
                        {c.title}
                      </p>
                      {c.discount_text && (
                        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px", margin: 0, fontWeight: "600" }}>
                          🔥 {c.discount_text}
                        </p>
                      )}
                    </div>

                    {/* الكوبون */}
                    {c.coupon_code && (
                      <div style={{ flexShrink: 0 }}>
                        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "10px", margin: "0 0 4px", textAlign: "center", fontWeight: "600", textTransform: "uppercase" }}>
                          {lang === "ar" ? "كود الخصم" : "Coupon Code"}
                        </p>
                        <button
                          onClick={() => copyCoupon(c.coupon_code, c.id)}
                          style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.15)", border: "2px dashed rgba(255,255,255,0.5)", borderRadius: "10px", padding: "8px 16px", cursor: "pointer", transition: "all 0.2s", fontFamily: "monospace" }}>
                          <span style={{ fontSize: "18px", fontWeight: "900", color: "white", letterSpacing: "2px" }}>
                            {c.coupon_code}
                          </span>
                          <span style={{ fontSize: "16px" }}>{copied === c.id ? "✅" : "📋"}</span>
                        </button>
                        {copied === c.id && (
                          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "11px", textAlign: "center", margin: "4px 0 0", fontWeight: "600" }}>
                            ✓ {lang === "ar" ? "تم النسخ!" : "Copied!"}
                          </p>
                        )}
                        {c.discount_value && (
                          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", textAlign: "center", margin: "4px 0 0" }}>
                            {c.discount_type === "percent" ? `${c.discount_value}%` : `${c.discount_value} ₪`} {lang === "ar" ? "خصم" : "off"}
                          </p>
                        )}
                      </div>
                    )}

                    {/* الوقت المتبقي */}
                    {remaining && (
                      <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: "10px", padding: "8px 14px", textAlign: "center", flexShrink: 0 }}>
                        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "9px", margin: "0 0 2px", fontWeight: "600", textTransform: "uppercase" }}>
                          {lang === "ar" ? "ينتهي خلال" : "Ends in"}
                        </p>
                        <p style={{ color: urgency ? "#fde68a" : "white", fontSize: "14px", fontWeight: "800", margin: 0 }}>
                          {remaining}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* الجزء الأبيض السفلي */}
                  <div style={{ background: "white", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                        👁 {c.views_count || 0} {lang === "ar" ? "مشاهدة" : "views"}
                      </span>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                        📅 {lang === "ar" ? "حتى" : "Until"} {new Date(c.ends_at).toLocaleDateString("ar-PS")}
                      </span>
                    </div>
                    <Link to={`/store/${c.store_id}`}
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 18px", background: c.banner_color + "15", color: c.banner_color, border: `1.5px solid ${c.banner_color}40`, borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "700", transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = c.banner_color; e.currentTarget.style.color = "white"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = c.banner_color + "15"; e.currentTarget.style.color = c.banner_color; }}>
                      🏪 {lang === "ar" ? "زيارة المتجر" : "Visit Store"} ←
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}