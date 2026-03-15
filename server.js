const express = require("express");
const cors = require("cors");
const path = require("path");

const productsRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");
const storesRoutes = require("./routes/stores");
const pricesRoutes = require("./routes/prices");

const pool = require("./db/db");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/uploads", express.static(path.resolve(__dirname,"uploads")));

/* =========================
   ROUTES
========================= */

app.use("/products", productsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/stores", storesRoutes);
app.use("/prices", pricesRoutes);

/*
================================
ADMIN ANALYTICS API
================================
*/

app.get("/admin/analytics", async (req,res)=>{

try{

const products = await pool.query(
"SELECT COUNT(*) FROM products"
);

const stores = await pool.query(
"SELECT COUNT(*) FROM stores"
);

const prices = await pool.query(
"SELECT COUNT(*) FROM prices"
);

const mostViewed = await pool.query(
"SELECT name FROM products ORDER BY views DESC LIMIT 1"
);

res.json({

products:products.rows[0].count,
stores:stores.rows[0].count,
prices:prices.rows[0].count,
mostViewed:mostViewed.rows[0]?.name || "N/A"

});

}catch(err){

console.log(err);
res.status(500).json(err);

}

});

/*
================================
START SERVER
================================
*/

app.get("/test-image", (req, res) => {
  const path = require("path");
  res.sendFile(path.join(__dirname, "uploads", "test.JPEG"));
});

app.listen(3000, () => {

console.log("Server running on port 3000");

});