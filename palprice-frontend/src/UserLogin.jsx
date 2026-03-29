import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function UserLogin({ lang = "ar", onLogin }) {
  const [identifier, setIdentifier] = useState(""); // إيميل أو هاتف
  const [password,   setPassword]   = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [welcome,    setWelcome]    = useState(null); // { name }
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail,setForgotEmail]= useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const navigate = useNavigate();

  const isPhone = /^[0-9+\s-]{7,}$/.test(identifier.trim());

  async function handleLogin() {
    if (!identifier.trim() || !password) {
      setError(lang === "ar" ? "يرجى ملء جميع الحقول" : "Please fill all fields");
      return;
    }
    setError(""); setLoading(true);
    try {
      const body = isPhone
        ? { phone: identifier.trim(), password }
        : { email: identifier.trim(), password };

      const res  = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error === "banned"         ? (data.message || (lang === "ar" ? "حسابك محظور، تواصل مع الإدارة" : "Account banned")) :
          data.error === "User not found" ? (lang === "ar" ? "الحساب غير موجود"    : "Account not found") :
                                             (lang === "ar" ? "كلمة المرور خطأ"     : "Wrong password")
        );
        setLoading(false); return;
      }

      localStorage.setItem("userToken",  data.token);
      localStorage.setItem("userId",     data.user.id);
      localStorage.setItem("userName",   data.user.name);
      if (data.user.avatar) localStorage.setItem("userAvatar", data.user.avatar);
      if (onLogin) onLogin({ ...data.user, token: data.token });

      setWelcome({ name: data.user.name?.split(" ")[0] || "👋" });
      setTimeout(() => { setWelcome(null); navigate("/"); }, 2500);
    } catch {
      setError(lang === "ar" ? "حدث خطأ، حاول مجدداً" : "Something went wrong");
    }
    setLoading(false);
  }

  async function handleForgot() {
    if (!forgotEmail.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/users/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
    } catch {}
    setForgotSent(true); setLoading(false);
  }

  /* ══ شاشة الترحيب ══ */
  if (welcome) return (
    <div style={{ position: "fixed", inset: 0, background: "linear-gradient(135deg,#0f172a,#0d3320)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <style>{`
        @keyframes popIn  { from{transform:scale(0.6);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes pulse2 { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.5);opacity:1} }
      `}</style>
      <div style={{ textAlign: "center", animation: "popIn .4s cubic-bezier(.34,1.56,.64,1)" }}>
        <div style={{ fontSize: "72px", marginBottom: "20px" }}>👋</div>
        <h1 style={{ color: "#4ade80", fontFamily: "Cairo,sans-serif", fontSize: "clamp(22px,4vw,34px)", fontWeight: "900", margin: "0 0 8px" }}>
          {lang === "ar" ? `أهلاً، ${welcome.name}!` : `Welcome back, ${welcome.name}!`}
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "15px" }}>{lang === "ar" ? "جاري التحويل..." : "Redirecting..."}</p>
        <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "24px" }}>
          {[0,1,2].map(i => <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", animation: `pulse2 1.2s ${i*.2}s infinite` }} />)}
        </div>
      </div>
    </div>
  );

  /* ══ نسيت كلمة المرور ══ */
  if (forgotMode) return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "white", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "40px", width: "100%", maxWidth: "400px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
        {forgotSent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>📧</div>
            <h2 style={{ color: "#0f172a", fontFamily: "Cairo,sans-serif", fontSize: "20px", fontWeight: "800", marginBottom: "10px" }}>{lang === "ar" ? "تم الإرسال!" : "Sent!"}</h2>
            <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.7, marginBottom: "24px" }}>
              {lang === "ar" ? "إذا كان البريد مسجلاً ستصلك رسالة الاسترجاع خلال دقائق." : "If the email is registered, you'll receive a reset link shortly."}
            </p>
            <button onClick={() => { setForgotMode(false); setForgotSent(false); setForgotEmail(""); }}
              style={{ padding: "11px 28px", background: "#22c55e", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>
              {lang === "ar" ? "العودة للدخول" : "Back to Login"}
            </button>
          </div>
        ) : (
          <>
            <button onClick={() => setForgotMode(false)} style={{ background: "none", border: "none", color: "#64748b", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontFamily: "Tajawal,sans-serif", padding: 0, marginBottom: "20px" }}>← {lang === "ar" ? "رجوع" : "Back"}</button>
            <h2 style={{ color: "#0f172a", fontFamily: "Cairo,sans-serif", fontSize: "20px", fontWeight: "800", marginBottom: "8px" }}>🔑 {lang === "ar" ? "نسيت كلمة المرور؟" : "Forgot Password?"}</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>{lang === "ar" ? "أدخل بريدك الإلكتروني وسنرسل رابط الاسترجاع" : "Enter your email to receive a reset link"}</p>
            <input type="email" placeholder="you@example.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleForgot()}
              style={{ width: "100%", padding: "11px 16px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "14px", fontFamily: "Tajawal,sans-serif", outline: "none", background: "#f8fafc", boxSizing: "border-box", marginBottom: "14px" }}
              onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            <button onClick={handleForgot} disabled={!forgotEmail.trim() || loading}
              style={{ width: "100%", padding: "12px", background: forgotEmail.trim() ? "#22c55e" : "#e2e8f0", color: forgotEmail.trim() ? "white" : "#94a3b8", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: forgotEmail.trim() ? "pointer" : "not-allowed", fontFamily: "Tajawal,sans-serif" }}>
              {loading ? "..." : (lang === "ar" ? "إرسال رابط الاسترجاع" : "Send Reset Link")}
            </button>
          </>
        )}
      </div>
    </div>
  );

  /* ══ صفحة الدخول الرئيسية ══ */
  const inp = { width: "100%", padding: "13px 16px", borderRadius: "12px", border: "1.5px solid #e2e8f0", fontSize: "15px", fontFamily: "Tajawal,sans-serif", outline: "none", background: "#f8fafc", boxSizing: "border-box", transition: "all 0.2s", color: "#0f172a" };

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>

      {/* القسم الأيسر — ديكور (مخفي على الموبايل) */}
      <div style={{ flex: 1, background: "linear-gradient(160deg,#0f172a 0%,#0d3320 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", position: "relative", overflow: "hidden" }} className="login-left-panel">
        <style>{`
          @media(max-width:768px){ .login-left-panel{display:none!important;} .login-right-panel{border-radius:0!important;} }
        `}</style>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 80%, rgba(34,197,94,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(34,197,94,0.08) 0%, transparent 50%)" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "360px" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🛍️</div>
          <h2 style={{ color: "white", fontFamily: "Cairo,sans-serif", fontSize: "28px", fontWeight: "900", marginBottom: "14px" }}>
            {lang === "ar" ? "وفّر أموالك مع PalPrice" : "Save Money with PalPrice"}
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: 1.8, marginBottom: "32px" }}>
            {lang === "ar"
              ? "قارن أسعار آلاف المنتجات من مئات المتاجر الفلسطينية في مكان واحد"
              : "Compare thousands of products from hundreds of Palestinian stores in one place"}
          </p>
          {[
            { icon: "🔔", text: lang === "ar" ? "تنبيهات انخفاض الأسعار" : "Price drop alerts"      },
            { icon: "❤️", text: lang === "ar" ? "احفظ منتجاتك المفضلة"  : "Save your favorites"    },
            { icon: "⚖️", text: lang === "ar" ? "قارن حتى 4 منتجات"     : "Compare up to 4 items"  },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "12px 16px", marginBottom: "10px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ fontSize: "20px" }}>{f.icon}</span>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: "500" }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* القسم الأيمن — الفورم */}
      <div className="login-right-panel" style={{ flex: "0 0 min(480px,100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px", background: "white" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>

          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", marginBottom: "32px", justifyContent: "center" }}>
            <span style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", borderRadius: "10px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "18px", fontWeight: "900" }}>₪</span>
            <span style={{ fontSize: "24px", fontWeight: "900", color: "#16a34a", fontFamily: "Cairo,sans-serif" }}>PalPrice</span>
          </Link>

          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 6px", fontFamily: "Cairo,sans-serif" }}>
            {lang === "ar" ? "مرحباً بك مجدداً 👋" : "Welcome Back 👋"}
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "28px" }}>
            {lang === "ar" ? "سجّل دخولك للوصول لحسابك" : "Login to access your account"}
          </p>

          {/* Error */}
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              ⚠️ {error}
            </div>
          )}

          {/* إيميل أو هاتف */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "7px" }}>
              {lang === "ar" ? "البريد الإلكتروني أو رقم الهاتف" : "Email or Phone Number"}
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: "#94a3b8", pointerEvents: "none" }}>
                {isPhone ? "📱" : "✉️"}
              </span>
              <input
                type="text"
                placeholder={lang === "ar" ? "you@example.com أو 059xxxxxxx" : "you@example.com or 059xxxxxxx"}
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ ...inp, paddingRight: "42px" }}
                onFocus={e => { e.target.style.borderColor = "#22c55e"; e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          {/* كلمة المرور */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>
                {lang === "ar" ? "كلمة المرور" : "Password"}
              </label>
              <button onClick={() => setForgotMode(true)} style={{ background: "none", border: "none", color: "#22c55e", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Tajawal,sans-serif", padding: 0 }}>
                {lang === "ar" ? "نسيت كلمة المرور؟" : "Forgot password?"}
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ ...inp, paddingLeft: "44px" }}
                onFocus={e => { e.target.style.borderColor = "#22c55e"; e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
              />
              <button onClick={() => setShowPass(p => !p)} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#94a3b8", padding: 0 }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* زر الدخول */}
          <button onClick={handleLogin} disabled={loading}
            style={{ width: "100%", padding: "14px", background: loading ? "#86efac" : "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Tajawal,sans-serif", boxShadow: "0 4px 16px rgba(34,197,94,0.3)", transition: "all 0.2s", marginBottom: "20px" }}>
            {loading ? (lang === "ar" ? "جاري الدخول..." : "Logging in...") : (lang === "ar" ? "تسجيل الدخول" : "Login")}
          </button>

          {/* رابط التسجيل */}
          <p style={{ textAlign: "center", fontSize: "14px", color: "#64748b" }}>
            {lang === "ar" ? "ليس لديك حساب؟" : "No account yet?"}
            {" "}
            <Link to="/register" style={{ color: "#22c55e", fontWeight: "700", textDecoration: "none" }}>
              {lang === "ar" ? "سجّل مجاناً" : "Register Free"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;