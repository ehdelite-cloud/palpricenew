import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import SpecsDisplay from "./components/SpecsDisplay";
import { useToast } from "./components/Toast";
import { useProduct } from "./hooks/useProduct";

function fixImg(url) {
  if (!url) return "";
  return url.startsWith("/") ? `/api${url}` : url;
}

function ProductPage({ lang = "ar", user }) {
  const { id }   = useParams();
  const navigate = useNavigate();
  const toast    = useToast();

  const {
    product, siblings, offers, history, images,
    reviews, ratingInfo, similar,
    storeCoupons, storeCampaign,
    isFavorited, loading,
    setStoreCoupons, setStoreCampaign, setIsFavorited,
    setReviews, setRatingInfo,
    activeImage: defaultImage,
  } = useProduct(id, user?.token);

  const [activeImage,     setActiveImage]     = useState("");
  const [zoom,            setZoom]            = useState(false);
  const [targetPrice,     setTargetPrice]     = useState("");
  const [newRating,       setNewRating]       = useState(5);
  const [comment,         setComment]         = useState("");
  const [alertSent,       setAlertSent]       = useState(false);
  const [copiedCoupon,    setCopiedCoupon]    = useState(null);
  const [reviewSent,      setReviewSent]      = useState(false);
  const [activeTab,       setActiveTab]       = useState("prices");
  const [compareMsg,      setCompareMsg]      = useState(null);
  const [showAllImages,   setShowAllImages]   = useState(false);
  const [showAllSiblings, setShowAllSiblings] = useState(false);

  // Sync active image when product loads
  useEffect(() => {
    if (defaultImage) setActiveImage(defaultImage);
  }, [defaultImage]);

  // Track recently viewed + viewed API call
  useEffect(() => {
    let viewed = JSON.parse(localStorage.getItem("recent")) || [];
    viewed = viewed.filter(v => v != id);
    viewed.unshift(String(id));
    if (viewed.length > 12) viewed.pop();
    localStorage.setItem("recent", JSON.stringify(viewed));

    if (user?.token) {
      fetch(`/api/users/viewed/${id}`, { method: "POST", headers: { Authorization: `Bearer ${user.token}` } }).catch(() => {});
    }

    setActiveTab("prices");
  }, [id, user]);

  function createAlert() {
    if (!targetPrice || !user?.token) return;
    fetch(`/api/products/${id}/alert`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ target_price: targetPrice }),
    }).then(r => r.json()).then(data => {
      if (data.error === "login_required") { navigate("/login"); return; }
      setAlertSent(true); setTargetPrice("");
      setTimeout(() => setAlertSent(false), 4000);
      toast.success(lang === "ar" ? "✓ تم إنشاء التنبيه — سنخبرك فور انخفاض السعر" : "Alert created!");
    }).catch(() => toast.error(lang === "ar" ? "حدث خطأ، حاول مجدداً" : "Something went wrong"));
  }

  function addReview() {
    if (!comment.trim() || !user?.token) return;
    fetch(`/api/products/${id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ rating: newRating, comment }),
    }).then(r => {
      if (!r.ok) throw new Error();
      return r.json();
    }).then(() => {
      setComment(""); setReviewSent(true);
      setTimeout(() => setReviewSent(false), 3000);
      toast.success(lang === "ar" ? "✓ تم إرسال تقييمك بنجاح" : "Review submitted!");
      fetch(`/api/products/${id}/reviews`).then(r => r.json()).then(data => { if (Array.isArray(data)) setReviews(data); });
      fetch(`/api/products/${id}/rating`).then(r => r.json()).then(data => setRatingInfo(data));
    }).catch(() => toast.error(lang === "ar" ? "حدث خطأ أثناء إرسال التقييم" : "Failed to submit review"));
  }

  function addToCompare() {
  let compare  = JSON.parse(localStorage.getItem("compare")) || [];
  const category = localStorage.getItem("compare_category");
  if (compare.length === 0) {
    localStorage.setItem("compare_category", product.category_id);
    compare.push(product.id);
    setCompareMsg({ type: "success", text: lang === "ar" ? "✓ تمت الإضافة للمقارنة — اضغط هنا للمقارنة" : "✓ Added to compare — click to compare", link: true });
  } else {
    if (category != product.category_id) {
      setCompareMsg({ type: "error", text: lang === "ar" ? "يمكنك مقارنة منتجات من نفس الفئة فقط" : "Only same category products" });
      return;
    }
    if (compare.includes(product.id)) {
      setCompareMsg({ type: "info", text: lang === "ar" ? "المنتج موجود في المقارنة" : "Already in compare" });
      return;
    }
    if (compare.length >= 4) {
      setCompareMsg({ type: "error", text: lang === "ar" ? "الحد الأقصى 4 منتجات في المقارنة" : "Maximum 4 products in compare" });
      return;
    }
    compare.push(product.id);
    setCompareMsg({ type: "success", text: lang === "ar" ? `✓ تمت الإضافة — ${compare.length} منتجات في المقارنة` : `✓ Added — ${compare.length} products in compare`, link: true });
  }
  localStorage.setItem("compare", JSON.stringify(compare));
  setTimeout(() => setCompareMsg(null), 4000);
}

  async function toggleFavorite() {
    if (!user) { navigate("/login"); return; }
    if (isFavorited) {
      await fetch(`/api/users/favorites/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${user.token}` } });
      setIsFavorited(false);
    } else {
      await fetch(`/api/users/favorites/${id}`, { method: "POST", headers: { Authorization: `Bearer ${user.token}` } });
      setIsFavorited(true);
    }
  }

  if (!product) return (
    <div style={{ padding: "100px", textAlign: "center", color: "#64748b" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
      <p>{lang === "ar" ? "جاري التحميل..." : "Loading..."}</p>
    </div>
  );

  const mainProductImage = fixImg(product.image);
  const displayName      = product.variant_label || product.name;
  const allImages        = [mainProductImage, ...images.map(i => fixImg(i.image_url))].filter(Boolean);
  const variantSiblings  = siblings.filter(s => String(s.id) !== String(id)).slice(0, 8);

  const TABS = [
    { key: "prices",  icon: "🏪", label: lang === "ar" ? "الأسعار"       : "Prices",  count: offers.length  },
    { key: "specs",   icon: "📋", label: lang === "ar" ? "المواصفات"     : "Specs"                          },
    { key: "history", icon: "📈", label: lang === "ar" ? "تاريخ الأسعار" : "History", count: history.length },
    { key: "reviews", icon: "⭐", label: lang === "ar" ? "التقييمات"     : "Reviews", count: reviews.length },
    { key: "alert",   icon: "🔔", label: lang === "ar" ? "تنبيه السعر"   : "Alert"                          },
  ];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>

      {/* Modal المقارنة */}
      {compareMsg && (
        <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", zIndex: 9999, animation: "slideUp 0.3s ease" }}>
          <style>{`@keyframes slideUp{from{transform:translateX(-50%) translateY(20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}`}</style>
          <div style={{ background: compareMsg.type === "success" ? "#0f172a" : compareMsg.type === "error" ? "#fef2f2" : "#fffbeb", border: `1px solid ${compareMsg.type === "success" ? "#22c55e" : compareMsg.type === "error" ? "#fecaca" : "#fde68a"}`, borderRadius: "14px", padding: "14px 20px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", minWidth: "280px", maxWidth: "400px" }}>
            <span style={{ fontSize: "20px" }}>{compareMsg.type === "success" ? "✅" : compareMsg.type === "error" ? "❌" : "ℹ️"}</span>
            <span style={{ flex: 1, fontSize: "14px", fontWeight: "600", color: compareMsg.type === "success" ? "white" : "#0f172a", fontFamily: "Tajawal, sans-serif" }}>{compareMsg.text}</span>
            {compareMsg.link && (
              <Link to="/compare" style={{ padding: "6px 14px", background: "#22c55e", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "12px", fontWeight: "700", whiteSpace: "nowrap" }}>
                {lang === "ar" ? "قارن الآن" : "Compare"}
              </Link>
            )}
            <button onClick={() => setCompareMsg(null)} style={{ background: "none", border: "none", color: compareMsg.type === "success" ? "#94a3b8" : "#64748b", cursor: "pointer", fontSize: "16px", padding: 0 }}>✕</button>
          </div>
        </div>
      )}

      {/* HERO */}
      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "20px 24px 0" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#94a3b8", marginBottom: "20px", flexWrap: "wrap" }}>
            <Link to="/" style={{ color: "#94a3b8", textDecoration: "none" }}>{lang === "ar" ? "الرئيسية" : "Home"}</Link>
            <span>/</span>
            {product.category_id && <Link to={`/category/${product.category_id}`} style={{ color: "#94a3b8", textDecoration: "none" }}>{product.category_name || (lang === "ar" ? "الفئة" : "Category")}</Link>}
            <span>/</span>
            <span style={{ color: "#475569", fontWeight: "600" }}>{product.brand}</span>
          </div>

          <div className="product-page-main" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "start", paddingBottom: "28px" }}>

            {/* ── الصور ── */}
            {/* ← إصلاح: width: "400px" → maxWidth: "100%", width: "min(400px, 100%)" */}
            <div style={{ flexShrink: 0, width: "min(400px, 100%)" }}>
              <div className="product-img-wrap"
                onClick={() => activeImage && setZoom(true)}
                style={{ borderRadius: "20px", border: "1.5px solid #e2e8f0", background: "linear-gradient(135deg, #f8fafc, #f1f5f9)", cursor: activeImage ? "zoom-in" : "default", display: "flex", alignItems: "center", justifyContent: "center", height: "400px", position: "relative", overflow: "hidden" }}>
                {allImages.length > 1 && (
                  <>
                    <button onClick={e => { e.stopPropagation(); const idx = allImages.indexOf(activeImage); setActiveImage(idx < allImages.length - 1 ? allImages[idx + 1] : allImages[0]); }} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "1px solid #e2e8f0", borderRadius: "50%", width: "40px", height: "40px", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", zIndex: 10, color: "#0f172a" }}>◀</button>
                    <button onClick={e => { e.stopPropagation(); const idx = allImages.indexOf(activeImage); setActiveImage(idx > 0 ? allImages[idx - 1] : allImages[allImages.length - 1]); }} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "1px solid #e2e8f0", borderRadius: "50%", width: "40px", height: "40px", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", zIndex: 10, color: "#0f172a" }}>▶</button>
                  </>
                )}
                {activeImage
                  ? <img src={activeImage} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "20px" }} onError={e => e.target.style.display = "none"} />
                  : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", color: "#94a3b8" }}><span style={{ fontSize: "64px" }}>📦</span></div>
                }
                {activeImage && <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(0,0,0,0.35)", color: "white", borderRadius: "8px", padding: "4px 10px", fontSize: "11px" }}>🔍</div>}
                
              </div>

              {allImages.length > 1 && (() => {
  const visible = showAllImages ? allImages : allImages.slice(0, 4);
  return (
    <div style={{ display: "flex", gap: "8px", marginTop: "12px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "4px", WebkitOverflowScrolling: "touch", flexWrap: "wrap" }}>
      {visible.map((src, i) => (
        <div key={i} onClick={() => setActiveImage(src)} style={{ flexShrink: 0, width: "68px", height: "68px", borderRadius: "12px", overflow: "hidden", cursor: "pointer", border: `2px solid ${activeImage === src ? "#22c55e" : "#e2e8f0"}`, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
          <img src={src} alt="" style={{ width: "60px", height: "60px", objectFit: "contain" }} onError={e => e.target.style.display = "none"} />
        </div>
      ))}
      {allImages.length > 4 && (
        <div onClick={() => setShowAllImages(!showAllImages)} style={{ flexShrink: 0, width: "68px", height: "68px", borderRadius: "12px", border: "2px dashed #e2e8f0", background: "#f8fafc", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b", gap: "2px", transition: "all 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#22c55e"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}>
          <span style={{ fontSize: "22px", fontWeight: "700" }}>{showAllImages ? "−" : "+"}</span>
          {!showAllImages && <span style={{ fontSize: "10px", fontWeight: "600" }}>{allImages.length - 4}</span>}
        </div>
      )}
    </div>
  );
})()}
                 
            </div>

            {/* Zoom Modal */}
            {zoom && (
              <div onClick={() => setZoom(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2000, cursor: "zoom-out" }}>
                <p style={{ position: "absolute", top: "20px", color: "white", fontSize: "14px", opacity: 0.7, fontFamily: "monospace" }}>{allImages.indexOf(activeImage) + 1} / {allImages.length}</p>
                <button onClick={e => { e.stopPropagation(); setZoom(false); }} style={{ position: "absolute", top: "20px", left: "20px", background: "rgba(255,255,255,0.1)", color: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "18px", cursor: "pointer", zIndex: 2001 }}>✕</button>
                <div style={{ position: "relative", width: "100%", height: "75%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {allImages.length > 1 && (
                    <>
                      <button onClick={e => { e.stopPropagation(); const idx = allImages.indexOf(activeImage); setActiveImage(idx > 0 ? allImages[idx - 1] : allImages[allImages.length - 1]); }} style={{ position: "absolute", right: "20px", background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", width: "56px", height: "56px", fontSize: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2001 }}>▶</button>
                      <button onClick={e => { e.stopPropagation(); const idx = allImages.indexOf(activeImage); setActiveImage(idx < allImages.length - 1 ? allImages[idx + 1] : allImages[0]); }} style={{ position: "absolute", left: "20px", background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", width: "56px", height: "56px", fontSize: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2001 }}>◀</button>
                    </>
                  )}
                  <img src={activeImage} onClick={e => e.stopPropagation()} alt="zoom" style={{ maxWidth: "90%", maxHeight: "100%", objectFit: "contain", borderRadius: "8px", cursor: "default" }} />
                </div>
                {allImages.length > 1 && (
                  <div style={{ position: "absolute", bottom: "30px", display: "flex", gap: "10px", maxWidth: "90%", overflowX: "auto", scrollbarWidth: "none", padding: "10px 0" }}>
                    {allImages.map((src, i) => (
                      <img key={i} src={src} onClick={e => { e.stopPropagation(); setActiveImage(src); }} alt="" style={{ flexShrink: 0, width: "60px", height: "60px", objectFit: "cover", borderRadius: "10px", border: `2px solid ${activeImage === src ? "#22c55e" : "transparent"}`, cursor: "pointer", opacity: activeImage === src ? 1 : 0.4, transition: "0.2s" }} onError={e => e.target.style.display = "none"} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── معلومات المنتج ── */}
            <div style={{ position: "sticky", top: "72px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                {product.brand && <span style={{ background: "#f1f5f9", color: "#475569", padding: "3px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "600" }}>🏷️ {product.brand}</span>}
                {product.category_name && <Link to={`/category/${product.category_id}`} style={{ background: "#f0fdf4", color: "#16a34a", padding: "3px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>{product.category_name}</Link>}
              </div>
              <h1 style={{ fontSize: "clamp(17px,2.5vw,24px)", fontWeight: "900", color: "#0f172a", marginBottom: "12px", lineHeight: 1.35, fontFamily: "Cairo, Tajawal, sans-serif" }}>{displayName}</h1>

              {ratingInfo && Number(ratingInfo.total) > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= Math.round(ratingInfo.average) ? "#f59e0b" : "#e2e8f0", fontSize: "16px" }}>★</span>)}
                  </div>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>{Number(ratingInfo.average).toFixed(1)} · {ratingInfo.total} {lang === "ar" ? "تقييم" : "reviews"}</span>
                </div>
              )}

              <div className="hidden-on-mobile" style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1.5px solid #86efac", borderRadius: "16px", padding: "18px 22px", marginBottom: "22px", display: "inline-block" }}>
                <p style={{ color: "#16a34a", fontSize: "11px", fontWeight: "700", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "1px" }}>✨ {lang === "ar" ? "أفضل سعر" : "Best Price"}</p>
                <p style={{ fontSize: "clamp(26px,4vw,34px)", fontWeight: "900", color: "#15803d", margin: 0, fontFamily: "Cairo, sans-serif", lineHeight: 1 }}>
                  {product.best_price ? `${Number(product.best_price).toLocaleString()} ₪` : (lang === "ar" ? "لا يوجد سعر" : "No price")}
                </p>
                {offers.length > 1 && <p style={{ fontSize: "12px", color: "#16a34a", margin: "4px 0 0" }}>{lang === "ar" ? `في ${offers.length} متاجر` : `In ${offers.length} stores`}</p>}
              </div>

              {variantSiblings.length > 0 && (
                <div style={{ marginBottom: "22px" }}>
                  <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>🔀 {lang === "ar" ? "موديلات أخرى" : "Other Models"} ({variantSiblings.length})</p>
                  <div style={{ display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "10px", WebkitOverflowScrolling: "touch", flexWrap: "wrap" }}>
                    {(showAllSiblings ? variantSiblings : variantSiblings.slice(0, 3)).map(v => (
                      <Link key={v.id} to={`/product/${v.id}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "10px", padding: "8px 14px", borderRadius: "14px", border: "1.5px solid #e2e8f0", background: "white", textDecoration: "none", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.background = "#f0fdf4"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "white"; }}>
                        {v.image && <img src={fixImg(v.image)} alt="" style={{ width: "32px", height: "32px", objectFit: "contain", flexShrink: 0 }} onError={e => e.target.style.display = "none"} />}
                        <div>
                          <p style={{ fontSize: "12px", color: "#475569", margin: 0, fontWeight: "700", maxWidth: "140px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{(v.variant_label || v.name).split("،").slice(-2).join("،").trim()}</p>
                          {v.best_price && <p style={{ fontSize: "13px", color: "#22c55e", fontWeight: "800", margin: "2px 0 0", fontFamily: "Cairo, sans-serif" }}>{Number(v.best_price).toLocaleString()} ₪</p>}
                        </div>
                      </Link>
                    ))}
                    {variantSiblings.length > 3 && (
                      <div onClick={() => setShowAllSiblings(!showAllSiblings)}
                        style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 14px", borderRadius: "14px", border: "2px dashed #e2e8f0", background: "white", cursor: "pointer", color: "#64748b", minWidth: "60px", gap: "2px" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "#22c55e"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}>
                        <span style={{ fontSize: "20px", fontWeight: "700" }}>{showAllSiblings ? "−" : "+"}</span>
                        {!showAllSiblings && <span style={{ fontSize: "10px", fontWeight: "600" }}>{variantSiblings.length - 3}</span>}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="hidden-on-mobile" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
                <button onClick={toggleFavorite} style={{ flex: 1, minWidth: "120px", padding: "11px 18px", background: isFavorited ? "#fef2f2" : "white", color: isFavorited ? "#dc2626" : "#475569", border: `1.5px solid ${isFavorited ? "#fecaca" : "#e2e8f0"}`, borderRadius: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Tajawal, sans-serif", transition: "all 0.2s" }}>
                  {isFavorited ? "❤️" : "🤍"} {lang === "ar" ? (isFavorited ? "في المفضلة" : "أضف للمفضلة") : (isFavorited ? "Saved" : "Save")}
                </button>
                <button onClick={addToCompare} style={{ flex: 1, minWidth: "120px", padding: "11px 18px", background: "white", color: "#475569", border: "1.5px solid #e2e8f0", borderRadius: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                  ⚖️ {lang === "ar" ? "مقارنة" : "Compare"}
                </button>
              </div>
              {/* أزرار المشاركة */}
<div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
  <button onClick={() => {
    const text = encodeURIComponent(`${displayName} - أفضل سعر ${product.best_price} ₪\nhttps://palprice.ps/product/${product.id}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }} style={{ flex: 1, padding: "10px", background: "linear-gradient(135deg,#25d366,#128c7e)", color: "white", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
    📱 {lang === "ar" ? "واتساب" : "WhatsApp"}
  </button>
  <button onClick={() => {
    const url = encodeURIComponent(`https://palprice.ps/product/${product.id}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  }} style={{ flex: 1, padding: "10px", background: "#1877f2", color: "white", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
    📘 {lang === "ar" ? "فيسبوك" : "Facebook"}
  </button>
</div>
              {offers.length > 0 && (
  <div style={{ marginTop: "20px", background: "#f8fafc", borderRadius: "14px", border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
    <div style={{ padding: "10px 16px", background: "white", borderBottom: "1px solid #f1f5f9" }}>
      <p style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: 0 }}>🏪 {lang === "ar" ? "أسعار المتاجر" : "Store Prices"}</p>
    </div>
    {offers.slice(0,4).map((o, i) => (
  <a key={i} href={`/store/${o.store_id}`} target="_blank" rel="noreferrer"
    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: i < Math.min(offers.length,4)-1 ? "1px solid #f1f5f9" : "none", textDecoration: "none", background: i===0 ? "#f0fdf4" : "white", transition: "background 0.15s" }}
    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
    onMouseLeave={e => e.currentTarget.style.background = i===0 ? "#f0fdf4" : "white"}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
        {o.store_logo
          ? <img src={fixImg(o.store_logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display="none"} />
          : <span style={{ fontSize: "18px" }}>🏪</span>}
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <p style={{ fontSize: "13px", color: "#0f172a", fontWeight: "700", margin: 0 }}>{o.store_name}</p>
          {i===0 && <span style={{ background: "#16a34a", color: "white", fontSize: "9px", fontWeight: "700", padding: "1px 6px", borderRadius: "4px" }}>الأرخص</span>}
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "2px" }}>
          {o.city && <span style={{ fontSize: "10px", color: "#94a3b8" }}>📍 {o.city}</span>}
          {o.whatsapp && <span style={{ fontSize: "10px", color: "#25d366" }}>📱</span>}
          {o.website && <span style={{ fontSize: "10px", color: "#3b82f6" }}>🌐</span>}
        </div>
      </div>
    </div>
    <span style={{ fontSize: "15px", fontWeight: "800", color: i===0 ? "#16a34a" : "#0f172a", fontFamily: "Cairo, sans-serif" }}>
      {Number(o.price).toLocaleString()} ₪
    </span>
  </a>
))}
    {offers.length > 4 && (
      <button onClick={() => setActiveTab("prices")}
        style={{ width: "100%", padding: "10px", background: "none", border: "none", color: "#22c55e", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
        {lang === "ar" ? `عرض كل ${offers.length} متاجر ↓` : `View all ${offers.length} stores ↓`}
      </button>
    )}
  </div>
)}

              {product.description && <p style={{ marginTop: "16px", fontSize: "14px", color: "#64748b", lineHeight: 1.7, borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>{product.description}</p>}
            </div>
          </div>

          {/* TABS */}
          <div className="sticky-tabs" style={{ display: "flex", borderTop: "1px solid #f1f5f9", overflowX: "auto", scrollbarWidth: "none" }}>
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{ padding: "13px 18px", background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab.key ? "#22c55e" : "transparent"}`, color: activeTab === tab.key ? "#22c55e" : "#64748b", fontSize: "13px", fontWeight: activeTab === tab.key ? "700" : "500", cursor: "pointer", fontFamily: "Tajawal, sans-serif", display: "flex", alignItems: "center", gap: "5px", whiteSpace: "nowrap", transition: "all 0.2s" }}>
                {tab.icon} {tab.label}
                {tab.count > 0 && <span style={{ background: activeTab === tab.key ? "rgba(34,197,94,0.15)" : "#f1f5f9", color: activeTab === tab.key ? "#22c55e" : "#64748b", borderRadius: "99px", fontSize: "10px", padding: "1px 6px", fontWeight: "700" }}>{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB CONTENT */}
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "28px 24px 60px" }}>

        {storeCampaign && (
          <div style={{ borderRadius: "10px", overflow: "hidden", marginBottom: "10px" }}>
            <div style={{ background: storeCampaign.banner_color || "#22c55e", padding: "8px 12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px" }}>📢</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", margin: "0 0 2px" }}>{lang === "ar" ? "حملة نشطة" : "Active Campaign"}</p>
                <p style={{ color: "white", fontWeight: "800", fontSize: "15px", margin: 0 }}>{storeCampaign.title}</p>
              </div>
              {storeCampaign.coupon_code && (
                <button onClick={() => { navigator.clipboard.writeText(storeCampaign.coupon_code); setCopiedCoupon("campaign"); setTimeout(() => setCopiedCoupon(null), 2000); }}
                  style={{ background: "rgba(255,255,255,0.15)", border: "2px dashed rgba(255,255,255,0.5)", borderRadius: "10px", padding: "8px 16px", cursor: "pointer", color: "white", textAlign: "center" }}>
                  <p style={{ fontSize: "10px", margin: "0 0 2px", opacity: 0.8 }}>COUPON</p>
                  <p style={{ fontSize: "16px", fontWeight: "900", fontFamily: "monospace", letterSpacing: "2px", margin: 0 }}>{storeCampaign.coupon_code}</p>
                  <p style={{ fontSize: "10px", margin: "2px 0 0", opacity: 0.8 }}>{copiedCoupon === "campaign" ? "✅ " + (lang === "ar" ? "تم" : "Copied") : "📋 " + (lang === "ar" ? "انسخ" : "Copy")}</p>
                </button>
              )}
            </div>
          </div>
        )}

        {/* PRICES */}
        {activeTab === "prices" && (
          <div>
            <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>🏪 {lang === "ar" ? "مقارنة الأسعار بين المتاجر" : "Compare Store Prices"}</h2>
            {offers.length === 0 ? (
              <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "48px", textAlign: "center", color: "#94a3b8" }}>
                <div style={{ fontSize: "36px", marginBottom: "10px" }}>🏷️</div>
                <p>{lang === "ar" ? "لا توجد أسعار بعد" : "No prices yet"}</p>
              </div>
            ) : (
              <div className="offers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                {offers.map((offer, i) => (
                  <div key={i} className="offer-card" style={{ background: i === 0 ? "linear-gradient(to bottom, #f0fdf4, #ffffff)" : "white", borderRadius: "16px", border: `2px solid ${i === 0 ? "#4ade80" : "#e2e8f0"}`, padding: "20px", display: "flex", flexDirection: "column", gap: "14px", position: "relative", overflow: "hidden", boxShadow: i === 0 ? "0 10px 25px -5px rgba(34,197,94,0.15)" : "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                    {i === 0 && <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "#22c55e" }} />}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                      <div>
                        <Link to={`/store/${offer.store_id}`} style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>🏪 {offer.store_name}</Link>
                        {i === 0 && <span style={{ display: "inline-block", background: "#dcfce7", color: "#166534", padding: "4px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "800", marginTop: "10px" }}>🚀 {lang === "ar" ? "أرخص سعر حالياً!" : "Best Price"}</span>}
                      </div>
                      <div style={{ textAlign: lang === "ar" ? "left" : "right" }}>
                        <p style={{ fontSize: "24px", fontWeight: "900", color: i === 0 ? "#15803d" : "#0f172a", margin: 0, fontFamily: "Cairo, sans-serif", lineHeight: 1 }}>{Number(offer.price).toLocaleString()}</p>
                        <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", margin: "2px 0 0" }}>₪</p>
                      </div>
                    </div>
                    {storeCoupons[offer.store_id]?.length > 0 && (
                      <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "10px", border: "1px dashed #cbd5e1" }}>
                        <p style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", margin: "0 0 8px" }}>🎟️ {lang === "ar" ? "كوبونات متاحة:" : "Available Coupons:"}</p>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {storeCoupons[offer.store_id].map(c => (
                            <button key={c.id} onClick={() => { navigator.clipboard.writeText(c.code); setCopiedCoupon(c.code); setTimeout(() => setCopiedCoupon(null), 2000); }}
                              style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", background: copiedCoupon === c.code ? "#f0fdf4" : "white", border: `1px solid ${copiedCoupon === c.code ? "#22c55e" : "#e2e8f0"}`, borderRadius: "8px", fontSize: "12px", fontWeight: "800", cursor: "pointer", color: copiedCoupon === c.code ? "#16a34a" : "#ca8a04", fontFamily: "monospace" }}>
                              <span>{c.code}</span><span style={{ fontSize: "14px" }}>{copiedCoupon === c.code ? "✓" : "📋"}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <Link to={offer.url || `/store/${offer.store_id}`} style={{ display: "block", textAlign: "center", width: "100%", padding: "12px", background: i === 0 ? "#22c55e" : "#0f172a", color: "white", borderRadius: "10px", fontSize: "15px", fontWeight: "800", textDecoration: "none", boxSizing: "border-box" }}>
                      {lang === "ar" ? "شراء الآن 🛒" : "Buy Now 🛒"}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "specs" && (
          <div>
            <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>📋 {lang === "ar" ? "المواصفات التقنية" : "Technical Specs"}</h2>
            <SpecsDisplay productId={id} categoryId={product.category_id} lang={lang} />
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>📈 {lang === "ar" ? "تاريخ الأسعار" : "Price History"}</h2>
            {history.length === 0 ? (
              <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "48px", textAlign: "center", color: "#94a3b8" }}>
                <div style={{ fontSize: "36px", marginBottom: "10px" }}>📊</div>
                <p>{lang === "ar" ? "لا يوجد تاريخ أسعار" : "No price history yet"}</p>
              </div>
            ) : (
              <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px" }}>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={history}>
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <Tooltip formatter={v => [`${v} ₪`, lang === "ar" ? "السعر" : "Price"]} contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "13px" }} />
                    <Line type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: "#22c55e" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div style={{ maxWidth: "700px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>⭐ {lang === "ar" ? "التقييمات" : "Reviews"}</h2>
            {!user ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "16px", padding: "24px", textAlign: "center", marginBottom: "16px" }}>
                <p style={{ fontSize: "15px", color: "#166534", fontWeight: "600", marginBottom: "16px" }}>🔒 {lang === "ar" ? "سجّل دخولك لإضافة تقييم" : "Login to add a review"}</p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <a href="/login" style={{ padding: "9px 22px", background: "#22c55e", color: "white", borderRadius: "10px", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>{lang === "ar" ? "دخول" : "Login"}</a>
                  <a href="/register" style={{ padding: "9px 22px", background: "white", color: "#166534", border: "1.5px solid #bbf7d0", borderRadius: "10px", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>{lang === "ar" ? "حساب جديد" : "Register"}</a>
                </div>
              </div>
            ) : (
              <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "22px", marginBottom: "16px" }}>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 12px" }}>✍️ {lang === "ar" ? "أضف تقييمك" : "Add Review"}</p>
                <div style={{ display: "flex", gap: "5px", marginBottom: "12px" }}>
                  {[1,2,3,4,5].map(s => <span key={s} onClick={() => setNewRating(s)} style={{ fontSize: "28px", cursor: "pointer", color: s <= newRating ? "#f59e0b" : "#e2e8f0", transition: "transform 0.1s" }} onMouseEnter={e => e.currentTarget.style.transform="scale(1.2)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>★</span>)}
                </div>
                <textarea placeholder={lang === "ar" ? "اكتب تجربتك..." : "Write your review..."} value={comment} onChange={e => setComment(e.target.value)} rows={3} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "14px", resize: "vertical", marginBottom: "12px", fontFamily: "Tajawal, sans-serif", outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor="#22c55e"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
                {reviewSent
                  ? <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "10px 16px", borderRadius: "8px", fontSize: "14px" }}>✓ {lang === "ar" ? "تم الإرسال!" : "Submitted!"}</div>
                  : <button onClick={addReview} disabled={!comment.trim()} style={{ padding: "10px 22px", background: comment.trim() ? "#22c55e" : "#f1f5f9", color: comment.trim() ? "white" : "#94a3b8", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: comment.trim() ? "pointer" : "not-allowed", fontFamily: "Tajawal, sans-serif" }}>{lang === "ar" ? "إرسال" : "Submit"}</button>}
              </div>
            )}
            {reviews.length > 0
              ? <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {reviews.map((r, i) => (
                    <div key={i} style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= r.rating ? "#f59e0b" : "#e2e8f0", fontSize: "13px" }}>★</span>)}
                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>{new Date(r.created_at).toLocaleDateString("ar-PS")}</span>
                      </div>
                      {r.comment && <p style={{ margin: 0, fontSize: "14px", color: "#475569", lineHeight: 1.6 }}>{r.comment}</p>}
                    </div>
                  ))}
                </div>
              : <div style={{ textAlign: "center", padding: "32px", color: "#94a3b8", background: "white", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>💬</div>
                  <p style={{ margin: 0 }}>{lang === "ar" ? "لا توجد تقييمات — كن أول من يقيّم!" : "No reviews yet — be the first!"}</p>
                </div>}
          </div>
        )}

        {activeTab === "alert" && (
          <div style={{ maxWidth: "500px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>🔔 {lang === "ar" ? "تنبيه انخفاض السعر" : "Price Drop Alert"}</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>{lang === "ar" ? "نرسل إشعاراً فور انخفاض السعر" : "Get notified when price drops"}</p>
            {!user ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
                <p style={{ fontSize: "15px", color: "#166534", fontWeight: "600", marginBottom: "16px" }}>🔒 {lang === "ar" ? "سجّل دخولك لإنشاء تنبيهات" : "Login to create alerts"}</p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <a href="/login" style={{ padding: "10px 22px", background: "#22c55e", color: "white", borderRadius: "10px", fontSize: "14px", fontWeight: "700", textDecoration: "none" }}>{lang === "ar" ? "دخول" : "Login"}</a>
                  <a href="/register" style={{ padding: "10px 22px", background: "white", color: "#16a34a", borderRadius: "10px", fontSize: "14px", fontWeight: "700", border: "1.5px solid #22c55e", textDecoration: "none" }}>{lang === "ar" ? "حساب جديد" : "Register"}</a>
                </div>
              </div>
            ) : alertSent ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "18px 22px", borderRadius: "14px", fontSize: "15px", fontWeight: "600" }}>✅ {lang === "ar" ? "تم إنشاء التنبيه!" : "Alert created!"}</div>
            ) : (
              <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "22px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "8px" }}>{lang === "ar" ? "السعر المستهدف (₪)" : "Target Price (₪)"}</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input type="number" placeholder={product.best_price ? String(Math.round(Number(product.best_price) * 0.9)) : "500"} value={targetPrice} onChange={e => setTargetPrice(e.target.value)} style={{ flex: 1, padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "15px", fontFamily: "Cairo, sans-serif", outline: "none" }} onFocus={e => e.target.style.borderColor="#22c55e"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
                  <button onClick={createAlert} disabled={!targetPrice} style={{ padding: "11px 20px", background: targetPrice ? "#22c55e" : "#f1f5f9", color: targetPrice ? "white" : "#94a3b8", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: targetPrice ? "pointer" : "not-allowed", fontFamily: "Tajawal, sans-serif" }}>🔔 {lang === "ar" ? "إنشاء" : "Create"}</button>
                </div>
                {product.best_price && <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px" }}>{lang === "ar" ? `السعر الحالي: ${Number(product.best_price).toLocaleString()} ₪` : `Current: ${Number(product.best_price).toLocaleString()} ₪`}</p>}
              </div>
            )}
          </div>
        )}

        {similar.length > 0 && (
          <div style={{ marginTop: "48px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginBottom: "18px" }}>🔗 {lang === "ar" ? "منتجات مشابهة" : "Similar Products"}</h2>
            <div className="mobile-deals-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
              {similar.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="mobile-deals-item" style={{ textDecoration: "none", width: "100%" }}>
                  <div style={{ background: "white", borderRadius: "14px", border: "1.5px solid #e2e8f0", padding: "14px", textAlign: "center", height: "100%" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.07)"; e.currentTarget.style.borderColor = "#22c55e"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
                    {p.image
                      ? <img src={fixImg(p.image)} alt={p.name} style={{ width: "80px", height: "80px", objectFit: "contain", marginBottom: "8px" }} onError={e => e.target.style.display="none"} />
                      : <div style={{ width: "80px", height: "80px", background: "#f8fafc", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: "28px" }}>📦</div>}
                    <p style={{ fontSize: "11px", fontWeight: "600", color: "#0f172a", margin: 0, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.variant_label || p.name}</p>
                    {p.best_price && <p style={{ fontSize: "13px", fontWeight: "800", color: "#22c55e", margin: "6px 0 0", fontFamily: "Cairo, sans-serif" }}>{Number(p.best_price).toLocaleString()} ₪</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* شريط سفلي ثابت للموبايل */}
      <div className="sticky-bottom-bar">
        <div>
          <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 2px", fontWeight: "600" }}>{lang === "ar" ? "أفضل سعر" : "Best Price"}</p>
          <p style={{ fontSize: "20px", fontWeight: "900", color: "#15803d", margin: 0, fontFamily: "Cairo, sans-serif", lineHeight: 1 }}>{product.best_price ? `${Number(product.best_price).toLocaleString()} ₪` : "---"}</p>
        </div>
        <button onClick={() => { setActiveTab("prices"); window.scrollTo({ top: 500, behavior: "smooth" }); }} style={{ background: "#22c55e", color: "white", padding: "12px 24px", borderRadius: "14px", border: "none", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "Tajawal, sans-serif", boxShadow: "0 4px 12px rgba(34,197,94,0.3)" }}>
          {lang === "ar" ? "عرض المتاجر" : "View Stores"}
        </button>
      </div>
    </div>
  );
}

export default ProductPage;