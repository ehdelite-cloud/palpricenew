const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const redis = require("../utils/redis");
/* ==============================
   HELPERS
============================== */
async function checkAndTriggerAlerts(productId) {
  try {
    const minPriceResult = await pool.query(
      "SELECT MIN(price) AS min_price FROM prices WHERE product_id=$1",
      [productId]
    );

    const minPriceRaw = minPriceResult.rows[0]?.min_price;
    const minPrice = minPriceRaw !== null && minPriceRaw !== undefined ? Number(minPriceRaw) : null;

    if (minPrice === null || Number.isNaN(minPrice)) return;

    const alerts = await pool.query(
      `SELECT *
       FROM price_alerts
       WHERE product_id=$1
         AND is_triggered=false
         AND user_id IS NOT NULL
         AND target_price >= $2`,
      [productId, minPrice]
    );

    if (alerts.rows.length === 0) return;

    const productResult = await pool.query(
      "SELECT name FROM products WHERE id=$1",
      [productId]
    );

    const productName = productResult.rows[0]?.name || "منتج";

    for (const alert of alerts.rows) {
      const notificationResult = await pool.query(
        `INSERT INTO user_notifications
         (user_id, type, title, message, link)
         VALUES ($1,$2,$3,$4,$5)
         RETURNING id`,
        [
          alert.user_id,
          "price_alert",
          `انخفض سعر ${productName}!`,
          `وصل السعر إلى ${minPrice} ₪ — أقل من هدفك ${alert.target_price} ₪`,
          `/product/${productId}`,
        ]
      );

      const notificationId = notificationResult.rows[0].id;

      if (global.io) {
        global.io.to(`user_${alert.user_id}`).emit("new_notification", {
          id: notificationId,
          user_id: alert.user_id,
          type: "price_alert",
          title: `انخفض سعر ${productName}!`,
          message: `وصل السعر إلى ${minPrice} ₪ — أقل من هدفك ${alert.target_price} ₪`,
          link: `/product/${productId}`,
          is_read: false,
          created_at: new Date(),
        });
      }

      await pool.query(
        "UPDATE price_alerts SET is_triggered=true, triggered_at=NOW() WHERE id=$1",
        [alert.id]
      );
    }
  } catch (err) {
    console.log("Alert check error:", err.message);
  }
}

async function deleteCacheByPattern(pattern) {
  try {
    const keys = await redis.safeKeys(pattern);
    if (keys.length > 0) {
      await redis.safeDel(keys);
    }
  } catch (err) {
    console.log("Redis delete pattern error:", err.message);
  }
}

async function invalidateProductCaches(productId) {
  try {
    await deleteCacheByPattern("products:*");
    await deleteCacheByPattern("search:*");
    await deleteCacheByPattern("trending:*");
    await deleteCacheByPattern("groups:*");
    await deleteCacheByPattern("product:*");
    await deleteCacheByPattern("similar:*");
    // إبطال cache الأسعار للمنتج المحدد
    if (productId) {
      await redis.safeDel([`prices:product:${productId}`, `prices:history:${productId}`]);
    }
  } catch (err) {
    console.log("Cache invalidation error:", err.message);
  }
}
/* ==============================
   ADD PRICE
============================== */
router.post("/", async (req, res) => {
  try {
    const { product_id, store_id, price } = req.body;
    console.log(`ADD_PRICE payload: ${JSON.stringify(req.body)}`);

    if (!product_id || !store_id || !price) {
      return res.status(400).json({ error: "product_id, store_id, price required" });
    }

    const productId = Number(product_id);
    const storeId = Number(store_id);
    const priceNum = Number(price);

    if (Number.isNaN(productId) || Number.isNaN(storeId) || Number.isNaN(priceNum)) {
      return res.status(400).json({ error: "product_id, store_id, price must be numbers" });
    }

    const productExists = await pool.query(
      "SELECT id FROM products WHERE id=$1",
      [productId]
    );
    if (productExists.rows.length === 0) {
      return res.status(400).json({ error: "Invalid product_id" });
    }

    const storeExists = await pool.query(
      "SELECT id FROM stores WHERE id=$1",
      [storeId]
    );
    if (storeExists.rows.length === 0) {
      return res.status(400).json({ error: "Invalid store_id" });
    }

    const existing = await pool.query(
      "SELECT id FROM prices WHERE product_id=$1 AND store_id=$2",
      [productId, storeId]
    );

    console.log(`Existing prices: ${existing.rows.length}`);

    let result;
    if (existing.rows.length > 0) {
      result = await pool.query(
        "UPDATE prices SET price=$1 WHERE product_id=$2 AND store_id=$3 RETURNING *",
        [priceNum, productId, storeId]
      );
    } else {
      result = await pool.query(
        "INSERT INTO prices (product_id, store_id, price) VALUES ($1,$2,$3) RETURNING *",
        [productId, storeId, priceNum]
      );
    }

    await pool.query(
      "INSERT INTO price_history (product_id, store_id, price) VALUES ($1,$2,$3)",
      [productId, storeId, priceNum]
    );

    await checkAndTriggerAlerts(productId);
    await invalidateProductCaches(productId);

    res.json(result.rows[0]);
  } catch (err) {
    console.log("Add price error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   UPDATE PRICE
============================== */
router.put("/:id", async (req, res) => {
  try {
    const { price } = req.body;
    const priceNum = Number(price);

    if (Number.isNaN(priceNum)) {
      return res.status(400).json({ error: "price must be a number" });
    }

    const result = await pool.query(
      "UPDATE prices SET price=$1 WHERE id=$2 RETURNING *",
      [priceNum, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    await pool.query(
      "INSERT INTO price_history (product_id, store_id, price) VALUES ($1,$2,$3)",
      [result.rows[0].product_id, result.rows[0].store_id, priceNum]
    );

    await checkAndTriggerAlerts(result.rows[0].product_id);
    await invalidateProductCaches(result.rows[0].product_id);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   PRICES FOR PRODUCT
============================== */
router.get("/product/:id", async (req, res) => {
  try {
    const cacheKey = `prices:product:${req.params.id}`;
    const cached = await redis.safeGet(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const result = await pool.query(
      `
      SELECT pr.id, pr.price, s.id AS store_id, s.name AS store_name,
s.logo AS store_logo, s.phone, s.whatsapp, s.instagram,
s.facebook, s.website, s.city, s.address
FROM prices pr JOIN stores s ON pr.store_id = s.id
WHERE pr.product_id = $1
ORDER BY pr.price ASC
    `,
      [req.params.id]
    );

    await redis.safeSet(cacheKey, JSON.stringify(result.rows), 120); // 2 دقيقة
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   PRICE HISTORY
============================== */
router.get("/history/:id", async (req, res) => {
  try {
    const cacheKey = `prices:history:${req.params.id}`;
    const cached = await redis.safeGet(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const result = await pool.query(
      `
      SELECT price, recorded_at AS date
      FROM price_history
      WHERE product_id = $1
      ORDER BY recorded_at ASC
    `,
      [req.params.id]
    );

    await redis.safeSet(cacheKey, JSON.stringify(result.rows), 300); // 5 دقائق
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   COMPETITION
============================== */
router.get("/competition", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT p.name AS product_name, s.name AS store_name, pr.price
      FROM prices pr
      JOIN products p ON pr.product_id = p.id
      JOIN stores s ON pr.store_id = s.id
      ORDER BY p.name, pr.price ASC
    `
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   DEALS — أكبر تخفيضات
============================== */
router.get("/deals", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        p.id, p.name, p.image,
        MIN(ph.price) AS lowest_price,
        MAX(ph.price) AS highest_price,
        (MAX(ph.price) - MIN(ph.price)) AS discount
      FROM price_history ph
      JOIN products p ON ph.product_id = p.id
      WHERE p.status = 'approved'
      GROUP BY p.id, p.name, p.image
      HAVING MAX(ph.price) > MIN(ph.price)
      ORDER BY discount DESC
      LIMIT 20
    `
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;