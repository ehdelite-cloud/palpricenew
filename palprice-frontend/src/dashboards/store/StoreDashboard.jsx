import { Link } from "react-router-dom";

function StoreDashboard(){

return(

<div style={{padding:"40px"}}>

<h1>Store Dashboard</h1>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
gap:"20px",
marginTop:"30px"
}}>

<Link to="/store/dashboard/products" className="dash-card">
My Products
</Link>

<Link to="/store/dashboard/add-product" className="dash-card">
Add Product
</Link>

<Link to="/store/dashboard/profile" className="dash-card">
Store Profile
</Link>

<Link to="/store/dashboard/analytics" className="dash-card">
Analytics
</Link>
<Link to="/store/dashboard/competition" className="dash-card">
Price Competition
</Link>

</div>

</div>

);

}

export default StoreDashboard;