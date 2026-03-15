import { useEffect,useState } from "react";
import { Link } from "react-router-dom";

function Deals(){

const [deals,setDeals] = useState([]);

useEffect(()=>{

fetch("http://localhost:3000/prices/deals")
.then(res=>res.json())
.then(data=>{
if(Array.isArray(data)){
setDeals(data);
}
});

},[]);

return(

<div style={{padding:"40px"}}>

<h1>🔥 Best Deals</h1>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",
gap:"20px",
marginTop:"30px"
}}>

{deals.map(d => (

<Link key={d.id} to={`/product/${d.id}`}>

<div className="product-card">

<img
src={d.image}
style={{width:"100%"}}
/>

<h3>{d.name}</h3>

<p style={{color:"#ef4444"}}>

-{d.discount} ₪

</p>

<p>

<s>{d.highest_price} ₪</s>

</p>

<p style={{fontWeight:"bold"}}>

{d.lowest_price} ₪

</p>

</div>

</Link>

))}

</div>

</div>

);

}

export default Deals;