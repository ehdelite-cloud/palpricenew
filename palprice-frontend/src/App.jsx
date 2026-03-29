import { useState, useCallback, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import ProductPage      from "./ProductPage";
import CategoryPage     from "./CategoryPage";
import StoreRegister    from "./StoreRegister";
import StoreLogin       from "./StoreLogin";
import AdminDashboard   from "./AdminDashboard";
import Home             from "./Home";
import Header           from "./components/Header";
import Footer           from "./components/Footer";
import NotificationBell from "./components/NotificationBell";
import StorePage        from "./StorePage";
import StoresList       from "./StoresList";
import SearchPage       from "./SearchPage";

import StoreDashboard   from "./dashboards/store/StoreDashboard";
import StoreProducts    from "./dashboards/store/StoreProducts";
import AddProduct       from "./dashboards/store/AddProduct";
import StoreProfile     from "./dashboards/store/StoreProfile";
import StoreAnalytics   from "./dashboards/store/StoreAnalytics";
import EditProduct      from "./dashboards/store/EditProduct";
import ProductImages    from "./dashboards/store/ProductImages";
import PriceCompetition from "./dashboards/store/PriceCompetition";
import BulkUpload       from "./dashboards/store/BulkUpload";
import SmartAddProduct  from "./dashboards/store/SmartAddProduct";
import StoreTickets     from "./dashboards/store/StoreTickets";
import StoreCampaigns   from "./dashboards/store/StoreCampaigns";
import StoreCoupons     from "./dashboards/store/StoreCoupons";

import Favorites        from "./Favorites";
import Compare          from "./Compare";
import Deals            from "./Deals";
import UserLogin        from "./UserLogin";
import UserRegister     from "./UserRegister";
import UserProfile      from "./UserProfile";
import RecentlyViewed   from "./RecentlyViewed";
import CampaignsPage    from "./CampaignsPage";
import PriceCheck       from "./PriceCheck";
import AboutPage        from "./AboutPage";
import ContactPage      from "./ContactPage";

import { PrivacyPage, FAQPage, JoinStorePage, HowItWorksPage } from "./StaticPages";

/* ══════════════════════════════════════════════════════
   Helpers
══════════════════════════════════════════════════════ */
function getStoredUser() {
  const token = localStorage.getItem("userToken");
  if (!token) return null;
  return {
    id:     localStorage.getItem("userId"),
    name:   localStorage.getItem("userName"),
    avatar: localStorage.getItem("userAvatar"),
    token,
  };
}

const HIDDEN_LAYOUT_PATHS = [
  "/store/dashboard",
  "/admin",
  "/store/login",
  "/store/register",
];

/* ══════════════════════════════════════════════════════
   Bottom Nav (موبايل)
══════════════════════════════════════════════════════ */
function BottomNav({ lang, user, notifications, setNotifications }) {
  const { pathname: path } = useLocation();
  return (
    <div className="sticky-bottom-bar">
      <a href="/"       className={`bottom-nav-item ${path === "/"       ? "active" : ""}`}><span className="icon">🏠</span><span className="label">{lang === "ar" ? "الرئيسية" : "Home"}</span></a>
      <a href="/search" className={`bottom-nav-item ${path === "/search" ? "active" : ""}`}><span className="icon">🔍</span><span className="label">{lang === "ar" ? "بحث"       : "Search"}</span></a>
      <a href="/deals"  className={`bottom-nav-item ${path === "/deals"  ? "active" : ""}`}><span className="icon">🔥</span><span className="label">{lang === "ar" ? "عروض"      : "Deals"}</span></a>
      {user ? (
        <div className="bottom-nav-item" style={{ position: "relative", cursor: "pointer" }}>
          <NotificationBell mode="user" token={user.token} lang={lang} dropdownSide="top" notifications={notifications} setNotifications={setNotifications} />
          <span className="label">{lang === "ar" ? "إشعارات" : "Alerts"}</span>
        </div>
      ) : (
        <a href="/favorites" className={`bottom-nav-item ${path === "/favorites" ? "active" : ""}`}><span className="icon">❤️</span><span className="label">{lang === "ar" ? "المفضلة" : "Saved"}</span></a>
      )}
      <a href={user ? "/profile" : "/login"} className={`bottom-nav-item ${path === "/profile" || path === "/login" ? "active" : ""}`}>
        <span className="icon">👤</span>
        <span className="label">{lang === "ar" ? (user ? "حسابي" : "دخول") : (user ? "Account" : "Login")}</span>
      </a>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   AppContent
══════════════════════════════════════════════════════ */
function AppContent({ lang, setLang, search, setSearch, user, handleLogin, handleLogout, notifications, setNotifications }) {
  const location   = useLocation();
  const hideLayout = HIDDEN_LAYOUT_PATHS.some(p =>
    location.pathname === p ||
    location.pathname.startsWith(p + "/") ||
    location.pathname.startsWith("/store/dashboard")
  );

  return (
    <>
      <style>{`
        .bottom-nav-item { display:flex; flex-direction:column; align-items:center; justify-content:center; text-decoration:none; color:#94a3b8; gap:4px; flex:1; transition:color 0.2s; }
        .bottom-nav-item .icon { font-size:20px; transition:transform 0.2s; filter:grayscale(100%); opacity:0.7; }
        .bottom-nav-item .label { font-size:10px; font-weight:600; font-family:Tajawal,sans-serif; }
        .bottom-nav-item.active { color:#22c55e; }
        .bottom-nav-item.active .icon { transform:translateY(-2px); filter:grayscale(0%); opacity:1; }
        .sticky-bottom-bar { display:none; position:fixed; bottom:0; left:0; right:0; z-index:1000; background:white; border-top:1px solid #e2e8f0; padding:8px 0 env(safe-area-inset-bottom,8px); box-shadow:0 -4px 20px rgba(0,0,0,0.08); }
        @media(max-width:768px){ .sticky-bottom-bar{display:flex;} body{padding-bottom:74px!important;} }
      `}</style>

      {!hideLayout && (
        <Header search={search} setSearch={setSearch} lang={lang} setLang={setLang}
          user={user} onLogout={handleLogout}
          notifications={notifications} setNotifications={setNotifications} />
      )}

      <Routes>
        {/* ── الرئيسية ── */}
        <Route path="/" element={<Home lang={lang} setLang={setLang} search={search} setSearch={setSearch} user={user} />} />

        {/* ── منتجات وفئات ── */}
        <Route path="/product/:id"  element={<ProductPage  lang={lang} user={user} />} />
        <Route path="/category/:id" element={<CategoryPage lang={lang} />} />
        <Route path="/store/:id"    element={<StorePage    lang={lang} />} />

        {/* ── صفحات رئيسية ── */}
        <Route path="/deals"           element={<Deals          lang={lang} />} />
        <Route path="/search"          element={<SearchPage     lang={lang} />} />
        <Route path="/compare"         element={<Compare        lang={lang} user={user} />} />
        <Route path="/favorites"       element={<Favorites      lang={lang} user={user} />} />
        <Route path="/stores"          element={<StoresList     lang={lang} />} />
        <Route path="/campaigns"       element={<CampaignsPage  lang={lang} />} />
        <Route path="/price-check"     element={<PriceCheck     lang={lang} />} />
        <Route path="/recently-viewed" element={<RecentlyViewed lang={lang} user={user} asPage={true} />} />

        {/* ── حساب المستخدم ── */}
        <Route path="/login"    element={<UserLogin    lang={lang} onLogin={handleLogin} />} />
        <Route path="/register" element={<UserRegister lang={lang} onLogin={handleLogin} />} />
        <Route path="/profile"  element={<UserProfile  lang={lang} user={user} onLogout={handleLogout} onUpdate={handleLogin} />} />

        {/* ── صفحات معلومات ── */}
        <Route path="/about"        element={<AboutPage       lang={lang} />} />
        <Route path="/contact"      element={<ContactPage     lang={lang} />} />
        <Route path="/privacy"      element={<PrivacyPage     lang={lang} />} />
        <Route path="/faq"          element={<FAQPage         lang={lang} />} />
        <Route path="/how-it-works" element={<HowItWorksPage  lang={lang} />} />
        <Route path="/join"         element={<JoinStorePage   lang={lang} />} />

        {/* ── داشبورد المتجر ── */}
        <Route path="/store/register"                     element={<StoreRegister    lang={lang} />} />
        <Route path="/store/login"                        element={<StoreLogin       lang={lang} />} />
        <Route path="/store/:id"         element={<StorePage    lang={lang} />} />
        <Route path="/store/dashboard"                    element={<StoreDashboard   lang={lang} />} />
        <Route path="/store/dashboard/products"           element={<StoreProducts    lang={lang} />} />
        <Route path="/store/dashboard/add-product"        element={<AddProduct       lang={lang} />} />
        <Route path="/store/dashboard/smart-add"          element={<SmartAddProduct  lang={lang} />} />
        <Route path="/store/dashboard/bulk-upload"        element={<BulkUpload       lang={lang} />} />
        <Route path="/store/dashboard/tickets"            element={<StoreTickets     lang={lang} />} />
        <Route path="/store/dashboard/tickets/:ticketId"  element={<StoreTickets     lang={lang} />} />
        <Route path="/store/dashboard/profile"            element={<StoreProfile     lang={lang} />} />
        <Route path="/store/dashboard/analytics"          element={<StoreAnalytics   lang={lang} />} />
        <Route path="/store/dashboard/edit-product/:id"   element={<EditProduct      lang={lang} />} />
        <Route path="/store/dashboard/product-images/:id" element={<ProductImages    lang={lang} />} />
        <Route path="/store/dashboard/competition"        element={<PriceCompetition lang={lang} />} />
        <Route path="/store/dashboard/campaigns"          element={<StoreCampaigns   lang={lang} />} />
        <Route path="/store/dashboard/coupons"            element={<StoreCoupons     lang={lang} />} />

        {/* ── الأدمن ── */}
        <Route path="/admin" element={<AdminDashboard lang={lang} />} />
      </Routes>

      {!hideLayout && <Footer lang={lang} />}
      {!hideLayout && <BottomNav lang={lang} user={user} notifications={notifications} setNotifications={setNotifications} />}
    </>
  );
}

/* ══════════════════════════════════════════════════════
   App Root
══════════════════════════════════════════════════════ */
export default function App() {
  const [lang,          setLang]          = useState("ar");
  const [search,        setSearch]        = useState("");
  const [user,          setUser]          = useState(getStoredUser);
  const [notifications, setNotifications] = useState([]);

  // ── مرجع لتتبع آخر نشاط للـ auto-logout ──
  const lastActivityRef = useRef(Date.now());
  const AUTO_LOGOUT_MS  = 60 * 60 * 1000; // 60 دقيقة

  /* ── 1. التحقق من صلاحية الـ token عند تحميل الصفحة ── */
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;
    fetch("/api/users/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (r.status === 401) {
          ["userToken", "userId", "userName", "userAvatar"].forEach(k => localStorage.removeItem(k));
          setUser(null);
          setNotifications([]);
        }
      })
      .catch(() => {});
  }, []);

  /* ── 2. جلب الإشعارات تلقائياً كل 30 ثانية ── */
  useEffect(() => {
    if (!user?.token) return;
    function fetchNotifs() {
      fetch("/api/users/notifications", { headers: { Authorization: `Bearer ${user.token}` } })
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setNotifications(data); })
        .catch(() => {});
    }
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [user?.token]);

  /* ── 3. Auto-logout بعد 60 دقيقة من عدم النشاط ── */
  useEffect(() => {
    if (!user) return;

    // نحدّث وقت آخر نشاط عند أي تفاعل
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    function resetTimer() { lastActivityRef.current = Date.now(); }
    events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));

    // نفحص كل دقيقة إذا انتهت مدة الخمول
    const checker = setInterval(() => {
      if (Date.now() - lastActivityRef.current >= AUTO_LOGOUT_MS) {
        // logout تلقائي مع رسالة
        ["userToken", "userId", "userName", "userAvatar", "compare", "compare_category", "recent"]
          .forEach(k => localStorage.removeItem(k));
        setUser(null);
        setNotifications([]);
        // رسالة مؤقتة
        window.__autoLogoutMsg = true;
        clearInterval(checker);
      }
    }, 60 * 1000);

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearInterval(checker);
    };
  }, [user]);

  const handleLogin = useCallback((userData) => {
    localStorage.setItem("userToken", userData.token || "");
    localStorage.setItem("userId",    userData.id    || "");
    localStorage.setItem("userName",  userData.name  || "");
    if (userData.avatar) localStorage.setItem("userAvatar", userData.avatar);
    setUser({ id: userData.id, name: userData.name, avatar: userData.avatar, token: userData.token });
    // نمسح بيانات الزائر عند الدخول (فصل عالم الزائر عن المستخدم)
    localStorage.removeItem("recent");
  }, []);

  const handleLogout = useCallback(() => {
    ["userToken", "userId", "userName", "userAvatar", "compare", "compare_category", "recent"]
      .forEach(k => localStorage.removeItem(k));
    sessionStorage.removeItem("last_comparison");
    setUser(null);
    setNotifications([]);
  }, []);

  return (
    <AppContent
      lang={lang}             setLang={setLang}
      search={search}         setSearch={setSearch}
      user={user}
      handleLogin={handleLogin}
      handleLogout={handleLogout}
      notifications={notifications}
      setNotifications={setNotifications}
    />
  );
}