export default function AdminStores({ stores, loading, search, setSearch, load, toggleStore }) {
  const inp = { padding: "9px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", outline: "none", background: "white", color: "#0f172a" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>🏪 المتاجر</h1>
        <input placeholder="ابحث..." value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && load()} style={{ ...inp, width: "220px" }} />
      </div>

      {stores.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px", background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", color: "#94a3b8" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🏪</div>
          <p>لا توجد متاجر</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {stores.map(s => (
            <div key={s.id} onClick={() => window.open(`/store/${s.id}`, "_blank")}
              style={{ background: "white", borderRadius: "16px", padding: "20px", cursor: "pointer", border: `1.5px solid ${s.is_active ? "#e2e8f0" : "#fecaca"}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                  {s.logo
                    ? <img src={s.logo.startsWith("/") ? `/api${s.logo}` : s.logo} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} alt="" />
                    : <span style={{ fontSize: "22px" }}>🏪</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "#0f172a", fontWeight: "700", margin: 0, fontSize: "15px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</p>
                  <p style={{ color: "#94a3b8", fontSize: "12px", margin: "3px 0 0" }}>📍 {s.city || "—"} • 📦 {s.product_count} منتج</p>
                </div>
                <span style={{ padding: "4px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "700", background: s.is_active ? "#f0fdf4" : "#fef2f2", color: s.is_active ? "#15803d" : "#ef4444", flexShrink: 0 }}>
                  {s.is_active ? "✓ نشط" : "⏸ معلق"}
                </span>
              </div>
              <p style={{ color: "#cbd5e1", fontSize: "11px", margin: "0 0 14px" }}>📧 {s.email || "—"}</p>
              <button onClick={e => { e.stopPropagation(); toggleStore(s.id, !s.is_active); }}
                style={{ width: "100%", padding: "9px", background: s.is_active ? "#fef2f2" : "#f0fdf4", color: s.is_active ? "#ef4444" : "#15803d", border: `1.5px solid ${s.is_active ? "#fecaca" : "#bbf7d0"}`, borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontFamily: "Tajawal, sans-serif", fontWeight: "700" }}>
                {s.is_active ? "⏸ تعليق المتجر" : "▶ تفعيل المتجر"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
