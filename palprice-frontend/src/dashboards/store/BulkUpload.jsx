import { useState, useRef } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";

const CATEGORY_TEMPLATES = [
  { id: "1", name: "موبايلات 📱", sheet: "موبايلات" },
  { id: "2", name: "لابتوبات 💻", sheet: "لابتوبات" },
  { id: "3", name: "تابلت 📟", sheet: "تابلت" },
  { id: "4", name: "سماعات 🎧", sheet: "سماعات" },
  { id: "5", name: "شاشات 🖥️", sheet: "شاشات" },
];

function BulkUpload({ lang = "ar" }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const storeId = localStorage.getItem("storeId");

  function handleFile(f) {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls"].includes(ext)) {
      alert(lang === "ar" ? "يرجى رفع ملف Excel (.xlsx)" : "Please upload an Excel file (.xlsx)");
      return;
    }
    setFile(f);
    setResult(null);
  }

  async function handleUpload() {
    if (!file || !storeId) return;
    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("store_id", storeId);

    try {
      const res = await fetch("/api/products/bulk-upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "فشل الاتصال بالسيرفر" });
    }
    setUploading(false);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <DashboardSidebar lang={lang} />

      <main style={{ flex: 1, padding: "32px" }}>

        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            📊 {lang === "ar" ? "رفع منتجات بالجملة" : "Bulk Upload Products"}
          </h1>
          <p style={{ color: "#64748b", marginTop: "6px", fontSize: "14px" }}>
            {lang === "ar" ? "ارفع ملف Excel يحتوي على عشرات المنتجات دفعة واحدة" : "Upload an Excel file with multiple products at once"}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", maxWidth: "900px" }}>

          {/* STEP 1 — Template */}
          <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#0f172a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700" }}>1</div>
              <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: 0 }}>
                {lang === "ar" ? "حمّل نموذج Excel" : "Download Excel Template"}
              </h2>
            </div>

            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px", lineHeight: 1.6 }}>
              {lang === "ar"
                ? "النموذج يحتوي على شيت لكل فئة. اختر الفئة الصحيحة وأضف منتجاتك."
                : "The template has a sheet for each category. Pick the right one and add your products."}
            </p>

            <a href="/palprice_products_template.xlsx" download
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "#f0fdf4", border: "1.5px solid #22c55e", borderRadius: "10px", textDecoration: "none", color: "#0f172a", fontSize: "14px", fontWeight: "600", marginBottom: "16px", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#dcfce7"}
              onMouseLeave={e => e.currentTarget.style.background = "#f0fdf4"}
            >
              <span style={{ fontSize: "20px" }}>📥</span>
              <div>
                <p style={{ margin: 0, fontWeight: "600", color: "#0f172a", fontSize: "13px" }}>
                  {lang === "ar" ? "تحميل النموذج" : "Download Template"}
                </p>
                <p style={{ margin: 0, color: "#64748b", fontSize: "11px" }}>palprice_products_template.xlsx</p>
              </div>
            </a>

            <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "12px 14px" }}>
              <p style={{ fontSize: "12px", fontWeight: "600", color: "#0f172a", margin: "0 0 8px" }}>
                {lang === "ar" ? "الفئات المتاحة:" : "Available categories:"}
              </p>
              {CATEGORY_TEMPLATES.map(c => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "3px 0" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
                  <span style={{ fontSize: "12px", color: "#475569" }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 2 — Instructions */}
          <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#0f172a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700" }}>2</div>
              <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: 0 }}>
                {lang === "ar" ? "أضف منتجاتك في الملف" : "Fill in your products"}
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { icon: "✅", text: lang === "ar" ? "اسم المنتج والماركة والسعر إلزامية" : "Name, brand & price are required" },
                { icon: "📝", text: lang === "ar" ? "اكتب كل منتج في صف واحد" : "One product per row" },
                { icon: "🖼️", text: lang === "ar" ? "أضف روابط الصور (اختياري)" : "Add image URLs (optional)" },
                { icon: "⚙️", text: lang === "ar" ? "أضف المواصفات التقنية لكل منتج" : "Fill technical specs for better visibility" },
                { icon: "⚠️", text: lang === "ar" ? "لا تغير أسماء الأعمدة أو رؤوسها" : "Don't change column headers" },
                { icon: "⏳", text: lang === "ar" ? "كل المنتجات ستحتاج موافقة الإدارة" : "All products need admin approval" },
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "14px", flexShrink: 0 }}>{tip.icon}</span>
                  <span style={{ fontSize: "12px", color: "#475569", lineHeight: 1.5 }}>{tip.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 3 — Upload */}
          <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px", gridColumn: "1 / -1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#0f172a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700" }}>3</div>
              <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: 0 }}>
                {lang === "ar" ? "ارفع الملف" : "Upload the file"}
              </h2>
            </div>

            {/* Dropzone */}
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              style={{
                border: `2px dashed ${dragOver ? "#22c55e" : file ? "#22c55e" : "#e2e8f0"}`,
                borderRadius: "12px", padding: "40px 20px", textAlign: "center",
                cursor: "pointer", background: dragOver ? "#f0fdf4" : file ? "#f0fdf4" : "#f8fafc",
                transition: "all 0.2s", marginBottom: "16px"
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>
                {file ? "📊" : "📤"}
              </div>
              {file ? (
                <div>
                  <p style={{ color: "#0f172a", fontWeight: "600", margin: "0 0 4px", fontSize: "14px" }}>{file.name}</p>
                  <p style={{ color: "#22c55e", fontSize: "12px", margin: 0 }}>
                    {(file.size / 1024).toFixed(1)} KB • {lang === "ar" ? "جاهز للرفع" : "Ready to upload"}
                  </p>
                  <button onClick={e => { e.stopPropagation(); setFile(null); setResult(null); }}
                    style={{ marginTop: "8px", padding: "4px 12px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "5px", cursor: "pointer", fontSize: "12px", fontFamily: "Tajawal, sans-serif" }}>
                    ✕ {lang === "ar" ? "إزالة" : "Remove"}
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ color: "#0f172a", fontWeight: "600", margin: "0 0 6px", fontSize: "14px" }}>
                    {lang === "ar" ? "اسحب الملف هنا أو اضغط للاختيار" : "Drag file here or click to browse"}
                  </p>
                  <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>Excel (.xlsx, .xls) • حجم أقصى 10MB</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={e => handleFile(e.target.files[0])} style={{ display: "none" }} />
            </div>

            <button onClick={handleUpload} disabled={!file || uploading}
              style={{
                width: "100%", padding: "13px", borderRadius: "10px", border: "none",
                background: file && !uploading ? "#0f172a" : "#f1f5f9",
                color: file && !uploading ? "white" : "#94a3b8",
                fontSize: "15px", fontWeight: "700", cursor: file && !uploading ? "pointer" : "not-allowed",
                fontFamily: "Tajawal, sans-serif", transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
              }}>
              {uploading ? (
                <>
                  <div style={{ width: "16px", height: "16px", border: "2px solid #e2e8f0", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  {lang === "ar" ? "جاري المعالجة..." : "Processing..."}
                </>
              ) : (
                <>📤 {lang === "ar" ? "رفع وإضافة المنتجات" : "Upload Products"}</>
              )}
            </button>
          </div>

          {/* RESULT */}
          {result && (
            <div style={{ gridColumn: "1 / -1", borderRadius: "14px", border: `1px solid ${result.error ? "#fecaca" : "#bbf7d0"}`, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", background: result.error ? "#fef2f2" : "#f0fdf4", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>{result.error ? "❌" : "✅"}</span>
                <div>
                  <p style={{ color: "#0f172a", fontWeight: "700", margin: 0, fontSize: "14px" }}>
                    {result.error || result.message}
                  </p>
                  {!result.error && (
                    <p style={{ color: "#64748b", fontSize: "12px", margin: "3px 0 0" }}>
                      {lang === "ar" ? "جميع المنتجات بانتظار موافقة الإدارة" : "All products are pending admin approval"}
                    </p>
                  )}
                </div>
              </div>

              {!result.error && (
                <div style={{ padding: "16px 20px", background: "white" }}>
                  <div style={{ display: "flex", gap: "16px", marginBottom: result.errorDetails?.length > 0 ? "16px" : "0" }}>
                    <div style={{ textAlign: "center", flex: 1, background: "#f0fdf4", borderRadius: "8px", padding: "12px" }}>
                      <p style={{ fontSize: "24px", fontWeight: "700", color: "#22c55e", margin: 0 }}>{result.success}</p>
                      <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0" }}>{lang === "ar" ? "منتج أضيف بنجاح" : "Products added"}</p>
                    </div>
                    {result.errors > 0 && (
                      <div style={{ textAlign: "center", flex: 1, background: "#fef2f2", borderRadius: "8px", padding: "12px" }}>
                        <p style={{ fontSize: "24px", fontWeight: "700", color: "#ef4444", margin: 0 }}>{result.errors}</p>
                        <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0" }}>{lang === "ar" ? "خطأ" : "Errors"}</p>
                      </div>
                    )}
                  </div>

                  {result.errorDetails?.length > 0 && (
                    <div style={{ background: "#fef2f2", borderRadius: "8px", padding: "12px" }}>
                      <p style={{ fontSize: "12px", fontWeight: "600", color: "#991b1b", margin: "0 0 8px" }}>
                        {lang === "ar" ? "تفاصيل الأخطاء:" : "Error details:"}
                      </p>
                      {result.errorDetails.map((e, i) => (
                        <p key={i} style={{ fontSize: "12px", color: "#ef4444", margin: "3px 0" }}>
                          صف {e.row}: {e.name} — {e.error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    </div>
  );
}

export default BulkUpload;