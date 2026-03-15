const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const upload = require("../middleware/upload");

/*
================================
CREATE PRODUCT
================================
*/

router.post("/", async (req,res)=>{

try{

const { name,brand,category,description,image } = req.body;

const result = await pool.query(
"INSERT INTO products (name,brand,category,description,image) VALUES ($1,$2,$3,$4,$5) RETURNING *",
[name,brand,category,description,image]
);

res.json(result.rows[0]);

}catch(err){
res.status(500).send(err.message);
}

});

/*
================================
GET ALL PRODUCTS
================================
*/

router.get("/", async (req,res)=>{

try{

const result = await pool.query(`
SELECT
products.id,
products.name,
products.brand,
products.category,
products.image,
MIN(prices.price) AS best_price
FROM products
LEFT JOIN prices ON products.id = prices.product_id
GROUP BY products.id
ORDER BY products.id DESC
`);

res.json(result.rows);

}catch(err){
res.status(500).send(err.message);
}

});

/*
================================
SEARCH PRODUCTS
================================
*/

router.get("/search", async (req,res)=>{

try{

const { q } = req.query;

const result = await pool.query(
"SELECT * FROM products WHERE name ILIKE $1",
[`%${q}%`]
);

res.json(result.rows);

}catch(err){
res.status(500).send(err.message);
}

});

/*
================================
TRENDING PRODUCTS
================================
*/

router.get("/trending", async (req,res)=>{

try{

const result = await pool.query(`
SELECT
p.id,
p.name,
p.image,
p.views,
MIN(prices.price) as best_price
FROM products p
LEFT JOIN prices ON p.id = prices.product_id
GROUP BY p.id
ORDER BY p.views DESC
LIMIT 8
`);

res.json(result.rows);

}catch(err){
res.status(500).send(err.message);
}

});

/*
================================
PRICE DROPS
================================
*/

router.get("/price-drops", async (req,res)=>{

try{

const result = await pool.query(`
SELECT
products.id,
products.name,
products.image,
MIN(price_history.price) AS old_price,
MAX(price_history.price) AS new_price
FROM price_history
JOIN products ON price_history.product_id = products.id
GROUP BY products.id
ORDER BY MAX(price_history.price) - MIN(price_history.price) DESC
LIMIT 5
`);

res.json(result.rows);

}catch(err){

console.log(err);
res.status(500).send(err.message);

}

});

/*
================================
COMPARE PRODUCTS
================================
*/

router.get("/compare", async (req,res)=>{

try{

const idsParam = req.query.ids;

if(!idsParam){
return res.json([]);
}

const ids = idsParam
.split(",")
.map(Number)
.filter(n => !isNaN(n));

const result = await pool.query(
`
SELECT
p.id,
p.name,
p.brand,
p.image,
MIN(prices.price) as best_price
FROM products p
LEFT JOIN prices ON p.id = prices.product_id
WHERE p.id = ANY($1::int[])
GROUP BY p.id
`,
[ids]
);

res.json(result.rows);

}catch(err){

console.log("COMPARE ERROR:",err);

res.status(500).json({
error:err.message
});

}

});

/*
================================
GET SINGLE PRODUCT
================================
*/

router.get("/:id", async (req,res)=>{

try{

const { id } = req.params;

/* increase views */

await pool.query(
"UPDATE products SET views = views + 1 WHERE id=$1",
[id]
);

/* get product */

const result = await pool.query(
"SELECT * FROM products WHERE id=$1",
[id]
);

res.json(result.rows[0]);

}catch(err){
res.status(500).send(err.message);
}

});

/*
================================
DELETE PRODUCT
================================
*/

router.delete("/:id", async (req,res)=>{

try{

const { id } = req.params;

await pool.query(
"DELETE FROM products WHERE id=$1",
[id]
);

res.json({message:"deleted"});

}catch(err){
res.status(500).send(err.message);
}

});

/*
================================
PRODUCT REVIEWS
================================
*/

router.get("/:id/reviews", async (req,res)=>{

try{

const { id } = req.params;

const result = await pool.query(`
SELECT rating, comment, created_at
FROM reviews
WHERE product_id = $1
ORDER BY created_at DESC
`,[id]);

res.json(result.rows);

}catch(err){

console.log(err);
res.status(500).json(err.message);

}

});

/*
================================
ADD REVIEW
================================
*/

router.post("/:id/review", async (req,res)=>{

try{

const { id } = req.params;
const { rating, comment } = req.body;

const result = await pool.query(`
INSERT INTO reviews (product_id,rating,comment)
VALUES ($1,$2,$3)
RETURNING *
`,[id,rating,comment]);

res.json(result.rows[0]);

}catch(err){

console.log(err);
res.status(500).json(err.message);

}

});

/*
================================
PRODUCT RATING
================================
*/

router.get("/:id/rating", async (req,res)=>{

try{

const { id } = req.params;

const result = await pool.query(`
SELECT
AVG(rating) as average,
COUNT(*) as total
FROM reviews
WHERE product_id = $1
`,[id]);

res.json(result.rows[0]);

}catch(err){

console.log(err);
res.status(500).json(err.message);

}

});

/*
================================
SIMILAR PRODUCTS
================================
*/

router.get("/:id/similar", async (req,res)=>{

try{

const { id } = req.params;

const product = await pool.query(
"SELECT category FROM products WHERE id=$1",
[id]
);

if(product.rows.length === 0){
return res.json([]);
}

const category = product.rows[0].category;

const result = await pool.query(
`
SELECT id,name,image
FROM products
WHERE category = $1
AND id != $2
LIMIT 4
`,
[category,id]
);

res.json(result.rows);

}catch(err){

console.log(err);
res.status(500).send(err.message);

}

});

/*
================================
UPLOAD PRODUCT IMAGE
================================
*/

router.post("/:id/image", upload.single("image"), async (req,res)=>{

try{

const { id } = req.params;

const imageUrl = "/uploads/" + req.file.filename;

await pool.query(
"INSERT INTO product_images (product_id,image_url) VALUES ($1,$2)",
[id,imageUrl]
);

res.json({
message:"image uploaded",
image:imageUrl
});

}catch(err){

console.log(err);
res.status(500).send(err.message);

}

});

/*
================================
GET PRODUCT IMAGES
================================
*/

router.get("/:id/images", async (req,res)=>{

try{

const { id } = req.params;

const result = await pool.query(
"SELECT * FROM product_images WHERE product_id=$1",
[id]
);

res.json(result.rows);

}catch(err){

console.log(err);
res.status(500).send(err.message);

}

});

/*
================================
ADD FAVORITE
================================
*/

router.post("/:id/favorite", async (req,res)=>{

try{

const { id } = req.params;

const result = await pool.query(
"INSERT INTO favorites (product_id) VALUES ($1) RETURNING *",
[id]
);

res.json(result.rows[0]);

}catch(err){

console.log(err);
res.status(500).json(err);

}

});

/*
================================
GET FAVORITES
================================
*/

router.get("/favorites", async (req,res)=>{

try{

const result = await pool.query(`
SELECT
products.id,
products.name,
products.image
FROM favorites
JOIN products ON favorites.product_id = products.id
ORDER BY favorites.created_at DESC
`);

res.json(result.rows);

}catch(err){

console.log(err);
res.status(500).json(err);

}

});

module.exports = router;