import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function StoreRegister() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function register() {
    if (!name || !city || !email || !password) {
      setError("يرجى ملء جميع الحقول");
      return;
    }
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
        setError(data || "حدث خطأ أثناء التسجيل");
        setLoading(false);
        return;
      }

      navigate("/store/login");

    } catch (err) {
      setError("حدث خطأ، حاول مجدداً");
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none"
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    marginBottom: "6px"
  };

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
        maxWidth: "420px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)"
      }}>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#22c55e", margin: 0 }}>
            PalPrice
          </h2>
          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "15px" }}>
            تسجيل متجر جديد
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
          <label style={labelStyle}>اسم المتجر</label>
          <input
            placeholder="مثال: متجر الإلكترونيات"
            value={name}
            onChange={e => setName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>المدينة</label>
          <input
            placeholder="مثال: رام الله"
            value={city}
            onChange={e => setCity(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>البريد الإلكتروني</label>
          <input
            type="email"
            placeholder="store@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>كلمة المرور</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button
          onClick={register}
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
          {loading ? "جاري التسجيل..." : "تسجيل المتجر"}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#64748b" }}>
          لديك حساب؟{" "}
          <Link to="/store/login" style={{ color: "#22c55e", fontWeight: "600", textDecoration: "none" }}>
            سجل دخول
          </Link>
        </p>

      </div>
    </div>
  );
}

export default StoreRegister;