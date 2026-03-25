import { useEffect, useState, useRef } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";

function StoreProfile({ lang = "ar" }) {
  const [store, setStore] = useState(null);
  const [form, setForm] = useState({ name: "", city: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // شعار المتجر
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
        setForm({ name: data.name || "", city: data.city || "", email: data.email || "" });
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
    setSaving(true);
    setSuccess(false);

    try {
      // رفع الشعار أولاً إذا في
      let logoUrl = store?.logo || null;
      if (logoFile) {
        setUploadingLogo(true);
        const formData = new FormData();
        formData.append("image", logoFile);
        const uploadRes = await fetch(`/api/stores/${storeId}/logo`, {
          method: "POST",
          body: formData
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          logoUrl = uploadData.logo;
        }
        setUploadingLogo(false);
      }

      // حفظ البيانات
      const res = await fetch(`/api/stores/${storeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, logo: logoUrl })
      });

      if (res.ok) {
        const updated = await res.json();
        setStore(updated.store);
        // حفظ اسم المتجر في localStorage عشان الـ Sidebar
        localStorage.setItem("storeName", form.name);
        if (logoUrl) localStorage.setItem("storeLogo", logoUrl);
        setSuccess(true);
        setLogoFile(null);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      alert(lang === "ar" ? "حدث خطأ، حاول مجدداً" : "Something went wrong");
    }
    setSaving(false);
  }

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    border: "1px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box",
    background: "#f8fafc", color: "#0f172a", outline: "none",
    fontFamily: "Tajawal, sans-serif"
  };

  const labelStyle = {
    display: "block", fontSize: "13px", fontWeight: "600",
    color: "#475569", marginBottom: "6px"
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <DashboardSidebar lang={lang} />
      <main style={{ flex: 1, padding: "40px" }}>

        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            🏪 {lang === "ar" ? "الملف الشخصي" : "Store Profile"}
          </h1>
          <p style={{ color: "#64748b", marginTop: "4px", fontSize: "14px" }}>
            {lang === "ar" ? "تعديل معلومات متجرك وشعاره" : "Edit store info and logo"}
          </p>
        </div>

        {loading ? (
          <p style={{ color: "#64748b" }}>{lang === "ar" ? "جاري التحميل..." : "Loading..."}</p>
        ) : !storeId ? (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "24px", color: "#dc2626" }}>
            {lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first"}
          </div>
        ) : (
          <div style={{ maxWidth: "560px" }}>

            {/* Store Logo Card */}
            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "28px", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", marginBottom: "20px" }}>
                {lang === "ar" ? "شعار المتجر" : "Store Logo"}
              </h3>

              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                {/* معاينة الشعار */}
                <div style={{
                  width: "90px", height: "90px", borderRadius: "16px",
                  background: "#f1f5f9", border: "2px solid #e2e8f0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden", flexShrink: 0
                }}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="logo"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <span style={{ fontSize: "36px" }}>🏪</span>
                  )}
                </div>

                <div>
                  <label style={{
                    display: "inline-block", padding: "9px 18px",
                    background: "#f1f5f9", border: "1px solid #e2e8f0",
                    borderRadius: "8px", cursor: "pointer", fontSize: "14px",
                    color: "#475569", fontWeight: "500", marginBottom: "8px"
                  }}>
                    📁 {lang === "ar" ? "اختر شعار" : "Choose Logo"}
                    <input ref={logoRef} type="file" accept="image/*"
                      onChange={handleLogoSelect} style={{ display: "none" }} />
                  </label>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                    {lang === "ar" ? "JPG, PNG, WebP — حد أقصى 2MB" : "JPG, PNG, WebP — max 2MB"}
                  </p>
                  {logoFile && (
                    <p style={{ fontSize: "12px", color: "#22c55e", margin: "4px 0 0", fontWeight: "600" }}>
                      ✓ {logoFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form */}
            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "28px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", marginBottom: "20px" }}>
                {lang === "ar" ? "بيانات المتجر" : "Store Details"}
              </h3>

              {success && (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "12px 16px", borderRadius: "8px", fontSize: "14px", marginBottom: "20px" }}>
                  ✓ {lang === "ar" ? "تم الحفظ بنجاح" : "Saved successfully"}
                </div>
              )}

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>{lang === "ar" ? "اسم المتجر" : "Store Name"}</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>{lang === "ar" ? "المدينة" : "City"}</label>
                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={inputStyle} />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>{lang === "ar" ? "البريد الإلكتروني" : "Email"}</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              </div>

              <button onClick={handleSave} disabled={saving || uploadingLogo} style={{
                padding: "11px 28px", background: saving ? "#86efac" : "#22c55e",
                color: "white", border: "none", borderRadius: "8px",
                fontSize: "14px", fontWeight: "600", cursor: saving ? "not-allowed" : "pointer"
              }}>
                {uploadingLogo
                  ? (lang === "ar" ? "جاري رفع الشعار..." : "Uploading logo...")
                  : saving
                    ? (lang === "ar" ? "جاري الحفظ..." : "Saving...")
                    : (lang === "ar" ? "حفظ التغييرات" : "Save Changes")}
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default StoreProfile;