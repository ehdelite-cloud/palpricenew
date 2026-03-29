const express  = require("express");
const router   = express.Router();
const pool     = require("../db/db");
const upload   = require("../middleware/upload");
const jwt      = require("jsonwebtoken");
const { safeGet, safeSet, safeKeys, safeDel } = require("../utils/redis");

/* ============================================================
   HELPERS
============================================================ */
function buildVariantLabel(base_name, storage, color, edition, size) {
  const parts = [base_name];
  if (edition) parts.push(edition);
  if (storage) parts.push(storage);
  if (size)    parts.push(size);
  if (color)   parts.push(color);
  return parts.filter(Boolean).join(" ");
}

// Redis helpers بتتحمل الغياب بهدوء
async function getCache(key) {
  try { const v = await safeGet(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
async function setCache(key, value, ttl = 60) {
  try { await safeSet(key, JSON.stringify(value), ttl); } catch {}
}
async function invalidateProductCaches() {
  try {
    const keys = await safeKeys("products:*");
    if (keys?.length) await safeDel(keys);
    const s = await safeKeys("search:*");
    if (s?.length) await safeDel(s);
  } catch {}
}

/* ============================================================
   STATIC ROUTES — لازم قبل /:id
============================================================ */

/* ── GET ALL PRODUCTS — مع pagination وفلترة ── */
router.get("/", async (req, res) => {
  try {
    const page     = Math.max(1, parseInt(req.query.page)  || 1);
    const limit    = Math.min(50, parseInt(req.query.limit) || 20);
    const offset   = (page - 1) * limit;
    const search   = req.query.search || req.query.q || "";
    const category = req.query.category || "";
    const brand    = req.query.brand    || "";
    const minPrice = req.query.min_price || "";
    const maxPrice = req.query.max_price || "";
    const sort     = req.query.sort     || "newest";

    // بناء WHERE ديناميكي
    const conditions = ["p.status = 'approved'"];
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(p.name ILIKE $${params.length} OR p.brand ILIKE $${params.length} OR p.variant_label ILIKE $${params.length})`);
    }
    if (category) {
      params.push(category);
      conditions.push(`p.category_id = $${params.length}`);
    }
    if (brand) {
      params.push(`%${brand}%`);
      conditions.push(`p.brand ILIKE $${params.length}`);
    }
    if (minPrice) {
      params.push(parseFloat(minPrice));
      conditions.push(`pp.best_price >= $${params.length}`);
    }
    if (maxPrice) {
      params.push(parseFloat(maxPrice));
      conditions.push(`pp.best_price <= $${params.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    // ترتيب
    const orderMap = {
      newest:     "p.id DESC",
      oldest:     "p.id ASC",
      price_low:  "pp.best_price ASC NULLS LAST",
      price_high: "pp.best_price DESC NULLS LAST",
      popular:    "p.views DESC",
    };
    const orderBy = orderMap[sort] || "p.id DESC";

    // عدد الكل
    const countRes = await pool.query(
      `WITH product_prices AS (
         SELECT product_id, MIN(price) AS best_price FROM prices GROUP BY product_id
       )
       SELECT COUNT(*) FROM products p
       LEFT JOIN product_prices pp ON p.id = pp.product_id
       ${whereClause}`,
      params
    );
    const total = parseInt(countRes.rows[0].count) || 0;

    // البيانات مع pagination
    const dataParams = [...params, limit, offset];
    const result = await pool.query(
      `WITH product_prices AS (
         SELECT product_id, MIN(price) AS best_price FROM prices GROUP BY product_id
       )
       SELECT p.id, p.name, p.brand, p.category_id, p.image, p.views, p.status,
              p.group_id, p.variant_storage, p.variant_color, p.variant_edition,
              p.variant_size, p.variant_label, pp.best_price,
              pg.name AS group_name, c.name AS category_name
       FROM products p
       LEFT JOIN product_prices pp ON p.id = pp.product_id
       LEFT JOIN product_groups pg ON p.group_id = pg.id
       LEFT JOIN categories c ON p.category_id = c.id
       ${whereClause}
       ORDER BY ${orderBy}
       LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
      dataParams
    );

    res.json({
      products: result.rows,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── SEARCH (للـ header autocomplete) ── */
router.get("/search", async (req, res) => {
  try {
    const { q, page, limit: lim } = req.query;

    // إذا في page → يرجع نتائج كاملة مع pagination
    if (page) {
      const pageN   = Math.max(1, parseInt(page) || 1);
      const limitN  = Math.min(50, parseInt(lim) || 20);
      const offset  = (pageN - 1) * limitN;
      const term    = `%${q || ""}%`;

      const countRes = await pool.query(
        `SELECT COUNT(*) FROM products p
         WHERE (p.name ILIKE $1 OR p.brand ILIKE $1 OR p.variant_label ILIKE $1)
           AND p.status = 'approved'`,
        [term]
      );
      const total = parseInt(countRes.rows[0].count) || 0;

      const result = await pool.query(
        `WITH product_prices AS (
           SELECT product_id, MIN(price) AS best_price FROM prices GROUP BY product_id
         )
         SELECT p.id, p.name, p.brand, p.image, p.variant_label, p.views, pp.best_price
         FROM products p
         LEFT JOIN product_prices pp ON p.id = pp.product_id
         WHERE (p.name ILIKE $1 OR p.brand ILIKE $1 OR p.variant_label ILIKE $1)
           AND p.status = 'approved'
         ORDER BY p.views DESC
         LIMIT $2 OFFSET $3`,
        [term, limitN, offset]
      );
      return res.json({ products: result.rows, total, page: pageN, limit: limitN });
    }

    // بدون page → autocomplete (10 نتائج بس)
    const searchTerm = `%${q || ""}%`;
    const cacheKey   = `search:${q || ""}`;
    const cached     = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const result = await pool.query(
      `WITH product_prices AS (
         SELECT product_id, MIN(price) AS best_price FROM prices GROUP BY product_id
       )
       SELECT p.id, p.name, p.brand, p.image, p.variant_label, pp.best_price
       FROM products p
       LEFT JOIN product_prices pp ON p.id = pp.product_id
       WHERE (p.name ILIKE $1 OR p.brand ILIKE $1 OR p.variant_label ILIKE $1)
         AND p.status = 'approved'
       ORDER BY p.views DESC
       LIMIT 10`,
      [searchTerm]
    );
    await setCache(cacheKey, result.rows, 60);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── TRENDING ── */
router.get("/trending", async (req, res) => {
  try {
    const cached = await getCache("trending:products");
    if (cached) return res.json(cached);

    const result = await pool.query(
      `WITH product_prices AS (
         SELECT product_id, MIN(price) AS best_price FROM prices GROUP BY product_id
       )
       SELECT p.id, p.name, p.image, p.views, p.variant_label, pp.best_price
       FROM products p
       LEFT JOIN product_prices pp ON p.id = pp.product_id
       WHERE p.status = 'approved'
       ORDER BY p.views DESC
       LIMIT 8`
    );
    await setCache("trending:products", result.rows, 60);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── STATS PUBLIC ── */
router.get("/stats/public", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         (SELECT COUNT(*) FROM products WHERE status='approved') AS products,
         (SELECT COUNT(*) FROM stores WHERE is_active=true) AS stores,
         (SELECT COUNT(*) FROM categories) AS categories`
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── PRICE DROPS ── */
router.get("/price-drops", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.name, p.image, MIN(ph.price) AS old_price, MAX(ph.price) AS new_price
       FROM price_history ph
       JOIN products p ON ph.product_id = p.id
       WHERE p.status = 'approved'
       GROUP BY p.id
       ORDER BY MAX(ph.price) - MIN(ph.price) DESC
       LIMIT 5`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── COMPARE ── */
router.get("/compare", async (req, res) => {
  try {
    const ids = (req.query.ids || "").split(",").map(Number).filter(n => !isNaN(n));
    if (ids.length === 0) return res.json([]);

    const result = await pool.query(
      `WITH product_prices AS (
         SELECT product_id, MIN(price) AS best_price FROM prices GROUP BY product_id
       )
       SELECT p.id, p.name, p.brand, p.image, p.variant_label,
              p.variant_storage, p.variant_color, p.variant_edition, pp.best_price
       FROM products p
       LEFT JOIN product_prices pp ON p.id = pp.product_id
       WHERE p.id = ANY($1::int[])`,
      [ids]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── ALERTS/MINE ── */
router.get("/alerts/mine", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "login_required" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    const result = await pool.query(
      `WITH product_prices AS (
         SELECT product_id, MIN(price) AS current_price FROM prices GROUP BY product_id
       )
       SELECT pa.*, p.name AS product_name, p.image AS product_image,
              p.variant_label, pp.current_price
       FROM price_alerts pa
       JOIN products p ON pa.product_id = p.id
       LEFT JOIN product_prices pp ON pa.product_id = pp.product_id
       WHERE pa.user_id = $1 AND pa.is_triggered = false
       ORDER BY pa.created_at DESC`,
      [decoded.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   PRODUCT GROUPS
============================================================ */
router.get("/groups/search", async (req, res) => {
  try {
    const searchTerm = `%${req.query.q || ""}%`;
    const result = await pool.query(
      `WITH product_prices AS (
         SELECT product_id, MIN(price) AS best_price FROM prices GROUP BY product_id
       ),
       group_variant_counts AS (
         SELECT group_id, COUNT(*) AS variant_count FROM products WHERE group_id IS NOT NULL GROUP BY group_id
       ),
       group_best_prices AS (
         SELECT p.group_id, MIN(pp.best_price) AS best_price
         FROM products p JOIN product_prices pp ON p.id = pp.product_id
         WHERE p.group_id IS NOT NULL GROUP BY p.group_id
       )
       SELECT pg.id, pg.name, pg.brand, pg.image, c.name AS category_name,
              COALESCE(gvc.variant_count, 0) AS variant_count, gbp.best_price
       FROM product_groups pg
       LEFT JOIN categories c ON pg.category_id = c.id
       LEFT JOIN group_variant_counts gvc ON pg.id = gvc.group_id
       LEFT JOIN group_best_prices gbp ON pg.id = gbp.group_id
       WHERE pg.name ILIKE $1 OR pg.brand ILIKE $1
       ORDER BY pg.name ASC LIMIT 10`,
      [searchTerm]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/groups", async (req, res) => {
  try {
    const { name, name_en, brand, category_id, description, image } = req.body;
    if (!name || !brand) return res.status(400).json({ error: "Name and brand required" });

    const existing = await pool.query(
      "SELECT id FROM product_groups WHERE LOWER(TRIM(name))=LOWER(TRIM($1)) AND LOWER(TRIM(brand))=LOWER(TRIM($2))",
      [name, brand]
    );
    if (existing.rows.length > 0) return res.status(409).json({ error: "duplicate_group", existing: existing.rows[0] });

    const result = await pool.query(
      "INSERT INTO product_groups (name, name_en, brand, category_id, description, image) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [name.trim(), name_en || null, brand.trim(), category_id || null, description || null, image || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/groups/:id", async (req, res) => {
  try {
    const group = await pool.query(
      `SELECT pg.*, c.name AS category_name, COALESCE(c.name_en, c.name) AS category_name_en
       FROM product_groups pg LEFT JOIN categories c ON pg.category_id = c.id WHERE pg.id = $1`,
      [req.params.id]
    );
    if (group.rows.length === 0) return res.status(404).json({ error: "Not found" });

    const variants = await pool.query(
      `WITH product_prices AS (SELECT product_id, MIN(price) AS best_price FROM prices GROUP BY product_id)
       SELECT p.id, p.name, p.image, p.variant_label, p.variant_storage, p.variant_color,
              p.variant_edition, p.variant_size, p.status, pp.best_price
       FROM products p LEFT JOIN product_prices pp ON p.id = pp.product_id
       WHERE p.group_id = $1 AND p.status = 'approved'
       ORDER BY p.variant_storage ASC, p.variant_color ASC`,
      [req.params.id]
    );

    res.json({
      group: group.rows[0],
      variants: variants.rows,
      options: {
        storages:  [...new Set(variants.rows.map(v => v.variant_storage).filter(Boolean))],
        colors:    [...new Set(variants.rows.map(v => v.variant_color).filter(Boolean))],
        editions:  [...new Set(variants.rows.map(v => v.variant_edition).filter(Boolean))],
        sizes:     [...new Set(variants.rows.map(v => v.variant_size).filter(Boolean))],
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   CREATE PRODUCT
============================================================ */
router.post("/", async (req, res) => {
  try {
    const { name, brand, category_id, description, image, store_id, status,
            group_id, variant_storage, variant_color, variant_edition, variant_size, force_create } = req.body;

    const baseName    = name?.trim();
    const variantLabel = buildVariantLabel(baseName, variant_storage, variant_color, variant_edition, variant_size);

    if (!force_create) {
      const existing = await pool.query(
        `SELECT p.id, p.name, p.variant_label, MIN(pr.price) AS best_price,
                array_agg(DISTINCT s.name) AS stores
         FROM products p LEFT JOIN prices pr ON p.id = pr.product_id LEFT JOIN stores s ON pr.store_id = s.id
         WHERE LOWER(TRIM(p.variant_label)) = LOWER(TRIM($1)) GROUP BY p.id`,
        [variantLabel]
      );
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: "duplicate", message: "هذا المنتج موجود مسبقاً", existing: existing.rows[0] });
      }
    }

    const result = await pool.query(
      `INSERT INTO products (name, brand, category_id, description, image, store_id, status,
         group_id, variant_storage, variant_color, variant_edition, variant_size, variant_label)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [baseName, brand?.trim(), category_id || null, description, image,
       store_id || null, status || "approved", group_id || null,
       variant_storage || null, variant_color || null, variant_edition || null,
       variant_size || null, variantLabel]
    );

    if (status === "pending") {
      await pool.query(
        "INSERT INTO admin_notifications (type, message, related_id, related_type) VALUES ($1,$2,$3,$4)",
        ["new_product", `منتج جديد بانتظار الموافقة: ${variantLabel}`, result.rows[0].id, "product"]
      );
    }
    await invalidateProductCaches();
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   GET SINGLE PRODUCT
============================================================ */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE products SET views = views + 1 WHERE id=$1", [id]);
    await pool.query(
      "UPDATE product_groups SET views = views + 1 WHERE id = (SELECT group_id FROM products WHERE id=$1)", [id]
    );

    const result = await pool.query(
      `WITH product_prices AS (SELECT product_id, MIN(price) AS best_price FROM prices GROUP BY product_id)
       SELECT p.*, c.name AS category_name, COALESCE(c.name_en, c.name) AS category_name_en,
              pg.name AS group_name, pg.id AS group_id_ref, pp.best_price
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN product_groups pg ON p.group_id = pg.id
       LEFT JOIN product_prices pp ON p.id = pp.product_id
       WHERE p.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });

    const product = result.rows[0];
    let siblings = [];
    if (product.group_id) {
      const sibs = await pool.query(
        `WITH product_prices AS (SELECT product_id, MIN(price) AS best_price FROM prices GROUP BY product_id)
         SELECT p.id, p.variant_label, p.variant_storage, p.variant_color, p.variant_edition,
                p.variant_size, p.image, pp.best_price
         FROM products p LEFT JOIN product_prices pp ON p.id = pp.product_id
         WHERE p.group_id = $1 AND p.id != $2 AND p.status = 'approved'
         ORDER BY p.variant_storage ASC, p.variant_color ASC`,
        [product.group_id, id]
      );
      siblings = sibs.rows;
    }
    res.json({ ...product, siblings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── UPDATE PRODUCT ── */
router.put("/:id", async (req, res) => {
  try {
    const { name, brand, category_id, description, image,
            variant_storage, variant_color, variant_edition, variant_size } = req.body;
    const variantLabel = buildVariantLabel(name, variant_storage, variant_color, variant_edition, variant_size);

    const result = await pool.query(
      `UPDATE products SET name=$1, brand=$2, category_id=$3, description=$4, image=$5,
         variant_storage=$6, variant_color=$7, variant_edition=$8, variant_size=$9, variant_label=$10
       WHERE id=$11 RETURNING *`,
      [name?.trim(), brand?.trim(), category_id || null, description, image,
       variant_storage || null, variant_color || null, variant_edition || null,
       variant_size || null, variantLabel, req.params.id]
    );
    await invalidateProductCaches();
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── DELETE PRODUCT ── */
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id=$1", [req.params.id]);
    await invalidateProductCaches();
    res.json({ message: "deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── SIMILAR PRODUCTS ── */
router.get("/:id/similar", async (req, res) => {
  try {
    const product = await pool.query("SELECT category_id, group_id, brand FROM products WHERE id=$1", [req.params.id]);
    if (product.rows.length === 0) return res.json([]);

    const { category_id, group_id, brand } = product.rows[0];

    if (group_id) {
      const siblings = await pool.query(
        `WITH product_prices AS (SELECT product_id, MIN(price) AS best_price FROM prices GROUP BY product_id)
         SELECT p.id, p.name, p.image, p.variant_label, pp.best_price
         FROM products p LEFT JOIN product_prices pp ON p.id = pp.product_id
         WHERE p.group_id=$1 AND p.id!=$2 AND p.status='approved' LIMIT 4`,
        [group_id, req.params.id]
      );
      if (siblings.rows.length > 0) return res.json(siblings.rows);
    }

    const result = await pool.query(
      `WITH product_prices AS (SELECT product_id, MIN(price) AS best_price FROM prices GROUP BY product_id)
       SELECT p.id, p.name, p.image, p.variant_label, pp.best_price
       FROM products p LEFT JOIN product_prices pp ON p.id = pp.product_id
       WHERE p.category_id=$1 AND p.brand=$2 AND p.id!=$3 AND p.status='approved' LIMIT 4`,
      [category_id, brand, req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── PRICE ALERT ── */
router.post("/:id/alert", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "login_required" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    const { target_price } = req.body;
    if (!target_price) return res.status(400).json({ error: "Target price required" });

    const existing = await pool.query(
      "SELECT id FROM price_alerts WHERE product_id=$1 AND user_id=$2 AND is_triggered=false",
      [req.params.id, decoded.id]
    );
    if (existing.rows.length > 0) {
      await pool.query("UPDATE price_alerts SET target_price=$1 WHERE id=$2", [target_price, existing.rows[0].id]);
      return res.json({ message: "Alert updated" });
    }
    const result = await pool.query(
      "INSERT INTO price_alerts (product_id, user_id, target_price) VALUES ($1,$2,$3) RETURNING *",
      [req.params.id, decoded.id, target_price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── REVIEWS ── */
router.get("/:id/reviews", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT rating, comment, created_at FROM reviews WHERE product_id=$1 ORDER BY created_at DESC",
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/:id/review", async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const result = await pool.query(
      "INSERT INTO reviews (product_id, rating, comment) VALUES ($1,$2,$3) RETURNING *",
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
      "SELECT AVG(rating) AS average, COUNT(*) AS total FROM reviews WHERE product_id=$1",
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── SPECS ── */
router.get("/:id/specs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM product_specs WHERE product_id=$1 ORDER BY id", [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/:id/specs", async (req, res) => {
  try {
    const { specs } = req.body;
    if (!Array.isArray(specs)) return res.status(400).json({ error: "specs must be array" });
    await pool.query("DELETE FROM product_specs WHERE product_id=$1", [req.params.id]);
    for (const spec of specs) {
      if (spec.key && spec.value?.trim()) {
        await pool.query(
          "INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES ($1,$2,$3)",
          [req.params.id, spec.key, spec.value.trim()]
        );
      }
    }
    const result = await pool.query("SELECT * FROM product_specs WHERE product_id=$1 ORDER BY id", [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── IMAGES ── */
router.post("/:id/image", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = "/uploads/" + req.file.filename;
    await pool.query("INSERT INTO product_images (product_id, image_url) VALUES ($1,$2)", [req.params.id, imageUrl]);
    res.json({ message: "uploaded", image: imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/:id/main-image", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = "/uploads/" + req.file.filename;
    await pool.query("UPDATE products SET image=$1 WHERE id=$2", [imageUrl, req.params.id]);
    res.json({ message: "main image updated", image: imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/:id/images", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM product_images WHERE product_id=$1", [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── RESUBMIT ── */
router.put("/:id/resubmit", async (req, res) => {
  try {
    const { name, brand, description, category_id } = req.body;
    const result = await pool.query(
      `UPDATE products SET status='pending', name=COALESCE($1,name), brand=COALESCE($2,brand),
         description=COALESCE($3,description), category_id=COALESCE($4,category_id), reject_reason=NULL
       WHERE id=$5 AND status='rejected' RETURNING *`,
      [name, brand, description, category_id, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found or not rejected" });

    await pool.query(
      "INSERT INTO admin_notifications (type, message, related_id, related_type) VALUES ($1,$2,$3,$4)",
      ["product_resubmitted", `تم إعادة إرسال المنتج "${result.rows[0].name}" للمراجعة`, req.params.id, "product"]
    );
    res.json({ message: "Resubmitted", product: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/:id/reject-reason", async (req, res) => {
  try {
    const result = await pool.query("SELECT reject_reason FROM products WHERE id=$1", [req.params.id]);
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── BULK UPLOAD ── */
const multerXlsx = require("multer")({ storage: require("multer").memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const XLSX = require("xlsx");

router.post("/bulk-upload", multerXlsx.single("file"), async (req, res) => {
  try {
    const storeId = req.body.store_id;
    if (!storeId || !req.file) return res.status(400).json({ error: "store_id and file required" });

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const results = { success: [], errors: [], total: 0 };

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const rows  = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
      let categoryId = null;
      if (rows[2]?.[0] && String(rows[2][0]).startsWith("category_id:")) {
        categoryId = String(rows[2][0]).replace("category_id:", "").split("_")[0];
      }
      for (let i = 5; i < rows.length; i++) {
        const row = rows[i];
        const name    = String(row[0] || "").trim();
        const brand   = String(row[1] || "").trim();
        const priceRaw = String(row[2] || "").trim();
        const desc    = String(row[3] || "").trim();
        const image   = String(row[4] || "").trim();
        const storage = String(row[5] || "").trim() || null;
        const color   = String(row[6] || "").trim() || null;
        const edition = String(row[7] || "").trim() || null;
        if (!name || !brand) continue;
        results.total++;
        const price = parseFloat(priceRaw.replace(/[^0-9.]/g, ""));
        if (isNaN(price) || price <= 0) { results.errors.push({ row: i + 1, name, error: "سعر غير صحيح" }); continue; }
        const variantLabel = buildVariantLabel(name, storage, color, edition, null);
        const existing = await pool.query(
          "SELECT id FROM products WHERE LOWER(TRIM(variant_label))=LOWER(TRIM($1))", [variantLabel]
        );
        try {
          let productId;
          if (existing.rows.length > 0) {
            productId = existing.rows[0].id;
          } else {
            const pr = await pool.query(
              `INSERT INTO products (name, brand, category_id, description, image, store_id, status,
                 variant_storage, variant_color, variant_edition, variant_label)
               VALUES ($1,$2,$3,$4,$5,$6,'pending',$7,$8,$9,$10) RETURNING id`,
              [name, brand, categoryId || null, desc || null, image || null, storeId, storage, color, edition, variantLabel]
            );
            productId = pr.rows[0].id;
            await pool.query(
              "INSERT INTO admin_notifications (type, message, related_id, related_type) VALUES ($1,$2,$3,$4)",
              ["new_product", `منتج جديد: ${variantLabel}`, productId, "product"]
            );
          }
          await pool.query(
            `INSERT INTO prices (product_id, store_id, price) VALUES ($1,$2,$3)
             ON CONFLICT (product_id, store_id) DO UPDATE SET price=$3`,
            [productId, storeId, price]
          );
          await pool.query("INSERT INTO price_history (product_id, store_id, price) VALUES ($1,$2,$3)", [productId, storeId, price]);
          results.success.push({ name: variantLabel, productId });
        } catch (err) {
          results.errors.push({ row: i + 1, name, error: err.message });
        }
      }
    }
    res.json({
      message: `${results.success.length} منتج بنجاح، ${results.errors.length} أخطاء`,
      success: results.success.length,
      errors: results.errors.length,
      errorDetails: results.errors,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── PRICE CHECK ── */
router.get("/price-check/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { paid_price } = req.query;
    const product = await pool.query(
      "SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id=c.id WHERE p.id=$1", [id]
    );
    if (product.rows.length === 0) return res.status(404).json({ error: "Not found" });

    const prices = await pool.query(
      `SELECT pr.price, s.id as store_id, s.name AS store_name FROM prices pr JOIN stores s ON pr.store_id=s.id
       WHERE pr.product_id=$1 ORDER BY pr.price ASC`, [id]
    );
    const p = product.rows[0];
    const priceList = prices.rows;
    const lowestPrice = priceList.length > 0 ? Number(priceList[0].price) : null;
    const paidNum = paid_price ? Number(paid_price) : null;
    let verdict = null, savedAmount = null, lostAmount = null, cheaperStore = null;
    if (paidNum && lowestPrice) {
      if (paidNum <= lowestPrice) { verdict = "great"; savedAmount = 0; }
      else if (paidNum <= lowestPrice * 1.05) { verdict = "good"; savedAmount = paidNum - lowestPrice; }
      else { verdict = "overpaid"; lostAmount = paidNum - lowestPrice; cheaperStore = priceList[0]?.store_name; }
    }
    res.json({
      product: { id: p.id, name: p.variant_label || p.name, image: p.image, brand: p.brand },
      prices: priceList, lowest_price: lowestPrice, paid_price: paidNum,
      verdict, saved_amount: savedAmount, lost_amount: lostAmount, cheaper_store: cheaperStore,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;