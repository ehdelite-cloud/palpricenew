/**
 * Sbitany Scraper — يجيب منتجات وأسعار من sbitany.com
 * الاستخدام: node sbitany-scraper.js
 * 
 * ما يفعله:
 * 1. يجيب كل الفئات من الموقع
 * 2. يدخل على كل فئة ويجيب المنتجات
 * 3. يحفظهم في قاعدة البيانات مع السعر
 * 4. يضيف متجر "سبيتاني" تلقائياً إذا غير موجود
 */

const axios   = require("axios");
const cheerio = require("cheerio");
const pool    = require("./db/db");

// ==============================
// إعدادات
// ==============================
const BASE_URL    = "https://sbitany.com";
const DELAY_MS    = 1500; // تأخير بين كل طلب (احترام السيرفر)
const MAX_PAGES   = 5;    // أقصى عدد صفحات لكل فئة
const MAX_PRODUCTS_PER_CAT = 50; // أقصى منتجات لكل فئة

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  "Accept-Language": "ar,en;q=0.9",
  "Accept": "text/html,application/xhtml+xml,application/xhtml"
};

// ==============================
// Helper: تأخير
// ==============================
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ==============================
// Helper: طلب HTTP مع retry
// ==============================
async function fetchPage(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.get(url, { headers: HEADERS, timeout: 15000 });
      return res.data;
    } catch (err) {
      console.log(`  ⚠️  retry ${i+1}/${retries} — ${url}`);
      if (i < retries - 1) await sleep(2000);
    }
  }
  return null;
}

// ==============================
// جلب أو إنشاء متجر سبيتاني
// ==============================
async function getOrCreateStore() {
  const existing = await pool.query(
    "SELECT id FROM stores WHERE name ILIKE '%سبيتاني%' OR name ILIKE '%sbitany%' LIMIT 1"
  );
  if (existing.rows.length > 0) {
    console.log(`✅ متجر سبيتاني موجود — ID: ${existing.rows[0].id}`);
    return existing.rows[0].id;
  }

  const result = await pool.query(
    `INSERT INTO stores (name, city, is_active, is_approved)
     VALUES ($1,$2,true,true) RETURNING id`,
    ["سبيتاني", "فلسطين"]
  );
  console.log(`✅ تم إنشاء متجر سبيتاني — ID: ${result.rows[0].id}`);
  return result.rows[0].id;
}

// ==============================
// مطابقة فئة سبيتاني مع فئاتنا
// ==============================
async function matchCategory(categoryName) {
  if (!categoryName) return null;
  const name = categoryName.toLowerCase();

  const mapping = {
    "ثلاجات":             "ثلاجات",
    "فريزرات":            "فريزرات",
    "غسالات":             "غسالات",
    "نشافات":             "نشافات",
    "جلايات":             "جلايات",
    "أفران":              "أفران",
    "طباخات":             "طباخات",
    "شفاطات":             "شفاطات",
    "مكيفات":             "مكيفات",
    "دفايات":             "دفايات",
    "سخانات":             "سخانات مياه",
    "هواتف":              "أجهزة الهواتف",
    "موبايل":             "أجهزة الهواتف",
    "لابتوب":             "أجهزة لابتوب",
    "laptop":             "أجهزة لابتوب",
    "تابلت":              "الأجهزة اللوحية والآيباد",
    "آيباد":              "الأجهزة اللوحية والآيباد",
    "تلفزيون":            "تلفزيونات",
    "television":         "تلفزيونات",
    "شاشات":              "شاشات كمبيوتر",
    "مكانس":              "مكانس كهربائية",
    "قهوة":               "ماكينات قهوة",
    "خلاط":               "خلاطات",
    "مكواة":              "مكواة",
    "غلاية":              "غلايات مياه",
    "ميكروويف":           "ميكروويف",
    "سماعات":             "سماعات",
    "شاحن":               "شواحن وبنك طاقة",
    "طابعات":             "طابعات",
    "كاميرا":             "كاميرات DSLR",
  };

  for (const [key, catName] of Object.entries(mapping)) {
    if (name.includes(key)) {
      const result = await pool.query(
        "SELECT id FROM categories WHERE name=$1 LIMIT 1", [catName]
      );
      if (result.rows.length > 0) return result.rows[0].id;
    }
  }
  return null;
}

// ==============================
// جلب منتجات فئة معينة
// ==============================
async function scrapeCategory(categoryUrl, categoryName, storeId) {
  let totalAdded = 0;
  let page = 1;

  while (page <= MAX_PAGES && totalAdded < MAX_PRODUCTS_PER_CAT) {
    const url = page === 1 ? categoryUrl : `${categoryUrl}&page=${page}`;
    console.log(`  📄 صفحة ${page}: ${url}`);

    const html = await fetchPage(url);
    if (!html) break;

    const $ = cheerio.load(html);
    const categoryId = await matchCategory(categoryName);

    // منتجات الصفحة
    const products = [];
    $(".product-layout, .product-thumb").each((i, el) => {
      const nameEl  = $(el).find(".name a, h4 a").first();
      const priceEl = $(el).find(".price, .price-new").first();
      const imgEl   = $(el).find("img").first();
      const linkEl  = $(el).find("a").first();

      const name  = nameEl.text().trim();
      const link  = linkEl.attr("href") || "";
      const img   = imgEl.attr("src") || imgEl.attr("data-src") || "";
      let   price = priceEl.text().trim();

  // تنظيف السعر بشكل أفضل
  price = price
    .replace(/[^\d.,]/g, "")   // احذف كل شي غير أرقام ونقطة وفاصلة
    .replace(/,/g, "")          // احذف الفواصل
    .trim();
  // خذ أول رقم صحيح فقط
  const match = price.match(/\d+(\.\d+)?/);
  let priceNum = match ? parseFloat(match[0]) : null;
  // تجاهل السعر إذا كان كبير جداً (overflow)
  if (priceNum && priceNum > 99999) priceNum = null;

      if (name && name.length > 2) {
        products.push({ name, link, img, price: isNaN(priceNum) ? null : priceNum });
      }
    });

    if (products.length === 0) {
      console.log(`  ℹ️  لا منتجات في هذه الصفحة — إيقاف`);
      break;
    }

    console.log(`  📦 وجدت ${products.length} منتج`);

    // حفظ كل منتج
    for (const p of products) {
      if (totalAdded >= MAX_PRODUCTS_PER_CAT) break;
      try {
        await saveProduct(p, categoryId, storeId, categoryName);
        totalAdded++;
      } catch (err) {
        console.log(`  ❌ خطأ في حفظ "${p.name}": ${err.message}`);
      }
      await sleep(100);
    }

    // هل في صفحة تالية؟
    const hasNext = $(".pagination .next, .pagination li:last-child a").length > 0;
    if (!hasNext) break;

    page++;
    await sleep(DELAY_MS);
  }

  return totalAdded;
}

// ==============================
// حفظ منتج في قاعدة البيانات
// ==============================
async function saveProduct(p, categoryId, storeId, categoryName) {
  // اقطع الاسم إذا طويل جداً
  const name = p.name.trim().substring(0, 250);

  // تحقق من التكرار بالـ variant_label
  const existing = await pool.query(
    "SELECT id FROM products WHERE LOWER(TRIM(variant_label)) = LOWER(TRIM($1)) LIMIT 1",
    [name]
  );

  let productId;

  if (existing.rows.length > 0) {
    // منتج موجود — فقط أضف/حدّث السعر
    productId = existing.rows[0].id;
    console.log(`  ↩️  موجود: "${name}" — تحديث السعر`);
  } else {
    // منتج جديد
    // جلب أو إنشاء مجموعة
    const groupId = await getOrCreateGroup(name, categoryId, p.img);

    const result = await pool.query(
      `INSERT INTO products (name, brand, category_id, image, store_id, status, group_id, variant_label)
       VALUES ($1,$2,$3,$4,$5,'approved',$6,$7) RETURNING id`,
      [name, extractBrand(name), categoryId, fixImgUrl(p.img), storeId, groupId, name]
    );
    productId = result.rows[0].id;
    console.log(`  ✅ أضيف: "${name}"`);
  }

  // جلب السعر من صفحة المنتج إذا لم يوجد
  let finalPrice = p.price;
  if ((!finalPrice || finalPrice <= 0) && p.link) {
    try {
      const pHtml = await fetchPage(p.link);
      if (pHtml) {
        const $p = require('cheerio').load(pHtml);
        const priceSelectors = [
          '.price-new', 'span.price-new', '.product-price span',
          'h2.price', '.price', '.price-tax'
        ];
        for (const sel of priceSelectors) {
          const txt = $p(sel).first().text().trim();
          const digits = txt.replace(/[^d]/g, '');
          const val = digits ? parseInt(digits) : null;
          if (val && val > 5 && val < 100000) { finalPrice = val; break; }
        }
      }
    } catch(e) {}
  }

  // إضافة/تحديث السعر
  if (finalPrice && finalPrice > 0 && finalPrice < 100000) {
    await pool.query(
      `INSERT INTO prices (product_id, store_id, price)
       VALUES ($1,$2,$3)
       ON CONFLICT (product_id, store_id) DO UPDATE SET price=$3`,
      [productId, storeId, finalPrice]
    );
    await pool.query(
      "INSERT INTO price_history (product_id, store_id, price) VALUES ($1,$2,$3)",
      [productId, storeId, finalPrice]
    );
  } else {
    console.log('  ⚠️  بدون سعر:', name);
  }
}

// ==============================
// جلب أو إنشاء مجموعة للمنتج
// ==============================
async function getOrCreateGroup(productName, categoryId, img) {
  // الاسم الأساسي = بدون أرقام الموديل والمواصفات
  const baseName = extractBaseName(productName);
  const brand    = extractBrand(productName);

  const existing = await pool.query(
    "SELECT id FROM product_groups WHERE LOWER(TRIM(name))=LOWER(TRIM($1)) AND LOWER(TRIM(brand))=LOWER(TRIM($2)) LIMIT 1",
    [baseName, brand]
  );
  if (existing.rows.length > 0) return existing.rows[0].id;

  const result = await pool.query(
    `INSERT INTO product_groups (name, brand, category_id, image)
     VALUES ($1,$2,$3,$4) RETURNING id`,
    [baseName, brand, categoryId, fixImgUrl(img)]
  );
  return result.rows[0].id;
}

// ==============================
// Helper: استخراج الماركة من الاسم
// ==============================
function extractBrand(name) {
  const brands = [
    "Samsung","Apple","LG","Sony","Bosch","Siemens","Whirlpool",
    "Hisense","TCL","Sharp","Panasonic","Philips","Braun","Dyson",
    "Xiaomi","Huawei","OPPO","Realme","Nokia","Lenovo","Dell","HP",
    "Asus","Acer","MSI","Toshiba","Hitachi","Electrolux","Candy",
    "Ariston","Beko","Zanussi","Indesit","AEG","Miele","Haier",
    "Midea","Gree","Daikin","Carrier","York"
  ];
  const nameLower = name.toLowerCase();
  for (const brand of brands) {
    if (nameLower.includes(brand.toLowerCase())) return brand;
  }
  // أول كلمة
  return name.split(" ")[0] || "Unknown";
}

// ==============================
// Helper: استخراج الاسم الأساسي
// ==============================
function extractBaseName(name) {
  // أخذ أول 3-4 كلمات كاسم أساسي
  const words = name.trim().split(/\s+/);
  return words.slice(0, Math.min(4, words.length)).join(" ");
}

// ==============================
// Helper: إصلاح رابط الصورة
// ==============================
function fixImgUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("//")) return "https:" + url;
  return BASE_URL + url;
}

// ==============================
// جلب الفئات الرئيسية
// ==============================
async function scrapeCategories() {
  console.log("\n🔍 جلب قائمة الفئات من سبيتاني...");
  const html = await fetchPage(`${BASE_URL}/index.php?route=product/page_categories`);
  if (!html) { console.log("❌ فشل جلب الفئات"); return []; }

  const $ = cheerio.load(html);
  const categories = [];

  // الفئات الرئيسية
  $(".category-list a, .box-category a, h3 a, .categorytitle a").each((i, el) => {
    const name = $(el).text().trim();
    const href = $(el).attr("href");
    if (name && href && href.includes("sbitany.com") && name.length > 2) {
      categories.push({ name, url: href });
    }
  });

  // إذا ما لقى — جرب طريقة ثانية
  if (categories.length === 0) {
    $("a").each((i, el) => {
      const href = $(el).attr("href") || "";
      const name = $(el).text().trim();
      if (href.includes("sbitany.com") && (
        href.includes("refrigerator") || href.includes("washer") ||
        href.includes("mobile") || href.includes("laptop") ||
        href.includes("television") || href.includes("home-appliances") ||
        href.includes("small-appliances")
      ) && name.length > 2) {
        categories.push({ name, url: href });
      }
    });
  }

  // إزالة المكررات
  const unique = categories.filter((c, i, arr) => arr.findIndex(x => x.url === c.url) === i);
  console.log(`✅ وجدت ${unique.length} فئة`);
  return unique;
}

// ==============================
// الفئات المحددة مسبقاً (fallback)
// ==============================
const KNOWN_CATEGORIES = [
  { name: "الأجهزة المنزلية",        url: "https://sbitany.com/home-appliances-34" },
  { name: "تلفزيونات",               url: "https://sbitany.com/television-21" },
  { name: "الهواتف المحمولة",         url: "https://sbitany.com/mobiles-192/mobile-device-193" },
  { name: "أجهزة لابتوب",            url: "https://sbitany.com/index.php?route=product/category&path=225_302" },
  { name: "الأجهزة اللوحية والآيباد", url: "https://sbitany.com/computers-amp-tablets-225-/tablets-amp-ipads-301" },
  { name: "الأجهزة المنزلية الصغيرة", url: "https://sbitany.com/small-appliances-521" },
  { name: "ثلاجات",                  url: "https://sbitany.com/home-appliances-34/refrigerator-40222" },
  { name: "غسالات",                  url: "https://sbitany.com/home-appliances-34/washer-35" },
  { name: "جلايات",                  url: "https://sbitany.com/home-appliances-34/dishwasher-39" },
  { name: "نشافات",                  url: "https://sbitany.com/home-appliances-34/dryer-38" },
  { name: "أفران",                   url: "https://sbitany.com/home-appliances-34/oven-43" },
  { name: "سماعات",                  url: "https://sbitany.com/index.php?route=product/category&path=194_196" },
  { name: "الجمال والعناية الشخصية", url: "https://sbitany.com/personal-amp-beauty-care-126" },
  { name: "الطابعات",                url: "https://sbitany.com/printer-548" },
  { name: "ألعاب",                   url: "https://sbitany.com/gaming-5851" },
  { name: "إكسسوارات الكمبيوتر",     url: "https://sbitany.com/index.php?route=product/category&path=225_303" },
];

// ==============================
// الدالة الرئيسية
// ==============================
async function main() {
  console.log("═══════════════════════════════════════");
  console.log("   🛒 Sbitany Scraper — PalPrice");
  console.log("═══════════════════════════════════════\n");

  // 1. جهّز متجر سبيتاني
  const storeId = await getOrCreateStore();

  // 2. استخدم الفئات المحددة دائماً
  const categories = KNOWN_CATEGORIES;
  console.log(`📋 ${categories.length} فئات مستهدفة`);

  // 3. scrape كل فئة
  let totalAdded = 0;
  for (const cat of categories) {
    console.log(`\n📂 الفئة: ${cat.name}`);
    console.log(`   ${cat.url}`);
    try {
      const added = await scrapeCategory(cat.url, cat.name, storeId);
      totalAdded += added;
      console.log(`   ✅ أضيف ${added} منتج`);
    } catch (err) {
      console.log(`   ❌ خطأ: ${err.message}`);
    }
    await sleep(DELAY_MS * 2);
  }

  console.log("\n═══════════════════════════════════════");
  console.log(`✅ انتهى! إجمالي المنتجات المضافة: ${totalAdded}`);
  console.log("═══════════════════════════════════════");

  await pool.end();
}

main().catch(err => {
  console.error("❌ خطأ عام:", err.message);
  pool.end();
  process.exit(1);
});