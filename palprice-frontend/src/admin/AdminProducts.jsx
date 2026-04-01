import { HBar, StatusPill } from "./AdminShared";

export default function AdminProducts({ products, productsTotal, loading, search, setSearch, statusFilter, setStatusFilter, page, setPage, load, approveProduct, deleteProduct, setRejectModal }) {
  const totalPages = (total, lim = 15) => Math.ceil(total / lim);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
          📦 كل المنتجات <span style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "400" }}>({productsTotal})</span>
        </h1>
        <div style={{ display: "flex", gap: "8px" }}>
          <input placeholder="ابحث عن منتج..." value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && load()}
            style={{ padding: "9px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", outline: "none", background: "white", color: "#0f172a", width: "220px" }} />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); load(); }}
            style={{ padding: "9px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", outline: "none", background: "white", color: "#0f172a", width: "130px", cursor: "pointer" }}>
            <option value="">كل الحالات</option>
            <option value="approved">✅ مقبول</option>
            <option value="pending">⏳ معلق</option>
            <option value="rejected">❌ مرفوض</option>
          </select>
          <button onClick={() => { setPage(1); load(); }}
            style={{ padding: "9px 16px", background: "#0f172a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "Tajawal, sans-serif" }}>🔍</button>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["#", "المنتج", "الفئة", "المتجر", "الحالة", "المشاهدات", ""].map((col, i) => (
                <th key={i} style={{ padding: "12px 16px", textAlign: "right", color: "#94a3b8", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>جاري التحميل...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>لا توجد منتجات</td></tr>
            ) : products.map(p => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f8fafc" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background = "white"}>
                <td style={{ padding: "12px 16px", color: "#cbd5e1", fontSize: "12px" }}>{p.id}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#f8fafc", border: "1px solid #e2e8f0", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={p.image} style={{ maxWidth: "32px", maxHeight: "32px", objectFit: "contain" }} onError={e => e.target.style.display = "none"} alt="" />
                    </div>
                    <div>
                      <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "600", margin: 0, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                      {p.brand && <p style={{ color: "#94a3b8", fontSize: "11px", margin: 0 }}>{p.brand}</p>}
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "12px" }}>{p.category_name || "—"}</td>
                <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "12px" }}>{p.store_name || "—"}</td>
                <td style={{ padding: "12px 16px" }}><StatusPill status={p.status} /></td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <HBar pct={Math.min((p.views || 0) / 3, 100)} color="#4ade80" height={5} bg="#f1f5f9" />
                    <span style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap" }}>{p.views || 0}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {p.status === "pending" && (
                      <button onClick={() => approveProduct(p.id)} style={{ padding: "5px 10px", background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "700" }}>✓</button>
                    )}
                    <button onClick={() => deleteProduct(p.id)} style={{ padding: "5px 10px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>حذف</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productsTotal > 15 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "16px" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", color: "#64748b", fontSize: "13px" }}>←</button>
          <span style={{ color: "#64748b", fontSize: "13px" }}>صفحة {page} / {totalPages(productsTotal)}</span>
          <button onClick={() => setPage(p => Math.min(totalPages(productsTotal), p + 1))} disabled={page >= totalPages(productsTotal)}
            style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", color: "#64748b", fontSize: "13px" }}>→</button>
        </div>
      )}
    </div>
  );
}
