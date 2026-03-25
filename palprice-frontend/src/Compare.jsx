import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORY_SPECS, SPEC_ICONS } from "./components/specsConfig";

function fixImg(url) {
  if (!url) return "";
  return url.startsWith("/") ? `/api${url}` : url;
}

function Compare({ lang = "ar", user }) {
  const [products, setProducts] = useState([]);
  const [specs, setSpecs]       = useState({});
  const [loading, setLoading]   = useState(true);

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

  const categoryId = localStorage.getItem("compare_category");
  const specFields = CATEGORY_SPECS[String(categoryId)] || [];
  const allSpecKeys = specFields.filter(field =>
    products.some(p => (specs[p.id] || []).some(s => s.spec_key === field.key && s.spec_value))
  );

  const thStyle = {
    padding: "13px 16px", textAlign: "center",
    fontSize: "12px", fontWeight: "700", color: "#64748b",
    borderBottom: "1px solid #e2e8f0", background: "#f8fafc",
    textTransform: "uppercase", letterSpacing: "0.4px"
  };

  const tdStyle = (highlight = false) => ({
    padding: "13px 16px", textAlign: "center", fontSize: "14px",
    borderBottom: "1px solid #f8fafc", verticalAlign: "middle",
    background: highlight ? "#f0fdf4" : "white"
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
      <div style={{
        width: "100px", height: "100px", borderRadius: "24px",
        background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
        border: "2px solid #bbf7d0",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "48px", margin: "0 auto 24px"
      }}>⚖️</div>
      <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "10px" }}>
        {lang === "ar" ? "لم تضف منتجات للمقارنة" : "No products to compare"}
      </h2>
      <p style={{ color: "#64748b", fontSize: "15px", lineHeight: 1.6, marginBottom: "28px" }}>
        {lang === "ar"
          ? "افتح أي منتج واضغط على \"مقارنة\" لإضافته هنا"
          : "Open any product and click \"Compare\" to add it here"}
      </p>
      <Link to="/" style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        padding: "12px 28px",
        background: "linear-gradient(135deg, #22c55e, #16a34a)",
        color: "white", borderRadius: "12px", textDecoration: "none",
        fontSize: "14px", fontWeight: "700",
        boxShadow: "0 4px 16px rgba(34,197,94,0.3)"
      }}>
        {lang === "ar" ? "تصفح المنتجات" : "Browse Products"}
      </Link>
    </div>
  );

  /* ===== COMPARE ===== */
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #1a2744 100%)", padding: "36px 24px" }}>
        <div style={{ maxWidth: "1240px", margin: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: "900", color: "white", margin: "0 0 4px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
              ⚖️ {lang === "ar" ? "مقارنة المنتجات" : "Compare Products"}
            </h1>
            <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>
              {products.length} {lang === "ar" ? "منتج — اضغط ✕ لإزالة أي منتج" : "products — click ✕ to remove"}
            </p>
          </div>
          <button onClick={clearAll} style={{
            padding: "8px 18px", borderRadius: "10px",
            border: "1px solid rgba(239,68,68,0.3)",
            background: "rgba(239,68,68,0.1)", color: "#fca5a5",
            cursor: "pointer", fontSize: "13px", fontWeight: "600",
            fontFamily: "Tajawal, sans-serif"
          }}>
            ✕ {lang === "ar" ? "مسح الكل" : "Clear All"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1240px", margin: "auto", padding: "28px 24px 60px" }}>

        {/* Product Cards Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `160px repeat(${products.length}, 1fr)`,
          gap: "0", marginBottom: "16px"
        }}>
          {/* خلية فارغة */}
          <div />
          {products.map(p => {
            const isBest = Number(p.best_price) === bestPrice && bestPrice !== Infinity;
            return (
              <div key={p.id} style={{
                background: "white",
                border: isBest ? "2px solid #22c55e" : "1.5px solid #e2e8f0",
                borderRadius: "16px", padding: "20px 14px",
                margin: "0 6px", textAlign: "center", position: "relative",
                boxShadow: isBest ? "0 8px 28px rgba(34,197,94,0.12)" : "0 2px 8px rgba(0,0,0,0.04)"
              }}>
                {isBest && (
                  <div style={{ position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", padding: "3px 12px", borderRadius: "99px", fontSize: "10px", fontWeight: "700", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(34,197,94,0.3)" }}>
                    🏆 {lang === "ar" ? "أفضل سعر" : "Best Price"}
                  </div>
                )}
                <button onClick={() => removeProduct(p.id)} style={{ position: "absolute", top: "8px", right: "8px", width: "22px", height: "22px", borderRadius: "50%", background: "#f1f5f9", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#dc2626"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#94a3b8"; }}>
                  ✕
                </button>

                <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                  {p.image
                    ? <img src={fixImg(p.image)} alt={p.name} style={{ maxWidth: "100%", maxHeight: "100px", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} />
                    : <span style={{ fontSize: "40px" }}>📦</span>}
                </div>

                {p.brand && <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>{p.brand}</p>}
                <h3 style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", lineHeight: 1.4, marginBottom: "10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {p.name}
                </h3>

                <div style={{ background: isBest ? "#f0fdf4" : "#f8fafc", borderRadius: "8px", padding: "8px", marginBottom: "10px" }}>
                  <p style={{ fontSize: "10px", color: "#94a3b8", margin: "0 0 2px", fontWeight: "600" }}>{lang === "ar" ? "أفضل سعر" : "Best Price"}</p>
                  <p style={{ fontSize: "19px", fontWeight: "900", color: isBest ? "#16a34a" : "#0f172a", margin: 0, fontFamily: "Cairo, sans-serif" }}>
                    {p.best_price ? `${Number(p.best_price).toLocaleString()} ₪` : "—"}
                  </p>
                </div>

                <Link to={`/product/${p.id}`} style={{ display: "block", padding: "7px", background: isBest ? "linear-gradient(135deg, #22c55e, #16a34a)" : "#f1f5f9", color: isBest ? "white" : "#475569", borderRadius: "8px", textDecoration: "none", fontSize: "11px", fontWeight: "700" }}>
                  {lang === "ar" ? "عرض التفاصيل" : "View Details"}
                </Link>
              </div>
            );
          })}
        </div>

        {/* جدول المقارنة */}
        {[
          {
            title: lang === "ar" ? "📋 مقارنة أساسية" : "📋 Basic Comparison",
            rows: [
              { label: lang === "ar" ? "الماركة" : "Brand", render: p => p.brand || "—", highlight: false },
              {
                label: lang === "ar" ? "أفضل سعر" : "Best Price",
                render: p => {
                  const isBest = Number(p.best_price) === bestPrice && bestPrice !== Infinity;
                  return <span style={{ fontSize: "16px", fontWeight: "900", color: isBest ? "#16a34a" : "#0f172a", fontFamily: "Cairo, sans-serif" }}>{p.best_price ? `${Number(p.best_price).toLocaleString()} ₪` : "—"}</span>;
                },
                highlight: p => Number(p.best_price) === bestPrice && bestPrice !== Infinity
              },
            ]
          },
          ...(allSpecKeys.length > 0 ? [{
            title: lang === "ar" ? "🔬 المواصفات التقنية" : "🔬 Technical Specs",
            rows: allSpecKeys.map(field => {
              const values = products.map(p => getSpec(p.id, field.key));
              const allSame = values.every(v => v === values[0]);
              return {
                label: <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>{SPEC_ICONS[field.key] || "•"} {lang === "ar" ? field.labelAr : field.labelEn}</span>,
                render: p => {
                  const val = getSpec(p.id, field.key);
                  return (
                    <span style={{ fontWeight: !allSame && val !== "—" ? "700" : "400", color: val === "—" ? "#cbd5e1" : "#0f172a", background: !allSame && val !== "—" ? "#f0fdf4" : "transparent", padding: !allSame && val !== "—" ? "2px 8px" : "0", borderRadius: "6px" }}>
                      {val}
                    </span>
                  );
                },
                highlight: p => {
                  const val = getSpec(p.id, field.key);
                  return !allSame && val !== "—";
                }
              };
            })
          }] : [])
        ].map((section, si) => (
          <div key={si} style={{ background: "white", borderRadius: "14px", border: "1.5px solid #e2e8f0", overflow: "hidden", marginBottom: "16px" }}>
            <div style={{ padding: "13px 20px", background: "linear-gradient(135deg, #f8fafc, #f0fdf4)", borderBottom: "1px solid #e2e8f0" }}>
              <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>{section.title}</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
                <colgroup>
                  <col style={{ width: "160px" }} />
                  {products.map((_, i) => <col key={i} />)}
                </colgroup>
                <tbody>
                  {section.rows.map((row, ri) => (
                    <tr key={ri} style={{ borderBottom: ri < section.rows.length - 1 ? "1px solid #f8fafc" : "none", background: ri % 2 === 0 ? "white" : "#fafafa" }}>
                      <td style={{ padding: "12px 20px", fontSize: "13px", color: "#64748b", fontWeight: "600", borderLeft: "3px solid #f1f5f9" }}>
                        {row.label}
                      </td>
                      {products.map(p => (
                        <td key={p.id} style={{ ...tdStyle(typeof row.highlight === "function" ? row.highlight(p) : false), borderLeft: "1px solid #f8fafc" }}>
                          {typeof row.render === "function" ? row.render(p) : row.render}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {allSpecKeys.length === 0 && (
          <div style={{ textAlign: "center", padding: "24px", background: "white", borderRadius: "14px", border: "1.5px dashed #e2e8f0", color: "#94a3b8", fontSize: "13px" }}>
            {lang === "ar" ? "لا توجد مواصفات تقنية — أضف مواصفات من داشبورد المتجر" : "No technical specs — add from store dashboard"}
          </div>
        )}
      </div>
    </div>
  );
}

export default Compare;