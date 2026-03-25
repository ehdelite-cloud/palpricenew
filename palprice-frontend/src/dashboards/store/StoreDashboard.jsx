import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../../components/DashboardSidebar";

function StoreDashboard({ lang = "ar" }) {
  const storeId = localStorage.getItem("storeId");
  const storeName = localStorage.getItem("storeName") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) { setLoading(false); return; }
    fetch(`/api/stores/${storeId}/products`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [storeId]);

  // إحصائيات مفيدة لصاحب المتجر
  const totalProducts = products.length;
  const productsWithPrice = products.filter(p => p.best_price).length;
  const productsNoPrice = totalProducts - productsWithPrice;
  const avgPrice = productsWithPrice > 0
    ? Math.round(products.filter(p => p.best_price).reduce((sum, p) => sum + Number(p.best_price), 0) / productsWithPrice)
    : 0;
  const mostViewed = [...products].sort((a, b) => Number(b.views || 0) - Number(a.views || 0)).slice(0, 3);
  const cheapest = [...products].filter(p => p.best_price).sort((a, b) => a.best_price - b.best_price).slice(0, 1)[0];

  const stats = [
    {
      label: lang === "ar" ? "منتجاتي" : "My Products",
      value: totalProducts,
      icon: "📦",
      color: "#3b82f6",
      sub: lang === "ar" ? "إجمالي المنتجات في متجرك" : "Total products in your store"
    },
    {
      label: lang === "ar" ? "الأكثر مشاهدة" : "Most Viewed",
      value: mostViewed[0]?.name || "—",
      icon: "🔥",
      color: "#f97316",
      sub: lang === "ar" ? `${mostViewed[0]?.views || 0} مشاهدة` : `${mostViewed[0]?.views || 0} views`,
      isText: true
    },
    {
      label: lang === "ar" ? "منتجات بدون سعر" : "No Price",
      value: productsNoPrice,
      icon: "⚠️",
      color: productsNoPrice > 0 ? "#f59e0b" : "#22c55e",
      sub: lang === "ar" ? "تحتاج إضافة سعر" : "Need pricing"
    },
    {
      label: lang === "ar" ? "متوسط السعر" : "Avg Price",
      value: avgPrice ? `${avgPrice} ₪` : "—",
      icon: "💰",
      color: "#22c55e",
      sub: lang === "ar" ? "متوسط أسعار منتجاتك" : "Average of your prices",
      isText: true
    },
  ];

  const shortcuts = [
    { to: "/store/dashboard/add-product", label: lang === "ar" ? "إضافة منتج" : "Add Product", icon: "➕", color: "#22c55e", desc: lang === "ar" ? "أضف منتجاً جديداً أو سعراً" : "Add a new product or price" },
    { to: "/store/dashboard/products", label: lang === "ar" ? "إدارة المنتجات" : "Manage Products", icon: "📦", color: "#3b82f6", desc: lang === "ar" ? "تعديل وحذف منتجاتك" : "Edit and delete products" },
    { to: "/store/dashboard/competition", label: lang === "ar" ? "مراقبة المنافسة" : "Price Competition", icon: "⚡", color: "#f59e0b", desc: lang === "ar" ? "قارن أسعارك مع المنافسين" : "Compare your prices" },
    { to: "/store/dashboard/profile", label: lang === "ar" ? "إعدادات المتجر" : "Store Settings", icon: "⚙️", color: "#8b5cf6", desc: lang === "ar" ? "تعديل معلومات وشعار متجرك" : "Edit store info and logo" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <DashboardSidebar lang={lang} />

      <main style={{ flex: 1, padding: "40px" }}>

        {/* Welcome */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            {lang === "ar" ? `مرحباً بك في ${storeName || "متجرك"} 👋` : `Welcome back, ${storeName || "Store"} 👋`}
          </h1>
          <p style={{ color: "#64748b", marginTop: "4px", fontSize: "14px" }}>
            {lang === "ar" ? "هاي نظرة عامة على أداء متجرك" : "Here's an overview of your store performance"}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "36px" }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: "white", borderRadius: "12px", padding: "22px",
              border: "1px solid #e2e8f0", borderLeft: `4px solid ${s.color}`
            }}>
              <div style={{ fontSize: "26px", marginBottom: "10px" }}>{s.icon}</div>
              <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 4px", fontWeight: "500" }}>{s.label}</p>
              <p style={{
                fontSize: s.isText ? "16px" : "26px",
                fontWeight: "700", color: "#0f172a", margin: "0 0 6px",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
              }}>
                {loading ? "..." : s.value}
              </p>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* تنبيه إذا في منتجات بدون سعر */}
        {!loading && productsNoPrice > 0 && (
          <div style={{
            background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "10px",
            padding: "14px 18px", marginBottom: "28px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>⚠️</span>
              <p style={{ margin: 0, fontSize: "14px", color: "#92400e", fontWeight: "500" }}>
                {lang === "ar"
                  ? `لديك ${productsNoPrice} منتج بدون سعر — أضف أسعاراً لتظهر في نتائج البحث`
                  : `You have ${productsNoPrice} products without price — add prices to appear in search`}
              </p>
            </div>
            <Link to="/store/dashboard/products" style={{
              padding: "7px 16px", background: "#f59e0b", color: "white",
              borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "600",
              whiteSpace: "nowrap"
            }}>
              {lang === "ar" ? "إصلاح الآن" : "Fix Now"}
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "16px" }}>
          {lang === "ar" ? "إجراءات سريعة" : "Quick Actions"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "36px" }}>
          {shortcuts.map((s, i) => (
            <Link key={i} to={s.to} style={{ textDecoration: "none" }}>
              <div style={{
                background: "white", border: "1px solid #e2e8f0", borderRadius: "12px",
                padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px",
                transition: "all 0.2s", cursor: "pointer"
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = s.color; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                <div style={{
                  width: "42px", height: "42px", borderRadius: "10px",
                  background: `${s.color}15`, display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0
                }}>
                  {s.icon}
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: 0 }}>{s.label}</p>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, marginTop: "2px" }}>{s.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* الأكثر مشاهدة من منتجات المتجر */}
        {!loading && mostViewed.length > 0 && (
          <>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "16px" }}>
              🔥 {lang === "ar" ? "الأكثر مشاهدة في متجرك" : "Most Viewed in Your Store"}
            </h2>
            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              {mostViewed.map((p, i) => (
                <div key={p.id} style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  padding: "14px 20px",
                  borderBottom: i < mostViewed.length - 1 ? "1px solid #f1f5f9" : "none"
                }}>
                  <span style={{
                    width: "24px", height: "24px", borderRadius: "50%",
                    background: i === 0 ? "#fef9c3" : "#f1f5f9",
                    color: i === 0 ? "#854d0e" : "#64748b",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: "700", flexShrink: 0
                  }}>{i + 1}</span>
                  <img src={p.image} alt={p.name}
                    style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "8px", background: "#f8fafc", flexShrink: 0 }}
                    onError={e => e.target.style.display = "none"}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>{p.name}</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
                      {p.best_price ? `${p.best_price} ₪` : (lang === "ar" ? "بدون سعر" : "No price")}
                    </p>
                  </div>
                  <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
                    👁️ {p.views || 0}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default StoreDashboard;