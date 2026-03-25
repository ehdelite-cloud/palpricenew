import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";

function ProductImages({ lang = "ar" }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct]           = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages]       = useState([]);
  const [uploading, setUploading]       = useState(false);
  const [deleting, setDeleting]         = useState(null); // id الصورة قيد الحذف
  const [loading, setLoading]           = useState(true);

  const totalImages = existingImages.length + newImages.length;
  const canAddMore  = totalImages < 5;

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));

    fetchImages();
  }, [id]);

  // دالة مركزية لجلب الصور — نستخدمها بعد الرفع والحذف
  function fetchImages() {
    fetch(`/api/products/${id}/images`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setExistingImages(data); });
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    const remaining = 5 - totalImages;
    if (remaining <= 0) return;
    const imgs = files.slice(0, remaining).map(file => ({ file, preview: URL.createObjectURL(file) }));
    setNewImages(prev => [...prev, ...imgs]);
    e.target.value = "";
  }

  function removeNew(index) {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  }

  async function handleUpload() {
    if (newImages.length === 0) return;
    setUploading(true);

    for (const img of newImages) {
      const formData = new FormData();
      formData.append("image", img.file);
      try {
        await fetch(`/api/products/${id}/image`, { method: "POST", body: formData });
      } catch (err) {
        console.log("Upload error:", err);
      }
    }

    setNewImages([]);
    setUploading(false);
    // إعادة جلب الصور من السيرفر — نضمن IDs صحيحة
    fetchImages();
  }

  async function deleteExisting(imageId) {
    if (!window.confirm(lang === "ar" ? "حذف هذه الصورة؟" : "Delete this image?")) return;
    setDeleting(imageId);
    try {
      const res = await fetch(`/api/images/${imageId}`, { method: "DELETE" });
      if (res.ok) {
        // إعادة جلب من السيرفر بدل التحديث المحلي
        await fetchImages();
      } else {
        alert(lang === "ar" ? "حدث خطأ أثناء الحذف" : "Delete failed");
      }
    } catch {
      alert(lang === "ar" ? "حدث خطأ أثناء الحذف" : "Delete failed");
    }
    setDeleting(null);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <DashboardSidebar lang={lang} />

      <main style={{ flex: 1, padding: "40px" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <button onClick={() => navigate("/store/dashboard/products")}
            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "14px", padding: 0, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px", fontFamily: "Tajawal, sans-serif" }}>
            ← {lang === "ar" ? "رجوع لمنتجاتي" : "Back to Products"}
          </button>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            🖼️ {lang === "ar" ? "الصور الإضافية للمنتج" : "Product Images"}
          </h1>
          {product && <p style={{ color: "#64748b", marginTop: "4px", fontSize: "14px" }}>{product.name}</p>}
        </div>

        <div style={{ maxWidth: "700px" }}>

          {/* شريط الحالة */}
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "16px 20px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: totalImages >= 5 ? "#fef2f2" : "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                {totalImages >= 5 ? "⚠️" : "✅"}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#0f172a" }}>{totalImages}/5 {lang === "ar" ? "صورة إضافية" : "images"}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                  {totalImages >= 5 ? (lang === "ar" ? "وصلت للحد الأقصى" : "Maximum reached") : `${5 - totalImages} ${lang === "ar" ? "متبقية" : "remaining"}`}
                </p>
              </div>
            </div>
            <div style={{ width: "120px", height: "6px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: "99px", background: totalImages >= 5 ? "#ef4444" : "#22c55e", width: `${(totalImages / 5) * 100}%`, transition: "width 0.3s" }} />
            </div>
          </div>

          {/* الصور الموجودة */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px", marginBottom: "20px" }}>
              {Array(3).fill().map((_, i) => <div key={i} style={{ height: "130px", borderRadius: "10px", background: "#f1f5f9" }} />)}
            </div>
          ) : existingImages.length > 0 ? (
            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px", marginBottom: "20px" }}>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#64748b", marginBottom: "14px" }}>
                {lang === "ar" ? "الصور الحالية" : "Current Images"}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px" }}>
                {existingImages.map(img => (
                  <div key={img.id} style={{ position: "relative", borderRadius: "10px", overflow: "hidden", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
                    <img
                      src={`/api${img.image_url}`}
                      alt="product"
                      style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }}
                      onError={e => { e.target.style.display = "none"; }}
                    />
                    {/* زر الحذف */}
                    <button
                      onClick={() => deleteExisting(img.id)}
                      disabled={deleting === img.id}
                      style={{
                        position: "absolute", top: "6px", right: "6px",
                        width: "28px", height: "28px", borderRadius: "50%",
                        background: deleting === img.id ? "rgba(100,116,139,0.9)" : "rgba(220,38,38,0.9)",
                        color: "white", border: "none", cursor: deleting === img.id ? "not-allowed" : "pointer",
                        fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center",
                        padding: 0, transition: "all 0.2s"
                      }}>
                      {deleting === img.id ? "⏳" : "✕"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px", marginBottom: "20px", textAlign: "center", color: "#94a3b8" }}>
              <p style={{ fontSize: "13px", margin: 0 }}>
                {lang === "ar" ? "لا توجد صور إضافية بعد — أضف صوراً أدناه" : "No additional images yet"}
              </p>
            </div>
          )}

          {/* صور جديدة للرفع */}
          {newImages.length > 0 && (
            <div style={{ background: "white", borderRadius: "12px", border: "1.5px solid #22c55e", padding: "20px", marginBottom: "20px" }}>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#22c55e", marginBottom: "14px" }}>
                ⬆️ {lang === "ar" ? `${newImages.length} صور جاهزة للرفع` : `${newImages.length} ready to upload`}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                {newImages.map((img, i) => (
                  <div key={i} style={{ position: "relative", borderRadius: "10px", overflow: "hidden", border: "2px solid #22c55e" }}>
                    <img src={img.preview} alt="new" style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} />
                    <button onClick={() => removeNew(i)} style={{
                      position: "absolute", top: "6px", right: "6px", width: "28px", height: "28px",
                      borderRadius: "50%", background: "rgba(0,0,0,0.65)", color: "white",
                      border: "none", cursor: "pointer", fontSize: "13px",
                      display: "flex", alignItems: "center", justifyContent: "center", padding: 0
                    }}>✕</button>
                  </div>
                ))}
              </div>
              <button onClick={handleUpload} disabled={uploading}
                style={{ width: "100%", padding: "11px", background: uploading ? "#86efac" : "#22c55e", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: uploading ? "not-allowed" : "pointer", fontFamily: "Tajawal, sans-serif" }}>
                {uploading ? (lang === "ar" ? "جاري الرفع..." : "Uploading...") : (lang === "ar" ? `⬆️ رفع ${newImages.length} صور` : `⬆️ Upload ${newImages.length} images`)}
              </button>
            </div>
          )}

          {/* منطقة إضافة */}
          {canAddMore && (
            <label style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "28px", borderRadius: "12px", border: "2px dashed #e2e8f0", cursor: "pointer", background: "white", transition: "all 0.2s", textAlign: "center" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.background = "#f0fdf4"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "white"; }}>
              <span style={{ fontSize: "32px" }}>📁</span>
              <div>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#0f172a" }}>
                  {lang === "ar" ? "اختر صور للإضافة" : "Choose images to add"}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#94a3b8" }}>
                  {lang === "ar" ? `${5 - totalImages} صور متبقية — JPG, PNG, WebP` : `${5 - totalImages} remaining — JPG, PNG, WebP`}
                </p>
              </div>
              <input type="file" multiple accept="image/*" onChange={handleFileSelect} style={{ display: "none" }} />
            </label>
          )}

          {!canAddMore && newImages.length === 0 && (
            <div style={{ padding: "16px 20px", borderRadius: "10px", background: "#fef9c3", border: "1px solid #fde047", fontSize: "14px", color: "#854d0e", textAlign: "center" }}>
              {lang === "ar" ? "⚠️ وصلت للحد الأقصى. احذف صورة لإضافة غيرها." : "⚠️ Maximum reached. Delete an image to add another."}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default ProductImages;