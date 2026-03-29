import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "./components/ProductCard";
import RecentlyViewed from "./RecentlyViewed";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const QUICK_SEARCHES = ["Samsung", "iPhone", "LG", "سماعات", "ثلاجة", "تلفزيون", "غسالة", "لابتوب"];

function Home({ lang, user }) {
  const [trending, setTrending] = useState([]);
  const [drops, setDrops] = useState([]);
  const [mainCats, setMainCats] = useState([]);
  const [subCats, setSubCats] = useState({});
  const [activeCat, setActiveCat] = useState(null);
  const [stats, setStats] = useState({});
  const [heroSearch, setHeroSearch] = useState("");
  const [heroSuggestions, setHeroSuggestions] = useState([]);
  const heroRef = useRef(null);
  const subCatsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/products/stats/public")
      .then(r => r.json())
      .then(d => {
        if (d.products) setStats({
          products: d.products + "+",
          stores: d.stores + "+",
          categories: d.categories + "",
        });
      }).catch(() => {});

    fetch("/api/products/trending")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setTrending(d); });

    fetch("/api/products/price-drops")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setDrops(d); });

    fetch("/api/categories/tree")
      .then(r => r.json())
      .then(tree => {
        if (Array.isArray(tree)) {
          setMainCats(tree);
          const map = {};
          tree.forEach(c => { map[c.id] = c.children || []; });
          setSubCats(map);
        }
      });
  }, []);

  useEffect(() => {
    if (heroSearch.length < 2) { setHeroSuggestions([]); return; }
    const t = setTimeout(() => {
      fetch(`/api/products/search?q=${heroSearch}`)
        .then(r => r.json())
        .then(d => setHeroSuggestions(Array.isArray(d) ? d.slice(0, 6) : []));
    }, 250);
    return () => clearTimeout(t);
  }, [heroSearch]);

  useEffect(() => {
    function handleOut(e) {
      if (heroRef.current && !heroRef.current.contains(e.target)) setHeroSuggestions([]);
    }
    document.addEventListener("mousedown", handleOut);
    return () => document.removeEventListener("mousedown", handleOut);
  }, []);

  useEffect(() => {
    if (activeCat && subCatsRef.current) {
      setTimeout(() => {
        subCatsRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
    }
  }, [activeCat]);

  function handleHeroSearch(q) {
    const query = q || heroSearch;
    if (!query.trim()) return;
    setHeroSuggestions([]);
    setHeroSearch("");
    navigate(`/search?q=${query}`);
  }

  /* ── ألوان البطاقة حسب الترتيب ── */
  const WHY_ITEMS = [
    { icon: "⚡",  title: lang === "ar" ? "أسعار لحظية"     : "Live Prices",   desc: lang === "ar" ? "تحديث مستمر للأسعار من كل المتاجر"           : "Continuous price updates from all stores"  },
    { icon: "🛡️", title: lang === "ar" ? "موثوق 100%"       : "100% Trusted",  desc: lang === "ar" ? "متاجر فلسطينية موثوقة ومعتمدة"                : "Verified Palestinian stores only"          },
    { icon: "🔔",  title: lang === "ar" ? "تنبيهات الأسعار" : "Price Alerts",   desc: lang === "ar" ? "نبهك عند انخفاض سعر أي منتج"                  : "Get notified when prices drop"             },
    { icon: "📊",  title: lang === "ar" ? "مقارنة ذكية"     : "Smart Compare",  desc: lang === "ar" ? "قارن المواصفات والأسعار دفعة واحدة"            : "Compare specs and prices at once"          },
  ];

  return (
    <div>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-eyebrow">
          <span>🇵🇸</span>
          {lang === "ar" ? "موقع مقارنة الأسعار الفلسطيني الأول" : "Palestine's #1 Price Comparison Site"}
        </div>
        <h1 className="hero-title">
          {lang === "ar"
            ? (<>قارن الأسعار <span className="highlight">واوفر أموالك</span></>)
            : (<>Compare Prices <span className="highlight">Save Money</span></>)}
        </h1>
        <p className="hero-sub">
          {lang === "ar"
            ? "اعثر على أفضل سعر لأي منتج في المتاجر الفلسطينية خلال ثوانٍ"
            : "Find the best price across Palestinian stores in seconds"}
        </p>

        <div ref={heroRef} style={{ position: "relative", display: "inline-block", width: "580px", maxWidth: "92%", zIndex: 1 }}>
          <input
            type="text"
            className="hero-search"
            placeholder={lang === "ar" ? "ابحث عن أي منتج..." : "Search for any product..."}
            value={heroSearch}
            onChange={e => setHeroSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleHeroSearch()}
            style={{ paddingLeft: "20px", paddingRight: "20px" }}
          />
          {heroSuggestions.length > 0 && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 20px 60px rgba(0,0,0,0.18)", zIndex: 200, overflow: "hidden" }}>
              {heroSuggestions.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => { navigate(`/product/${p.id}`); setHeroSuggestions([]); setHeroSearch(""); }}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", cursor: "pointer", borderBottom: i < heroSuggestions.length - 1 ? "1px solid #f1f5f9" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                  <div style={{ width: "44px", height: "44px", borderRadius: "8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                    {p.image
                      ? <img src={p.image.startsWith("/") ? `/api${p.image}` : p.image} alt="" style={{ width: "40px", height: "40px", objectFit: "contain" }} onError={e => e.target.style.display = "none"} />
                      : <span style={{ fontSize: "20px" }}>📦</span>}
                  </div>
                  <div style={{ flex: 1, textAlign: "right" }}>
                    <p style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: 0 }}>{p.variant_label || p.name}</p>
                    {p.brand && <p style={{ fontSize: "12px", color: "#64748b", margin: "1px 0 0" }}>{p.brand}</p>}
                  </div>
                  {p.best_price && <p style={{ fontSize: "15px", fontWeight: "800", color: "#22c55e", margin: 0, flexShrink: 0 }}>{Number(p.best_price).toLocaleString()} ₪</p>}
                </div>
              ))}
              <div
                onClick={() => handleHeroSearch(heroSearch)}
                style={{ padding: "11px 16px", textAlign: "center", color: "#22c55e", fontSize: "13px", fontWeight: "700", cursor: "pointer", background: "#f0fdf4", borderTop: "1px solid #dcfce7" }}
                onMouseEnter={e => e.currentTarget.style.background = "#dcfce7"}
                onMouseLeave={e => e.currentTarget.style.background = "#f0fdf4"}
              >
                🔍 {lang === "ar" ? `عرض كل نتائج "${heroSearch}"` : `See all results for "${heroSearch}"`}
              </div>
            </div>
          )}
        </div>

        <div className="hero-tags">
          {QUICK_SEARCHES.map(q => (
            <button key={q} className="hero-tag" onClick={() => handleHeroSearch(q)}>{q}</button>
          ))}
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <div className="stats-bar">
        <div className="stats-bar-inner">
          {[
            { icon: "📦", value: stats.products || "...", label: lang === "ar" ? "منتج مقارن"    : "Products"     },
            { icon: "🏪", value: stats.stores   || "...", label: lang === "ar" ? "متجر فلسطيني"  : "Stores"       },
            { icon: "🗂️", value: stats.categories|| "...",label: lang === "ar" ? "فئة"            : "Categories"  },
            { icon: "🔄", value: "24/7",                  label: lang === "ar" ? "تحديث الأسعار" : "Price Updates" },
          ].map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-text"><h3>{s.value}</h3><p>{s.label}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== CATEGORIES ===== */}
      <div style={{ background: "#0f172a", padding: "40px 24px" }}>
        <div style={{ maxWidth: "1240px", margin: "auto" }}>
          <div style={{ marginBottom: "24px" }}>
            <p style={{ color: "#4ade80", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 4px" }}>
              {lang === "ar" ? "تصفح الفئات" : "BROWSE CATEGORIES"}
            </p>
            <h2 style={{ fontFamily: "Cairo, sans-serif", fontSize: "22px", fontWeight: "900", color: "white", margin: 0 }}>
              {lang === "ar" ? "إيش تبحث عنه؟" : "What are you looking for?"}
            </h2>
          </div>

          <div className="cats-main-row" style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "16px" }}>
            {mainCats.map(cat => {
              const isActive = activeCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(isActive ? null : cat.id)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: "6px", padding: "12px 16px", borderRadius: "14px",
                    border: `1.5px solid ${isActive ? "#4ade80" : "rgba(255,255,255,0.08)"}`,
                    background: isActive ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.04)",
                    color: isActive ? "#4ade80" : "rgba(255,255,255,0.65)",
                    cursor: "pointer", transition: "all 0.2s",
                    fontFamily: "Tajawal, sans-serif",
                    minWidth: "72px", flexShrink: 0,
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(74,222,128,0.3)"; e.currentTarget.style.color = "white"; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; } }}
                >
                  <span style={{ fontSize: "24px", lineHeight: 1 }}>{cat.icon || "📦"}</span>
                  <span style={{ fontSize: "11px", fontWeight: isActive ? "700" : "500", textAlign: "center", lineHeight: 1.3, whiteSpace: "nowrap" }}>
                    {lang === "ar" ? cat.name : (cat.name_en || cat.name)}
                  </span>
                  {isActive && <span style={{ fontSize: "8px" }}>▲</span>}
                </button>
              );
            })}
          </div>

          {activeCat && (
            <div ref={subCatsRef} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", padding: "20px", animation: "fadeIn 0.2s ease" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "20px" }}>{mainCats.find(c => c.id === activeCat)?.icon}</span>
                  <span style={{ color: "white", fontSize: "15px", fontWeight: "700", fontFamily: "Cairo, sans-serif" }}>
                    {lang === "ar" ? mainCats.find(c => c.id === activeCat)?.name : mainCats.find(c => c.id === activeCat)?.name_en}
                  </span>
                </div>
                <Link to={`/category/${activeCat}`} style={{ padding: "6px 14px", background: "#4ade80", color: "#0f172a", borderRadius: "8px", textDecoration: "none", fontSize: "12px", fontWeight: "700" }}>
                  {lang === "ar" ? "عرض الكل ←" : "View All →"}
                </Link>
              </div>

              {(subCats[activeCat] || []).length > 0 ? (
                <div className="mobile-scroll-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "8px" }}>
                  {(subCats[activeCat] || []).map(sub => (
                    <Link
                      key={sub.id}
                      to={`/category/${sub.id}`}
                      className="mobile-scroll-item"
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "12px 8px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)", textDecoration: "none", transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.35)"; e.currentTarget.style.background = "rgba(74,222,128,0.07)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    >
                      <span style={{ fontSize: "22px" }}>{sub.icon || "📦"}</span>
                      <span style={{ fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.7)", textAlign: "center", lineHeight: 1.3 }}>
                        {lang === "ar" ? sub.name : (sub.name_en || sub.name)}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <Link to={`/category/${activeCat}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", borderRadius: "12px", border: "1px dashed rgba(74,222,128,0.3)", textDecoration: "none", color: "#4ade80", fontSize: "13px", fontWeight: "700" }}>
                  {lang === "ar" ? "تصفح منتجات هذه الفئة ←" : "Browse category products →"}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== TRENDING ===== */}
      {trending.length > 0 && (
        <div style={{ background: "white", padding: "48px 0", borderTop: "1px solid #f1f5f9" }}>
          <div className="container">
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "3px", display: "flex", alignItems: "center", gap: "8px" }}>
                🔥 {lang === "ar" ? "الأكثر مشاهدة" : "Trending Now"}
              </h2>
              <p style={{ fontSize: "13px", color: "#94a3b8" }}>{lang === "ar" ? "المنتجات الأكثر بحثاً" : "Most viewed products"}</p>
            </div>
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={16}
              slidesPerView={2}
              breakpoints={{ 480: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1280: { slidesPerView: 5 } }}
              navigation
              loop={trending.length >= 5}
              autoplay={trending.length >= 5 ? { delay: 2500, disableOnInteraction: false } : false}
              style={{ paddingBottom: "8px" }}
            >
              {trending.map(product => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={{ ...product, badge: "trending" }} lang={lang} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {/* ===== PRICE DROPS ===== */}
      {drops.length > 0 && (
        <div className="deals-strip">
          <div className="deals-strip-inner">
            <div className="deals-label">📉 {lang === "ar" ? "انخفاض الأسعار" : "PRICE DROPS"}</div>
            <div className="mobile-deals-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
              {drops.slice(0, 4).map(product => (
                <div key={product.id} className="mobile-deals-item">
                  <ProductCard product={{ ...product, badge: "drop" }} lang={lang} dark />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== WHY PALPRICE ===== */}
      <div style={{ background: "#0f172a", padding: "64px 24px" }}>
        <div style={{ maxWidth: "1240px", margin: "auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: "900", color: "white", marginBottom: "8px" }}>
            {lang === "ar" ? "لماذا PalPrice؟" : "Why PalPrice?"}
          </h2>
          <p style={{ color: "#64748b", marginBottom: "40px", fontSize: "15px" }}>
            {lang === "ar" ? "الموقع الفلسطيني الأول لمقارنة الأسعار" : "Palestine's first price comparison platform"}
          </p>

          {/*
            ديسكتوب: grid 4 أعمدة
            موبايل:  flex أفقي قابل للسحب (scrollable)
            الفرق الوحيد عن الأصل = أضفنا overflowX + flexShrink + minWidth على كل بطاقة
          */}
          <style>{`
            .why-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
              gap: 24px;
            }
            @media (max-width: 640px) {
              .why-grid {
                display: flex !important;
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
                gap: 14px !important;
                padding-bottom: 8px;
                justify-content: flex-start;
                text-align: right;
              }
              .why-grid::-webkit-scrollbar { display: none; }
              .why-card {
                flex: 0 0 200px !important;
                min-width: 200px !important;
                scroll-snap-align: start;
              }
            }
          `}</style>

          <div className="why-grid">
            {WHY_ITEMS.map((f, i) => (
              <div key={i} className="why-card" style={{ background: "#1e293b", borderRadius: "16px", padding: "28px 20px", border: "1px solid #334155", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "14px" }}>{f.icon}</div>
                <h3 style={{ color: "white", fontWeight: "700", fontSize: "16px", marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ color: "#64748b", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RecentlyViewed lang={lang} />

    </div>
  );
}

export default Home;