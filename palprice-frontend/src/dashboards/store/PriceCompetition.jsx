import { useEffect, useState } from "react";

function PriceCompetition(){

const [data,setData] = useState([]);

useEffect(()=>{

fetch("http://localhost:3000/prices/competition")
.then(res=>res.json())
.then(d=>{
if(Array.isArray(d)){
setData(d);
}
});

},[]);

return(

<div style={{padding:"40px"}}>

<h1>Price Competition</h1>

<table style={{
width:"100%",
marginTop:"30px",
borderCollapse:"collapse"
}}>

<thead>

<tr style={{background:"#f1f5f9"}}>

<th style={{padding:"10px",textAlign:"left"}}>Product</th>
<th style={{padding:"10px",textAlign:"left"}}>Store</th>
<th style={{padding:"10px",textAlign:"left"}}>Price</th>

</tr>

</thead>

<tbody>

{data.map((p,i)=>{

const best = i === 0;

return(

<tr
key={i}
style={{
borderBottom:"1px solid #eee",
background: best ? "#ecfdf5" : "white"
}}
>

<td style={{padding:"10px"}}>
{p.product_name}
</td>

<td>
{p.store_name}
</td>

<td>

{p.price} ₪

{best && (
<span style={{
marginLeft:"10px",
color:"#16a34a",
fontWeight:"bold"
}}>
⭐ BEST PRICE
</span>
)}

</td>

</tr>

);

})}

</tbody>

</table>

</div>

);

}

export default PriceCompetition;