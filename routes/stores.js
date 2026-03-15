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

const valid = await bcrypt.compare(
password,
store.rows[0].password
);

if(!valid){
return res.status(401).send("Wrong password");
}

const token = jwt.sign(
{ id: store.rows[0].id },
"secretkey",
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
"SELECT * FROM stores WHERE id=$1",
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
products.image,
MIN(prices.price) AS best_price
FROM prices
JOIN products ON prices.product_id = products.id
WHERE prices.store_id = $1
GROUP BY products.id
`,[id]);

res.json(result.rows);

}catch(err){

console.log(err);
res.status(500).json(err);

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

module.exports = router;