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
  } catch { res.status(401).json({ error: "Invalid token" }); }
}

/* ==============================
   PUBLIC — جلب الحملات النشطة
============================== */
router.get("/active", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, s.name AS store_name, s.logo AS store_logo,
        cp.code AS coupon_code, cp.discount_type, cp.discount_value
      FROM campaigns c
      JOIN stores s ON c.store_id = s.id
      LEFT JOIN coupons cp ON c.coupon_id = cp.id
      WHERE c.is_active = true
        AND c.starts_at <= NOW()
        AND c.ends_at > NOW()
      ORDER BY c.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   PUBLIC — حملات متجر معين
============================== */
router.get("/store/:storeId", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, cp.code AS coupon_code, cp.discount_type, cp.discount_value
      FROM campaigns c
      LEFT JOIN coupons cp ON c.coupon_id = cp.id
      WHERE c.store_id = $1
        AND c.is_active = true
        AND c.ends_at > NOW()
      ORDER BY c.created_at DESC
    `, [req.params.storeId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   PUBLIC — تسجيل مشاهدة
============================== */
router.post("/:id/view", async (req, res) => {
  try {
    await pool.query("UPDATE campaigns SET views_count=views_count+1 WHERE id=$1", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   STORE — إنشاء حملة
============================== */
router.post("/", storeAuth, async (req, res) => {
  try {
    const { title, description, coupon_id, discount_text, banner_color, ends_at } = req.body;

    if (!title?.trim()) return res.status(400).json({ error: "Title required" });
    if (!ends_at)       return res.status(400).json({ error: "End date required" });

    const endsDate = new Date(ends_at);
    if (isNaN(endsDate.getTime())) return res.status(400).json({ error: "Invalid end date" });
    if (endsDate <= new Date())    return res.status(400).json({ error: "End date must be in the future" });

    const result = await pool.query(
      `INSERT INTO campaigns (store_id, title, description, coupon_id, discount_text, banner_color, ends_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [req.storeId, title, description || null, coupon_id || null,
       discount_text || null, banner_color || "#22c55e", ends_at]
    );
    const campaign = result.rows[0];

    // جلب اسم المتجر
    const store = await pool.query("SELECT name FROM stores WHERE id=$1", [req.storeId]);
    const storeName = store.rows[0]?.name || "متجر";

    // إشعار لكل المستخدمين المسجلين
    try {
      const users = await pool.query("SELECT id FROM users WHERE is_banned=false OR is_banned IS NULL");
      for (const user of users.rows) {
        await pool.query(
          `INSERT INTO user_notifications (user_id, type, title, message, link)
           VALUES ($1,$2,$3,$4,$5)`,
          [user.id, "campaign",
           `🎉 حملة جديدة من ${storeName}!`,
           title + (discount_text ? ` — ${discount_text}` : ""),
           `/campaigns`]
        );
      }
    } catch (notifErr) {
      console.log("Notification error:", notifErr.message);
    }

    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   STORE — جلب حملاتي
============================== */
router.get("/mine", storeAuth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, cp.code AS coupon_code
      FROM campaigns c
      LEFT JOIN coupons cp ON c.coupon_id = cp.id
      WHERE c.store_id = $1
      ORDER BY c.created_at DESC
    `, [req.storeId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   STORE — تعديل حملة
============================== */
router.put("/:id", storeAuth, async (req, res) => {
  try {
    const { title, description, discount_text, banner_color, ends_at, is_active } = req.body;
    const result = await pool.query(
      `UPDATE campaigns SET title=$1, description=$2, discount_text=$3,
       banner_color=$4, ends_at=$5, is_active=$6
       WHERE id=$7 AND store_id=$8 RETURNING *`,
      [title, description, discount_text, banner_color, ends_at,
       is_active !== undefined ? is_active : true, req.params.id, req.storeId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   STORE — حذف حملة
============================== */
router.delete("/:id", storeAuth, async (req, res) => {
  try {
    await pool.query("DELETE FROM campaigns WHERE id=$1 AND store_id=$2", [req.params.id, req.storeId]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;