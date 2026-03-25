import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardSidebar from "../../components/DashboardSidebar";

const STATUS_CONFIG = {
  open:        { label: "مفتوحة",         color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
  in_progress: { label: "قيد المتابعة",   color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  closed:      { label: "مغلقة",          color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" },
};

function TicketChat({ ticketId, lang }) {
  const token = localStorage.getItem("token");
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => { fetchTicket(); }, [ticketId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function fetchTicket() {
    setLoading(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}/store`, { headers });
      const data = await res.json();
      setTicket(data.ticket);
      setMessages(data.messages || []);
    } catch { }
    setLoading(false);
  }

  async function sendReply() {
    if (!reply.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}/reply/store`, {
        method: "POST", headers,
        body: JSON.stringify({ message: reply.trim() })
      });
      if (res.ok) { setReply(""); await fetchTicket(); }
    } catch { }
    setSending(false);
  }

  if (loading) return (
    <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
      ⏳ {lang === "ar" ? "جاري التحميل..." : "Loading..."}
    </div>
  );
  if (!ticket) return null;

  const statusCfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "16px 20px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/store/dashboard/tickets")}
            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "13px", fontFamily: "Tajawal, sans-serif", padding: "4px 8px", borderRadius: "6px" }}>
            ← {lang === "ar" ? "رجوع" : "Back"}
          </button>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>🎫 {ticket.subject}</h2>
            <div style={{ display: "flex", gap: "12px", marginTop: "4px", flexWrap: "wrap" }}>
              <span style={{ padding: "2px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "600", background: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}` }}>
                {statusCfg.label}
              </span>
              {ticket.assigned_name && (
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  👮 {lang === "ar" ? "يتابعه" : "Handled by"}: {ticket.assigned_name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", padding: "4px 2px", marginBottom: "16px" }}>
        {messages.map((msg, i) => {
          const isStore = msg.sender_type === "store";
          return (
            <div key={i} style={{ display: "flex", justifyContent: isStore ? "flex-end" : "flex-start", gap: "10px" }}>
              {!isStore && (
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>👮</div>
              )}
              <div style={{ maxWidth: "70%" }}>
                <div style={{ display: "flex", gap: "8px", marginBottom: "4px", justifyContent: isStore ? "flex-end" : "flex-start" }}>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>{msg.sender_name}</span>
                  <span style={{ fontSize: "11px", color: "#cbd5e1" }}>{new Date(msg.created_at).toLocaleString("ar-PS")}</span>
                </div>
                <div style={{
                  padding: "12px 16px", borderRadius: "14px",
                  borderBottomRightRadius: isStore ? "4px" : "14px",
                  borderBottomLeftRadius: isStore ? "14px" : "4px",
                  background: isStore ? "#0f172a" : "white",
                  border: isStore ? "none" : "1px solid #e2e8f0",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
                }}>
                  <p style={{ margin: 0, fontSize: "14px", color: isStore ? "white" : "#0f172a", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {msg.message}
                  </p>
                </div>
              </div>
              {isStore && (
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#22c55e20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>🏪</div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {ticket.status !== "closed" ? (
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "12px 14px", display: "flex", gap: "10px" }}>
          <textarea value={reply} onChange={e => setReply(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
            placeholder={lang === "ar" ? "اكتب ردك هنا... (Enter للإرسال)" : "Type your reply... (Enter to send)"}
            rows={2}
            style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "14px", fontFamily: "Tajawal, sans-serif", outline: "none", resize: "none" }}
            onFocus={e => e.target.style.borderColor = "#22c55e"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
          <button onClick={sendReply} disabled={sending || !reply.trim()}
            style={{ padding: "10px 20px", background: reply.trim() ? "#22c55e" : "#f1f5f9", color: reply.trim() ? "white" : "#94a3b8", border: "none", borderRadius: "10px", cursor: reply.trim() ? "pointer" : "not-allowed", fontSize: "14px", fontWeight: "700", fontFamily: "Tajawal, sans-serif", alignSelf: "flex-end" }}>
            {sending ? "⏳" : (lang === "ar" ? "إرسال" : "Send")}
          </button>
        </div>
      ) : (
        <div style={{ background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0", padding: "14px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
          🔒 {lang === "ar" ? "هذه التذكرة مغلقة" : "This ticket is closed"}
        </div>
      )}
    </div>
  );
}

function StoreTickets({ lang = "ar" }) {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => { fetchTickets(); }, []);

  async function fetchTickets() {
    try {
      const res = await fetch("/api/tickets/store", { headers });
      const data = await res.json();
      if (Array.isArray(data)) setTickets(data);
    } catch { }
    setLoading(false);
  }

  async function createTicket() {
    if (!subject.trim() || !message.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject.trim(), message: message.trim() })
      });
      const data = await res.json();
      if (data.ticket) {
        setShowNew(false); setSubject(""); setMessage("");
        navigate(`/store/dashboard/tickets/${data.ticket.id}`);
      }
    } catch { }
    setCreating(false);
  }

  const inp = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    border: "1.5px solid #e2e8f0", fontSize: "14px",
    fontFamily: "Tajawal, sans-serif", outline: "none", boxSizing: "border-box"
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <DashboardSidebar lang={lang} />
      <main style={{ flex: 1, padding: "32px" }}>

        {ticketId ? (
          <TicketChat ticketId={ticketId} lang={lang} />
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                  🎫 {lang === "ar" ? "تذاكر الدعم" : "Support Tickets"}
                </h1>
                <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>
                  {lang === "ar" ? "تواصل مع إدارة PalPrice" : "Contact PalPrice support"}
                </p>
              </div>
              <button onClick={() => setShowNew(true)}
                style={{ padding: "10px 20px", background: "#0f172a", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "Tajawal, sans-serif" }}>
                + {lang === "ar" ? "تذكرة جديدة" : "New Ticket"}
              </button>
            </div>

            {showNew && (
              <div style={{ background: "white", borderRadius: "14px", border: "1.5px solid #22c55e", padding: "24px", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", marginBottom: "18px" }}>
                  ✉️ {lang === "ar" ? "إنشاء تذكرة جديدة" : "New Support Ticket"}
                </h3>
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "6px" }}>
                    {lang === "ar" ? "موضوع التذكرة *" : "Subject *"}
                  </label>
                  <input value={subject} onChange={e => setSubject(e.target.value)}
                    placeholder={lang === "ar" ? "مثال: مشكلة في المنتج #123" : "e.g. Issue with product #123"}
                    style={inp}
                    onFocus={e => e.target.style.borderColor = "#22c55e"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </div>
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "6px" }}>
                    {lang === "ar" ? "تفاصيل المشكلة *" : "Details *"}
                  </label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
                    placeholder={lang === "ar" ? "اشرح مشكلتك بالتفصيل..." : "Describe your issue..."}
                    style={{ ...inp, resize: "vertical" }}
                    onFocus={e => e.target.style.borderColor = "#22c55e"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={createTicket} disabled={creating || !subject.trim() || !message.trim()}
                    style={{ padding: "10px 24px", background: "#22c55e", color: "white", border: "none", borderRadius: "9px", cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "Tajawal, sans-serif" }}>
                    {creating ? "⏳" : (lang === "ar" ? "إرسال التذكرة" : "Submit Ticket")}
                  </button>
                  <button onClick={() => { setShowNew(false); setSubject(""); setMessage(""); }}
                    style={{ padding: "10px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "9px", cursor: "pointer", fontSize: "14px", fontFamily: "Tajawal, sans-serif" }}>
                    {lang === "ar" ? "إلغاء" : "Cancel"}
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>⏳</div>
            ) : tickets.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", color: "#94a3b8" }}>
                <div style={{ fontSize: "44px", marginBottom: "12px" }}>🎫</div>
                <p style={{ fontSize: "14px" }}>
                  {lang === "ar" ? "لا توجد تذاكر — أنشئ تذكرة جديدة للتواصل مع الإدارة" : "No tickets yet"}
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {tickets.map(t => {
                  const cfg = STATUS_CONFIG[t.status] || STATUS_CONFIG.open;
                  return (
                    <div key={t.id}
                      onClick={() => navigate(`/store/dashboard/tickets/${t.id}`)}
                      style={{ background: "white", borderRadius: "12px", border: `1.5px solid ${Number(t.unread_count) > 0 ? "#3b82f6" : "#e2e8f0"}`, padding: "16px 20px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "14px" }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: cfg.bg, border: `1px solid ${cfg.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                        🎫
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <p style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.subject}</p>
                          {Number(t.unread_count) > 0 && (
                            <span style={{ background: "#3b82f6", color: "white", borderRadius: "99px", fontSize: "10px", fontWeight: "700", padding: "1px 6px", flexShrink: 0 }}>
                              {t.unread_count} {lang === "ar" ? "جديد" : "new"}
                            </span>
                          )}
                        </div>
                        <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {t.last_message || "—"}
                        </p>
                      </div>
                      <div style={{ textAlign: "left", flexShrink: 0 }}>
                        <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "600", background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, display: "block", marginBottom: "4px" }}>
                          {cfg.label}
                        </span>
                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                          {t.last_message_at ? new Date(t.last_message_at).toLocaleDateString("ar-PS") : ""}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default StoreTickets;