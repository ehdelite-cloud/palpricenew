import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AboutPage({ lang = "ar" }) {
  // ← useState أولاً قبل أي استخدام
  const [liveStats, setLiveStats] = useState(null);

useEffect(() => {
  Promise.all([
    fetch('/api/stores').then(r=>r.json()),
    fetch('/api/products/search?q=a').then(r=>r.json()),
    fetch('/api/prices/deals').then(r=>r.json()),
  ]).then(([stores, products, deals]) => {
    setLiveStats({
      stores:   Array.isArray(stores)   ? stores.length   : 0,
      products: Array.isArray(products) ? products.length : 0,
      deals:    Array.isArray(deals)    ? deals.length    : 0,
    });
  }).catch(() => {});
}, []);

const stats = [
  { value: liveStats ? `${liveStats.products}+` : "...", label: lang === "ar" ? "منتج مقارن"    : "Products" },
  { value: liveStats ? `${liveStats.stores}+`   : "...", label: lang === "ar" ? "متجر فلسطيني"  : "Stores"   },
  { value: liveStats ? `${liveStats.deals}+`    : "...", label: lang === "ar" ? "عرض وخصم"      : "Deals"    },
  { value: "2026",                                        label: lang === "ar" ? "سنة التأسيس"   : "Founded"  },
];
  

  const values = [
    { icon: "🇵🇸", title: lang === "ar" ? "فلسطيني 100%"   : "100% Palestinian",  desc: lang === "ar" ? "نؤمن بدعم الاقتصاد الفلسطيني ونربط المستهلك بالتاجر المحلي"                   : "We support Palestinian economy by connecting consumers with local merchants" },
    { icon: "💡",  title: lang === "ar" ? "الشفافية"        : "Transparency",       desc: lang === "ar" ? "نعرض أسعار حقيقية من متاجر حقيقية — بدون تضليل أو إخفاء"                     : "Real prices from real stores — no manipulation or hidden costs" },
    { icon: "⚡",  title: lang === "ar" ? "السرعة والدقة"   : "Speed & Accuracy",   desc: lang === "ar" ? "أسعار محدّثة باستمرار لتضمن حصولك على أفضل صفقة دائماً"                     : "Continuously updated prices so you always get the best deal" },
    { icon: "🤝",  title: lang === "ar" ? "دعم التجار"      : "Supporting Merchants",desc: lang === "ar" ? "نوفر للتجار منصة مجانية لعرض منتجاتهم والوصول لعملاء أكثر"                  : "Free platform for merchants to showcase products and reach more customers" },
  ];

  

  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #1a2744 50%, #0d3320 100%)", padding: "80px 24px 64px", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(34,197,94,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)", color: "#86efac", padding: "6px 16px", borderRadius: "99px", fontSize: "12px", fontWeight: "600", marginBottom: "20px" }}>
            🇵🇸 {lang === "ar" ? "فلسطيني الهوية، عالمي الطموح" : "Palestinian Identity, Global Ambition"}
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "900", color: "white", margin: "0 0 16px", lineHeight: 1.2, fontFamily: "Cairo, Tajawal, sans-serif" }}>
            {lang === "ar" ? "من نحن" : "About Us"}
          </h1>
          <p style={{ fontSize: "16px", color: "#94a3b8", lineHeight: 1.8, margin: 0 }}>
            {lang === "ar"
              ? "PalPrice هو موقع فلسطيني لمقارنة أسعار المنتجات بين المتاجر المحلية. هدفنا مساعدة كل فلسطيني على اتخاذ قرار شراء ذكي وتوفير وقته وماله."
              : "PalPrice is a Palestinian price comparison platform. Our goal is to help every Palestinian make smart purchasing decisions and save time and money."}
          </p>
        </div>
      </div>

      {/* ── Stats ── إصلاح الموبايل: repeat(4,1fr) → repeat(auto-fit,...) */}
      <div style={{ background: "white", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{
          maxWidth: "1000px", margin: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",   /* ← إصلاح */
          padding: "0 24px",
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: "28px 16px", textAlign: "center", borderLeft: i > 0 ? "1px solid #f1f5f9" : "none" }}>
              <p style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: "900", color: "#16a34a", margin: "0 0 4px", fontFamily: "Cairo, sans-serif" }}>{s.value}</p>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      <div style={{ maxWidth: "800px", margin: "64px auto", padding: "0 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: "800", color: "#0f172a", marginBottom: "20px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
          {lang === "ar" ? "قصتنا" : "Our Story"}
        </h2>
        <p style={{ fontSize: "16px", color: "#475569", lineHeight: 1.9, marginBottom: "16px" }}>
          {lang === "ar"
            ? "بدأت فكرة PalPrice من مشكلة يعيشها كل فلسطيني يومياً — البحث عن أفضل سعر في متاجر متعددة يستهلك وقتاً وجهداً كبيرين. أردنا حل هذه المشكلة بطريقة بسيطة وذكية."
            : "PalPrice started from a problem every Palestinian faces daily — searching for the best price across multiple stores wastes time and effort. We wanted to solve this simply and smartly."}
        </p>
        <p style={{ fontSize: "16px", color: "#475569", lineHeight: 1.9 }}>
          {lang === "ar"
            ? "اليوم نربط المستهلكين بالمتاجر الفلسطينية، نساعد التجار على الوصول لعملاء أكثر، ونساهم في بناء اقتصاد رقمي فلسطيني حقيقي."
            : "Today we connect consumers with Palestinian stores, help merchants reach more customers, and contribute to building a real Palestinian digital economy."}
        </p>
      </div>

      {/* Values */}
      <div style={{ background: "#f8fafc", padding: "64px 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "auto" }}>
          <h2 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: "800", color: "#0f172a", textAlign: "center", marginBottom: "40px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
            {lang === "ar" ? "قيمنا" : "Our Values"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            {values.map((v, i) => (
              <div key={i} style={{ background: "white", borderRadius: "16px", padding: "28px 22px", border: "1.5px solid #e2e8f0", textAlign: "center" }}>
                <div style={{ fontSize: "36px", marginBottom: "14px" }}>{v.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "10px" }}>{v.title}</h3>
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", padding: "64px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: "800", color: "white", marginBottom: "12px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
          {lang === "ar" ? "انضم إلى مجتمع PalPrice" : "Join the PalPrice Community"}
        </h2>
        <p style={{ color: "#64748b", marginBottom: "28px", fontSize: "15px" }}>
          {lang === "ar" ? "سواء كنت مستهلكاً أو تاجراً، هناك مكان لك عندنا" : "Whether you're a consumer or merchant, there's a place for you here"}
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/contact" style={{ padding: "12px 28px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", borderRadius: "12px", textDecoration: "none", fontSize: "14px", fontWeight: "700", boxShadow: "0 4px 16px rgba(34,197,94,0.3)" }}>
            {lang === "ar" ? "إنشاء حساب" : "Create Account"}
          </Link>
          <Link to="/contact" style={{ padding: "12px 28px", background: "rgba(255,255,255,0.08)", color: "white", borderRadius: "12px", textDecoration: "none", fontSize: "14px", fontWeight: "600", border: "1px solid rgba(255,255,255,0.15)" }}>
            {lang === "ar" ? "سجّل متجرك" : "Register Store"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;