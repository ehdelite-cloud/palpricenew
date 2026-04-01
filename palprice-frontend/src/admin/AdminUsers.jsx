export default function AdminUsers({ users, usersTotal, loading, roleFilter, setRoleFilter, search, setSearch, page, setPage, load, banUser, changeRole, setBanModal, isAdmin }) {
  const inp        = { padding: "9px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", outline: "none", background: "white", color: "#0f172a" };
  const totalPages = (total, lim = 15) => Math.ceil(total / lim);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
          👥 المستخدمون <span style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "400" }}>({usersTotal})</span>
        </h1>
        <div style={{ display: "flex", gap: "8px" }}>
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); setTimeout(load, 0); }} style={{ ...inp }}>
            <option value="">كل الصلاحيات</option>
            <option value="user">user</option>
            <option value="moderator">moderator</option>
            <option value="admin">admin</option>
          </select>
          <input placeholder="ابحث..." value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && load()} style={{ ...inp, width: "180px" }} />
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["#", "المستخدم", "البريد الإلكتروني", "الصلاحية", "الحالة", ""].map((col, i) => (
                <th key={i} style={{ padding: "12px 16px", textAlign: "right", color: "#94a3b8", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>جاري التحميل...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>لا يوجد مستخدمون</td></tr>
            ) : users.map(u => (
              <tr key={u.id} style={{ borderBottom: "1px solid #f8fafc" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background = "white"}>
                <td style={{ padding: "12px 16px", color: "#cbd5e1", fontSize: "12px" }}>{u.id}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>👤</div>
                    <div>
                      <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "600", margin: 0 }}>{u.name}</p>
                      {u.is_banned && <span style={{ background: "#fef2f2", color: "#ef4444", fontSize: "10px", padding: "1px 5px", borderRadius: "4px", fontWeight: "700" }}>محظور</span>}
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", color: "#94a3b8", fontSize: "12px" }}>{u.email}</td>
                <td style={{ padding: "12px 16px" }}>
                  {isAdmin ? (
                    <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}
                      style={{ ...inp, padding: "4px 8px", color: u.role === "admin" ? "#15803d" : u.role === "moderator" ? "#d97706" : "#64748b", cursor: "pointer" }}>
                      <option value="user">user</option>
                      <option value="moderator">moderator</option>
                      <option value="admin">admin</option>
                    </select>
                  ) : <span style={{ color: "#64748b", fontSize: "12px" }}>{u.role}</span>}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "700", background: u.is_banned ? "#fef2f2" : "#f0fdf4", color: u.is_banned ? "#ef4444" : "#15803d" }}>
                    {u.is_banned ? "محظور" : "نشط"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  {u.is_banned
                    ? <button onClick={() => banUser(u.id, false, null)} style={{ padding: "5px 10px", background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "700" }}>رفع الحظر</button>
                    : <button onClick={() => setBanModal(u)} style={{ padding: "5px 10px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "700" }}>حظر</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usersTotal > 15 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", color: "#64748b", fontSize: "13px" }}>←</button>
          <span style={{ color: "#64748b", fontSize: "13px" }}>{page} / {totalPages(usersTotal)}</span>
          <button onClick={() => setPage(p => Math.min(totalPages(usersTotal), p + 1))}
            style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", color: "#64748b", fontSize: "13px" }}>→</button>
        </div>
      )}
    </div>
  );
}
