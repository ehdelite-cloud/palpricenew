import { useEffect, useState, useRef } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";

const COLORS = [
  { value: "#22c55e", label: "أخضر" },
  { value: "#3b82f6", label: "أزرق" },
  { value: "#ef4444", label: "أحمر" },
  { value: "#f59e0b", label: "ذهبي" },
  { value: "#8b5cf6", label: "بنفسجي" },
  { value: "#ec4899", label: "وردي" },
  { value: "#0f172a", label: "داكن" },
];

function timeLeft(endsAt) {
  const diff = new Date(endsAt) - new Date();
  if (diff <= 0) return null;
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days} يوم${hours > 0 ? ` و${hours} ساعة` : ""}`;
  return `${hours} ساعة`;
}

export default function StoreCampaigns({ lang = "ar" }) {
  const [campaigns, setCampaigns] = useState([]);
  const [coupons, setCoupons]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [form, setForm] = useState({
    title: "", description: "", coupon_id: "",
    discount_text: "", banner_color: "#22c55e", ends_at: ""
  });

  // ref للتاريخ — يُحل مشكلة stale closure
  const endsAtRef = useRef("");

  const getH = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json"
  });

  useEffect(() => {
    load();
    fetch("/api/coupons/mine", { headers: getH() })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setCoupons(d.filter(c => c.is_active)); });
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/campaigns/mine", { headers: getH() });
    const data = await res.json();
    if (Array.isArray(data)) setCampaigns(data);
    setLoading(false);
  }

  function handleEndsAtChange(e) {
    let val = e.target.value;
    // إذا ما في وقت، نضيف 23:59 تلقائياً
    if (val && !val.includes("T")) {
      val = val + "T23:59";
    } else if (val && val.endsWith("T")) {
      val = val + "23:59";
    }
    endsAtRef.current = val;
    setForm(f => ({ ...f, ends_at: val }));
  }

  async function handleSave() {
    const title  = form.title?.trim();
    const endsAt = endsAtRef.current?.trim();
    // إذا في تاريخ بدون وقت، نضيف 23:59
    const endsAtFull = endsAt && !endsAt.includes("T") ? endsAt + "T23:59" : endsAt;

    if (!title) {
      setError(lang === "ar" ? "العنوان مطلوب" : "Title is required");
      return;
    }
    if (!endsAtFull) {
      setError(lang === "ar" ? "تاريخ الانتهاء مطلوب" : "End date is required");
      return;
    }
    if (new Date(endsAtFull) <= new Date()) {
      setError(lang === "ar" ? "التاريخ يجب أن يكون في المستقبل" : "Date must be in the future");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      title,
      description:    form.description || null,
      coupon_id:      form.coupon_id   || null,
      discount_text:  form.discount_text || null,
      banner_color:   form.banner_color,
      ends_at:        new Date(endsAtFull).toISOString(),
    };

    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: getH(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || (lang === "ar" ? "حدث خطأ" : "Error"));
      setSaving(false);
      return;
    }

    await load();
    setShowForm(false);
    setForm({ title: "", description: "", coupon_id: "", discount_text: "", banner_color: "#22c55e", ends_at: "" });
    endsAtRef.current = "";
    setSaving(false);
  }

  async function toggleActive(c) {
    await fetch(`/api/campaigns/${c.id}`, {
      method: "PUT",
      headers: getH(),
      body: JSON.stringify({ ...c, is_active: !c.is_active })
    });
    load();
  }

  async function deleteCampaign(id) {
    if (!window.confirm(lang === "ar" ? "حذف هذه الحملة؟" : "Delete campaign?")) return;
    await fetch(`/api/campaigns/${id}`, { method: "DELETE", headers: getH() });
    setCampaigns(prev => prev.filter(c => c.id !== id));
  }

  const inp = {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: "1.5px solid #e2e8f0", fontSize: "14px",
    fontFamily: "Tajawal, sans-serif", outline: "none", boxSizing: "border-box"
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "Tajawal, sans-serif" }}>
      <DashboardSidebar lang={lang} />
      <main style={{ flex: 1, padding: "32px 40px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>
              📢 {lang === "ar" ? "الحملات الإعلانية" : "Campaigns"}
            </h1>
            <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>
              {lang === "ar" ? "أطلق حملة وأوصل لكل زوار PalPrice" : "Launch a campaign and reach all PalPrice visitors"}
            </p>
          </div>
          <button onClick={() => { setShowForm(true); setError(""); }}
            style={{ padding: "10px 20px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            📢 {lang === "ar" ? "حملة جديدة" : "New Campaign"}
          </button>
        </div>

        {/* شرح الميزة */}
        <div style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px solid #bbf7d0", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "28px", flexShrink: 0 }}>💡</span>
          <div>
            <p style={{ fontSize: "14px", fontWeight: "700", color: "#166534", margin: "0 0 4px" }}>
              {lang === "ar" ? "كيف تعمل الحملات؟" : "How campaigns work?"}
            </p>
            <p style={{ fontSize: "13px", color: "#166534", margin: 0, lineHeight: 1.6 }}>
              {lang === "ar"
                ? "عندما تنشر حملة: ① يوصل إشعار فوري لكل المستخدمين ② تظهر في صفحة /campaigns للجميع ③ بانر ملفت على منتجات متجرك ④ تختفي تلقائياً بعد انتهاء المدة"
                : "When you publish: ① Instant notification to all users ② Appears on /campaigns ③ Banner on your products ④ Auto-disappears after end date"}
            </p>
          </div>
        </div>

        {/* فورم */}
        {showForm && (
          <div style={{ background: "white", borderRadius: "16px", border: "1.5px solid #e2e8f0", padding: "28px", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 20px" }}>
              {lang === "ar" ? "إنشاء حملة جديدة" : "Create New Campaign"}
            </h3>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>
                {error}
              </div>
            )}

            {/* معاينة البانر */}
            <div style={{ background: form.banner_color, borderRadius: "12px", padding: "14px 20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "24px" }}>📢</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: "white", fontWeight: "800", fontSize: "15px", margin: "0 0 2px" }}>
                  {form.title || (lang === "ar" ? "عنوان الحملة" : "Campaign Title")}
                </p>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", margin: 0 }}>
                  {form.discount_text || (lang === "ar" ? "نص الخصم..." : "Discount text...")}
                </p>
              </div>
              {form.coupon_id && coupons.find(c => c.id == form.coupon_id) && (
                <div style={{ background: "rgba(255,255,255,0.2)", border: "1px dashed rgba(255,255,255,0.5)", borderRadius: "8px", padding: "6px 12px", textAlign: "center" }}>
                  <p style={{ color: "white", fontSize: "10px", margin: "0 0 2px", fontWeight: "600" }}>COUPON</p>
                  <p style={{ color: "white", fontSize: "14px", fontWeight: "800", margin: 0, fontFamily: "monospace" }}>
                    {coupons.find(c => c.id == form.coupon_id)?.code}
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  {lang === "ar" ? "عنوان الحملة *" : "Campaign Title *"}
                </label>
                <input value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder={lang === "ar" ? "مثال: تخفيضات نهاية الموسم 🔥" : "e.g. End of Season Sale 🔥"}
                  style={inp}
                  onFocus={e => e.target.style.borderColor = "#22c55e"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  {lang === "ar" ? "نص الخصم (يظهر كبير)" : "Discount Text"}
                </label>
                <input value={form.discount_text}
                  onChange={e => setForm(f => ({ ...f, discount_text: e.target.value }))}
                  placeholder={lang === "ar" ? "مثال: خصم 30% على جميع الموبايلات!" : "e.g. 30% off all mobiles!"}
                  style={inp}
                  onFocus={e => e.target.style.borderColor = "#22c55e"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  {lang === "ar" ? "ربط كوبون (اختياري)" : "Link Coupon (optional)"}
                </label>
                <select value={form.coupon_id}
                  onChange={e => setForm(f => ({ ...f, coupon_id: e.target.value }))}
                  style={{ ...inp, cursor: "pointer" }}
                  onFocus={e => e.target.style.borderColor = "#22c55e"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                  <option value="">{lang === "ar" ? "بدون كوبون" : "No coupon"}</option>
                  {coupons.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.discount_type === "percent" ? `${c.discount_value}%` : `${c.discount_value} ₪`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  {lang === "ar" ? "تاريخ الانتهاء *" : "End Date *"}
                </label>
                <input
                  type="datetime-local"
                  onChange={handleEndsAtChange}
                  style={inp}
                  onFocus={e => e.target.style.borderColor = "#22c55e"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  {lang === "ar" ? "لون البانر" : "Banner Color"}
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {COLORS.map(c => (
                    <button key={c.value} onClick={() => setForm(f => ({ ...f, banner_color: c.value }))}
                      title={c.label}
                      style={{ width: "36px", height: "36px", borderRadius: "50%", background: c.value, border: form.banner_color === c.value ? "3px solid #0f172a" : "2px solid transparent", cursor: "pointer", boxShadow: form.banner_color === c.value ? `0 0 0 2px white, 0 0 0 4px ${c.value}` : "none", transition: "all 0.15s" }} />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleSave} disabled={saving}
                style={{ padding: "11px 24px", background: saving ? "#86efac" : "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? "⏳ " + (lang === "ar" ? "جاري النشر..." : "Publishing...") : "📢 " + (lang === "ar" ? "نشر الحملة" : "Publish Campaign")}
              </button>
              <button onClick={() => { setShowForm(false); setError(""); endsAtRef.current = ""; }}
                style={{ padding: "11px 20px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "10px", fontSize: "14px", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        )}

        {/* قائمة الحملات */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>⏳</div>
        ) : campaigns.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", background: "white", borderRadius: "16px", border: "1.5px dashed #e2e8f0" }}>
            <div style={{ fontSize: "52px", marginBottom: "14px" }}>📢</div>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#64748b", marginBottom: "16px" }}>
              {lang === "ar" ? "لا توجد حملات بعد" : "No campaigns yet"}
            </p>
            <button onClick={() => setShowForm(true)}
              style={{ padding: "10px 24px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
              {lang === "ar" ? "أطلق أول حملة" : "Launch First Campaign"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {campaigns.map(c => {
              const isExpired = new Date(c.ends_at) < new Date();
              const remaining = timeLeft(c.ends_at);
              return (
                <div key={c.id} style={{ borderRadius: "16px", overflow: "hidden", border: "1.5px solid #e2e8f0", opacity: isExpired ? 0.6 : 1 }}>
                  <div style={{ background: c.banner_color, padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "22px" }}>📢</span>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <p style={{ color: "white", fontWeight: "800", fontSize: "16px", margin: "0 0 2px" }}>{c.title}</p>
                      {c.discount_text && <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px", margin: 0 }}>{c.discount_text}</p>}
                    </div>
                    {c.coupon_code && (
                      <div style={{ background: "rgba(255,255,255,0.2)", border: "1px dashed rgba(255,255,255,0.6)", borderRadius: "8px", padding: "6px 14px", textAlign: "center", flexShrink: 0 }}>
                        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "9px", margin: "0 0 2px", fontWeight: "600", textTransform: "uppercase" }}>COUPON</p>
                        <p style={{ color: "white", fontSize: "15px", fontWeight: "900", margin: 0, fontFamily: "monospace", letterSpacing: "2px" }}>{c.coupon_code}</p>
                      </div>
                    )}
                    {remaining && (
                      <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "6px 12px", textAlign: "center", flexShrink: 0 }}>
                        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "9px", margin: "0 0 1px" }}>{lang === "ar" ? "ينتهي خلال" : "Ends in"}</p>
                        <p style={{ color: "white", fontSize: "13px", fontWeight: "700", margin: 0 }}>{remaining}</p>
                      </div>
                    )}
                  </div>
                  <div style={{ background: "white", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>👁 {c.views_count || 0} {lang === "ar" ? "مشاهدة" : "views"}</span>
                      <span style={{ fontSize: "12px", color: isExpired ? "#dc2626" : "#64748b" }}>
                        ⏰ {isExpired ? (lang === "ar" ? "منتهية" : "Expired") : new Date(c.ends_at).toLocaleDateString("ar-PS")}
                      </span>
                      <span style={{ background: c.is_active && !isExpired ? "#f0fdf4" : "#f8fafc", color: c.is_active && !isExpired ? "#16a34a" : "#94a3b8", border: `1px solid ${c.is_active && !isExpired ? "#bbf7d0" : "#e2e8f0"}`, padding: "2px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "700" }}>
                        {isExpired ? (lang === "ar" ? "منتهية" : "Expired") : c.is_active ? (lang === "ar" ? "نشطة" : "Active") : (lang === "ar" ? "متوقفة" : "Paused")}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {!isExpired && (
                        <button onClick={() => toggleActive(c)}
                          style={{ padding: "7px 14px", borderRadius: "8px", border: `1px solid ${c.is_active ? "#fde68a" : "#bbf7d0"}`, background: c.is_active ? "#fefce8" : "#f0fdf4", color: c.is_active ? "#ca8a04" : "#16a34a", cursor: "pointer", fontSize: "12px", fontWeight: "600", fontFamily: "Tajawal, sans-serif" }}>
                          {c.is_active ? (lang === "ar" ? "إيقاف" : "Pause") : (lang === "ar" ? "تفعيل" : "Resume")}
                        </button>
                      )}
                      <button onClick={() => deleteCampaign(c.id)}
                        style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontSize: "12px" }}>
                        🗑️
                      </button>
                    </div>
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