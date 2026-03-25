import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function fixImg(url) {
  if (!url) return "";
  return url.startsWith("/") ? `/api${url}` : url;
}

function RecentlyViewed({ lang = "ar", asPage = false }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("recent")) || [];
    if (ids.length === 0) { setLoading(false); return; }

    fetch(`/api/products/compare?ids=${ids.join(",")}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const sorted = ids.map(id => data.find(p => p.id == id)).filter(Boolean);
          setProducts(sorted);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  function clearAll() {
    localStorage.removeItem("recent");
    setProducts([]);
  }

  /* ===== كـ section داخل الصفحة الرئيسية ===== */
  if (!asPage) {
    if (loading || products.length === 0) return null;

    return (
      <div style={{ background: "white", borderTop: "1px solid #f1f5f9", padding: "40px 24px" }}>
        <div style={{ maxWidth: "1240px", margin: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "0 0 3px", fontFamily: "Cairo, Tajawal, sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ background: "#f0fdf4", borderRadius: "8px", padding: "4px 8px", fontSize: "16px" }}>👀</span>
                {lang === "ar" ? "شاهدتها مؤخراً" : "Recently Viewed"}
              </h2>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{products.length} {lang === "ar" ? "منتج" : "products"}</p>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Link to="/recently-viewed" style={{ fontSize: "12px", color: "#22c55e", fontWeight: "600", textDecoration: "none" }}>
                {lang === "ar" ? "عرض الكل ←" : "View All →"}
              </Link>
              <button onClick={clearAll} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "5px 12px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                {lang === "ar" ? "مسح" : "Clear"}
              </button>
            </div>
          </div>

          <div className="mobile-deals-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
            {products.slice(0, 8).map((p, i) => (
              <div key={p.id} className="mobile-deals-item">
                <ProductMiniCard p={p} i={i} lang={lang} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ===== كـ صفحة كاملة /recently-viewed ===== */
  return (
    <div>

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #1a2744 100%)", padding: "48px 24px 36px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 60% at 85% 50%, rgba(34,197,94,0.07) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1240px", margin: "auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "900", color: "white", margin: "0 0 6px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
                👀 {lang === "ar" ? "شاهدتها مؤخراً" : "Recently Viewed"}
              </h1>
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                {products.length} {lang === "ar" ? "منتج شاهدته مؤخراً" : "recently viewed products"}
              </p>
            </div>
            {products.length > 0 && (
              <button onClick={clearAll} style={{ padding: "8px 18px", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#fca5a5", cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "Tajawal, sans-serif" }}>
                ✕ {lang === "ar" ? "مسح الكل" : "Clear All"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1240px", margin: "auto", padding: "28px 24px 60px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "14px" }}>
            {Array(8).fill().map((_, i) => (
              <div key={i} style={{ borderRadius: "14px", overflow: "hidden", border: "1.5px solid #e2e8f0", background: "white" }}>
                <div style={{ height: "130px", background: "linear-gradient(90deg, #f1f5f9 25%, #e8edf2 50%, #f1f5f9 75%)", backgroundSize: "400% 100%", animation: "skeleton-loading 1.5s ease infinite" }} />
                <div style={{ padding: "12px" }}>
                  <div style={{ height: "12px", background: "#f1f5f9", borderRadius: "6px", marginBottom: "8px" }} />
                  <div style={{ height: "16px", background: "#f1f5f9", borderRadius: "6px", width: "50%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>👀</div>
            <h3 style={{ color: "#64748b", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
              {lang === "ar" ? "لم تشاهد أي منتجات بعد" : "No recently viewed products"}
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px" }}>
              {lang === "ar" ? "تصفح المنتجات وستظهر هنا" : "Browse products and they'll appear here"}
            </p>
            <Link to="/" style={{ display: "inline-flex", padding: "10px 24px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", borderRadius: "12px", textDecoration: "none", fontSize: "14px", fontWeight: "700", boxShadow: "0 4px 16px rgba(34,197,94,0.25)" }}>
              {lang === "ar" ? "تصفح المنتجات" : "Browse Products"}
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "14px" }}>
            {products.map((p, i) => (
              <ProductMiniCard key={p.id} p={p} i={i} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* بطاقة منتج صغيرة مشتركة */
function ProductMiniCard({ p, i, lang }) {
  return (
    <Link to={`/product/${p.id}`} style={{ textDecoration: "none" }}>
      <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "14px", overflow: "hidden", transition: "all 0.2s", cursor: "pointer", position: "relative", animation: `fadeInUp 0.3s ease ${Math.min(i, 7) * 0.05}s both` }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.background = "white"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}>

        {i === 0 && (
          <div style={{ position: "absolute", top: "8px", right: "8px", background: "#0f172a", color: "white", fontSize: "9px", fontWeight: "700", padding: "2px 7px", borderRadius: "99px", zIndex: 1 }}>
            {lang === "ar" ? "الأخير" : "Latest"}
          </div>
        )}

        <div style={{ height: "120px", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px" }}>
          {p.image
            ? <img src={fixImg(p.image)} alt={p.name} style={{ maxHeight: "100px", maxWidth: "85%", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} />
            : <span style={{ fontSize: "36px" }}>📦</span>}
        </div>

        <div style={{ padding: "10px 12px 12px", background: "white", borderTop: "1px solid #f1f5f9" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.4 }}>
            {p.name}
          </p>
          {p.best_price
            ? <p style={{ fontSize: "14px", fontWeight: "900", color: "#16a34a", margin: 0, fontFamily: "Cairo, sans-serif" }}>{Number(p.best_price).toLocaleString()} ₪</p>
            : <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>{lang === "ar" ? "لا يوجد سعر" : "No price"}</p>}
        </div>
      </div>
    </Link>
  );
}

export default RecentlyViewed;