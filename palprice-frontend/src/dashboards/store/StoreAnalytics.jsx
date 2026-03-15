import { useEffect, useState } from "react";

function StoreAnalytics(){

const [stats,setStats] = useState(null);

useEffect(()=>{

fetch("http://localhost:3000/admin/analytics")
.then(res=>res.json())
.then(data=>{
setStats(data);
});

},[]);

if(!stats){
return <p style={{padding:"40px"}}>Loading analytics...</p>
}

return(

<div style={{padding:"40px"}}>

<h1>Store Analytics</h1>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
gap:"20px",
marginTop:"30px"
}}>

<div style={{background:"#f1f5f9",padding:"20px",borderRadius:"10px"}}>
<h3>Total Products</h3>
<p style={{fontSize:"22px"}}>{stats.products}</p>
</div>

<div style={{background:"#f1f5f9",padding:"20px",borderRadius:"10px"}}>
<h3>Total Stores</h3>
<p style={{fontSize:"22px"}}>{stats.stores}</p>
</div>

<div style={{background:"#f1f5f9",padding:"20px",borderRadius:"10px"}}>
<h3>Total Prices</h3>
<p style={{fontSize:"22px"}}>{stats.prices}</p>
</div>

<div style={{background:"#f1f5f9",padding:"20px",borderRadius:"10px"}}>
<h3>Most Viewed Product</h3>
<p style={{fontSize:"18px"}}>{stats.mostViewed}</p>
</div>

</div>

</div>

);

}

export default StoreAnalytics;