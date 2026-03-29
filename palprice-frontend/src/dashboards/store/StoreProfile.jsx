import { useEffect, useState, useRef } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";

function StoreProfile({ lang = "ar" }) {
  const [store, setStore] = useState(null);
  const [form, setForm] = useState({
    name: "", city: "", email: "", phone: "",
    whatsapp: "", instagram: "", facebook: "", website: "", address: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoRef = useRef(null);
  const storeId = localStorage.getItem("storeId");

  useEffect(() => {
    if (!storeId) { setLoading(false); return; }
    fetch(`/api/stores/${storeId}`)
      .then(res => res.json())
      .then(data => {
        setStore(data);
        setForm({
          name: data.name || "",
          city: data.city || "",
          email: data.email || "",
          phone: data.phone || "",
          whatsapp: data.whatsapp || "",
          instagram: data.instagram || "",
          facebook: data.facebook || "",
          website: data.website || "",
          address: data.address || "",
        });
        if (data.logo) setLogoPreview(data.logo);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [storeId]);

  function handleLogoSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    setSaving(true); setSuccess(false);
    try {
      let logoUrl = store?.logo || null;
      if (logoFile) {
        setUploadingLogo(true);
        const formData = new FormData();
        formData.append("image", logoFile);
        const uploadRes = await fetch(`/api/stores/${storeId}/logo`, { method: "POST", body: formData });
        if (uploadRes.ok) { const d = await uploadRes.json(); logoUrl = d.logo; }
        setUploadingLogo(false);
      }
      const res = await fetch(`/api/stores/${storeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, logo: logoUrl })
      });
      if (res.ok) {
        const updated = await res.json();
        setStore(updated.store);
        localStorage.setItem("storeName", form.name);
        if (logoUrl) localStorage.setItem("storeLogo", logoUrl);
        setSuccess(true);
        setLogoFile(null);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch { alert(lang === "ar" ? "حدث خطأ، حاول مجدداً" : "Something went wrong"); }
    setSaving(false);
  }

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    border: "1.5px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box",
    background: "#f8fafc", color: "#0f172a", outline: "none", fontFamily: "Tajawal, sans-serif",
    transition: "border-color 0.2s",
  };
  const labelStyle = { display: "block", fontSize: "12px", fontWeight: "700", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" };

  const Field = ({ label, icon, value, onChange, type = "text", placeholder = "" }) => (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>{icon} {label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = "#4ade80"}
        onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <DashboardSidebar lang={lang} />
      <main style={{ flex: 1, padding: "40px", maxWidth: "900px" }}>

        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            🏪 {lang === "ar" ? "الملف الشخصي للمتجر" : "Store Profile"}
          </h1>
          <p style={{ color: "#64748b", marginTop: "4px", fontSize: "14px" }}>
            {lang === "ar" ? "المعلومات تظهر للعملاء في صفحة الأسعار" : "Info shown to customers on price pages"}
          </p>
        </div>

        {loading ? (
          <p style={{ color: "#64748b" }}>{lang === "ar" ? "جاري التحميل..." : "Loading..."}</p>
        ) : !storeId ? (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "24px", color: "#dc2626" }}>
            {lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first"}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

            {/* الشعار */}
            <div style={{ background: "white", borderRadius: "16px", border: "1.5px solid #e2e8f0", padding: "24px", gridColumn: "1 / -1" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                🖼️ {lang === "ar" ? "شعار المتجر" : "Store Logo"}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "16px", background: "#f1f5f9", border: "2px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                  {logoPreview
                    ? <img src={logoPreview.startsWith("/") ? `/api${logoPreview}` : logoPreview} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                    : <span style={{ fontSize: "32px" }}>🏪</span>}
                </div>
                <div>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "#f1f5f9", border: "1.5px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontSize: "13px", color: "#475569", fontWeight: "600" }}>
                    📁 {lang === "ar" ? "اختر شعار" : "Choose Logo"}
                    <input ref={logoRef} type="file" accept="image/*" onChange={handleLogoSelect} style={{ display: "none" }} />
                  </label>
                  <p style={{ fontSize: "11px", color: "#94a3b8", margin: "6px 0 0" }}>JPG, PNG, WebP — {lang === "ar" ? "حد أقصى 2MB" : "max 2MB"}</p>
                  {logoFile && <p style={{ fontSize: "12px", color: "#15803d", margin: "4px 0 0", fontWeight: "600" }}>✓ {logoFile.name}</p>}
                </div>
              </div>
            </div>

            {/* معلومات أساسية */}
            <div style={{ background: "white", borderRadius: "16px", border: "1.5px solid #e2e8f0", padding: "24px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                📋 {lang === "ar" ? "معلومات أساسية" : "Basic Info"}
              </h3>
              <Field label={lang === "ar" ? "اسم المتجر" : "Store Name"} icon="🏪" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Field label={lang === "ar" ? "المدينة" : "City"} icon="📍" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder={lang === "ar" ? "مثال: رام الله" : "e.g. Ramallah"} />
              <Field label={lang === "ar" ? "العنوان التفصيلي" : "Address"} icon="🗺️" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder={lang === "ar" ? "الشارع والحي" : "Street and neighborhood"} />
              <Field label={lang === "ar" ? "البريد الإلكتروني" : "Email"} icon="📧" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>

            {/* معلومات التواصل */}
            <div style={{ background: "white", borderRadius: "16px", border: "1.5px solid #e2e8f0", padding: "24px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                📞 {lang === "ar" ? "وسائل التواصل" : "Contact Info"}
              </h3>
              <Field label={lang === "ar" ? "رقم الهاتف" : "Phone"} icon="📞" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+970 59..." />
              <Field label="WhatsApp" icon="💬" type="tel" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="+970 59..." />
              <Field label="Instagram" icon="📸" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder="username" />
              <Field label="Facebook" icon="👍" value={form.facebook} onChange={e => setForm({ ...form, facebook: e.target.value })} placeholder="page-name" />
              <Field label={lang === "ar" ? "الموقع الإلكتروني" : "Website"} icon="🌐" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://..." />
            </div>

            {/* زر الحفظ + رسالة نجاح */}
            <div style={{ gridColumn: "1 / -1" }}>
              {success && (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", marginBottom: "16px", fontWeight: "600" }}>
                  ✅ {lang === "ar" ? "تم الحفظ بنجاح! المعلومات ستظهر للعملاء في صفحة الأسعار." : "Saved! Info will appear to customers on price pages."}
                </div>
              )}
              <button onClick={handleSave} disabled={saving || uploadingLogo}
                style={{ padding: "12px 32px", background: saving ? "#86efac" : "#15803d", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: saving ? "not-allowed" : "pointer", fontFamily: "Tajawal, sans-serif", boxShadow: "0 4px 12px rgba(21,128,61,0.25)" }}>
                {uploadingLogo ? (lang === "ar" ? "⏳ جاري رفع الشعار..." : "⏳ Uploading...")
                  : saving ? (lang === "ar" ? "⏳ جاري الحفظ..." : "⏳ Saving...")
                  : (lang === "ar" ? "💾 حفظ التغييرات" : "💾 Save Changes")}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default StoreProfile;