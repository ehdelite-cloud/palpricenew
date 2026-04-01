export default function AdminModerators({ moderators, loading }) {
  if (loading) return <p style={{ color: "#94a3b8" }}>جاري التحميل...</p>;

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>🛡️ فريق الإدارة</h1>
        <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0" }}>لتعيين مشرف جديد: اذهب لقسم المستخدمين وغيّر صلاحيته</p>
      </div>

      {moderators.length === 0 ? (
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "60px", textAlign: "center", color: "#94a3b8" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🛡️</div>
          <p>لا يوجد فريق بعد — عيّن من قسم المستخدمين</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
          {moderators.map(m => (
            <div key={m.id} style={{ background: "white", borderRadius: "16px", padding: "20px", border: "1.5px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: m.role === "admin" ? "#0f172a" : "#fffbeb", border: `2px solid ${m.role === "admin" ? "#22c55e" : "#fde68a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                  {m.role === "admin" ? "🛡️" : "👮"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "#0f172a", fontWeight: "700", margin: "0 0 3px", fontSize: "15px" }}>{m.name}</p>
                  <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.email}</p>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                <span style={{ padding: "5px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "700", background: m.role === "admin" ? "#f0fdf4" : "#fffbeb", color: m.role === "admin" ? "#15803d" : "#d97706" }}>
                  {m.role === "admin" ? "🛡️ Super Admin" : "👮 Moderator"}
                </span>
                <span style={{ color: "#cbd5e1", fontSize: "11px" }}>{new Date(m.created_at).toLocaleDateString("ar-PS")}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
