export default function AdminPending({ products, loading, approveProduct, setRejectModal, setProductDetail }) {
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>⏳ بانتظار الموافقة</h1>
        <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0" }}>راجع كل منتج قبل نشره على الموقع</p>
      </div>

      {loading ? (
        <p style={{ color: "#94a3b8" }}>جاري التحميل...</p>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px", background: "white", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
          <p style={{ color: "#94a3b8", fontSize: "15px" }}>لا توجد منتجات بانتظار الموافقة</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {products.map(p => (
            <div key={p.id}
              onClick={() => setProductDetail(p)}
              style={{ background: "white", borderRadius: "14px", padding: "18px 22px", border: "1.5px solid #e2e8f0", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(34,197,94,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={p.image} alt="" style={{ maxWidth: "48px", maxHeight: "48px", objectFit: "contain" }} onError={e => e.target.style.display = "none"} />
              </div>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <p style={{ color: "#0f172a", fontWeight: "700", margin: "0 0 6px", fontSize: "14px" }}>{p.name}</p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {[p.brand && `🏷️ ${p.brand}`, p.category_name && `📂 ${p.category_name}`].filter(Boolean).map((txt, i) => (
                    <span key={i} style={{ color: "#94a3b8", fontSize: "12px" }}>{txt}</span>
                  ))}
                  {p.store_name && (
                    <a href={`/store/${p.store_id}`} target="_blank" rel="noreferrer"
                      style={{ color: "#22c55e", fontSize: "12px", textDecoration: "none", fontWeight: "600" }}
                      onClick={e => e.stopPropagation()}>
                      🏪 {p.store_name}
                    </a>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }} onClick={e => e.stopPropagation()}>
                <button onClick={() => approveProduct(p.id)} style={{ padding: "9px 18px", background: "#15803d", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "700", fontFamily: "Tajawal, sans-serif" }}>✓ موافقة</button>
                <button onClick={() => setRejectModal(p)} style={{ padding: "9px 18px", background: "#fef2f2", color: "#ef4444", border: "1.5px solid #fecaca", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "700", fontFamily: "Tajawal, sans-serif" }}>✕ رفض</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
