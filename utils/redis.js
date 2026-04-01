const { createClient } = require("redis");

let client  = null;
let enabled = false;

async function connectRedis() {
  const url = process.env.REDIS_URL || "redis://localhost:6379";

  try {
    client = createClient({
      url,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries >= 3) {
            // بعد 3 محاولات نوقف ونشغّل بدون cache
            enabled = false;
            client = null;
            console.warn("[Redis] Giving up after 3 retries — running without cache");
            return false; // false = stop retrying
          }
          return Math.min(retries * 200, 1000);
        },
      },
    });

    client.on("error", (err) => {
      // Log once but don't crash — Redis is optional for performance, not correctness
      if (enabled) console.warn("[Redis] Connection error:", err.message);
    });

    client.on("reconnecting", () => {
      if (process.env.NODE_ENV !== "production") console.log("[Redis] Reconnecting...");
    });

    await client.connect();
    enabled = true;
    console.log("[Redis] Connected:", url);
  } catch (err) {
    enabled = false;
    client  = null;
    console.warn("[Redis] Unavailable — running without cache:", err.message);
  }
}

function isEnabled() { return enabled; }

async function safeGet(key) {
  if (!enabled || !client) return null;
  try { return await client.get(key); }
  catch { return null; }
}

async function safeSet(key, value, ttlSeconds = 60) {
  if (!enabled || !client) return;
  try { await client.set(key, value, { EX: ttlSeconds }); }
  catch {}
}

async function safeKeys(pattern) {
  if (!enabled || !client) return [];
  try { return await client.keys(pattern); }
  catch { return []; }
}

async function safeDel(keys) {
  if (!enabled || !client || !keys || keys.length === 0) return;
  try { await client.del(keys); }
  catch {}
}

module.exports = { connectRedis, isEnabled, safeGet, safeSet, safeKeys, safeDel };
