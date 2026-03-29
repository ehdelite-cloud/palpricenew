import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CITIES = [
  "رام الله", "نابلس", "الخليل", "بيت لحم", "جنين",
  "طولكرم", "قلقيلية", "أريحا", "سلفيت", "طوباس",
  "غزة", "خان يونس", "رفح", "دير البلح", "أخرى"
];

function StoreRegister() {
  const [step, setStep] = useState(1);

  // حقول الخطوة 1
  const [name,     setName]     = useState("");
  const [city,     setCity]     = useState("");

  // حقول الخطوة 2
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const navigate = useNavigate();

  function nextStep() {
    if (!name.trim()) { setError("يرجى إدخال اسم المتجر"); return; }
    if (!city)         { setError("يرجى اختيار المدينة"); return; }
    setError("");
    setStep(2);
  }

  async function register() {
    if (!email.trim()) { setError("يرجى إدخال البريد الإلكتروني"); return; }
    if (password.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    if (password !== confirm)  { setError("كلمة المرور وتأكيدها غير متطابقين"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/stores/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, city, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data === "string" ? data : data?.message || "حدث خطأ أثناء التسجيل");
        setLoading(false);
        return;
      }
      setStep(3);
    } catch {
      setError("حدث خطأ، حاول مجدداً");
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%", padding: "12px 42px 12px 14px", borderRadius: "10px",
    border: "1.5px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box",
    outline: "none", fontFamily: "Tajawal, sans-serif", transition: "border-color 0.2s"
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "Tajawal, Cairo, sans-serif" }}>

      {/* ── الجانب الأيمن — الفورم ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "white" }}>
        <div style={{ width: "100%", maxWidth: "440px" }}>

          {/* شعار */}
          <div style={{ marginBottom: "32px" }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <span style={{ fontSize: "22px", fontWeight: "900", color: "#22c55e" }}>
                Pal<span style={{ color: "#0f172a" }}>Price</span>
              </span>
            </Link>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "14px 0 5px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
              {step === 3 ? "🎉 تم التسجيل بنجاح!" : "سجّل متجرك مجاناً"}
            </h1>
            <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>
              {step === 3 ? "سيتم مراجعة طلبك والتواصل معك قريباً" : "انضم لآلاف المتاجر الفلسطينية على PalPrice"}
            </p>
          </div>

          {/* مؤشر الخطوات */}
          {step < 3 && (
            <div style={{ display: "flex", alignItems: "center", marginBottom: "28px", gap: "0" }}>
              {[1, 2].map((s, i) => {
                const done   = step > s;
                const active = step === s;
                return (
                  <div key={s} style={{ display: "flex", alignItems: "center", flex: i === 0 ? 1 : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: 0, background: done ? "#22c55e" : active ? "#0f172a" : "#f1f5f9", color: done || active ? "white" : "#94a3b8", transition: "all 0.3s" }}>
                        {done ? "✓" : s}
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: active ? "700" : "400", color: active ? "#0f172a" : "#94a3b8", whiteSpace: "nowrap" }}>
                        {s === 1 ? "معلومات المتجر" : "بيانات الدخول"}
                      </span>
                    </div>
                    {i === 0 && <div style={{ flex: 1, height: "1px", background: done ? "#22c55e" : "#e2e8f0", margin: "0 12px", transition: "background 0.3s" }} />}
                  </div>
                );
              })}
            </div>
          )}

          {/* رسالة خطأ */}
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "11px 14px", borderRadius: "10px", fontSize: "13px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "7px" }}>
              ⚠️ {error}
            </div>
          )}

          {/* ═══ الخطوة 1: معلومات المتجر ═══ */}
          {step === 1 && (
            <>
              {/* اسم المتجر */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "7px" }}>
                  اسم المتجر <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", fontSize: "15px", pointerEvents: "none" }}>🏪</span>
                  <input
                    type="text" placeholder="مثال: متجر التقنية"
                    value={name} onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && nextStep()}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#22c55e"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
              </div>

              {/* المدينة */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "7px" }}>
                  المدينة <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", fontSize: "15px", pointerEvents: "none", zIndex: 1 }}>📍</span>
                  <select
                    value={city} onChange={e => setCity(e.target.value)}
                    style={{ ...inputStyle, padding: "12px 42px 12px 14px", appearance: "none", background: "white", cursor: "pointer", color: city ? "#0f172a" : "#94a3b8" }}
                    onFocus={e => e.target.style.borderColor = "#22c55e"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                    <option value="">اختر مدينتك</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <button onClick={nextStep}
                style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "Tajawal, sans-serif", boxShadow: "0 4px 16px rgba(34,197,94,0.35)" }}>
                التالي ←
              </button>
            </>
          )}

          {/* ═══ الخطوة 2: بيانات الدخول ═══ */}
          {step === 2 && (
            <>
              {/* إيميل */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "7px" }}>
                  البريد الإلكتروني <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", fontSize: "15px", pointerEvents: "none" }}>📧</span>
                  <input
                    type="email" placeholder="store@example.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#22c55e"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
              </div>

              {/* كلمة المرور */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "7px" }}>
                  كلمة المرور <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", fontSize: "15px", pointerEvents: "none" }}>🔒</span>
                  <input
                    type={showPass ? "text" : "password"} placeholder="6 أحرف على الأقل"
                    value={password} onChange={e => setPassword(e.target.value)}
                    style={{ ...inputStyle, padding: "12px 42px 12px 42px" }}
                    onFocus={e => e.target.style.borderColor = "#22c55e"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                  <button onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "15px", padding: 0, color: "#94a3b8" }}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* تأكيد كلمة المرور */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "7px" }}>
                  تأكيد كلمة المرور <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", fontSize: "15px", pointerEvents: "none" }}>
                    {confirm && confirm === password ? "✅" : "🔑"}
                  </span>
                  <input
                    type="password" placeholder="أعد إدخال كلمة المرور"
                    value={confirm} onChange={e => setConfirm(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && register()}
                    style={{ ...inputStyle, borderColor: confirm && confirm !== password ? "#fca5a5" : "#e2e8f0" }}
                    onFocus={e => e.target.style.borderColor = confirm && confirm !== password ? "#fca5a5" : "#22c55e"}
                    onBlur={e => e.target.style.borderColor = confirm && confirm !== password ? "#fca5a5" : "#e2e8f0"}
                  />
                </div>
              </div>

              {/* أزرار */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => { setStep(1); setError(""); }}
                  style={{ flex: "0 0 auto", padding: "13px 20px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "white", color: "#475569", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                  ← رجوع
                </button>
                <button onClick={register} disabled={loading}
                  style={{ flex: 1, padding: "13px", borderRadius: "10px", border: "none", background: loading ? "#86efac" : "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Tajawal, sans-serif", boxShadow: loading ? "none" : "0 4px 16px rgba(34,197,94,0.3)" }}>
                  {loading ? "⏳ جاري التسجيل..." : "✅ إنشاء الحساب"}
                </button>
              </div>
            </>
          )}

          {/* ═══ الخطوة 3: نجاح ═══ */}
          {step === 3 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "72px", marginBottom: "16px" }}>🎉</div>
              <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: "14px", padding: "20px", marginBottom: "24px" }}>
                <p style={{ fontSize: "15px", color: "#166534", fontWeight: "600", margin: "0 0 6px" }}>
                  تم تسجيل متجر <strong>{name}</strong> بنجاح!
                </p>
                <p style={{ fontSize: "13px", color: "#16a34a", margin: 0 }}>
                  سيتم مراجعة طلبك من قِبل الإدارة وتفعيل متجرك قريباً
                </p>
              </div>
              <Link to="/store/login"
                style={{ display: "block", padding: "13px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", borderRadius: "10px", textDecoration: "none", fontSize: "15px", fontWeight: "700", boxShadow: "0 4px 16px rgba(34,197,94,0.3)" }}>
                🏪 تسجيل الدخول الآن
              </Link>
            </div>
          )}

          {/* رابط الدخول */}
          {step < 3 && (
            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#64748b" }}>
              عندك حساب بالفعل؟{" "}
              <Link to="/store/login" style={{ color: "#22c55e", fontWeight: "700", textDecoration: "none" }}>
                سجّل الدخول
              </Link>
            </p>
          )}

        </div>
      </div>

      {/* ── الجانب الأيسر — الديكور ── */}
      <div style={{ width: "45%", background: "linear-gradient(160deg, #0f172a 0%, #0d2818 50%, #14532d 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 48px", position: "relative", overflow: "hidden" }}
        className="store-reg-side">
        <style>{`@media (max-width: 768px) { .store-reg-side { display: none !important; } }`}</style>

        <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(34,197,94,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(34,197,94,0.06)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "white" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🚀</div>
          <h2 style={{ fontSize: "26px", fontWeight: "900", margin: "0 0 12px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
            انضم لـ PalPrice
          </h2>
          <p style={{ color: "#86efac", fontSize: "14px", lineHeight: 1.8, marginBottom: "36px" }}>
            سجّل متجرك وابدأ ببيع منتجاتك<br />لآلاف العملاء في فلسطين
          </p>

          {[
            { icon: "✅", text: "التسجيل مجاني 100%" },
            { icon: "⚡", text: "ابدأ خلال دقائق" },
            { icon: "📈", text: "وصول لآلاف المشترين" },
            { icon: "💰", text: "لا عمولات على المبيعات" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", padding: "11px 16px", border: "1px solid rgba(255,255,255,0.08)", textAlign: "right" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>{f.icon}</span>
              <span style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: "500" }}>{f.text}</span>
            </div>
          ))}

          <div style={{ marginTop: "28px", display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", padding: "8px 18px", borderRadius: "99px" }}>
            <span>🇵🇸</span>
            <span style={{ fontSize: "13px", color: "#86efac", fontWeight: "600" }}>منصة فلسطينية 100%</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default StoreRegister;