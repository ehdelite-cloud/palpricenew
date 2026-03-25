import { useState, useEffect } from "react";
import { CATEGORY_SPECS, SPEC_ICONS } from "./specsConfig";

function SpecsForm({ productId, categoryId, lang = "ar", previewOnly = false, onSpecsChange }) {
  const [specs, setSpecs] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const specFields = CATEGORY_SPECS[String(categoryId)] || [];

  // جلب المواصفات الموجودة (فقط إذا عندنا productId حقيقي)
  useEffect(() => {
    if (!productId) return;
    fetch(`/api/products/${productId}/specs`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const map = {};
          data.forEach(s => { map[s.spec_key] = s.spec_value; });
          setSpecs(map);
        }
      })
      .catch(() => {});
  }, [productId]);

  function handleChange(key, value) {
    const updated = { ...specs, [key]: value };
    setSpecs(updated);

    // أرسل التحديث للأب إذا previewOnly
    if (previewOnly && onSpecsChange) {
      const specsArray = specFields
        .map(f => ({ key: f.key, value: updated[f.key] || "" }))
        .filter(s => s.value.trim() !== "");
      onSpecsChange(specsArray);
    }
  }

  async function handleSave() {
    if (!productId) return;
    setSaving(true);
    setSaved(false);

    const specsArray = specFields
      .map(f => ({ key: f.key, value: specs[f.key] || "" }))
      .filter(s => s.value.trim() !== "");

    try {
      await fetch(`/api/products/${productId}/specs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specs: specsArray })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(lang === "ar" ? "حدث خطأ" : "Error saving specs");
    }
    setSaving(false);
  }

  if (specFields.length === 0) {
    return (
      <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "8px", color: "#94a3b8", fontSize: "14px", textAlign: "center" }}>
        {lang === "ar" ? "اختر فئة لإضافة المواصفات" : "Select a category to add specs"}
      </div>
    );
  }

  const filledCount = specFields.filter(f => specs[f.key]?.trim()).length;

  return (
    <div>
      {/* شريط التقدم */}
      {specFields.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              {filledCount}/{specFields.length} {lang === "ar" ? "مواصفة مكتملة" : "specs filled"}
            </span>
            {filledCount === specFields.length && (
              <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: "600" }}>✓ {lang === "ar" ? "مكتملة" : "Complete"}</span>
            )}
          </div>
          <div style={{ height: "4px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: "99px", background: "#22c55e",
              width: `${(filledCount / specFields.length) * 100}%`,
              transition: "width 0.3s"
            }} />
          </div>
        </div>
      )}

      {saved && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", marginBottom: "16px" }}>
          ✓ {lang === "ar" ? "تم حفظ المواصفات" : "Specs saved"}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        {specFields.map(field => (
          <div key={field.key}>
            <label style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px"
            }}>
              <span>{SPEC_ICONS[field.key] || "•"}</span>
              {lang === "ar" ? field.labelAr : field.labelEn}
            </label>
            <input
              type="text"
              value={specs[field.key] || ""}
              onChange={e => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              style={{
                width: "100%", padding: "9px 12px", borderRadius: "8px",
                border: specs[field.key] ? "1.5px solid #22c55e" : "1px solid #e2e8f0",
                fontSize: "13px",
                background: specs[field.key] ? "#f0fdf4" : "#f8fafc",
                fontFamily: "Tajawal, sans-serif", outline: "none",
                boxSizing: "border-box", transition: "all 0.2s"
              }}
            />
          </div>
        ))}
      </div>

      {/* زر الحفظ — يظهر فقط إذا عندنا productId حقيقي */}
      {!previewOnly && productId && (
        <button onClick={handleSave} disabled={saving} style={{
          marginTop: "20px", padding: "10px 24px",
          background: saving ? "#86efac" : "#22c55e",
          color: "white", border: "none", borderRadius: "8px",
          fontSize: "14px", fontWeight: "600",
          cursor: saving ? "not-allowed" : "pointer",
          fontFamily: "Tajawal, sans-serif"
        }}>
          {saving
            ? (lang === "ar" ? "جاري الحفظ..." : "Saving...")
            : (lang === "ar" ? "💾 حفظ المواصفات" : "💾 Save Specs")}
        </button>
      )}
    </div>
  );
}

export default SpecsForm;