import { useState } from "react";

function ContactPage({ lang = "ar" }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    // محاكاة إرسال — يمكن ربطها بـ API لاحقاً
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setSending(false);
  }

  const contacts = [
    { icon: "📧", label: lang === "ar" ? "البريد الإلكتروني" : "Email", value: "support@palprice.ps" },
    { icon: "📍", label: lang === "ar" ? "الموقع" : "Location", value: lang === "ar" ? "فلسطين 🇵🇸" : "Palestine 🇵🇸" },
    { icon: "⏰", label: lang === "ar" ? "ساعات الدعم" : "Support Hours", value: lang === "ar" ? "9 صباحاً — 6 مساءً" : "9 AM — 6 PM" },
  ];

  const inp = { width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "14px", fontFamily: "Tajawal, sans-serif", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" };

  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #1a2744 100%)", padding: "64px 24px 52px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(34,197,94,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: "900", color: "white", margin: "0 0 12px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
            📞 {lang === "ar" ? "تواصل معنا" : "Contact Us"}
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "15px", margin: 0 }}>
            {lang === "ar" ? "نحن هنا للمساعدة — تواصل معنا في أي وقت" : "We're here to help — reach out anytime"}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "auto", padding: "48px 24px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "32px", alignItems: "start" }}>

          {/* معلومات التواصل */}
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "20px" }}>
              {lang === "ar" ? "معلومات التواصل" : "Contact Info"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>
              {contacts.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", background: "white", borderRadius: "12px", padding: "16px 18px", border: "1.5px solid #e2e8f0" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                    {c.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{c.label}</p>
                    <p style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: 0 }}>{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", borderRadius: "14px", padding: "20px", border: "1px solid #bbf7d0" }}>
              <p style={{ fontSize: "14px", fontWeight: "700", color: "#16a34a", margin: "0 0 6px" }}>
                💬 {lang === "ar" ? "للتجار" : "For Merchants"}
              </p>
              <p style={{ fontSize: "13px", color: "#166534", margin: 0, lineHeight: 1.6 }}>
                {lang === "ar" ? "إذا كنت تاجراً وتريد إضافة متجرك أو لديك سؤال، راسلنا مباشرة وسنرد خلال 24 ساعة." : "If you're a merchant wanting to add your store or have a question, message us directly and we'll respond within 24 hours."}
              </p>
            </div>
          </div>

          {/* فورم التواصل */}
          <div style={{ background: "white", borderRadius: "16px", padding: "32px", border: "1.5px solid #e2e8f0" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "56px", marginBottom: "16px" }}>✅</div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
                  {lang === "ar" ? "تم إرسال رسالتك!" : "Message Sent!"}
                </h3>
                <p style={{ color: "#64748b", fontSize: "14px" }}>
                  {lang === "ar" ? "سنرد عليك خلال 24 ساعة على بريدك الإلكتروني" : "We'll reply within 24 hours to your email"}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", marginBottom: "22px", margin: "0 0 22px" }}>
                  {lang === "ar" ? "أرسل رسالة" : "Send a Message"}
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" }}>{lang === "ar" ? "الاسم *" : "Name *"}</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={lang === "ar" ? "اسمك" : "Your name"} required style={inp}
                      onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" }}>{lang === "ar" ? "البريد *" : "Email *"}</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" required style={inp}
                      onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                  </div>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" }}>{lang === "ar" ? "الموضوع" : "Subject"}</label>
                  <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} style={{ ...inp, cursor: "pointer" }}
                    onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                    <option value="">{lang === "ar" ? "اختر الموضوع" : "Select subject"}</option>
                    <option value="general">{lang === "ar" ? "استفسار عام" : "General inquiry"}</option>
                    <option value="store">{lang === "ar" ? "تسجيل متجر" : "Store registration"}</option>
                    <option value="bug">{lang === "ar" ? "الإبلاغ عن مشكلة" : "Report a bug"}</option>
                    <option value="other">{lang === "ar" ? "أخرى" : "Other"}</option>
                  </select>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" }}>{lang === "ar" ? "الرسالة *" : "Message *"}</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={5} placeholder={lang === "ar" ? "اكتب رسالتك هنا..." : "Write your message here..."} required
                    style={{ ...inp, resize: "vertical" }}
                    onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </div>

                <button type="submit" disabled={sending} style={{ width: "100%", padding: "13px", background: sending ? "#86efac" : "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: sending ? "not-allowed" : "pointer", fontFamily: "Tajawal, sans-serif", boxShadow: "0 4px 16px rgba(34,197,94,0.25)" }}>
                  {sending ? (lang === "ar" ? "جاري الإرسال..." : "Sending...") : (lang === "ar" ? "إرسال الرسالة" : "Send Message")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;