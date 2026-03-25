const express = require("express");
const router = express.Router();
const pool = require("../db/db");

/* ==============================
   GET ALL — مع دعم الهرمية
============================== */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, COALESCE(name_en, name) AS name_en,
             icon, level, parent_id
      FROM categories
      ORDER BY level ASC, id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   GET MAIN CATEGORIES (level=1)
============================== */
router.get("/main", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, COALESCE(name_en, name) AS name_en, icon, level
      FROM categories
      WHERE level = 1
      ORDER BY id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   GET SUB CATEGORIES — أبناء فئة
============================== */
router.get("/:id/children", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, COALESCE(name_en, name) AS name_en, icon, level, parent_id
      FROM categories
      WHERE parent_id = $1
      ORDER BY id ASC
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   GET TREE — كل الفئات هرمياً
============================== */
router.get("/tree", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, COALESCE(name_en, name) AS name_en,
             icon, level, parent_id
      FROM categories
      ORDER BY level ASC, id ASC
    `);

    const all = result.rows;
    const map = {};
    all.forEach(c => { map[c.id] = { ...c, children: [] }; });

    const tree = [];
    all.forEach(c => {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].children.push(map[c.id]);
      } else if (!c.parent_id) {
        tree.push(map[c.id]);
      }
    });

    res.json(tree);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;