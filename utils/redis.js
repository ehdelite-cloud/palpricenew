const { createClient } = require("redis");

let redis = null;
let enabled = false;

async function connectRedis() {
  try {
    redis = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    redis.on("error", (err) => {
      console.log("Redis Error:", err?.message || err);
    });

    await redis.connect();
    enabled = true;

    console.log("✅ Redis connected");
  } catch (err) {
    enabled = false;
    redis = null;
    console.log("⚠️ Redis disabled:", err?.message || err);
  }
}

function isEnabled() {
  return enabled && redis && redis.isOpen;
}

async function safeGet(key) {
  if (!isEnabled()) return null;
  try {
    return await redis.get(key);
  } catch {
    return null;
  }
}

async function safeSet(key, value, options = {}) {
  if (!isEnabled()) return;
  try {
    await redis.set(key, value, options);
  } catch {}
}

async function safeKeys(pattern) {
  if (!isEnabled()) return [];
  try {
    return await redis.keys(pattern);
  } catch {
    return [];
  }
}

async function safeDel(keys) {
  if (!isEnabled()) return;
  try {
    if (Array.isArray(keys)) {
      if (keys.length > 0) await redis.del(keys);
    } else {
      await redis.del(keys);
    }
  } catch {}
}

module.exports = {
  connectRedis,
  safeGet,
  safeSet,
  safeKeys,
  safeDel,
};