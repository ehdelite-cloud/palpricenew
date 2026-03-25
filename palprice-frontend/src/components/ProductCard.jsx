import { Link } from "react-router-dom";

function fixImg(url) {
  if (!url) return "";
  return url.startsWith("/") ? `/api${url}` : url;
}

function ProductCard({ product, lang = "ar" }) {
  const displayName = product.variant_label || product.name;

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div className="product-card" style={{ cursor: "pointer" }}>

        {/* BADGE */}
        {product.badge && (
          <div className={`product-badge ${product.badge}`}>
            {product.badge === "trending" && "🔥 رائج"}
            {product.badge === "deal"     && "💰 أفضل سعر"}
            {product.badge === "drop"     && "📉 انخفاض"}
          </div>
        )}

        {/* IMAGE */}
        <div className="product-image-wrap">
          {product.image ? (
            <img
              src={fixImg(product.image)}
              alt={displayName}
              className="product-image"
              loading="lazy"
              onError={e => { e.target.style.display = "none"; }}
            />
          ) : (
            <div className="product-no-image">📦</div>
          )}
        </div>

        {/* BODY */}
        <div className="product-body">
          {product.brand && <p className="product-brand">{product.brand}</p>}

          <h3 className="product-title">{displayName}</h3>

          {/* Variant chips */}
          {(product.variant_storage || product.variant_color || product.variant_edition) && (
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "6px" }}>
              {product.variant_storage && (
                <span style={{ background: "#f1f5f9", color: "#475569", fontSize: "10px", fontWeight: "600", padding: "2px 7px", borderRadius: "4px" }}>
                  {product.variant_storage}
                </span>
              )}
              {product.variant_color && (
                <span style={{ background: "#f1f5f9", color: "#475569", fontSize: "10px", fontWeight: "600", padding: "2px 7px", borderRadius: "4px" }}>
                  {product.variant_color}
                </span>
              )}
              {product.variant_edition && (
                <span style={{ background: "#f0fdf4", color: "#16a34a", fontSize: "10px", fontWeight: "600", padding: "2px 7px", borderRadius: "4px" }}>
                  {product.variant_edition}
                </span>
              )}
            </div>
          )}

          <div className="product-footer">
            <div>
              <p className="product-price-label">
                {lang === "ar" ? "أفضل سعر" : "Best Price"}
              </p>
              <p className="product-price">
                {product.best_price
                  ? `${Number(product.best_price).toLocaleString()} ₪`
                  : (lang === "ar" ? "—" : "—")}
              </p>
            </div>
            <span className="product-btn">
              {lang === "ar" ? "عرض" : "View"}
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}

export default ProductCard;