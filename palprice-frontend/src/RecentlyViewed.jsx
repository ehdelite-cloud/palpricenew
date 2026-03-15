import { useEffect,useState } from "react";
import { Link } from "react-router-dom";

function RecentlyViewed(){

const [products,setProducts] = useState([]);

useEffect(()=>{

let ids = JSON.parse(localStorage.getItem("recent")) || [];

if(ids.length === 0) return;

fetch(`http://localhost:3000/products/compare?ids=${ids.join(",")}`)
.then(res=>res.json())
.then(data=>{
if(Array.isArray(data)){
setProducts(data);
}
});

},[]);

return(

<div style={{padding:"40px"}}>

<h2>👀 Recently Viewed</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",
gap:"20px",
marginTop:"20px"
}}>

{products.map(p=>(

<Link key={p.id} to={`/product/${p.id}`}>

<div className="product-card">

<img
src={p.image}
style={{width:"100%"}}
/>

<p>{p.name}</p>

</div>

</Link>

))}

</div>

</div>

);

}

export default RecentlyViewed;