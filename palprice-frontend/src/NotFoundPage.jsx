import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage({ lang = "ar" }) {
  const navigate = useNavigate();

  const QUICK_LINKS = [
    { to: "/",         icon: "🏠", label: lang === "ar" ? "الرئيسية"      : "Home"      },
    { to: "/search",   icon: "🔍", label: lang === "ar" ? "البحث"          : "Search"    },
    { to: "/deals",    icon: "🔥", label: lang === "ar" ? "أفضل العروض"   : "Deals"     },
    { to: "/compare",  icon: "⚖️", label: lang === "ar" ? "مقارنة المنتجات" : "Compare" },
    { to: "/stores",   icon: "🏪", label: lang === "ar" ? "المتاجر"        : "Stores"    },
    { to: "/favorites",icon: "❤️", label: lang === "ar" ? "المفضلة"        : "Favorites" },
  ];

  return (
    <div style={{
      minHeight: "70vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      fontFamily: "Tajawal, sans-serif",
      direction: "rtl",
      background: "#f8fafc",
    }}>
      <div style={{ textAlign: "center", maxWidth: "560px", width: "100%" }}>

        {/* رقم 404 */}
        <div style={{
          fontSize: "clamp(80px, 18vw, 140px)",
          fontWeight: "900",
          fontFamily: "Cairo, sans-serif",
          lineHeight: 1,
          marginBottom: "8px",
          background: "linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 4px 24px rgba(34,197,94,0.2))",
        }}>
          404
        </div>

        {/* أيقونة */}
        <div style={{ fontSize: "52px", marginBottom: "20px" }}>🔍</div>

        {/* عنوان */}
        <h1 style={{
          fontSize: "clamp(20px, 3vw, 28px)",
          fontWeight: "800",
          color: "#0f172a",
          margin: "0 0 12px",
          fontFamily: "Cairo, Tajawal, sans-serif",
        }}>
          {lang === "ar" ? "عذراً، الصفحة غير موجودة!" : "Page Not Found!"}
        </h1>

        {/* وصف */}
        <p style={{
          color: "#64748b",
          fontSize: "15px",
          lineHeight: 1.7,
          margin: "0 0 32px",
        }}>
          {lang === "ar"
            ? "الصفحة التي تبحث عنها ربما نُقلت أو حُذفت أو أن الرابط غير صحيح."
            : "The page you're looking for may have been moved, deleted, or the link is incorrect."}
        </p>

        {/* أزرار رئيسية */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "36px", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "12px 24px",
              background: "white",
              border: "1.5px solid #e2e8f0",
              borderRadius: "12px",
              color: "#475569",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "Tajawal, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.color = "#15803d"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569"; }}
          >
            ← {lang === "ar" ? "الرجوع" : "Go Back"}
          </button>

          <Link
            to="/"
            style={{
              padding: "12px 28px",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "white",
              borderRadius: "12px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(34,197,94,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(34,197,94,0.3)"; }}
          >
            🏠 {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>
        </div>

        {/* فاصل */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>
            {lang === "ar" ? "أو انتقل إلى" : "Or navigate to"}
          </span>
          <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
        </div>

        {/* روابط سريعة */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}>
          {QUICK_LINKS.map((link, i) => (
            <Link
              key={i}
              to={link.to}
              style={{
                textDecoration: "none",
                padding: "12px 8px",
                background: "white",
                border: "1.5px solid #e2e8f0",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
                color: "#475569",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#22c55e";
                e.currentTarget.style.background = "#f0fdf4";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(34,197,94,0.12)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.background = "white";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={{ fontSize: "22px" }}>{link.icon}</span>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#475569", fontFamily: "Tajawal, sans-serif" }}>
                {link.label}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}