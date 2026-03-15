import { useEffect,useState } from "react";

function Compare(){

const [products,setProducts] = useState([]);

useEffect(()=>{

let ids = JSON.parse(localStorage.getItem("compare")) || [];

if(ids.length === 0) return;

fetch(`http://localhost:3000/products/compare?ids=${ids.join(",")}`)
.then(res=>res.json())
.then(data=>{
if(Array.isArray(data)){
setProducts(data);
}else{
console.log("Compare API error:", data);
setProducts([]);
}
});

},[]);

return(

<div style={{padding:"40px"}}>

<h1>⚖️ Compare Products</h1>

<table style={{
width:"100%",
marginTop:"30px",
borderCollapse:"collapse"
}}>

<thead>

<tr style={{background:"#f1f5f9"}}>

<th style={{padding:"10px"}}>Product</th>
<th>Image</th>
<th>Brand</th>
<th>Best Price</th>

</tr>

</thead>

<tbody>

{products.map(p=>(

<tr key={p.id} style={{borderBottom:"1px solid #eee"}}>

<td style={{padding:"10px"}}>{p.name}</td>

<td>
<img src={p.image} style={{width:"80px"}} />
</td>

<td>{p.brand}</td>

<td>{p.best_price} ₪</td>

</tr>

))}

</tbody>

</table>

</div>

);

}

export default Compare;