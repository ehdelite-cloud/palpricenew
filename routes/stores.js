const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



/*
==============================
REGISTER STORE
==============================
*/

router.post("/register", async (req,res)=>{

try{

const { name, city, email, password } = req.body;

const hashedPassword = await bcrypt.hash(password,10);

const result = await pool.query(
`INSERT INTO stores (name,city,email,password)
VALUES ($1,$2,$3,$4)
RETURNING id,name,city,email`,
[name,city,email,hashedPassword]
);

res.json({
message:"Store registered successfully",
store: result.rows[0]
});

}catch(err){
res.status(500).send(err.message);
}

});

/*
==============================
STORE LOGIN
==============================
*/

router.post("/login", async (req,res)=>{

try{

const { email,password } = req.body;

const store = await pool.query(
"SELECT * FROM stores WHERE email=$1",
[email]
);

if(store.rows.length === 0){
return res.status(404).send("Store not found");
}

// تحقق من تعليق المتجر
if(store.rows[0].is_active === false){
return res.status(403).json({
  error: "suspended",
  message: "متجرك معلق حالياً. تواصل مع إدارة PalPrice."
});
}

const valid = await bcrypt.compare(
password,
store.rows[0].password
);

if(!valid){
return res.status(401).send("Wrong password");
}

const token = jwt.sign(
{ id: store.rows[0].id },
process.env.JWT_SECRET || "secretkey",
{ expiresIn:"7d" }
);

res.json({
message:"Login successful",
token:token,
store:store.rows[0].id
});

}catch(err){
res.status(500).send(err.message);
}

});

/*
==============================
GET ALL STORES
==============================
*/

router.get("/", async (req,res)=>{

try{

const result = await pool.query(
"SELECT * FROM stores ORDER BY name"
);

res.json(result.rows);

}catch(err){

console.log(err);
res.status(500).json(err);

}

});

/*
==============================
GET STORE INFO
==============================
*/

router.get("/:id", async (req,res)=>{

try{

const { id } = req.params;

const result = await pool.query(
"SELECT id,name,city,email FROM stores WHERE id=$1",
[id]
);

res.json(result.rows[0]);

}catch(err){

console.log(err);
res.status(500).json(err);

}

});

/*
==============================
UPDATE STORE INFO
==============================
*/

router.put("/:id", async (req,res)=>{

try{

const { id } = req.params;
const { name, city, email } = req.body;

const result = await pool.query(
`UPDATE stores
SET name=$1, city=$2, email=$3
WHERE id=$4
RETURNING id,name,city,email`,
[name, city, email, id]
);

if(result.rows.length === 0){
return res.status(404).json({ error: "Store not found" });
}

res.json({
message: "Store updated successfully",
store: result.rows[0]
});

}catch(err){

console.log(err);
res.status(500).json({ error: err.message });

}

});

/*
==============================
STORE PRODUCTS
==============================
*/

router.get("/:id/products", async (req,res)=>{

try{

const { id } = req.params;

const result = await pool.query(`
SELECT
  products.id,
  products.name,
  products.variant_label,
  products.brand,
  products.image,
  products.views,
  products.status,
  products.category_id,
  products.created_at,
  categories.name AS category_name,
  categories.icon AS category_icon,
  MIN(prices.price) AS best_price
FROM products
LEFT JOIN prices ON prices.product_id = products.id AND prices.store_id = $1
LEFT JOIN categories ON categories.id = products.category_id
WHERE products.store_id = $1
GROUP BY products.id, categories.name, categories.icon
ORDER BY products.created_at DESC
`,[id]);

res.json(result.rows);

}catch(err){

console.log(err);
res.status(500).json(err);

}

});

/*
==============================
STORE COMPETITION
— يعرض فقط المنتجات المشتركة مع متاجر أخرى
==============================
*/

router.get("/:id/competition", async (req,res)=>{

try{

const { id } = req.params;

// جيب المنتجات الي هذا المتجر عنده سعر فيها
// وكمان متاجر ثانية عندها سعر لنفس المنتجات
const result = await pool.query(`
SELECT
  p.id AS product_id,
  p.name AS product_name,
  s.id AS store_id,
  s.name AS store_name,
  pr.price,
  CASE WHEN s.id = $1 THEN true ELSE false END AS is_mine
FROM prices pr
JOIN products p ON pr.product_id = p.id
JOIN stores s ON pr.store_id = s.id
WHERE p.id IN (
  SELECT product_id FROM prices WHERE store_id = $1
)
ORDER BY p.name, pr.price ASC
`, [id]);

res.json(result.rows);

}catch(err){
console.log(err);
res.status(500).json({ error: err.message });
}

});

/*
==============================
ADD STORE REVIEW
==============================
*/

router.post("/:id/review", async (req,res)=>{

try{

const { id } = req.params;
const { rating, comment } = req.body;

const result = await pool.query(`
INSERT INTO store_reviews (store_id,rating,comment)
VALUES ($1,$2,$3)
RETURNING *
`,[id,rating,comment]);

res.json(result.rows[0]);

}catch(err){

console.log(err);
res.status(500).json(err);

}

});

/*
==============================
STORE RATING
==============================
*/

router.get("/:id/rating", async (req,res)=>{

try{

const { id } = req.params;

const result = await pool.query(`
SELECT
AVG(rating) as average,
COUNT(*) as total
FROM store_reviews
WHERE store_id = $1
`,[id]);

res.json(result.rows[0]);

}catch(err){

console.log(err);
res.status(500).json(err);

}

});

/*
==============================
UPLOAD STORE LOGO
==============================
*/

const upload = require("../middleware/upload");

router.post("/:id/logo", upload.single("image"), async (req,res)=>{

try{

const { id } = req.params;
const logoUrl = "/uploads/" + req.file.filename;

await pool.query(
"UPDATE stores SET logo=$1 WHERE id=$2",
[logoUrl, id]
);

res.json({ message: "Logo uploaded", logo: logoUrl });

}catch(err){
console.log(err);
res.status(500).json({ error: err.message });
}

});


module.exports = router;