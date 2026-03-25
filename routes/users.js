const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/upload");

/* ============================================================
   AUTH
============================================================ */
function authMiddleware(req, res, next) {
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

/* ============================================================
   BEST PRICE (🔥 مهم جداً)
============================================================ */
const BEST_PRICE_CTE = `
  WITH product_prices AS (
    SELECT product_id, MIN(price) AS best_price
    FROM prices
    GROUP BY product_id
  )
`;

/* ============================================================
   REGISTER
============================================================ */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const exists = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (exists.rows.length > 0)
      return res.status(400).json({ error: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name,email,password,role)
       VALUES ($1,$2,$3,'user')
       RETURNING id,name,email,role`,
      [name, email, hash]
    );

    const token = jwt.sign(
      { id: result.rows[0].id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "30d" }
    );

    res.json({ token, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   LOGIN
============================================================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    if (user.rows[0].is_banned)
      return res.status(403).json({ error: "Account banned" });

    const valid = await bcrypt.compare(password, user.rows[0].password);
    if (!valid)
      return res.status(401).json({ error: "Wrong password" });

    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        avatar: user.rows[0].avatar,
        role: user.rows[0].role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   PROFILE
============================================================ */
router.get("/profile", authMiddleware, async (req, res) => {
  const result = await pool.query(
    "SELECT id,name,email,avatar,role FROM users WHERE id=$1",
    [req.userId]
  );

  res.json(result.rows[0]);
});

router.put("/profile", authMiddleware, async (req, res) => {
  const { name, email } = req.body;

  const result = await pool.query(
    `UPDATE users SET name=$1,email=$2 WHERE id=$3
     RETURNING id,name,email,avatar,role`,
    [name, email, req.userId]
  );

  res.json(result.rows[0]);
});

/* ============================================================
   AVATAR
============================================================ */
router.post("/avatar", authMiddleware, upload.single("avatar"), async (req, res) => {
  const url = "/uploads/" + req.file.filename;

  await pool.query(
    "UPDATE users SET avatar=$1 WHERE id=$2",
    [url, req.userId]
  );

  res.json({ avatar: url });
});

/* ============================================================
   FAVORITES (🔥 optimized)
============================================================ */
router.get("/favorites", authMiddleware, async (req, res) => {
  const result = await pool.query(`
    ${BEST_PRICE_CTE}
    SELECT
      p.id,
      p.name,
      p.image,
      p.brand,
      pp.best_price,
      uf.created_at
    FROM user_favorites uf
    JOIN products p ON uf.product_id = p.id
    LEFT JOIN product_prices pp ON p.id = pp.product_id
    WHERE uf.user_id = $1
    ORDER BY uf.created_at DESC
  `, [req.userId]);

  res.json(result.rows);
});

router.post("/favorites/:productId", authMiddleware, async (req, res) => {
  await pool.query(`
    INSERT INTO user_favorites (user_id, product_id)
    VALUES ($1,$2)
    ON CONFLICT DO NOTHING
  `, [req.userId, req.params.productId]);

  res.json({ message: "Added" });
});

router.delete("/favorites/:productId", authMiddleware, async (req, res) => {
  await pool.query(
    "DELETE FROM user_favorites WHERE user_id=$1 AND product_id=$2",
    [req.userId, req.params.productId]
  );

  res.json({ message: "Removed" });
});

/* ============================================================
   VIEWED (🔥 optimized)
============================================================ */
router.get("/viewed", authMiddleware, async (req, res) => {
  const result = await pool.query(`
    ${BEST_PRICE_CTE}
    SELECT
      p.id,
      p.name,
      p.image,
      pp.best_price,
      uv.viewed_at
    FROM user_viewed uv
    JOIN products p ON uv.product_id = p.id
    LEFT JOIN product_prices pp ON p.id = pp.product_id
    WHERE uv.user_id = $1
    ORDER BY uv.viewed_at DESC
    LIMIT 12
  `, [req.userId]);

  res.json(result.rows);
});

router.post("/viewed/:productId", authMiddleware, async (req, res) => {
  await pool.query(
    "DELETE FROM user_viewed WHERE user_id=$1 AND product_id=$2",
    [req.userId, req.params.productId]
  );

  await pool.query(
    "INSERT INTO user_viewed (user_id, product_id) VALUES ($1,$2)",
    [req.userId, req.params.productId]
  );

  res.json({ message: "Recorded" });
});

/* ============================================================
   COMPARISON
============================================================ */
router.post("/comparisons", authMiddleware, async (req, res) => {
  const { product_ids } = req.body;

  if (!Array.isArray(product_ids) || product_ids.length < 2) {
    return res.status(400).json({ error: "Need at least 2 products" });
  }

  const result = await pool.query(
    "INSERT INTO user_comparisons (user_id, product_ids) VALUES ($1,$2) RETURNING *",
    [req.userId, product_ids]
  );

  res.json(result.rows[0]);
});

router.get("/comparisons", authMiddleware, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM user_comparisons WHERE user_id=$1 ORDER BY created_at DESC LIMIT 10",
    [req.userId]
  );

  res.json(result.rows);
});

/* ============================================================
   NOTIFICATIONS
============================================================ */
router.get("/notifications", authMiddleware, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM user_notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50",
    [req.userId]
  );

  res.json(result.rows);
});

router.put("/notifications/:id/read", authMiddleware, async (req, res) => {
  await pool.query(
    "UPDATE user_notifications SET is_read=true WHERE id=$1 AND user_id=$2",
    [req.params.id, req.userId]
  );

  res.json({ message: "Read" });
});

router.put("/notifications/read-all", authMiddleware, async (req, res) => {
  await pool.query(
    "UPDATE user_notifications SET is_read=true WHERE user_id=$1",
    [req.userId]
  );

  res.json({ message: "All read" });
});

router.get("/notifications/unread-count", authMiddleware, async (req, res) => {
  const result = await pool.query(
    "SELECT COUNT(*) FROM user_notifications WHERE user_id=$1 AND is_read=false",
    [req.userId]
  );

  res.json({ count: parseInt(result.rows[0].count) });
});

/* ============================================================
   PRICE ALERTS (🔥 optimized)
============================================================ */
router.get("/price-alerts", authMiddleware, async (req, res) => {
  const result = await pool.query(`
    ${BEST_PRICE_CTE}
    SELECT
      pa.*,
      p.name,
      p.image,
      pp.best_price AS current_price
    FROM price_alerts pa
    JOIN products p ON pa.product_id = p.id
    LEFT JOIN product_prices pp ON pa.product_id = pp.product_id
    WHERE pa.user_id = $1
    ORDER BY pa.created_at DESC
  `, [req.userId]);

  res.json(result.rows);
});

router.delete("/price-alerts/:id", authMiddleware, async (req, res) => {
  await pool.query(
    "DELETE FROM price_alerts WHERE id=$1 AND user_id=$2",
    [req.params.id, req.userId]
  );

  res.json({ message: "Deleted" });
});

module.exports = router;