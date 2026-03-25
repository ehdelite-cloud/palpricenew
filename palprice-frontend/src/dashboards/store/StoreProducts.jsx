import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../../components/DashboardSidebar";

function RejectedProductCard({ p, lang, onResubmit }) {
  const [editing, setEditing]     = useState(false);
  const [name, setName]           = useState(p.name);
  const [brand, setBrand]         = useState(p.brand || "");
  const [description, setDesc]    = useState(p.description || "");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]           = useState(false);

  async function handleResubmit() {
    setSubmitting(true);
    const res = await fetch(`/api/products/${p.id}/resubmit`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, brand, description })
    });
    if (res.ok) { setDone(true); setEditing(false); onResubmit(p.id); }
    setSubmitting(false);
  }

  if (done) return null;

  const inp = { width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #fecaca", fontSize: "13px", fontFamily: "Tajawal, sans-serif", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ marginTop: "10px", background: "white", borderRadius: "10px", border: "1px solid #fecaca", overflow: "hidden" }}>
      <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
        {p.image && <img src={p.image} alt="" style={{ width: "36px", height: "36px", objectFit: "contain", borderRadius: "6px" }} onError={e => e.target.style.display = "none"} />}
        <div style={{ flex: 1 }}>
          <p style={{ color: "#0f172a", fontWeight: "600", margin: 0, fontSize: "13px" }}>{p.variant_label || p.name}</p>
          {p.reject_reason
            ? <p style={{ color: "#ef4444", fontSize: "12px", margin: "3px 0 0" }}>⚠️ {lang === "ar" ? "سبب الرفض:" : "Reason:"} {p.reject_reason}</p>
            : <p style={{ color: "#94a3b8", fontSize: "12px", margin: "3px 0 0" }}>{lang === "ar" ? "لم يذكر سبب" : "No reason given"}</p>}
        </div>
        <button onClick={() => setEditing(e => !e)}
          style={{ padding: "5px 12px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontFamily: "Tajawal, sans-serif" }}>
          ✏️ {lang === "ar" ? "تعديل وإعادة الإرسال" : "Edit & Resubmit"}
        </button>
      </div>
      {editing && (
        <div style={{ padding: "14px", background: "#fef2f2", borderTop: "1px solid #fecaca" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>{lang === "ar" ? "الاسم" : "Name"}</label>
              <input value={name} onChange={e => setName(e.target.value)} style={inp} />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>{lang === "ar" ? "الماركة" : "Brand"}</label>
              <input value={brand} onChange={e => setBrand(e.target.value)} style={inp} />
            </div>
          </div>
          <textarea value={description} onChange={e => setDesc(e.target.value)} rows={2}
            style={{ ...inp, resize: "none", border: "1px solid #fecaca", marginBottom: "12px" }} />
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={handleResubmit} disabled={submitting}
              style={{ padding: "8px 18px", background: "#22c55e", color: "white", border: "none", borderRadius: "7px", cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "Tajawal, sans-serif" }}>
              {submitting ? "..." : (lang === "ar" ? "📤 إعادة الإرسال" : "📤 Resubmit")}
            </button>
            <button onClick={() => setEditing(false)}
              style={{ padding: "8px 14px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "7px", cursor: "pointer", fontSize: "13px", fontFamily: "Tajawal, sans-serif" }}>
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StoreProducts({ lang = "ar" }) {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [editingPrice, setEditingPrice] = useState(null);
  const [newPrice, setNewPrice]       = useState("");
  const [savingPrice, setSavingPrice] = useState(false);

  const storeId = localStorage.getItem("storeId");

  useEffect(() => {
    if (!storeId) { setLoading(false); return; }
    fetch(`/api/stores/${storeId}/products`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [storeId]);

  const pending          = products.filter(p => p.status === "pending");
  const approved         = products.filter(p => p.status === "approved");
  const rejected         = products.filter(p => p.status === "rejected");
  const recentlyApproved = [...approved].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);

  const filtered = approved.filter(p =>
    (p.variant_label || p.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.brand || "").toLowerCase().includes(search.toLowerCase())
  );

  function deleteProduct(id) {
    if (!window.confirm(lang === "ar" ? "هل أنت متأكد من الحذف؟" : "Delete?")) return;
    fetch(`/api/products/${id}`, { method: "DELETE" })
      .then(() => setProducts(prev => prev.filter(p => p.id !== id)));
  }

  async function savePrice(productId) {
    if (!newPrice || isNaN(newPrice)) return;
    setSavingPrice(true);
    await fetch("/api/prices", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, store_id: storeId, price: parseFloat(newPrice) })
    });
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, best_price: parseFloat(newPrice) } : p));
    setEditingPrice(null); setNewPrice("");
    setSavingPrice(false);
  }

  const colStyle  = { padding: "11px 14px", textAlign: "right", fontSize: "12px", fontWeight: "600", color: "#64748b", borderBottom: "1px solid #e2e8f0" };
  const cellStyle = { padding: "11px 14px", textAlign: "right", verticalAlign: "middle", borderBottom: "1px solid #f8fafc" };

  function ProductRow({ p }) {
    const displayName = p.variant_label || p.name;
    return (
      <tr onMouseEnter={e => e.currentTarget.style.background = "#fafafa"} onMouseLeave={e => e.currentTarget.style.background = "white"}>
        <td style={{ ...cellStyle, width: "52px" }}>
          {p.image
            ? <img src={p.image.startsWith("/") ? `/api${p.image}` : p.image} alt="" style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "6px", background: "#f8fafc" }} onError={e => e.target.style.display = "none"} />
            : <div style={{ width: "40px", height: "40px", borderRadius: "6px", background: "#f1f5f9", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>📦</div>}
        </td>
        <td style={{ ...cellStyle }}>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", margin: "0 0 2px" }}>{displayName}</p>
          {/* Variant chips */}
          {(p.variant_storage || p.variant_color || p.variant_edition) && (
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {p.variant_storage && <span style={{ background: "#f1f5f9", color: "#475569", fontSize: "10px", fontWeight: "600", padding: "1px 6px", borderRadius: "3px" }}>{p.variant_storage}</span>}
              {p.variant_color   && <span style={{ background: "#f1f5f9", color: "#475569", fontSize: "10px", fontWeight: "600", padding: "1px 6px", borderRadius: "3px" }}>{p.variant_color}</span>}
              {p.variant_edition && <span style={{ background: "#f0fdf4", color: "#16a34a", fontSize: "10px", fontWeight: "600", padding: "1px 6px", borderRadius: "3px" }}>{p.variant_edition}</span>}
            </div>
          )}
        </td>
        <td style={{ ...cellStyle, width: "140px" }}>
          {editingPrice === p.id ? (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} autoFocus
                onKeyDown={e => { if (e.key === "Enter") savePrice(p.id); if (e.key === "Escape") setEditingPrice(null); }}
                style={{ width: "72px", padding: "4px 7px", borderRadius: "6px", border: "1.5px solid #22c55e", fontSize: "12px", fontFamily: "Tajawal, sans-serif", outline: "none" }} />
              <span style={{ fontSize: "11px", color: "#64748b" }}>₪</span>
              <button onClick={() => savePrice(p.id)} disabled={savingPrice} style={{ padding: "3px 7px", background: "#22c55e", color: "white", border: "none", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}>✓</button>
              <button onClick={() => setEditingPrice(null)} style={{ padding: "3px 7px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}>✕</button>
            </div>
          ) : (
            <div onClick={() => { setEditingPrice(p.id); setNewPrice(p.best_price ? String(Number(p.best_price).toFixed(0)) : ""); }}
              style={{ display: "inline-flex", alignItems: "center", gap: "5px", cursor: "pointer", padding: "3px 7px", borderRadius: "5px" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#22c55e" }}>{p.best_price ? `${Number(p.best_price).toFixed(0)} ₪` : "—"}</span>
              <span style={{ fontSize: "10px", color: "#94a3b8" }}>✏️</span>
            </div>
          )}
        </td>
        <td style={{ ...cellStyle, width: "200px" }}>
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            <Link to={`/store/dashboard/product-images/${p.id}`} style={{ padding: "4px 9px", borderRadius: "5px", border: "1px solid #e2e8f0", color: "#475569", textDecoration: "none", fontSize: "11px" }}>🖼️</Link>
            <Link to={`/store/dashboard/edit-product/${p.id}`} style={{ padding: "4px 9px", borderRadius: "5px", border: "1px solid #bfdbfe", color: "#2563eb", textDecoration: "none", fontSize: "11px" }}>✏️ {lang === "ar" ? "تعديل" : "Edit"}</Link>
            <button onClick={() => deleteProduct(p.id)} style={{ padding: "4px 9px", borderRadius: "5px", border: "1px solid #fecaca", color: "#dc2626", background: "none", cursor: "pointer", fontSize: "11px" }}>🗑️</button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <DashboardSidebar lang={lang} />
      <main style={{ flex: 1, padding: "32px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>📦 {lang === "ar" ? "منتجاتي" : "My Products"}</h1>
            <p style={{ color: "#64748b", marginTop: "4px", fontSize: "13px" }}>{products.length} {lang === "ar" ? "منتج" : "products"}</p>
          </div>
          <Link to="/store/dashboard/add-product" style={{ padding: "9px 18px", background: "#22c55e", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>
            ＋ {lang === "ar" ? "إضافة منتج" : "Add Product"}
          </Link>
        </div>

        {/* Pending */}
        {pending.length > 0 && (
          <div style={{ background: "#fffbeb", borderRadius: "12px", border: "1px solid #fde68a", padding: "16px 20px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <span>⏳</span>
              <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#92400e", margin: 0 }}>{lang === "ar" ? "بانتظار الموافقة" : "Pending Approval"}</h2>
              <span style={{ background: "#f59e0b", color: "white", borderRadius: "99px", fontSize: "11px", fontWeight: "700", padding: "1px 8px" }}>{pending.length}</span>
            </div>
            {pending.map(p => (
              <div key={p.id} style={{ background: "white", borderRadius: "8px", padding: "10px 14px", border: "1px solid #fde68a", display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                {p.image && <img src={p.image} alt="" style={{ width: "32px", height: "32px", objectFit: "contain", borderRadius: "5px" }} onError={e => e.target.style.display = "none"} />}
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#0f172a", fontWeight: "600", margin: 0, fontSize: "13px" }}>{p.variant_label || p.name}</p>
                  <p style={{ color: "#94a3b8", fontSize: "11px", margin: "1px 0 0" }}>{p.created_at ? new Date(p.created_at).toLocaleDateString("ar-PS") : ""}</p>
                </div>
                <span style={{ padding: "2px 9px", borderRadius: "99px", fontSize: "11px", fontWeight: "600", background: "#fef3c7", color: "#d97706" }}>⏳ {lang === "ar" ? "قيد الانتظار" : "Pending"}</span>
              </div>
            ))}
          </div>
        )}

        {/* Recently Approved */}
        {recentlyApproved.length > 0 && (
          <div style={{ background: "#f0fdf4", borderRadius: "12px", border: "1px solid #bbf7d0", padding: "16px 20px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <span>✅</span>
              <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#166534", margin: 0 }}>{lang === "ar" ? "تمت الموافقة مؤخراً" : "Recently Approved"}</h2>
              <span style={{ background: "#22c55e", color: "white", borderRadius: "99px", fontSize: "11px", fontWeight: "700", padding: "1px 8px" }}>{recentlyApproved.length}</span>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {recentlyApproved.map(p => (
                <div key={p.id} style={{ background: "white", borderRadius: "8px", padding: "8px 12px", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: "8px" }}>
                  {p.image && <img src={p.image} alt="" style={{ width: "28px", height: "28px", objectFit: "contain", borderRadius: "4px" }} onError={e => e.target.style.display = "none"} />}
                  <p style={{ color: "#0f172a", fontWeight: "600", margin: 0, fontSize: "12px" }}>{p.variant_label || p.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejected */}
        {rejected.length > 0 && (
          <div style={{ background: "#fef2f2", borderRadius: "12px", border: "1px solid #fecaca", padding: "16px 20px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span>❌</span>
              <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#991b1b", margin: 0 }}>{lang === "ar" ? "منتجات مرفوضة" : "Rejected"}</h2>
              <span style={{ background: "#ef4444", color: "white", borderRadius: "99px", fontSize: "11px", fontWeight: "700", padding: "1px 8px" }}>{rejected.length}</span>
            </div>
            {rejected.map(p => (
              <RejectedProductCard key={p.id} p={p} lang={lang}
                onResubmit={(id) => setProducts(prev => prev.map(x => x.id === id ? { ...x, status: "pending" } : x))} />
            ))}
          </div>
        )}

        {/* Approved Table */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: 0 }}>
              {lang === "ar" ? "المنتجات المعتمدة" : "Approved Products"} ({approved.length})
            </h2>
            <input type="text" placeholder={lang === "ar" ? "بحث..." : "Search..."} value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: "7px 12px", borderRadius: "7px", border: "1px solid #e2e8f0", fontSize: "12px", fontFamily: "Tajawal, sans-serif", outline: "none", width: "200px" }} />
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", direction: "rtl" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={colStyle}>{lang === "ar" ? "الصورة" : "Image"}</th>
                <th style={colStyle}>{lang === "ar" ? "المنتج" : "Product"}</th>
                <th style={colStyle}>{lang === "ar" ? "السعر" : "Price"}</th>
                <th style={colStyle}>{lang === "ar" ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(4).fill().map((_, i) => (
                    <tr key={i}>{Array(4).fill().map((_, j) => <td key={j} style={{ padding: "14px" }}><div style={{ height: "14px", borderRadius: "3px", background: "#f1f5f9" }} /></td>)}</tr>
                  ))
                : filtered.length === 0
                  ? <tr><td colSpan={4} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ fontSize: "32px", marginBottom: "8px" }}>📭</div>
                      {approved.length === 0 ? (lang === "ar" ? "لا توجد منتجات معتمدة" : "No approved products") : (lang === "ar" ? "لا توجد نتائج" : "No results")}
                    </td></tr>
                  : filtered.map(p => <ProductRow key={p.id} p={p} />)
              }
            </tbody>
          </table>
          {!loading && filtered.length > 0 && (
            <p style={{ textAlign: "center", padding: "10px", fontSize: "11px", color: "#94a3b8" }}>
              💡 {lang === "ar" ? "اضغط على السعر لتعديله" : "Click price to edit"}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}