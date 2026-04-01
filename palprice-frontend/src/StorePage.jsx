import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "./components/ProductCard";
import { useStore } from "./hooks/useStore";

const PRODUCTS_PER_PAGE = 12;

function StorePage({ lang = "ar" }) {
  const { id } = useParams();

  const { store, products, rating, tree, loading, setRating } = useStore(id);

  const [userRating, setUserRating] = useState(5);
  const [comment,    setComment]    = useState("");
  const [reviewSent, setReviewSent] = useState(false);
  const [activeTab,  setActiveTab]  = useState("products");
  const [search,     setSearch]     = useState("");
  const [sort,       setSort]       = useState("");
  const [page,       setPage]       = useState(1);
  const [activeMainId, setActiveMainId] = useState(null);
  const [activeSubId,  setActiveSubId]  = useState(null);

  async function submitReview() {
    if (!comment.trim()) return;
    await fetch(`/api/stores/${id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: userRating, comment }),
    });
    setComment(""); setUserRating(5); setReviewSent(true);
    setTimeout(() => setReviewSent(false), 3000);
    fetch(`/api/stores/${id}/rating`).then(r => r.json()).then(setRating);
  }

  if (loading) return (
    <div style={{ padding: "80px", textAlign: "center", color: "#64748b" }}>
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>⏳</div>
      {lang === "ar" ? "جاري التحميل..." : "Loading..."}
    </div>
  );
  if (!store) return (
    <div style={{ padding: "80px", textAlign: "center", color: "#64748b" }}>
      <div style={{ fontSize: "48px", marginBottom: "12px" }}>🏪</div>
      <p>{lang === "ar" ? "المتجر غير موجود" : "Store not found"}</p>
    </div>
  );

  const logoSrc    = store.logo ? (store.logo.startsWith("/") ? `/api${store.logo}` : store.logo) : null;
  const avgRating  = rating && Number(rating.total) > 0 ? Number(rating.average) : 0;
  const totalReviews = rating ? Number(rating.total) : 0;

  const productCatIds = new Set(products.map(p => Number(p.category_id)).filter(Boolean));
  const mainCatsWithProducts = tree.filter(main => {
    const subIds = (main.children || []).map(s => s.id);
    return [main.id, ...subIds].some(cid => productCatIds.has(cid));
  });
  const activeSubs = activeMainId
    ? (tree.find(m => m.id === activeMainId)?.children || []).filter(sub => productCatIds.has(sub.id))
    : [];

  let filtered = products.filter(p => {
    let matchCat = true;
    if (activeSubId) {
      matchCat = Number(p.category_id) === activeSubId;
    } else if (activeMainId) {
      const main  = tree.find(m => m.id === activeMainId);
      const subIds = new Set((main?.children || []).map(s => s.id));
      subIds.add(activeMainId);
      matchCat = subIds.has(Number(p.category_id));
    }
    const matchSearch = !search ||
      (p.variant_label || p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (sort === "price_low")  filtered.sort((a, b) => (a.best_price || 0) - (b.best_price || 0));
  if (sort === "price_high") filtered.sort((a, b) => (b.best_price || 0) - (a.best_price || 0));
  if (sort === "name")       filtered.sort((a, b) => (a.variant_label || a.name || "").localeCompare(b.variant_label || b.name || ""));

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  function countForMain(main) {
    const subIds = new Set((main?.children || []).map(s => s.id));
    subIds.add(main?.id);
    return products.filter(p => subIds.has(Number(p.category_id))).length;
  }

  const TABS = [
    { key: "products", icon: "📦", label: lang === "ar" ? "المنتجات"  : "Products",  count: products.length },
    { key: "reviews",  icon: "⭐", label: lang === "ar" ? "التقييمات" : "Reviews",   count: totalReviews    },
    { key: "about",    icon: "ℹ️", label: lang === "ar" ? "معلومات"   : "About"                             },
  ];

  // بيانات تبويب About مع جميع حقول التواصل
  const aboutRows = [
    { icon: "🏪", label: lang === "ar" ? "اسم المتجر"        : "Store Name",  value: store.name    },
    { icon: "📍", label: lang === "ar" ? "المدينة"           : "City",        value: store.city    },
    { icon: "📮", label: lang === "ar" ? "العنوان"           : "Address",     value: store.address },
    { icon: "📧", label: lang === "ar" ? "البريد الإلكتروني" : "Email",       value: store.email   },
    { icon: "📞", label: lang === "ar" ? "الهاتف"            : "Phone",       value: store.phone,  href: store.phone    ? `tel:${store.phone}`                             : null },
    { icon: "💬", label: "WhatsApp",                                           value: store.whatsapp ? `WhatsApp` : null,  href: store.whatsapp ? `https://wa.me/${store.whatsapp.replace(/\D/g,'')}` : null },
    { icon: "📸", label: "Instagram",                                          value: store.instagram ? `@${store.instagram}` : null, href: store.instagram ? `https://instagram.com/${store.instagram}` : null },
    { icon: "📘", label: "Facebook",                                           value: store.facebook, href: store.facebook ? `https://facebook.com/${store.facebook}` : null },
    { icon: "🌐", label: lang === "ar" ? "الموقع الإلكتروني" : "Website",     value: store.website,  href: store.website },
    { icon: "📦", label: lang === "ar" ? "عدد المنتجات"      : "Products",    value: `${products.length} ${lang === "ar" ? "منتج" : "products"}` },
    { icon: "⭐", label: lang === "ar" ? "التقييم"           : "Rating",      value: avgRating > 0 ? `${avgRating.toFixed(1)} / 5 (${totalReviews} ${lang === "ar" ? "تقييم" : "reviews"})` : (lang === "ar" ? "لا يوجد تقييم بعد" : "No reviews yet") },
  ].filter(r => r.value);

  return (
    <div>
      {/* ══════ HERO ══════ */}
      {/* ← إصلاح: حذفنا overflow:hidden من الـ outer div لأنه كان يمنع الـ scroll على الموبايل */}
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #1a2744 50%, #0d3320 100%)", position: "relative", paddingBottom: "0" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 80% 50%, rgba(34,197,94,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1240px", margin: "auto", padding: "48px 24px 0", position: "relative", zIndex: 1 }}>

          {/* معلومات المتجر */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "28px", flexWrap: "wrap", paddingBottom: "32px" }}>
            <div style={{ width: "110px", height: "110px", borderRadius: "22px", background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0, boxShadow: "0 16px 48px rgba(0,0,0,0.4)" }}>
              {logoSrc ? <img src={logoSrc} alt={store.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : <span style={{ fontSize: "48px" }}>🏪</span>}
            </div>
            <div style={{ flex: 1, minWidth: "220px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "900", color: "white", margin: 0, fontFamily: "Cairo, Tajawal, sans-serif" }}>{store.name}</h1>
                <span style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#86efac", padding: "3px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "600" }}>✓ {lang === "ar" ? "متجر موثوق" : "Verified"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                {store.city && <span style={{ fontSize: "13px", color: "#94a3b8" }}>📍 {store.city}</span>}
                {avgRating > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= Math.round(avgRating) ? "#f59e0b" : "#334155", fontSize: "15px" }}>★</span>)}
                    <span style={{ fontSize: "13px", color: "#94a3b8" }}>{avgRating.toFixed(1)} ({totalReviews})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "12px", flexShrink: 0, flexWrap: "wrap" }}>
              {[
                { value: products.length,              label: lang === "ar" ? "منتج"  : "Products"   },
                { value: mainCatsWithProducts.length,  label: lang === "ar" ? "فئة"   : "Categories" },
                { value: totalReviews,                 label: lang === "ar" ? "تقييم" : "Reviews"    },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "12px 18px", textAlign: "center" }}>
                  <p style={{ fontSize: "22px", fontWeight: "900", color: "#22c55e", margin: 0, fontFamily: "Cairo, sans-serif" }}>{s.value}</p>
                  <p style={{ fontSize: "11px", color: "#64748b", margin: "2px 0 0" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.06)", overflowX: "auto" }}>
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{ padding: "14px 22px", background: "none", border: "none", borderBottom: activeTab === tab.key ? "2px solid #22c55e" : "2px solid transparent", color: activeTab === tab.key ? "#22c55e" : "#64748b", fontSize: "13px", fontWeight: activeTab === tab.key ? "700" : "500", cursor: "pointer", fontFamily: "Tajawal, sans-serif", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s", whiteSpace: "nowrap" }}>
                {tab.icon} {tab.label}
                {tab.count !== undefined && (
                  <span style={{ background: activeTab === tab.key ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.08)", color: activeTab === tab.key ? "#22c55e" : "#475569", borderRadius: "99px", fontSize: "11px", fontWeight: "700", padding: "1px 7px" }}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════ CONTENT ══════ */}
      <div style={{ maxWidth: "1240px", margin: "auto", padding: "28px 24px 60px" }}>

        {/* ── PRODUCTS ── */}
        {activeTab === "products" && (
          <div>
            {/* الفئات */}
            {mainCatsWithProducts.length > 0 && (
              <div style={{ background: "#0f172a", borderRadius: "20px", padding: "24px", marginBottom: "24px" }}>
                <p style={{ color: "#22c55e", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 14px" }}>
                  {lang === "ar" ? "تصفح حسب الفئة" : "BROWSE BY CATEGORY"}
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: activeSubs.length > 0 || activeMainId ? "20px" : "0" }}>
                  <button onClick={() => { setActiveMainId(null); setActiveSubId(null); setPage(1); }}
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", borderRadius: "99px", border: `2px solid ${!activeMainId ? "#22c55e" : "rgba(255,255,255,0.1)"}`, background: !activeMainId ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)", color: !activeMainId ? "#22c55e" : "rgba(255,255,255,0.7)", fontWeight: !activeMainId ? "700" : "500", fontSize: "13px", cursor: "pointer", fontFamily: "Tajawal, sans-serif", whiteSpace: "nowrap" }}>
                    🛍️ {lang === "ar" ? "الكل" : "All"} <span style={{ background: !activeMainId ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)", color: !activeMainId ? "#22c55e" : "rgba(255,255,255,0.5)", borderRadius: "99px", fontSize: "11px", padding: "1px 7px", fontWeight: "700" }}>{products.length}</span>
                  </button>
                  {mainCatsWithProducts.map(main => (
                    <button key={main.id} onClick={() => { setActiveMainId(activeMainId === main.id ? null : main.id); setActiveSubId(null); setPage(1); }}
                      style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px", borderRadius: "99px", border: `2px solid ${activeMainId === main.id ? "#22c55e" : "rgba(255,255,255,0.1)"}`, background: activeMainId === main.id ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)", color: activeMainId === main.id ? "#22c55e" : "rgba(255,255,255,0.7)", fontWeight: activeMainId === main.id ? "700" : "500", fontSize: "13px", cursor: "pointer", fontFamily: "Tajawal, sans-serif", whiteSpace: "nowrap" }}>
                      <span>{main.icon || "📦"}</span>
                      {lang === "ar" ? main.name : (main.name_en || main.name)}
                      <span style={{ background: activeMainId === main.id ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)", color: activeMainId === main.id ? "#22c55e" : "rgba(255,255,255,0.5)", borderRadius: "99px", fontSize: "11px", padding: "1px 7px", fontWeight: "700" }}>{countForMain(main)}</span>
                    </button>
                  ))}
                </div>
                {activeMainId && activeSubs.length > 0 && (
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px" }}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button onClick={() => { setActiveSubId(null); setPage(1); }}
                        style={{ padding: "7px 14px", borderRadius: "99px", border: `1.5px solid ${!activeSubId ? "#22c55e" : "rgba(255,255,255,0.1)"}`, background: !activeSubId ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)", color: !activeSubId ? "#22c55e" : "rgba(255,255,255,0.55)", fontWeight: !activeSubId ? "700" : "400", fontSize: "12px", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                        {lang === "ar" ? "كل الفئة" : "All"} ({countForMain(tree.find(m => m.id === activeMainId))})
                      </button>
                      {activeSubs.map(sub => {
                        const subCount = products.filter(p => Number(p.category_id) === sub.id).length;
                        return (
                          <button key={sub.id} onClick={() => { setActiveSubId(sub.id); setPage(1); }}
                            style={{ padding: "7px 14px", borderRadius: "99px", border: `1.5px solid ${activeSubId === sub.id ? "#22c55e" : "rgba(255,255,255,0.1)"}`, background: activeSubId === sub.id ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)", color: activeSubId === sub.id ? "#22c55e" : "rgba(255,255,255,0.55)", fontWeight: activeSubId === sub.id ? "700" : "400", fontSize: "12px", cursor: "pointer", fontFamily: "Tajawal, sans-serif", whiteSpace: "nowrap" }}>
                            {sub.icon} {lang === "ar" ? sub.name : (sub.name_en || sub.name)} <span style={{ opacity: 0.6, fontSize: "11px" }}>({subCount})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Toolbar */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ position: "relative", flex: 1, minWidth: "160px" }}>
                <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "13px" }}>🔍</span>
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder={lang === "ar" ? "ابحث في المتجر..." : "Search store..."}
                  style={{ width: "100%", padding: "9px 36px 9px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", outline: "none", background: "white", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "#22c55e"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
              <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
                style={{ padding: "9px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", background: "white", cursor: "pointer", outline: "none" }}>
                <option value="">{lang === "ar" ? "الترتيب" : "Sort"}</option>
                <option value="price_low">{lang === "ar" ? "السعر ↑" : "Price ↑"}</option>
                <option value="price_high">{lang === "ar" ? "السعر ↓" : "Price ↓"}</option>
                <option value="name">{lang === "ar" ? "الاسم" : "Name"}</option>
              </select>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>{filtered.length} {lang === "ar" ? "منتج" : "products"}</span>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8", background: "white", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
                <p style={{ fontSize: "15px", fontWeight: "600", color: "#64748b" }}>
                  {search ? (lang === "ar" ? "لا توجد نتائج" : "No results") : (lang === "ar" ? "لا توجد منتجات" : "No products")}
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px", marginBottom: "24px" }}>
                  {paginated.map(product => <ProductCard key={product.id} product={product} lang={lang} />)}
                </div>
                {totalPages > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                    <button onClick={() => { setPage(p => Math.max(1, p-1)); window.scrollTo(0,300); }} disabled={page===1} style={{ padding: "8px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: page===1?"#f8fafc":"white", color: page===1?"#94a3b8":"#0f172a", cursor: page===1?"not-allowed":"pointer", fontSize: "13px", fontFamily: "Tajawal, sans-serif" }}>{lang==="ar"?"→ السابق":"← Prev"}</button>
                    {Array.from({ length: totalPages }, (_, i) => i+1).filter(p => p===1||p===totalPages||Math.abs(p-page)<=2).reduce((acc,p,i,arr) => { if(i>0&&p-arr[i-1]>1)acc.push("..."); acc.push(p); return acc; }, []).map((p,i) => p==="..."?(<span key={`d${i}`} style={{ padding:"8px 4px", color:"#94a3b8" }}>...</span>):(<button key={p} onClick={()=>{setPage(p);window.scrollTo(0,300);}} style={{ width:"36px", height:"36px", borderRadius:"10px", border:`1.5px solid ${page===p?"#22c55e":"#e2e8f0"}`, background:page===p?"#22c55e":"white", color:page===p?"white":"#0f172a", cursor:"pointer", fontSize:"13px", fontWeight:page===p?"700":"400", fontFamily:"Tajawal, sans-serif" }}>{p}</button>))}
                    <button onClick={() => { setPage(p => Math.min(totalPages, p+1)); window.scrollTo(0,300); }} disabled={page===totalPages} style={{ padding: "8px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: page===totalPages?"#f8fafc":"white", color: page===totalPages?"#94a3b8":"#0f172a", cursor: page===totalPages?"not-allowed":"pointer", fontSize: "13px", fontFamily: "Tajawal, sans-serif" }}>{lang==="ar"?"التالي ←":"Next →"}</button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── REVIEWS ── */}
        {activeTab === "reviews" && (
          <div style={{ maxWidth: "680px" }}>
            {avgRating > 0 && (
              <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "28px", marginBottom: "20px", textAlign: "center" }}>
                <p style={{ fontSize: "52px", fontWeight: "900", color: "#0f172a", margin: 0, lineHeight: 1 }}>{avgRating.toFixed(1)}</p>
                <div style={{ display: "flex", gap: "2px", justifyContent: "center", margin: "8px 0 4px" }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: s<=Math.round(avgRating)?"#f59e0b":"#e2e8f0", fontSize: "22px" }}>★</span>)}
                </div>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{totalReviews} {lang==="ar"?"تقييم":"reviews"}</p>
              </div>
            )}
            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px" }}>✍️ {lang==="ar"?"قيّم هذا المتجر":"Rate this store"}</h3>
              <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} onClick={() => setUserRating(s)} style={{ fontSize: "32px", cursor: "pointer", color: s<=userRating?"#f59e0b":"#e2e8f0", transition: "transform 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.transform="scale(1.2)"}
                    onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>★</span>
                ))}
              </div>
              <textarea placeholder={lang==="ar"?"اكتب تجربتك...":"Share your experience..."} value={comment} onChange={e => setComment(e.target.value)} rows={3}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "14px", resize: "vertical", marginBottom: "12px", fontFamily: "Tajawal, sans-serif", outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor="#22c55e"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
              {reviewSent ? (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "10px 16px", borderRadius: "8px", fontSize: "14px" }}>✓ {lang==="ar"?"تم إرسال تقييمك!":"Review submitted!"}</div>
              ) : (
                <button onClick={submitReview} disabled={!comment.trim()}
                  style={{ padding: "10px 24px", background: comment.trim()?"#22c55e":"#f1f5f9", color: comment.trim()?"white":"#94a3b8", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: comment.trim()?"pointer":"not-allowed", fontFamily: "Tajawal, sans-serif" }}>
                  {lang==="ar"?"إرسال التقييم":"Submit Review"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── ABOUT ── معلومات المتجر الكاملة */}
        {activeTab === "about" && (
          <div style={{ maxWidth: "600px" }}>
            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              {aboutRows.map((row, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 24px", borderBottom: i < aboutRows.length-1 ? "1px solid #f8fafc" : "none", background: i%2===0 ? "white" : "#fafafa" }}>
                  <div style={{ width: "38px", height: "38px", background: "#f0fdf4", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{row.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0, fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>{row.label}</p>
                    {row.href ? (
                      <a href={row.href} target="_blank" rel="noreferrer"
                        style={{ fontSize: "15px", color: "#16a34a", margin: "3px 0 0", fontWeight: "500", textDecoration: "none", display: "block" }}>
                        {row.value}
                      </a>
                    ) : (
                      <p style={{ fontSize: "15px", color: "#0f172a", margin: "3px 0 0", fontWeight: "500" }}>{row.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
    
  );
  
}



export default StorePage;