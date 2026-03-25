import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function NotificationsPage({ lang = "ar" }) {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [displayCount, setDisplayCount] = useState(15);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("userToken");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" }), [token]);

  const loadNotifications = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/users/notifications", { headers });
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnread(data.filter(n => !n.is_read).length);
      }
    } catch (err) {
      console.warn("NotificationsPage load error", err);
    } finally {
      setLoading(false);
    }
  }, [token, headers]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markRead = async (id) => {
    try {
      await fetch(`/api/users/notifications/${id}/read`, { method: "PUT", headers });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnread(prev => Math.max(0, prev - (notifications.find(n => n.id === id)?.is_read ? 0 : 1)));
    } catch (err) {
      console.warn("markRead error", err);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch(`/api/users/notifications/read-all`, { method: "PUT", headers });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnread(0);
    } catch (err) {
      console.warn("markAllRead error", err);
    }
  };

  const filtered = notifications
    .filter(n => filter === "all" ? true : filter === "unread" ? !n.is_read : n.is_read)
    .filter(n => {
      if (!searchText) return true;
      const query = searchText.toLowerCase();
      return (n.title || "").toLowerCase().includes(query) || (n.message || "").toLowerCase().includes(query);
    });

  const shown = filtered.slice(0, displayCount);
  const canLoadMore = displayCount < filtered.length;
  const loadMore = () => setDisplayCount(prev => Math.min(prev + 15, filtered.length));

  return (
    <div style={{ maxWidth: "1000px", margin: "auto", padding: "18px 16px 100px" }}>
      <h1 style={{ color: "#0f172a", fontSize: "22px", marginBottom: "14px" }}>
        🔔 {lang === "ar" ? "الإشعارات" : "Notifications"}
      </h1>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
        <span style={{ fontSize: "14px", color: "#64748b" }}>
          {lang === "ar" ? "غير مقروءة" : "Unread"}: {unread}
        </span>
        <button
          onClick={markAllRead}
          style={{ fontSize: "13px", color: "#0f172a", background: "#e2e8f0", border: "none", borderRadius: "8px", padding: "8px 10px", cursor: "pointer" }}
        >
          {lang === "ar" ? "وضع الكل كمقروء" : "Mark all read"}
        </button>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
        <input
          value={searchText}
          onChange={e => {
            setSearchText(e.target.value);
            setDisplayCount(15);
          }}
          placeholder={lang === "ar" ? "ابحث في الإشعارات..." : "Search notifications..."}
          style={{ padding: "8px 10px", border: "1px solid #dbeafe", borderRadius: "8px", flex: "1", minWidth: "220px" }}
        />
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
        {['all', 'unread', 'read'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              border: "1px solid #dbeafe",
              background: filter === f ? "#bfdbfe" : "white",
              color: filter === f ? "#1d4ed8" : "#475569",
              borderRadius: "8px", padding: "8px 12px", cursor: "pointer"
            }}
          >
            {f === 'all'
              ? (lang === 'ar' ? 'الكل' : 'All')
              : f === 'unread'
              ? (lang === 'ar' ? 'غير مقروء' : 'Unread')
              : (lang === 'ar' ? 'مقروء' : 'Read')}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "#64748b" }}>{lang === "ar" ? "جارٍ التحميل..." : "Loading..."}</p>
      ) : filtered.length === 0 ? (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔔</div>
          <p>{lang === "ar" ? "لا توجد إشعارات" : "No notifications"}</p>
        </div>
      ) : (
        shown.map(n => (
          <div
            key={n.id}
            onClick={async () => {
              if (!n.is_read) await markRead(n.id);
              if (n.link) navigate(n.link);
            }}
            style={{
              border: "1px solid #e2e8f0",
              background: n.is_read ? "#ffffff" : "#f8fbff",
              padding: "14px", borderRadius: "12px", marginBottom: "10px",
              cursor: n.link ? "pointer" : "default"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <strong style={{ color: "#0f172a", fontSize: "15px" }}>{n.title}</strong>
              {!n.is_read && <span style={{ color: "#ef4444", fontSize: "12px" }}>{lang === "ar" ? "غير مقروء" : "Unread"}</span>}
            </div>
            <p style={{ margin: 0, color: "#334155", fontSize: "14px" }}>{n.message}</p>
            {n.created_at && <small style={{ color: "#94a3b8", marginTop: "8px", display: "block", fontSize: "12px" }}>{new Date(n.created_at).toLocaleString()}</small>}
          </div>
        ))
      )}
      {canLoadMore && !loading && (
        <div style={{ textAlign: "center", marginTop: "14px" }}>
          <button
            onClick={loadMore}
            style={{ background: "#0ea5e9", color: "white", border: "none", borderRadius: "8px", padding: "10px 16px", cursor: "pointer" }}
          >
            {lang === "ar" ? "تحميل المزيد" : "Load more"}
          </button>
        </div>
      )}    </div>
  );
}

export default NotificationsPage;
