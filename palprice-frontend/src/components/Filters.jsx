function Filters({ setSort }) {

return (

<div className="filters">

<h3>Sort Products</h3>

<select onChange={(e)=>setSort(e.target.value)}>

<option value="">Default</option>

<option value="price_low">
Price: Low → High
</option>

<option value="price_high">
Price: High → Low
</option>

</select>

</div>

);

}

export default Filters;