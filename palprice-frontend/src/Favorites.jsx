import { useEffect,useState } from "react";
import { Link } from "react-router-dom";

function Favorites(){

const [products,setProducts] = useState([]);

useEffect(()=>{

fetch("http://localhost:3000/products/favorites")
.then(res=>res.json())
.then(data=>{
if(Array.isArray(data)){
setProducts(data);
}
});

},[]);

return(

<div style={{padding:"40px"}}>

<h1>❤️ My Favorites</h1>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",
gap:"20px",
marginTop:"30px"
}}>

{products.map(p=>(

<Link key={p.id} to={`/product/${p.id}`}>

<div className="product-card">

<img
src={p.image}
alt={p.name}
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

export default Favorites;