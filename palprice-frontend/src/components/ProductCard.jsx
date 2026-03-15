import { Link } from "react-router-dom";
import { useState } from "react";

function ProductCard({ product, lang }) {

const [show,setShow] = useState(false);

const openQuickView = () => {
setShow(true);
document.body.style.overflow = "hidden";
};

const closeQuickView = () => {
setShow(false);
document.body.style.overflow = "auto";
};

return (

<>

<div className="card product-card">

{/* BADGE */}

{product.badge && (
<div className={`product-badge ${product.badge}`}>
{product.badge === "trending" && "🔥 Trending"}
{product.badge === "deal" && "💰 Best Deal"}
{product.badge === "drop" && "📉 Price Drop"}
</div>
)}

{/* IMAGE */}

{product.image ? (
<img
src={product.image}
alt={product.name}
className="product-image"
loading="lazy"
/>
) : (
<div className="product-no-image">
No Image
</div>
)}

<h3 className="product-title">
{product.name}
</h3>

<p className="product-price">
{product.best_price
? product.best_price + " ₪"
: (lang === "ar" ? "لا يوجد سعر" : "No price")}
</p>

<Link
to={`/product/${product.id}`}
className="product-button"
>
{lang === "ar" ? "عرض الأسعار" : "View Prices"}
</Link>

<button
className="quick-view-btn"
onClick={openQuickView}
>
{lang === "ar" ? "عرض سريع" : "Quick View"}
</button>

</div>


{/* QUICK VIEW MODAL */}

{show && (

<div className="quick-view-overlay">

<div className="quick-view-card">

<button
className="quick-close"
onClick={closeQuickView}
>
✕
</button>

<img
src={product.image}
alt={product.name}
className="quick-view-image"
/>

<h3>{product.name}</h3>

<p className="product-price">
{product.best_price
? product.best_price + " ₪"
: (lang === "ar" ? "لا يوجد سعر" : "No price")}
</p>

<Link
to={`/product/${product.id}`}
className="product-button"
>
{lang === "ar" ? "عرض التفاصيل" : "View Details"}
</Link>

</div>

</div>

)}

</>

);

}

export default ProductCard;