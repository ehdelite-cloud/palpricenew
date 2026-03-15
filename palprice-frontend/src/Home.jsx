import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./components/ProductCard";
import Filters from "./components/Filters";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import RecentlyViewed from "./RecentlyViewed";

function Home({ lang, search, setSearch }) {

const [products, setProducts] = useState([]);
const [categories, setCategories] = useState([]);
const [trending, setTrending] = useState([]);
const [drops, setDrops] = useState([]);
const [loading, setLoading] = useState(true);
const [sort,setSort] = useState("");
const [page,setPage] = useState(1);

const productsPerPage = 12;

/* TRENDING */

useEffect(()=>{
fetch("http://localhost:3000/products/trending")
.then(res=>res.json())
.then(data=>setTrending(data));
},[]);

/* PRICE DROPS */

useEffect(()=>{
fetch("http://localhost:3000/products/price-drops")
.then(res=>res.json())
.then(data=>setDrops(data));
},[]);

/* PRODUCTS */

useEffect(()=>{

const url =
search === ""
? "http://localhost:3000/products"
: `http://localhost:3000/products/search?q=${search}`;

setLoading(true);

fetch(url)
.then(res=>res.json())
.then(data=>{
setProducts(data);
setLoading(false);
});

},[search]);

/* CATEGORIES */

useEffect(()=>{
fetch("http://localhost:3000/categories")
.then(res=>res.json())
.then(data=>setCategories(data));
},[]);

/* SORTING */

let sortedProducts = [...products];

if(sort === "price_low"){
sortedProducts.sort((a,b)=>a.best_price - b.best_price);
}

if(sort === "price_high"){
sortedProducts.sort((a,b)=>b.best_price - a.best_price);
}

const start = (page - 1) * productsPerPage;
const end = start + productsPerPage;

const paginatedProducts = sortedProducts.slice(start,end);

return(

<div>

{/* HERO */}

<div className="hero">

<h1 className="hero-title">
{lang === "ar"
? "قارن أسعار المنتجات بين المتاجر الفلسطينية"
: "Compare product prices across Palestinian stores"}
</h1>

<p className="hero-sub">
{lang === "ar"
? "اعثر على أفضل سعر لأي منتج خلال ثوانٍ"
: "Find the best price for any product in seconds"}
</p>

<input
type="text"
placeholder={lang === "ar" ? "ابحث عن منتج..." : "Search for a product..."}
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="hero-search"
/>

</div>

{/* STATS */}

<div className="stats">

<div className="stat">
<h3>10K+</h3>
<p>{lang === "ar" ? "منتج" : "Products"}</p>
</div>

<div className="stat">
<h3>120+</h3>
<p>{lang === "ar" ? "متجر" : "Stores"}</p>
</div>

<div className="stat">
<h3>50K+</h3>
<p>{lang === "ar" ? "مستخدم" : "Users"}</p>
</div>

<div className="stat">
<h3>24/7</h3>
<p>{lang === "ar" ? "تحديث الأسعار" : "Price Updates"}</p>
</div>

</div>

{/* CATEGORIES */}

<div className="featured-categories">

<h2>
{lang === "ar" ? "تصفح حسب الفئة" : "Browse by Category"}
</h2>

<div className="category-grid">

{categories.slice(0,6).map(cat => (

<Link
key={cat.id}
to={`/category/${cat.id}`}
className="category-card"
>

<div className="category-icon">📦</div>
<h3>{cat.name}</h3>

</Link>

))}

</div>

</div>

{/* TRENDING */}


<div className="container">

<h2>
{lang === "ar" ? "المنتجات الأكثر مشاهدة" : "Trending Products"}
</h2>

<Swiper
modules={[Navigation, Autoplay]}
spaceBetween={20}
slidesPerView={4}
navigation
loop={true}
autoplay={{delay:2000}}
>

{trending.map(product => (

<SwiperSlide key={product.id}>

<ProductCard
product={{...product, badge:"trending"}}
lang={lang}
/>

</SwiperSlide>

))}

</Swiper>
{/* BEST DEALS */}

<h2 style={{marginTop:"40px"}}>
{lang === "ar" ? "أفضل العروض" : "Best Deals"}
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",
gap:"20px",
marginTop:"20px"
}}>

{products.slice(0,4).map(product => (

<ProductCard
key={product.id}
product={{...product, badge:"deal"}}
lang={lang}
/>

))}

</div>
{/* PRICE DROPS */}

<h2 style={{marginTop:"40px"}}>
{lang === "ar" ? "انخفاض الأسعار" : "Price Drops"}
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",
gap:"20px",
marginTop:"20px"
}}>

{drops.map(product => (

<ProductCard
key={product.id}
product={{...product, badge:"drop"}}
lang={lang}
/>

))}

</div>

</div>

{/* ALL PRODUCTS */}

<div style={{
padding:"40px",
maxWidth:"1200px",
margin:"0 auto"
}}>

<h2>
{lang === "ar" ? "كل المنتجات" : "All Products"}
</h2>

<Filters setSort={setSort}/>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",
gap:"20px",
marginTop:"20px"
}}>

{loading ? (

Array(6).fill().map((_,i)=>(
<div key={i} className="skeleton-card"></div>
))

) : (

paginatedProducts.map(product => (

<ProductCard
key={product.id}
product={product}
lang={lang}
/>

))

)}

</div>

</div>

{/* RECENTLY VIEWED */}

<RecentlyViewed/>

</div>

);

}

export default Home;
