/*
PAGE: Product Page
عرض المنتج + مقارنة الأسعار + التاريخ + التنبيهات + التقييمات
*/

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts";

function ProductPage(){

const { id } = useParams();

const [product,setProduct] = useState(null);
const [offers,setOffers] = useState([]);
const [history,setHistory] = useState([]);

const [images,setImages] = useState([]);
const [mainImage,setMainImage] = useState("");
const [zoom,setZoom] = useState(false);   // ⭐ added

const [email,setEmail] = useState("");
const [targetPrice,setTargetPrice] = useState("");

const [reviews,setReviews] = useState([]);
const [rating,setRating] = useState(5);
const [comment,setComment] = useState("");
const [ratingInfo,setRatingInfo] = useState(null);
const [similar,setSimilar] = useState([]);

function createAlert(){

fetch(`http://localhost:3000/products/${id}/alert`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
target_price:targetPrice
})
})
.then(res=>res.json())
.then(()=>{
alert("Price alert created!");
setEmail("");
setTargetPrice("");
});

}

function addReview(){

fetch(`http://localhost:3000/products/${id}/review`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
rating,
comment
})
})
.then(res=>res.json())
.then(()=>{

setComment("");

fetch(`http://localhost:3000/products/${id}/reviews`)
.then(res=>res.json())
.then(data=>setReviews(data));

});

}

useEffect(()=>{

    /* RECENTLY VIEWED */

let viewed = JSON.parse(localStorage.getItem("recent")) || [];

viewed = viewed.filter(v => v !== id);

viewed.unshift(id);

if(viewed.length > 6){
viewed.pop();
}

localStorage.setItem("recent", JSON.stringify(viewed));

fetch(`http://localhost:3000/products/${id}/images`)
.then(res=>res.json())
.then(data=>{

if(Array.isArray(data)){

setImages(data);

if(data.length > 0){
setMainImage("http://localhost:3000" + data[0].image_url);
}

}

});

fetch(`http://localhost:3000/products/${id}/similar`)
.then(res=>res.json())
.then(data=>{
if(Array.isArray(data)) setSimilar(data);
});

fetch(`http://localhost:3000/products/${id}/rating`)
.then(res=>res.json())
.then(data=>setRatingInfo(data));

fetch(`http://localhost:3000/products/${id}`)
.then(res=>res.json())
.then(data=>setProduct(data));

fetch(`http://localhost:3000/prices/product/${id}`)
.then(res=>res.json())
.then(data=>{
if(Array.isArray(data)) setOffers(data);
});

fetch(`http://localhost:3000/prices/history/${id}`)
.then(res=>res.json())
.then(data=>{

if(!Array.isArray(data)){
setHistory([]);
return;
}

const formatted = data.map(item=>({
price:Number(item.price),
date:new Date(item.date).toLocaleDateString()
}));

setHistory(formatted);

});

fetch(`http://localhost:3000/products/${id}/reviews`)
.then(res=>res.json())
.then(data=>{
if(Array.isArray(data)) setReviews(data);
});

},[id]);

if(!product){
return <p style={{padding:"40px"}}>Loading...</p>
}

return(

<div className="container">

<div className="product-page">

<div className="product-image-box">

<img
src={mainImage || product.image}
alt={product.name}
style={{
width:"100%",
maxWidth:"420px",
borderRadius:"10px",
border:"1px solid #eee",
cursor:"zoom-in"
}}
onClick={()=>setZoom(true)}   // ⭐ zoom trigger
/>

{/* ⭐ ZOOM */}

{zoom && (

<div
onClick={()=>setZoom(false)}
style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.85)",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:2000
}}
>

<img
src={mainImage || product.image}
alt="zoom"
style={{
maxWidth:"90%",
maxHeight:"90%",
borderRadius:"10px"
}}
/>

</div>

)}

<div style={{
display:"flex",
gap:"10px",
marginTop:"15px",
flexWrap:"wrap"
}}>

{images.map(img=>(
<img
key={img.id}
src={"http://localhost:3000" + img.image_url}
alt="product"
style={{
width:"70px",
height:"70px",
objectFit:"cover",
cursor:"pointer",
border:"2px solid #eee",
borderRadius:"6px",
padding:"2px"
}}
onClick={()=>setMainImage("http://localhost:3000" + img.image_url)}
/>
))}

</div>

</div>

<div className="product-info">

<h1>{product.name}</h1>
<button
onClick={()=>{

let compare = JSON.parse(localStorage.getItem("compare")) || [];
let category = localStorage.getItem("compare_category");

if(compare.length === 0){

localStorage.setItem("compare_category", product.category_id);
compare.push(product.id);

}else{

if(category != product.category_id){

alert("You can only compare products from the same category");
return;

}

if(!compare.includes(product.id)){
compare.push(product.id);
}

}

localStorage.setItem("compare", JSON.stringify(compare));

alert("Added to compare");

}}
>

⚖️ Compare

</button>
<button
onClick={()=>{

fetch(`http://localhost:3000/products/${id}/favorite`,{
method:"POST"
})
.then(()=>alert("Added to favorites ❤️"))

}}
>

❤️ Save Product

</button>

{ratingInfo && ratingInfo.total > 0 && (

<p style={{marginTop:"5px",color:"#f59e0b"}}>
⭐ {Number(ratingInfo.average).toFixed(1)} / 5 ({ratingInfo.total} reviews)
</p>

)}

<p className="best-price">
Best price: {product.best_price} ₪
</p>

</div>

</div>

{/* PRICE COMPARISON */}

<h2 style={{marginTop:"40px"}}>Compare Prices</h2>

<table className="price-table">

<thead>
<tr>
<th>Store</th>
<th>Price</th>
</tr>
</thead>

<tbody>

{offers.map((offer,i)=>(
<tr key={i} className={i === 0 ? "best-price-row" : ""}>
<td>{offer.store_name}</td>
<td>
{offer.price} ₪
{i === 0 && <span className="best-badge">Best</span>}
</td>
</tr>
))}

</tbody>

</table>

{/* PRICE ALERT */}

<div style={{
marginTop:"40px",
padding:"20px",
border:"1px solid #eee",
borderRadius:"10px"
}}>

<h3>🔔 Notify me when price drops</h3>

<input
type="email"
placeholder="Your email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="number"
placeholder="Target price"
value={targetPrice}
onChange={(e)=>setTargetPrice(e.target.value)}
/>

<button onClick={createAlert}>
Create Alert
</button>

</div>

{/* REVIEWS */}

<h2 style={{marginTop:"40px"}}>Reviews</h2>

<div>

<select
value={rating}
onChange={(e)=>setRating(e.target.value)}
>

<option value="5">⭐ 5</option>
<option value="4">⭐ 4</option>
<option value="3">⭐ 3</option>
<option value="2">⭐ 2</option>
<option value="1">⭐ 1</option>

</select>

<textarea
placeholder="Write review..."
value={comment}
onChange={(e)=>setComment(e.target.value)}
/>

<button onClick={addReview}>
Submit Review
</button>

</div>

<div style={{marginTop:"20px"}}>

{reviews.map((r,i)=>(
<div key={i} style={{borderBottom:"1px solid #eee",padding:"10px 0"}}>
<strong>⭐ {r.rating}</strong>
<p>{r.comment}</p>
</div>
))}

</div>

{/* PRICE HISTORY */}

<h2 style={{marginTop:"40px"}}>Price History</h2>

<div style={{width:"100%",height:300}}>

<ResponsiveContainer width="100%" height="100%">

<LineChart data={history}>
<XAxis dataKey="date"/>
<YAxis/>
<Tooltip/>

<Line
type="monotone"
dataKey="price"
stroke="#16a34a"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>

{/* SIMILAR PRODUCTS */}

<h2 style={{marginTop:"40px"}}>Similar Products</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",
gap:"20px",
marginTop:"20px"
}}>

{similar.map(p=>(
<div key={p.id} className="product-card">
<img src={p.image} alt={p.name} style={{width:"100%"}}/>
<p>{p.name}</p>
</div>
))}

</div>

</div>

);

}

export default ProductPage;