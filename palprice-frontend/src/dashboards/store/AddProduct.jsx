import { useState } from "react";

function AddProduct(){

const [name,setName] = useState("");
const [brand,setBrand] = useState("");
const [category,setCategory] = useState("");
const [description,setDescription] = useState("");
const [image,setImage] = useState("");

function addProduct(){

fetch("http://localhost:3000/products",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name,
brand,
category,
description,
image
})
})
.then(res=>res.json())
.then(()=>{

alert("Product added");

setName("");
setBrand("");
setCategory("");
setDescription("");
setImage("");

});

}

return(

<div style={{padding:"40px"}}>

<h1>Add Product</h1>

<input
placeholder="Product name"
value={name}
onChange={e=>setName(e.target.value)}
/>

<input
placeholder="Brand"
value={brand}
onChange={e=>setBrand(e.target.value)}
/>

<input
placeholder="Category"
value={category}
onChange={e=>setCategory(e.target.value)}
/>

<textarea
placeholder="Description"
value={description}
onChange={e=>setDescription(e.target.value)}
/>

<input
placeholder="Image URL"
value={image}
onChange={e=>setImage(e.target.value)}
/>

<button onClick={addProduct}>
Add Product
</button>

</div>

);

}

export default AddProduct;