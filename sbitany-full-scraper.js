/**
 * sbitany-full-scraper.js
 * يسحب السعر + المواصفات + الصور لكل منتجات سبيتاني
 * الاستخدام: node sbitany-full-scraper.js
 */

const puppeteer = require("puppeteer");
const pool      = require("./db/db");

const DELAY_MS   = 1200;
const BATCH_SIZE = 10;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("   🔍 Sbitany Full Scraper");
  console.log("   السعر + المواصفات + الصور");
  console.log("═══════════════════════════════════════\n");

  // جلب كل منتجات سبيتاني
  const result = await pool.query(`
    SELECT id, name, variant_label, image
    FROM products
    WHERE store_id = 8
    ORDER BY id
    LIMIT 500
  `);

  const products = result.rows;
  console.log(`📦 ${products.length} منتج\n`);

  // افتح المتصفح
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
  });
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36");
  await page.setViewport({ width: 1280, height: 800 });
  page.on("dialog", async d => { await d.dismiss(); });

  let pricesUpdated = 0;
  let specsAdded    = 0;
  let failed        = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const name = (product.variant_label || product.name || "").substring(0, 45);
    process.stdout.write(`  [${i+1}/${products.length}] ${name.padEnd(45)} `);

    try {
      // ابنِ رابط البحث
      const searchName = (product.variant_label || product.name || "").split(" ").slice(0, 3).join(" ");
      const searchUrl = `https://sbitany.com/index.php?route=product/search&search=${encodeURIComponent(searchName)}&limit=1`;

      await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 20000 });
      await sleep(500);

      // روح على أول منتج في نتائج البحث
      const firstLink = await page.$(".product-layout .name a, .product-thumb .name a");
      if (firstLink) {
        await firstLink.click();
        await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 });
        await sleep(700);
      }

      // اسحب البيانات
      const data = await page.evaluate(() => {
        const result = { price: null, specs: {}, images: [] };

        // السعر
        for (const sel of [".price-new", "span.price-new", ".price"]) {
          const el = document.querySelector(sel);
          if (el) {
            const val = parseInt(el.innerText.replace(/[^\d]/g, ""));
            if (val > 10 && val < 100000) { result.price = val; break; }
          }
        }

        // المواصفات من جدول
        document.querySelectorAll("table tr, #tab-specification tr").forEach(row => {
          const cells = row.querySelectorAll("td");
          if (cells.length >= 2) {
            const k = cells[0].innerText.trim();
            const v = cells[1].innerText.trim();
            if (k && v && k.length < 80 && v.length < 300 && !k.includes("₪")) {
              result.specs[k] = v;
            }
          }
        });

        // مواصفات من dl
        document.querySelectorAll("dt").forEach(dt => {
          const dd = dt.nextElementSibling;
          if (dd?.tagName === "DD") {
            const k = dt.innerText.trim();
            const v = dd.innerText.trim();
            if (k && v) result.specs[k] = v;
          }
        });

        // الصور
        document.querySelectorAll("#content img, .thumbnails img, .product-image img").forEach(img => {
          const src = img.src || "";
          if (src.includes("image/cache") && !src.includes("no_image") && !src.includes("logo")) {
            if (!result.images.includes(src)) result.images.push(src);
          }
        });

        return result;
      });

      const updated = [];

      // تحديث السعر
      if (data.price && data.price > 0) {
        await pool.query(
          `INSERT INTO prices (product_id, store_id, price)
           VALUES ($1, 8, $2)
           ON CONFLICT (product_id, store_id) DO UPDATE SET price=$2`,
          [product.id, data.price]
        );
        await pool.query(
          `INSERT INTO price_history (product_id, store_id, price) VALUES ($1, 8, $2)`,
          [product.id, data.price]
        );
        pricesUpdated++;
        updated.push(`💰${data.price}₪`);
      }

      // حفظ المواصفات
      const specsEntries = Object.entries(data.specs).filter(([k, v]) => k && v && k.length < 100 && v.length < 500);
      if (specsEntries.length > 0) {
        await pool.query("DELETE FROM product_specs WHERE product_id=$1", [product.id]);
        for (const [key, value] of specsEntries) {
          await pool.query(
            `INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
            [product.id, key, value]
          ).catch(() => {});
        }
        specsAdded++;
        updated.push(`📋${specsEntries.length}`);
      }

      // تحديث الصورة الرئيسية إذا ما فيها
      if (!product.image && data.images[0]) {
        await pool.query("UPDATE products SET image=$1 WHERE id=$2", [data.images[0], product.id]);
        updated.push(`🖼️`);
      }

      console.log(updated.length > 0 ? `✅ ${updated.join(" ")}` : `⚠️  لا بيانات`);

    } catch (err) {
      console.log(`❌ ${err.message.substring(0, 40)}`);
      failed++;
    }

    await sleep(DELAY_MS);

    if ((i + 1) % BATCH_SIZE === 0) {
      console.log(`\n  ⏸️  استراحة...\n`);
      await sleep(3000);
    }
  }

  await browser.close();

  console.log(`\n═══════════════════════════════════════`);
  console.log(`💰 أسعار محدّثة:    ${pricesUpdated}`);
  console.log(`📋 منتجات بمواصفات: ${specsAdded}`);
  console.log(`❌ فشل:             ${failed}`);
  console.log(`═══════════════════════════════════════`);

  await pool.end();
}

main().catch(async err => {
  console.error("❌ خطأ عام:", err.message);
  await pool.end();
  process.exit(1);
});