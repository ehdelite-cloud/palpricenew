/**
 * ai-specs-generator.js
 * يولد مواصفات المنتجات تلقائياً باستخدام Claude AI
 * الاستخدام: node ai-specs-generator.js
 */

require("dotenv").config();
const pool = require("./db/db");

const DELAY_MS   = 1500; // تأخير بين كل طلب
const BATCH_SIZE = 20;   // عدد المنتجات قبل pause

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getSpecsFromAI(productName) {
  const prompt = `أنت خبير في مواصفات المنتجات الإلكترونية والأجهزة المنزلية.

المنتج: "${productName}"

أعطني مواصفاته الحقيقية بصيغة JSON فقط بدون أي نص إضافي.
الشكل:
{
  "specs": {
    "مفتاح": "قيمة"
  },
  "confidence": "high أو medium أو low"
}

قواعد مهمة:
- أضف فقط المواصفات المنطقية لهذا النوع من المنتجات
- إذا المنتج غسالة: سعة الغسيل، سرعة الدوران، عدد البرامج، نوع المحرك، اللون
- إذا ثلاجة: السعة، نوع التبريد، عدد الأبواب، الطاقة، اللون
- إذا تلفزيون: المقاس، الدقة، نوع اللوحة، نظام التشغيل، الاتصال
- إذا موبايل: المعالج، الرام، التخزين، الكاميرا، البطارية، نظام التشغيل
- إذا لابتوب: المعالج، الرام، التخزين، الشاشة، كرت الشاشة، نظام التشغيل
- إذا سماعات: نوع الاتصال، إلغاء الضوضاء، مدة البطارية، مقاوم للماء
- إذا أجهزة عناية: الطاقة، درجة الحرارة، الملحقات، نوع الاستخدام
- إذا ميكروويف أو فرن: السعة، الطاقة، عدد البرامج، المقاس
- لا تضع قيم وهمية — فقط المواصفات المذكورة في اسم المنتج أو المعروفة للموديل
- confidence: high إذا المنتج معروف جداً، medium إذا متأكد نسبياً، low إذا غير متأكد
- أجب بـ JSON فقط`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: process.env.AI_SPEC_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const text = data.content?.map(c => c.text || "").join("") || "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("   🤖 AI Specs Generator");
  console.log("   مواصفات تلقائية باستخدام Claude");
  console.log("═══════════════════════════════════════\n");

  // جلب المنتجات بدون مواصفات
  const result = await pool.query(`
    SELECT p.id, p.name, p.variant_label
    FROM products p
    WHERE p.store_id = 8
      AND NOT EXISTS (
        SELECT 1 FROM product_specs ps WHERE ps.product_id = p.id
      )
    ORDER BY p.id
    LIMIT 400
  `);

  console.log(`📦 ${result.rows.length} منتج بدون مواصفات\n`);

  if (result.rows.length === 0) {
    console.log("✅ كل المنتجات عندها مواصفات!");
    await pool.end();
    return;
  }

  let success = 0;
  let failed  = 0;
  let skipped = 0;

  for (let i = 0; i < result.rows.length; i++) {
    const product = result.rows[i];
    const name = (product.variant_label || product.name || "").substring(0, 60);
    process.stdout.write(`  [${i+1}/${result.rows.length}] ${name.substring(0,45).padEnd(45)} `);

    try {
      const aiResult = await getSpecsFromAI(name);

      if (!aiResult?.specs || Object.keys(aiResult.specs).length === 0) {
        console.log(`⚠️  لا مواصفات`);
        skipped++;
        await sleep(DELAY_MS);
        continue;
      }

      // حذف القديمة وأضف الجديدة
      await pool.query("DELETE FROM product_specs WHERE product_id=$1", [product.id]);

      const entries = Object.entries(aiResult.specs).filter(([k, v]) => k && v && String(v).length > 0);
      for (const [key, value] of entries) {
        await pool.query(
          `INSERT INTO product_specs (product_id, spec_key, spec_value)
           VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
          [product.id, key, String(value)]
        ).catch(() => {});
      }

      const confidence = aiResult.confidence || "medium";
      const icon = confidence === "high" ? "✅" : confidence === "medium" ? "🔶" : "⚠️";
      console.log(`${icon} ${entries.length} مواصفة (${confidence})`);
      success++;

    } catch (err) {
      console.log(`❌ ${err.message.substring(0, 30)}`);
      failed++;
    }

    await sleep(DELAY_MS);

    if ((i + 1) % BATCH_SIZE === 0) {
      console.log(`\n  ⏸️  استراحة...\n`);
      await sleep(3000);
    }
  }

  console.log(`\n═══════════════════════════════════════`);
  console.log(`✅ نجح:    ${success} منتج`);
  console.log(`⚠️  تخطى:  ${skipped} منتج`);
  console.log(`❌ فشل:    ${failed} منتج`);
  console.log(`═══════════════════════════════════════`);

  await pool.end();
}

main().catch(async err => {
  console.error("❌ خطأ عام:", err.message);
  await pool.end();
  process.exit(1);
});