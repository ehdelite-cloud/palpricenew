let redis = null;
let enabled = false;

async function connectRedis() {
  // Redis disabled - not installed on this machine
  enabled = false;
  redis = null;
  console.log("⚠️ Redis disabled - running without cache");
}

function isEnabled() { return false; }
async function safeGet(key) { return null; }
async function safeSet(key, value, options = {}) {}
async function safeKeys(pattern) { return []; }
async function safeDel(keys) {}

module.exports = { connectRedis, safeGet, safeSet, safeKeys, safeDel };