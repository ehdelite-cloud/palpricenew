export default function AdminAI({ analytics, aiReport, aiLoading, aiChat, aiInput, aiChatLoading, reportType, generateReport, sendAiMessage, setAiChat, setAiInput }) {
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>🤖 تحليل ذكي بـ Claude AI</h1>
        <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0" }}>احصل على تقارير وتحليلات ذكية لموقعك</p>
      </div>

      {/* توليد تقرير */}
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px" }}>📋 توليد تقرير</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
          {[
            { key: "full",     icon: "📊", label: "تقرير شامل",  color: "#3b82f6" },
            { key: "security", icon: "🔒", label: "تقرير أمني",  color: "#ef4444" },
            { key: "growth",   icon: "📈", label: "تقرير النمو", color: "#22c55e" },
          ].map(r => (
            <button key={r.key} onClick={() => generateReport(r.key)} disabled={aiLoading}
              style={{ padding: "10px 20px", borderRadius: "10px", border: `1.5px solid ${r.color}`, background: reportType === r.key && aiReport ? r.color : "white", color: reportType === r.key && aiReport ? "white" : r.color, cursor: aiLoading ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "Tajawal, sans-serif", display: "flex", alignItems: "center", gap: "7px" }}>
              {r.icon} {r.label}
            </button>
          ))}
        </div>

        {aiLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
            <div style={{ width: "18px", height: "18px", border: "2px solid #e2e8f0", borderTop: "2px solid #3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>Claude AI يحلل البيانات...</p>
          </div>
        )}

        {aiReport && !aiLoading && (
          <div style={{ background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", background: "#0f172a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#22c55e", fontSize: "12px", fontWeight: "600" }}>🤖 Claude AI • {aiReport.time}</span>
              <button onClick={() => {
                const blob = new Blob([aiReport.text], { type: "text/plain;charset=utf-8" });
                const url  = URL.createObjectURL(blob);
                const a    = document.createElement("a");
                a.href = url; a.download = "palprice-report.txt"; a.click();
              }} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontFamily: "Tajawal, sans-serif" }}>⬇️ تحميل</button>
            </div>
            <div style={{ padding: "20px", maxHeight: "400px", overflowY: "auto" }}>
              {aiReport.text.split("\n").map((line, i) => {
                const isBold  = line.startsWith("**");
                const isH     = line.startsWith("#");
                const cleaned = line.replace(/\*\*/g, "").replace(/^#+\s*/, "");
                if (!cleaned.trim()) return <br key={i} />;
                return <p key={i} style={{ margin: "4px 0", fontSize: isH ? "15px" : "13px", fontWeight: isBold || isH ? "700" : "400", color: isH ? "#0f172a" : "#475569", lineHeight: 1.7 }}>{cleaned}</p>;
              })}
            </div>
          </div>
        )}
      </div>

      {/* محادثة AI */}
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>🤖</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "#0f172a", fontSize: "14px", fontWeight: "600", margin: 0 }}>Claude AI Assistant</p>
            <p style={{ color: "#94a3b8", fontSize: "11px", margin: 0 }}>اسأل عن أي شيء في موقعك</p>
          </div>
          {aiChat.length > 0 && (
            <button onClick={() => setAiChat([])} style={{ padding: "4px 12px", background: "#f1f5f9", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", color: "#64748b", fontFamily: "Tajawal, sans-serif" }}>مسح</button>
          )}
        </div>

        <div style={{ height: "300px", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {aiChat.length === 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
              <span style={{ fontSize: "36px", marginBottom: "10px" }}>💬</span>
              <p style={{ fontSize: "13px", textAlign: "center", marginBottom: "14px" }}>ابدأ محادثة مع Claude AI</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                {["ما هي نقاط ضعف الموقع؟", "كيف أزيد المستخدمين؟", "هل الأرقام جيدة؟"].map((q, i) => (
                  <button key={i} onClick={() => setAiInput(q)} style={{ padding: "6px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "99px", cursor: "pointer", fontSize: "12px", color: "#475569", fontFamily: "Tajawal, sans-serif" }}>{q}</button>
                ))}
              </div>
            </div>
          )}
          {aiChat.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-start" : "flex-end", gap: "8px" }}>
              {msg.role === "assistant" && (
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0 }}>🤖</div>
              )}
              <div style={{ maxWidth: "75%", padding: "9px 13px", borderRadius: "12px", background: msg.role === "user" ? "#0f172a" : "#f8fafc", border: msg.role === "assistant" ? "1px solid #e2e8f0" : "none" }}>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.6, color: msg.role === "user" ? "white" : "#475569", whiteSpace: "pre-wrap" }}>{msg.content}</p>
              </div>
            </div>
          ))}
          {aiChatLoading && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>🤖</div>
              <div style={{ padding: "9px 13px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", gap: "4px" }}>
                {[0,1,2].map(j => <div key={j} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#94a3b8", animation: `bounce 0.8s ${j * 0.15}s infinite` }} />)}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "10px" }}>
          <input value={aiInput} onChange={e => setAiInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendAiMessage()}
            placeholder="اسأل Claude AI..." disabled={aiChatLoading}
            style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "13px", fontFamily: "Tajawal, sans-serif", outline: "none" }}
            onFocus={e => e.target.style.borderColor = "#3b82f6"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
          <button onClick={sendAiMessage} disabled={aiChatLoading || !aiInput.trim()}
            style={{ padding: "10px 18px", background: aiInput.trim() ? "#0f172a" : "#f1f5f9", color: aiInput.trim() ? "white" : "#94a3b8", border: "none", borderRadius: "10px", cursor: aiInput.trim() ? "pointer" : "not-allowed", fontSize: "13px", fontFamily: "Tajawal, sans-serif", fontWeight: "600" }}>
            {aiChatLoading ? "..." : "إرسال"}
          </button>
        </div>
      </div>
    </div>
  );
}
