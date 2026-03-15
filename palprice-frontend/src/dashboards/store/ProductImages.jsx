import { useParams } from "react-router-dom";
import { useEffect,useState } from "react";

function ProductImages(){

const { id } = useParams();

const [images,setImages] = useState([]);
const [file,setFile] = useState(null);

useEffect(()=>{

fetch(`http://localhost:3000/products/${id}/images`)
.then(res=>res.json())
.then(data=>{
if(Array.isArray(data)){
setImages(data);
}
});

},[id]);

function uploadImage(){

if(!file) return;

const formData = new FormData();
formData.append("image",file);
formData.append("product_id",id);

fetch("http://localhost:3000/upload/product-image",{
method:"POST",
body:formData
})
.then(res=>res.json())
.then(data=>{
setImages([...images,data]);
});

}

function deleteImage(imageId){

fetch(`http://localhost:3000/images/${imageId}`,{
method:"DELETE"
})
.then(()=>{
setImages(images.filter(i=>i.id !== imageId));
});

}

return(

<div style={{padding:"40px"}}>

<h1>Product Images</h1>

<input
type="file"
onChange={(e)=>setFile(e.target.files[0])}
/>

<button onClick={uploadImage}>
Upload Image
</button>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",
gap:"20px",
marginTop:"30px"
}}>

{images.map(img=>(

<div key={img.id}>

<img
src={"http://localhost:3000"+img.image_url}
style={{width:"100%"}}
/>

<button
onClick={()=>deleteImage(img.id)}
style={{background:"red",color:"#fff"}}
>
Delete
</button>

</div>

))}

</div>

</div>

);

}

export default ProductImages;