import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "./components/ProductCard";

function StorePage(){

const { id } = useParams();

const [store,setStore] = useState(null);
const [products,setProducts] = useState([]);
const [rating,setRating] = useState(null);

const [userRating,setUserRating] = useState(0);
const [comment,setComment] = useState("");

/* LOAD STORE DATA */

useEffect(()=>{

// store info
fetch(`http://localhost:3000/stores/${id}`)
.then(res=>res.json())
.then(data=>setStore(data));

// store products
fetch(`http://localhost:3000/stores/${id}/products`)
.then(res=>res.json())
.then(data=>setProducts(data));

// store rating
fetch(`http://localhost:3000/stores/${id}/rating`)
.then(res=>res.json())
.then(data=>setRating(data));

},[id]);

/* SUBMIT REVIEW */

function submitReview(){

fetch(`http://localhost:3000/stores/${id}/review`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
rating:userRating,
comment:comment
})
})
.then(res=>res.json())
.then(()=>{

// reload rating
fetch(`http://localhost:3000/stores/${id}/rating`)
.then(res=>res.json())
.then(data=>setRating(data));

setUserRating(0);
setComment("");

});

}

if(!store){
return <p style={{padding:"40px"}}>Loading...</p>
}

return(

<div className="container">

<h1 style={{marginTop:"30px"}}>
{store.name}
</h1>

{/* STORE RATING */}

{rating && rating.total > 0 && (

<p style={{color:"#f59e0b",marginTop:"5px"}}>

⭐ {Number(rating.average).toFixed(1)} ({rating.total} reviews)

</p>

)}

{/* ADD REVIEW */}

<div style={{
marginTop:"20px",
padding:"20px",
border:"1px solid #eee",
borderRadius:"10px"
}}>

<h3>Rate this store</h3>

<div style={{marginBottom:"10px"}}>

{[1,2,3,4,5].map((star)=>{

return (

<span
key={star}
onClick={()=>setUserRating(star)}
style={{
cursor:"pointer",
fontSize:"26px",
marginRight:"5px",
color: userRating >= star ? "#f59e0b" : "#cbd5e1"
}}
>

★
</span>

)

})}

</div>

<textarea
placeholder="Write a comment..."
value={comment}
onChange={(e)=>setComment(e.target.value)}
style={{
width:"100%",
padding:"10px",
marginBottom:"10px"
}}
/>

<button
onClick={submitReview}
style={{
background:"#2563eb",
color:"white",
border:"none",
padding:"10px 20px",
borderRadius:"6px",
cursor:"pointer"
}}
>

Submit Review

</button>

</div>

<p style={{color:"#64748b",marginBottom:"30px",marginTop:"30px"}}>

Products from this store

</p>

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",
gap:"20px"
}}
>

{products.map(product => (

<ProductCard
key={product.id}
product={product}
/>

))}

</div>

</div>

);

}

export default StorePage;