const express  = require("express");
const router   = express.Router();
const pool     = require("../db/db");
const bcrypt   = require("bcrypt");
const jwt      = require("jsonwebtoken");

/* ══════════════════════════════════════
   REGISTER
══════════════════════════════════════ */
router.post("/register", async (req, res) => {
  try {
    const { name, city, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO stores (name, city, email, password)
       VALUES ($1,$2,$3,$4) RETURNING id,name,city,email`,
      [name, city, email, hashed]
    );
    res.json({ message: "Store registered successfully", store: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ══════════════════════════════════════
   LOGIN
══════════════════════════════════════ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const store = await pool.query("SELECT * FROM stores WHERE email=$1", [email]);
    if (store.rows.length === 0) return res.status(404).json({ error: "Store not found" });
    if (store.rows[0].is_active === false)
      return res.status(403).json({ error: "suspended", message: "متجرك معلق حالياً. تواصل مع إدارة PalPrice." });
    const valid = await bcrypt.compare(password, store.rows[0].password);
    if (!valid) return res.status(401).json({ error: "Wrong password" });
    const token = jwt.sign({ id: store.rows[0].id }, process.env.JWT_SECRET || "secretkey", { expiresIn: "7d" });
    res.json({ message: "Login successful", token, store: store.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ══════════════════════════════════════
   GET ALL STORES — مع بحث
══════════════════════════════════════ */
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || req.query.q || "";
    let query  = `SELECT id, name, city, email, phone, whatsapp, instagram, facebook, website,
                         logo, is_active,
                         (SELECT COUNT(*) FROM products WHERE store_id = stores.id) AS product_count
                  FROM stores`;
    const params = [];
    if (search) {
      params.push(`%${search}%`);
      query += ` WHERE name ILIKE $1 OR city ILIKE $1`;
    }
    query += " ORDER BY name";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ══════════════════════════════════════
   GET SINGLE STORE
══════════════════════════════════════ */
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, city, address, email, phone, whatsapp, instagram, facebook, website, logo
       FROM stores WHERE id=$1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Store not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ══════════════════════════════════════
   UPDATE STORE INFO
══════════════════════════════════════ */
router.put("/:id", async (req, res) => {
  try {
    const { name, city, address, email, phone, whatsapp, instagram, facebook, website } = req.body;
    const result = await pool.query(
      `UPDATE stores
       SET name=$1, city=$2, address=$3, email=$4,
           phone=$5, whatsapp=$6, instagram=$7, facebook=$8, website=$9
       WHERE id=$10
       RETURNING id, name, city, address, email, phone, whatsapp, instagram, facebook, website, logo`,
      [name, city, address || null, email,
       phone || null, whatsapp || null, instagram || null, facebook || null, website || null,
       req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Store not found" });
    res.json({ message: "Store updated successfully", store: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ══════════════════════════════════════
   STORE PRODUCTS — مع created_at
══════════════════════════════════════ */
router.get("/:id/products", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.name, p.variant_label, p.brand, p.image, p.views, p.status,
              p.category_id, p.created_at,
              c.name AS category_name, c.icon AS category_icon,
              MIN(pr.price) AS best_price
       FROM products p
       LEFT JOIN prices pr ON pr.product_id = p.id AND pr.store_id = $1
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.store_id = $1
       GROUP BY p.id, c.name, c.icon
       ORDER BY p.created_at DESC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ══════════════════════════════════════
   WEEKLY STATS
══════════════════════════════════════ */
router.get("/:id/weekly-stats", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')  AS new_products_this_week,
         COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '14 days'
                            AND created_at <  NOW() - INTERVAL '7 days')  AS new_products_last_week,
         COALESCE(SUM(views) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days'),  0) AS views_this_week,
         COALESCE(SUM(views) FILTER (WHERE created_at >= NOW() - INTERVAL '14 days'
                                      AND created_at <  NOW() - INTERVAL '7 days'), 0) AS views_last_week
       FROM products
       WHERE store_id = $1`,
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ══════════════════════════════════════
   COMPETITION
══════════════════════════════════════ */
router.get("/:id/competition", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id AS product_id, p.name AS product_name,
              s.id AS store_id, s.name AS store_name, pr.price,
              CASE WHEN s.id = $1 THEN true ELSE false END AS is_mine
       FROM prices pr
       JOIN products p ON pr.product_id = p.id
       JOIN stores s   ON pr.store_id   = s.id
       WHERE p.id IN (SELECT product_id FROM prices WHERE store_id=$1)
       ORDER BY p.name, pr.price ASC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ══════════════════════════════════════
   RATING
══════════════════════════════════════ */
router.post("/:id/review", async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const result = await pool.query(
      "INSERT INTO store_reviews (store_id, rating, comment) VALUES ($1,$2,$3) RETURNING *",
      [req.params.id, rating, comment]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id/rating", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT AVG(rating) AS average, COUNT(*) AS total FROM store_reviews WHERE store_id=$1",
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ══════════════════════════════════════
   UPLOAD LOGO
══════════════════════════════════════ */
const upload = require("../middleware/upload");
router.post("/:id/logo", upload.single("image"), async (req, res) => {
  try {
    const logoUrl = "/uploads/" + req.file.filename;
    await pool.query("UPDATE stores SET logo=$1 WHERE id=$2", [logoUrl, req.params.id]);
    res.json({ message: "Logo uploaded", logo: logoUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;