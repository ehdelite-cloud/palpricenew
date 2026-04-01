import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "./hooks/useFetch";

function StoresList({ lang = "ar" }) {
  const [ratings,    setRatings]    = useState({});
  const [search,     setSearch]     = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const { data, loading } = useFetch("/api/stores", { fallback: [] });
  const stores = Array.isArray(data) ? data : [];

  // Fetch ratings for each store once stores are loaded
  useEffect(() => {
    if (stores.length === 0) return;
    const ratingsMap = {};
    Promise.all(stores.map(async store => {
      try {
        const r = await fetch(`/api/stores/${store.id}/rating`);
        ratingsMap[store.id] = await r.json();
      } catch { }
    })).then(() => setRatings({ ...ratingsMap }));
  }, [stores.length]);

  const cities = [...new Set(stores.map(s => s.city).filter(Boolean))];

  const filtered = stores.filter(s => {
    const matchSearch = !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.city?.toLowerCase().includes(search.toLowerCase());
    const matchCity = !cityFilter || s.city === cityFilter;
    return matchSearch && matchCity;
  });

  return (
    <div>
      <style>{`
        .stores-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        @media (max-width: 640px) {
          .stores-grid { grid-template-columns: 1fr !important; gap: 10px !important; }
          .store-card { padding: 14px 16px !important; flex-direction: row !important; gap: 12px !important; }
          .store-card-body { flex: 1; min-width: 0; }
        }
      `}</style>

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #1a2744 100%)", padding: "52px 24px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 70% at 85% 50%, rgba(34,197,94,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1240px", margin: "auto", position: "relative", zIndex: 1 }}>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)", color: "#86efac", padding: "5px 14px", borderRadius: "99px", fontSize: "12px", fontWeight: "600", marginBottom: "14px" }}>
            🏪 {lang === "ar" ? "متاجر فلسطينية موثوقة" : "Verified Palestinian Stores"}
          </div>

          <h1 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: "900", color: "white", margin: "0 0 8px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
            {lang === "ar" ? "جميع المتاجر" : "All Stores"}
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 28px" }}>
            {stores.length} {lang === "ar" ? "متجر مسجل في PalPrice" : "stores on PalPrice"}
          </p>

          {/* Search + Filter */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
              <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", fontSize: "14px", pointerEvents: "none" }}>🔍</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={lang === "ar" ? "ابحث عن متجر..." : "Search stores..."}
                style={{ width: "100%", padding: "11px 40px 11px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.08)", color: "white", fontSize: "14px", fontFamily: "Tajawal, sans-serif", outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
            </div>
            {cities.length > 0 && (
              <select value={cityFilter} onChange={e => setCityFilter(e.target.value)}
                style={{ padding: "11px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.08)", color: "white", fontSize: "13px", fontFamily: "Tajawal, sans-serif", cursor: "pointer", outline: "none" }}>
                <option value="" style={{ background: "#0f172a" }}>{lang === "ar" ? "كل المدن" : "All Cities"}</option>
                {cities.map(c => <option key={c} value={c} style={{ background: "#0f172a" }}>{c}</option>)}
              </select>
            )}
            {(search || cityFilter) && (
              <button onClick={() => { setSearch(""); setCityFilter(""); }}
                style={{ padding: "11px 16px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#fca5a5", fontSize: "13px", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                ✕ {lang === "ar" ? "مسح" : "Clear"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="page-container" style={{ maxWidth: "1240px", margin: "auto", padding: "28px 24px 60px" }}>

        {/* نتائج */}
        {!loading && (search || cityFilter) && (
          <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
            {filtered.length} {lang === "ar" ? "نتيجة" : "results"}
            {cityFilter && ` ${lang === "ar" ? `في ${cityFilter}` : `in ${cityFilter}`}`}
          </p>
        )}

        {loading ? (
          <div className="stores-grid">
            {Array(6).fill().map((_, i) => (
              <div key={i} style={{ height: "160px", borderRadius: "16px", background: "white", border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
                <div style={{ height: "100%", background: "linear-gradient(90deg, #f1f5f9 25%, #e8edf2 50%, #f1f5f9 75%)", backgroundSize: "400% 100%", animation: "skeleton-loading 1.5s ease infinite" }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#94a3b8" }}>
            <div style={{ fontSize: "52px", marginBottom: "14px" }}>🔍</div>
            <p style={{ fontSize: "16px", color: "#64748b", fontWeight: "600" }}>
              {lang === "ar" ? "لا توجد نتائج" : "No results found"}
            </p>
          </div>
        ) : (
          <div className="stores-grid">
            {filtered.map(store => {
              const r = ratings[store.id];
              const avgR = r && Number(r.total) > 0 ? Number(r.average) : 0;
              const logoSrc = store.logo
                ? (store.logo.startsWith("/") ? `/api${store.logo}` : store.logo)
                : null;

              return (
                <Link key={store.id} to={`/store/${store.id}`} style={{ textDecoration: "none" }}>
                  <div className="store-card" style={{ background: "white", borderRadius: "16px", border: "1.5px solid #e2e8f0", padding: "20px 22px", transition: "all 0.22s", cursor: "pointer", display: "flex", flexDirection: "column", gap: "14px" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.09)"; e.currentTarget.style.borderColor = "#22c55e"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>

                    {/* Logo + Info */}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ width: "58px", height: "58px", borderRadius: "14px", background: "linear-gradient(145deg, #f0fdf4, #f8fafc)", border: "1.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                        {logoSrc
                          ? <img src={logoSrc} alt={store.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
                          : <span style={{ fontSize: "26px" }}>🏪</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "Cairo, Tajawal, sans-serif" }}>
                          {store.name}
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                          {store.city && (
                            <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "3px" }}>
                              📍 {store.city}
                            </span>
                          )}
                          <span style={{ background: "#f0fdf4", border: "1px solid #dcfce7", color: "#16a34a", padding: "1px 8px", borderRadius: "99px", fontSize: "10px", fontWeight: "700" }}>
                            ✓ {lang === "ar" ? "موثوق" : "Verified"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rating + Arrow */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #f8fafc" }}>
                      {avgR > 0 ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <div style={{ display: "flex", gap: "1px" }}>
                            {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= Math.round(avgR) ? "#f59e0b" : "#e2e8f0", fontSize: "14px" }}>★</span>)}
                          </div>
                          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                            {avgR.toFixed(1)}
                            <span style={{ color: "#94a3b8", fontWeight: "400" }}> ({r.total})</span>
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                          {lang === "ar" ? "لا توجد تقييمات بعد" : "No reviews yet"}
                        </span>
                      )}
                      <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                        {lang === "ar" ? "عرض المتجر" : "View Store"} ←
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default StoresList;