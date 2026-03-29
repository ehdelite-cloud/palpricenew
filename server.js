const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

// ✅ التحقق من المتغيرات الضرورية عند البدء
const REQUIRED_ENV = ["JWT_SECRET", "ANTHROPIC_API_KEY"];
REQUIRED_ENV.forEach((key) => {
  if (!process.env[key]) {
    console.error(`FATAL: Missing required env variable: ${key}`);
    process.exit(1);
  }
});

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
const { authAdmin } = require("./middleware/auth");
const { connectRedis } = require("./utils/redis");

const app = express();
const server = http.createServer(app);

/* ========================= SOCKET.IO ========================= */
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
global.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("join", (data = {}) => {
    if (data.userId) socket.join(`user_${data.userId}`);
    else if (data.storeId) socket.join(`store_${data.storeId}`);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* ========================= AI MODELS ========================= */
function loadAiModels() {
  return {
    claude_chat: process.env.AI_MODEL_CLAUDE_CHAT || "claude-sonnet-4-20250514",
    claude_lookup: process.env.AI_MODEL_CLAUDE_LOOKUP || "claude-sonnet-4-20250514",
  };
}
global.AI_MODELS = loadAiModels();

/* ========================= MIDDLEWARE ========================= */
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173").split(",");

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    // في التطوير نسمح بكل شيء
    if (process.env.NODE_ENV !== "production") return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

/* ========================= AI ROUTES (محمية) ========================= */
app.get("/ai/models", authAdmin, (req, res) => {
  res.json(global.AI_MODELS);
});

app.post("/ai/reload-models", authAdmin, (req, res) => {
  global.AI_MODELS = loadAiModels();
  res.json({ message: "Reloaded", models: global.AI_MODELS });
});

/* ========================= AI CHAT PROXY ========================= */
app.post("/ai/chat", async (req, res) => {
  try {
    const { messages, model } = req.body;
    if (!Array.isArray(messages) || messages.length === 0)
      return res.status(400).json({ error: "messages array required" });

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
    if (!response.ok)
      return res.status(response.status).json({ error: data?.error?.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ========================= AI PRODUCT LOOKUP ========================= */
app.post("/ai/product-lookup", async (req, res) => {
  try {
    const { productName, model } = req.body;
    if (!productName?.trim())
      return res.status(400).json({ error: "productName required" });

    const prompt = `أنت خبير في مواصفات الأجهزة الإلكترونية. المستخدم يريد إضافة منتج اسمه: "${productName}" أجب فقط بـ JSON صحيح بدون أي نص إضافي أو backticks، بهذا الشكل الدقيق: { "name": "الاسم الكامل الصحيح للمنتج بالإنجليزي", "name_ar": "الاسم بالعربي إن وجد", "brand": "الماركة", "category_id": رقم من 1 إلى 8, "category_name": "اسم الفئة", "description": "وصف احترافي للمنتج بالعربي في جملتين", "image_url": "", "specs": { "processor": "", "ram": "", "storage": "", "main_camera": "", "front_camera": "", "battery": "", "screen_size": "", "screen_type": "", "os": "", "connectivity": "", "sim": "", "colors": "", "gpu": "", "weight": "", "ports": "", "screen_res": "", "type": "", "anc": "", "waterproof": "", "microphone": "", "charging": "", "resolution": "", "refresh_rate": "", "panel_type": "", "response_time": "", "brightness": "" }, "confidence": "high/medium/low", "note": "" } الفئات: 1=موبايلات, 2=لابتوبات, 3=تابلت, 4=سماعات, 5=شاشات, 6=كاميرات, 7=أجهزة منزلية, 8=ملحقات`;

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
    if (!response.ok)
      return res.status(response.status).json({ error: data?.error?.message });

    const text = data.content?.map((c) => c.text || "").join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    try {
      res.json(JSON.parse(clean));
    } catch {
      res.status(500).json({ error: "Failed to parse AI response", raw: clean });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ========================= CHECK PRICE ALERTS ========================= */
app.post("/check-alerts/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const priceResult = await pool.query(
      `SELECT MIN(pr.price) AS min_price, p.name AS product_name
       FROM prices pr JOIN products p ON pr.product_id = p.id
       WHERE pr.product_id = $1 GROUP BY p.name`,
      [productId]
    );
    if (priceResult.rows.length === 0) return res.json({ triggered: 0 });

    const { min_price, product_name } = priceResult.rows[0];
    const alerts = await pool.query(
      `SELECT * FROM price_alerts
       WHERE product_id=$1 AND is_triggered=false AND user_id IS NOT NULL AND target_price>=$2`,
      [productId, min_price]
    );
    for (const alert of alerts.rows) {
      await pool.query(
        "INSERT INTO user_notifications (user_id, type, title, message, link) VALUES ($1,$2,$3,$4,$5)",
        [alert.user_id, "price_alert", `انخفض سعر ${product_name}!`,
          `وصل السعر إلى ${min_price} ₪ — أقل من هدفك ${alert.target_price} ₪`,
          `/product/${productId}`]
      );
      await pool.query(
        "UPDATE price_alerts SET is_triggered=true, triggered_at=NOW() WHERE id=$1",
        [alert.id]
      );
    }
    res.json({ triggered: alerts.rows.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ========================= DELETE IMAGE ========================= */
app.delete("/images/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM product_images WHERE id=$1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Image not found" });

    const imageUrl = result.rows[0].image_url;
    await pool.query("DELETE FROM product_images WHERE id=$1", [req.params.id]);
    if (imageUrl?.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, imageUrl.replace(/^\/+/, ""));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ message: "Image deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ========================= ROUTES ========================= */
app.use("/products", productsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/stores", storesRoutes);
app.use("/prices", pricesRoutes);
app.use("/users", usersRoutes);
app.use("/admin", adminRoutes);
app.use("/tickets", ticketsRoutes);
app.use("/coupons", couponsRouter);
app.use("/campaigns", campaignsRouter);

/* ========================= HEALTH CHECK ========================= */
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/* ========================= NOT FOUND ========================= */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ========================= ERROR HANDLER ========================= */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

/* ========================= START SERVER ========================= */
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await connectRedis();
  } catch (err) {
    console.log("⚠️ Redis not available, continuing without cache");
  }
  server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

startServer();