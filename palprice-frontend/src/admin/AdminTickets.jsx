const TICKETS_API = "/api/tickets";

export default function AdminTickets({ tickets, loading, activeTicket, ticketMessages, ticketReply, sendingReply, setTickets, setActiveTicket, setTicketMessages, setTicketReply, handleTicketReply, load, h }) {
  /* ── قائمة التذاكر ── */
  if (!activeTicket) return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>🎫 تذاكر الدعم</h1>
          <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0" }}>تواصل التجار مع الإدارة</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {[{ key: "", label: "الكل" }, { key: "open", label: "مفتوحة", color: "#3b82f6" }, { key: "in_progress", label: "قيد المتابعة", color: "#f59e0b" }, { key: "closed", label: "مغلقة", color: "#64748b" }].map(f => (
            <button key={f.key} onClick={async () => {
              const url = f.key ? `${TICKETS_API}/admin?status=${f.key}` : `${TICKETS_API}/admin`;
              const d = await fetch(url, { headers: h() }).then(r => r.json());
              if (Array.isArray(d)) setTickets(d);
            }}
              style={{ padding: "7px 14px", borderRadius: "8px", border: "1.5px solid #e2e8f0", background: "white", color: f.color || "#64748b", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {tickets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px", background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", color: "#94a3b8" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎫</div>
          <p>لا توجد تذاكر</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {tickets.map(ticket => {
            const cfg = {
              open:        { label: "مفتوحة",        color: "#3b82f6", bg: "#eff6ff" },
              in_progress: { label: "قيد المتابعة", color: "#f59e0b", bg: "#fffbeb" },
              closed:      { label: "مغلقة",         color: "#64748b", bg: "#f8fafc" },
            }[ticket.status] || { label: "مفتوحة", color: "#3b82f6", bg: "#eff6ff" };
            return (
              <div key={ticket.id} onClick={async () => {
                const data = await fetch(`${TICKETS_API}/${ticket.id}/admin`, { headers: h() }).then(r => r.json());
                setActiveTicket(data.ticket); setTicketMessages(data.messages || []);
              }}
                style={{ background: "white", borderRadius: "14px", border: `1.5px solid ${Number(ticket.unread_count) > 0 ? "#3b82f6" : "#e2e8f0"}`, padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "14px", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>🎫</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <p style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ticket.subject}</p>
                    {Number(ticket.unread_count) > 0 && (
                      <span style={{ background: "#3b82f6", color: "white", borderRadius: "99px", fontSize: "10px", fontWeight: "700", padding: "1px 6px", flexShrink: 0 }}>{ticket.unread_count} جديد</span>
                    )}
                  </div>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>🏪 {ticket.store_name}</span>
                </div>
                <span style={{ padding: "4px 12px", borderRadius: "99px", fontSize: "11px", fontWeight: "700", background: cfg.bg, color: cfg.color, flexShrink: 0 }}>{cfg.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  /* ── تفاصيل التذكرة ── */
  return (
    <div>
      <button onClick={() => { setActiveTicket(null); setTicketMessages([]); load(); }}
        style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "13px", fontFamily: "Tajawal, sans-serif", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
        ← رجوع للتذاكر
      </button>

      {/* رأس التذكرة */}
      <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "16px 20px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px" }}>🎫 {activeTicket.subject}</h2>
            <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>🏪 {activeTicket.store_name}</p>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>الحالة:</span>
            {["open", "in_progress", "closed"].map(s => {
              const colors = { open: "#3b82f6", in_progress: "#f59e0b", closed: "#64748b" };
              const labels = { open: "مفتوحة", in_progress: "قيد المتابعة", closed: "مغلقة" };
              return (
                <button key={s} onClick={async () => {
                  await fetch(`${TICKETS_API}/${activeTicket.id}/status`, { method: "PUT", headers: h(), body: JSON.stringify({ status: s }) });
                  setActiveTicket(prev => ({ ...prev, status: s }));
                }}
                  style={{ padding: "5px 12px", borderRadius: "8px", border: `1.5px solid ${activeTicket.status === s ? colors[s] : "#e2e8f0"}`, background: activeTicket.status === s ? `${colors[s]}15` : "white", color: activeTicket.status === s ? colors[s] : "#64748b", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                  {labels[s]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* الرسائل */}
      <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: "14px" }}>
        <div style={{ maxHeight: "400px", overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {ticketMessages.map((msg, i) => {
            const isAdm = msg.sender_type === "admin";
            return (
              <div key={i} style={{ display: "flex", justifyContent: isAdm ? "flex-end" : "flex-start", gap: "10px" }}>
                {!isAdm && <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>🏪</div>}
                <div style={{ maxWidth: "70%" }}>
                  <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 4px" }}>{msg.sender_name} • {new Date(msg.created_at).toLocaleString("ar-PS")}</p>
                  <div style={{ padding: "11px 15px", borderRadius: "14px", borderBottomRightRadius: isAdm ? "4px" : "14px", borderBottomLeftRadius: isAdm ? "14px" : "4px", background: isAdm ? "#0f172a" : "#f8fafc", border: isAdm ? "none" : "1px solid #e2e8f0" }}>
                    <p style={{ margin: 0, fontSize: "13px", color: isAdm ? "white" : "#0f172a", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{msg.message}</p>
                  </div>
                </div>
                {isAdm && <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>👮</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* مربع الرد */}
      {activeTicket.status !== "closed" && (
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "14px", display: "flex", gap: "10px" }}>
          <textarea value={ticketReply} onChange={e => setTicketReply(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleTicketReply(); } }}
            placeholder="اكتب ردك..." rows={2}
            style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "14px", fontFamily: "Tajawal, sans-serif", outline: "none", resize: "none" }}
            onFocus={e => e.target.style.borderColor = "#22c55e"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
          <button onClick={handleTicketReply} disabled={sendingReply || !ticketReply.trim()}
            style={{ padding: "10px 20px", background: ticketReply.trim() ? "#0f172a" : "#f1f5f9", color: ticketReply.trim() ? "white" : "#94a3b8", border: "none", borderRadius: "10px", cursor: ticketReply.trim() ? "pointer" : "not-allowed", fontSize: "14px", fontWeight: "700", fontFamily: "Tajawal, sans-serif", alignSelf: "flex-end" }}>
            {sendingReply ? "⏳" : "إرسال"}
          </button>
        </div>
      )}
    </div>
  );
}
