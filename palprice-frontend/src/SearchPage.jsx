import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "./components/ProductCard";

function SearchPage({ lang = "ar" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("");
  const [localSearch, setLocalSearch] = useState(query);
  const [suggestions, setSuggestions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterBrand, setFilterBrand] = useState("");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    if (localSearch.length < 2) { setSuggestions([]); return; }
    const t = setTimeout(() => {
      fetch(`/api/products/search?q=${encodeURIComponent(localSearch)}`)
        .then(r => r.json())
        .then(d => setSuggestions(Array.isArray(d) ? d.slice(0, 6) : []))
        .catch(() => setSuggestions([]));
    }, 250);
    return () => clearTimeout(t);
  }, [localSearch]);

  useEffect(() => {
    function handleOut(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSuggestions([]);
    }
    document.addEventListener("mousedown", handleOut);
    return () => document.removeEventListener("mousedown", handleOut);
  }, []);

  useEffect(() => {
    setLocalSearch(query);
    if (!query.trim()) { setProducts([]); return; }
    setLoading(true);
    fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [query]);

  // الفلترة والترتيب
  let sorted = [...products];
  if (filterBrand) sorted = sorted.filter(p => p.brand?.toLowerCase().includes(filterBrand.toLowerCase()));
  if (filterMinPrice) sorted = sorted.filter(p => Number(p.best_price) >= Number(filterMinPrice));
  if (filterMaxPrice) sorted = sorted.filter(p => Number(p.best_price) <= Number(filterMaxPrice));
  if (sort === "price_low") sorted.sort((a, b) => (Number(a.best_price) || 0) - (Number(b.best_price) || 0));
  if (sort === "price_high") sorted.sort((a, b) => (Number(b.best_price) || 0) - (Number(a.best_price) || 0));
  if (sort === "name") sorted.sort((a, b) => (a.variant_label || a.name || "").localeCompare(b.variant_label || b.name || ""));

  // استخراج البراندات المتاحة
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
  const hasFilters = filterBrand || filterMinPrice || filterMaxPrice;

  function clearFilters() {
    setFilterBrand("");
    setFilterMinPrice("");
    setFilterMaxPrice("");
  }

  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #1a2744 100%)", padding: "40px 24px 32px" }}>
        <div style={{ maxWidth: "1240px", margin: "auto" }}>
          {query
            ? <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 6px" }}>{lang === "ar" ? "نتائج البحث عن:" : "Search results for:"}</p>
            : <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: "900", color: "white", margin: "0 0 12px", fontFamily: "Cairo, Tajawal, sans-serif" }}>🔍 {lang === "ar" ? "البحث الذكي" : "Search"}</h1>
          }

          <div ref={searchRef} style={{ position: "relative", marginBottom: "12px" }}>
            <form onSubmit={e => { e.preventDefault(); if (localSearch.trim()) { setSuggestions([]); navigate(`/search?q=${encodeURIComponent(localSearch.trim())}`); } }}
              style={{ display: "flex", gap: "10px" }}>
              <input type="text" value={localSearch} onChange={e => setLocalSearch(e.target.value)}
                placeholder={lang === "ar" ? "عن ماذا تبحث اليوم؟ (مثال: ايفون 15، ثلاجة)" : "What are you looking for?"}
                style={{ flex: 1, padding: "14px 20px", borderRadius: "14px", border: "none", fontSize: "15px", fontFamily: "Tajawal, sans-serif", outline: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
              <button type="submit"
                style={{ background: "#15803d", color: "white", border: "none", borderRadius: "14px", padding: "0 24px", fontSize: "16px", fontWeight: "700", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                {lang === "ar" ? "ابحث" : "Find"}
              </button>
            </form>

            {suggestions.length > 0 && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 20px 60px rgba(0,0,0,0.18)", zIndex: 200, overflow: "hidden" }}>
                {suggestions.map((p, i) => (
                  <div key={p.id}
                    onClick={() => { navigate(`/product/${p.id}`); setSuggestions([]); setLocalSearch(""); }}
                    style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", cursor: "pointer", borderBottom: i < suggestions.length - 1 ? "1px solid #f1f5f9" : "none" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                      {p.image ? <img src={p.image.startsWith("/") ? `/api${p.image}` : p.image} alt="" style={{ width: "40px", height: "40px", objectFit: "contain" }} onError={e => e.target.style.display = "none"} /> : <span style={{ fontSize: "20px" }}>📦</span>}
                    </div>
                    <div style={{ flex: 1, textAlign: lang === "ar" ? "right" : "left" }}>
                      <p style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: 0 }}>{p.variant_label || p.name}</p>
                      {p.brand && <p style={{ fontSize: "12px", color: "#64748b", margin: "1px 0 0" }}>{p.brand}</p>}
                    </div>
                    {p.best_price && <p style={{ fontSize: "15px", fontWeight: "800", color: "#15803d", margin: 0, flexShrink: 0 }}>{Number(p.best_price).toLocaleString()} ₪</p>}
                  </div>
                ))}
                <div onClick={() => { setSuggestions([]); navigate(`/search?q=${encodeURIComponent(localSearch.trim())}`); }}
                  style={{ padding: "11px 16px", textAlign: "center", color: "#15803d", fontSize: "13px", fontWeight: "700", cursor: "pointer", background: "#f0fdf4", borderTop: "1px solid #dcfce7" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#dcfce7"}
                  onMouseLeave={e => e.currentTarget.style.background = "#f0fdf4"}>
                  🔍 {lang === "ar" ? `عرض كل نتائج "${localSearch}"` : `See all results for "${localSearch}"`}
                </div>
              </div>
            )}
          </div>

          {query && (
            <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
              {loading ? (lang === "ar" ? "جاري البحث..." : "Searching...") : `${sorted.length} ${lang === "ar" ? "نتيجة" : "results"}`}
            </p>
          )}
        </div>
      </div>

      <div className="page-container" style={{ maxWidth: "1240px", margin: "auto", padding: "24px 24px 60px" }}>

        {/* Toolbar */}
        {!loading && products.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>
                {sorted.length} {lang === "ar" ? "نتيجة" : "results"}
                {hasFilters && <span style={{ color: "#15803d", fontWeight: "700" }}> (مفلترة)</span>}
              </p>
              {hasFilters && (
                <button onClick={clearFilters}
                  style={{ padding: "4px 10px", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                  ✕ {lang === "ar" ? "مسح الفلاتر" : "Clear filters"}
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button onClick={() => setShowFilters(p => !p)}
                style={{ padding: "8px 14px", borderRadius: "10px", border: `1.5px solid ${showFilters ? "#15803d" : "#e2e8f0"}`, background: showFilters ? "#f0fdf4" : "white", color: showFilters ? "#15803d" : "#475569", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Tajawal, sans-serif", display: "flex", alignItems: "center", gap: "6px" }}>
                🔧 {lang === "ar" ? "فلاتر" : "Filters"}
                {hasFilters && <span style={{ background: "#15803d", color: "white", borderRadius: "99px", width: "16px", height: "16px", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800" }}>!</span>}
              </button>
              <select value={sort} onChange={e => setSort(e.target.value)}
                style={{ padding: "8px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", background: "white", outline: "none" }}>
                <option value="">{lang === "ar" ? "الترتيب الافتراضي" : "Default"}</option>
                <option value="price_low">{lang === "ar" ? "السعر: من الأقل" : "Price: Low to High"}</option>
                <option value="price_high">{lang === "ar" ? "السعر: من الأعلى" : "Price: High to Low"}</option>
                <option value="name">{lang === "ar" ? "الاسم" : "Name"}</option>
              </select>
            </div>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && products.length > 0 && (
          <div style={{ background: "white", borderRadius: "16px", border: "1.5px solid #e2e8f0", padding: "20px", marginBottom: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>

            {/* فلتر البراند */}
            {brands.length > 0 && (
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  🏷️ {lang === "ar" ? "الماركة" : "Brand"}
                </label>
                <select value={filterBrand} onChange={e => setFilterBrand(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", background: "white", outline: "none" }}>
                  <option value="">{lang === "ar" ? "كل الماركات" : "All Brands"}</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            )}

            {/* فلتر السعر */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                💰 {lang === "ar" ? "نطاق السعر (₪)" : "Price Range (₪)"}
              </label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input type="number" placeholder={lang === "ar" ? "من" : "Min"} value={filterMinPrice} onChange={e => setFilterMinPrice(e.target.value)}
                  style={{ flex: 1, padding: "8px 10px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "13px", fontFamily: "Cairo, sans-serif", outline: "none", width: "100%" }}
                  onFocus={e => e.target.style.borderColor = "#4ade80"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                <span style={{ color: "#94a3b8", fontSize: "12px", flexShrink: 0 }}>—</span>
                <input type="number" placeholder={lang === "ar" ? "إلى" : "Max"} value={filterMaxPrice} onChange={e => setFilterMaxPrice(e.target.value)}
                  style={{ flex: 1, padding: "8px 10px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "13px", fontFamily: "Cairo, sans-serif", outline: "none", width: "100%" }}
                  onFocus={e => e.target.style.borderColor = "#4ade80"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
            </div>

            {/* نطاقات سريعة */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                ⚡ {lang === "ar" ? "نطاقات سريعة" : "Quick Ranges"}
              </label>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {[
                  { label: lang === "ar" ? "أقل من 200₪" : "<200₪", min: "", max: "200" },
                  { label: "200-500₪", min: "200", max: "500" },
                  { label: "500-1000₪", min: "500", max: "1000" },
                  { label: lang === "ar" ? "أكثر من 1000₪" : ">1000₪", min: "1000", max: "" },
                ].map(r => (
                  <button key={r.label} onClick={() => { setFilterMinPrice(r.min); setFilterMaxPrice(r.max); }}
                    style={{
                      padding: "5px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "600", cursor: "pointer",
                      fontFamily: "Tajawal, sans-serif",
                      background: filterMinPrice === r.min && filterMaxPrice === r.max ? "#15803d" : "#f1f5f9",
                      color: filterMinPrice === r.min && filterMaxPrice === r.max ? "white" : "#475569",
                      border: "none",
                    }}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="products-grid">
            {Array(6).fill().map((_, i) => (
              <div key={i} style={{ borderRadius: "16px", overflow: "hidden", border: "1.5px solid #e2e8f0", background: "white" }}>
                <div style={{ height: "180px", background: "linear-gradient(90deg, #f1f5f9 25%, #e8edf2 50%, #f1f5f9 75%)", backgroundSize: "400% 100%", animation: "skeleton-loading 1.5s ease infinite" }} />
                <div style={{ padding: "16px" }}>
                  <div style={{ height: "12px", background: "#f1f5f9", borderRadius: "6px", marginBottom: "8px" }} />
                  <div style={{ height: "18px", background: "#f1f5f9", borderRadius: "6px", width: "50%" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Query */}
        {!loading && !query && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>🔭</div>
            <h3 style={{ color: "#64748b", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
              {lang === "ar" ? "ما الذي تبحث عنه؟" : "What are you looking for?"}
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              {lang === "ar" ? "استخدم شريط البحث أعلاه للعثور على أي منتج ومقارنة أسعاره." : "Use the search bar above to find any product and compare prices."}
            </p>
          </div>
        )}

        {/* Empty Result */}
        {!loading && products.length === 0 && query && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>🔍</div>
            <h3 style={{ color: "#64748b", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
              {lang === "ar" ? `لا توجد نتائج لـ "${query}"` : `No results for "${query}"`}
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              {lang === "ar" ? "جرب كلمات أخرى أو تصفح الفئات" : "Try different keywords or browse categories"}
            </p>
          </div>
        )}

        {/* No results after filter */}
        {!loading && products.length > 0 && sorted.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎯</div>
            <h3 style={{ color: "#64748b", fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
              {lang === "ar" ? "لا توجد نتائج بهذه الفلاتر" : "No results with these filters"}
            </h3>
            <button onClick={clearFilters}
              style={{ padding: "8px 20px", borderRadius: "10px", background: "#15803d", color: "white", border: "none", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "Tajawal, sans-serif", marginTop: "8px" }}>
              {lang === "ar" ? "مسح الفلاتر" : "Clear filters"}
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && sorted.length > 0 && (
          <div className="products-grid">
            {sorted.map(p => <ProductCard key={p.id} product={p} lang={lang} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;