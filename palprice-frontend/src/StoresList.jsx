/*
PAGE: Stores List
وظيفة الصفحة:
عرض جميع المتاجر الموجودة في الموقع
وإمكانية الدخول لصفحة كل متجر
*/

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function StoresList(){

const [stores,setStores] = useState([]);

useEffect(()=>{

fetch("http://localhost:3000/stores")
.then(res=>res.json())
.then(data=>setStores(data));

},[]);

return(

<div className="container">

<h1 style={{marginTop:"40px"}}>
All Stores
</h1>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",
gap:"20px",
marginTop:"30px"
}}>

{stores.map(store => (

<Link
key={store.id}
to={`/store/${store.id}`}
className="card"
style={{textDecoration:"none"}}
>

<h3>{store.name}</h3>

<p style={{color:"#64748b"}}>
View store products
</p>

</Link>

))}

</div>

</div>

);

}

export default StoresList;