import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function UserLogin({ lang = "ar", onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    if (!email || !password) {
      setError(lang === "ar" ? "يرجى إدخال الإيميل وكلمة المرور" : "Please fill all fields");
      return;
    }
    setError(""); setLoading(true);

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "banned") {
          setError(data.message || "حسابك محظور. تواصل مع الإدارة.");
        } else if (data.error === "User not found") {
          setError(lang === "ar" ? "البريد الإلكتروني غير مسجل" : "Email not found");
        } else {
          setError(lang === "ar" ? "كلمة المرور غلط" : "Wrong password");
        }
        setLoading(false); return;
      }

      // احفظ في localStorage
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userName", data.user.name);
      if (data.user.avatar) localStorage.setItem("userAvatar", data.user.avatar);

      // حدّث الـ state في App — مهم يكون فيه token
      if (onLogin) onLogin({ ...data.user, token: data.token });

      // انتقل للرئيسية
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

  return (
    <div style={{
      minHeight: "100vh", background: "#f8fafc",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
    }}>
      <div style={{
        background: "white", borderRadius: "16px", border: "1px solid #e2e8f0",
        padding: "40px", width: "100%", maxWidth: "400px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link to="/" style={{ fontSize: "22px", fontWeight: "800", color: "#22c55e", textDecoration: "none" }}>
            PalPrice
          </Link>
          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "15px" }}>
            {lang === "ar" ? "تسجيل دخول" : "Login"}
          </p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "8px", fontSize: "14px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
            {lang === "ar" ? "البريد الإلكتروني" : "Email"}
          </label>
          <input type="email" placeholder="you@example.com" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#22c55e"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
            {lang === "ar" ? "كلمة المرور" : "Password"}
          </label>
          <input type="password" placeholder="••••••••" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#22c55e"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"}
          />
        </div>

        <button onClick={handleLogin} disabled={loading} style={{
          width: "100%", padding: "12px", background: loading ? "#86efac" : "#22c55e",
          color: "white", border: "none", borderRadius: "8px", fontSize: "15px",
          fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "Tajawal, sans-serif"
        }}>
          {loading ? (lang === "ar" ? "جاري الدخول..." : "Logging in...") : (lang === "ar" ? "تسجيل الدخول" : "Login")}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#64748b" }}>
          {lang === "ar" ? "ليس لديك حساب؟" : "No account?"}{" "}
          <Link to="/register" style={{ color: "#22c55e", fontWeight: "600", textDecoration: "none" }}>
            {lang === "ar" ? "سجل الآن" : "Register"}
          </Link>
        </p>

        <div style={{ textAlign: "center", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
          <Link to="/store/login" style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "none" }}>
            🏪 {lang === "ar" ? "أنت صاحب متجر؟ دخول المتاجر" : "Store owner? Store Login"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;