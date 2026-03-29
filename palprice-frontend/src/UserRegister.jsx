import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CITIES = [
  "رام الله","نابلس","الخليل","جنين","طولكرم","قلقيلية",
  "بيت لحم","أريحا","سلفيت","طوباس","القدس","أبو ديس",
  "البيرة","بيرزيت","الزاوية","يطا","دورا","بيت جالا",
  "بيت ساحور","بديا","عنبتا","باقة الشرقية","صوريف",
  "حلحول","السموع","بني نعيم","بيت أمر","إذنا",
];

const INTERESTS = [
  { key: "phones",      icon: "📱", label: "هواتف وأجهزة"  },
  { key: "accessories", icon: "🎧", label: "إكسسوارات"      },
  { key: "beauty",      icon: "💄", label: "جمال وعناية"    },
  { key: "home",        icon: "🏠", label: "منزل وأجهزة"   },
  { key: "fashion",     icon: "👗", label: "أزياء وملابس"  },
  { key: "sports",      icon: "⚽", label: "رياضة"           },
  { key: "food",        icon: "🍕", label: "طعام ومطاعم"    },
  { key: "kids",        icon: "🧸", label: "أطفال وألعاب"  },
  { key: "tech",        icon: "💻", label: "تقنية وألعاب"   },
  { key: "cars",        icon: "🚗", label: "سيارات"          },
];

function pwCheck(pw) {
  return { len: pw.length >= 8, upper: /[A-Z]/.test(pw), number: /[0-9]/.test(pw) };
}

function StrengthBar({ pw }) {
  const c = pwCheck(pw);
  const score = Object.values(c).filter(Boolean).length;
  const colors = ["#ef4444","#f59e0b","#22c55e"];
  const labels = ["ضعيفة","متوسطة","قوية"];
  if (!pw) return null;
  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "5px" }}>
        {[0,1,2].map(i => <div key={i} style={{ flex: 1, height: "3px", borderRadius: "2px", background: i < score ? colors[score-1] : "#e2e8f0", transition: "background .3s" }} />)}
      </div>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {[{ok:c.len,t:"8 أحرف"},{ok:c.upper,t:"حرف كبير"},{ok:c.number,t:"رقم"}].map((r,i) => (
          <span key={i} style={{ fontSize: "11px", color: r.ok ? "#16a34a" : "#94a3b8", display: "flex", alignItems: "center", gap: "3px" }}>
            {r.ok ? "✓" : "○"} {r.t}
          </span>
        ))}
      </div>
    </div>
  );
}

function UserRegister({ lang = "ar", onLogin }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", phone:"", password:"", password2:"", city:"", interests:[] });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [userName, setUserName] = useState("");

  const set = (k,v) => setForm(p => ({...p,[k]:v}));
  const toggleInt = k => set("interests", form.interests.includes(k) ? form.interests.filter(x=>x!==k) : [...form.interests,k]);

  /* تحقق كل خطوة */
  function validate1() {
    if (!form.firstName.trim()) return lang==="ar" ? "أدخل الاسم الأول" : "Enter first name";
    if (!form.email.trim() || !form.email.includes("@")) return lang==="ar" ? "أدخل بريداً صحيحاً" : "Enter valid email";
    if (!/^[0-9]{10}$/.test(form.phone.trim())) return lang==="ar" ? "رقم الهاتف يجب أن يكون 10 أرقام (مثال: 0599075533)" : "Phone must be exactly 10 digits";
    return null;
  }
  function validate2() {
    const c = pwCheck(form.password);
    if (!c.len)    return lang==="ar" ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل" : "Password must be 8+ chars";
    if (!c.upper)  return lang==="ar" ? "أضف حرفاً كبيراً"                         : "Add at least one uppercase";
    if (!c.number) return lang==="ar" ? "أضف رقماً واحداً على الأقل"              : "Add at least one number";
    if (form.password !== form.password2) return lang==="ar" ? "كلمتا المرور غير متطابقتين" : "Passwords don't match";
    return null;
  }

  async function next() {
    setError("");
    const e = step===1 ? validate1() : step===2 ? validate2() : null;
    if (e) { setError(e); return; }
    
    if (step === 1) {
      setLoading(true);
      // جديد (صح)
const res = await fetch("/api/users/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, phone: form.phone }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.error) { setError(data.error); return; }
    }
    
    setStep(s=>s+1);
  }

  async function handleRegister() {
    setLoading(true);
    try {
      const name = [form.firstName, form.lastName].filter(Boolean).join(" ");
      const res  = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: form.email, phone: form.phone, password: form.password, city: form.city, interests: form.interests }),
      });
      const data = await res.json();

      if (!res.ok) {
        // تحقق من تكرار الإيميل أو الهاتف
        if (data.error === "Email already registered" || data.error?.includes("email"))
          setError(lang==="ar" ? `البريد "${form.email}" مسجل مسبقاً — هل تريد استرجاع كلمة المرور؟` : `Email "${form.email}" is already registered — want to reset password?`);
        else if (data.error?.includes("phone") || data.error?.includes("هاتف"))
          setError(lang==="ar" ? `رقم الهاتف "${form.phone}" مسجل مسبقاً — جرّب تسجيل الدخول` : `Phone "${form.phone}" is already registered — try logging in`);
        else
          setError(lang==="ar" ? "حدث خطأ، حاول مجدداً" : "Something went wrong");
        setLoading(false); return;
      }

      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userId",    data.user.id);
      localStorage.setItem("userName",  data.user.name);
      if (data.user.avatar) localStorage.setItem("userAvatar", data.user.avatar);
      if (onLogin) onLogin({ ...data.user, token: data.token });
      setUserName(form.firstName);
      setStep(4);
    } catch {
      setError(lang==="ar" ? "حدث خطأ، حاول مجدداً" : "Something went wrong");
    }
    setLoading(false);
  }

  /* ══ شاشة الترحيب ══ */
  if (step===4) return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0f172a,#0d3320)", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px" }}>
      <style>{`
        @keyframes popIn2{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes float2{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      `}</style>
      <div style={{ textAlign:"center", animation:"popIn2 .5s cubic-bezier(.34,1.56,.64,1)", maxWidth:"500px", width:"100%" }}>
        <div style={{ fontSize:"76px", marginBottom:"18px", animation:"float2 2s ease-in-out infinite" }}>🎉</div>
        <h1 style={{ color:"#4ade80", fontFamily:"Cairo,sans-serif", fontSize:"clamp(22px,4vw,34px)", fontWeight:"900", margin:"0 0 10px" }}>
          {lang==="ar" ? `أهلاً وسهلاً، ${userName}!` : `Welcome, ${userName}!`}
        </h1>
        <p style={{ color:"#94a3b8", fontSize:"15px", lineHeight:1.8, marginBottom:"28px" }}>
          {lang==="ar" ? "حسابك جاهز! قارن الأسعار، احفظ مفضلاتك، واحصل على تنبيهات الأسعار 🛍️" : "Your account is ready! Compare prices, save favorites, and get price alerts 🛍️"}
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"28px" }}>
          {[{icon:"🔔",t:lang==="ar"?"تنبيهات الأسعار":"Price Alerts"},{icon:"❤️",t:lang==="ar"?"المفضلة":"Favorites"},{icon:"⚖️",t:lang==="ar"?"قارن 4 منتجات":"Compare 4 Items"},{icon:"🏪",t:lang==="ar"?"متاجر موثوقة":"Trusted Stores"}].map((f,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.07)", borderRadius:"12px", padding:"12px", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", gap:"10px" }}>
              <span style={{ fontSize:"20px" }}>{f.icon}</span>
              <span style={{ color:"rgba(255,255,255,0.8)", fontSize:"13px", fontWeight:"600" }}>{f.t}</span>
            </div>
          ))}
        </div>
        <button onClick={() => navigate("/")}
          style={{ padding:"14px 40px", background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"white", border:"none", borderRadius:"14px", fontSize:"16px", fontWeight:"800", cursor:"pointer", fontFamily:"Tajawal,sans-serif", boxShadow:"0 6px 24px rgba(34,197,94,0.4)" }}>
          {lang==="ar" ? "ابدأ التصفح ←" : "Start Browsing →"}
        </button>
      </div>
    </div>
  );

  /* ══ الـ Steps 1-3 ══ */
  const inp = { width:"100%", padding:"12px 16px", borderRadius:"10px", border:"1.5px solid #e2e8f0", fontSize:"14px", fontFamily:"Tajawal,sans-serif", outline:"none", background:"#f8fafc", boxSizing:"border-box", transition:"all .2s" };
  const focus = e => { e.target.style.borderColor="#22c55e"; e.target.style.boxShadow="0 0 0 3px rgba(34,197,94,.1)"; };
  const blur  = e => { e.target.style.borderColor="#e2e8f0"; e.target.style.boxShadow="none"; };
  const lbl   = { display:"block", fontSize:"13px", fontWeight:"600", color:"#475569", marginBottom:"6px" };

  const STEPS = [
    {n:1,icon:"👤",title:lang==="ar"?"معلوماتك":"Your Info"},
    {n:2,icon:"🔑",title:lang==="ar"?"كلمة المرور":"Password"},
    {n:3,icon:"❤️",title:lang==="ar"?"اهتماماتك":"Interests"},
  ];

  return (
    <div style={{ minHeight:"100vh", display:"flex" }}>

      {/* Panel يسار — ديكور */}
      <div style={{ flex:1, background:"linear-gradient(160deg,#0f172a 0%,#0d3320 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px", position:"relative" }} className="login-left-panel">
        <style>{`@media(max-width:768px){.login-left-panel{display:none!important;}}`}</style>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 20% 80%, rgba(34,197,94,.15) 0%, transparent 50%)" }} />
        <div style={{ position:"relative", zIndex:1, textAlign:"center", maxWidth:"340px" }}>
          <div style={{ fontSize:"60px", marginBottom:"16px" }}>🚀</div>
          <h2 style={{ color:"white", fontFamily:"Cairo,sans-serif", fontSize:"26px", fontWeight:"900", marginBottom:"12px" }}>
            {lang==="ar" ? "انضم لمجتمع PalPrice" : "Join PalPrice Community"}
          </h2>
          <p style={{ color:"#94a3b8", fontSize:"14px", lineHeight:1.8 }}>
            {lang==="ar" ? "آلاف الفلسطينيين يوفرون أموالهم يومياً مع PalPrice" : "Thousands of Palestinians save money daily with PalPrice"}
          </p>
        </div>
      </div>

      {/* Panel يمين — الفورم */}
      <div style={{ flex:"0 0 min(500px,100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 28px", background:"white", overflowY:"auto" }}>
        <div style={{ width:"100%", maxWidth:"420px" }}>

          {/* Logo */}
          <Link to="/" style={{ display:"flex", alignItems:"center", gap:"8px", textDecoration:"none", marginBottom:"24px", justifyContent:"center" }}>
            <span style={{ background:"linear-gradient(135deg,#16a34a,#22c55e)", borderRadius:"10px", width:"34px", height:"34px", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:"17px", fontWeight:"900" }}>₪</span>
            <span style={{ fontSize:"22px", fontWeight:"900", color:"#16a34a", fontFamily:"Cairo,sans-serif" }}>PalPrice</span>
          </Link>

          <h1 style={{ fontSize:"22px", fontWeight:"800", color:"#0f172a", margin:"0 0 4px", fontFamily:"Cairo,sans-serif" }}>
            {lang==="ar" ? "إنشاء حساب جديد" : "Create Account"}
          </h1>
          <p style={{ color:"#64748b", fontSize:"13px", marginBottom:"22px" }}>
            {lang==="ar" ? "مجاني تماماً · بدون إعلانات" : "100% free · No ads"}
          </p>

          {/* Progress */}
          <div style={{ display:"flex", gap:"6px", marginBottom:"24px" }}>
            {STEPS.map(s => (
              <div key={s.n} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"5px" }}>
                <div style={{ width:"32px", height:"32px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", background:step>=s.n?"linear-gradient(135deg,#22c55e,#16a34a)":"#f1f5f9", color:step>=s.n?"white":"#94a3b8", fontWeight:"700", transition:"all .3s", boxShadow:step===s.n?"0 4px 12px rgba(34,197,94,.35)":"none" }}>
                  {step>s.n ? "✓" : s.icon}
                </div>
                <div style={{ height:"3px", width:"100%", background:step>s.n?"#22c55e":"#f1f5f9", borderRadius:"2px", transition:"background .3s" }} />
                <span style={{ fontSize:"10px", color:step>=s.n?"#16a34a":"#94a3b8", fontWeight:step===s.n?"700":"500" }}>{s.title}</span>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{ background:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626", padding:"12px 14px", borderRadius:"10px", fontSize:"13px", marginBottom:"16px" }}>
              ⚠️ {error}
              {error.includes("مسجل مسبقاً") || error.includes("already registered") ? (
                <span> <Link to="/login" style={{ color:"#dc2626", fontWeight:"700" }}>{lang==="ar"?"سجّل دخولك":"Login"}</Link> {lang==="ar"?"أو":""} <button onClick={()=>setForgotMode?.(true)} style={{ background:"none", border:"none", color:"#dc2626", fontWeight:"700", cursor:"pointer", fontFamily:"Tajawal,sans-serif", padding:0, fontSize:"13px" }}>{lang==="ar"?"استرجع كلمة المرور":"Reset Password"}</button></span>
              ) : null}
            </div>
          )}

          {/* Step 1 */}
          {step===1 && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"14px" }}>
                <div>
                  <label style={lbl}>{lang==="ar"?"الاسم الأول *":"First Name *"}</label>
                  <input placeholder={lang==="ar"?"محمد":"John"} value={form.firstName} onChange={e=>set("firstName",e.target.value)} style={inp} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={lbl}>{lang==="ar"?"الاسم الأخير":"Last Name"}</label>
                  <input placeholder={lang==="ar"?"أحمد":"Doe"} value={form.lastName} onChange={e=>set("lastName",e.target.value)} style={inp} onFocus={focus} onBlur={blur} />
                </div>
              </div>
              <div style={{ marginBottom:"14px" }}>
                <label style={lbl}>{lang==="ar"?"البريد الإلكتروني *":"Email *"}</label>
                <input type="email" placeholder="you@example.com" value={form.email} onChange={e=>set("email",e.target.value)} style={inp} onFocus={focus} onBlur={blur} />
              </div>
              <div style={{ marginBottom:"14px" }}>
                {/* ← هاتف إجباري */}
                <label style={lbl}>
                  {lang==="ar"?"رقم الهاتف *":"Phone Number *"}
                  <span style={{ color:"#64748b", fontWeight:"400", fontSize:"11px", marginRight:"6px" }}>
                    {lang==="ar"?"(للدخول بالهاتف)":"(used for phone login)"}
                  </span>
                </label>
                <input type="tel" placeholder="059xxxxxxx" maxLength={10} value={form.phone} onChange={e=>set("phone",e.target.value.replace(/\D/g,''))} style={inp} onFocus={focus} onBlur={blur} />
              </div>
              <div style={{ marginBottom:"20px" }}>
                <label style={lbl}>{lang==="ar"?"المدينة":"City"}</label>
                <select value={form.city} onChange={e=>set("city",e.target.value)} style={{...inp,background:"white",cursor:"pointer"}} onFocus={focus} onBlur={blur}>
                  <option value="">{lang==="ar"?"اختر مدينتك...":"Select city..."}</option>
                  {CITIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step===2 && (
            <div>
              <div style={{ marginBottom:"16px" }}>
                <label style={lbl}>{lang==="ar"?"كلمة المرور *":"Password *"}</label>
                <input type="password" placeholder="••••••••" value={form.password} onChange={e=>set("password",e.target.value)} style={inp} onFocus={focus} onBlur={blur} />
                <StrengthBar pw={form.password} />
              </div>
              <div style={{ marginBottom:"20px" }}>
                <label style={lbl}>{lang==="ar"?"تأكيد كلمة المرور *":"Confirm Password *"}</label>
                <input type="password" placeholder="••••••••" value={form.password2} onChange={e=>set("password2",e.target.value)} style={inp} onFocus={focus} onBlur={blur} />
                {form.password2 && (
                  <p style={{ fontSize:"12px", marginTop:"6px", color:form.password===form.password2?"#16a34a":"#ef4444", fontWeight:"600" }}>
                    {form.password===form.password2 ? "✓ "+(lang==="ar"?"متطابقتان":"Match") : "✗ "+(lang==="ar"?"غير متطابقتين":"Don't match")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step===3 && (
            <div>
              <p style={{ color:"#64748b", fontSize:"13px", marginBottom:"14px" }}>
                {lang==="ar"?"اختر اهتماماتك لنعرض لك أفضل العروض (اختياري)":"Choose interests to see relevant deals (optional)"}
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"18px" }}>
                {INTERESTS.map(int=>{
                  const sel=form.interests.includes(int.key);
                  return (
                    <button key={int.key} onClick={()=>toggleInt(int.key)}
                      style={{ display:"flex", alignItems:"center", gap:"8px", padding:"10px 12px", borderRadius:"10px", border:`1.5px solid ${sel?"#22c55e":"#e2e8f0"}`, background:sel?"#f0fdf4":"white", cursor:"pointer", fontFamily:"Tajawal,sans-serif", fontSize:"13px", fontWeight:sel?"700":"500", color:sel?"#16a34a":"#475569", transition:"all .15s" }}>
                      <span style={{ fontSize:"18px" }}>{int.icon}</span>
                      {int.label}
                      {sel && <span style={{ marginRight:"auto", color:"#22c55e", fontSize:"11px" }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display:"flex", gap:"10px" }}>
            {step>1 && (
              <button onClick={()=>{setError("");setStep(s=>s-1);}}
                style={{ flex:"0 0 auto", padding:"12px 18px", background:"#f1f5f9", color:"#475569", border:"none", borderRadius:"12px", fontSize:"14px", fontWeight:"600", cursor:"pointer", fontFamily:"Tajawal,sans-serif" }}>
                ← {lang==="ar"?"رجوع":"Back"}
              </button>
            )}
            <button onClick={step<3?next:handleRegister} disabled={loading}
              style={{ flex:1, padding:"13px", background:loading?"#86efac":"linear-gradient(135deg,#22c55e,#16a34a)", color:"white", border:"none", borderRadius:"12px", fontSize:"15px", fontWeight:"700", cursor:loading?"not-allowed":"pointer", fontFamily:"Tajawal,sans-serif", boxShadow:"0 4px 16px rgba(34,197,94,.3)", transition:"all .2s" }}>
              {loading?"..." : step<3?(lang==="ar"?"التالي ←":"Next →"):(lang==="ar"?"إنشاء الحساب 🎉":"Create Account 🎉")}
            </button>
          </div>
          

          <p style={{ textAlign:"center", marginTop:"16px", fontSize:"14px", color:"#64748b" }}>
            {lang==="ar"?"لديك حساب؟":"Have account?"}
            {" "}
            <Link to="/login" style={{ color:"#22c55e", fontWeight:"700", textDecoration:"none" }}>{lang==="ar"?"سجّل دخولك":"Login"}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserRegister;