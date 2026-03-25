import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function UserRegister({ lang = "ar", onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleRegister() {
    if (!name || !email || !password) {
      setError(lang === "ar" ? "يرجى ملء جميع الحقول" : "Please fill all fields");
      return;
    }
    if (password.length < 6) {
      setError(lang === "ar" ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
      return;
    }
    setError(""); setLoading(true);

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error === "Email already registered"
          ? (lang === "ar" ? "هذا البريد الإلكتروني مسجل مسبقاً" : "Email already registered")
          : (lang === "ar" ? "حدث خطأ" : "Something went wrong"));
        setLoading(false); return;
      }

      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userName", data.user.name);

      if (onLogin) onLogin({ ...data.user, token: data.token });
      navigate("/");

    } catch {
      setError(lang === "ar" ? "حدث خطأ، حاول مجدداً" : "Something went wrong");
    }
    setLoading(false);
  }

  const inputStyle = {
    width: "100%", padding: "11px 16px", borderRadius: "8px",
    border: "1.5px solid #e2e8f0", fontSize: "14px",
    fontFamily: "Tajawal, sans-serif", outline: "none",
    background: "#f8fafc", boxSizing: "border-box", transition: "border-color 0.2s"
  };

  const labelStyle = { display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" };

  return (
    <div style={{
      minHeight: "100vh", background: "#f8fafc",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
    }}>
      <div style={{
        background: "white", borderRadius: "16px", border: "1px solid #e2e8f0",
        padding: "40px", width: "100%", maxWidth: "420px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link to="/" style={{ fontSize: "22px", fontWeight: "800", color: "#22c55e", textDecoration: "none" }}>PalPrice</Link>
          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "15px" }}>
            {lang === "ar" ? "إنشاء حساب جديد" : "Create New Account"}
          </p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "8px", fontSize: "14px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>{lang === "ar" ? "الاسم الكامل" : "Full Name"}</label>
          <input placeholder={lang === "ar" ? "اسمك هنا" : "Your name"} value={name}
            onChange={e => setName(e.target.value)} style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#22c55e"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>{lang === "ar" ? "البريد الإلكتروني" : "Email"}</label>
          <input type="email" placeholder="you@example.com" value={email}
            onChange={e => setEmail(e.target.value)} style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#22c55e"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>{lang === "ar" ? "كلمة المرور" : "Password"}</label>
          <input type="password" placeholder="••••••••" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleRegister()}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#22c55e"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
            {lang === "ar" ? "6 أحرف على الأقل" : "At least 6 characters"}
          </p>
        </div>

        <button onClick={handleRegister} disabled={loading} style={{
          width: "100%", padding: "12px", background: loading ? "#86efac" : "#22c55e",
          color: "white", border: "none", borderRadius: "8px", fontSize: "15px",
          fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "Tajawal, sans-serif"
        }}>
          {loading ? (lang === "ar" ? "جاري التسجيل..." : "Registering...") : (lang === "ar" ? "إنشاء الحساب" : "Create Account")}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#64748b" }}>
          {lang === "ar" ? "لديك حساب؟" : "Have an account?"}{" "}
          <Link to="/login" style={{ color: "#22c55e", fontWeight: "600", textDecoration: "none" }}>
            {lang === "ar" ? "سجل دخول" : "Login"}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default UserRegister;