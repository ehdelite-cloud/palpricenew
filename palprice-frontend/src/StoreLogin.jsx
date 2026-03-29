import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function StoreLogin() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  async function login() {
    if (!email || !password) {
      setError("يرجى إدخال الإيميل وكلمة المرور");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/stores/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.error === "suspended") {
          setError(data.message || "متجرك معلق. تواصل مع الإدارة.");
        } else {
          setError(typeof data === "string" ? data : "بيانات غير صحيحة");
        }
        setLoading(false);
        return;
      }
      localStorage.setItem("storeId", data.store);
      localStorage.setItem("token",   data.token);
      navigate("/store/dashboard");
    } catch {
      setError("حدث خطأ، حاول مجدداً");
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "Tajawal, Cairo, sans-serif" }}>

      {/* ── الجانب الأيمن — الفورم ── */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px", background: "white", minHeight: "100vh"
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* شعار */}
          <div style={{ marginBottom: "36px" }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <span style={{ fontSize: "26px", fontWeight: "900", color: "#22c55e", letterSpacing: "-0.5px" }}>
                Pal<span style={{ color: "#0f172a" }}>Price</span>
              </span>
            </Link>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "16px 0 6px", fontFamily: "Cairo, Tajawal, sans-serif" }}>
              مرحباً بعودتك 👋
            </h1>
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
              سجّل دخول لإدارة متجرك على PalPrice
            </p>
          </div>

          {/* رسالة خطأ */}
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              ⚠️ {error}
            </div>
          )}

          {/* إيميل */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "7px" }}>
              البريد الإلكتروني
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" }}>📧</span>
              <input
                type="email"
                placeholder="store@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && login()}
                style={{ width: "100%", padding: "12px 42px 12px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s", fontFamily: "Tajawal, sans-serif" }}
                onFocus={e => e.target.style.borderColor = "#22c55e"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
          </div>

          {/* كلمة المرور */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "7px" }}>
              كلمة المرور
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" }}>🔒</span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && login()}
                style={{ width: "100%", padding: "12px 42px 12px 42px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "14px", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s", fontFamily: "Tajawal, sans-serif" }}
                onFocus={e => e.target.style.borderColor = "#22c55e"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: 0, color: "#94a3b8" }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* زر الدخول */}
          <button
            onClick={login}
            disabled={loading}
            style={{
              width: "100%", padding: "13px", borderRadius: "10px", border: "none",
              background: loading ? "#86efac" : "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "white", fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "Tajawal, sans-serif", boxShadow: loading ? "none" : "0 4px 16px rgba(34,197,94,0.35)",
              transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
            }}>
            {loading ? <>⏳ جاري التحقق...</> : <>🏪 دخول لوحة التحكم</>}
          </button>

          {/* رابط التسجيل */}
          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#64748b" }}>
            ليس لديك حساب؟{" "}
            <Link to="/store/register" style={{ color: "#22c55e", fontWeight: "700", textDecoration: "none" }}>
              سجّل متجرك مجاناً ←
            </Link>
          </p>

          {/* رابط دخول المستخدم */}
          <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
            <Link to="/login" style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "none" }}>
              أنت مستخدم عادي؟ <span style={{ color: "#475569", fontWeight: "600" }}>سجّل دخول هنا</span>
            </Link>
          </div>

        </div>
      </div>

      {/* ── الجانب الأيسر — الديكور ── */}
      <div style={{
        width: "45%", background: "linear-gradient(160deg, #0f172a 0%, #0d2818 50%, #14532d 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "60px 48px", position: "relative", overflow: "hidden",
      }}
        className="store-login-side">
        <style>{`
          @media (max-width: 768px) { .store-login-side { display: none !important; } }
        `}</style>

        {/* دوائر ديكورية */}
        <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(34,197,94,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(34,197,94,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(34,197,94,0.04)", pointerEvents: "none" }} />

        {/* المحتوى */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "white" }}>
          <div style={{ fontSize: "72px", marginBottom: "24px" }}>🏪</div>
          <h2 style={{ fontSize: "28px", fontWeight: "900", margin: "0 0 14px", fontFamily: "Cairo, Tajawal, sans-serif", lineHeight: 1.3 }}>
            لوحة تحكم متجرك
          </h2>
          <p style={{ color: "#86efac", fontSize: "15px", lineHeight: 1.8, marginBottom: "40px" }}>
            أدر منتجاتك وأسعارك وحملاتك<br />من مكان واحد
          </p>

          {/* مميزات */}
          {[
            { icon: "📦", text: "إدارة المنتجات والأسعار" },
            { icon: "📢", text: "إنشاء حملات وكوبونات خصم" },
            { icon: "📊", text: "تحليلات ومشاهدات المتجر" },
            { icon: "⭐", text: "مراجعات وتقييمات العملاء" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", padding: "12px 16px", border: "1px solid rgba(255,255,255,0.08)", textAlign: "right" }}>
              <span style={{ fontSize: "20px", flexShrink: 0 }}>{f.icon}</span>
              <span style={{ fontSize: "14px", color: "#e2e8f0", fontWeight: "500" }}>{f.text}</span>
            </div>
          ))}

          {/* شارة */}
          <div style={{ marginTop: "32px", display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", padding: "8px 18px", borderRadius: "99px" }}>
            <span style={{ fontSize: "14px" }}>🇵🇸</span>
            <span style={{ fontSize: "13px", color: "#86efac", fontWeight: "600" }}>منصة فلسطينية 100%</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default StoreLogin;