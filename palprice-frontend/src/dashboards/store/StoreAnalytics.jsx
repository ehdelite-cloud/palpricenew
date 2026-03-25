import { useEffect, useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell
} from "recharts";

function StoreAnalytics({ lang = "ar" }) {
  const storeId = localStorage.getItem("storeId");
  const storeName = localStorage.getItem("storeName") || "متجري";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI state
  const [aiReport, setAiReport]         = useState(null);
  const [aiLoading, setAiLoading]       = useState(false);
  const [aiChat, setAiChat]             = useState([]);
  const [aiInput, setAiInput]           = useState("");
  const [aiChatLoading, setAiChatLoading] = useState(false);
  const [reportType, setReportType]     = useState("performance");

  useEffect(() => {
    if (!storeId) { setLoading(false); return; }
    fetch(`/api/stores/${storeId}/products`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [storeId]);

  // إحصائيات
  const totalProducts = products.length;
  const withPrice = products.filter(p => p.best_price && Number(p.best_price) > 0);
  const noPrice = products.filter(p => !p.best_price || Number(p.best_price) === 0);
  const avgPrice = withPrice.length > 0
    ? Math.round(withPrice.reduce((s, p) => s + Number(p.best_price), 0) / withPrice.length) : 0;
  const maxPrice = withPrice.length > 0 ? Math.max(...withPrice.map(p => Number(p.best_price))) : 0;
  const totalViews = products.reduce((s, p) => s + Number(p.views || 0), 0);

  const topViewed = [...products]
    .sort((a, b) => Number(b.views || 0) - Number(a.views || 0))
    .slice(0, 5)
    .map(p => ({ name: p.name.length > 20 ? p.name.slice(0, 18) + "..." : p.name, views: Number(p.views || 0) }));

  const topPriced = [...withPrice]
    .sort((a, b) => Number(b.best_price) - Number(a.best_price))
    .slice(0, 5)
    .map(p => ({ name: p.name.length > 20 ? p.name.slice(0, 18) + "..." : p.name, price: Number(p.best_price) }));

  const pieData = [
    { name: lang === "ar" ? "بسعر" : "With Price", value: withPrice.length, color: "#22c55e" },
    { name: lang === "ar" ? "بدون سعر" : "No Price", value: noPrice.length, color: "#f1f5f9" },
  ].filter(d => d.value > 0);

  const stats = [
    { label: lang === "ar" ? "إجمالي المنتجات" : "Products", value: totalProducts, icon: "📦", color: "#3b82f6" },
    { label: lang === "ar" ? "منتجات بسعر" : "Priced", value: withPrice.length, icon: "✅", color: "#22c55e" },
    { label: lang === "ar" ? "متوسط السعر" : "Avg Price", value: avgPrice ? `${avgPrice} ₪` : "—", icon: "💰", color: "#f59e0b", isText: true },
    { label: lang === "ar" ? "إجمالي المشاهدات" : "Total Views", value: totalViews, icon: "👁️", color: "#8b5cf6" },
  ];

  // ====== AI FUNCTIONS ======

  function buildStoreContext() {
    const top3 = [...products].sort((a, b) => Number(b.views || 0) - Number(a.views || 0)).slice(0, 3);
    const low3 = [...products].sort((a, b) => Number(a.views || 0) - Number(b.views || 0)).slice(0, 3);
    return `
معلومات المتجر "${storeName}":
- إجمالي المنتجات: ${totalProducts}
- منتجات مسعّرة: ${withPrice.length} | بدون سعر: ${noPrice.length}
- متوسط السعر: ${avgPrice} ₪ | أعلى سعر: ${maxPrice} ₪
- إجمالي المشاهدات: ${totalViews}
- أكثر المنتجات مشاهدة: ${top3.map(p => `${p.name} (${p.views || 0} مشاهدة، سعر: ${p.best_price || "—"} ₪)`).join("، ")}
- أقل المنتجات مشاهدة: ${low3.map(p => `${p.name} (${p.views || 0} مشاهدة)`).join("، ")}
- قائمة الأسعار: ${withPrice.slice(0, 8).map(p => `${p.name}: ${p.best_price} ₪`).join("، ")}
`;
  }

  const REPORT_PROMPTS = {
    performance: `أنت مستشار تجاري متخصص في التجارة الإلكترونية الفلسطينية. حلّل أداء هذا المتجر وأعطِ تقريراً بالعربية.

${buildStoreContext()}

اكتب تقرير أداء يشمل:
1. **تقييم الأداء الحالي** — نقاط قوة وضعف واضحة
2. **تحليل المشاهدات** — لماذا بعض المنتجات أكثر جذباً
3. **تحليل التسعير** — هل الأسعار منطقية؟ ما التوصية؟
4. **المنتجات بدون سعر** — خطة عمل فورية
5. **توصيات عملية** — 3 إجراءات تُحسن الأداء هذا الأسبوع`,

    competition: `أنت خبير تسويق في السوق الفلسطيني. حلّل وضع هذا المتجر التنافسي.

${buildStoreContext()}

اكتب تقرير تنافسي يشمل:
1. **نقاط التميز** — ما الذي يميز هذا المتجر
2. **الفرص المتاحة** — ما الذي يمكن استغلاله
3. **استراتيجية التسعير** — نصائح لتحسين الأسعار تنافسياً
4. **المنتجات الأكثر طلباً** — ما يجب إضافته
5. **خطة تطوير** — خطوات عملية للشهر القادم`,

    growth: `أنت خبير نمو في التجارة الإلكترونية. اقترح خطة نمو لهذا المتجر.

${buildStoreContext()}

اكتب خطة نمو تشمل:
1. **الوضع الحالي** — تقييم سريع
2. **أهداف قابلة للتحقيق** — خلال 30 يوم
3. **المنتجات ذات الإمكانية العالية** — ركّز عليها
4. **استراتيجية جذب الزبائن** — كيف تزيد المشاهدات
5. **مؤشرات النجاح** — كيف تعرف أنك على الطريق الصح`
  };

  async function generateReport(type) {
    if (totalProducts === 0) return;
    setAiLoading(true);
    setAiReport(null);
    setReportType(type);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: REPORT_PROMPTS[type] }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "تعذر الحصول على التقرير";
      setAiReport({ text, type, time: new Date().toLocaleString("ar-PS") });
    } catch {
      setAiReport({ text: "❌ تعذر الاتصال بالسيرفر", type, time: "" });
    }
    setAiLoading(false);
  }

  async function sendAiMessage() {
    if (!aiInput.trim() || aiChatLoading) return;
    const msg = aiInput.trim();
    setAiInput("");
    setAiChat(prev => [...prev, { role: "user", content: msg }]);
    setAiChatLoading(true);

    const context = buildStoreContext();
    const history = aiChat.slice(-6);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `أنت مستشار تجاري ذكي لمتجر "${storeName}" على موقع PalPrice الفلسطيني. معلومات المتجر:\n${context}\n\nالتاريخ:\n${history.map(m => `${m.role === "user" ? "تاجر" : "مستشار"}: ${m.content}`).join("\n")}\n\nتاجر: ${msg}\n\nأجب بالعربية بشكل مختصر ومفيد ومباشر:`
            }
          ]
        })
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "تعذر الحصول على رد";
      setAiChat(prev => [...prev, { role: "assistant", content: text }]);
    } catch {
      setAiChat(prev => [...prev, { role: "assistant", content: "❌ تعذر الاتصال" }]);
    }
    setAiChatLoading(false);
  }

  const QUICK_QUESTIONS = [
    lang === "ar" ? "كيف أزيد مشاهدات منتجاتي؟" : "How to increase product views?",
    lang === "ar" ? "ما أفضل وقت لتخفيض الأسعار؟" : "Best time to reduce prices?",
    lang === "ar" ? "أي منتجاتي يحتاج تحسين؟" : "Which products need improvement?",
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <DashboardSidebar lang={lang} />

      <main style={{ flex: 1, padding: "40px" }}>

        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            📊 {lang === "ar" ? "إحصائيات متجري" : "My Store Analytics"}
          </h1>
          <p style={{ color: "#64748b", marginTop: "4px", fontSize: "14px" }}>
            {lang === "ar" ? "تحليل أداء منتجاتك" : "Analyze your products performance"}
          </p>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {Array(4).fill().map((_, i) => <div key={i} style={{ height: "110px", borderRadius: "12px", background: "#f1f5f9" }} />)}
          </div>
        ) : totalProducts === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#94a3b8" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
            <h3 style={{ color: "#64748b" }}>{lang === "ar" ? "لا توجد منتجات بعد" : "No products yet"}</h3>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
              {stats.map((s, i) => (
                <div key={i} style={{ background: "white", borderRadius: "12px", padding: "22px", border: "1px solid #e2e8f0", borderLeft: `4px solid ${s.color}` }}>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>{s.icon}</div>
                  <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 4px", fontWeight: "500" }}>{s.label}</p>
                  <p style={{ fontSize: s.isText ? "18px" : "26px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              {topViewed.length > 0 && (
                <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", marginBottom: "20px" }}>🔥 {lang === "ar" ? "الأكثر مشاهدة" : "Most Viewed"}</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={topViewed} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} width={90} />
                      <Tooltip formatter={(v) => [v, lang === "ar" ? "مشاهدة" : "views"]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                      <Bar dataKey="views" fill="#f97316" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              {topPriced.length > 0 && (
                <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", marginBottom: "20px" }}>💰 {lang === "ar" ? "أعلى الأسعار" : "Highest Prices"}</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={topPriced} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} width={90} />
                      <Tooltip formatter={(v) => [`${v} ₪`, lang === "ar" ? "سعر" : "price"]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                      <Bar dataKey="price" fill="#22c55e" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Pie */}
            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", marginBottom: "20px" }}>📊 {lang === "ar" ? "نسبة المنتجات المسعّرة" : "Priced vs Unpriced"}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [v, lang === "ar" ? "منتج" : "products"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {pieData.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: d.color, border: d.color === "#f1f5f9" ? "1px solid #e2e8f0" : "none" }} />
                      <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "500" }}>{d.name}</span>
                      <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "700" }}>{d.value}</span>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>({Math.round((d.value / totalProducts) * 100)}%)</span>
                    </div>
                  ))}
                  {noPrice.length > 0 && (
                    <div style={{ marginTop: "8px", padding: "10px 14px", background: "#fffbeb", borderRadius: "8px", border: "1px solid #fde68a" }}>
                      <p style={{ margin: 0, fontSize: "13px", color: "#92400e" }}>
                        ⚠️ {lang === "ar" ? `${noPrice.length} منتج بدون سعر — أضف أسعاراً لتظهر في البحث` : `${noPrice.length} products need pricing`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ===== AI SECTION ===== */}
            <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderRadius: "16px", padding: "28px", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🤖</div>
                <div>
                  <h2 style={{ color: "white", fontSize: "16px", fontWeight: "700", margin: 0 }}>
                    {lang === "ar" ? "مستشارك الذكي" : "AI Business Advisor"}
                  </h2>
                  <p style={{ color: "#64748b", fontSize: "12px", margin: 0 }}>
                    {lang === "ar" ? "تحليل مخصص لمتجرك بناءً على بياناتك فقط" : "Analysis based on your store data only"}
                  </p>
                </div>
              </div>

              {/* أزرار التقارير */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "20px 0 16px" }}>
                {[
                  { key: "performance", icon: "📊", label: lang === "ar" ? "تقرير الأداء" : "Performance" },
                  { key: "competition", icon: "⚡", label: lang === "ar" ? "التنافسية" : "Competition" },
                  { key: "growth", icon: "📈", label: lang === "ar" ? "خطة النمو" : "Growth Plan" },
                ].map(r => (
                  <button key={r.key} onClick={() => generateReport(r.key)} disabled={aiLoading}
                    style={{
                      padding: "9px 18px", borderRadius: "10px",
                      border: `1.5px solid ${reportType === r.key && aiReport ? "#22c55e" : "rgba(255,255,255,0.12)"}`,
                      background: reportType === r.key && aiReport ? "#22c55e" : "rgba(255,255,255,0.06)",
                      color: reportType === r.key && aiReport ? "white" : "#94a3b8",
                      cursor: aiLoading ? "not-allowed" : "pointer",
                      fontSize: "13px", fontWeight: "600",
                      fontFamily: "Tajawal, sans-serif",
                      display: "flex", alignItems: "center", gap: "7px",
                      transition: "all 0.2s"
                    }}>
                    {r.icon} {r.label}
                  </button>
                ))}
              </div>

              {/* Loading */}
              {aiLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", marginBottom: "14px" }}>
                  <div style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.2)", borderTop: "2px solid #22c55e", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  <p style={{ color: "#64748b", margin: 0, fontSize: "13px" }}>
                    {lang === "ar" ? "Claude AI يحلل بيانات متجرك..." : "Analyzing your store..."}
                  </p>
                </div>
              )}

              {/* Report */}
              {aiReport && !aiLoading && (
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: "14px" }}>
                  <div style={{ padding: "10px 16px", background: "rgba(34,197,94,0.1)", borderBottom: "1px solid rgba(34,197,94,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#86efac", fontSize: "12px", fontWeight: "600" }}>🤖 Claude AI • {aiReport.time}</span>
                    <button onClick={() => {
                      const blob = new Blob([aiReport.text], { type: "text/plain;charset=utf-8" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url; a.download = `${storeName}-report.txt`; a.click();
                    }} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#94a3b8", padding: "4px 10px", borderRadius: "5px", cursor: "pointer", fontSize: "11px", fontFamily: "Tajawal, sans-serif" }}>
                      ⬇️ {lang === "ar" ? "تحميل" : "Download"}
                    </button>
                  </div>
                  <div style={{ padding: "18px", maxHeight: "380px", overflowY: "auto" }}>
                    {aiReport.text.split("\n").map((line, i) => {
                      const isBold = line.startsWith("**");
                      const cleaned = line.replace(/\*\*/g, "").replace(/^#+\s*/, "");
                      if (!cleaned.trim()) return <br key={i} />;
                      return (
                        <p key={i} style={{ margin: "4px 0", fontSize: "13px", fontWeight: isBold ? "700" : "400", color: isBold ? "#e2e8f0" : "#94a3b8", lineHeight: 1.7 }}>
                          {cleaned}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Chat */}
            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>🤖</div>
                <div>
                  <p style={{ color: "#0f172a", fontSize: "14px", fontWeight: "600", margin: 0 }}>
                    {lang === "ar" ? "اسأل مستشارك الذكي" : "Ask your AI Advisor"}
                  </p>
                  <p style={{ color: "#94a3b8", fontSize: "11px", margin: 0 }}>
                    {lang === "ar" ? "يعرف كل شيء عن متجرك" : "Knows everything about your store"}
                  </p>
                </div>
                {aiChat.length > 0 && (
                  <button onClick={() => setAiChat([])} style={{ marginRight: "auto", padding: "4px 12px", background: "#f1f5f9", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", color: "#64748b", fontFamily: "Tajawal, sans-serif" }}>
                    {lang === "ar" ? "مسح" : "Clear"}
                  </button>
                )}
              </div>

              {/* Messages */}
              <div style={{ height: "280px", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {aiChat.length === 0 && (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                    <span style={{ fontSize: "36px", marginBottom: "10px" }}>💬</span>
                    <p style={{ fontSize: "13px", textAlign: "center", marginBottom: "14px" }}>
                      {lang === "ar" ? "اسأل عن أي شيء يخص متجرك" : "Ask anything about your store"}
                    </p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                      {QUICK_QUESTIONS.map((q, i) => (
                        <button key={i} onClick={() => setAiInput(q)}
                          style={{ padding: "6px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "99px", cursor: "pointer", fontSize: "12px", color: "#475569", fontFamily: "Tajawal, sans-serif" }}>
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {aiChat.map((msg, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-start" : "flex-end", gap: "8px" }}>
                    {msg.role === "assistant" && (
                      <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0, marginTop: "2px" }}>🤖</div>
                    )}
                    <div style={{
                      maxWidth: "78%", padding: "9px 13px", borderRadius: "12px",
                      background: msg.role === "user" ? "#0f172a" : "#f8fafc",
                      border: msg.role === "assistant" ? "1px solid #e2e8f0" : "none",
                      borderBottomRightRadius: msg.role === "user" ? "4px" : "12px",
                      borderBottomLeftRadius: msg.role === "assistant" ? "4px" : "12px",
                    }}>
                      <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.6, color: msg.role === "user" ? "white" : "#475569", whiteSpace: "pre-wrap" }}>
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}

                {aiChatLoading && (
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>🤖</div>
                    <div style={{ padding: "9px 13px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", gap: "4px" }}>
                      {[0, 1, 2].map(j => (
                        <div key={j} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#94a3b8", animation: `bounce 0.8s ${j * 0.15}s infinite` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "10px" }}>
                <input value={aiInput} onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendAiMessage()}
                  placeholder={lang === "ar" ? "اسأل عن متجرك..." : "Ask about your store..."}
                  disabled={aiChatLoading}
                  style={{ flex: 1, padding: "9px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", outline: "none", background: "#f8fafc" }}
                  onFocus={e => e.target.style.borderColor = "#22c55e"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
                <button onClick={sendAiMessage} disabled={aiChatLoading || !aiInput.trim()}
                  style={{ padding: "9px 18px", background: aiInput.trim() ? "#0f172a" : "#f1f5f9", color: aiInput.trim() ? "white" : "#94a3b8", border: "none", borderRadius: "10px", cursor: aiInput.trim() ? "pointer" : "not-allowed", fontSize: "13px", fontFamily: "Tajawal, sans-serif", fontWeight: "600", transition: "all 0.2s" }}>
                  {aiChatLoading ? "..." : (lang === "ar" ? "إرسال" : "Send")}
                </button>
              </div>
            </div>
          </>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-5px); } }
        `}</style>
      </main>
    </div>
  );
}

export default StoreAnalytics;