import { useEffect,useState } from "react";
import { useParams,useNavigate } from "react-router-dom";

function EditProduct(){

const { id } = useParams();
const navigate = useNavigate();

const [name,setName] = useState("");
const [brand,setBrand] = useState("");
const [description,setDescription] = useState("");

useEffect(()=>{

fetch(`http://localhost:3000/products/${id}`)
.then(res=>res.json())
.then(data=>{
setName(data.name);
setBrand(data.brand);
setDescription(data.description);
});

},[id]);

function updateProduct(){

fetch(`http://localhost:3000/products/${id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name,
brand,
description
})
})
.then(()=>{
alert("Product updated");
navigate("/store/dashboard/products");
});

}

return(

<div style={{padding:"40px"}}>

<h1>Edit Product</h1>

<input
value={name}
onChange={(e)=>setName(e.target.value)}
placeholder="Product name"
/>

<input
value={brand}
onChange={(e)=>setBrand(e.target.value)}
placeholder="Brand"
/>

<textarea
value={description}
onChange={(e)=>setDescription(e.target.value)}
placeholder="Description"
/>

<button onClick={updateProduct}>
Update Product
</button>

</div>

);

}

export default EditProduct;