import { useState, useRef } from "react";
import { Link } from "react-router-dom";

function fixImg(url) {
  if (!url) return "";
  return url.startsWith("/") ? `/api${url}` : url;
}

export default function PriceCheck({ lang = "ar" }) {
  const [step, setStep] = useState("search"); // search | enter_price | result
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paidPrice, setPaidPrice] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  // بحث مع اقتراحات
  function handleSearch(e) {
    const q = e.target.value;
    setQuery(q);
    if (q.length < 2) { setSuggestions([]); return; }
    fetch(`/api/products/search?q=${q}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setSuggestions(data.slice(0, 6)); });
  }

  function selectProduct(p) {
    setSelectedProduct(p);
    setQuery(p.name);
    setSuggestions([]);
    setStep("enter_price");
  }

  async function checkPrice() {
    if (!paidPrice || !selectedProduct) return;
    setLoading(true);
    const res = await fetch(`/api/products/price-check/${selectedProduct.id}?paid_price=${paidPrice}`);
    const data = await res.json();
    setResult(data);
    setStep("result");
    setLoading(false);
  }

  function reset() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  setStep("search"); setQuery(""); setSuggestions([]);
  setSelectedProduct(null); setPaidPrice(""); setResult(null);
}

  // نص المشاركة
  function getShareText() {
    if (!result) return "";
    const { product, paid_price, verdict, lost_amount, cheaper_store, lowest_price } = result;
    if (verdict === "great") return `✅ دفعت ${paid_price} ₪ على "${product.name}" — وهذا أفضل سعر في السوق! 🎉 تحقق من الأسعار على PalPrice 👇`;
    if (verdict === "good")  return `👍 دفعت ${paid_price} ₪ على "${product.name}" — سعر معقول جداً! 💰 PalPrice بيساعدك توفّر أكثر`;
    return `😮 دفعت ${paid_price} ₪ على "${product.name}" — كان في متجر بيبيعها بـ ${lowest_price} ₪ عند ${cheaper_store}! خسرت ${lost_amount} ₪ 😢 لا تدفع أكثر مما يجب → PalPrice.ps`;
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(getShareText() + "\nhttps://palprice.ps/price-check");
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  const VERDICT_CONFIG = {
    great:    { emoji: "🎉", bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "#86efac", color: "#16a34a", badge: "bg: #16a34a", title: lang === "ar" ? "ممتاز! أفضل سعر!" : "Great Deal!", subtitle: lang === "ar" ? "اشتريت بأفضل سعر في السوق 👏" : "You got the best price in the market 👏" },
    good:     { emoji: "👍", bg: "linear-gradient(135deg, #f0fdf4, #ecfccb)", border: "#a3e635", color: "#65a30d", title: lang === "ar" ? "سعر كويس!" : "Good Price!", subtitle: lang === "ar" ? "سعرك قريب من أفضل سعر في السوق" : "Your price is close to the market's best" },
    overpaid: { emoji: "😮", bg: "linear-gradient(135deg, #fef2f2, #fee2e2)", border: "#fca5a5", color: "#dc2626", title: lang === "ar" ? "دفعت أكثر!" : "You Overpaid!", subtitle: lang === "ar" ? "كان في سعر أرخص في السوق" : "There was a cheaper price in the market" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #1a1a2e 100%)", padding: "52px 24px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(234,179,8,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "640px", margin: "auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.25)", color: "#fde68a", padding: "5px 16px", borderRadius: "99px", fontSize: "12px", fontWeight: "600", marginBottom: "16px" }}>
            💰 {lang === "ar" ? "اكتشف إذا كنت وفّرت أو خسرت" : "Find out if you saved or overpaid"}
          </div>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: "900", color: "white", margin: "0 0 10px", fontFamily: "Cairo, Tajawal, sans-serif", lineHeight: 1.2 }}>
            {lang === "ar" ? "كم دفعت؟ 🤔" : "How Much Did You Pay?"}
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "15px", margin: 0 }}>
            {lang === "ar" ? "ادخل المنتج والسعر اللي دفعته — نقولك إذا كنت وفّرت أو كان في أرخص" : "Enter the product and price you paid — we'll tell you if you saved or could've paid less"}
          </p>
        </div>
      </div>

      {/* Steps indicator */}
      <div style={{ background: "white", borderBottom: "1px solid #f1f5f9", padding: "12px 24px" }}>
        <div style={{ maxWidth: "640px", margin: "auto", display: "flex", alignItems: "center", gap: "0" }}>
          {[
            { n: 1, label: lang === "ar" ? "ابحث عن المنتج" : "Search Product" },
            { n: 2, label: lang === "ar" ? "ادخل السعر" : "Enter Price" },
            { n: 3, label: lang === "ar" ? "النتيجة" : "Result" },
          ].map((s, i) => {
            const isActive = (step === "search" && s.n === 1) || (step === "enter_price" && s.n === 2) || (step === "result" && s.n === 3);
            const isDone = (step === "enter_price" && s.n === 1) || (step === "result" && s.n <= 2);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", background: isDone ? "#16a34a" : isActive ? "#eab308" : "#f1f5f9", color: isDone || isActive ? "white" : "#94a3b8", flexShrink: 0 }}>
                    {isDone ? "✓" : s.n}
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: isActive ? "700" : "400", color: isActive ? "#0f172a" : "#94a3b8", whiteSpace: "nowrap" }}>{s.label}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: "1px", background: isDone ? "#16a34a" : "#e2e8f0", margin: "0 12px" }} />}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: "640px", margin: "40px auto", padding: "0 24px 60px" }}>

        {/* STEP 1: البحث */}
        {step === "search" && (
          <div style={{ background: "white", borderRadius: "20px", padding: "32px", border: "1.5px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
              🔍 {lang === "ar" ? "عن شو دفعت؟" : "What did you buy?"}
            </h2>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>
              {lang === "ar" ? "ابحث عن المنتج اللي اشتريته" : "Search for the product you bought"}
            </p>

            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" }}>🔍</span>
              <input value={query} onChange={handleSearch}
                placeholder={lang === "ar" ? "مثال: iPhone 15 Pro, سامسونج A54..." : "e.g. iPhone 15 Pro, Samsung A54..."}
                style={{ width: "100%", padding: "13px 44px 13px 16px", borderRadius: "12px", border: "1.5px solid #e2e8f0", fontSize: "15px", fontFamily: "Tajawal, sans-serif", outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#eab308"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>

            {suggestions.length > 0 && (
              <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", marginTop: "8px" }}>
                {suggestions.map((p, i) => (
                  <div key={p.id} onClick={() => selectProduct(p)}
                    style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", cursor: "pointer", borderBottom: i < suggestions.length - 1 ? "1px solid #f8fafc" : "none", transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fefce8"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "8px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                      {p.image ? <img src={fixImg(p.image)} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} /> : <span style={{ fontSize: "20px" }}>📦</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                      {p.brand && <p style={{ fontSize: "12px", color: "#94a3b8", margin: "2px 0 0" }}>{p.brand}</p>}
                    </div>
                    {p.best_price && <span style={{ fontSize: "13px", fontWeight: "700", color: "#16a34a", flexShrink: 0 }}>{Number(p.best_price).toLocaleString()} ₪</span>}
                  </div>
                ))}
              </div>
            )}

            {query.length > 1 && suggestions.length === 0 && (
              <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "14px", marginTop: "16px" }}>
                {lang === "ar" ? "لا توجد نتائج — جرب كلمة أخرى" : "No results — try another word"}
              </p>
            )}
          </div>
        )}

        {/* STEP 2: إدخال السعر */}
        {step === "enter_price" && selectedProduct && (
          <div style={{ background: "white", borderRadius: "20px", padding: "32px", border: "1.5px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

            {/* المنتج المختار */}
            <div style={{ display: "flex", gap: "14px", alignItems: "center", padding: "14px 16px", background: "#fefce8", borderRadius: "12px", border: "1px solid #fde68a", marginBottom: "24px" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "10px", background: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                {selectedProduct.image ? <img src={fixImg(selectedProduct.image)} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} /> : <span style={{ fontSize: "24px" }}>📦</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedProduct.name}</p>
                {selectedProduct.brand && <p style={{ fontSize: "12px", color: "#92400e", margin: "2px 0 0" }}>{selectedProduct.brand}</p>}
              </div>
              <button onClick={reset} style={{ background: "none", border: "none", color: "#92400e", cursor: "pointer", fontSize: "18px" }}>✕</button>
            </div>

            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
              💸 {lang === "ar" ? "بكم اشتريته؟" : "How much did you pay?"}
            </h2>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>
              {lang === "ar" ? "ادخل السعر الفعلي اللي دفعته" : "Enter the actual price you paid"}
            </p>

            <div style={{ position: "relative", marginBottom: "20px" }}>
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "18px", fontWeight: "700", color: "#64748b" }}>₪</span>
              <input type="number" value={paidPrice} onChange={e => setPaidPrice(e.target.value)}
                placeholder="0.00" min="0"
                onKeyDown={e => e.key === "Enter" && checkPrice()}
                style={{ width: "100%", padding: "16px 16px 16px 44px", borderRadius: "12px", border: "1.5px solid #e2e8f0", fontSize: "24px", fontWeight: "700", fontFamily: "Cairo, Tajawal, sans-serif", outline: "none", boxSizing: "border-box", textAlign: "center" }}
                onFocus={e => e.target.style.borderColor = "#eab308"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>

            <button onClick={checkPrice} disabled={!paidPrice || loading}
              style={{ width: "100%", padding: "14px", background: paidPrice ? "linear-gradient(135deg, #eab308, #ca8a04)" : "#f1f5f9", color: paidPrice ? "white" : "#94a3b8", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: paidPrice ? "pointer" : "not-allowed", fontFamily: "Tajawal, sans-serif", boxShadow: paidPrice ? "0 4px 16px rgba(234,179,8,0.35)" : "none", transition: "all 0.2s" }}>
              {loading ? "⏳ " + (lang === "ar" ? "جاري التحقق..." : "Checking...") : "🔍 " + (lang === "ar" ? "تحقق من السعر" : "Check Price")}
            </button>
          </div>
        )}

        {/* STEP 3: النتيجة */}
        {step === "result" && result && (() => {
          const cfg = VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG.good;
          return (
            <div>
              {/* بطاقة النتيجة */}
              <div ref={resultRef} style={{ background: cfg.bg, borderRadius: "20px", padding: "32px", border: `2px solid ${cfg.border}`, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", marginBottom: "16px", textAlign: "center" }}>

                <div style={{ fontSize: "64px", marginBottom: "12px" }}>{cfg.emoji}</div>

                <h2 style={{ fontSize: "26px", fontWeight: "900", color: cfg.color, margin: "0 0 6px", fontFamily: "Cairo, Tajawal, sans-serif" }}>{cfg.title}</h2>
                <p style={{ fontSize: "15px", color: "#475569", margin: "0 0 24px" }}>{cfg.subtitle}</p>

                {/* تفاصيل المنتج */}
                <div style={{ display: "flex", gap: "12px", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                  {result.product.image && (
                    <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "white", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(0,0,0,0.08)" }}>
                      <img src={fixImg(result.product.image)} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} />
                    </div>
                  )}
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{result.product.name}</p>
                    {result.product.brand && <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>{result.product.brand}</p>}
                  </div>
                </div>

                {/* مقارنة الأسعار */}
                <div style={{ display: "grid", gridTemplateColumns: result.lowest_price ? "1fr 1fr" : "1fr", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ background: "rgba(0,0,0,0.05)", borderRadius: "12px", padding: "14px" }}>
                    <p style={{ fontSize: "11px", fontWeight: "700", color: "#475569", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {lang === "ar" ? "دفعت" : "You Paid"}
                    </p>
                    <p style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a", margin: 0, fontFamily: "Cairo, sans-serif" }}>
                      {Number(result.paid_price).toLocaleString()} ₪
                    </p>
                  </div>
                  {result.lowest_price && (
                    <div style={{ background: "rgba(22,163,74,0.1)", borderRadius: "12px", padding: "14px" }}>
                      <p style={{ fontSize: "11px", fontWeight: "700", color: "#475569", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {lang === "ar" ? "أفضل سعر" : "Best Price"}
                      </p>
                      <p style={{ fontSize: "24px", fontWeight: "900", color: "#16a34a", margin: 0, fontFamily: "Cairo, sans-serif" }}>
                        {Number(result.lowest_price).toLocaleString()} ₪
                      </p>
                    </div>
                  )}
                </div>

                {/* رسالة الخسارة أو الربح */}
                {result.verdict === "overpaid" && result.lost_amount > 0 && (
                  <div style={{ background: "rgba(239,68,68,0.1)", borderRadius: "12px", padding: "14px 18px", marginBottom: "16px" }}>
                    <p style={{ fontSize: "15px", color: "#dc2626", fontWeight: "700", margin: "0 0 4px" }}>
                      😢 {lang === "ar" ? `خسرت ${Number(result.lost_amount).toLocaleString()} ₪` : `You overpaid by ${Number(result.lost_amount).toLocaleString()} ₪`}
                    </p>
                    {result.cheaper_store && (
                      <p style={{ fontSize: "13px", color: "#7f1d1d", margin: 0 }}>
                        {lang === "ar" ? `كان في سعر أرخص عند "${result.cheaper_store}"` : `"${result.cheaper_store}" had it cheaper`}
                      </p>
                    )}
                  </div>
                )}

                {result.verdict === "great" && (
                  <div style={{ background: "rgba(22,163,74,0.1)", borderRadius: "12px", padding: "14px 18px", marginBottom: "16px" }}>
                    <p style={{ fontSize: "15px", color: "#16a34a", fontWeight: "700", margin: 0 }}>
                      🏆 {lang === "ar" ? "اشتريت بأفضل سعر موجود في السوق!" : "You got the best available market price!"}
                    </p>
                  </div>
                )}

                {/* PalPrice branding */}
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <span style={{ fontSize: "16px", fontWeight: "900", color: "#22c55e" }}>PalPrice</span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>— {lang === "ar" ? "قارن قبل ما تشتري 🇵🇸" : "Compare before you buy 🇵🇸"}</span>
                </div>
              </div>

              {/* أزرار المشاركة والتصرف */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button onClick={shareWhatsApp}
                  style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #25d366, #128c7e)", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "Tajawal, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span style={{ fontSize: "20px" }}>📱</span>
                  {lang === "ar" ? "شارك على واتساب" : "Share on WhatsApp"}
                </button>
                <button onClick={() => {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(getShareText());
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, "_blank");
}}
  style={{ width: "100%", padding: "12px", background: "#1877f2", color: "white", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "Tajawal, sans-serif", marginTop: "8px" }}>
  📘 {lang === "ar" ? "شارك على فيسبوك" : "Share on Facebook"}
</button>

                <button onClick={reset}
                  style={{ width: "100%", padding: "13px", background: "white", color: "#475569", border: "1.5px solid #e2e8f0", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                  🔄 {lang === "ar" ? "تحقق من منتج آخر" : "Check Another Product"}
                </button>
              </div>

              {/* أسعار المتاجر الكاملة */}
              {result.prices && result.prices.length > 0 && (
                <div style={{ background: "white", borderRadius: "16px", border: "1.5px solid #e2e8f0", padding: "20px", marginTop: "16px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", marginBottom: "14px", margin: "0 0 14px" }}>
                    🏪 {lang === "ar" ? "أسعار المتاجر الآن" : "Current Store Prices"}
                  </h3>
              {result.prices.map((p, i) => (
  <Link key={i}
    to={p.store_id ? `/store/${p.store_id}` : `/stores`}
    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 8px", borderBottom: i < result.prices.length - 1 ? "1px solid #f8fafc" : "none", textDecoration: "none", color: "inherit", borderRadius: "8px", margin: "0 -8px", transition: "background 0.15s" }}
    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {i === 0 && <span style={{ background: "#16a34a", color: "white", fontSize: "9px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px" }}>الأرخص</span>}
      <span style={{ fontSize: "14px", color: i === 0 ? "#16a34a" : "#0f172a", fontWeight: "600" }}>
        {p.store_name} ←
      </span>
    </div>
    <span style={{ fontSize: "16px", fontWeight: "800", color: i === 0 ? "#16a34a" : "#0f172a", fontFamily: "Cairo, sans-serif" }}>
      {Number(p.price).toLocaleString()} ₪
    </span>
  </Link>
))}
                </div>
              )}
            </div>
          );
        })()}

      </div>
    </div>
  );
}

const VERDICT_CONFIG = {
  great:    { emoji: "🎉", bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "#86efac", color: "#16a34a", title: "ممتاز! أفضل سعر!", subtitle: "اشتريت بأفضل سعر في السوق 👏" },
  good:     { emoji: "👍", bg: "linear-gradient(135deg, #fefce8, #fef9c3)", border: "#fde68a", color: "#ca8a04", title: "سعر كويس!", subtitle: "سعرك قريب من أفضل سعر في السوق" },
  overpaid: { emoji: "😮", bg: "linear-gradient(135deg, #fef2f2, #fee2e2)", border: "#fca5a5", color: "#dc2626", title: "دفعت أكثر!", subtitle: "كان في سعر أرخص في السوق" },
};