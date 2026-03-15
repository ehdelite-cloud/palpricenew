function Footer({lang}){

return(

<footer className="footer">

<div className="footer-container">

<div className="footer-section">

<h3>PalPrice</h3>

<p>
{lang === "ar"
? "موقع لمقارنة أسعار المنتجات بين المتاجر الفلسطينية"
: "A platform to compare product prices across Palestinian stores"}
</p>

</div>


<div className="footer-section">

<h4>
{lang === "ar" ? "روابط" : "Links"}
</h4>

<ul>

<li>
<a href="/">
{lang === "ar" ? "الرئيسية" : "Home"}
</a>
</li>

<li>
<a href="/">
{lang === "ar" ? "الفئات" : "Categories"}
</a>
</li>

<li>
<a href="/">
{lang === "ar" ? "أفضل العروض" : "Best Deals"}
</a>
</li>

</ul>

</div>


<div className="footer-section">

<h4>
{lang === "ar" ? "معلومات" : "Information"}
</h4>

<ul>

<li>
<a href="#">
{lang === "ar" ? "من نحن" : "About"}
</a>
</li>

<li>
<a href="#">
{lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
</a>
</li>

<li>
<a href="#">
{lang === "ar" ? "تواصل معنا" : "Contact"}
</a>
</li>

</ul>

</div>

</div>

<div className="footer-bottom">

© 2026 PalPrice

</div>

</footer>

);

}

export default Footer;