import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardSidebar from "../../components/DashboardSidebar";
import { CATEGORY_SPECS, SPEC_ICONS } from "../../components/specsConfig";

const CATEGORY_NAMES = {
  1: "موبايلات 📱", 2: "لابتوبات 💻", 3: "تابلت 📟",
  4: "سماعات 🎧", 5: "شاشات 🖥️", 6: "كاميرات 📷",
  7: "أجهزة منزلية 🏠", 8: "ملحقات 🔌",
  9: "أجهزة منزلية 🏠", 10: "موبايلات 📱", 11: "لابتوب وأجهزة لوحية 💻",
  12: "تلفزيونات وشاشات 🖥️", 13: "أجهزة منزلية صغيرة 🍳",
  14: "الجمال والعناية 💄", 15: "ملحقات 🎧"
};

function fixImg(url) {
  if (!url) return "";
  return url.startsWith("/") ? `/api${url}` : url;
}

function SmartAddProduct({ lang = "ar" }) {
  const navigate = useNavigate();
  const storeId = localStorage.getItem("storeId");
  const token   = localStorage.getItem("token");

  const [query, setQuery]           = useState("");
  const [searching, setSearching]   = useState(false);
  const [productData, setProductData] = useState(null);
  const [error, setError]           = useState("");

  // حالة التكرار
  const [duplicateInfo, setDuplicateInfo] = useState(null); // المنتج المكرر
  const [duplicateAction, setDuplicateAction] = useState(null); // "add_price" | "force_create"

  const [price, setPrice]           = useState("");
  const [editedName, setEditedName] = useState("");
  const [editedBrand, setEditedBrand] = useState("");
  const [editedDesc, setEditedDesc] = useState("");
  const [editedSpecs, setEditedSpecs] = useState({});
  const [imageUrl, setImageUrl]     = useState("");

  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  async function handleSearch() {
    if (!query.trim()) return;
    setSearching(true);
    setError(""); setDuplicateInfo(null); setDuplicateAction(null); setProductData(null);

    try {
      const res = await fetch("/api/ai/product-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: query.trim() })
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setSearching(false); return; }

      setProductData(data);
      setEditedName(data.name || query);
      setEditedBrand(data.brand || "");
      setEditedDesc(data.description || "");
      setImageUrl(data.image_url || "");

      const specs = {};
      Object.entries(data.specs || {}).forEach(([k, v]) => {
        if (v && String(v).trim()) specs[k] = String(v).trim();
      });
      setEditedSpecs(specs);
    } catch {
      setError("تعذر الاتصال بالسيرفر");
    }
    setSearching(false);
  }

  // إضافة سعر فقط لمنتج موجود
  async function handleAddPriceOnly() {
    if (!price || isNaN(parseFloat(price))) {
      alert(lang === "ar" ? "يرجى إدخال السعر أولاً" : "Please enter the price");
      return;
    }
    setSaving(true);
    try {
      // تحقق إذا هذا المتجر عنده سعر لهذا المنتج
      const checkRes = await fetch(`/api/prices/product/${duplicateInfo.id}`);
      const prices = await checkRes.json();
      const alreadyHasPrice = Array.isArray(prices) && prices.some(p => String(p.store_id) === String(storeId));

      if (alreadyHasPrice) {
        // حدّث السعر الموجود
        const existing = prices.find(p => String(p.store_id) === String(storeId));
        await fetch(`/api/prices/${existing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price: parseFloat(price) })
        });
        setSavedMsg(lang === "ar" ? "تم تحديث سعرك لهذا المنتج ✅" : "Price updated ✅");
      } else {
        // أضف سعر جديد
        await fetch("/api/prices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: duplicateInfo.id, store_id: storeId, price: parseFloat(price) })
        });
        setSavedMsg(lang === "ar" ? "تم إضافة سعرك للمنتج الموجود ✅" : "Price added to existing product ✅");
      }

      setSaved(true);
      setTimeout(() => navigate("/store/dashboard/products"), 2500);
    } catch {
      alert(lang === "ar" ? "حدث خطأ" : "Error occurred");
    }
    setSaving(false);
  }

  // إضافة منتج جديد بالقوة (موديل مختلف)
  async function handleSave(forceCreate = false) {
    if (!price || isNaN(parseFloat(price))) {
      alert(lang === "ar" ? "يرجى إدخال السعر أولاً" : "Please enter the price");
      return;
    }
    setSaving(true);
    setDuplicateInfo(null);

    try {
      const productRes = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editedName,
          brand: editedBrand,
          category_id: productData?.category_id || null,
          description: editedDesc,
          image: imageUrl || null,
          store_id: storeId,
          status: "pending",
          force_create: forceCreate
        })
      });

      const product = await productRes.json();

      // تكرار — عرض خيارات
      if (productRes.status === 409 && product.error === "duplicate") {
        setDuplicateInfo(product.existing);
        setDuplicateAction(null);
        setSaving(false);
        return;
      }

      if (!productRes.ok) {
        alert(product.message || "حدث خطأ");
        setSaving(false);
        return;
      }

      const productId = product.id;

      await fetch("/api/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, store_id: storeId, price: parseFloat(price) })
      });

      const specsList = Object.entries(editedSpecs)
        .filter(([, v]) => v.trim())
        .map(([key, value]) => ({ key, value }));

      if (specsList.length > 0) {
        await fetch(`/api/products/${productId}/specs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ specs: specsList })
        });
      }

      setSavedMsg(lang === "ar" ? "تمت الإضافة بنجاح! المنتج بانتظار موافقة الإدارة ✅" : "Added successfully! Awaiting admin approval ✅");
      setSaved(true);
      setTimeout(() => navigate("/store/dashboard/products"), 2500);
    } catch {
      alert(lang === "ar" ? "حدث خطأ أثناء الحفظ" : "Save error");
    }
    setSaving(false);
  }

  const specFields = productData?.category_id ? (CATEGORY_SPECS[String(productData.category_id)] || []) : [];
  const confidence = productData?.confidence;
  const confidenceColor = confidence === "high" ? "#22c55e" : confidence === "medium" ? "#f59e0b" : "#ef4444";
  const confidenceLabel = confidence === "high" ? "✅ معلومات موثوقة" : confidence === "medium" ? "⚠️ معلومات نسبية" : "❓ معلومات غير مؤكدة";

  const inp = { width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", outline: "none", boxSizing: "border-box" };

  if (saved) return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <DashboardSidebar lang={lang} />
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>✅</div>
          <h2 style={{ color: "#0f172a", fontWeight: "700", marginBottom: "8px" }}>{savedMsg}</h2>
          <p style={{ color: "#64748b" }}>جاري التحويل...</p>
        </div>
      </main>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <DashboardSidebar lang={lang} />
      <main style={{ flex: 1, padding: "32px", maxWidth: "860px" }}>

        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            🤖 {lang === "ar" ? "إضافة ذكية بالذكاء الاصطناعي" : "Smart Add with AI"}
          </h1>
          <p style={{ color: "#64748b", marginTop: "6px", fontSize: "13px" }}>
            {lang === "ar" ? "اكتب اسم المنتج والذكاء الاصطناعي يجيب كل المواصفات تلقائياً" : "Type product name and AI fetches all specs automatically"}
          </p>
        </div>

        {/* صندوق البحث */}
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px", marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#0f172a", marginBottom: "10px" }}>
            🔍 {lang === "ar" ? "اكتب اسم المنتج" : "Enter product name"}
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder={lang === "ar" ? "مثال: iPhone 15 Pro, Samsung Galaxy S24..." : "e.g. iPhone 15 Pro, Samsung Galaxy S24..."}
              style={{ ...inp, flex: 1, padding: "11px 14px", fontSize: "14px" }}
              onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            <button onClick={handleSearch} disabled={searching || !query.trim()}
              style={{ padding: "11px 24px", background: query.trim() ? "#0f172a" : "#f1f5f9", color: query.trim() ? "white" : "#94a3b8", border: "none", borderRadius: "9px", cursor: query.trim() ? "pointer" : "not-allowed", fontSize: "14px", fontWeight: "600", fontFamily: "Tajawal, sans-serif", minWidth: "130px" }}>
              {searching ? "⏳ جاري البحث..." : "🤖 بحث ذكي"}
            </button>
          </div>

          <div style={{ marginTop: "12px" }}>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 8px" }}>{lang === "ar" ? "اقتراحات:" : "Suggestions:"}</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["iPhone 16 Pro", "Samsung Galaxy S25", "MacBook Air M3", "AirPods Pro 2", "iPad Pro M4", "Dell XPS 15"].map(s => (
                <button key={s} onClick={() => setQuery(s)}
                  style={{ padding: "4px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "99px", cursor: "pointer", fontSize: "12px", color: "#475569", fontFamily: "Tajawal, sans-serif" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "14px 16px", marginBottom: "16px" }}>
            <p style={{ color: "#dc2626", margin: 0, fontSize: "13px" }}>❌ {error}</p>
          </div>
        )}

        {/* ===== تنبيه التكرار ===== */}
        {duplicateInfo && !duplicateAction && (
          <div style={{ background: "white", borderRadius: "16px", border: "2px solid #f59e0b", padding: "24px", marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "20px" }}>
              <span style={{ fontSize: "36px", flexShrink: 0 }}>⚠️</span>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: "0 0 6px" }}>
                  {lang === "ar" ? "هذا المنتج موجود مسبقاً!" : "This product already exists!"}
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                  {lang === "ar" ? "وجدنا منتجاً بنفس الاسم والماركة. اختر الإجراء المناسب:" : "Found a product with the same name and brand. Choose action:"}
                </p>
              </div>
            </div>

            {/* معلومات المنتج الموجود */}
            <div style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: "10px", padding: "14px 16px", marginBottom: "20px" }}>
              <p style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" }}>
                📦 {duplicateInfo.name}
              </p>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 4px" }}>
                {lang === "ar" ? "الماركة:" : "Brand:"} {duplicateInfo.brand}
                {duplicateInfo.best_price && ` · ${lang === "ar" ? "أفضل سعر:" : "Best price:"} ${Number(duplicateInfo.best_price).toLocaleString()} ₪`}
              </p>
              {duplicateInfo.stores?.[0] && duplicateInfo.stores[0] !== null && (
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                  {lang === "ar" ? "متوفر عند:" : "Available at:"} {duplicateInfo.stores.filter(Boolean).join("، ")}
                </p>
              )}
            </div>

            {/* حقل السعر */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                💰 {lang === "ar" ? "سعرك لهذا المنتج (₪) *" : "Your price for this product (₪) *"}
              </label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                placeholder="0" min="0"
                style={{ ...inp, maxWidth: "200px", border: "1.5px solid #f59e0b", background: "#fffbeb" }}
                onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#f59e0b"} />
            </div>

            {/* خيارات */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>

              {/* الخيار 1 — أضف سعرك فقط */}
              <button onClick={handleAddPriceOnly} disabled={saving || !price}
                style={{ padding: "14px", background: price ? "linear-gradient(135deg, #22c55e, #16a34a)" : "#f1f5f9", color: price ? "white" : "#94a3b8", border: "none", borderRadius: "12px", cursor: price ? "pointer" : "not-allowed", fontFamily: "Tajawal, sans-serif", textAlign: "center" }}>
                <div style={{ fontSize: "24px", marginBottom: "6px" }}>💰</div>
                <p style={{ fontWeight: "700", fontSize: "13px", margin: "0 0 4px" }}>
                  {lang === "ar" ? "أضف سعرك فقط" : "Add My Price Only"}
                </p>
                <p style={{ fontSize: "11px", opacity: 0.8, margin: 0 }}>
                  {lang === "ar" ? "نفس المنتج، سعر مختلف" : "Same product, different price"}
                </p>
              </button>

              {/* الخيار 2 — موديل مختلف */}
              <button onClick={() => handleSave(true)} disabled={saving || !price}
                style={{ padding: "14px", background: price ? "#f0fdf4" : "#f8fafc", color: price ? "#16a34a" : "#94a3b8", border: `2px solid ${price ? "#22c55e" : "#e2e8f0"}`, borderRadius: "12px", cursor: price ? "pointer" : "not-allowed", fontFamily: "Tajawal, sans-serif", textAlign: "center" }}>
                <div style={{ fontSize: "24px", marginBottom: "6px" }}>🆕</div>
                <p style={{ fontWeight: "700", fontSize: "13px", margin: "0 0 4px" }}>
                  {lang === "ar" ? "موديل مختلف" : "Different Model"}
                </p>
                <p style={{ fontSize: "11px", opacity: 0.8, margin: 0 }}>
                  {lang === "ar" ? "مثل: 256GB بدل 128GB" : "e.g. 256GB vs 128GB"}
                </p>
              </button>

              {/* الخيار 3 — عرض المنتج الموجود */}
              <Link to={`/product/${duplicateInfo.id}`} target="_blank"
                style={{ padding: "14px", background: "#f8fafc", color: "#475569", border: "2px solid #e2e8f0", borderRadius: "12px", fontFamily: "Tajawal, sans-serif", textAlign: "center", textDecoration: "none", display: "block" }}>
                <div style={{ fontSize: "24px", marginBottom: "6px" }}>👁</div>
                <p style={{ fontWeight: "700", fontSize: "13px", margin: "0 0 4px" }}>
                  {lang === "ar" ? "عرض المنتج" : "View Product"}
                </p>
                <p style={{ fontSize: "11px", opacity: 0.8, margin: 0 }}>
                  {lang === "ar" ? "شوف تفاصيله" : "See details"}
                </p>
              </Link>
            </div>
          </div>
        )}

        {/* نتيجة الـ AI */}
        {productData && !duplicateInfo && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <span style={{ padding: "4px 14px", borderRadius: "99px", fontSize: "12px", fontWeight: "600", background: `${confidenceColor}20`, color: confidenceColor, border: `1px solid ${confidenceColor}40` }}>
                {confidenceLabel}
              </span>
              {productData.note && <span style={{ fontSize: "12px", color: "#94a3b8" }}>💬 {productData.note}</span>}
            </div>

            {/* المعلومات الأساسية */}
            <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: "0 0 18px" }}>
                📋 {lang === "ar" ? "المعلومات الأساسية" : "Basic Info"}
                <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "400", marginRight: "8px" }}>— {lang === "ar" ? "يمكن التعديل" : "editable"}</span>
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#64748b", marginBottom: "5px" }}>{lang === "ar" ? "اسم المنتج *" : "Product Name *"}</label>
                  <input value={editedName} onChange={e => setEditedName(e.target.value)} style={inp}
                    onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#64748b", marginBottom: "5px" }}>{lang === "ar" ? "الماركة *" : "Brand *"}</label>
                  <input value={editedBrand} onChange={e => setEditedBrand(e.target.value)} style={inp}
                    onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#64748b", marginBottom: "5px" }}>
                    💰 {lang === "ar" ? "السعر (₪) *" : "Price (₪) *"} <span style={{ color: "#f59e0b" }}>— {lang === "ar" ? "أنت تحدده" : "you set it"}</span>
                  </label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0"
                    style={{ ...inp, border: "1.5px solid #f59e0b", background: "#fffbeb" }}
                    onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#f59e0b"} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#64748b", marginBottom: "5px" }}>{lang === "ar" ? "الفئة" : "Category"}</label>
                  <div style={{ padding: "9px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", background: "#f8fafc" }}>
                    {CATEGORY_NAMES[productData.category_id] || "—"}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#64748b", marginBottom: "5px" }}>{lang === "ar" ? "الوصف" : "Description"}</label>
                <textarea value={editedDesc} onChange={e => setEditedDesc(e.target.value)} rows={3}
                  style={{ ...inp, resize: "vertical" }}
                  onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#64748b", marginBottom: "5px" }}>{lang === "ar" ? "رابط الصورة (اختياري)" : "Image URL (optional)"}</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..."
                    style={{ ...inp, flex: 1 }}
                    onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                  {imageUrl && <img src={fixImg(imageUrl)} alt="" style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "6px", border: "1px solid #e2e8f0" }} onError={e => e.target.style.display = "none"} />}
                </div>
              </div>
            </div>

            {/* المواصفات */}
            {Object.keys(editedSpecs).length > 0 && (
              <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: "0 0 18px" }}>
                  ⚙️ {lang === "ar" ? "المواصفات التقنية" : "Technical Specs"}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px" }}>
                  {Object.entries(editedSpecs).map(([key, value]) => {
                    const field = specFields.find(f => f.key === key);
                    const label = field ? field.labelAr : key;
                    return (
                      <div key={key} style={{ background: "#f8fafc", borderRadius: "8px", padding: "10px 12px", border: "1px solid #e2e8f0" }}>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "600", color: "#94a3b8", marginBottom: "4px" }}>
                          {SPEC_ICONS?.[key] || "•"} {label}
                        </label>
                        <input value={value} onChange={e => setEditedSpecs(prev => ({ ...prev, [key]: e.target.value }))}
                          style={{ width: "100%", padding: "5px 8px", borderRadius: "5px", border: "1px solid #e2e8f0", fontSize: "12px", fontFamily: "Tajawal, sans-serif", outline: "none", background: "white", boxSizing: "border-box" }}
                          onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => handleSave(false)} disabled={saving || !price}
                style={{ flex: 1, padding: "13px", background: price ? "#22c55e" : "#f1f5f9", color: price ? "white" : "#94a3b8", border: "none", borderRadius: "10px", cursor: price ? "pointer" : "not-allowed", fontSize: "15px", fontWeight: "700", fontFamily: "Tajawal, sans-serif" }}>
                {saving ? "⏳ " + (lang === "ar" ? "جاري الحفظ..." : "Saving...") : "✅ " + (lang === "ar" ? "إضافة المنتج للمتجر" : "Add Product")}
              </button>
              <button onClick={() => { setProductData(null); setQuery(""); setPrice(""); setDuplicateInfo(null); }}
                style={{ padding: "13px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontFamily: "Tajawal, sans-serif" }}>
                🔄 {lang === "ar" ? "بحث جديد" : "New Search"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SmartAddProduct;