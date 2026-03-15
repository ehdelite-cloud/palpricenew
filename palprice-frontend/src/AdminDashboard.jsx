/*
PAGE: Admin Dashboard

لوحة تحكم الأدمن لإدارة الموقع

المميزات:
- عرض إحصائيات
- إضافة منتج
- حذف منتج
- إضافة سعر لمنتج في متجر
*/

import { useEffect, useState } from "react";

function AdminDashboard(){

/* PRODUCTS */

const [products,setProducts] = useState([]);

/* STORES */

const [stores,setStores] = useState([]);

/* PRODUCT FORM */

const [name,setName] = useState("");
const [brand,setBrand] = useState("");
const [category,setCategory] = useState("");
const [image,setImage] = useState("");

/* PRICE FORM */

const [selectedProduct,setSelectedProduct] = useState("");
const [selectedStore,setSelectedStore] = useState("");
const [price,setPrice] = useState("");

/* ANALYTICS */

const [analytics,setAnalytics] = useState({
products:0,
stores:0,
prices:0,
mostViewed:""
});

/* FETCH PRODUCTS */

function fetchProducts(){

fetch("http://localhost:3000/products")
.then(res=>res.json())
.then(data=>setProducts(data));

}

/* FETCH STORES */

function fetchStores(){

fetch("http://localhost:3000/stores")
.then(res=>res.json())
.then(data=>setStores(data));

}

/* FETCH ANALYTICS */

function fetchAnalytics(){

fetch("http://localhost:3000/products/analytics/overview")
.then(res=>res.json())
.then(data=>setAnalytics(data));

}

/* ADD PRODUCT */

function addProduct(){

fetch("http://localhost:3000/products",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name,
brand,
category,
image
})

})
.then(()=>{

setName("");
setBrand("");
setCategory("");
setImage("");

fetchProducts();

});

}

/* DELETE PRODUCT */

function deleteProduct(id){

if(!window.confirm("Delete this product?")) return;

fetch(`http://localhost:3000/products/${id}`,{
method:"DELETE"
})
.then(()=>fetchProducts());

}

/* ADD PRICE */

function addPrice(){

fetch("http://localhost:3000/prices",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
product_id:selectedProduct,
store_id:selectedStore,
price:price
})

})
.then(()=>{

setSelectedProduct("");
setSelectedStore("");
setPrice("");

alert("Price added");

});

}

/* LOAD DATA */

useEffect(()=>{

fetchProducts();
fetchStores();
fetchAnalytics();

},[]);

return(

<div className="container">

<h1 style={{marginTop:"40px"}}>

📊 Platform Analytics

</h1>

<div style={{display:"flex",gap:"20px",marginTop:"20px"}}>

<div>Products: {analytics.products}</div>

<div>Stores: {analytics.stores}</div>

<div>Prices: {analytics.prices}</div>

<div>Most Viewed: {analytics.mostViewed?.name || "N/A"}</div>

</div>

{/* ADD PRODUCT */}

<h2 style={{marginTop:"40px"}}>Add Product</h2>

<div style={{maxWidth:"300px"}}>

<input
placeholder="Product Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Brand"
value={brand}
onChange={(e)=>setBrand(e.target.value)}
/>

<input
placeholder="Category"
value={category}
onChange={(e)=>setCategory(e.target.value)}
/>

<input
placeholder="Image URL"
value={image}
onChange={(e)=>setImage(e.target.value)}
/>

<button onClick={addProduct} style={{marginTop:"10px"}}>
Add Product
</button>

</div>

{/* ADD PRICE */}

<h2 style={{marginTop:"40px"}}>Add Price</h2>

<div style={{maxWidth:"300px"}}>

<select
value={selectedProduct}
onChange={(e)=>setSelectedProduct(e.target.value)}
>

<option value="">Select Product</option>

{products.map(p=>(
<option key={p.id} value={p.id}>
{p.name}
</option>
))}

</select>

<select
value={selectedStore}
onChange={(e)=>setSelectedStore(e.target.value)}
>

<option value="">Select Store</option>

{stores.map(s=>(
<option key={s.id} value={s.id}>
{s.name}
</option>
))}

</select>

<input
type="number"
placeholder="Price"
value={price}
onChange={(e)=>setPrice(e.target.value)}
/>

<button onClick={addPrice}>
Add Price
</button>

</div>

{/* PRODUCTS */}

<h2 style={{marginTop:"40px"}}>All Products</h2>

<table style={{width:"100%",marginTop:"20px"}}>

<thead>

<tr>

<th>ID</th>
<th>Name</th>
<th>Action</th>

</tr>

</thead>

<tbody>

{products.map(product=>(

<tr key={product.id}>

<td>{product.id}</td>

<td>{product.name}</td>

<td>

<button
onClick={()=>deleteProduct(product.id)}
style={{
background:"#ef4444",
color:"white",
border:"none",
padding:"6px 10px",
borderRadius:"6px"
}}
>

Delete

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

);

}

export default AdminDashboard;