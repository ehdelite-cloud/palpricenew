const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authAdmin, authSuperAdmin } = require("../middleware/auth");

/* ==============================
   HELPERS
============================== */

function parsePage(value, fallback = 1) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : fallback;
}

function parseBoolean(value) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}



/* ==============================
   LOGIN
============================== */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    if (!["admin", "moderator"].includes(user.role)) {
      return res.status(403).json({ error: "Not an admin account" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   ANALYTICS
============================== */

router.get("/analytics", authAdmin, async (req, res) => {
  try {
    const [
      products,
      stores,
      prices,
      users,
      pending,
      banned,
      newWeek,
      mostViewed,
      topStore,
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM products"),
      pool.query("SELECT COUNT(*) FROM stores"),
      pool.query("SELECT COUNT(*) FROM prices"),
      pool.query("SELECT COUNT(*) FROM users WHERE role='user'"),
      pool.query("SELECT COUNT(*) FROM products WHERE status='pending'"),
      pool.query("SELECT COUNT(*) FROM users WHERE is_banned=true"),
      pool.query("SELECT COUNT(*) FROM products WHERE created_at >= NOW() - INTERVAL '7 days'"),
      pool.query("SELECT name, views FROM products ORDER BY views DESC LIMIT 1"),
      pool.query(`
        SELECT s.name, COUNT(pr.id) AS price_count
        FROM stores s
        LEFT JOIN prices pr ON pr.store_id = s.id
        GROUP BY s.id, s.name
        ORDER BY price_count DESC
        LIMIT 1
      `),
    ]);

    res.json({
      products: parseInt(products.rows[0].count, 10),
      stores: parseInt(stores.rows[0].count, 10),
      prices: parseInt(prices.rows[0].count, 10),
      users: parseInt(users.rows[0].count, 10),
      pending: parseInt(pending.rows[0].count, 10),
      banned: parseInt(banned.rows[0].count, 10),
      newThisWeek: parseInt(newWeek.rows[0].count, 10),
      mostViewed: mostViewed.rows[0]?.name || "—",
      topStore: topStore.rows[0]?.name || "—",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   USERS
============================== */

router.get("/users", authAdmin, async (req, res) => {
  try {
    const { search = "", role = "" } = req.query;
    const page = parsePage(req.query.page, 1);
    const limit = 15;
    const offset = (page - 1) * limit;

    const params = [];
    let where = "WHERE 1=1";

    if (search) {
      params.push(`%${search}%`);
      where += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length})`;
    }

    if (role) {
      params.push(role);
      where += ` AND role=$${params.length}`;
    }

    const result = await pool.query(
      `SELECT id, name, email, role, is_banned, banned_reason, avatar, created_at
       FROM users
       ${where}
       ORDER BY created_at DESC
       LIMIT ${limit} OFFSET ${offset}`,
      params
    );

    const count = await pool.query(
      `SELECT COUNT(*) FROM users ${where}`,
      params
    );

    res.json({
      users: result.rows,
      total: parseInt(count.rows[0].count, 10),
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/users/:id/role", authAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "moderator", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    await pool.query(
      "UPDATE users SET role=$1 WHERE id=$2",
      [role, req.params.id]
    );

    await pool.query(
      "INSERT INTO admin_notifications (type, message, related_id, related_type) VALUES ($1,$2,$3,$4)",
      [
        "role_change",
        `تم تغيير صلاحية المستخدم #${req.params.id} إلى ${role}`,
        req.params.id,
        "user",
      ]
    );

    res.json({ message: "Role updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/users/:id/ban", authAdmin, async (req, res) => {
  try {
    const banned = parseBoolean(req.body.banned);
    const reason = req.body.reason || null;

    if (banned === null) {
      return res.status(400).json({ error: "banned must be true or false" });
    }

    await pool.query(
      "UPDATE users SET is_banned=$1, banned_reason=$2 WHERE id=$3",
      [banned, reason, req.params.id]
    );

    await pool.query(
      "INSERT INTO admin_notifications (type, message, related_id, related_type) VALUES ($1,$2,$3,$4)",
      [
        banned ? "user_banned" : "user_unbanned",
        `${banned ? "تم حظر" : "رفع حظر"} المستخدم #${req.params.id}`,
        req.params.id,
        "user",
      ]
    );

    res.json({ message: banned ? "Banned" : "Unbanned" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   STORES
============================== */

router.get("/stores", authAdmin, async (req, res) => {
  try {
    const { search = "" } = req.query;
    const page = parsePage(req.query.page, 1);
    const limit = 12;
    const offset = (page - 1) * limit;

    const params = [];
    let where = "WHERE 1=1";

    if (search) {
      params.push(`%${search}%`);
      where += ` AND (s.name ILIKE $${params.length} OR s.city ILIKE $${params.length})`;
    }

    const result = await pool.query(
      `
      SELECT s.id, s.name, s.city, s.email, s.is_active, s.logo,
             COUNT(DISTINCT pr.product_id) AS product_count
      FROM stores s
      LEFT JOIN prices pr ON pr.store_id = s.id
      ${where}
      GROUP BY s.id, s.name, s.city, s.email, s.is_active, s.logo
      ORDER BY s.id DESC
      LIMIT ${limit} OFFSET ${offset}
      `,
      params
    );

    const count = await pool.query(
      `SELECT COUNT(*) FROM stores s ${where}`,
      params
    );

    res.json({
      stores: result.rows,
      total: parseInt(count.rows[0].count, 10),
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/stores/:id/status", authAdmin, async (req, res) => {
  try {
    const isActive = parseBoolean(req.body.is_active);

    if (isActive === null) {
      return res.status(400).json({ error: "is_active must be true or false" });
    }

    await pool.query(
      "UPDATE stores SET is_active=$1 WHERE id=$2",
      [isActive, req.params.id]
    );

    await pool.query(
      "INSERT INTO admin_notifications (type, message, related_id, related_type) VALUES ($1,$2,$3,$4)",
      [
        isActive ? "store_activated" : "store_suspended",
        `${isActive ? "تفعيل" : "تعليق"} المتجر #${req.params.id}`,
        req.params.id,
        "store",
      ]
    );

    res.json({ message: isActive ? "Activated" : "Suspended" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/stores/:id", authSuperAdmin, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM stores WHERE id=$1",
      [req.params.id]
    );
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   PRODUCTS
============================== */

router.get("/products", authAdmin, async (req, res) => {
  try {
    const { status = "", search = "" } = req.query;
    const page = parsePage(req.query.page, 1);
    const limit = 15;
    const offset = (page - 1) * limit;

    const params = [];
    let where = "WHERE 1=1";

    if (status) {
      params.push(status);
      where += ` AND p.status=$${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      where += ` AND p.name ILIKE $${params.length}`;
    }

    const result = await pool.query(
      `
      SELECT p.id, p.name, p.brand, p.status, p.image, p.views, p.created_at,
             c.name AS category_name, s.name AS store_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN stores s ON p.store_id = s.id
      ${where}
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
      `,
      params
    );

    const count = await pool.query(
      `SELECT COUNT(*) FROM products p ${where}`,
      params
    );

    res.json({
      products: result.rows,
      total: parseInt(count.rows[0].count, 10),
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/products/:id/approve", authAdmin, async (req, res) => {
  try {
    await pool.query(
      "UPDATE products SET status='approved' WHERE id=$1",
      [req.params.id]
    );

    await pool.query(
      "INSERT INTO admin_notifications (type, message, related_id, related_type) VALUES ($1,$2,$3,$4)",
      [
        "product_approved",
        `موافقة على المنتج #${req.params.id}`,
        req.params.id,
        "product",
      ]
    );

    res.json({ message: "Approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/products/:id/reject", authAdmin, async (req, res) => {
  try {
    const { reason } = req.body;

    await pool.query(
      "UPDATE products SET status='rejected', reject_reason=$1 WHERE id=$2",
      [reason || null, req.params.id]
    );

    await pool.query(
      "INSERT INTO admin_notifications (type, message, related_id, related_type) VALUES ($1,$2,$3,$4)",
      [
        "product_rejected",
        `رفض المنتج #${req.params.id}${reason ? `: ${reason}` : ""}`,
        req.params.id,
        "product",
      ]
    );

    res.json({ message: "Rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/products/:id", authAdmin, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM products WHERE id=$1",
      [req.params.id]
    );
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   NOTIFICATIONS
============================== */

router.get("/notifications", authAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM admin_notifications ORDER BY created_at DESC LIMIT 50"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/notifications/:id/read", authAdmin, async (req, res) => {
  try {
    await pool.query(
      "UPDATE admin_notifications SET is_read=true WHERE id=$1",
      [req.params.id]
    );
    res.json({ message: "Done" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/notifications/read-all", authAdmin, async (req, res) => {
  try {
    await pool.query("UPDATE admin_notifications SET is_read=true");
    res.json({ message: "Done" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   MODERATORS
============================== */

router.get("/moderators", authAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, avatar, created_at FROM users WHERE role IN ('admin','moderator') ORDER BY role, created_at"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;