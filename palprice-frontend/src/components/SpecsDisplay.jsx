import { useState, useEffect } from "react";
import { SPEC_ICONS, CATEGORY_SPECS } from "./specsConfig";

function SpecsDisplay({ productId, categoryId, lang = "ar" }) {
  const [specs, setSpecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/products/${productId}/specs`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setSpecs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  // احصل على label من الـ config
  function getLabel(key) {
    const fields = CATEGORY_SPECS[String(categoryId)] || [];
    const field = fields.find(f => f.key === key);
    if (!field) return key;
    return lang === "ar" ? field.labelAr : field.labelEn;
  }

  if (loading) return null;
  if (specs.length === 0) return null;

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
        📋 {lang === "ar" ? "المواصفات التقنية" : "Specifications"}
      </h2>

      <div style={{
        background: "white",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
        overflow: "hidden"
      }}>
        {specs.map((spec, i) => (
          <div
            key={spec.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "14px 20px",
              borderBottom: i < specs.length - 1 ? "1px solid #f1f5f9" : "none",
              background: i % 2 === 0 ? "white" : "#fafafa",
              gap: "16px"
            }}
          >
            {/* أيقونة + label */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              minWidth: "180px",
              flexShrink: 0
            }}>
              <span style={{
                width: "32px",
                height: "32px",
                background: "#f1f5f9",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                flexShrink: 0
              }}>
                {SPEC_ICONS[spec.spec_key] || "•"}
              </span>
              <span style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#64748b"
              }}>
                {getLabel(spec.spec_key)}
              </span>
            </div>

            {/* القيمة */}
            <span style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#0f172a",
              flex: 1
            }}>
              {spec.spec_value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpecsDisplay;