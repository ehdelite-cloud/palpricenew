import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import NotificationBell from "./NotificationBell";

function Header({ search, setSearch, lang, setLang, user, onLogout, notifications = [], setNotifications }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [suggestions, setSuggestions] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (!user?.token) return;
    function fetchUnread() {
      fetch("http://localhost:3000/users/notifications/unread-count", {
        headers: { Authorization: `Bearer ${user.token}` }
      }).then(r => r.json()).then(d => { if (d.count !== undefined) setUnreadCount(d.count); }).catch(() => {});
    }
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user?.token]);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 12); }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (search.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(() => {
      fetch(`http://localhost:3000/products/search?q=${search}`)
        .then(r => r.json())
        .then(data => Array.isArray(data) && setSuggestions(data.slice(0, 6)));
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    function handleOut(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSuggestions([]);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    }
    document.addEventListener("mousedown", handleOut);
    return () => document.removeEventListener("mousedown", handleOut);
  }, []);

  function handleSearch(e) {
    if (e.key === "Enter" && search.trim()) { navigate(`/search?q=${search}`); setSuggestions([]); }
  }
  function handleSelect(product) { setSearch(""); setSuggestions([]); navigate(`/product/${product.id}`); }
  function handleLogout() { setShowUserMenu(false); onLogout?.(); navigate("/"); }
  function isActive(path) {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  }

  const avatarSrc = user?.avatar ? (user.avatar.startsWith("/") ? `http://localhost:3000${user.avatar}` : user.avatar) : null;

  const NAV = [
    { to: "/", label: lang === "ar" ? "الرئيسية" : "Home" },
    { to: "/deals", label: lang === "ar" ? "أفضل العروض" : "Deals" },
    { to: "/campaigns", label: lang === "ar" ? "📢 الحملات" : "📢 Campaigns" },
    { to: "/price-check", label: lang === "ar" ? "💰 كم دفعت؟" : "💰 Price Check" },
    { to: "/stores", label: lang === "ar" ? "المتاجر" : "Stores" },
    { to: "/compare", label: lang === "ar" ? "المقارنة" : "Compare" },
  ];

  return (
    <header style={{
      background: scrolled ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.95)",
      backdropFilter: "blur(16px)",
      borderBottom: scrolled ? "1px solid #e2e8f0" : "1px solid transparent",
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
      transition: "all 0.25s ease",
    }}>
      <div className="header-inner" style={{
        maxWidth: "1240px", margin: "auto",
        display: "flex", alignItems: "center",
        gap: "16px", padding: "12px 24px"
      }}>

        {/* Logo */}
        <Link to="/" style={{
          fontSize: "22px", fontWeight: "900", color: "#16a34a", textDecoration: "none",
          flexShrink: 0, letterSpacing: "-0.5px", fontFamily: "Cairo, Tajawal, sans-serif",
          display: "flex", alignItems: "center", gap: "6px"
        }}>
          <span style={{
            background: "linear-gradient(135deg, #16a34a, #22c55e)", borderRadius: "8px",
            width: "28px", height: "28px", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "14px", color: "white", flexShrink: 0
          }}>₪</span>
          PalPrice
        </Link>

        {/* Nav — مخفي على الموبايل */}
        <nav className="nav" style={{ display: "flex", gap: "2px", flexShrink: 0 }}>
          {NAV.map(item => (
            <Link key={item.to} to={item.to} style={{
              textDecoration: "none",
              color: isActive(item.to) ? "#16a34a" : "#475569",
              fontWeight: isActive(item.to) ? "700" : "500",
              fontSize: "13px", padding: "6px 10px", borderRadius: "8px",
              background: isActive(item.to) ? "#f0fdf4" : "transparent",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { if (!isActive(item.to)) e.currentTarget.style.background = "#f8fafc"; }}
              onMouseLeave={e => { if (!isActive(item.to)) e.currentTarget.style.background = "transparent"; }}
            >{item.label}</Link>
          ))}
        </nav>

        {/* Search */}
        <div ref={searchRef} className="header-search-wrap" style={{ position: "relative", flex: 1 }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <span style={{ position: "absolute", right: "12px", color: "#94a3b8", fontSize: "14px", pointerEvents: "none" }}>🔍</span>
            <input type="text"
              placeholder={lang === "ar" ? "ابحث عن منتج..." : "Search products..."}
              value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearch}
              style={{
                width: "100%", padding: "9px 38px 9px 16px", borderRadius: "12px",
                border: "1.5px solid #e2e8f0", fontSize: "13px", outline: "none",
                background: "#f8fafc", fontFamily: "Tajawal, sans-serif", color: "#0f172a", transition: "all 0.2s",
              }}
              onFocus={e => { e.target.style.borderColor = "#22c55e"; e.target.style.background = "white"; e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {suggestions.length > 0 && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
              background: "white", border: "1px solid #e2e8f0", borderRadius: "14px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.12)", zIndex: 200, overflow: "hidden"
            }}>
              {suggestions.map((p, i) => (
                <div key={p.id} onClick={() => handleSelect(p)}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", cursor: "pointer", borderBottom: i < suggestions.length - 1 ? "1px solid #f8fafc" : "none", transition: "background 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                    {p.image ? <img src={p.image.startsWith("/") ? `http://localhost:3000${p.image}` : p.image} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} /> : <span style={{ fontSize: "16px" }}>📦</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                    {p.brand && <p style={{ fontSize: "11px", color: "#94a3b8", margin: "1px 0 0" }}>{p.brand}</p>}
                  </div>
                  {p.best_price && <span style={{ fontSize: "13px", fontWeight: "800", color: "#16a34a", flexShrink: 0 }}>{Number(p.best_price).toLocaleString()} ₪</span>}
                </div>
              ))}
              <div onClick={() => { navigate(`/search?q=${search}`); setSuggestions([]); }}
                style={{ padding: "10px 14px", textAlign: "center", color: "#16a34a", fontSize: "12px", fontWeight: "700", cursor: "pointer", background: "#f0fdf4", borderTop: "1px solid #dcfce7" }}
                onMouseEnter={e => e.currentTarget.style.background = "#dcfce7"}
                onMouseLeave={e => e.currentTarget.style.background = "#f0fdf4"}>
                🔍 {lang === "ar" ? `عرض كل نتائج "${search}"` : `See all for "${search}"`}
              </div>
            </div>
          )}
        </div>

        {/* Right actions — مخفية على الموبايل */}
        <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          {[
            { to: user ? "/favorites" : "/login", icon: "❤️", tip: lang === "ar" ? "المفضلة" : "Favorites" },
            { to: "/compare", icon: "⚖️", tip: lang === "ar" ? "المقارنة" : "Compare" },
          ].map(btn => (
            <Link key={btn.to} to={btn.to} title={btn.tip} style={{
              width: "36px", height: "36px", borderRadius: "10px", border: "1.5px solid #e2e8f0",
              background: "white", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", textDecoration: "none", transition: "all 0.15s"
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.background = "#f0fdf4"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "white"; }}>
              {btn.icon}
            </Link>
          ))}

          {user && (
            <div style={{ position: "relative" }}>
              <NotificationBell mode="user" token={user.token} lang={lang} dropdownSide="right" notifications={notifications} setNotifications={setNotifications} />
            </div>
          )}

          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} style={{
            padding: "6px 12px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "white",
            color: "#475569", cursor: "pointer", fontSize: "12px", fontWeight: "600", fontFamily: "Tajawal, sans-serif", transition: "all 0.15s"
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.color = "#16a34a"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569"; }}>
            {lang === "ar" ? "EN" : "ع"}
          </button>

          {user ? (
            <div ref={userMenuRef} style={{ position: "relative" }}>
              <button onClick={() => setShowUserMenu(p => !p)} style={{
                display: "flex", alignItems: "center", gap: "7px", padding: "5px 10px 5px 5px",
                borderRadius: "99px", border: `1.5px solid ${showUserMenu ? "#22c55e" : "#e2e8f0"}`,
                background: showUserMenu ? "#f0fdf4" : "white", cursor: "pointer", transition: "all 0.2s", fontFamily: "Tajawal, sans-serif"
              }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#dcfce7", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {avatarSrc ? <img src={avatarSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : <span style={{ fontSize: "13px" }}>👤</span>}
                  </div>
                  {unreadCount > 0 && <span style={{ position: "absolute", top: "-3px", right: "-3px", width: "14px", height: "14px", background: "#ef4444", borderRadius: "50%", fontSize: "8px", fontWeight: "700", color: "white", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white" }}>{unreadCount > 9 ? "9+" : unreadCount}</span>}
                </div>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", maxWidth: "70px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</span>
                <span style={{ fontSize: "9px", color: "#94a3b8", transition: "transform 0.2s", transform: showUserMenu ? "rotate(180deg)" : "none" }}>▼</span>
              </button>

              {showUserMenu && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, width: "220px", background: "white", border: "1px solid #e2e8f0", borderRadius: "14px", boxShadow: "0 12px 40px rgba(0,0,0,0.12)", zIndex: 200, overflow: "hidden" }}>
                  <div style={{ padding: "14px 16px", background: "linear-gradient(135deg, #f0fdf4, #f8fafc)", borderBottom: "1px solid #f1f5f9" }}>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{user.name}</p>
                    <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#64748b" }}>{lang === "ar" ? "حساب مستخدم" : "User Account"}</p>
                  </div>
                  {[
                    { to: "/profile", icon: "👤", label: lang === "ar" ? "بروفايلي" : "My Profile" },
                    { to: "/profile?tab=alerts", icon: "🔔", label: lang === "ar" ? `الإشعارات${unreadCount > 0 ? ` (${unreadCount})` : ""}` : `Alerts`, highlight: unreadCount > 0 },
                    { to: "/favorites", icon: "❤️", label: lang === "ar" ? "المفضلة" : "Favorites" },
                    { to: "/compare", icon: "⚖️", label: lang === "ar" ? "المقارنة" : "Compare" },
                    { to: "/recently-viewed", icon: "👀", label: lang === "ar" ? "شاهدتها مؤخراً" : "Recently Viewed" },
                  ].map((item, i, arr) => (
                    <Link key={i} to={item.to} onClick={() => { setShowUserMenu(false); if (item.highlight) setUnreadCount(0); }}
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", textDecoration: "none", color: item.highlight ? "#16a34a" : "#0f172a", fontSize: "13px", borderBottom: i < arr.length - 1 ? "1px solid #f8fafc" : "none", background: item.highlight ? "#f0fdf4" : "white", transition: "background 0.12s", fontWeight: item.highlight ? "700" : "500" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={e => e.currentTarget.style.background = item.highlight ? "#f0fdf4" : "white"}>
                      <span style={{ fontSize: "15px" }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <div style={{ borderTop: "1px solid #f1f5f9" }}>
                    <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", background: "none", border: "none", color: "#ef4444", fontSize: "13px", cursor: "pointer", fontFamily: "Tajawal, sans-serif", textAlign: "right", fontWeight: "600" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}>
                      <span>🚪</span> {lang === "ar" ? "تسجيل الخروج" : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "6px" }}>
              <Link to="/login" style={{ padding: "7px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", color: "#475569", textDecoration: "none", fontSize: "13px", fontWeight: "600", background: "white", transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#94a3b8"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}>
                {lang === "ar" ? "دخول" : "Login"}
              </Link>
              <Link to="/register" style={{ padding: "7px 14px", borderRadius: "10px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", textDecoration: "none", fontSize: "13px", fontWeight: "700", boxShadow: "0 2px 8px rgba(34,197,94,0.25)", transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                {lang === "ar" ? "تسجيل" : "Register"}
              </Link>
              <Link to="/store/login" style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", textDecoration: "none", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.background = "#f0fdf4"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "white"; }}>
                🏪
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger — يظهر على الموبايل فقط */}
        <button onClick={() => setMobileMenuOpen(p => !p)}
          className="hamburger-btn"
          style={{ display: "none", width: "38px", height: "38px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: mobileMenuOpen ? "#f0fdf4" : "white", fontSize: "20px", cursor: "pointer", flexShrink: 0, alignItems: "center", justifyContent: "center", color: mobileMenuOpen ? "#16a34a" : "#475569", transition: "all 0.2s" }}>
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{ background: "white", borderTop: "1px solid #e2e8f0", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", padding: "8px 0 16px", position: "absolute", top: "100%", left: 0, right: 0, zIndex: 99 }}>
          {NAV.map(item => (
            <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)}
              style={{ display: "flex", alignItems: "center", padding: "12px 24px", textDecoration: "none", fontSize: "15px", fontWeight: isActive(item.to) ? "700" : "500", color: isActive(item.to) ? "#16a34a" : "#0f172a", background: isActive(item.to) ? "#f0fdf4" : "transparent", borderRight: isActive(item.to) ? "3px solid #16a34a" : "3px solid transparent", transition: "all 0.15s" }}>
              {item.label}
            </Link>
          ))}
          <div style={{ borderTop: "1px solid #f1f5f9", margin: "8px 0", paddingTop: "8px" }}>
            {!user ? (
              <div style={{ display: "flex", gap: "8px", padding: "8px 24px" }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: "10px", border: "1.5px solid #e2e8f0", textDecoration: "none", fontSize: "14px", fontWeight: "600", color: "#475569" }}>دخول</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: "10px", background: "linear-gradient(135deg, #22c55e, #16a34a)", textDecoration: "none", fontSize: "14px", fontWeight: "700", color: "white" }}>تسجيل</Link>
              </div>
            ) : (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 24px", textDecoration: "none", fontSize: "14px", fontWeight: "500", color: "#0f172a" }}>👤 بروفايلي</Link>
                <Link to="/favorites" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 24px", textDecoration: "none", fontSize: "14px", fontWeight: "500", color: "#0f172a" }}>❤️ المفضلة</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;