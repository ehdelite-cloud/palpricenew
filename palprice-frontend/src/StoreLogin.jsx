import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function StoreLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
          setError(data || "بيانات غير صحيحة");
        }
        setLoading(false);
        return;
      }

      localStorage.setItem("storeId", data.store);
      localStorage.setItem("token", data.token);
      navigate("/store/dashboard");

    } catch (err) {
      setError("حدث خطأ، حاول مجدداً");
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        padding: "40px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)"
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#22c55e", margin: 0 }}>
            PalPrice
          </h2>
          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "15px" }}>
            تسجيل دخول المتجر
          </p>
        </div>

        {error && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "20px"
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
            البريد الإلكتروني
          </label>
          <input
            type="email"
            placeholder="store@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
              boxSizing: "border-box",
              outline: "none"
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
            كلمة المرور
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
              boxSizing: "border-box",
              outline: "none"
            }}
          />
        </div>

        <button
          onClick={login}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: loading ? "#86efac" : "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "جاري التحقق..." : "تسجيل الدخول"}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#64748b" }}>
          ليس لديك حساب؟{" "}
          <Link to="/store/register" style={{ color: "#22c55e", fontWeight: "600", textDecoration: "none" }}>
            سجل متجرك
          </Link>
        </p>

      </div>
    </div>
  );
}

export default StoreLogin;