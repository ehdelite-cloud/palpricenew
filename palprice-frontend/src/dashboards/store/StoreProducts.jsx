import { useEffect, useState } from "react";

function StoreProducts(){

const [products,setProducts] = useState([]);

useEffect(()=>{

fetch("http://localhost:3000/products")
.then(res=>res.json())
.then(data=>{
if(Array.isArray(data)){
setProducts(data);
}
});

},[]);

function deleteProduct(id){

if(!window.confirm("Delete this product?")) return;

fetch(`http://localhost:3000/products/${id}`,{
method:"DELETE"
})
.then(()=>{
setProducts(products.filter(p=>p.id !== id));
});

}

return(

<div style={{padding:"40px"}}>

<h1>My Products</h1>

<div style={{marginTop:"20px"}}>

<a href="/store/dashboard/add-product">
<button>Add New Product</button>
</a>

</div>

<table style={{
width:"100%",
marginTop:"30px",
borderCollapse:"collapse"
}}>

<thead>

<tr style={{background:"#f1f5f9"}}>

<th style={{padding:"10px"}}>Image</th>
<th>Name</th>
<th>Brand</th>
<th>Views</th>
<th>Actions</th>

</tr>

</thead>

<tbody>

{products.map(p=>(

<tr key={p.id} style={{borderBottom:"1px solid #eee"}}>

<td style={{padding:"10px"}}>

<img
src={p.image}
style={{width:"60px"}}
/>

</td>

<td>{p.name}</td>
<td>{p.brand}</td>
<td>{p.views}</td>

<td>
    <a href={`/store/dashboard/product-images/${p.id}`}>
<button>Images</button>
</a>
<a href={`/store/dashboard/edit-product/${p.id}`}>
<button>Edit</button>
</a>
<button
onClick={()=>deleteProduct(p.id)}
style={{background:"red",color:"#fff"}}
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

);

}

export default StoreProducts;