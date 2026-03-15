import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function CategoryPage(){

  const { id } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(()=>{

    fetch("http://localhost:3000/products")
      .then(res=>res.json())
      .then(data=>{
        const filtered = data.filter(p => p.category_id == id);
        setProducts(filtered);
      });

  },[id]);

  return(

    <div style={{padding:"40px"}}>

      <h1>Category Products</h1>

      {products.map(product => (

        <div key={product.id} style={{
          border:"1px solid #ddd",
          padding:"20px",
          marginBottom:"15px",
          borderRadius:"8px"
        }}>

          <h3>{product.name}</h3>

          <p>Brand: {product.brand}</p>

          <p style={{color:"green"}}>
            Best Price: {product.best_price ? product.best_price + " ₪" : "No price"}
          </p>

          <Link to={`/product/${product.id}`}>
            View Prices →
          </Link>

        </div>

      ))}

    </div>

  );
}

export default CategoryPage;