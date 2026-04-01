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

function userAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

/* ==============================
   STORE — إنشاء كوبون
============================== */
router.post("/", storeAuth, async (req, res) => {
  try {
    const { code, discount_type, discount_value, min_purchase, max_uses, expires_at, description } = req.body;
    if (!code || !discount_value) return res.status(400).json({ error: "Code and discount required" });

    // تأكد إن الكود غير مكرر
    const existing = await pool.query("SELECT id FROM coupons WHERE code=$1", [code.toUpperCase()]);
    if (existing.rows.length > 0) return res.status(400).json({ error: "Code already exists" });

    const result = await pool.query(
      `INSERT INTO coupons (store_id, code, discount_type, discount_value, min_purchase, max_uses, expires_at, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [req.storeId, code.toUpperCase(), discount_type || "percent", discount_value,
       min_purchase || 0, max_uses || null, expires_at || null, description || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   STORE — جلب كوبوناتي
============================== */
router.get("/mine", storeAuth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*,
        (SELECT COUNT(*) FROM coupon_uses WHERE coupon_id=c.id) AS uses
      FROM coupons c
      WHERE c.store_id=$1
      ORDER BY c.created_at DESC
    `, [req.storeId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   STORE — تعديل كوبون
============================== */
router.put("/:id", storeAuth, async (req, res) => {
  try {
    const { discount_type, discount_value, min_purchase, max_uses, expires_at, description, is_active } = req.body;
    const result = await pool.query(
      `UPDATE coupons SET discount_type=$1, discount_value=$2, min_purchase=$3,
       max_uses=$4, expires_at=$5, description=$6, is_active=$7
       WHERE id=$8 AND store_id=$9 RETURNING *`,
      [discount_type, discount_value, min_purchase || 0, max_uses || null,
       expires_at || null, description, is_active !== undefined ? is_active : true,
       req.params.id, req.storeId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   STORE — حذف كوبون
============================== */
router.delete("/:id", storeAuth, async (req, res) => {
  try {
    await pool.query("DELETE FROM coupons WHERE id=$1 AND store_id=$2", [req.params.id, req.storeId]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   PUBLIC — كوبونات متجر معين
============================== */
router.get("/store/:storeId", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.code, c.discount_type, c.discount_value, c.min_purchase,
             c.description, c.expires_at, c.max_uses, c.used_count
      FROM coupons c
      WHERE c.store_id=$1
        AND c.is_active=true
        AND (c.expires_at IS NULL OR c.expires_at > NOW())
        AND (c.max_uses IS NULL OR c.used_count < c.max_uses)
      ORDER BY c.discount_value DESC
    `, [req.params.storeId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   PUBLIC — التحقق من كوبون
============================== */
router.post("/verify", async (req, res) => {
  try {
    const { code, store_id, purchase_amount } = req.body;
    if (!code || !store_id) return res.status(400).json({ error: "Code and store required" });

    const result = await pool.query(`
      SELECT * FROM coupons
      WHERE code=$1 AND store_id=$2
        AND is_active=true
        AND (expires_at IS NULL OR expires_at > NOW())
        AND (max_uses IS NULL OR used_count < max_uses)
    `, [code.toUpperCase(), store_id]);

    if (result.rows.length === 0) return res.status(404).json({ error: "invalid" });

    const coupon = result.rows[0];

    // تحقق من الحد الأدنى للشراء
    if (purchase_amount && Number(purchase_amount) < Number(coupon.min_purchase)) {
      return res.status(400).json({
        error: "min_purchase",
        min_purchase: coupon.min_purchase
      });
    }

    // احسب التوفير
    let discount = 0;
    if (coupon.discount_type === "percent") {
      discount = purchase_amount ? (Number(purchase_amount) * Number(coupon.discount_value) / 100) : null;
    } else {
      discount = Number(coupon.discount_value);
    }

    res.json({ valid: true, coupon, discount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   USER — استخدام كوبون (تسجيل)
============================== */
router.post("/use", userAuth, async (req, res) => {
  try {
    const { code, store_id } = req.body;

    const coupon = await pool.query(
      "SELECT * FROM coupons WHERE code=$1 AND store_id=$2 AND is_active=true AND (expires_at IS NULL OR expires_at > NOW()) AND (max_uses IS NULL OR used_count < max_uses)",
      [code.toUpperCase(), store_id]
    );
    if (coupon.rows.length === 0) return res.status(404).json({ error: "invalid" });

    // سجّل الاستخدام
    await pool.query(
      "INSERT INTO coupon_uses (coupon_id, user_id) VALUES ($1,$2)",
      [coupon.rows[0].id, req.userId]
    );
    await pool.query(
      "UPDATE coupons SET used_count=used_count+1 WHERE id=$1",
      [coupon.rows[0].id]
    );

    res.json({ message: "Used", coupon: coupon.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   PUBLIC — Batch: كوبونات + حملات لقائمة متاجر
   GET /coupons/batch?stores=1,2,3
   يُرجع { coupons: { storeId: [...] }, campaigns: { storeId: [...] } }
============================== */
router.get("/batch", async (req, res) => {
  try {
    const raw = req.query.stores || "";
    // قبول فقط IDs رقمية
    const storeIds = raw.split(",").map(s => parseInt(s, 10)).filter(n => !isNaN(n) && n > 0);
    if (storeIds.length === 0) return res.json({ coupons: {}, campaigns: {} });
    if (storeIds.length > 50) return res.status(400).json({ error: "Max 50 stores per request" });

    // كوبونات نشطة لكل المتاجر في استعلام واحد
    const couponsResult = await pool.query(`
      SELECT id, store_id, code, discount_type, discount_value, min_purchase,
             description, expires_at, max_uses, used_count
      FROM coupons
      WHERE store_id = ANY($1::int[])
        AND is_active = true
        AND (expires_at IS NULL OR expires_at > NOW())
        AND (max_uses IS NULL OR used_count < max_uses)
      ORDER BY discount_value DESC
    `, [storeIds]);

    // حملات نشطة لكل المتاجر في استعلام واحد
    const campaignsResult = await pool.query(`
      SELECT c.*, cp.code AS coupon_code, cp.discount_type, cp.discount_value
      FROM campaigns c
      LEFT JOIN coupons cp ON c.coupon_id = cp.id
      WHERE c.store_id = ANY($1::int[])
        AND c.is_active = true
        AND c.ends_at > NOW()
      ORDER BY c.created_at DESC
    `, [storeIds]);

    // تجميع النتائج بـ storeId كمفتاح
    const coupons   = {};
    const campaigns = {};

    for (const row of couponsResult.rows) {
      const sid = String(row.store_id);
      if (!coupons[sid]) coupons[sid] = [];
      coupons[sid].push(row);
    }

    for (const row of campaignsResult.rows) {
      const sid = String(row.store_id);
      if (!campaigns[sid]) campaigns[sid] = [];
      campaigns[sid].push(row);
    }

    res.json({ coupons, campaigns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   STORE — إحصائيات كوبون
============================== */
router.get("/:id/stats", storeAuth, async (req, res) => {
  try {
    const coupon = await pool.query(
      "SELECT * FROM coupons WHERE id=$1 AND store_id=$2",
      [req.params.id, req.storeId]
    );
    if (coupon.rows.length === 0) return res.status(404).json({ error: "Not found" });

    const uses = await pool.query(
      "SELECT cu.used_at, u.name AS user_name FROM coupon_uses cu LEFT JOIN users u ON cu.user_id=u.id WHERE cu.coupon_id=$1 ORDER BY cu.used_at DESC LIMIT 20",
      [req.params.id]
    );

    res.json({ coupon: coupon.rows[0], recent_uses: uses.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;