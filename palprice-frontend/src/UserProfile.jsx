import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

function fixImg(url) {
  if (!url) return "";
  return url.startsWith("/") ? `/api${url}` : url;
}

function UserProfile({ lang = "ar", user: userProp, onLogout, onUpdate }) {
  const navigate = useNavigate();
  const [user, setUser]         = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [viewed, setViewed]     = useState([]);
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("favorites");
  const [form, setForm]         = useState({ name: "", email: "" });
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarRef = useRef(null);

  const [priceAlerts, setPriceAlerts] = useState([]);

  const token = userProp?.token || localStorage.getItem("userToken");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    loadAll();
  }, [token]);

  async function loadAll() {
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [profileRes, favRes, viewedRes, compRes, alertsRes] = await Promise.all([
        fetch("/api/users/profile", { headers }),
        fetch("/api/users/favorites", { headers }),
        fetch("/api/users/viewed", { headers }),
        fetch("/api/users/comparisons", { headers }),
        fetch("/api/users/price-alerts", { headers }),
      ]);
      const profile = await profileRes.json();
      const favs    = await favRes.json();
      const viewedD = await viewedRes.json();
      const comps   = await compRes.json();
      const alerts  = await alertsRes.json();
      setUser(profile);
      setForm({ name: profile.name || "", email: profile.email || "" });
      setFavorites(Array.isArray(favs)    ? favs    : []);
      setViewed(Array.isArray(viewedD)    ? viewedD : []);
      setComparisons(Array.isArray(comps) ? comps   : []);
      setPriceAlerts(Array.isArray(alerts) ? alerts  : []);
    } catch { }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/users/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      localStorage.setItem("userName", data.user.name);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await fetch("/api/users/avatar", {
      method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData
    });
    const data = await res.json();
    if (res.ok) { setUser(prev => ({ ...prev, avatar: data.avatar })); localStorage.setItem("userAvatar", data.avatar); }
    setUploadingAvatar(false);
  }

  async function removeFavorite(productId) {
    await fetch(`/api/users/favorites/${productId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setFavorites(prev => prev.filter(p => p.id !== productId));
  }

  function handleLogout() {
    ["userToken","userId","userName","userAvatar","compare","compare_category"].forEach(k => localStorage.removeItem(k));
    sessionStorage.removeItem("last_comparison");
    onLogout?.();
    navigate("/");
  }

  const avatarSrc = fixImg(user?.avatar);

  const TABS = [
    { key: "favorites",   icon: "❤️",  label: lang === "ar" ? "المفضلة"       : "Favorites",    count: favorites.length },
    { key: "alerts",      icon: "🔔",  label: lang === "ar" ? "تنبيهات السعر" : "Price Alerts",  count: priceAlerts.length },
    { key: "viewed",      icon: "👀",  label: lang === "ar" ? "شاهدتها"       : "Viewed",        count: viewed.length },
    { key: "comparisons", icon: "⚖️",  label: lang === "ar" ? "المقارنات"     : "Comparisons",   count: comparisons.length },
    { key: "settings",    icon: "⚙️",  label: lang === "ar" ? "الإعدادات"     : "Settings" },
  ];

  if (loading) return (
    <div style={{ padding: "80px", textAlign: "center", color: "#64748b" }}>
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>⏳</div>
      {lang === "ar" ? "جاري التحميل..." : "Loading..."}
    </div>
  );
  if (!user) return null;

  return (
    <div>

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #1a2744 100%)", paddingBottom: 0 }}>
        <div style={{ maxWidth: "1100px", margin: "auto", padding: "44px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap", paddingBottom: "28px" }}>

            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div onClick={() => avatarRef.current?.click()}
                style={{ width: "96px", height: "96px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "3px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#22c55e"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}>
                {avatarSrc
                  ? <img src={avatarSrc} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
                  : <span style={{ fontSize: "38px" }}>👤</span>}
              </div>
              <div onClick={() => avatarRef.current?.click()}
                style={{ position: "absolute", bottom: "2px", right: "2px", width: "26px", height: "26px", borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "13px", boxShadow: "0 2px 8px rgba(34,197,94,0.4)" }}>
                {uploadingAvatar ? "⏳" : "📷"}
              </div>
              <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: "none" }} />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: "200px" }}>
              <h1 style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: "900", color: "white", margin: "0 0 4px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
                {user.name}
              </h1>
              <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 4px" }}>{user.email}</p>
              <p style={{ color: "#475569", fontSize: "12px", margin: 0 }}>
                {lang === "ar" ? "عضو منذ" : "Member since"} {new Date(user.created_at).toLocaleDateString("ar-PS")}
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {[
                { icon: "❤️", value: favorites.length,   label: lang === "ar" ? "مفضلة" : "Favorites" },
                { icon: "👀", value: viewed.length,       label: lang === "ar" ? "شاهدتها" : "Viewed" },
                { icon: "⚖️", value: comparisons.length, label: lang === "ar" ? "مقارنات" : "Compares" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "12px 18px", textAlign: "center" }}>
                  <p style={{ fontSize: "22px", fontWeight: "900", color: "white", margin: 0, fontFamily: "Cairo, sans-serif" }}>{s.value}</p>
                  <p style={{ fontSize: "11px", color: "#475569", margin: "2px 0 0" }}>{s.label}</p>
                </div>
              ))}
            </div>

            <button onClick={handleLogout} style={{ padding: "9px 18px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "Tajawal, sans-serif" }}>
              🚪 {lang === "ar" ? "خروج" : "Logout"}
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "0", borderTop: "1px solid rgba(255,255,255,0.06)", overflowX: "auto" }}>
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                padding: "13px 18px", background: "none", border: "none",
                borderBottom: activeTab === tab.key ? "2px solid #22c55e" : "2px solid transparent",
                color: activeTab === tab.key ? "#22c55e" : "#64748b",
                fontSize: "13px", fontWeight: activeTab === tab.key ? "700" : "500",
                cursor: "pointer", fontFamily: "Tajawal, sans-serif",
                display: "flex", alignItems: "center", gap: "6px",
                whiteSpace: "nowrap", transition: "all 0.2s"
              }}>
                {tab.icon} {tab.label}
                {tab.count !== undefined && (
                  <span style={{ background: activeTab === tab.key ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.08)", color: activeTab === tab.key ? "#22c55e" : "#475569", borderRadius: "99px", fontSize: "10px", fontWeight: "700", padding: "1px 6px" }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1100px", margin: "auto", padding: "28px 24px 60px" }}>

        {/* FAVORITES */}
        {activeTab === "favorites" && (
          favorites.length === 0 ? (
            <EmptyState icon="💔" title={lang === "ar" ? "لا توجد منتجات في المفضلة" : "No favorites yet"} link="/" linkLabel={lang === "ar" ? "تصفح المنتجات" : "Browse Products"} />
          ) : (
            <div className="products-grid">
              {favorites.map(p => (
                <div key={p.id} style={{ background: "white", borderRadius: "14px", border: "1.5px solid #e2e8f0", overflow: "hidden", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                  <Link to={`/product/${p.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "linear-gradient(145deg, #f8fafc, #f1f5f9)", height: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {p.image ? <img src={fixImg(p.image)} alt={p.name} style={{ maxHeight: "130px", maxWidth: "85%", objectFit: "contain" }} onError={e => e.target.style.display = "none"} />
                        : <span style={{ fontSize: "44px" }}>📦</span>}
                    </div>
                    <div style={{ padding: "14px" }}>
                      <p style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: "0 0 5px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{p.name}</p>
                      <p style={{ fontSize: "16px", fontWeight: "900", color: "#16a34a", margin: 0, fontFamily: "Cairo, sans-serif" }}>
                        {p.best_price ? `${Number(p.best_price).toLocaleString()} ₪` : "—"}
                      </p>
                    </div>
                  </Link>
                  <button onClick={() => removeFavorite(p.id)} style={{ width: "100%", padding: "8px", background: "#fef2f2", border: "none", borderTop: "1px solid #fee2e2", color: "#dc2626", cursor: "pointer", fontSize: "12px", fontFamily: "Tajawal, sans-serif", fontWeight: "600" }}>
                    🗑️ {lang === "ar" ? "إزالة" : "Remove"}
                  </button>
                </div>
              ))}
            </div>
          )
        )}

        {/* ALERTS */}
        {activeTab === "alerts" && (
          priceAlerts.length === 0 ? (
            <EmptyState icon="🔔" title={lang === "ar" ? "لا توجد تنبيهات سعر" : "No price alerts"} link="/" linkLabel={lang === "ar" ? "تصفح المنتجات" : "Browse Products"} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {priceAlerts.map(alert => (
                <div key={alert.id} style={{ background: "white", borderRadius: "12px", border: "1.5px solid #e2e8f0", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#22c55e"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}>
                  {/* صورة المنتج */}
                  <div style={{ width: "52px", height: "52px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                    {alert.product_image
                      ? <img src={fixImg(alert.product_image)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} />
                      : <span style={{ fontSize: "24px" }}>📦</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/product/${alert.product_id}`} style={{ textDecoration: "none" }}>
                      <p style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {alert.product_name}
                      </p>
                    </Link>
                    <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        🎯 {lang === "ar" ? "هدفك:" : "Target:"} <strong style={{ color: "#16a34a" }}>{Number(alert.target_price).toLocaleString()} ₪</strong>
                      </span>
                      {alert.current_price && (
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                          💰 {lang === "ar" ? "الحالي:" : "Current:"} <strong style={{ color: Number(alert.current_price) <= Number(alert.target_price) ? "#16a34a" : "#0f172a" }}>{Number(alert.current_price).toLocaleString()} ₪</strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={async () => {
                    await fetch(`/api/users/price-alerts/${alert.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
                    setPriceAlerts(prev => prev.filter(a => a.id !== alert.id));
                  }} style={{ padding: "6px 12px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontFamily: "Tajawal, sans-serif", fontWeight: "600", flexShrink: 0 }}>
                    🗑️ {lang === "ar" ? "حذف" : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          )
        )}

        {/* VIEWED */}
        {activeTab === "viewed" && (
          viewed.length === 0 ? (
            <EmptyState icon="👀" title={lang === "ar" ? "لم تشاهد أي منتجات بعد" : "No viewed products yet"} link="/" linkLabel={lang === "ar" ? "تصفح المنتجات" : "Browse Products"} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
              {viewed.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "white", borderRadius: "12px", border: "1.5px solid #e2e8f0", overflow: "hidden", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <div style={{ background: "#f8fafc", height: "110px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {p.image ? <img src={fixImg(p.image)} alt={p.name} style={{ maxHeight: "90px", maxWidth: "85%", objectFit: "contain" }} onError={e => e.target.style.display = "none"} />
                        : <span style={{ fontSize: "36px" }}>📦</span>}
                    </div>
                    <div style={{ padding: "12px" }}>
                      <p style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{p.name}</p>
                      <p style={{ fontSize: "14px", fontWeight: "900", color: "#16a34a", margin: "0 0 4px", fontFamily: "Cairo, sans-serif" }}>
                        {p.best_price ? `${Number(p.best_price).toLocaleString()} ₪` : "—"}
                      </p>
                      <p style={{ fontSize: "10px", color: "#94a3b8", margin: 0 }}>
                        👁 {new Date(p.viewed_at).toLocaleDateString("ar-PS")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}

        {/* COMPARISONS */}
        {activeTab === "comparisons" && (
          comparisons.length === 0 ? (
            <EmptyState icon="⚖️" title={lang === "ar" ? "لا توجد مقارنات سابقة" : "No comparisons yet"} link="/compare" linkLabel={lang === "ar" ? "المقارنة" : "Compare"} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {comparisons.map((comp, i) => (
                <div key={comp.id} style={{ background: "white", borderRadius: "12px", border: "1.5px solid #e2e8f0", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#22c55e"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>⚖️</div>
                    <div>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                        {lang === "ar" ? "مقارنة" : "Comparison"} #{comparisons.length - i}
                      </p>
                      <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#94a3b8" }}>
                        {new Date(comp.created_at).toLocaleDateString("ar-PS")} · {comp.product_ids?.length || 0} {lang === "ar" ? "منتجات" : "products"}
                      </p>
                    </div>
                  </div>
                  <Link to="/compare"
                    onClick={() => localStorage.setItem("compare", JSON.stringify(comp.product_ids))}
                    style={{ padding: "8px 16px", background: "#f0fdf4", border: "1px solid #dcfce7", color: "#16a34a", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "700", whiteSpace: "nowrap" }}>
                    {lang === "ar" ? "عرض ←" : "View →"}
                  </Link>
                </div>
              ))}
            </div>
          )
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div style={{ maxWidth: "480px" }}>
            <div style={{ background: "white", borderRadius: "16px", border: "1.5px solid #e2e8f0", padding: "28px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "22px", margin: "0 0 22px" }}>
                ✏️ {lang === "ar" ? "تعديل المعلومات الشخصية" : "Edit Profile"}
              </h3>

              {saved && (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "10px 16px", borderRadius: "10px", fontSize: "14px", marginBottom: "16px" }}>
                  ✓ {lang === "ar" ? "تم الحفظ بنجاح" : "Saved successfully"}
                </div>
              )}

              {[
                { key: "name",  label: lang === "ar" ? "الاسم" : "Name", type: "text" },
                { key: "email", label: lang === "ar" ? "البريد الإلكتروني" : "Email", type: "email" },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {field.label}
                  </label>
                  <input type={field.type} value={form[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "14px", fontFamily: "Tajawal, sans-serif", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = "#22c55e"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </div>
              ))}

              <button onClick={handleSave} disabled={saving} style={{
                width: "100%", padding: "12px",
                background: saving ? "#86efac" : "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "white", border: "none", borderRadius: "10px",
                fontSize: "14px", fontWeight: "700", cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "Tajawal, sans-serif",
                boxShadow: saving ? "none" : "0 4px 16px rgba(34,197,94,0.3)"
              }}>
                {saving ? (lang === "ar" ? "جاري الحفظ..." : "Saving...") : (lang === "ar" ? "حفظ التغييرات" : "Save Changes")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, link, linkLabel }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px", color: "#94a3b8" }}>
      <div style={{ fontSize: "56px", marginBottom: "16px" }}>{icon}</div>
      <p style={{ fontSize: "16px", color: "#64748b", fontWeight: "600", marginBottom: "16px" }}>{title}</p>
      <Link to={link} style={{ padding: "10px 24px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", borderRadius: "10px", textDecoration: "none", fontSize: "14px", fontWeight: "700", boxShadow: "0 4px 16px rgba(34,197,94,0.25)" }}>
        {linkLabel}
      </Link>
    </div>
  );
}

export default UserProfile;