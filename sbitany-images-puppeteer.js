/**
 * sbitany-images-puppeteer.js
 * يجيب صور حقيقية لمنتجات سبيتاني باستخدام Puppeteer
 * الاستخدام: node sbitany-images-puppeteer.js
 */

const puppeteer = require("puppeteer");
const pool      = require("./db/db");

const DELAY_MS = 1500;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("   🖼️  Sbitany Images (Puppeteer)");
  console.log("═══════════════════════════════════════\n");

  // جلب المنتجات بدون صور
  const result = await pool.query(`
    SELECT id, name, variant_label
    FROM products
    WHERE store_id = 8
      AND (image IS NULL OR image = '')
    ORDER BY id
    LIMIT 300
  `);

  console.log(`📦 ${result.rows.length} منتج بدون صورة\n`);

  if (result.rows.length === 0) {
    console.log("✅ كل المنتجات عندها صور!");
    await pool.end();
    return;
  }

  // فتح المتصفح
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
  });

  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36");
  await page.setViewport({ width: 1280, height: 800 });

  let updated = 0;
  let failed  = 0;

  for (const product of result.rows) {
    const name = (product.variant_label || product.name).trim();
    // خذ أول 3-4 كلمات للبحث
    const searchName = name.split(" ").slice(0, 4).join(" ");

    process.stdout.write(`  🔍 ${searchName.substring(0, 45).padEnd(45)} `);

    try {
      const searchUrl = `https://sbitany.com/index.php?route=product/search&search=${encodeURIComponent(searchName)}&limit=5`;
      await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 15000 });
      await sleep(800);

      // جرب تجيب الصورة
      const imgUrl = await page.evaluate(() => {
        const selectors = [
          ".product-layout img",
          ".product-thumb img",
          ".image-container img",
          "img[src*='image/cache']"
        ];
        for (const sel of selectors) {
          const el = document.querySelector(sel);
          if (el) {
            const src = el.src || el.getAttribute("data-src") || el.getAttribute("data-original") || "";
            if (src && src.includes("http") && !src.includes("no_image") && !src.includes("logo") && !src.includes("svg")) {
              return src;
            }
          }
        }
        return null;
      });

      if (imgUrl) {
        await pool.query("UPDATE products SET image=$1 WHERE id=$2", [imgUrl, product.id]);
        console.log(`✅`);
        updated++;
      } else {
        // جرب البحث بكلمة واحدة فقط (الماركة)
        const brandOnly = name.split(" ").slice(0, 2).join(" ");
        const brandUrl  = `https://sbitany.com/index.php?route=product/search&search=${encodeURIComponent(brandOnly)}&limit=3`;
        await page.goto(brandUrl, { waitUntil: "domcontentloaded", timeout: 10000 });
        await sleep(500);

        const imgUrl2 = await page.evaluate(() => {
          const el = document.querySelector(".product-layout img, .product-thumb img");
          if (el) {
            const src = el.src || "";
            if (src.includes("http") && !src.includes("no_image") && !src.includes("svg")) return src;
          }
          return null;
        });

        if (imgUrl2) {
          await pool.query("UPDATE products SET image=$1 WHERE id=$2", [imgUrl2, product.id]);
          console.log(`✅ (brand)`);
          updated++;
        } else {
          console.log(`❌`);
          failed++;
        }
      }
    } catch (err) {
      console.log(`❌ (${err.message.substring(0, 30)})`);
      failed++;
    }

    await sleep(DELAY_MS);
  }

  await browser.close();

  console.log(`\n═══════════════════════════════════════`);
  console.log(`✅ تم تحديث ${updated} صورة`);
  console.log(`❌ فشل ${failed} منتج`);
  console.log(`═══════════════════════════════════════`);

  await pool.end();
}

main().catch(async err => {
  console.error("❌ خطأ عام:", err.message);
  await pool.end();
  process.exit(1);
});