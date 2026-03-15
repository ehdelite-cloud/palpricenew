import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import ProductPage from "./ProductPage";
import CategoryPage from "./CategoryPage";
import StoreRegister from "./StoreRegister";
import StoreLogin from "./StoreLogin";
import AdminDashboard from "./AdminDashboard";
import Home from "./Home";

import Header from "./components/Header";
import Footer from "./components/Footer";
import StorePage from "./StorePage";
import StoresList from "./StoresList";
import SearchPage from "./SearchPage";

/* STORE DASHBOARD */

import StoreDashboard from "./dashboards/store/StoreDashboard";
import StoreProducts from "./dashboards/store/StoreProducts";
import AddProduct from "./dashboards/store/AddProduct";
import StoreProfile from "./dashboards/store/StoreProfile";
import StoreAnalytics from "./dashboards/store/StoreAnalytics";
import EditProduct from "./dashboards/store/EditProduct";
import ProductImages from "./dashboards/store/ProductImages";
import PriceCompetition from "./dashboards/store/PriceCompetition";
import Favorites from "./Favorites";
import Compare from "./Compare";
import Deals from "./Deals";

function App(){

const [lang,setLang] = useState("ar");
const [search,setSearch] = useState("");

return(

<>

<Header
search={search}
setSearch={setSearch}
lang={lang}
setLang={setLang}
/>

<Routes>

<Route
path="/"
element={<Home lang={lang} setLang={setLang} search={search} setSearch={setSearch}/>}
/>

<Route path="/product/:id" element={<ProductPage/>}/>
<Route path="/category/:id" element={<CategoryPage/>}/>
<Route path="/store/register" element={<StoreRegister/>}/>
<Route path="/store/login" element={<StoreLogin/>}/>

{/* STORE DASHBOARD */}

<Route path="/store/dashboard" element={<StoreDashboard/>}/>
<Route path="/store/dashboard/products" element={<StoreProducts/>}/>
<Route path="/store/dashboard/add-product" element={<AddProduct/>}/>
<Route path="/store/dashboard/profile" element={<StoreProfile/>}/>

{/* ADMIN */}

<Route path="/admin" element={<AdminDashboard/>}/>

{/* STORE PAGE */}

<Route path="/store/:id" element={<StorePage/>}/>

{/* STORES LIST */}

<Route path="/stores" element={<StoresList/>}/>

{/* SEARCH */}

<Route path="/search" element={<SearchPage/>}/>
<Route path="/store/dashboard/analytics" element={<StoreAnalytics/>}/>
<Route path="/store/dashboard/edit-product/:id" element={<EditProduct/>}/>
<Route path="/store/dashboard/product-images/:id" element={<ProductImages/>}/>
<Route path="/store/dashboard/competition" element={<PriceCompetition/>}/>
<Route path="/favorites" element={<Favorites/>}/>
<Route path="/compare" element={<Compare/>}/>
<Route path="/deals" element={<Deals/>}/>

</Routes>

<Footer lang={lang}/>

</>

);

}

export default App;