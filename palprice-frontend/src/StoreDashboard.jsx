import { useEffect, useState } from "react";

function StoreDashboard(){

  const [products,setProducts] = useState([]);
  const [productId,setProductId] = useState("");
  const [price,setPrice] = useState("");
  const [myPrices,setMyPrices] = useState([]);
  const storeId = localStorage.getItem("store");
  const token = localStorage.getItem("token");

if(!token){
  window.location.href="/store/login";
}

  useEffect(()=>{

    // جلب المنتجات
    fetch("http://localhost:3000/products")
      .then(res=>res.json())
      .then(data=>setProducts(data));

    // جلب أسعار المتجر
    fetch(`http://localhost:3000/prices/store/${storeId}`)
      .then(res=>res.json())
      .then(data=>setMyPrices(data));

  },[storeId]);


  const addPrice = () => {

    fetch("http://localhost:3000/prices",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        product_id:productId,
        store_id:storeId,
        price:price
      })
    })
    .then(res=>res.json())
    .then(data=>{
      alert("Price Added Successfully");

      // تحديث قائمة الأسعار
      setMyPrices(prev => [
        ...prev,
        { name: products.find(p => p.id == productId)?.name, price }
      ]);

      setPrice("");
    });

  };


  return(

    <div style={{padding:"40px"}}>

      <h1>Store Dashboard</h1>

      <h3>Add Product Price</h3>

      <select onChange={(e)=>setProductId(e.target.value)}>

        <option>Select Product</option>

        {products.map(p=>(
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}

      </select>

      <br/><br/>

      <input
        placeholder="Price"
        value={price}
        onChange={(e)=>setPrice(e.target.value)}
      />

      <br/><br/>

      <button onClick={addPrice}>
        Add Price
      </button>


      <h3 style={{marginTop:"40px"}}>My Prices</h3>

      {myPrices.map((p,index)=>(
        <div key={index} style={{
          border:"1px solid #ddd",
          padding:"10px",
          marginBottom:"10px",
          borderRadius:"6px"
        }}>
          {p.name} — {p.price} ₪
        </div>
      ))}

    </div>

  );

}

export default StoreDashboard;