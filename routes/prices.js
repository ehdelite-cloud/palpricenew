const express = require("express");
const router = express.Router();
const pool = require("../db/db");

/* ADD PRICE */

router.post("/", async (req,res)=>{

try{

const { product_id, store_id, price } = req.body;

const result = await pool.query(
"INSERT INTO prices (product_id,store_id,price) VALUES ($1,$2,$3) RETURNING *",
[product_id,store_id,price]
);

await pool.query(
"INSERT INTO price_history (product_id,store_id,price) VALUES ($1,$2,$3)",
[product_id,store_id,price]
);

res.json(result.rows[0]);

}catch(err){

console.log("Add price error:", err);
res.status(500).json({error:err.message});

}

});


/* PRICES FOR PRODUCT */

router.get("/product/:id", async (req,res)=>{

try{

const { id } = req.params;

const result = await pool.query(`
SELECT
prices.id,
prices.price,
stores.name AS store_name
FROM prices
JOIN stores ON prices.store_id = stores.id
WHERE prices.product_id = $1
ORDER BY prices.price ASC
`,[id]);

res.json(result.rows);

}catch(err){

console.log("Prices for product error:", err);
res.status(500).json({error:err.message});

}

});


/* PRICE HISTORY */

router.get("/history/:id", async (req,res)=>{

try{

const { id } = req.params;

const result = await pool.query(`
SELECT price, recorded_at AS date
FROM price_history
WHERE product_id = $1
ORDER BY recorded_at ASC
`,[id]);

res.json(result.rows);

}catch(err){

console.log("Price history error:", err);
res.status(500).json({error:err.message});

}

});

router.get("/competition", async (req,res)=>{

try{

const result = await pool.query(`
SELECT
products.name AS product_name,
stores.name AS store_name,
prices.price
FROM prices
JOIN products ON prices.product_id = products.id
JOIN stores ON prices.store_id = stores.id
ORDER BY products.name, prices.price ASC
`);

res.json(result.rows);

}catch(err){

console.log("Competition error:", err);
res.status(500).json({error:err.message});

}

});

/* DEALS - BIGGEST PRICE DROPS */

router.get("/deals", async (req,res)=>{

try{

const result = await pool.query(`
SELECT 
p.id,
p.name,
p.image,
MIN(ph.price) as lowest_price,
MAX(ph.price) as highest_price,
(MAX(ph.price) - MIN(ph.price)) as discount
FROM price_history ph
JOIN products p ON ph.product_id = p.id
GROUP BY p.id,p.name,p.image
HAVING MAX(ph.price) > MIN(ph.price)
ORDER BY discount DESC
LIMIT 20
`);

res.json(result.rows);

}catch(err){

console.log("Deals error:",err);
res.status(500).json(err);

}

});

module.exports = router;