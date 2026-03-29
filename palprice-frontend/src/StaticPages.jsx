import { Link } from "react-router-dom";
import { useState } from "react";

/* ═══════════════════════════════════════
   PrivacyPage
═══════════════════════════════════════ */
export function PrivacyPage({ lang = "ar" }) {
  const sections = [
    { title: lang === "ar" ? "المعلومات التي نجمعها"  : "Information We Collect",  content: lang === "ar" ? "نجمع المعلومات التي تقدمها عند التسجيل مثل الاسم والبريد الإلكتروني. كذلك نجمع بيانات الاستخدام مثل المنتجات التي تشاهدها وتفضلها لتحسين تجربتك." : "We collect information you provide during registration such as name and email. We also collect usage data like products you view and favorite to improve your experience." },
    { title: lang === "ar" ? "كيف نستخدم معلوماتك"   : "How We Use Your Information", content: lang === "ar" ? "نستخدم معلوماتك لتخصيص تجربتك، إرسال تنبيهات الأسعار التي طلبتها، وتحسين خدماتنا. لا نبيع معلوماتك لأي طرف ثالث." : "We use your information to personalize your experience, send price alerts you requested, and improve our services. We never sell your information to third parties." },
    { title: lang === "ar" ? "الكوكيز"               : "Cookies",                  content: lang === "ar" ? "نستخدم الكوكيز لحفظ تفضيلاتك وإبقائك مسجل الدخول. يمكنك تعطيل الكوكيز من إعدادات متصفحك، لكن بعض الميزات قد لا تعمل بشكل صحيح." : "We use cookies to save your preferences and keep you logged in. You can disable cookies in your browser settings, but some features may not work properly." },
    { title: lang === "ar" ? "أمان بياناتك"          : "Data Security",            content: lang === "ar" ? "نحمي بياناتك باستخدام تشفير SSL وأفضل الممارسات الأمنية. كلمات المرور مشفّرة ولا يمكن لأحد الاطلاع عليها بما فيهم فريقنا." : "We protect your data using SSL encryption and best security practices. Passwords are encrypted and no one can access them, including our team." },
    { title: lang === "ar" ? "حقوقك"                : "Your Rights",              content: lang === "ar" ? "يحق لك الوصول لبياناتك، تعديلها، أو حذفها في أي وقت من صفحة الملف الشخصي. للاستفسار تواصل معنا عبر صفحة التواصل." : "You have the right to access, modify, or delete your data at any time from the profile page. For inquiries, contact us through the contact page." },
  ];

  return (
    <div>
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #1a2744 100%)", padding: "60px 24px 48px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: "900", color: "white", margin: "0 0 12px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
          🔒 {lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
          {lang === "ar" ? "آخر تحديث: يناير 2026" : "Last updated: January 2026"}
        </p>
      </div>
      <div style={{ maxWidth: "760px", margin: "48px auto", padding: "0 24px 64px" }}>
        {sections.map((s, i) => (
          <div key={i} style={{ background: "white", borderRadius: "14px", padding: "24px 28px", marginBottom: "14px", border: "1.5px solid #e2e8f0" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#f0fdf4", border: "1px solid #dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "800", color: "#16a34a", flexShrink: 0 }}>{i + 1}</span>
              {s.title}
            </h2>
            <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.8, margin: 0 }}>{s.content}</p>
          </div>
        ))}
        <div style={{ background: "#f0fdf4", borderRadius: "14px", padding: "20px 24px", border: "1px solid #bbf7d0", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#166534", margin: 0 }}>
            {lang === "ar" ? "للاستفسار عن سياسة الخصوصية " : "For privacy policy inquiries "}
            <Link to="/contact" style={{ color: "#16a34a", fontWeight: "700" }}>{lang === "ar" ? "تواصل معنا" : "contact us"}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   FAQPage
═══════════════════════════════════════ */
export function FAQPage({ lang = "ar" }) {
  const [open, setOpen] = useState(null);

  const faqs = [
    { q: lang === "ar" ? "هل PalPrice مجاني؟"                  : "Is PalPrice free?",                    a: lang === "ar" ? "نعم! PalPrice مجاني تماماً للمستهلكين. يمكنك مقارنة الأسعار وإضافة المفضلة وإنشاء تنبيهات الأسعار بدون أي رسوم."    : "Yes! PalPrice is completely free for consumers. Compare prices, add favorites, and create price alerts at no cost." },
    { q: lang === "ar" ? "كيف أضيف منتجاً للمقارنة؟"           : "How do I add a product to compare?",   a: lang === "ar" ? "افتح صفحة أي منتج واضغط على زر \"مقارنة\". يمكنك إضافة حتى 4 منتجات من نفس الفئة ومقارنة أسعارها ومواصفاتها."         : "Open any product page and click the \"Compare\" button. You can add up to 4 products from the same category and compare their prices and specs." },
    { q: lang === "ar" ? "كيف تعمل تنبيهات السعر؟"             : "How do price alerts work?",            a: lang === "ar" ? "في صفحة أي منتج، أدخل بريدك الإلكتروني والسعر المستهدف. عندما ينخفض السعر لهذا الحد سترسل لك رسالة إلكترونية تلقائياً."  : "On any product page, enter your email and target price. When the price drops to that level, you'll receive an automatic email notification." },
    { q: lang === "ar" ? "هل الأسعار محدّثة؟"                  : "Are prices up to date?",               a: lang === "ar" ? "نعم، التجار يحدّثون أسعارهم باستمرار من خلال لوحة التحكم الخاصة بهم. نوصي دائماً بالتحقق من السعر مباشرة في موقع المتجر قبل الشراء." : "Yes, merchants continuously update their prices through their dashboard. We always recommend verifying the price directly on the store's website before purchasing." },
    { q: lang === "ar" ? "كيف أسجّل متجري؟"                   : "How do I register my store?",          a: lang === "ar" ? "اضغط على \"سجّل متجرك\" من القائمة العلوية. أنشئ حساباً للمتجر وأضف منتجاتك. ستراجع الإدارة طلبك وتوافق عليه خلال 24 ساعة." : "Click \"Register Store\" from the top menu. Create a store account and add your products. The admin will review and approve your request within 24 hours." },
    { q: lang === "ar" ? "هل يمكنني الشراء مباشرة من PalPrice?" : "Can I buy directly from PalPrice?",   a: lang === "ar" ? "لا، PalPrice هو موقع مقارنة أسعار فقط. نعرض لك الأسعار من المتاجر المختلفة وعليك الشراء مباشرة من المتجر الذي اخترته." : "No, PalPrice is a price comparison site only. We show you prices from different stores and you purchase directly from your chosen store." },
  ];

  return (
    <div>
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #1a2744 100%)", padding: "60px 24px 48px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: "900", color: "white", margin: "0 0 12px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
          ❓ {lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "15px", margin: 0 }}>
          {lang === "ar" ? "كل ما تريد معرفته عن PalPrice" : "Everything you need to know about PalPrice"}
        </p>
      </div>
      <div style={{ maxWidth: "760px", margin: "48px auto", padding: "0 24px 64px" }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ background: "white", borderRadius: "14px", marginBottom: "10px", border: `1.5px solid ${open === i ? "#22c55e" : "#e2e8f0"}`, overflow: "hidden", transition: "border-color 0.2s" }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", padding: "18px 22px", background: "none", border: "none", textAlign: "right", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", fontFamily: "Tajawal, sans-serif" }}>
              <span style={{ fontSize: "15px", fontWeight: "700", color: open === i ? "#16a34a" : "#0f172a", textAlign: "right" }}>{faq.q}</span>
              <span style={{ fontSize: "18px", color: open === i ? "#22c55e" : "#94a3b8", transition: "transform 0.2s", transform: open === i ? "rotate(45deg)" : "none", flexShrink: 0 }}>+</span>
            </button>
            {open === i && (
              <div style={{ padding: "0 22px 18px" }}>
                <div style={{ height: "1px", background: "#f1f5f9", marginBottom: "16px" }} />
                <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.8, margin: 0 }}>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
        <div style={{ textAlign: "center", marginTop: "32px", padding: "24px", background: "#f8fafc", borderRadius: "14px", border: "1.5px solid #e2e8f0" }}>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "14px" }}>
            {lang === "ar" ? "لم تجد إجابة لسؤالك؟" : "Didn't find your answer?"}
          </p>
          <Link to="/contact" style={{ padding: "10px 24px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", borderRadius: "10px", textDecoration: "none", fontSize: "14px", fontWeight: "700" }}>
            {lang === "ar" ? "تواصل معنا" : "Contact Us"}
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   JoinStorePage
═══════════════════════════════════════ */
export function JoinStorePage({ lang = "ar" }) {
  const steps = [
    { icon: "📝", title: lang === "ar" ? "سجّل متجرك"   : "Register Store",   desc: lang === "ar" ? "أنشئ حساباً للمتجر في دقيقتين بمعلومات بسيطة"      : "Create a store account in 2 minutes with basic info" },
    { icon: "📦", title: lang === "ar" ? "أضف منتجاتك"  : "Add Products",     desc: lang === "ar" ? "أضف منتجاتك يدوياً أو برفع ملف Excel جماعي"          : "Add products manually or via bulk Excel upload" },
    { icon: "✅", title: lang === "ar" ? "مراجعة الإدارة": "Admin Review",     desc: lang === "ar" ? "تراجع إدارة PalPrice منتجاتك وتوافق عليها"             : "PalPrice admin reviews and approves your products" },
    { icon: "🚀", title: lang === "ar" ? "ابدأ البيع"    : "Start Selling",    desc: lang === "ar" ? "منتجاتك تظهر للمستخدمين ويبدأ الطلب"                   : "Your products appear to users and orders begin" },
  ];

  const benefits = [
    { icon: "🆓", title: lang === "ar" ? "مجاني تماماً"       : "Completely Free",     desc: lang === "ar" ? "لا رسوم تسجيل ولا عمولة على المبيعات"             : "No registration fees and no sales commission" },
    { icon: "📊", title: lang === "ar" ? "إحصائيات مفصّلة"   : "Detailed Analytics",  desc: lang === "ar" ? "تابع مشاهدات منتجاتك وأداء متجرك"                 : "Track product views and store performance" },
    { icon: "🤖", title: lang === "ar" ? "إضافة ذكية بـ AI"  : "AI Smart Add",        desc: lang === "ar" ? "أضف منتجات بالذكاء الاصطناعي في ثوانٍ"             : "Add products using AI in seconds" },
    { icon: "🎯", title: lang === "ar" ? "عملاء مستهدفون"    : "Targeted Customers",  desc: lang === "ar" ? "وصل لعملاء يبحثون فعلاً عن منتجاتك"                : "Reach customers actively searching for your products" },
    { icon: "⚡", title: lang === "ar" ? "تنافس بالسعر"       : "Price Competition",   desc: lang === "ar" ? "اعرف كيف تقارن أسعارك مع المنافسين"                : "Know how your prices compare to competitors" },
    { icon: "🛡️", title: lang === "ar" ? "دعم الإدارة"       : "Admin Support",       desc: lang === "ar" ? "تواصل مع الإدارة مباشرة لأي استفسار"               : "Contact admin directly for any inquiry" },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #0d3320 100%)", padding: "80px 24px 64px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(34,197,94,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.25)", color: "#86efac", padding: "6px 16px", borderRadius: "99px", fontSize: "12px", fontWeight: "600", marginBottom: "20px" }}>
            🏪 {lang === "ar" ? "للتجار الفلسطينيين" : "For Palestinian Merchants"}
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 48px)", fontWeight: "900", color: "white", margin: "0 0 16px", lineHeight: 1.2, fontFamily: "Cairo, Tajawal, sans-serif" }}>
            {lang === "ar" ? "سجّل متجرك على PalPrice" : "Register Your Store on PalPrice"}
          </h1>
          <p style={{ fontSize: "16px", color: "#94a3b8", lineHeight: 1.8, marginBottom: "32px" }}>
            {lang === "ar" ? "أضف متجرك مجاناً وصل لآلاف العملاء الذين يبحثون عن أفضل الأسعار في فلسطين" : "Add your store for free and reach thousands of customers looking for the best prices in Palestine"}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/contact" style={{ padding: "14px 32px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", borderRadius: "12px", textDecoration: "none", fontSize: "15px", fontWeight: "700", boxShadow: "0 4px 20px rgba(34,197,94,0.35)" }}>
              🚀 {lang === "ar" ? "سجّل متجرك الآن" : "Register Now — Free"}
            </Link>
            <Link to="/contact" style={{ padding: "14px 28px", background: "rgba(255,255,255,0.08)", color: "white", borderRadius: "12px", textDecoration: "none", fontSize: "15px", fontWeight: "600", border: "1px solid rgba(255,255,255,0.15)" }}>
              {lang === "ar" ? "لديك حساب؟ ادخل" : "Have account? Login"}
            </Link>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div style={{ maxWidth: "900px", margin: "64px auto", padding: "0 24px" }}>
        <h2 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: "800", color: "#0f172a", textAlign: "center", marginBottom: "36px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
          {lang === "ar" ? "كيف تبدأ؟" : "How to Start?"}
        </h2>
        {/* ← إصلاح: auto-fit بدل repeat(4,1fr) الثابت */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "28px 20px", background: "white", borderRadius: "16px", border: "1.5px solid #e2e8f0", position: "relative" }}>
              <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", fontSize: "12px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
              <div style={{ fontSize: "36px", marginBottom: "12px", marginTop: "8px" }}>{s.icon}</div>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>{s.title}</h3>
              <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div style={{ background: "#f8fafc", padding: "64px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "auto" }}>
          <h2 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: "800", color: "#0f172a", textAlign: "center", marginBottom: "36px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
            {lang === "ar" ? "لماذا PalPrice؟" : "Why PalPrice?"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display: "flex", gap: "14px", background: "white", borderRadius: "14px", padding: "20px", border: "1.5px solid #e2e8f0" }}>
                <span style={{ fontSize: "28px", flexShrink: 0 }}>{b.icon}</span>
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "5px" }}>{b.title}</h3>
                  <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Bottom */}
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", padding: "56px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(20px,3vw,24px)", fontWeight: "800", color: "white", marginBottom: "10px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
          {lang === "ar" ? "جاهز للبدء؟" : "Ready to Start?"}
        </h2>
        <p style={{ color: "#64748b", marginBottom: "24px" }}>
          {lang === "ar" ? "سجّل مجاناً الآن وأضف منتجك الأول خلال 5 دقائق" : "Register free now and add your first product in 5 minutes"}
        </p>
        <Link to="/contact" style={{ padding: "13px 32px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", borderRadius: "12px", textDecoration: "none", fontSize: "15px", fontWeight: "700", boxShadow: "0 4px 16px rgba(34,197,94,0.3)" }}>
          {lang === "ar" ? "سجّل متجرك مجاناً" : "Register Your Store — Free"}
        </Link>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   HowItWorksPage
═══════════════════════════════════════ */
export function HowItWorksPage({ lang = "ar" }) {
  const forUsers = [
    { icon: "🔍", title: lang === "ar" ? "ابحث عن منتج"   : "Search Product",   desc: lang === "ar" ? "ابحث بالاسم أو تصفح الفئات"             : "Search by name or browse categories"        },
    { icon: "📊", title: lang === "ar" ? "قارن الأسعار"   : "Compare Prices",   desc: lang === "ar" ? "شوف الأسعار من كل المتاجر دفعة وحدة"     : "See prices from all stores at once"         },
    { icon: "🏆", title: lang === "ar" ? "اختر الأفضل"    : "Choose the Best",  desc: lang === "ar" ? "اختر أفضل سعر واشتري من المتجر مباشرة"   : "Choose the best price and buy directly"     },
  ];

  const forStores = [
    { icon: "📝", title: lang === "ar" ? "سجّل متجرك"     : "Register",         desc: lang === "ar" ? "تسجيل مجاني في دقيقتين"                 : "Free registration in 2 minutes"            },
    { icon: "📦", title: lang === "ar" ? "أضف منتجاتك"   : "Add Products",     desc: lang === "ar" ? "يدوياً أو بالذكاء الاصطناعي"              : "Manually or with AI"                       },
    { icon: "👥", title: lang === "ar" ? "وصل لعملاء أكثر": "Reach Customers",  desc: lang === "ar" ? "آلاف المستخدمين يبحثون يومياً"            : "Thousands of daily users searching"        },
  ];

  const features = [
    { icon: "🔔", title: lang === "ar" ? "تنبيهات السعر"  : "Price Alerts",     desc: lang === "ar" ? "حدّد سعرك المستهدف واستقبل إشعاراً لما ينخفض السعر"                       : "Set your target price and get notified when it drops" },
    { icon: "⚖️", title: lang === "ar" ? "المقارنة الذكية": "Smart Compare",    desc: lang === "ar" ? "قارن حتى 4 منتجات جنباً إلى جنب مع مواصفاتها الكاملة"                    : "Compare up to 4 products side by side with full specs" },
    { icon: "❤️", title: lang === "ar" ? "قائمة المفضلة"  : "Favorites List",   desc: lang === "ar" ? "احفظ منتجاتك وتابع تغيرات أسعارها بسهولة"                                : "Save products and easily track price changes" },
    { icon: "🏪", title: lang === "ar" ? "صفحة المتجر"    : "Store Page",       desc: lang === "ar" ? "استعرض كل منتجات أي متجر وقيّمه من تجربتك"                               : "Browse all store products and rate from your experience" },
  ];

  /* مكوّن مشترك للـ steps — 3 بطاقات responsive */
  const StepsGrid = ({ items }) => (
    /* ← إصلاح: repeat(3,1fr) → repeat(auto-fit, minmax(180px,1fr)) */
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
      {items.map((s, i) => (
        <div key={i} style={{ background: "white", borderRadius: "14px", padding: "24px", border: "1.5px solid #e2e8f0", textAlign: "center" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#f0fdf4", border: "1px solid #dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", margin: "0 auto 14px" }}>{s.icon}</div>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#22c55e", marginBottom: "6px" }}>STEP {i + 1}</div>
          <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>{s.title}</h3>
          <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #1a2744 100%)", padding: "64px 24px 52px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: "900", color: "white", margin: "0 0 12px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
          ⚡ {lang === "ar" ? "كيف يعمل PalPrice؟" : "How PalPrice Works?"}
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "15px", margin: 0, maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
          {lang === "ar" ? "دليل سريع لكل ما يمكنك فعله على موقعنا" : "A quick guide to everything you can do on our platform"}
        </p>
      </div>

      <div style={{ maxWidth: "1000px", margin: "auto", padding: "48px 24px 64px" }}>

        {/* للمستهلكين */}
        <div style={{ marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(18px,2.5vw,22px)", fontWeight: "800", color: "#0f172a", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
            <span style={{ background: "#f0fdf4", padding: "6px 12px", borderRadius: "8px", fontSize: "14px", color: "#16a34a", fontWeight: "700" }}>👤</span>
            {lang === "ar" ? "للمستهلكين" : "For Consumers"}
          </h2>
          <StepsGrid items={forUsers} />
        </div>

        {/* للتجار */}
        <div style={{ marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(18px,2.5vw,22px)", fontWeight: "800", color: "#0f172a", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
            <span style={{ background: "#f0fdf4", padding: "6px 12px", borderRadius: "8px", fontSize: "14px", color: "#16a34a", fontWeight: "700" }}>🏪</span>
            {lang === "ar" ? "للتجار" : "For Merchants"}
          </h2>
          <StepsGrid items={forStores} />
        </div>

        {/* مميزات إضافية */}
        <h2 style={{ fontSize: "clamp(18px,2.5vw,22px)", fontWeight: "800", color: "#0f172a", marginBottom: "24px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
          {lang === "ar" ? "مميزات إضافية" : "Extra Features"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "40px" }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: "14px", background: "white", borderRadius: "12px", padding: "18px", border: "1.5px solid #e2e8f0" }}>
              <span style={{ fontSize: "26px", flexShrink: 0 }}>{f.icon}</span>
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>{f.title}</h3>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", padding: "32px", background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", borderRadius: "16px", border: "1px solid #bbf7d0" }}>
          <p style={{ fontSize: "16px", fontWeight: "700", color: "#16a34a", marginBottom: "16px" }}>
            {lang === "ar" ? "جاهز تبدأ؟" : "Ready to start?"}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" style={{ padding: "11px 24px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", borderRadius: "10px", textDecoration: "none", fontSize: "14px", fontWeight: "700" }}>
              {lang === "ar" ? "إنشاء حساب" : "Create Account"}
            </Link>
            <Link to="/" style={{ padding: "11px 24px", background: "white", color: "#16a34a", borderRadius: "10px", textDecoration: "none", fontSize: "14px", fontWeight: "600", border: "1.5px solid #22c55e" }}>
              {lang === "ar" ? "تصفح المنتجات" : "Browse Products"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}