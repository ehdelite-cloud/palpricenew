import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../../components/DashboardSidebar";
import SpecsForm from "../../components/SpecsForm";
import ImagePicker from "../../components/ImagePicker";

const VARIANT_FIELDS = {
  storage:  { ar: "السعة / الذاكرة", en: "Storage",  icon: "💾", placeholder: "256GB", suggestions: ["64GB","128GB","256GB","512GB","1TB"] },
  color:    { ar: "اللون",            en: "Color",    icon: "🎨", placeholder: "Black", suggestions: ["Black","White","Blue","Red","Green","Gold","Silver","Purple","Pink"] },
  edition:  { ar: "الإصدار / الباقة", en: "Edition",  icon: "📦", placeholder: "Pro",   suggestions: ["Pro","Plus","Ultra","Max","Lite","Standard","FE"] },
  size:     { ar: "الحجم / المقاس",   en: "Size",    icon: "📐", placeholder: "55\"",  suggestions: ["43\"","50\"","55\"","65\"","75\"","32\"","27\"","24\""] },
};

export default function AddProduct({ lang = "ar" }) {
  const navigate  = useNavigate();
  const storeId   = localStorage.getItem("storeId");
  const storeName = localStorage.getItem("storeName") || "";

  const [step, setStep] = useState(1);

  // Group search
  const [groupQuery, setGroupQuery]       = useState("");
  const [groupResults, setGroupResults]   = useState([]);
  const [searchingGroup, setSearchingGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [createNewGroup, setCreateNewGroup] = useState(false);

  // New group fields
  const [groupName, setGroupName]         = useState("");
  const [groupBrand, setGroupBrand]       = useState("");
  const [groupCategoryId, setGroupCategoryId] = useState("");

  // Variant fields
  const [variantStorage, setVariantStorage] = useState("");
  const [variantColor, setVariantColor]     = useState("");
  const [variantEdition, setVariantEdition] = useState("");
  const [variantSize, setVariantSize]       = useState("");
  const [price, setPrice]                   = useState("");
  const [imageUrl, setImageUrl]             = useState("");
  const [mainImageFile, setMainImageFile]   = useState(null);
  const [images, setImages]                 = useState([]);

  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(false);
  const [uploading, setUploading]       = useState(false);
  const [error, setError]               = useState("");
  const [newProductId, setNewProductId] = useState(null);
  const [duplicateInfo, setDuplicateInfo] = useState(null);

  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.json()).then(d => { if (Array.isArray(d)) setCategories(d); });
  }, []);

  useEffect(() => {
    if (groupQuery.length < 2) { setGroupResults([]); return; }
    const t = setTimeout(() => {
      setSearchingGroup(true);
      fetch(`/api/products/groups/search?q=${encodeURIComponent(groupQuery)}`)
        .then(r => r.json())
        .then(d => { if (Array.isArray(d)) setGroupResults(d); setSearchingGroup(false); })
        .catch(() => setSearchingGroup(false));
    }, 300);
    return () => clearTimeout(t);
  }, [groupQuery]);

  function buildLabel() {
    const base = selectedGroup?.name || groupName;
    const parts = [base, variantEdition, variantStorage, variantSize, variantColor].filter(Boolean);
    return parts.join(" ");
  }

  async function uploadImages(productId) {
    if (mainImageFile) {
      const fd = new FormData(); fd.append("image", mainImageFile);
      await fetch(`/api/products/${productId}/main-image`, { method: "POST", body: fd });
    }
    for (const img of images) {
      const fd = new FormData(); fd.append("image", img.file);
      await fetch(`/api/products/${productId}/image`, { method: "POST", body: fd });
    }
  }

  async function handleAddPriceOnly(productId) {
    setLoading(true);
    try {
      await fetch("/api/prices", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, store_id: storeId, price: parseFloat(price) })
      });
      navigate("/store/dashboard/products");
    } catch { setError(lang === "ar" ? "حدث خطأ" : "Error"); }
    setLoading(false);
  }

  async function handleSubmit(forceCreate = false) {
    setError(""); setDuplicateInfo(null);
    if (!price || isNaN(parseFloat(price))) return setError(lang === "ar" ? "السعر مطلوب" : "Price required");
    setLoading(true);
    try {
      let groupId = selectedGroup?.id || null;
      if (createNewGroup) {
        if (!groupName.trim() || !groupBrand.trim()) {
          setError(lang === "ar" ? "الاسم والماركة مطلوبان" : "Name and brand required");
          setLoading(false); return;
        }
        const gRes = await fetch("/api/products/groups", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: groupName.trim(), brand: groupBrand.trim(), category_id: groupCategoryId || null })
        });
        const gData = await gRes.json();
        if (!gRes.ok) { setError(gData.error || "Error"); setLoading(false); return; }
        groupId = gData.id;
      }

      const pRes = await fetch("/api/products", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedGroup?.name || groupName,
          brand: selectedGroup?.brand || groupBrand,
          category_id: selectedGroup?.category_id || groupCategoryId || null,
          image: imageUrl || null,
          store_id: storeId, status: "pending",
          group_id: groupId,
          variant_storage: variantStorage || null,
          variant_color:   variantColor   || null,
          variant_edition: variantEdition || null,
          variant_size:    variantSize    || null,
          force_create: forceCreate,
        })
      });
      const pData = await pRes.json();

      if (pRes.status === 409 && pData.error === "duplicate") {
        setDuplicateInfo(pData.existing);
        setLoading(false); return;
      }
      if (!pRes.ok) { setError(pData.error || "Error"); setLoading(false); return; }

      const productId = pData.id;

      await fetch("/api/prices", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, store_id: storeId, price: parseFloat(price) })
      });

      if (images.length > 0 || mainImageFile) { setUploading(true); await uploadImages(productId); setUploading(false); }

      const specs = window._pendingSpecs || [];
      if (specs.length > 0) {
        await fetch(`/api/products/${productId}/specs`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ specs })
        });
        window._pendingSpecs = [];
      }

      setNewProductId(productId);
      setStep(4);
    } catch (err) {
      setError(err.message || "Error");
    }
    setLoading(false);
  }

  const inp = { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box", fontFamily: "Tajawal, sans-serif", outline: "none" };
  const lbl = { display: "block", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" };
  const card = { background: "white", borderRadius: "14px", border: "1.5px solid #e2e8f0", padding: "24px", marginBottom: "20px" };

  // Step 4 — success
  if (step === 4 && newProductId) {
    const catId = selectedGroup?.category_id || groupCategoryId;
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
        <DashboardSidebar lang={lang} />
        <main style={{ flex: 1, padding: "40px", maxWidth: "640px" }}>
          <div style={{ ...card, border: "2px solid #22c55e" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <span style={{ fontSize: "32px" }}>✅</span>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{lang === "ar" ? "تمت الإضافة بنجاح!" : "Added successfully!"}</h3>
                <p style={{ color: "#64748b", fontSize: "13px", margin: "2px 0 0" }}>{lang === "ar" ? "المنتج بانتظار موافقة الإدارة" : "Awaiting admin approval"}</p>
              </div>
            </div>
            {catId && <SpecsForm productId={newProductId} categoryId={catId} lang={lang} />}
            <button onClick={() => navigate("/store/dashboard/products")}
              style={{ marginTop: "16px", width: "100%", padding: "11px", background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
              {lang === "ar" ? "✓ الانتقال لمنتجاتي" : "✓ Go to My Products"}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <DashboardSidebar lang={lang} />
      <main style={{ flex: 1, padding: "40px" }}>

        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
            ➕ {lang === "ar" ? "إضافة منتج" : "Add Product"}
          </h1>
          <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>{lang === "ar" ? `إضافة منتج لـ ${storeName}` : `Adding to ${storeName}`}</p>
        </div>

        <div style={{ maxWidth: "620px" }}>
          {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "10px", fontSize: "13px", marginBottom: "16px" }}>❌ {error}</div>}

          {/* ========== STEP 1-2: بحث المجموعة ========== */}
          {step <= 2 && (
            <div style={card}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px" }}>🔍 {lang === "ar" ? "ابحث عن المنتج" : "Search Product"}</h3>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 18px" }}>{lang === "ar" ? "ابحث أولاً — إذا موجود اختره، وإلا أضفه جديداً" : "Search first — select if exists, or add new"}</p>

              {!selectedGroup && !createNewGroup && (
                <div style={{ position: "relative", marginBottom: "12px" }}>
                  <input value={groupQuery} onChange={e => setGroupQuery(e.target.value)}
                    placeholder={lang === "ar" ? "مثال: iPhone 15 Pro..." : "e.g. iPhone 15 Pro..."}
                    style={inp} onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                  {searchingGroup && <p style={{ fontSize: "12px", color: "#94a3b8", margin: "6px 0 0" }}>⏳ {lang === "ar" ? "جاري البحث..." : "Searching..."}</p>}

                  {groupResults.length > 0 && (
                    <div style={{ position: "absolute", top: "46px", left: 0, width: "100%", background: "white", border: "1.5px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 100, overflow: "hidden" }}>
                      <div style={{ padding: "8px 14px", fontSize: "11px", fontWeight: "700", color: "#94a3b8", background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                        {lang === "ar" ? "مجموعات موجودة — اختر لإضافة variant" : "Existing groups"}
                      </div>
                      {groupResults.map(g => (
                        <div key={g.id} onClick={() => { setSelectedGroup(g); setGroupQuery(g.name); setGroupResults([]); setStep(2); }}
                          style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", cursor: "pointer", borderBottom: "1px solid #f1f5f9" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = "white"}>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: "700", color: "#0f172a", margin: 0, fontSize: "14px" }}>{g.name}</p>
                            <p style={{ color: "#64748b", margin: 0, fontSize: "12px" }}>{g.brand} · {g.variant_count || 0} {lang === "ar" ? "موديل" : "models"}{g.best_price ? ` · ${lang === "ar" ? "من" : "from"} ${Number(g.best_price).toLocaleString()} ₪` : ""}</p>
                          </div>
                          <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: "600" }}>{lang === "ar" ? "اختر ←" : "Select →"}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {groupQuery.length >= 2 && !searchingGroup && groupResults.length === 0 && (
                    <div style={{ marginTop: "10px" }}>
                      <button onClick={() => { setCreateNewGroup(true); setGroupName(groupQuery); setStep(2); }}
                        style={{ padding: "9px 18px", background: "#0f172a", color: "white", border: "none", borderRadius: "9px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                        ＋ {lang === "ar" ? `إضافة "${groupQuery}" كمنتج جديد` : `Add "${groupQuery}" as new`}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {selectedGroup && (
                <div style={{ background: "#f0fdf4", border: "1.5px solid #22c55e", borderRadius: "10px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: "700", color: "#0f172a", margin: "0 0 2px" }}>{selectedGroup.name}</p>
                    <p style={{ color: "#22c55e", fontSize: "12px", margin: 0 }}>✓ {selectedGroup.brand} · {lang === "ar" ? "ستضيف variant جديد" : "Adding new variant"}</p>
                  </div>
                  <button onClick={() => { setSelectedGroup(null); setGroupQuery(""); setStep(1); }} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px" }}>✕</button>
                </div>
              )}

              {createNewGroup && (
                <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "10px", border: "1.5px dashed #e2e8f0" }}>
                  <p style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: "0 0 14px" }}>📦 {lang === "ar" ? "بيانات المنتج الجديد" : "New Product"}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <label style={lbl}>{lang === "ar" ? "الاسم *" : "Name *"}</label>
                      <input value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="iPhone 15 Pro" style={inp}
                        onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                    </div>
                    <div>
                      <label style={lbl}>{lang === "ar" ? "الماركة *" : "Brand *"}</label>
                      <input value={groupBrand} onChange={e => setGroupBrand(e.target.value)} placeholder="Apple" style={inp}
                        onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                    </div>
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label style={lbl}>{lang === "ar" ? "الفئة" : "Category"}</label>
                    <select value={groupCategoryId} onChange={e => setGroupCategoryId(e.target.value)} style={inp}
                      onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                      <option value="">{lang === "ar" ? "-- اختر فئة --" : "-- Select --"}</option>
                      {categories.filter(c => c.level === 2).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <button onClick={() => { setCreateNewGroup(false); setGroupQuery(""); setGroupName(""); setGroupBrand(""); }}
                    style={{ fontSize: "12px", color: "#94a3b8", background: "none", border: "none", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                    ← {lang === "ar" ? "إلغاء" : "Cancel"}
                  </button>
                </div>
              )}

              {(selectedGroup || createNewGroup) && (
                <button onClick={() => setStep(3)} disabled={createNewGroup && (!groupName.trim() || !groupBrand.trim())}
                  style={{ marginTop: "16px", width: "100%", padding: "11px", background: "#22c55e", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                  {lang === "ar" ? "التالي: تحديد المواصفات ←" : "Next: Set Variants →"}
                </button>
              )}
            </div>
          )}

          {/* ========== STEP 3: المواصفات + السعر ========== */}
          {step === 3 && (
            <>
              {/* معاينة الاسم */}
              <div style={{ ...card, background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1.5px solid #22c55e" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", margin: "0 0 6px", textTransform: "uppercase" }}>{lang === "ar" ? "الاسم النهائي للمنتج" : "Final Name"}</p>
                <p style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>{buildLabel() || "—"}</p>
                <p style={{ fontSize: "11px", color: "#22c55e", margin: "4px 0 0" }}>{lang === "ar" ? "يتحدث تلقائياً مع كل تغيير" : "Updates automatically"}</p>
              </div>

              {/* المواصفات السحرية */}
              <div style={card}>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px" }}>✨ {lang === "ar" ? "المواصفات السحرية" : "Magic Variants"}</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 18px" }}>{lang === "ar" ? "هذه المواصفات تميز كل موديل وتحدد سعره — أضف ما ينطبق" : "These specs define each model's price — add what applies"}</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {[
                    { key: "storage", value: variantStorage, set: setVariantStorage },
                    { key: "color",   value: variantColor,   set: setVariantColor },
                    { key: "edition", value: variantEdition, set: setVariantEdition },
                    { key: "size",    value: variantSize,    set: setVariantSize },
                  ].map(({ key, value, set }) => (
                    <div key={key}>
                      <label style={lbl}>{VARIANT_FIELDS[key].icon} {VARIANT_FIELDS[key][lang === "ar" ? "ar" : "en"]}</label>
                      <input value={value} onChange={e => set(e.target.value)}
                        placeholder={VARIANT_FIELDS[key].placeholder} style={inp}
                        onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "6px" }}>
                        {VARIANT_FIELDS[key].suggestions.map(s => (
                          <button key={s} onClick={() => set(s)}
                            style={{ padding: "2px 8px", borderRadius: "4px", border: `1px solid ${value === s ? "#22c55e" : "#e2e8f0"}`, background: value === s ? "#f0fdf4" : "white", fontSize: "11px", cursor: "pointer", color: value === s ? "#16a34a" : "#475569", fontFamily: "Tajawal, sans-serif" }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* السعر */}
              <div style={card}>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 14px" }}>💰 {lang === "ar" ? "سعرك لهذا المنتج" : "Your Price"}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" min="0"
                    style={{ ...inp, maxWidth: "200px", border: "1.5px solid #f59e0b", background: "#fffbeb", fontSize: "18px", fontWeight: "700" }}
                    onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#f59e0b"} />
                  <span style={{ fontSize: "18px", fontWeight: "700", color: "#64748b" }}>₪</span>
                </div>
              </div>

              {/* الصورة */}
              <div style={card}>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px" }}>🖼️ {lang === "ar" ? "صورة المنتج" : "Product Image"}</h3>
                <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 14px" }}>{lang === "ar" ? "رابط أو رفع ملف" : "URL or upload"}</p>
                <ImagePicker imageUrl={imageUrl}
                  onUrlChange={(url) => { setImageUrl(url); setMainImageFile(null); }}
                  images={mainImageFile ? [{ preview: URL.createObjectURL(mainImageFile), file: mainImageFile }] : []}
                  onImagesChange={(imgs) => { if (imgs.length > 0) { setMainImageFile(imgs[0].file); setImageUrl(""); } else setMainImageFile(null); }}
                  maxImages={1} lang={lang} />
              </div>

              {/* تنبيه التكرار */}
              {duplicateInfo && (
                <div style={{ ...card, border: "2px solid #f59e0b", background: "#fffbeb" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#92400e", margin: "0 0 10px" }}>⚠️ {lang === "ar" ? "هذا المنتج موجود مسبقاً!" : "Product already exists!"}</h3>
                  <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px" }}>
                    <strong>{duplicateInfo.variant_label || duplicateInfo.name}</strong>
                    {duplicateInfo.best_price && ` · ${Number(duplicateInfo.best_price).toLocaleString()} ₪`}
                  </p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => handleAddPriceOnly(duplicateInfo.id)} disabled={!price || loading}
                      style={{ flex: 1, padding: "10px", background: "#22c55e", color: "white", border: "none", borderRadius: "9px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                      💰 {lang === "ar" ? "أضف سعري فقط" : "Add My Price Only"}
                    </button>
                    <button onClick={() => setDuplicateInfo(null)}
                      style={{ flex: 1, padding: "10px", background: "white", color: "#475569", border: "1.5px solid #e2e8f0", borderRadius: "9px", fontSize: "13px", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                      🔄 {lang === "ar" ? "غيّر المواصفات" : "Change Specs"}
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setStep(1)} style={{ padding: "11px 20px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "10px", fontSize: "14px", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                  ← {lang === "ar" ? "رجوع" : "Back"}
                </button>
                <button onClick={() => handleSubmit(false)} disabled={loading || uploading || !price}
                  style={{ flex: 1, padding: "11px", background: price ? "linear-gradient(135deg, #22c55e, #16a34a)" : "#f1f5f9", color: price ? "white" : "#94a3b8", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: price ? "pointer" : "not-allowed", fontFamily: "Tajawal, sans-serif" }}>
                  {uploading ? "⏳ " + (lang === "ar" ? "جاري الرفع..." : "Uploading...")
                    : loading ? "⏳ " + (lang === "ar" ? "جاري الحفظ..." : "Saving...")
                    : "✅ " + (lang === "ar" ? "إضافة المنتج" : "Add Product")}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}