import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const menuItems = [
  { path: "/store/dashboard",             label: "لوحة التحكم",      labelEn: "Dashboard",   icon: "📊", exact: true },
  { path: "/store/dashboard/products",    label: "منتجاتي",           labelEn: "My Products", icon: "📦" },
  { path: "/store/dashboard/add-product", label: "إضافة منتج",       labelEn: "Add Product", icon: "➕" },
  { path: "/store/dashboard/smart-add",   label: "إضافة ذكية 🤖",    labelEn: "Smart Add",   icon: "✨" },
  { path: "/store/dashboard/bulk-upload", label: "رفع بالجملة",      labelEn: "Bulk Upload", icon: "📊" },
  { path: "/store/dashboard/analytics",   label: "الإحصائيات",       labelEn: "Analytics",   icon: "📈" },
  { path: "/store/dashboard/coupons",     label: "الكوبونات",         labelEn: "Coupons",     icon: "🎟️" },
  { path: "/store/dashboard/campaigns",   label: "الحملات الإعلانية", labelEn: "Campaigns",   icon: "📢" },
  { path: "/store/dashboard/competition", label: "المنافسة",          labelEn: "Competition", icon: "⚡" },
  { path: "/store/dashboard/tickets",     label: "الدعم والمراسلات", labelEn: "Support",     icon: "🎫" },
  { path: "/store/dashboard/profile",     label: "الملف الشخصي",     labelEn: "Profile",     icon: "🏪" },
];

function DashboardSidebar({ lang = "ar" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [storeName, setStoreName]   = useState("");
  const [storeLogo, setStoreLogo]   = useState(null);
  const [showMenu, setShowMenu]     = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // token التاجر — نقرأه دايناميكياً مش مرة وحدة
  const [storeToken, setStoreToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    // نتأكد إن الـ token محدّث
    const t = localStorage.getItem("token");
    if (t) setStoreToken(t);
  }, [location.pathname]);

  useEffect(() => {
    const storeId = localStorage.getItem("storeId");
    if (!storeId) return;

    fetch(`/api/stores/${storeId}`)
      .then(r => r.json())
      .then(data => {
        if (data?.name) setStoreName(data.name);
        if (data?.logo) setStoreLogo(data.logo);
      })
      .catch(() => {
        const cached = localStorage.getItem("storeName");
        const cachedLogo = localStorage.getItem("storeLogo");
        if (cached) setStoreName(cached);
        if (cachedLogo) setStoreLogo(cachedLogo);
      });

    fetch(`/api/stores/${storeId}/products`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setPendingCount(data.filter(p => p.status === "pending").length);
      }).catch(() => {});
  }, [location.pathname]);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowMenu(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    ["token", "storeId", "storeName", "storeLogo"].forEach(k => localStorage.removeItem(k));
    navigate("/store/login");
  }

  function isActive(item) {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  }

  const logoSrc = storeLogo
    ? (storeLogo.startsWith("/") ? `/api${storeLogo}` : storeLogo)
    : null;

  return (
    <aside style={{
      width: "240px",
      minHeight: "100vh",
      background: "#0f172a",
      display: "flex",
      flexDirection: "column",
      position: "sticky",
      top: 0,
      flexShrink: 0,
      /* مهم — يسمح للـ dropdown بالظهور خارج الـ aside */
      overflow: "visible",
      zIndex: 50,
    }}>

      {/* الجزء العلوي */}
      <div style={{ padding: "16px", borderBottom: "1px solid #1e293b", overflow: "visible" }}>

        {/* شعار + جرس الإشعارات */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          position: "relative",  /* مهم للـ dropdown */
        }}>
          <Link to="/" style={{ fontSize: "18px", fontWeight: "800", color: "#22c55e", textDecoration: "none" }}>
            PalPrice
          </Link>

          {/* الجرس — الـ dropdown بيظهر للأسفل داخل الصفحة */}
          <div style={{ position: "relative", zIndex: 200 }}>
            <NotificationBell
              mode="store"
              token={storeToken}
              lang={lang}
              dropdownSide="right"
            />
          </div>
        </div>

        {/* زر المتجر مع القائمة */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowMenu(p => !p)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "10px",
              padding: "8px 10px", borderRadius: "10px",
              border: "1px solid #1e293b",
              background: showMenu ? "#1e293b" : "transparent",
              cursor: "pointer", transition: "all 0.2s",
              fontFamily: "Tajawal, sans-serif"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#1e293b"}
            onMouseLeave={e => { if (!showMenu) e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{
              width: "36px", height: "36px", borderRadius: "8px",
              background: "#1e293b", border: "1px solid #334155",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", flexShrink: 0
            }}>
              {logoSrc ? (
                <img src={logoSrc} alt="logo"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { e.target.style.display = "none"; }} />
              ) : (
                <span style={{ fontSize: "18px" }}>🏪</span>
              )}
            </div>

            <div style={{ flex: 1, textAlign: "right", overflow: "hidden" }}>
              <p style={{ color: "white", fontSize: "13px", fontWeight: "600", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {storeName || (lang === "ar" ? "متجري" : "My Store")}
              </p>
              <p style={{ color: "#475569", fontSize: "11px", margin: 0 }}>
                {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
              </p>
            </div>

            <span style={{ color: "#475569", fontSize: "10px", transition: "transform 0.2s", transform: showMenu ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
          </button>

          {/* القائمة المنسدلة */}
          {showMenu && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
              background: "#1e293b", borderRadius: "10px",
              border: "1px solid #334155",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              zIndex: 300, overflow: "hidden"
            }}>
              {[
                { to: "/store/dashboard/profile", icon: "🏪", label: lang === "ar" ? "إعدادات المتجر" : "Store Settings" },
                { to: "/", icon: "🌐", label: lang === "ar" ? "عرض الموقع" : "View Site" },
              ].map(item => (
                <Link key={item.to} to={item.to} onClick={() => setShowMenu(false)}
                  style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", textDecoration: "none", color: "#94a3b8", fontSize: "13px", borderBottom: "1px solid #0f172a" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#0f172a"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span>{item.icon}</span> {item.label}
                </Link>
              ))}
              <button onClick={handleLogout}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", background: "none", border: "none", color: "#ef4444", fontSize: "13px", cursor: "pointer", fontFamily: "Tajawal, sans-serif", textAlign: "right" }}
                onMouseEnter={e => e.currentTarget.style.background = "#0f172a"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span>🚪</span> {lang === "ar" ? "تسجيل الخروج" : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* القائمة الرئيسية */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {menuItems.map(item => (
          <Link key={item.path} to={item.path}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 12px", borderRadius: "8px", marginBottom: "2px",
              textDecoration: "none", fontSize: "13px",
              fontWeight: isActive(item) ? "600" : "400",
              background: isActive(item) ? "#22c55e18" : "transparent",
              color: isActive(item) ? "#22c55e" : "#64748b",
              borderRight: isActive(item) ? "3px solid #22c55e" : "3px solid transparent",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (!isActive(item)) e.currentTarget.style.background = "#1e293b"; }}
            onMouseLeave={e => { if (!isActive(item)) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: "15px" }}>{item.icon}</span>
            {lang === "ar" ? item.label : item.labelEn}

            {item.path === "/store/dashboard/products" && pendingCount > 0 && (
              <span style={{ marginRight: "auto", background: "#f59e0b", color: "white", borderRadius: "99px", fontSize: "10px", fontWeight: "700", padding: "1px 6px" }}>
                {pendingCount}
              </span>
            )}
          </Link>
        ))}
      </nav>

    </aside>
  );
}

export default DashboardSidebar;