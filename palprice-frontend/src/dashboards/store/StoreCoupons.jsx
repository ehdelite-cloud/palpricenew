import { useEffect, useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";

function StoreCoupons({ lang = "ar" }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "", discount_type: "percent", discount_value: "",
    min_purchase: "", max_uses: "", expires_at: "", description: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => { loadCoupons(); }, []);

  async function loadCoupons() {
    setLoading(true);
    const res = await fetch("/api/coupons/mine", { headers });
    const data = await res.json();
    if (Array.isArray(data)) setCoupons(data);
    setLoading(false);
  }

  // توليد كود عشوائي
  function generateCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setForm(f => ({ ...f, code }));
  }

  async function handleSave() {
    if (!form.code || !form.discount_value) {
      setError(lang === "ar" ? "الكود ونسبة الخصم مطلوبان" : "Code and discount are required");
      return;
    }
    setSaving(true); setError("");
    const res = await fetch("/api/coupons", {
      method: "POST", headers,
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error === "Code already exists"
        ? (lang === "ar" ? "هذا الكود موجود مسبقاً" : "Code already exists")
        : data.error);
      setSaving(false); return;
    }
    await loadCoupons();
    setShowForm(false);
    setForm({ code: "", discount_type: "percent", discount_value: "", min_purchase: "", max_uses: "", expires_at: "", description: "" });
    setSaving(false);
  }

  async function toggleActive(coupon) {
    await fetch(`/api/coupons/${coupon.id}`, {
      method: "PUT", headers,
      body: JSON.stringify({ ...coupon, is_active: !coupon.is_active })
    });
    loadCoupons();
  }

  async function deleteCoupon(id) {
    if (!window.confirm(lang === "ar" ? "حذف هذا الكوبون؟" : "Delete this coupon?")) return;
    await fetch(`/api/coupons/${id}`, { method: "DELETE", headers });
    setCoupons(prev => prev.filter(c => c.id !== id));
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  function isExpired(coupon) {
    return coupon.expires_at && new Date(coupon.expires_at) < new Date();
  }

  const inp = { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "14px", fontFamily: "Tajawal, sans-serif", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "Tajawal, sans-serif" }}>
      <DashboardSidebar lang={lang} />
      <main style={{ flex: 1, padding: "32px 40px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>
              🎟️ {lang === "ar" ? "كوبونات الخصم" : "Discount Coupons"}
            </h1>
            <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>
              {lang === "ar" ? "أضف كوبونات لجذب عملاء أكثر" : "Add coupons to attract more customers"}
            </p>
          </div>
          <button onClick={() => { setShowForm(true); setError(""); }}
            style={{ padding: "10px 20px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            ＋ {lang === "ar" ? "كوبون جديد" : "New Coupon"}
          </button>
        </div>

        {/* فورم إضافة كوبون */}
        {showForm && (
          <div style={{ background: "white", borderRadius: "16px", border: "1.5px solid #e2e8f0", padding: "24px", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "20px", margin: "0 0 20px" }}>
              {lang === "ar" ? "إنشاء كوبون جديد" : "Create New Coupon"}
            </h3>

            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>{error}</div>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>

              {/* كود الكوبون */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  {lang === "ar" ? "كود الكوبون *" : "Coupon Code *"}
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    placeholder="SAVE20" style={{ ...inp, flex: 1 }}
                    onFocus={e => e.target.style.borderColor = "#22c55e"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                  <button onClick={generateCode} title={lang === "ar" ? "توليد تلقائي" : "Auto generate"}
                    style={{ padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", fontSize: "16px" }}>
                    🎲
                  </button>
                </div>
              </div>

              {/* نوع الخصم */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  {lang === "ar" ? "نوع الخصم *" : "Discount Type *"}
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { value: "percent", label: lang === "ar" ? "نسبة %" : "Percent %" },
                    { value: "fixed",   label: lang === "ar" ? "مبلغ ₪" : "Fixed ₪" },
                  ].map(t => (
                    <button key={t.value} onClick={() => setForm(f => ({ ...f, discount_type: t.value }))}
                      style={{ flex: 1, padding: "10px", borderRadius: "10px", border: `1.5px solid ${form.discount_type === t.value ? "#22c55e" : "#e2e8f0"}`, background: form.discount_type === t.value ? "#f0fdf4" : "white", color: form.discount_type === t.value ? "#16a34a" : "#475569", fontWeight: "600", fontSize: "13px", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* قيمة الخصم */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  {form.discount_type === "percent" ? (lang === "ar" ? "نسبة الخصم % *" : "Discount % *") : (lang === "ar" ? "مبلغ الخصم ₪ *" : "Discount ₪ *")}
                </label>
                <input type="number" value={form.discount_value} onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))}
                  placeholder={form.discount_type === "percent" ? "20" : "50"} min="0" max={form.discount_type === "percent" ? "100" : undefined}
                  style={inp} onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>

              {/* حد أدنى للشراء */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  {lang === "ar" ? "الحد الأدنى للشراء ₪" : "Min Purchase ₪"}
                </label>
                <input type="number" value={form.min_purchase} onChange={e => setForm(f => ({ ...f, min_purchase: e.target.value }))}
                  placeholder="0" min="0" style={inp}
                  onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>

              {/* أقصى استخدامات */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  {lang === "ar" ? "أقصى عدد استخدامات" : "Max Uses"}
                </label>
                <input type="number" value={form.max_uses} onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))}
                  placeholder={lang === "ar" ? "غير محدود" : "Unlimited"} min="1" style={inp}
                  onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>

              {/* تاريخ الانتهاء */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  {lang === "ar" ? "تاريخ الانتهاء" : "Expiry Date"}
                </label>
                <input type="datetime-local" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}
                  style={inp} onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
            </div>

            {/* وصف */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                {lang === "ar" ? "وصف الكوبون" : "Description"}
              </label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder={lang === "ar" ? "مثال: خصم للعملاء الجدد" : "e.g. New customers discount"}
                style={inp} onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleSave} disabled={saving}
                style={{ padding: "11px 24px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                {saving ? "⏳ " + (lang === "ar" ? "جاري الحفظ..." : "Saving...") : "💾 " + (lang === "ar" ? "حفظ الكوبون" : "Save Coupon")}
              </button>
              <button onClick={() => { setShowForm(false); setError(""); }}
                style={{ padding: "11px 20px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "10px", fontSize: "14px", cursor: "pointer" }}>
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        )}

        {/* قائمة الكوبونات */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
            ⏳ {lang === "ar" ? "جاري التحميل..." : "Loading..."}
          </div>
        ) : coupons.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", background: "white", borderRadius: "16px", border: "1.5px dashed #e2e8f0" }}>
            <div style={{ fontSize: "52px", marginBottom: "14px" }}>🎟️</div>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#64748b", marginBottom: "16px" }}>
              {lang === "ar" ? "لا توجد كوبونات بعد" : "No coupons yet"}
            </p>
            <button onClick={() => setShowForm(true)}
              style={{ padding: "10px 24px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
              {lang === "ar" ? "أضف كوبونك الأول" : "Add Your First Coupon"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {coupons.map(coupon => {
              const expired = isExpired(coupon);
              const exhausted = coupon.max_uses && Number(coupon.used_count) >= Number(coupon.max_uses);
              const status = expired ? "expired" : exhausted ? "exhausted" : coupon.is_active ? "active" : "inactive";
              const statusConfig = {
                active:    { label: lang === "ar" ? "نشط" : "Active",    bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
                inactive:  { label: lang === "ar" ? "متوقف" : "Inactive", bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" },
                expired:   { label: lang === "ar" ? "منتهي" : "Expired",  bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
                exhausted: { label: lang === "ar" ? "نفدت" : "Exhausted", bg: "#fefce8", color: "#ca8a04", border: "#fde68a" },
              };
              const sc = statusConfig[status];

              return (
                <div key={coupon.id} style={{ background: "white", borderRadius: "14px", border: `1.5px solid ${coupon.is_active && !expired && !exhausted ? "#e2e8f0" : "#f1f5f9"}`, padding: "18px 22px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", opacity: expired || exhausted ? 0.7 : 1 }}>

                  {/* كود الكوبون */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                    <div style={{ background: "#f8fafc", border: "2px dashed #e2e8f0", borderRadius: "10px", padding: "10px 16px", fontFamily: "monospace", fontSize: "18px", fontWeight: "800", color: "#0f172a", letterSpacing: "2px" }}>
                      {coupon.code}
                    </div>
                    <button onClick={() => copyCode(coupon.code)} title={lang === "ar" ? "نسخ" : "Copy"}
                      style={{ width: "34px", height: "34px", borderRadius: "8px", border: "1px solid #e2e8f0", background: copied === coupon.code ? "#f0fdf4" : "white", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {copied === coupon.code ? "✓" : "📋"}
                    </button>
                  </div>

                  {/* تفاصيل */}
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                      <span style={{ fontSize: "16px", fontWeight: "800", color: "#16a34a" }}>
                        {coupon.discount_type === "percent" ? `${coupon.discount_value}%` : `${coupon.discount_value} ₪`}
                        {" "}{lang === "ar" ? "خصم" : "off"}
                      </span>
                      {Number(coupon.min_purchase) > 0 && (
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                          • {lang === "ar" ? `حد أدنى ${coupon.min_purchase} ₪` : `Min ${coupon.min_purchase} ₪`}
                        </span>
                      )}
                      <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: "2px 8px", borderRadius: "99px", fontSize: "11px", fontWeight: "700" }}>
                        {sc.label}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      {coupon.description && <span style={{ fontSize: "12px", color: "#64748b" }}>{coupon.description}</span>}
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                        📊 {coupon.uses || 0} {lang === "ar" ? "استخدام" : "uses"}
                        {coupon.max_uses && ` / ${coupon.max_uses}`}
                      </span>
                      {coupon.expires_at && (
                        <span style={{ fontSize: "12px", color: expired ? "#dc2626" : "#94a3b8" }}>
                          ⏰ {new Date(coupon.expires_at).toLocaleDateString("ar-PS")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* أزرار */}
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    {!expired && !exhausted && (
                      <button onClick={() => toggleActive(coupon)}
                        style={{ padding: "7px 14px", borderRadius: "8px", border: `1px solid ${coupon.is_active ? "#fde68a" : "#bbf7d0"}`, background: coupon.is_active ? "#fefce8" : "#f0fdf4", color: coupon.is_active ? "#ca8a04" : "#16a34a", cursor: "pointer", fontSize: "12px", fontWeight: "600", fontFamily: "Tajawal, sans-serif" }}>
                        {coupon.is_active ? (lang === "ar" ? "إيقاف" : "Disable") : (lang === "ar" ? "تفعيل" : "Enable")}
                      </button>
                    )}
                    <button onClick={() => deleteCoupon(coupon.id)}
                      style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontSize: "12px", fontFamily: "Tajawal, sans-serif" }}>
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default StoreCoupons;