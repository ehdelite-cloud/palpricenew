import { Link } from "react-router-dom";

function fixImg(url) {
  if (!url) return "";
  return url.startsWith("/") ? `/api${url}` : url;
}

function ProductCard({ product, lang = "ar", dark = false }) {
  const displayName = product.variant_label || product.name;
  const price       = product.best_price ? Number(product.best_price) : null;

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div style={{
        background:   dark ? "#1e293b" : "white",
        border:       `1.5px solid ${dark ? "#334155" : "#e2e8f0"}`,
        borderRadius: "16px",
        overflow:     "hidden",
        transition:   "all 0.22s cubic-bezier(.4,0,.2,1)",
        cursor:       "pointer",
        display:      "flex",
        flexDirection:"column",
        position:     "relative",
        /* ← توحيد الارتفاع — كل الكروت بنفس الطول */
        height:       "100%",
        minHeight:    "280px",
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform   = "translateY(-6px)";
          e.currentTarget.style.boxShadow   = dark ? "0 16px 40px rgba(0,0,0,0.4)" : "0 16px 40px rgba(34,197,94,0.15)";
          e.currentTarget.style.borderColor = "#4ade80";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform   = "translateY(0)";
          e.currentTarget.style.boxShadow   = "none";
          e.currentTarget.style.borderColor = dark ? "#334155" : "#e2e8f0";
        }}>

        {/* BADGE */}
        {product.badge && (
          <div style={{
            position: "absolute", top: "10px", right: "10px", zIndex: 2,
            padding: "3px 10px", borderRadius: "999px",
            fontSize: "10px", fontWeight: "800", color: "white",
            background:
              product.badge === "trending" ? "linear-gradient(135deg,#f97316,#dc2626)" :
              product.badge === "drop"     ? "linear-gradient(135deg,#7c3aed,#4f46e5)" :
                                             "linear-gradient(135deg,#15803d,#4ade80)",
          }}>
            {product.badge === "trending" && "🔥 رائج"}
            {product.badge === "deal"     && "💰 أفضل سعر"}
            {product.badge === "drop"     && "📉 انخفاض"}
          </div>
        )}

        {/* IMAGE — نسبة ثابتة */}
        <div style={{
          background:     dark ? "#0f172a" : "linear-gradient(145deg,#f8fafc,#f1f5f9)",
          padding:        "20px",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          aspectRatio:    "1",
          overflow:       "hidden",
          flexShrink:     0,
        }}>
          {product.image ? (
            <img
              src={fixImg(product.image)}
              alt={displayName}
              loading="lazy"
              style={{ width: "110px", height: "110px", objectFit: "contain", transition: "transform 0.3s" }}
              onMouseEnter={e => e.target.style.transform = "scale(1.08)"}
              onMouseLeave={e => e.target.style.transform = "scale(1)"}
              onError={e => e.target.style.display = "none"}
            />
          ) : (
            <span style={{ fontSize: "40px", opacity: 0.3 }}>📦</span>
          )}
        </div>

        {/* BODY */}
        <div style={{ padding: "14px 14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>

          {product.brand && (
            <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", margin: 0 }}>
              {product.brand}
            </p>
          )}

          {/* اسم المنتج — ارتفاع ثابت بـ line-clamp */}
          <h3 style={{
            fontSize: "13px", fontWeight: "700", margin: 0,
            color: dark ? "#f1f5f9" : "#0f172a",
            lineHeight: 1.45,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
            flex: 1,
            minHeight: "38px", /* ← يضمن نفس الارتفاع حتى لو الاسم قصير */
          }}>
            {displayName}
          </h3>

          {/* Variant chips */}
          {(product.variant_storage || product.variant_color) && (
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {product.variant_storage && (
                <span style={{ background: dark ? "#334155" : "#f1f5f9", color: dark ? "#94a3b8" : "#475569", fontSize: "10px", fontWeight: "600", padding: "2px 7px", borderRadius: "4px" }}>
                  {product.variant_storage}
                </span>
              )}
              {product.variant_color && (
                <span style={{ background: dark ? "#334155" : "#f1f5f9", color: dark ? "#94a3b8" : "#475569", fontSize: "10px", fontWeight: "600", padding: "2px 7px", borderRadius: "4px" }}>
                  {product.variant_color}
                </span>
              )}
            </div>
          )}

          {/* FOOTER */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "8px" }}>
            <div>
              <p style={{ fontSize: "10px", color: "#94a3b8", margin: "0 0 2px", fontWeight: "500" }}>
                {lang === "ar" ? "أفضل سعر" : "Best Price"}
              </p>
              <p style={{ fontSize: "17px", fontWeight: "900", color: "#15803d", margin: 0, fontFamily: "Cairo, sans-serif" }}>
                {price ? `${price.toLocaleString()} ₪` : "—"}
              </p>
            </div>
            <span style={{
              padding: "7px 14px", borderRadius: "10px",
              background: "linear-gradient(135deg,#15803d,#4ade80)",
              color: "white", fontSize: "12px", fontWeight: "700",
              boxShadow: "0 4px 12px rgba(21,128,61,0.3)",
            }}>
              {lang === "ar" ? "عرض" : "View"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;