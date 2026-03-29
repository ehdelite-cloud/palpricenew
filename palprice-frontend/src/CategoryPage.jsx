import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "./components/ProductCard";

const PRODUCTS_PER_PAGE = 20;

function CategoryPage({ lang = "ar" }) {
  const { id } = useParams();

  const [products,   setProducts]   = useState([]);
  const [total,      setTotal]      = useState(0);
  const [category,   setCategory]   = useState(null);
  const [subCats,    setSubCats]    = useState([]);
  const [parentCat,  setParentCat]  = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [sort,       setSort]       = useState("");
  const [search,     setSearch]     = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [page,       setPage]       = useState(1);

  // جلب شجرة الفئات مرة واحدة عند تغيير id
  useEffect(() => {
    setPage(1); setSearch(""); setPriceRange({ min: "", max: "" }); setSort("");

    fetch("/api/categories/tree")
      .then(r => r.json())
      .then(tree => {
        if (!Array.isArray(tree)) return;
        let currentCat = null, parent = null, subs = [];
        for (const main of tree) {
          if (main.id == id) { currentCat = main; subs = main.children || []; break; }
          for (const sub of (main.children || [])) {
            if (sub.id == id) { currentCat = sub; parent = main; subs = sub.children || []; break; }
          }
          if (currentCat) break;
        }
        setCategory(currentCat);
        setSubCats(subs);
        setParentCat(parent);
      })
      .catch(() => {});
  }, [id]);

  // جلب المنتجات عند تغيير أي فلتر
  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams({
      category: id,
      page,
      limit: PRODUCTS_PER_PAGE,
    });
    if (search)          params.set("search",    search);
    if (priceRange.min)  params.set("min_price", priceRange.min);
    if (priceRange.max)  params.set("max_price", priceRange.max);
    if (sort)            params.set("sort",       sort);

    fetch(`/api/products?${params}`)
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || []);
        setTotal(data.total    || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, page, search, priceRange.min, priceRange.max, sort]);

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);
  const catName    = category ? (lang === "ar" ? category.name : (category.name_en || category.name)) : "";
  const catIcon    = category?.icon || "📦";

  return (
    <div>
      {/* ===== HERO ===== */}
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #1a2744 100%)", position: "relative", overflow: "hidden", padding: "48px 24px 36px" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 90% 50%, rgba(34,197,94,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1240px", margin: "auto", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Link to="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>{lang === "ar" ? "الرئيسية" : "Home"}</Link>
            {parentCat && (
              <>
                <span>/</span>
                <Link to={`/category/${parentCat.id}`} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                  {lang === "ar" ? parentCat.name : (parentCat.name_en || parentCat.name)}
                </Link>
              </>
            )}
            <span>/</span>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>{catName}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ width: "68px", height: "68px", borderRadius: "18px", background: "rgba(34,197,94,0.15)", border: "2px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "34px", flexShrink: 0 }}>
              {catIcon}
            </div>
            <div>
              <h1 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: "900", color: "white", margin: "0 0 6px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
                {catName}
              </h1>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: 0 }}>
                {loading ? "..." : `${total} ${lang === "ar" ? "منتج" : "products"}`}
              </p>
            </div>
          </div>

          {/* الفئات الفرعية */}
          {subCats.length > 0 && (
            <div style={{ display: "flex", gap: "8px", marginTop: "20px", flexWrap: "wrap" }}>
              {subCats.map(sub => (
                <Link key={sub.id} to={`/category/${sub.id}`}
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "99px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", fontSize: "13px", textDecoration: "none", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,197,94,0.15)"; e.currentTarget.style.color = "#86efac"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}>
                  {sub.icon} {lang === "ar" ? sub.name : (sub.name_en || sub.name)}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== MAIN ===== */}
      <div className="page-container" style={{ maxWidth: "1240px", margin: "auto", padding: "24px 24px 60px" }}>

        {/* Toolbar */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "8px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "12px", alignItems: "center" }}>

          {/* بحث */}
          <div style={{ position: "relative", minWidth: "220px", flex: "1 0 auto" }}>
            <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "14px", pointerEvents: "none" }}>🔍</span>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder={lang === "ar" ? `ابحث في ${catName}...` : `Search ${catName}...`}
              style={{ width: "100%", padding: "10px 40px 10px 14px", borderRadius: "12px", border: "1.5px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", outline: "none", background: "white", boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "#22c55e"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
          </div>

          {/* نطاق السعر */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, background: "white", padding: "4px 8px", borderRadius: "12px", border: "1.5px solid #e2e8f0" }}>
            <input type="number" value={priceRange.min} onChange={e => { setPriceRange(p => ({ ...p, min: e.target.value })); setPage(1); }}
              placeholder={lang === "ar" ? "سعر من" : "Min ₪"}
              style={{ width: "65px", padding: "6px", border: "none", fontSize: "12px", fontFamily: "Tajawal, sans-serif", outline: "none", textAlign: "center", background: "transparent" }} />
            <span style={{ color: "#e2e8f0" }}>|</span>
            <input type="number" value={priceRange.max} onChange={e => { setPriceRange(p => ({ ...p, max: e.target.value })); setPage(1); }}
              placeholder={lang === "ar" ? "إلى" : "Max ₪"}
              style={{ width: "65px", padding: "6px", border: "none", fontSize: "12px", fontFamily: "Tajawal, sans-serif", outline: "none", textAlign: "center", background: "transparent" }} />
          </div>

          {/* ترتيب */}
          <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
            style={{ flexShrink: 0, padding: "10px 16px", borderRadius: "12px", border: "1.5px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", background: "white", cursor: "pointer", outline: "none" }}
            onFocus={e => e.target.style.borderColor = "#22c55e"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
            <option value="">{lang === "ar" ? "الترتيب الافتراضي" : "Default"}</option>
            <option value="price_low">{lang === "ar" ? "السعر: من الأقل" : "Price: Low to High"}</option>
            <option value="price_high">{lang === "ar" ? "السعر: من الأعلى" : "Price: High to Low"}</option>
            <option value="popular">{lang === "ar" ? "الأكثر مشاهدة" : "Most Viewed"}</option>
            <option value="name">{lang === "ar" ? "الاسم أبجدياً" : "Name A-Z"}</option>
          </select>

          {/* مسح */}
          {(search || priceRange.min || priceRange.max || sort) && (
            <button onClick={() => { setSearch(""); setPriceRange({ min: "", max: "" }); setSort(""); setPage(1); }}
              style={{ flexShrink: 0, padding: "10px 16px", borderRadius: "12px", border: "1.5px solid #fecaca", background: "#fef2f2", color: "#ef4444", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
              ✕ {lang === "ar" ? "مسح الفلاتر" : "Clear"}
            </button>
          )}
        </div>

        {/* عداد النتائج */}
        <div style={{ marginBottom: "24px", color: "#64748b", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
          <span>{total} {lang === "ar" ? "منتج" : "products"}</span>
          {totalPages > 1 && (
            <span style={{ background: "#e2e8f0", padding: "2px 8px", borderRadius: "99px", fontSize: "10px" }}>
              {lang === "ar" ? "صفحة" : "page"} {page}/{totalPages}
            </span>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="products-grid">
            {Array(8).fill().map((_, i) => (
              <div key={i} style={{ borderRadius: "16px", overflow: "hidden", border: "1.5px solid #e2e8f0", background: "white" }}>
                <div style={{ height: "180px", background: "linear-gradient(90deg, #f1f5f9 25%, #e8edf2 50%, #f1f5f9 75%)", backgroundSize: "400% 100%", animation: "skeleton-loading 1.5s ease infinite" }} />
                <div style={{ padding: "16px" }}>
                  <div style={{ height: "12px", borderRadius: "6px", background: "#f1f5f9", marginBottom: "8px" }} />
                  <div style={{ height: "12px", borderRadius: "6px", background: "#f1f5f9", width: "60%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#94a3b8" }}>
            <div style={{ fontSize: "52px", marginBottom: "14px" }}>📭</div>
            <h3 style={{ color: "#64748b", fontWeight: "600", fontSize: "18px" }}>
              {search || priceRange.min || priceRange.max
                ? (lang === "ar" ? "لا توجد نتائج للفلتر الحالي" : "No results for current filters")
                : (lang === "ar" ? "لا توجد منتجات في هذه الفئة" : "No products in this category")}
            </h3>
            {(search || priceRange.min || priceRange.max) && (
              <button onClick={() => { setSearch(""); setPriceRange({ min: "", max: "" }); setPage(1); }}
                style={{ marginTop: "16px", padding: "10px 24px", background: "#f1f5f9", border: "1.5px solid #e2e8f0", borderRadius: "10px", cursor: "pointer", fontSize: "13px", color: "#64748b", fontFamily: "Tajawal, sans-serif" }}>
                {lang === "ar" ? "مسح الفلاتر" : "Clear Filters"}
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="products-grid" style={{ marginBottom: "32px" }}>
              {products.map(product => <ProductCard key={product.id} product={product} lang={lang} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                <button onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0); }} disabled={page === 1}
                  style={{ padding: "8px 16px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: page === 1 ? "#f8fafc" : "white", color: page === 1 ? "#94a3b8" : "#0f172a", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "Tajawal, sans-serif" }}>
                  {lang === "ar" ? "→ السابق" : "← Prev"}
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) => p === "..." ? (
                    <span key={`d${i}`} style={{ padding: "8px 4px", color: "#94a3b8", fontSize: "13px" }}>...</span>
                  ) : (
                    <button key={p} onClick={() => { setPage(p); window.scrollTo(0, 0); }}
                      style={{ width: "38px", height: "38px", borderRadius: "10px", border: `1.5px solid ${page === p ? "#22c55e" : "#e2e8f0"}`, background: page === p ? "#22c55e" : "white", color: page === p ? "white" : "#0f172a", cursor: "pointer", fontSize: "13px", fontWeight: page === p ? "700" : "400", fontFamily: "Tajawal, sans-serif" }}>
                      {p}
                    </button>
                  ))
                }

                <button onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0, 0); }} disabled={page === totalPages}
                  style={{ padding: "8px 16px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: page === totalPages ? "#f8fafc" : "white", color: page === totalPages ? "#94a3b8" : "#0f172a", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "Tajawal, sans-serif" }}>
                  {lang === "ar" ? "التالي ←" : "Next →"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;