import { useState } from "react";

/*
  ImagePicker — يختار بين رابط URL أو رفع ملف
  Props:
    - imageUrl: string (الرابط الحالي)
    - onUrlChange: fn(url) — عند تغيير الرابط
    - images: array — الصور المرفوعة
    - onImagesChange: fn(images) — عند تغيير الصور
    - maxImages: number (default 5)
    - lang: "ar" | "en"
*/
function ImagePicker({ imageUrl = "", onUrlChange, images = [], onImagesChange, maxImages = 5, lang = "ar" }) {
  const [mode, setMode] = useState(imageUrl ? "url" : "upload");

  function handleModeSwitch(newMode) {
    setMode(newMode);
    // مسح الخيار الثاني عند التبديل
    if (newMode === "url") {
      onImagesChange([]);
    } else {
      onUrlChange("");
    }
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    const remaining = maxImages - images.length;
    const newImgs = files.slice(0, remaining).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    onImagesChange([...images, ...newImgs]);
  }

  function removeImage(index) {
    onImagesChange(images.filter((_, i) => i !== index));
  }

  const inp = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    border: "1px solid #e2e8f0", fontSize: "14px",
    background: "#f8fafc", fontFamily: "Tajawal, sans-serif",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s"
  };

  return (
    <div>
      {/* Toggle بين الخيارين */}
      <div style={{ display: "flex", background: "#f1f5f9", borderRadius: "10px", padding: "4px", marginBottom: "16px", width: "fit-content" }}>
        {[
          { key: "url", icon: "🔗", label: lang === "ar" ? "رابط URL" : "URL Link" },
          { key: "upload", icon: "📁", label: lang === "ar" ? "رفع ملف" : "Upload File" },
        ].map(opt => (
          <button key={opt.key} onClick={() => handleModeSwitch(opt.key)}
            style={{
              padding: "7px 18px", borderRadius: "8px", border: "none", cursor: "pointer",
              background: mode === opt.key ? "white" : "transparent",
              color: mode === opt.key ? "#0f172a" : "#64748b",
              fontSize: "13px", fontWeight: mode === opt.key ? "700" : "500",
              fontFamily: "Tajawal, sans-serif",
              boxShadow: mode === opt.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px"
            }}>
            <span>{opt.icon}</span> {opt.label}
          </button>
        ))}
      </div>

      {/* رابط URL */}
      {mode === "url" && (
        <div>
          <input
            type="url"
            value={imageUrl}
            onChange={e => onUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={inp}
            onFocus={e => e.target.style.borderColor = "#22c55e"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"}
          />
          {imageUrl && (
            <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
              <img src={imageUrl} alt="preview"
                style={{ width: "72px", height: "72px", objectFit: "contain", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f8fafc" }}
                onError={e => { e.target.style.display = "none"; }} />
              <div>
                <p style={{ fontSize: "12px", color: "#22c55e", fontWeight: "600", margin: 0 }}>✓ {lang === "ar" ? "معاينة الصورة" : "Image preview"}</p>
                <button onClick={() => onUrlChange("")}
                  style={{ marginTop: "4px", padding: "3px 10px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "5px", fontSize: "12px", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                  {lang === "ar" ? "إزالة" : "Remove"}
                </button>
              </div>
            </div>
          )}
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px" }}>
            {lang === "ar" ? "✓ أسرع — مباشر من الإنترنت بدون رفع" : "✓ Faster — direct from internet, no upload"}
          </p>
        </div>
      )}

      {/* رفع ملف */}
      {mode === "upload" && (
        <div>
          {images.length < maxImages && (
            <label style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
              padding: "20px", borderRadius: "10px", border: "2px dashed #e2e8f0",
              cursor: "pointer", background: "#f8fafc", marginBottom: "12px",
              transition: "border-color 0.2s"
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#22c55e"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}>
              <span style={{ fontSize: "28px" }}>📁</span>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>
                {lang === "ar" ? "اضغط لاختيار صور" : "Click to select images"}
              </span>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                JPG, PNG, WebP • {lang === "ar" ? `${maxImages - images.length} صور متبقية` : `${maxImages - images.length} remaining`}
              </span>
              <input type="file" multiple accept="image/*" onChange={handleFileSelect} style={{ display: "none" }} />
            </label>
          )}

          {images.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "10px" }}>
              {images.map((img, i) => (
                <div key={i} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1.5px solid #22c55e" }}>
                  <img src={img.preview || img} style={{ width: "100%", height: "80px", objectFit: "cover", display: "block" }} />
                  <button onClick={() => removeImage(i)} style={{
                    position: "absolute", top: "4px", right: "4px",
                    width: "20px", height: "20px", borderRadius: "50%",
                    background: "rgba(0,0,0,0.65)", color: "white",
                    border: "none", cursor: "pointer", fontSize: "11px", padding: 0
                  }}>✕</button>
                </div>
              ))}
            </div>
          )}

          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px" }}>
            {lang === "ar" ? "✓ مناسب إذا لم يكن للمنتج رابط صورة" : "✓ Best when product has no image URL"}
          </p>
        </div>
      )}
    </div>
  );
}

export default ImagePicker;