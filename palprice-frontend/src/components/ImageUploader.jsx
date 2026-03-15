import { useState } from "react";

function ImageUploader({ productId }){

const [images,setImages] = useState([]);
const [preview,setPreview] = useState([]);

function handleSelect(e){

const files = Array.from(e.target.files);

setImages(files);

const previews = files.map(file => URL.createObjectURL(file));

setPreview(previews);

}

function uploadImages(){

images.forEach(file => {

const formData = new FormData();

formData.append("image",file);

fetch(`http://localhost:3000/products/${productId}/image`,{
method:"POST",
body:formData
})
.then(res=>res.json())
.then(data=>{
console.log("uploaded",data);
});

});

alert("Images uploaded");

}

return(

<div style={{marginTop:"20px"}}>

<h3>Upload Product Images</h3>

<input
type="file"
multiple
onChange={handleSelect}
/>

<div style={{
display:"flex",
gap:"10px",
marginTop:"10px"
}}>

{preview.map((src,i)=>(
<img
key={i}
src={src}
alt="preview"
style={{width:"80px"}}
/>
))}

</div>

<button
onClick={uploadImages}
style={{marginTop:"10px"}}
>

Upload Images

</button>

</div>

);

}

export default ImageUploader;