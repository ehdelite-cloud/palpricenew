const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const jwt = require("jsonwebtoken");

function storeAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.storeId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

function adminAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    if (!["admin", "moderator"].includes(decoded.role))
      return res.status(403).json({ error: "Not authorized" });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

/* ======================================================
   ⚠️ STATIC ROUTES FIRST — قبل أي route فيه :id
   لأن Express بيفسّر "notifications" كـ :id
====================================================== */

/* STORE — جلب تذاكر المتجر */
router.get("/store", storeAuth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, u.name AS assigned_name,
        (SELECT COUNT(*) FROM ticket_messages WHERE ticket_id=t.id AND is_read=false AND sender_type='admin') AS unread_count,
        (SELECT message FROM ticket_messages WHERE ticket_id=t.id ORDER BY created_at DESC LIMIT 1) AS last_message,
        (SELECT created_at FROM ticket_messages WHERE ticket_id=t.id ORDER BY created_at DESC LIMIT 1) AS last_message_at
      FROM support_tickets t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.store_id = $1
      ORDER BY t.updated_at DESC
    `, [req.storeId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ADMIN — جلب كل التذاكر */
router.get("/admin", adminAuth, async (req, res) => {
  try {
    const { status } = req.query;
    let where = "WHERE 1=1";
    const params = [];
    if (status) { params.push(status); where += ` AND t.status=$${params.length}`; }

    const result = await pool.query(`
      SELECT t.*, s.name AS store_name, u.name AS assigned_name,
        (SELECT COUNT(*) FROM ticket_messages WHERE ticket_id=t.id AND is_read=false AND sender_type='store') AS unread_count,
        (SELECT message FROM ticket_messages WHERE ticket_id=t.id ORDER BY created_at DESC LIMIT 1) AS last_message,
        (SELECT created_at FROM ticket_messages WHERE ticket_id=t.id ORDER BY created_at DESC LIMIT 1) AS last_message_at
      FROM support_tickets t
      JOIN stores s ON t.store_id = s.id
      LEFT JOIN users u ON t.assigned_to = u.id
      ${where}
      ORDER BY CASE WHEN t.status='open' THEN 0 WHEN t.status='in_progress' THEN 1 ELSE 2 END, t.updated_at DESC
    `, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* STORE NOTIFICATIONS — لازم قبل /:id */
router.get("/notifications/store", storeAuth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM store_notifications WHERE store_id=$1 ORDER BY created_at DESC LIMIT 30",
      [req.storeId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/notifications/store/read-all", storeAuth, async (req, res) => {
  try {
    await pool.query("UPDATE store_notifications SET is_read=true WHERE store_id=$1", [req.storeId]);
    res.json({ message: "All read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/notifications/store/read/:id", storeAuth, async (req, res) => {
  try {
    await pool.query(
      "UPDATE store_notifications SET is_read=true WHERE id=$1 AND store_id=$2",
      [req.params.id, req.storeId]
    );
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   DYNAMIC ROUTES — بعد الـ static routes
====================================================== */

/* STORE — إنشاء تذكرة جديدة */
router.post("/", storeAuth, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) return res.status(400).json({ error: "Subject and message required" });

    const storeResult = await pool.query("SELECT name FROM stores WHERE id=$1", [req.storeId]);
    const storeName = storeResult.rows[0]?.name || "متجر";

    const ticket = await pool.query(
      "INSERT INTO support_tickets (store_id, subject) VALUES ($1,$2) RETURNING *",
      [req.storeId, subject]
    );
    const ticketId = ticket.rows[0].id;

    await pool.query(
      "INSERT INTO ticket_messages (ticket_id, sender_type, sender_id, sender_name, message) VALUES ($1,'store',$2,$3,$4)",
      [ticketId, req.storeId, storeName, message]
    );

    await pool.query(
      "INSERT INTO admin_notifications (type, message, related_id, related_type, link) VALUES ($1,$2,$3,$4,$5)",
      ["new_ticket", `تذكرة جديدة من متجر "${storeName}": ${subject}`, ticketId, "ticket", `/admin/tickets/${ticketId}`]
    );

    res.json({ message: "Ticket created", ticket: ticket.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* STORE — تفاصيل تذكرة */
router.get("/:id/store", storeAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await pool.query(
      "SELECT t.*, u.name AS assigned_name FROM support_tickets t LEFT JOIN users u ON t.assigned_to=u.id WHERE t.id=$1 AND t.store_id=$2",
      [id, req.storeId]
    );
    if (ticket.rows.length === 0) return res.status(404).json({ error: "Not found" });

    const messages = await pool.query(
      "SELECT * FROM ticket_messages WHERE ticket_id=$1 ORDER BY created_at ASC", [id]
    );
    await pool.query(
      "UPDATE ticket_messages SET is_read=true WHERE ticket_id=$1 AND sender_type='admin'", [id]
    );
    res.json({ ticket: ticket.rows[0], messages: messages.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* STORE — إرسال رد */
router.post("/:id/reply/store", storeAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: "Message required" });

    const ticket = await pool.query(
      "SELECT t.*, s.name AS store_name FROM support_tickets t JOIN stores s ON t.store_id=s.id WHERE t.id=$1 AND t.store_id=$2",
      [id, req.storeId]
    );
    if (ticket.rows.length === 0) return res.status(404).json({ error: "Not found" });
    if (ticket.rows[0].status === "closed") return res.status(400).json({ error: "Ticket is closed" });

    const storeName = ticket.rows[0].store_name;
    await pool.query(
      "INSERT INTO ticket_messages (ticket_id, sender_type, sender_id, sender_name, message) VALUES ($1,'store',$2,$3,$4)",
      [id, req.storeId, storeName, message.trim()]
    );
    await pool.query(
      "UPDATE support_tickets SET updated_at=NOW(), status=CASE WHEN status='in_progress' THEN 'open' ELSE status END WHERE id=$1",
      [id]
    );
    await pool.query(
      "INSERT INTO admin_notifications (type, message, related_id, related_type, link) VALUES ($1,$2,$3,$4,$5)",
      ["ticket_reply", `رد جديد من متجر "${storeName}" على التذكرة #${id}`, id, "ticket", `/admin/tickets/${id}`]
    );
    res.json({ message: "Reply sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ADMIN — تفاصيل تذكرة */
router.get("/:id/admin", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await pool.query(`
      SELECT t.*, s.name AS store_name, u.name AS assigned_name
      FROM support_tickets t
      JOIN stores s ON t.store_id=s.id
      LEFT JOIN users u ON t.assigned_to=u.id
      WHERE t.id=$1
    `, [id]);
    if (ticket.rows.length === 0) return res.status(404).json({ error: "Not found" });

    const messages = await pool.query(
      "SELECT * FROM ticket_messages WHERE ticket_id=$1 ORDER BY created_at ASC", [id]
    );
    await pool.query(
      "UPDATE ticket_messages SET is_read=true WHERE ticket_id=$1 AND sender_type='store'", [id]
    );
    res.json({ ticket: ticket.rows[0], messages: messages.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ADMIN — رد على تذكرة */
router.post("/:id/reply/admin", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: "Message required" });

    const adminUser = await pool.query("SELECT name FROM users WHERE id=$1", [req.userId]);
    const adminName = adminUser.rows[0]?.name || "الإدارة";

    const ticket = await pool.query(
      "SELECT t.*, s.name AS store_name FROM support_tickets t JOIN stores s ON t.store_id=s.id WHERE t.id=$1", [id]
    );
    if (ticket.rows.length === 0) return res.status(404).json({ error: "Not found" });

    await pool.query(
      "INSERT INTO ticket_messages (ticket_id, sender_type, sender_id, sender_name, message) VALUES ($1,'admin',$2,$3,$4)",
      [id, req.userId, adminName, message.trim()]
    );
    await pool.query(
      "UPDATE support_tickets SET updated_at=NOW(), status='in_progress', assigned_to=$1, assigned_at=NOW() WHERE id=$2",
      [req.userId, id]
    );
    await pool.query(
      "INSERT INTO store_notifications (store_id, type, message, link) VALUES ($1,$2,$3,$4)",
      [ticket.rows[0].store_id, "ticket_reply", `رد جديد من ${adminName} على تذكرتك: "${ticket.rows[0].subject}"`, `/store/dashboard/tickets/${id}`]
    );
    res.json({ message: "Reply sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ADMIN — تغيير حالة التذكرة */
router.put("/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["open", "in_progress", "closed"].includes(status))
      return res.status(400).json({ error: "Invalid status" });

    const ticket = await pool.query(
      "UPDATE support_tickets SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *, (SELECT name FROM stores WHERE id=store_id) AS store_name",
      [status, req.params.id]
    );
    if (ticket.rows.length === 0) return res.status(404).json({ error: "Not found" });

    const statusLabels = { open: "مفتوحة", in_progress: "قيد المتابعة", closed: "مغلقة" };
    await pool.query(
      "INSERT INTO store_notifications (store_id, type, message, link) VALUES ($1,$2,$3,$4)",
      [ticket.rows[0].store_id, "ticket_status", `تم تغيير حالة تذكرتك "${ticket.rows[0].subject}" إلى: ${statusLabels[status]}`, `/store/dashboard/tickets/${req.params.id}`]
    );
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;