import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

function fixImg(url) {
  if (!url) return "";
  return url.startsWith("/") ? `/api${url}` : url;
}

/* ── مكوّن فارغ ── */
function Empty({ icon, title, link, linkLabel }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
      <div style={{ fontSize: "48px", marginBottom: "12px" }}>{icon}</div>
      <p style={{ fontSize: "16px", fontWeight: "600", color: "#64748b", marginBottom: "16px" }}>{title}</p>
      {link && <Link to={link} style={{ padding: "10px 24px", background: "#22c55e", color: "white", borderRadius: "10px", textDecoration: "none", fontSize: "14px", fontWeight: "700" }}>{linkLabel}</Link>}
    </div>
  );
}

function UserProfile({ lang = "ar", user: userProp, onLogout, onUpdate }) {
  const navigate = useNavigate();
  const avatarRef = useRef(null);

  const [user,           setUser]           = useState(null);
  const [favorites,      setFavorites]      = useState([]);
  const [viewed,         setViewed]         = useState([]);
  const [comparisons,    setComparisons]    = useState([]);
  const [priceAlerts,    setPriceAlerts]    = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [activeTab,      setActiveTab]      = useState("favorites");
  const [form,           setForm]           = useState({ name: "", email: "" });
  const [saving,         setSaving]         = useState(false);
  const [saved,          setSaved]          = useState(false);
  const [uploadingAvatar,setUploadingAvatar]= useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deletingAlert, setDeletingAlert] = useState(null);

  const token = userProp?.token || localStorage.getItem("userToken");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    loadAll();
  }, [token]);

  async function loadAll() {
    const h = { Authorization: `Bearer ${token}` };
    try {
      const [pR, fR, vR, cR, aR] = await Promise.all([
        fetch("/api/users/profile",     { headers: h }),
        fetch("/api/users/favorites",   { headers: h }),
        fetch("/api/users/viewed",      { headers: h }),
        fetch("/api/users/comparisons", { headers: h }),
        fetch("/api/users/price-alerts",{ headers: h }),
      ]);
      const profile = await pR.json();
      const favs    = await fR.json();
      const viewedD = await vR.json();
      const comps   = await cR.json();
      const alerts  = await aR.json();
      setUser(profile);
      setForm({ name: profile.name || "", email: profile.email || "" });
      setFavorites(  Array.isArray(favs)    ? favs    : []);
      setViewed(     Array.isArray(viewedD) ? viewedD : []);
      setComparisons(Array.isArray(comps)   ? comps   : []);
      setPriceAlerts(Array.isArray(alerts)  ? alerts  : []);
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
    setLoading(false);
  }

  async function removeAlert(id) {
  setDeletingAlert(id);
  await fetch(`/api/users/price-alerts/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
  setPriceAlerts(p => p.filter(x => x.id !== id));
  setDeletingAlert(null);
}

  async function handleSave() {
    setSaving(true);
    const res  = await fetch("/api/users/profile", { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setUser(data.user); localStorage.setItem("userName", data.user.name); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setSaving(false);
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files[0]; if (!file) return;
    setUploadingAvatar(true);
    const fd = new FormData(); fd.append("avatar", file);
    const res  = await fetch("/api/users/avatar", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
    const data = await res.json();
    if (res.ok) { setUser(p => ({ ...p, avatar: data.avatar })); localStorage.setItem("userAvatar", data.avatar); }
    setUploadingAvatar(false);
  }

  async function removeFavorite(id) {
    await fetch(`/api/users/favorites/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setFavorites(p => p.filter(x => x.id !== id));
  }

  async function clearViewed() {
    await fetch("/api/users/viewed/clear", { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    setViewed([]); localStorage.removeItem("recent");
  }

  async function removeComparison(id) {
    await fetch(`/api/users/comparisons/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    setComparisons(p => p.filter(x => x.id !== id));
  }

  async function clearComparisons() {
    await fetch("/api/users/comparisons/clear", { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    setComparisons([]);
  }

  function handleLogout() {
    ["userToken","userId","userName","userAvatar","compare","compare_category"].forEach(k => localStorage.removeItem(k));
    sessionStorage.removeItem("last_comparison");
    onLogout?.(); navigate("/");
  }

  const TABS = [
    { key: "favorites",   icon: "❤️",  label: lang === "ar" ? "المفضلة"        : "Favorites",    count: favorites.length   },
    { key: "alerts",      icon: "🔔",  label: lang === "ar" ? "تنبيهات السعر"  : "Price Alerts", count: priceAlerts.length },
    { key: "viewed",      icon: "👀",  label: lang === "ar" ? "شاهدتها مؤخراً" : "Recently Viewed", count: viewed.length   },
    { key: "comparisons", icon: "⚖️",  label: lang === "ar" ? "المقارنات"      : "Comparisons",  count: comparisons.length },
    { key: "settings",    icon: "⚙️",  label: lang === "ar" ? "الإعدادات"      : "Settings"                               },
  ];

  if (loading) return (
    <div style={{ padding: "80px", textAlign: "center", color: "#64748b" }}>
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>⏳</div>
      {lang === "ar" ? "جاري التحميل..." : "Loading..."}
    </div>
  );
  if (!user) return null;

  const avatarSrc = fixImg(user?.avatar);

  /* ════════════════════════════════════════════════
     SIDEBAR ITEM
  ════════════════════════════════════════════════ */
  const SidebarItem = ({ tab }) => {
    const active = activeTab === tab.key;
    return (
      <button onClick={() => { setActiveTab(tab.key); setMobileMenuOpen(false); }}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", borderRadius: "10px", border: "none", background: active ? "#f0fdf4" : "transparent", color: active ? "#16a34a" : "#475569", cursor: "pointer", fontFamily: "Tajawal, sans-serif", fontSize: "14px", fontWeight: active ? "700" : "500", textAlign: "right", transition: "all 0.15s", marginBottom: "2px" }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#f8fafc"; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
        <span style={{ fontSize: "16px", flexShrink: 0 }}>{tab.icon}</span>
        <span style={{ flex: 1 }}>{tab.label}</span>
        {tab.count !== undefined && tab.count > 0 && (
          <span style={{ background: active ? "#22c55e" : "#e2e8f0", color: active ? "white" : "#64748b", borderRadius: "99px", fontSize: "11px", fontWeight: "700", padding: "1px 7px", flexShrink: 0 }}>
            {tab.count}
          </span>
        )}
      </button>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <style>{`
        @media(max-width:768px){
          .profile-sidebar { display: none !important; }
          .profile-sidebar.open { display: flex !important; }
          .profile-mobile-nav { display: flex !important; }
        }
        @media(min-width:769px){
          .profile-mobile-nav { display: none !important; }
          .profile-sidebar { display: flex !important; }
        }
      `}</style>

      {/* ── Header بروفايل ── */}
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #1a2744 100%)" }}>
        <div style={{ maxWidth: "1200px", margin: "auto", padding: "32px 24px 28px", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>

          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div onClick={() => avatarRef.current?.click()}
              style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "3px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#22c55e"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}>
              {avatarSrc ? <img src={avatarSrc} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : <span style={{ fontSize: "32px" }}>👤</span>}
            </div>
            <div onClick={() => avatarRef.current?.click()}
              style={{ position: "absolute", bottom: "0px", right: "0px", width: "24px", height: "24px", borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "11px", boxShadow: "0 2px 8px rgba(34,197,94,0.4)" }}>
              {uploadingAvatar ? "⏳" : "📷"}
            </div>
            <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: "none" }} />
          </div>

          {/* معلومات */}
          <div style={{ flex: 1, minWidth: "180px" }}>
            <h1 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: "900", color: "white", margin: "0 0 4px", fontFamily: "Cairo, Tajawal, sans-serif" }}>{user.name}</h1>
            <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 3px" }}>{user.email}</p>
            <p style={{ color: "#475569", fontSize: "12px", margin: 0 }}>
              {lang === "ar" ? "عضو منذ" : "Member since"} {user.created_at ? new Date(user.created_at).toLocaleDateString("ar-PS") : "—"}
            </p>
          </div>

          {/* إحصاءات */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { icon: "❤️", value: favorites.length,   label: lang === "ar" ? "مفضلة"    : "Saved"    },
              { icon: "👀", value: viewed.length,       label: lang === "ar" ? "شاهدتها"  : "Viewed"   },
              { icon: "⚖️", value: comparisons.length, label: lang === "ar" ? "مقارنات"  : "Compared" },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 16px", textAlign: "center" }}>
                <p style={{ fontSize: "20px", fontWeight: "900", color: "white", margin: 0, fontFamily: "Cairo, sans-serif" }}>{s.value}</p>
                <p style={{ fontSize: "10px", color: "#475569", margin: "2px 0 0" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* خروج */}
          <button onClick={handleLogout}
            style={{ padding: "8px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "Tajawal, sans-serif" }}>
            🚪 {lang === "ar" ? "خروج" : "Logout"}
          </button>
        </div>
      </div>

      {/* ── Mobile Nav (tabs أفقية على الموبايل) ── */}
      <div className="profile-mobile-nav" style={{ overflowX: "auto", scrollbarWidth: "none", background: "white", borderBottom: "1px solid #e2e8f0", padding: "0 16px" }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ flexShrink: 0, padding: "12px 14px", background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab.key ? "#22c55e" : "transparent"}`, color: activeTab === tab.key ? "#22c55e" : "#64748b", fontSize: "12px", fontWeight: activeTab === tab.key ? "700" : "500", cursor: "pointer", fontFamily: "Tajawal, sans-serif", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "5px" }}>
            {tab.icon} {tab.label}
            {tab.count > 0 && <span style={{ background: activeTab === tab.key ? "#22c55e" : "#e2e8f0", color: activeTab === tab.key ? "white" : "#64748b", borderRadius: "99px", fontSize: "10px", padding: "0 5px" }}>{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* ── Main Layout: Sidebar + Content ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 24px 60px", display: "flex", gap: "24px", alignItems: "flex-start" }}>

        {/* ── SIDEBAR (ديسكتوب) ── */}
        <aside className="profile-sidebar" style={{ flexDirection: "column", width: "220px", flexShrink: 0, background: "white", borderRadius: "16px", border: "1.5px solid #e2e8f0", padding: "16px", position: "sticky", top: "80px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px", paddingRight: "4px" }}>
            {lang === "ar" ? "حسابي" : "My Account"}
          </p>
          {TABS.map(tab => <SidebarItem key={tab.key} tab={tab} />)}
          <div style={{ borderTop: "1px solid #f1f5f9", marginTop: "12px", paddingTop: "12px" }}>
            <button onClick={handleLogout}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "10px", border: "none", background: "transparent", color: "#ef4444", cursor: "pointer", fontFamily: "Tajawal, sans-serif", fontSize: "14px", fontWeight: "600", textAlign: "right" }}
              onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              🚪 {lang === "ar" ? "تسجيل الخروج" : "Logout"}
            </button>
          </div>
        </aside>

        {/* ── CONTENT ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ══ المفضلة ══ */}
          {activeTab === "favorites" && (
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>❤️ {lang === "ar" ? "المفضلة" : "Favorites"} <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "500" }}>({favorites.length})</span></h2>
              {favorites.length === 0 ? (
                <Empty icon="💔" title={lang === "ar" ? "لا توجد منتجات في المفضلة" : "No favorites yet"} link="/" linkLabel={lang === "ar" ? "تصفح المنتجات" : "Browse Products"} />
              ) : (
                <div className="products-grid">
                  {favorites.map(p => (
                    <div key={p.id} style={{ background: "white", borderRadius: "14px", border: "1.5px solid #e2e8f0", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                      <Link to={`/product/${p.id}`} style={{ textDecoration: "none", flex: 1 }}>
                        <div style={{ background: "linear-gradient(145deg,#f8fafc,#f1f5f9)", height: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {p.image ? <img src={fixImg(p.image)} alt={p.name} style={{ maxHeight: "120px", maxWidth: "85%", objectFit: "contain" }} onError={e => e.target.style.display="none"} /> : <span style={{ fontSize: "40px" }}>📦</span>}
                        </div>
                        <div style={{ padding: "12px" }}>
                          <p style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{p.name}</p>
                          <p style={{ fontSize: "16px", fontWeight: "900", color: "#16a34a", margin: 0, fontFamily: "Cairo, sans-serif" }}>{p.best_price ? `${Number(p.best_price).toLocaleString()} ₪` : "—"}</p>
                        </div>
                      </Link>
                      <button onClick={() => removeFavorite(p.id)} style={{ width: "100%", padding: "8px", background: "#fef2f2", border: "none", borderTop: "1px solid #fee2e2", color: "#dc2626", cursor: "pointer", fontSize: "12px", fontWeight: "600", fontFamily: "Tajawal, sans-serif" }}>
                        🗑️ {lang === "ar" ? "حذف من المفضلة" : "Remove"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ تنبيهات السعر ══ */}
          {activeTab === "alerts" && (
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>🔔 {lang === "ar" ? "تنبيهات السعر" : "Price Alerts"} <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "500" }}>({priceAlerts.length})</span></h2>
              {priceAlerts.length === 0 ? (
                <Empty icon="🔔" title={lang === "ar" ? "لا توجد تنبيهات" : "No alerts yet"} link="/" linkLabel={lang === "ar" ? "تصفح المنتجات" : "Browse Products"} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {priceAlerts.map((a, i) => (
                    <div key={i} style={{ background: "white", borderRadius: "12px", border: "1.5px solid #e2e8f0", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>🔔</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link to={`/product/${a.product_id}`} style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", textDecoration: "none", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", display: "block" }}>{a.product_name || (lang === "ar" ? "منتج" : "Product")}</Link>
                        <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#64748b" }}>
                          {lang === "ar" ? "السعر المستهدف:" : "Target:"} <strong style={{ color: "#16a34a" }}>{Number(a.target_price).toLocaleString()} ₪</strong>
                          {a.current_price && <span style={{ color: "#94a3b8" }}> · {lang === "ar" ? "الحالي:" : "Now:"} {Number(a.current_price).toLocaleString()} ₪</span>}
                        </p>
                        <button onClick={() => removeAlert(a.id)}
  style={{ padding: "7px 10px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", cursor: "pointer", fontSize: "13px", flexShrink: 0, fontFamily: "Tajawal, sans-serif" }}>
  {deletingAlert === a.id ? "..." : "🗑️"}
</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ شاهدتها مؤخراً ══ */}
          {activeTab === "viewed" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
                <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>👀 {lang === "ar" ? "شاهدتها مؤخراً" : "Recently Viewed"} <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "500" }}>({viewed.length})</span></h2>
                {viewed.length > 0 && (
                  <button onClick={clearViewed} style={{ padding: "6px 14px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600", fontFamily: "Tajawal, sans-serif" }}>
                    🗑️ {lang === "ar" ? "تفريغ الكل" : "Clear All"}
                  </button>
                )}
              </div>
              {viewed.length === 0 ? (
                <Empty icon="👀" title={lang === "ar" ? "لم تشاهد أي منتجات بعد" : "No viewed products yet"} link="/" linkLabel={lang === "ar" ? "تصفح المنتجات" : "Browse Products"} />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "14px" }}>
                  {viewed.map(p => (
                    <Link key={p.id} to={`/product/${p.id}`} style={{ textDecoration: "none" }}>
                      <div style={{ background: "white", borderRadius: "12px", border: "1.5px solid #e2e8f0", overflow: "hidden", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor="#22c55e"; e.currentTarget.style.transform="translateY(-3px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.transform="translateY(0)"; }}>
                        <div style={{ background: "#f8fafc", height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {p.image ? <img src={fixImg(p.image)} alt={p.name} style={{ maxHeight: "80px", maxWidth: "85%", objectFit: "contain" }} onError={e => e.target.style.display="none"} /> : <span style={{ fontSize: "32px" }}>📦</span>}
                        </div>
                        <div style={{ padding: "10px 12px" }}>
                          <p style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", margin: "0 0 3px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{p.name}</p>
                          <p style={{ fontSize: "14px", fontWeight: "900", color: "#16a34a", margin: 0, fontFamily: "Cairo, sans-serif" }}>{p.best_price ? `${Number(p.best_price).toLocaleString()} ₪` : "—"}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ المقارنات ══ */}
          {activeTab === "comparisons" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
                <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>⚖️ {lang === "ar" ? "المقارنات" : "Comparisons"} <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "500" }}>({comparisons.length})</span></h2>
                {comparisons.length > 0 && (
                  <button onClick={clearComparisons} style={{ padding: "6px 14px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600", fontFamily: "Tajawal, sans-serif" }}>
                    🗑️ {lang === "ar" ? "مسح الكل" : "Clear All"}
                  </button>
                )}
              </div>
              {comparisons.length === 0 ? (
                <Empty icon="⚖️" title={lang === "ar" ? "لا توجد مقارنات سابقة" : "No comparisons yet"} link="/compare" linkLabel={lang === "ar" ? "ابدأ مقارنة" : "Compare Now"} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {comparisons.map((comp, i) => (
                    <div key={comp.id} style={{ background: "white", borderRadius: "12px", border: "1.5px solid #e2e8f0", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px", transition: "border-color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor="#22c55e"}
                      onMouseLeave={e => e.currentTarget.style.borderColor="#e2e8f0"}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>⚖️</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>{lang === "ar" ? "مقارنة" : "Comparison"} #{comparisons.length - i}</p>
                        <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#94a3b8" }}>
                          {comp.created_at ? new Date(comp.created_at).toLocaleDateString("ar-PS") : ""} · {comp.product_ids?.length || 0} {lang === "ar" ? "منتجات" : "products"}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                        <Link to="/compare" onClick={() => localStorage.setItem("compare", JSON.stringify(comp.product_ids))}
                          style={{ padding: "7px 14px", background: "#f0fdf4", border: "1px solid #dcfce7", color: "#16a34a", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "700" }}>
                          {lang === "ar" ? "عرض ←" : "View →"}
                        </Link>
                        <button onClick={() => removeComparison(comp.id)}
                          style={{ padding: "7px 10px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "Tajawal, sans-serif" }}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ الإعدادات ══ */}
          {activeTab === "settings" && (
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>⚙️ {lang === "ar" ? "الإعدادات" : "Settings"}</h2>
              <div style={{ background: "white", borderRadius: "16px", border: "1.5px solid #e2e8f0", padding: "24px", maxWidth: "480px" }}>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "16px" }}>{lang === "ar" ? "تعديل المعلومات الشخصية" : "Edit Personal Info"}</p>
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>{lang === "ar" ? "الاسم الكامل" : "Full Name"}</label>
                  <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "14px", fontFamily: "Tajawal, sans-serif", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor="#22c55e"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>{lang === "ar" ? "البريد الإلكتروني" : "Email"}</label>
                  <input value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} type="email"
                    style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "14px", fontFamily: "Tajawal, sans-serif", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor="#22c55e"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
                </div>
                {saved && <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", marginBottom: "14px" }}>✓ {lang === "ar" ? "تم الحفظ بنجاح" : "Saved successfully"}</div>}
                <button onClick={handleSave} disabled={saving}
                  style={{ padding: "11px 24px", background: saving ? "#86efac" : "#22c55e", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: saving ? "not-allowed" : "pointer", fontFamily: "Tajawal, sans-serif" }}>
                  {saving ? (lang === "ar" ? "جاري الحفظ..." : "Saving...") : (lang === "ar" ? "حفظ التغييرات" : "Save Changes")}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default UserProfile;