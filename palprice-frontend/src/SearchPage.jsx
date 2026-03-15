/*
PAGE: Search Results
وظيفة الصفحة:
عرض نتائج البحث عندما يبحث المستخدم عن منتج
الرابط سيكون مثل:
 /search?q=iphone
*/

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "./components/ProductCard";

function SearchPage(){

const location = useLocation();
const query = new URLSearchParams(location.search).get("q");

const [products,setProducts] = useState([]);

useEffect(()=>{

if(query){

fetch(`http://localhost:3000/products/search?q=${query}`)
.then(res=>res.json())
.then(data=>setProducts(data));

}

},[query]);

return(

<div className="container">

<h1 style={{marginTop:"40px"}}>
Search results for: {query}
</h1>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",
gap:"20px",
marginTop:"30px"
}}>

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

export default SearchPage;