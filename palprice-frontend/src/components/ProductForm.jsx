import { useState, useEffect } from "react";

function ProductForm({ onSubmit, initialData = null, lang = "ar" }) {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    image: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* Load categories */
  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  /* Fill form if editing */
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        brand: initialData.brand || "",
        category: initialData.category || "",
        description: initialData.description || "",
        image: initialData.image || "",
      });
    }
  }, [initialData]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.brand || !form.category) {
      setError(lang === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields");
      return;
    }

    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    background: "#f8fafc",
    color: "#0f172a",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    marginBottom: "6px",
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "560px" }}>

      {error && (
        <div style={{
          background: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#dc2626",
          padding: "10px 14px",
          borderRadius: "8px",
          fontSize: "14px",
          marginBottom: "16px"
        }}>
          {error}
        </div>
      )}

      {/* Name */}
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>
          {lang === "ar" ? "اسم المنتج *" : "Product Name *"}
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder={lang === "ar" ? "مثال: iPhone 15 Pro" : "e.g. iPhone 15 Pro"}
          style={inputStyle}
        />
      </div>

      {/* Brand */}
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>
          {lang === "ar" ? "الشركة المصنعة *" : "Brand *"}
        </label>
        <input
          name="brand"
          value={form.brand}
          onChange={handleChange}
          placeholder={lang === "ar" ? "مثال: Apple" : "e.g. Apple"}
          style={inputStyle}
        />
      </div>

      {/* Category */}
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>
          {lang === "ar" ? "الفئة *" : "Category *"}
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">
            {lang === "ar" ? "-- اختر فئة --" : "-- Select Category --"}
          </option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>
          {lang === "ar" ? "الوصف" : "Description"}
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          placeholder={lang === "ar" ? "وصف المنتج..." : "Product description..."}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {/* Image URL */}
      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>
          {lang === "ar" ? "رابط الصورة" : "Image URL"}
        </label>
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="https://..."
          style={inputStyle}
        />
        {form.image && (
          <img
            src={form.image}
            alt="preview"
            style={{
              marginTop: "10px",
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}
            onError={e => e.target.style.display = "none"}
          />
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "12px 28px",
          background: loading ? "#86efac" : "#22c55e",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "15px",
          fontWeight: "600",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.2s",
        }}
      >
        {loading
          ? (lang === "ar" ? "جاري الحفظ..." : "Saving...")
          : (initialData
            ? (lang === "ar" ? "حفظ التعديلات" : "Save Changes")
            : (lang === "ar" ? "إضافة المنتج" : "Add Product"))
        }
      </button>

    </form>
  );
}

export default ProductForm;
