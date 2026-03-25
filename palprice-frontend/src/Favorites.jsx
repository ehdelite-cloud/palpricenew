import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./components/ProductCard";

function Favorites({ lang = "ar", user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetch("/api/users/favorites", {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(r => r.json())
      .then(data => { if (Array.isArray(data)) setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  async function removeFavorite(productId) {
    await fetch(`/api/users/favorites/${productId}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${user.token}` }
    });
    setProducts(prev => prev.filter(p => p.id !== productId));
  }

  const filtered = products.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  /* غير مسجل */
  if (!user) return (
    <div style={{ maxWidth: "560px", margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
      <div style={{ width: "100px", height: "100px", borderRadius: "24px", background: "linear-gradient(135deg, #fef2f2, #fee2e2)", border: "2px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", margin: "0 auto 24px" }}>❤️</div>
      <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "10px" }}>
        {lang === "ar" ? "سجل دخول لرؤية مفضلتك" : "Login to see your favorites"}
      </h2>
      <p style={{ color: "#64748b", fontSize: "15px", lineHeight: 1.6, marginBottom: "28px" }}>
        {lang === "ar" ? "احفظ منتجاتك المفضلة وتابع أسعارها بسهولة" : "Save products and track their prices easily"}
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <Link to="/login" style={{ padding: "11px 28px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", borderRadius: "12px", textDecoration: "none", fontSize: "14px", fontWeight: "700", boxShadow: "0 4px 16px rgba(34,197,94,0.3)" }}>
          {lang === "ar" ? "تسجيل الدخول" : "Login"}
        </Link>
        <Link to="/register" style={{ padding: "11px 28px", background: "white", color: "#16a34a", borderRadius: "12px", textDecoration: "none", fontSize: "14px", fontWeight: "700", border: "1.5px solid #22c55e" }}>
          {lang === "ar" ? "إنشاء حساب" : "Register"}
        </Link>
      </div>
    </div>
  );

  return (
    <div>

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #2d1a1a 100%)", padding: "48px 24px 36px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 60% at 85% 50%, rgba(239,68,68,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1240px", margin: "auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "900", color: "white", margin: "0 0 6px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
                ❤️ {lang === "ar" ? "مفضلتي" : "My Favorites"}
              </h1>
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                {products.length} {lang === "ar" ? "منتج محفوظ" : "saved products"}
              </p>
            </div>

            {products.length > 4 && (
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", fontSize: "14px", pointerEvents: "none" }}>🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder={lang === "ar" ? "ابحث في مفضلتك..." : "Search favorites..."}
                  style={{ padding: "10px 38px 10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.08)", color: "white", fontSize: "13px", fontFamily: "Tajawal, sans-serif", outline: "none", width: "220px" }}
                  onFocus={e => e.target.style.borderColor = "rgba(239,68,68,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="page-container" style={{ maxWidth: "1240px", margin: "auto", padding: "28px 24px 60px" }}>
        {loading ? (
          <div className="products-grid">
            {Array(4).fill().map((_, i) => (
              <div key={i} style={{ borderRadius: "16px", overflow: "hidden", border: "1.5px solid #e2e8f0", background: "white" }}>
                <div style={{ height: "180px", background: "linear-gradient(90deg, #f1f5f9 25%, #e8edf2 50%, #f1f5f9 75%)", backgroundSize: "400% 100%", animation: "skeleton-loading 1.5s ease infinite" }} />
                <div style={{ padding: "16px" }}>
                  <div style={{ height: "12px", background: "#f1f5f9", borderRadius: "6px", marginBottom: "8px" }} />
                  <div style={{ height: "18px", background: "#f1f5f9", borderRadius: "6px", width: "50%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>💔</div>
            <h3 style={{ color: "#64748b", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
              {lang === "ar" ? "لا توجد منتجات في المفضلة" : "No favorites yet"}
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px" }}>
              {lang === "ar" ? "اضغط على ❤️ في أي منتج لإضافته" : "Click ❤️ on any product to add it"}
            </p>
            <Link to="/" style={{ display: "inline-flex", padding: "10px 24px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", borderRadius: "12px", textDecoration: "none", fontSize: "14px", fontWeight: "700", boxShadow: "0 4px 16px rgba(34,197,94,0.25)" }}>
              {lang === "ar" ? "تصفح المنتجات" : "Browse Products"}
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
            <div style={{ fontSize: "44px", marginBottom: "12px" }}>🔍</div>
            <p style={{ fontSize: "15px" }}>{lang === "ar" ? "لا توجد نتائج" : "No results"}</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(p => (
              <div key={p.id} style={{ position: "relative" }}>
                <ProductCard product={p} lang={lang} />
                <button onClick={() => removeFavorite(p.id)}
                  style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(254,242,242,0.95)", border: "1px solid #fecaca", borderRadius: "8px", padding: "4px 10px", cursor: "pointer", fontSize: "11px", color: "#dc2626", fontFamily: "Tajawal, sans-serif", fontWeight: "600", backdropFilter: "blur(4px)", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.transform = "scale(1.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(254,242,242,0.95)"; e.currentTarget.style.transform = "none"; }}>
                  🗑️ {lang === "ar" ? "إزالة" : "Remove"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;