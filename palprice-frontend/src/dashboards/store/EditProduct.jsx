import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardSidebar from "../../components/DashboardSidebar";
import ProductForm from "../../components/ProductForm";
import SpecsForm from "../../components/SpecsForm";
import ImagePicker from "../../components/ImagePicker";

function EditProduct({ lang = "ar" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [existingImages, setExistingImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [mainImageFile, setMainImageFile] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        setInitialData(data);
        if (data?.image) setImageUrl(data.image);
        setLoading(false);
      });

    fetch(`/api/products/${id}/images`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setExistingImages(data); });
  }, [id]);

  async function handleSubmit(form) {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, image: imageUrl || form.image || null })
    });

    if (!res.ok) { alert(lang === "ar" ? "حدث خطأ" : "Error"); return; }

    setUploadingImages(true);
    if (mainImageFile) {
      const formData = new FormData();
      formData.append("image", mainImageFile);
      await fetch(`/api/products/${id}/main-image`, { method: "POST", body: formData });
    }
    for (const img of newImages) {
      const formData = new FormData();
      formData.append("image", img.file);
      await fetch(`/api/products/${id}/image`, { method: "POST", body: formData });
    }
    setUploadingImages(false);
    navigate("/store/dashboard/products");
  }

  function deleteExistingImage(imageId) {
    if (!window.confirm(lang === "ar" ? "حذف هذه الصورة؟" : "Delete this image?")) return;
    fetch(`/api/images/${imageId}`, { method: "DELETE" })
      .then(() => setExistingImages(prev => prev.filter(i => i.id !== imageId)));
  }

  const card = { background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "28px", marginBottom: "20px" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <DashboardSidebar lang={lang} />
      <main style={{ flex: 1, padding: "40px" }}>

        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            ✏️ {lang === "ar" ? "تعديل المنتج" : "Edit Product"}
          </h1>
          <p style={{ color: "#64748b", marginTop: "4px", fontSize: "14px" }}>{initialData?.name}</p>
        </div>

        {loading ? (
          <p style={{ color: "#64748b" }}>{lang === "ar" ? "جاري التحميل..." : "Loading..."}</p>
        ) : (
          <div style={{ maxWidth: "600px" }}>

            {/* معلومات المنتج */}
            <div style={card}>
              <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", marginBottom: "20px" }}>
                {lang === "ar" ? "معلومات المنتج" : "Product Info"}
              </h3>
              <ProductForm onSubmit={handleSubmit} initialData={initialData} lang={lang} />
            </div>

            {/* الصورة الرئيسية */}
            <div style={card}>
              <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", marginBottom: "6px" }}>
                🖼️ {lang === "ar" ? "الصورة الرئيسية" : "Main Image"}
              </h3>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
                {lang === "ar" ? "تظهر في كرت المنتج وصفحته — رابط أو رفع ملف" : "Shown on card and product page — URL or upload"}
              </p>
              <ImagePicker
                imageUrl={imageUrl}
                onUrlChange={(url) => { setImageUrl(url); setMainImageFile(null); }}
                images={mainImageFile ? [{ preview: URL.createObjectURL(mainImageFile), file: mainImageFile }] : []}
                onImagesChange={(imgs) => {
                  if (imgs.length > 0) { setMainImageFile(imgs[0].file); setImageUrl(""); }
                  else setMainImageFile(null);
                }}
                maxImages={1}
                lang={lang}
              />

              {uploadingImages && (
                <p style={{ color: "#22c55e", fontSize: "13px", marginTop: "12px", fontWeight: "600" }}>
                  {lang === "ar" ? "جاري رفع الصور..." : "Uploading..."}
                </p>
              )}

              {(mainImageFile || (imageUrl && imageUrl !== initialData?.image)) && (
                <button
                  onClick={async () => {
                    setUploadingImages(true);
                    if (mainImageFile) {
                      const formData = new FormData();
                      formData.append("image", mainImageFile);
                      await fetch(`/api/products/${id}/main-image`, { method: "POST", body: formData });
                      setMainImageFile(null);
                    } else if (imageUrl) {
                      await fetch(`/api/products/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ image: imageUrl })
                      });
                    }
                    setUploadingImages(false);
                    alert(lang === "ar" ? "✅ تم حفظ الصورة" : "✅ Image saved");
                  }}
                  style={{ marginTop: "14px", width: "100%", padding: "10px", background: "#22c55e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "Tajawal, sans-serif" }}>
                  💾 {lang === "ar" ? "حفظ الصورة الرئيسية" : "Save Main Image"}
                </button>
              )}
            </div>

            {/* الصور الإضافية */}
            <div style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: 0 }}>
                  📷 {lang === "ar" ? "صور إضافية" : "Additional Images"}
                </h3>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  {existingImages.length + newImages.length}/5
                </span>
              </div>

              {/* الصور الموجودة */}
              {existingImages.length > 0 && (
                <div style={{ marginBottom: "14px" }}>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "10px" }}>
                    {lang === "ar" ? "الصور الحالية:" : "Current images:"}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "10px" }}>
                    {existingImages.map(img => (
                      <div key={img.id} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                        <img src={`/api${img.image_url}`} alt="" style={{ width: "100%", height: "80px", objectFit: "cover", display: "block" }} />
                        <button onClick={() => deleteExistingImage(img.id)} style={{ position: "absolute", top: "4px", right: "4px", width: "20px", height: "20px", borderRadius: "50%", background: "rgba(220,38,38,0.85)", color: "white", border: "none", cursor: "pointer", fontSize: "11px", padding: 0 }}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* صور جديدة */}
              {newImages.length > 0 && (
                <div style={{ marginBottom: "14px" }}>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "#22c55e", marginBottom: "10px" }}>
                    {lang === "ar" ? "صور جديدة:" : "New images:"}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "10px" }}>
                    {newImages.map((img, i) => (
                      <div key={i} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1.5px solid #22c55e" }}>
                        <img src={img.preview} alt="" style={{ width: "100%", height: "80px", objectFit: "cover", display: "block" }} />
                        <button onClick={() => setNewImages(p => p.filter((_, j) => j !== i))} style={{ position: "absolute", top: "4px", right: "4px", width: "20px", height: "20px", borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "white", border: "none", cursor: "pointer", fontSize: "11px", padding: 0 }}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* زر حفظ الصور الجديدة */}
              {newImages.length > 0 && (
                <button
                  onClick={async () => {
                    setUploadingImages(true);
                    for (const img of newImages) {
                      const formData = new FormData();
                      formData.append("image", img.file);
                      await fetch(`/api/products/${id}/image`, { method: "POST", body: formData });
                    }
                    const res = await fetch(`/api/products/${id}/images`);
                    const data = await res.json();
                    if (Array.isArray(data)) setExistingImages(data);
                    setNewImages([]);
                    setUploadingImages(false);
                    alert(lang === "ar" ? "✅ تم رفع الصور" : "✅ Images uploaded");
                  }}
                  style={{ marginBottom: "12px", width: "100%", padding: "10px", background: "#22c55e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "Tajawal, sans-serif" }}>
                  💾 {lang === "ar" ? `حفظ الصور الجديدة (${newImages.length})` : `Save New Images (${newImages.length})`}
                </button>
              )}

              {/* إضافة صور جديدة */}
              {existingImages.length + newImages.length < 5 && (
                <label style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "16px", borderRadius: "10px", border: "2px dashed #e2e8f0", cursor: "pointer", background: "#f8fafc", transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#22c55e"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}>
                  <span style={{ fontSize: "22px" }}>📁</span>
                  <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
                    {lang === "ar" ? `إضافة صور (${5 - existingImages.length - newImages.length} متبقية)` : `Add images (${5 - existingImages.length - newImages.length} remaining)`}
                  </span>
                  <input type="file" multiple accept="image/*" onChange={e => {
                    const files = Array.from(e.target.files);
                    const remaining = 5 - existingImages.length - newImages.length;
                    const imgs = files.slice(0, remaining).map(f => ({ file: f, preview: URL.createObjectURL(f) }));
                    setNewImages(p => [...p, ...imgs]);
                  }} style={{ display: "none" }} />
                </label>
              )}
            </div>

            {/* المواصفات */}
            <div style={card}>
              <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", marginBottom: "6px" }}>
                📋 {lang === "ar" ? "المواصفات التقنية" : "Technical Specs"}
              </h3>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>
                {lang === "ar" ? "أضف أو عدّل مواصفات المنتج" : "Add or edit product specs"}
              </p>
              <SpecsForm productId={id} categoryId={initialData?.category_id} lang={lang} />
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default EditProduct;