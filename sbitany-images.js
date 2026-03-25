/**
 * sbitany-images.js — يجيب صور منتجات سبيتاني من موقعهم
 * الاستخدام: node sbitany-images.js
 */

const axios   = require("axios");
const cheerio = require("cheerio");
const pool    = require("./db/db");

const BASE_URL = "https://sbitany.com";
const DELAY_MS = 1000;

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  "Accept-Language": "ar,en;q=0.9",
};

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchPage(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.get(url, { headers: HEADERS, timeout: 15000 });
      return res.data;
    } catch {
      if (i < retries - 1) await sleep(2000);
    }
  }
  return null;
}

// ابحث عن المنتج في سبيتاني وجيب صورته
async function findProductImage(productName) {
  const searchUrl = `${BASE_URL}/index.php?route=product/search&search=${encodeURIComponent(productName)}&limit=3`;
  const html = await fetchPage(searchUrl);
  if (!html) return null;

  const $ = cheerio.load(html);

  // جرب تجيب صورة من نتائج البحث
  let imgUrl = null;

  // طريقة 1: صورة المنتج في نتائج البحث
  $(".product-layout img, .product-thumb img").first().each((i, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src") || $(el).attr("data-original");
    if (src && src.includes("image/cache") && !src.includes("no_image")) {
      imgUrl = src.startsWith("http") ? src : BASE_URL + src;
    }
  });

  // طريقة 2: أي صورة فيها cache
  if (!imgUrl) {
    $("img").each((i, el) => {
      if (imgUrl) return;
      const src = $(el).attr("src") || "";
      if (src.includes("image/cache") && !src.includes("no_image") && !src.includes("logo")) {
        imgUrl = src.startsWith("http") ? src : BASE_URL + src;
      }
    });
  }

  return imgUrl;
}

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("   🖼️  Sbitany Images Scraper");
  console.log("═══════════════════════════════════════\n");

  // جلب المنتجات بدون صور من سبيتاني
  const result = await pool.query(`
    SELECT id, name, variant_label 
    FROM products 
    WHERE store_id = 8 
      AND (image IS NULL OR image = '')
    ORDER BY id
    LIMIT 300
  `);

  console.log(`📦 ${result.rows.length} منتج بدون صورة\n`);

  let updated = 0;
  let failed  = 0;

  for (const product of result.rows) {
    const name = product.variant_label || product.name;
    // خذ أول 4 كلمات للبحث
    const searchName = name.split(" ").slice(0, 4).join(" ");

    process.stdout.write(`  🔍 ${searchName.substring(0, 50)}... `);

    const imgUrl = await findProductImage(searchName);

    if (imgUrl) {
      await pool.query(
        "UPDATE products SET image=$1 WHERE id=$2",
        [imgUrl, product.id]
      );
      console.log(`✅`);
      updated++;
    } else {
      console.log(`❌`);
      failed++;
    }

    await sleep(DELAY_MS);
  }

  console.log(`\n═══════════════════════════════════════`);
  console.log(`✅ تم تحديث ${updated} صورة`);
  console.log(`❌ فشل ${failed} منتج`);
  console.log(`═══════════════════════════════════════`);

  await pool.end();
}

main().catch(err => {
  console.error("❌ خطأ:", err.message);
  pool.end();
});