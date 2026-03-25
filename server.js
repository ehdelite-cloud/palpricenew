const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const pool = require("./db/db");

const productsRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");
const storesRoutes = require("./routes/stores");
const pricesRoutes = require("./routes/prices");
const usersRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
const ticketsRoutes = require("./routes/tickets");
const couponsRouter = require("./routes/coupons");
const campaignsRouter = require("./routes/campaigns");
const { connectRedis } = require("./utils/redis");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

global.io = io;

function loadAiModels() {
  return {
    claude_chat: process.env.AI_MODEL_CLAUDE_CHAT || "claude-sonnet-4-20250514",
    claude_lookup: process.env.AI_MODEL_CLAUDE_LOOKUP || "claude-sonnet-4-20250514",
  };
}

global.AI_MODELS = loadAiModels();

/* =========================
   SOCKET.IO
========================= */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (data = {}) => {
    if (data.userId) {
      socket.join(`user_${data.userId}`);
      console.log(`User ${data.userId} joined room`);
    } else if (data.storeId) {
      socket.join(`store_${data.storeId}`);
      console.log(`Store ${data.storeId} joined room`);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

/* =========================
   AI MODEL ADMIN
========================= */
app.get("/ai/models", (req, res) => {
  res.json(global.AI_MODELS);
});

app.post("/ai/reload-models", (req, res) => {
  global.AI_MODELS = loadAiModels();
  res.json({
    message: "AI model names reloaded",
    models: global.AI_MODELS,
  });
});

/* =========================
   DEBUG
========================= */
app.get("/debug-hello", (req, res) => {
  fs.appendFileSync("debug-server.log", "hit-debug-hello\n");
  res.json({ message: "hello" });
});

/* =========================
   ROUTES
========================= */
app.use("/products", productsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/stores", storesRoutes);
app.use("/prices", pricesRoutes);
app.use("/users", usersRoutes);
app.use("/admin", adminRoutes);
app.use("/tickets", ticketsRoutes);
app.use("/coupons", couponsRouter);
app.use("/campaigns", campaignsRouter);

/*
================================
CLAUDE AI PROXY
================================
*/
app.post("/ai/chat", async (req, res) => {
  try {
    const { messages, model } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array required" });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "ANTHROPIC_API_KEY is not configured" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model || global.AI_MODELS.claude_chat,
        max_tokens: 1000,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Anthropic API request failed",
        details: data,
      });
    }

    res.json(data);
  } catch (err) {
    console.log("AI error:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
================================
AI PRODUCT LOOKUP
================================
*/
app.post("/ai/product-lookup", async (req, res) => {
  try {
    const { productName, model } = req.body;

    if (!productName || !String(productName).trim()) {
      return res.status(400).json({ error: "productName required" });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "ANTHROPIC_API_KEY is not configured" });
    }

    const prompt = `أنت خبير في مواصفات الأجهزة الإلكترونية. المستخدم يريد إضافة منتج اسمه: "${productName}"

أجب فقط بـ JSON صحيح بدون أي نص إضافي أو backticks، بهذا الشكل الدقيق:
{
  "name": "الاسم الكامل الصحيح للمنتج بالإنجليزي",
  "name_ar": "الاسم بالعربي إن وجد",
  "brand": "الماركة",
  "category_id": رقم من 1 إلى 8,
  "category_name": "اسم الفئة",
  "description": "وصف احترافي للمنتج بالعربي في جملتين",
  "image_url": "",
  "specs": {
    "processor": "",
    "ram": "",
    "storage": "",
    "main_camera": "",
    "front_camera": "",
    "battery": "",
    "screen_size": "",
    "screen_type": "",
    "os": "",
    "connectivity": "",
    "sim": "",
    "colors": "",
    "gpu": "",
    "weight": "",
    "ports": "",
    "screen_res": "",
    "type": "",
    "anc": "",
    "waterproof": "",
    "microphone": "",
    "charging": "",
    "resolution": "",
    "refresh_rate": "",
    "panel_type": "",
    "response_time": "",
    "brightness": ""
  },
  "confidence": "high/medium/low",
  "note": "ملاحظة مختصرة إن كان المنتج غير معروف أو المعلومات غير مؤكدة"
}

الفئات: 1=موبايلات, 2=لابتوبات, 3=تابلت, 4=سماعات, 5=شاشات, 6=كاميرات, 7=أجهزة منزلية, 8=ملحقات

ملاحظات مهمة:
- اترك الحقول غير المنطقية للفئة فارغة تماماً ""
- إذا لم تعرف قيمة معينة اتركها ""
- confidence: high إذا المنتج معروف جداً، medium إذا متأكد نسبياً، low إذا غير متأكد
- أجب بـ JSON فقط بدون أي كلام آخر`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model || global.AI_MODELS.claude_lookup,
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Anthropic API request failed",
        details: data,
      });
    }

    const text = data.content?.map((c) => c.text || "").join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();

    try {
      const parsed = JSON.parse(clean);
      res.json(parsed);
    } catch (parseErr) {
      console.log("Product lookup JSON parse error:", parseErr.message);
      res.status(500).json({
        error: "Failed to parse AI response as JSON",
        raw: clean,
      });
    }
  } catch (err) {
    console.log("Product lookup error:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
================================
CHECK PRICE ALERTS
================================
*/
app.post("/check-alerts/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const priceResult = await pool.query(
      `SELECT MIN(pr.price) AS min_price, p.name AS product_name
       FROM prices pr
       JOIN products p ON pr.product_id = p.id
       WHERE pr.product_id = $1
       GROUP BY p.name`,
      [productId]
    );

    if (priceResult.rows.length === 0) {
      return res.json({ triggered: 0 });
    }

    const { min_price, product_name } = priceResult.rows[0];

    const alerts = await pool.query(
      `SELECT *
       FROM price_alerts
       WHERE product_id = $1
         AND is_triggered = false
         AND user_id IS NOT NULL
         AND target_price >= $2`,
      [productId, min_price]
    );

    for (const alert of alerts.rows) {
      await pool.query(
        "INSERT INTO user_notifications (user_id, type, title, message, link) VALUES ($1,$2,$3,$4,$5)",
        [
          alert.user_id,
          "price_alert",
          `انخفض سعر ${product_name}!`,
          `وصل السعر إلى ${min_price} ₪ — أقل من هدفك ${alert.target_price} ₪`,
          `/product/${productId}`,
        ]
      );

      await pool.query(
        "UPDATE price_alerts SET is_triggered=true, triggered_at=NOW() WHERE id=$1",
        [alert.id]
      );
    }

    res.json({ triggered: alerts.rows.length });
  } catch (err) {
    console.log("Check alerts error:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
================================
DELETE IMAGE
================================
*/
app.delete("/images/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM product_images WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    const imageUrl = result.rows[0].image_url;

    await pool.query("DELETE FROM product_images WHERE id=$1", [id]);

    if (imageUrl && imageUrl.startsWith("/uploads/")) {
      const relativePath = imageUrl.replace(/^\/+/, "");
      const filePath = path.join(__dirname, relativePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ message: "Image deleted", id });
  } catch (err) {
    console.log("Delete image error:", err);
    res.status(500).json({ error: err.message });
  }
});

/*
================================
TEST IMAGE
================================
*/
app.get("/test-image", (req, res) => {
  res.sendFile(path.join(__dirname, "uploads", "test.JPEG"));
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/* =========================
   NOT FOUND
========================= */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.log("Unhandled server error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

/*
================================
START SERVER
================================
*/
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await connectRedis();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.log("Server startup error:", err);
    process.exit(1);
  }
}

startServer();

