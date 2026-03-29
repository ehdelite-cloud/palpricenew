import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SPEC_ICONS } from "./components/specsConfig";

function fixImg(url) {
  if (!url) return "";
  return url.startsWith("/") ? `/api${url}` : url;
}

function Compare({ lang = "ar", user }) {
  const [products, setProducts] = useState([]);
  const [specs,    setSpecs]    = useState({});
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("compare")) || [];
    if (ids.length === 0) { setLoading(false); return; }

    fetch(`/api/products/compare?ids=${ids.join(",")}`)
      .then(r => r.json())
      .then(async data => {
        if (!Array.isArray(data)) { setLoading(false); return; }
        setProducts(data);

        const specsData = {};
        await Promise.all(data.map(async p => {
          const r = await fetch(`/api/products/${p.id}/specs`);
          const s = await r.json();
          specsData[p.id] = Array.isArray(s) ? s : [];
        }));
        setSpecs(specsData);

        if (user?.token && data.length >= 2) {
          const currentIds = data.map(p => p.id).sort().join(",");
          if (sessionStorage.getItem("last_comparison") !== currentIds) {
            sessionStorage.setItem("last_comparison", currentIds);
            fetch("/api/users/comparisons", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
              body: JSON.stringify({ product_ids: data.map(p => p.id) })
            }).catch(() => {});
          }
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  }, [user]);

  function removeProduct(id) {
    const ids = JSON.parse(localStorage.getItem("compare")) || [];
    const updated = ids.filter(i => i != id);
    localStorage.setItem("compare", JSON.stringify(updated));
    if (updated.length === 0) localStorage.removeItem("compare_category");
    setProducts(prev => prev.filter(p => p.id !== id));
  }

  function clearAll() {
    localStorage.removeItem("compare");
    localStorage.removeItem("compare_category");
    setProducts([]);
  }

  function getSpec(productId, key) {
    return (specs[productId] || []).find(s => s.spec_key === key)?.spec_value || "—";
  }

  const bestPrice = products.length > 0
    ? Math.min(...products.map(p => Number(p.best_price) || Infinity))
    : null;

  // كل الـ spec_keys الموجودة في DB
  const allSpecKeys = [];
  const seenKeys = new Set();
  products.forEach(p => {
    (specs[p.id] || []).forEach(s => {
      if (!seenKeys.has(s.spec_key)) {
        seenKeys.add(s.spec_key);
        allSpecKeys.push(s.spec_key);
      }
    });
  });

  /* ===== LOADING ===== */
  if (loading) return (
    <div style={{ padding: "80px", textAlign: "center", color: "#64748b" }}>
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>⏳</div>
      {lang === "ar" ? "جاري التحميل..." : "Loading..."}
    </div>
  );

  /* ===== EMPTY ===== */
  if (products.length === 0) return (
    <div style={{ maxWidth: "520px", margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
      <div style={{ width: "100px", height: "100px", borderRadius: "24px", background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "2px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", margin: "0 auto 24px" }}>⚖️</div>
      <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "10px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
        {lang === "ar" ? "قائمة المقارنة فارغة" : "Compare List is Empty"}
      </h2>
      <p style={{ color: "#64748b", fontSize: "15px", lineHeight: 1.7, marginBottom: "24px" }}>
        {lang === "ar" ? "أضف منتجات للمقارنة من صفحات المنتجات (حتى 4 منتجات)" : "Add products to compare from product pages (up to 4 products)"}
      </p>
      <Link to="/" style={{ display: "inline-block", padding: "12px 28px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", borderRadius: "12px", textDecoration: "none", fontSize: "14px", fontWeight: "700", boxShadow: "0 4px 16px rgba(34,197,94,0.3)" }}>
        {lang === "ar" ? "تصفح المنتجات" : "Browse Products"}
      </Link>
    </div>
  );

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #1a2744 100%)", padding: "40px 24px 32px" }}>
        <div style={{ maxWidth: "1240px", margin: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h1 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: "900", color: "white", margin: "0 0 6px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
                ⚖️ {lang === "ar" ? "مقارنة المنتجات" : "Product Comparison"}
              </h1>
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                {products.length} {lang === "ar" ? "منتجات في المقارنة" : "products in comparison"}
              </p>
            </div>
            <button onClick={clearAll}
              style={{ padding: "8px 18px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "Tajawal, sans-serif" }}>
              🗑️ {lang === "ar" ? "مسح الكل" : "Clear All"}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "24px 16px 60px" }}>

        {/* ═══ Grid: كل منتج عمود ═══ */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))`,
          gap: "12px",
        }}>
          {products.map(p => {
            const isBest = Number(p.best_price) === bestPrice && bestPrice !== Infinity;
            const productSpecs = specs[p.id] || [];

            return (
              <div key={p.id} style={{ display: "flex", flexDirection: "column", gap: "0" }}>

                {/* ── كرت المنتج ── */}
                <div style={{
                  background: "white",
                  border: isBest ? "2px solid #22c55e" : "1.5px solid #e2e8f0",
                  borderRadius: "16px 16px 0 0",
                  padding: "16px 12px",
                  textAlign: "center",
                  position: "relative",
                  boxShadow: isBest ? "0 4px 20px rgba(34,197,94,0.12)" : "0 2px 8px rgba(0,0,0,0.04)",
                }}>
                  {/* badge أفضل سعر */}
                  {isBest && (
                    <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", padding: "3px 12px", borderRadius: "99px", fontSize: "10px", fontWeight: "700", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(34,197,94,0.3)", zIndex: 1 }}>
                      🏆 {lang === "ar" ? "أفضل سعر" : "Best Price"}
                    </div>
                  )}

                  {/* زر حذف */}
                  <button onClick={() => removeProduct(p.id)}
                    style={{ position: "absolute", top: "8px", right: "8px", width: "22px", height: "22px", borderRadius: "50%", background: "#f1f5f9", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#dc2626"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#94a3b8"; }}>
                    ✕
                  </button>

                  {/* صورة */}
                  <div style={{ height: "90px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                    {p.image
                      ? <img src={fixImg(p.image)} alt={p.name} style={{ maxWidth: "100%", maxHeight: "90px", objectFit: "contain" }} onError={e => e.target.style.display = "none"} />
                      : <span style={{ fontSize: "36px" }}>📦</span>}
                  </div>

                  {/* brand */}
                  {p.brand && <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>{p.brand}</p>}

                  {/* اسم */}
                  <h3 style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", lineHeight: 1.4, marginBottom: "10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "34px" }}>
                    {p.name}
                  </h3>

                  {/* سعر */}
                  <div style={{ background: isBest ? "#f0fdf4" : "#f8fafc", borderRadius: "8px", padding: "7px", marginBottom: "10px" }}>
                    <p style={{ fontSize: "10px", color: "#94a3b8", margin: "0 0 2px", fontWeight: "600" }}>{lang === "ar" ? "أفضل سعر" : "Best Price"}</p>
                    <p style={{ fontSize: "18px", fontWeight: "900", color: isBest ? "#16a34a" : "#0f172a", margin: 0, fontFamily: "Cairo, sans-serif" }}>
                      {p.best_price ? `${Number(p.best_price).toLocaleString()} ₪` : "—"}
                    </p>
                  </div>

                  <Link to={`/product/${p.id}`}
                    style={{ display: "block", padding: "7px", background: isBest ? "linear-gradient(135deg, #22c55e, #16a34a)" : "#f1f5f9", color: isBest ? "white" : "#475569", borderRadius: "8px", textDecoration: "none", fontSize: "11px", fontWeight: "700" }}>
                    {lang === "ar" ? "عرض التفاصيل" : "View Details"}
                  </Link>
                </div>

                {/* ── مواصفات المنتج تحت الكرت مباشرة ── */}
                {productSpecs.length > 0 && (
                  <div style={{
                    background: "white",
                    border: isBest ? "2px solid #22c55e" : "1.5px solid #e2e8f0",
                    borderTop: "1px solid #f1f5f9",
                    borderRadius: "0 0 16px 16px",
                    overflow: "hidden",
                  }}>
                    {/* عنوان المواصفات */}
                    <div style={{ padding: "8px 12px", background: "linear-gradient(135deg, #f8fafc, #f0fdf4)", borderBottom: "1px solid #e2e8f0" }}>
                      <p style={{ margin: 0, fontSize: "10px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        🔬 {lang === "ar" ? "المواصفات" : "Specs"}
                      </p>
                    </div>

                    {/* صفوف المواصفات */}
                    {productSpecs.map((spec, si) => (
                      <div key={si} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        padding: "8px 12px",
                        borderBottom: si < productSpecs.length - 1 ? "1px solid #f8fafc" : "none",
                        background: si % 2 === 0 ? "white" : "#fafafa",
                        gap: "8px",
                      }}>
                        <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", flexShrink: 0, maxWidth: "45%" }}>
                          {SPEC_ICONS[spec.spec_key] || "•"} {spec.spec_key}
                        </span>
                        <span style={{ fontSize: "11px", color: "#0f172a", fontWeight: "600", textAlign: "left", wordBreak: "break-word" }}>
                          {spec.spec_value || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* إذا لا توجد مواصفات */}
                {productSpecs.length === 0 && (
                  <div style={{ background: "white", border: isBest ? "2px solid #22c55e" : "1.5px solid #e2e8f0", borderTop: "1px solid #f1f5f9", borderRadius: "0 0 16px 16px", padding: "16px 12px", textAlign: "center" }}>
                    <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
                      {lang === "ar" ? "لا توجد مواصفات" : "No specs"}
                    </p>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* ═══ مقارنة أساسية (ماركة + سعر) مشتركة ═══ */}
        {products.length > 1 && (
          <div style={{ background: "white", borderRadius: "14px", border: "1.5px solid #e2e8f0", overflow: "hidden", marginTop: "20px" }}>
            <div style={{ padding: "12px 20px", background: "linear-gradient(135deg, #f8fafc, #f0fdf4)", borderBottom: "1px solid #e2e8f0" }}>
              <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                📋 {lang === "ar" ? "مقارنة سريعة" : "Quick Comparison"}
              </h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: `${products.length * 140 + 140}px` }}>
                <thead>
                  <tr>
                    <th style={{ padding: "10px 16px", textAlign: "right", fontSize: "12px", fontWeight: "700", color: "#64748b", borderBottom: "1px solid #e2e8f0", background: "#f8fafc", width: "140px" }}>
                      {lang === "ar" ? "الخاصية" : "Feature"}
                    </th>
                    {products.map(p => (
                      <th key={p.id} style={{ padding: "10px 12px", textAlign: "center", fontSize: "11px", fontWeight: "700", color: "#0f172a", borderBottom: "1px solid #e2e8f0", background: "#f8fafc", borderLeft: "1px solid #f1f5f9" }}>
                        {p.name?.substring(0, 20)}{p.name?.length > 20 ? "..." : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* الماركة */}
                  <tr style={{ background: "white" }}>
                    <td style={{ padding: "10px 16px", fontSize: "12px", color: "#64748b", fontWeight: "600", borderBottom: "1px solid #f8fafc" }}>
                      {lang === "ar" ? "الماركة" : "Brand"}
                    </td>
                    {products.map(p => (
                      <td key={p.id} style={{ padding: "10px 12px", textAlign: "center", fontSize: "13px", color: "#0f172a", borderBottom: "1px solid #f8fafc", borderLeft: "1px solid #f8fafc", fontWeight: "500" }}>
                        {p.brand || "—"}
                      </td>
                    ))}
                  </tr>
                  {/* أفضل سعر */}
                  <tr style={{ background: "#fafafa" }}>
                    <td style={{ padding: "10px 16px", fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                      {lang === "ar" ? "أفضل سعر" : "Best Price"}
                    </td>
                    {products.map(p => {
                      const isBest = Number(p.best_price) === bestPrice && bestPrice !== Infinity;
                      return (
                        <td key={p.id} style={{ padding: "10px 12px", textAlign: "center", borderLeft: "1px solid #f8fafc", background: isBest ? "#f0fdf4" : "transparent" }}>
                          <span style={{ fontSize: "15px", fontWeight: "900", color: isBest ? "#16a34a" : "#0f172a", fontFamily: "Cairo, sans-serif" }}>
                            {p.best_price ? `${Number(p.best_price).toLocaleString()} ₪` : "—"}
                          </span>
                          {isBest && <div style={{ fontSize: "9px", color: "#16a34a", fontWeight: "700", marginTop: "2px" }}>✓ {lang === "ar" ? "الأرخص" : "Cheapest"}</div>}
                        </td>
                      );
                    })}
                  </tr>
                  {/* المواصفات المشتركة */}
                  {allSpecKeys.map((key, ki) => {
                    const values = products.map(p => getSpec(p.id, key));
                    const allSame = values.every(v => v === values[0]);
                    return (
                      <tr key={ki} style={{ background: ki % 2 === 0 ? "white" : "#fafafa" }}>
                        <td style={{ padding: "10px 16px", fontSize: "12px", color: "#64748b", fontWeight: "600", borderBottom: ki < allSpecKeys.length - 1 ? "1px solid #f8fafc" : "none" }}>
                          {SPEC_ICONS[key] || "•"} {key}
                        </td>
                        {products.map(p => {
                          const val = getSpec(p.id, key);
                          return (
                            <td key={p.id} style={{ padding: "10px 12px", textAlign: "center", fontSize: "12px", borderBottom: ki < allSpecKeys.length - 1 ? "1px solid #f8fafc" : "none", borderLeft: "1px solid #f8fafc" }}>
                              <span style={{ fontWeight: !allSame && val !== "—" ? "700" : "400", color: val === "—" ? "#cbd5e1" : "#0f172a", background: !allSame && val !== "—" ? "#f0fdf4" : "transparent", padding: !allSame && val !== "—" ? "2px 8px" : "0", borderRadius: "6px" }}>
                                {val}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Compare;