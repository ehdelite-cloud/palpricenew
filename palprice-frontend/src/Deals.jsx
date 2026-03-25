import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function fixImg(url) {
  if (!url) return "";
  return url.startsWith("/") ? `/api${url}` : url;
}

function Deals({ lang = "ar" }) {
  const [deals, setDeals]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort]     = useState("discount");

  useEffect(() => {
    fetch("/api/prices/deals")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setDeals(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  let sorted = [...deals];
  if (sort === "discount")   sorted.sort((a, b) => Number(b.discount) - Number(a.discount));
  if (sort === "price_low")  sorted.sort((a, b) => Number(a.lowest_price) - Number(b.lowest_price));
  if (sort === "price_high") sorted.sort((a, b) => Number(b.lowest_price) - Number(a.lowest_price));
  if (sort === "percent")    sorted.sort((a, b) => {
    const pa = a.highest_price > 0 ? ((a.highest_price - a.lowest_price) / a.highest_price) : 0;
    const pb = b.highest_price > 0 ? ((b.highest_price - b.lowest_price) / b.highest_price) : 0;
    return pb - pa;
  });

  return (
    <div>

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #2d1a1a 100%)", padding: "52px 24px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 70% at 80% 50%, rgba(239,68,68,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(255,255,255,0.01) 30px, rgba(255,255,255,0.01) 31px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1240px", margin: "auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", padding: "5px 14px", borderRadius: "99px", fontSize: "12px", fontWeight: "600", marginBottom: "14px" }}>
                🔥 {lang === "ar" ? "عروض حصرية" : "Exclusive Deals"}
              </div>
              <h1 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: "900", color: "white", margin: "0 0 8px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
                {lang === "ar" ? "أفضل العروض اليوم" : "Today's Best Deals"}
              </h1>
              <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
                {lang === "ar"
                  ? `${deals.length} منتج بأفضل الأسعار في فلسطين`
                  : `${deals.length} products at the best prices in Palestine`}
              </p>
            </div>

            {/* ترتيب */}
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.08)", color: "white", fontSize: "13px", fontFamily: "Tajawal, sans-serif", cursor: "pointer", outline: "none" }}>
              <option value="discount" style={{ background: "#0f172a" }}>{lang === "ar" ? "أكبر توفير" : "Biggest Saving"}</option>
              <option value="percent"  style={{ background: "#0f172a" }}>{lang === "ar" ? "أعلى نسبة خصم" : "Highest Discount %"}</option>
              <option value="price_low" style={{ background: "#0f172a" }}>{lang === "ar" ? "السعر: من الأقل" : "Price: Low to High"}</option>
              <option value="price_high" style={{ background: "#0f172a" }}>{lang === "ar" ? "السعر: من الأعلى" : "Price: High to Low"}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="page-container" style={{ maxWidth: "1240px", margin: "auto", padding: "28px 24px 60px" }}>

        {loading ? (
          <div className="products-grid">
            {Array(8).fill().map((_, i) => (
              <div key={i} style={{ borderRadius: "16px", overflow: "hidden", border: "1.5px solid #e2e8f0", background: "white" }}>
                <div style={{ height: "180px", background: "linear-gradient(90deg, #f1f5f9 25%, #e8edf2 50%, #f1f5f9 75%)", backgroundSize: "400% 100%", animation: "skeleton-loading 1.5s ease infinite" }} />
                <div style={{ padding: "16px" }}>
                  <div style={{ height: "12px", borderRadius: "6px", background: "#f1f5f9", marginBottom: "8px", width: "70%" }} />
                  <div style={{ height: "20px", borderRadius: "6px", background: "#f1f5f9", width: "40%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : deals.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#94a3b8" }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>🏷️</div>
            <h3 style={{ color: "#64748b", fontSize: "18px", marginBottom: "8px" }}>
              {lang === "ar" ? "لا توجد عروض حالياً" : "No deals available right now"}
            </h3>
            <p style={{ fontSize: "14px" }}>
              {lang === "ar" ? "تحقق لاحقاً للحصول على أفضل الأسعار" : "Check back later for the best prices"}
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {sorted.map(d => {
              const pct = d.highest_price > 0
                ? Math.round(((d.highest_price - d.lowest_price) / d.highest_price) * 100)
                : 0;

              return (
                <Link key={d.id} to={`/product/${d.id}`} style={{ textDecoration: "none", display: "block" }}>
                  <div style={{ background: "white", border: "1.5px solid #e2e8f0", borderRadius: "16px", overflow: "hidden", transition: "all 0.22s", cursor: "pointer" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = "#fca5a5"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                  >
                    {/* صورة + badge */}
                    <div style={{ position: "relative", background: "linear-gradient(145deg, #f8fafc, #f1f5f9)", height: "180px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {d.image ? (
                        <img src={fixImg(d.image)} alt={d.name}
                          style={{ maxHeight: "150px", maxWidth: "85%", objectFit: "contain", transition: "transform 0.3s" }}
                          onError={e => { e.target.style.display = "none"; }} />
                      ) : (
                        <span style={{ fontSize: "52px" }}>📦</span>
                      )}

                      {/* خصم % */}
                      {pct > 0 && (
                        <div style={{ position: "absolute", top: "12px", right: "12px", background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "white", padding: "5px 10px", borderRadius: "10px", fontSize: "13px", fontWeight: "800", boxShadow: "0 4px 12px rgba(239,68,68,0.35)" }}>
                          -{pct}%
                        </div>
                      )}

                      {/* توفير */}
                      {Number(d.discount) > 0 && (
                        <div style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "3px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "700" }}>
                          {lang === "ar" ? "وفر" : "Save"} {Number(d.discount).toLocaleString()} ₪
                        </div>
                      )}
                    </div>

                    {/* معلومات */}
                    <div style={{ padding: "16px" }}>
                      <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", lineHeight: 1.4, marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {d.name}
                      </h3>

                      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "22px", fontWeight: "900", color: "#ef4444", fontFamily: "Cairo, sans-serif" }}>
                          {Number(d.lowest_price).toLocaleString()} ₪
                        </span>
                        {d.highest_price > d.lowest_price && (
                          <span style={{ fontSize: "14px", color: "#94a3b8", textDecoration: "line-through" }}>
                            {Number(d.highest_price).toLocaleString()} ₪
                          </span>
                        )}
                      </div>

                      {/* شريط التوفير */}
                      {pct > 0 && (
                        <div style={{ height: "4px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #22c55e, #ef4444)", borderRadius: "99px", transition: "width 0.6s ease" }} />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Deals;