/*
COMPONENT: Header
*/

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Header({search,setSearch,lang,setLang}){

const navigate = useNavigate();
const [suggestions,setSuggestions] = useState([]);

useEffect(()=>{

if(search.length < 2){
setSuggestions([]);
return;
}

fetch(`http://localhost:3000/products/search?q=${search}`)
.then(res=>res.json())
.then(data=>{
setSuggestions(data.slice(0,5));
});

},[search]);

function handleSearch(e){

if(e.key === "Enter"){

navigate(`/search?q=${search}`);
setSuggestions([]);

}

}

return(

<header style={{
background:"#f8fafc",
borderBottom:"1px solid #e5e7eb"
}}>

<div style={{
maxWidth:"1200px",
margin:"auto",
display:"flex",
alignItems:"center",
gap:"20px",
padding:"12px 20px"
}}>

{/* Logo */}

<Link
to="/"
style={{
fontSize:"22px",
fontWeight:"bold",
color:"#22c55e",
textDecoration:"none"
}}
>
PalPrice
</Link>

{/* Navigation */}

<nav style={{
display:"flex",
gap:"18px",
fontSize:"14px"
}}>

<Link to="/" style={{textDecoration:"none"}}>
{lang === "ar" ? "الرئيسية" : "Home"}
</Link>

<Link to="/" style={{textDecoration:"none"}}>
{lang === "ar" ? "الفئات" : "Categories"}
</Link>

<Link to="/deals">
{lang === "ar" ? "أفضل العروض" : "Deals"}
</Link>

<Link to="/" style={{textDecoration:"none"}}>
{lang === "ar" ? "الأكثر مشاهدة" : "Trending"}
</Link>

<Link to="/stores" style={{textDecoration:"none"}}>
{lang === "ar" ? "المتاجر" : "Stores"}
</Link>

</nav>

{/* Search */}

<div style={{
position:"relative",
flex:1
}}>

<input
type="text"
placeholder={lang === "ar" ? "ابحث عن منتج..." : "Search products"}
value={search}
onChange={(e)=>setSearch(e.target.value)}
onKeyDown={handleSearch}
style={{
width:"100%",
padding:"8px",
borderRadius:"6px",
border:"1px solid #ddd"
}}
/>

{suggestions.length > 0 && (

<div style={{
position:"absolute",
top:"40px",
left:0,
width:"100%",
background:"white",
border:"1px solid #eee",
borderRadius:"8px",
boxShadow:"0 5px 20px rgba(0,0,0,0.1)",
zIndex:100
}}>

{suggestions.map(product => (

<Link
key={product.id}
to={`/product/${product.id}`}
style={{
display:"block",
padding:"10px",
textDecoration:"none",
color:"#0f172a",
borderBottom:"1px solid #f1f5f9"
}}
>

{product.name}

</Link>

))}

</div>

)}

</div>

{/* Right side */}

<div style={{
display:"flex",
alignItems:"center",
gap:"12px"
}}>

{/* Favorites */}

<Link
to="/favorites"
style={{
fontSize:"18px",
textDecoration:"none"
}}
>
❤️
</Link>

{/* Language */}

<div
style={{
display:"flex",
alignItems:"center",
gap:"6px"
}}
>

<button
onClick={()=>setLang("ar")}
style={{
padding:"4px 10px",
borderRadius:"6px",
border:"1px solid #e5e7eb",
background:"#f1f5f9",
color:"#0f172a",
cursor:"pointer",
fontSize:"13px",
fontWeight:"500"
}}
>
العربية
</button>

<button
onClick={()=>setLang("en")}
style={{
padding:"4px 10px",
borderRadius:"6px",
border:"1px solid #e5e7eb",
background:"#f1f5f9",
color:"#0f172a",
cursor:"pointer",
fontSize:"13px",
fontWeight:"500"
}}
>
English
</button>

</div>

{/* Login */}

<Link
to="/store/login"
style={{
padding:"6px 14px",
borderRadius:"6px",
border:"1px solid #6366f1",
color:"#6366f1",
textDecoration:"none",
fontSize:"14px"
}}
>
{lang === "ar" ? "تسجيل الدخول" : "Login"}
</Link>

{/* Register */}

<Link
to="/store/register"
style={{
padding:"6px 14px",
borderRadius:"6px",
background:"#6366f1",
color:"white",
textDecoration:"none",
fontSize:"14px"
}}
>
{lang === "ar" ? "تسجيل متجر" : "Register"}
</Link>

</div>

</div>

</header>

);

}

export default Header;