import { Link } from "react-router-dom";
import { useState } from "react";

function Footer({ lang = "ar" }) {
  const year = new Date().getFullYear();
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const links = {
    browse: {
      title: lang === "ar" ? "تصفح" : "Browse",
      items: [
        { to: "/", label: lang === "ar" ? "الرئيسية" : "Home" },
        { to: "/deals", label: lang === "ar" ? "أفضل العروض" : "Best Deals" },
        { to: "/stores", label: lang === "ar" ? "المتاجر" : "Stores" },
        { to: "/compare", label: lang === "ar" ? "مقارنة المنتجات" : "Compare" },
      ]
    },
    account: {
      title: lang === "ar" ? "حسابي" : "Account",
      items: [
        { to: "/login", label: lang === "ar" ? "تسجيل الدخول" : "Login" },
        { to: "/register", label: lang === "ar" ? "إنشاء حساب" : "Register" },
        { to: "/favorites", label: lang === "ar" ? "المفضلة" : "Favorites" },
        { to: "/profile", label: lang === "ar" ? "الملف الشخصي" : "Profile" },
      ]
    },
    store: {
      title: lang === "ar" ? "للتجار" : "For Stores",
      items: [
        { to: "/join", label: lang === "ar" ? "سجّل متجرك" : "Register Store" },
        { to: "/store/login", label: lang === "ar" ? "دخول المتاجر" : "Store Login" },
        { to: "/how-it-works", label: lang === "ar" ? "كيف يعمل الموقع" : "How It Works" },
        { to: "/faq", label: lang === "ar" ? "الأسئلة الشائعة" : "FAQ" },
      ]
    },
    info: {
      title: lang === "ar" ? "معلومات" : "Info",
      items: [
        { to: "/about", label: lang === "ar" ? "من نحن" : "About Us" },
        { to: "/contact", label: lang === "ar" ? "تواصل معنا" : "Contact Us" },
        { to: "/privacy", label: lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy" },
        { to: "/faq", label: lang === "ar" ? "الأسئلة الشائعة" : "FAQ" },
      ]
    }
  };

  const features = [
    { icon: "⚡", label: lang === "ar" ? "أسعار لحظية" : "Live Prices" },
    { icon: "🛡️", label: lang === "ar" ? "متاجر موثوقة" : "Trusted Stores" },
    { icon: "🔔", label: lang === "ar" ? "تنبيهات السعر" : "Price Alerts" },
    { icon: "📊", label: lang === "ar" ? "مقارنة ذكية" : "Smart Compare" },
  ];

  return (
    <>
      <style>{`
        .footer-main-grid {
          max-width: 1240px; margin: auto; display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr;
          gap: 48px; padding: 56px 24px 48px;
        }
        .footer-toggle-icon { display: none; }
        @media (max-width: 768px) {
          .footer-main-grid {
            grid-template-columns: 1fr !important;
            text-align: right;
            gap: 0 !important;
            padding: 24px 20px 10px !important;
          }
          .footer-brand-col { text-align: center; margin-bottom: 20px; padding-bottom: 30px; border-bottom: 1px solid #1e293b; }
          .footer-brand-link { justify-content: center !important; }
          .footer-brand-desc { margin: 0 auto 20px !important; }
          .footer-brand-badges { justify-content: center !important; }
          
          .footer-section { border-bottom: 1px solid #1e293b; padding: 16px 0; }
          .footer-section:last-child { border-bottom: none; }
          .footer-col-title { margin: 0 !important; color: #f8fafc !important; }
          .footer-toggle-icon { display: block; font-size: 11px; transition: transform 0.3s; opacity: 0.6; }
          .footer-toggle-icon.open { transform: rotate(180deg); opacity: 1; }
          .footer-ul { display: none !important; margin-top: 18px !important; padding-right: 8px !important; }
          .footer-ul.open { display: flex !important; }
        }
      `}</style>
      <footer className="footer" style={{ background: "#0b1120", color: "white", marginTop: "80px" }}>

      {/* Features strip */}
      <div className="footer-features-strip" style={{ borderBottom: "1px solid #1e293b" }}>
        <div style={{
          maxWidth: "1240px", margin: "auto",
          display: "flex", gap: "0",
          padding: "0 24px",
          flexWrap: "wrap"
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "16px 28px",
              borderLeft: i > 0 ? "1px solid #1e293b" : "none",
              flex: "1 1 180px"
            }}>
              <span style={{ fontSize: "20px" }}>{f.icon}</span>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#94a3b8" }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="footer-main-grid">

        {/* Brand */}
        <div className="footer-brand-col">
          <Link to="/" className="footer-brand-link" style={{
            display: "flex", alignItems: "center", gap: "8px",
            textDecoration: "none", marginBottom: "16px"
          }}>
            <span style={{
              background: "linear-gradient(135deg, #16a34a, #22c55e)",
              borderRadius: "10px", width: "32px", height: "32px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", color: "white", flexShrink: 0
            }}>₪</span>
            <span style={{ fontSize: "20px", fontWeight: "900", color: "#22c55e", letterSpacing: "-0.5px", fontFamily: "Cairo, sans-serif" }}>
              PalPrice
            </span>
          </Link>

          <p className="footer-brand-desc" style={{ color: "#475569", fontSize: "14px", lineHeight: 1.7, maxWidth: "260px", marginBottom: "20px" }}>
            {lang === "ar"
              ? "الموقع الفلسطيني الأول لمقارنة أسعار المنتجات بين المتاجر. وفّر أموالك واختر الأفضل."
              : "Palestine's first price comparison platform. Save money and find the best deals."}
          </p>

          <div className="footer-brand-badges" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
              color: "#86efac", padding: "4px 12px", borderRadius: "99px",
              fontSize: "12px", fontWeight: "600"
            }}>
              🇵🇸 {lang === "ar" ? "فلسطيني 100%" : "100% Palestinian"}
            </span>
          </div>
        </div>

        {/* Links */}
        {Object.values(links).map((section, si) => (
          <div key={si} className="footer-section">
            <h4 className="footer-col-title" onClick={() => toggleSection(si)} style={{
              fontSize: "13px", fontWeight: "700", color: "#94a3b8",
              textTransform: "uppercase", letterSpacing: "1px",
              marginBottom: "16px", margin: "0 0 16px",
              cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              {section.title}
              <span className={`footer-toggle-icon ${openSection === si ? 'open' : ''}`}>▼</span>
            </h4>
            <ul className={`footer-ul ${openSection === si ? 'open' : ''}`} style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {section.items.map((item, i) => (
                <li key={i}>
                  <Link to={item.to} style={{
                    color: "#64748b", fontSize: "14px",
                    textDecoration: "none", transition: "color 0.15s",
                    display: "flex", alignItems: "center", gap: "6px"
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = "#22c55e"}
                    onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
                  >
                    <span style={{ fontSize: "10px", opacity: 0.5 }}>←</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: "1px solid #1e293b",
        padding: "18px 24px"
      }}>
        <div style={{
          maxWidth: "1240px", margin: "auto",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: "10px"
        }}>
          <p style={{ color: "#334155", fontSize: "13px", margin: 0 }}>
            © {year} PalPrice. {lang === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {[
              { label: lang === "ar" ? "من نحن" : "About", to: "/about" },
              { label: lang === "ar" ? "سياسة الخصوصية" : "Privacy", to: "/privacy" },
              { label: lang === "ar" ? "الأسئلة الشائعة" : "FAQ", to: "/faq" },
              { label: lang === "ar" ? "تواصل معنا" : "Contact", to: "/contact" },
            ].map((l, i) => (
              <Link key={i} to={l.to} style={{
                color: "#334155", fontSize: "12px", textDecoration: "none",
                transition: "color 0.15s"
              }}
                onMouseEnter={e => e.currentTarget.style.color = "#22c55e"}
                onMouseLeave={e => e.currentTarget.style.color = "#334155"}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
    </>
  );
}

export default Footer;