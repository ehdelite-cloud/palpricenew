import { useEffect, useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";

function PriceCompetition({ lang = "ar" }) {
  const storeId = localStorage.getItem("storeId");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (!storeId) { setLoading(false); return; }
    fetch(`/api/stores/${storeId}/competition`)
      .then(res => res.json())
      .then(d => { if (Array.isArray(d)) setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [storeId]);

  // تجميع البيانات حسب المنتج
  const grouped = {};
  data.forEach(row => {
    if (!grouped[row.product_id]) {
      grouped[row.product_id] = { name: row.product_name, rows: [] };
    }
    grouped[row.product_id].rows.push(row);
  });

  const allProducts = Object.entries(grouped);
  // منتجات حصرية — فقط عندك
  const onlyMine = allProducts.filter(([_, g]) => g.rows.length === 1);
  // منتجات مشتركة — فيها متاجر ثانية
  const shared = allProducts.filter(([_, g]) => g.rows.length > 1);

  // أنت الأرخص فيها
  const iAmBest = shared.filter(([_, g]) => {
    const myPrice = g.rows.find(r => r.is_mine)?.price;
    const best = Math.min(...g.rows.map(r => Number(r.price)));
    return myPrice && Number(myPrice) === best;
  });

  // فيها منافس أرخص منك ← هذا هو "منتج فيه منافسة"
  const hasCompetitor = shared.filter(([_, g]) => {
    const myPrice = g.rows.find(r => r.is_mine)?.price;
    const best = Math.min(...g.rows.map(r => Number(r.price)));
    return myPrice && Number(myPrice) > best;
  });

  function getFiltered() {
    let list;
    if (activeFilter === "competitor") list = hasCompetitor;
    else if (activeFilter === "best") list = iAmBest;
    else if (activeFilter === "exclusive") list = onlyMine;
    else list = allProducts;

    return list.filter(([_, g]) => g.name.toLowerCase().includes(search.toLowerCase()));
  }

  const filtered = getFiltered();

  const summaryCards = [
    {
      key: "competitor",
      value: hasCompetitor.length,
      label: lang === "ar" ? "منتج فيه منافسة" : "Has Competitor",
      icon: "⚡",
      color: "#f97316",
      bg: "#fff7ed",
      border: "#fed7aa",
      desc: lang === "ar" ? "متاجر أرخص منك" : "Others cheaper than you"
    },
    {
      key: "best",
      value: iAmBest.length,
      label: lang === "ar" ? "أنت الأرخص فيها" : "Best Price",
      icon: "🏆",
      color: "#22c55e",
      bg: "#f0fdf4",
      border: "#bbf7d0",
      desc: lang === "ar" ? "أنت الأرخص" : "You have the best price"
    },
    {
      key: "exclusive",
      value: onlyMine.length,
      label: lang === "ar" ? "منتج حصري عندك" : "Exclusive",
      icon: "🔒",
      color: "#3b82f6",
      bg: "#eff6ff",
      border: "#bfdbfe",
      desc: lang === "ar" ? "لا منافس لك" : "No competition"
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <DashboardSidebar lang={lang} />

      <main style={{ flex: 1, padding: "40px" }}>

        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            ⚡ {lang === "ar" ? "مراقبة المنافسة" : "Price Competition"}
          </h1>
          <p style={{ color: "#64748b", marginTop: "4px", fontSize: "14px" }}>
            {lang === "ar" ? "اضغط على أي كارد لتصفية النتائج" : "Click any card to filter results"}
          </p>
        </div>

        {/* Summary Cards */}
        {!loading && (
          <div style={{ display: "flex", gap: "14px", marginBottom: "24px", flexWrap: "wrap" }}>

            {/* كارد الكل */}
            <div
              onClick={() => setActiveFilter("all")}
              style={{
                background: activeFilter === "all" ? "#0f172a" : "white",
                borderRadius: "10px",
                border: `1px solid ${activeFilter === "all" ? "#0f172a" : "#e2e8f0"}`,
                padding: "14px 20px",
                display: "flex", alignItems: "center", gap: "10px",
                cursor: "pointer", transition: "all 0.2s", userSelect: "none"
              }}
            >
              <span style={{ fontSize: "18px" }}>📋</span>
              <div>
                <p style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: activeFilter === "all" ? "white" : "#0f172a" }}>
                  {allProducts.length}
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: activeFilter === "all" ? "#94a3b8" : "#64748b" }}>
                  {lang === "ar" ? "كل المنتجات" : "All"}
                </p>
              </div>
            </div>

            {summaryCards.map(card => {
              const isActive = activeFilter === card.key;
              return (
                <div
                  key={card.key}
                  onClick={() => setActiveFilter(isActive ? "all" : card.key)}
                  style={{
                    background: isActive ? card.color : "white",
                    borderRadius: "10px",
                    border: `1px solid ${isActive ? card.color : card.border}`,
                    padding: "14px 20px",
                    display: "flex", alignItems: "center", gap: "12px",
                    cursor: "pointer", transition: "all 0.2s",
                    boxShadow: isActive ? `0 4px 14px ${card.color}40` : "none",
                    userSelect: "none",
                    transform: isActive ? "translateY(-2px)" : "none"
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = card.bg; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "white"; }}
                >
                  <span style={{ fontSize: "22px" }}>{card.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: isActive ? "white" : card.color }}>
                      {card.value}
                    </p>
                    <p style={{ margin: 0, fontSize: "11px", color: isActive ? "rgba(255,255,255,0.8)" : "#64748b" }}>
                      {card.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Search */}
        <input
          type="text"
          placeholder={lang === "ar" ? "ابحث عن منتج..." : "Search..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", maxWidth: "360px", padding: "10px 14px",
            borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px",
            marginBottom: "16px", background: "white", boxSizing: "border-box",
            fontFamily: "Tajawal, sans-serif", outline: "none"
          }}
        />

        {/* Active Filter Label */}
        {activeFilter !== "all" && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 14px", borderRadius: "99px", background: "#f1f5f9",
            marginBottom: "16px", fontSize: "13px", color: "#475569"
          }}>
            <span>{summaryCards.find(c => c.key === activeFilter)?.icon}</span>
            <span>{summaryCards.find(c => c.key === activeFilter)?.label}</span>
            <button onClick={() => setActiveFilter("all")}
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "14px", padding: "0 0 0 4px" }}>
              ✕
            </button>
          </div>
        )}

        {loading ? (
          <p style={{ color: "#64748b" }}>{lang === "ar" ? "جاري التحميل..." : "Loading..."}</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>
              {activeFilter === "exclusive" ? "🔒" : activeFilter === "best" ? "🏆" : activeFilter === "competitor" ? "⚡" : "📭"}
            </div>
            <h3 style={{ color: "#0f172a", marginBottom: "8px" }}>
              {activeFilter === "exclusive" ? (lang === "ar" ? "لا توجد منتجات حصرية" : "No exclusive products")
                : activeFilter === "best" ? (lang === "ar" ? "لا توجد منتجات أنت الأرخص فيها" : "No best price products")
                : activeFilter === "competitor" ? (lang === "ar" ? "لا يوجد منافس أرخص منك 🎉" : "No cheaper competitors 🎉")
                : (lang === "ar" ? "لا توجد نتائج" : "No results")}
            </h3>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {filtered.map(([productId, group]) => {
              const isExclusive = group.rows.length === 1;
              const myRow = group.rows.find(r => r.is_mine);
              const bestPriceVal = Math.min(...group.rows.map(r => Number(r.price)));
              const isBest = myRow && Number(myRow.price) === bestPriceVal;
              const competitors = group.rows.filter(r => !r.is_mine);

              return (
                <div key={productId} style={{
                  background: "white", borderRadius: "12px",
                  border: `1px solid ${isExclusive ? "#bfdbfe" : isBest ? "#bbf7d0" : "#fecaca"}`,
                  overflow: "hidden"
                }}>
                  <div style={{
                    padding: "14px 20px",
                    background: isExclusive ? "#eff6ff" : isBest ? "#f0fdf4" : "#fef2f2",
                    borderBottom: isExclusive ? "none" : "1px solid #e2e8f0",
                    display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span>{isExclusive ? "🔒" : isBest ? "📦" : "⚡"}</span>
                      <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: 0 }}>
                        {group.name}
                      </h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {isExclusive ? (
                        <span style={{ background: "#3b82f6", color: "white", padding: "3px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: "700" }}>
                          🔒 {lang === "ar" ? "حصري" : "Exclusive"}
                        </span>
                      ) : isBest ? (
                        <span style={{ background: "#22c55e", color: "white", padding: "3px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: "700" }}>
                          🏆 {lang === "ar" ? "أنت الأرخص" : "Best Price"}
                        </span>
                      ) : (
                        <span style={{ background: "#fef2f2", color: "#dc2626", padding: "3px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: "600", border: "1px solid #fecaca" }}>
                          ⚡ {lang === "ar" ? `منافس أرخص بـ ${(Number(myRow?.price || 0) - bestPriceVal).toFixed(0)} ₪` : `Competitor cheaper by ${(Number(myRow?.price || 0) - bestPriceVal).toFixed(0)} ₪`}
                        </span>
                      )}
                      {!isExclusive && (
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                          {competitors.length} {lang === "ar" ? "منافس" : "competitors"}
                        </span>
                      )}
                    </div>
                  </div>

                  {!isExclusive && (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#fafafa" }}>
                          {[lang === "ar" ? "المتجر" : "Store", lang === "ar" ? "السعر" : "Price", lang === "ar" ? "الفرق" : "Diff"].map((h, i) => (
                            <th key={i} style={{ padding: "10px 20px", textAlign: "right", fontSize: "12px", color: "#94a3b8", fontWeight: "600", borderBottom: "1px solid #f1f5f9" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {group.rows.sort((a, b) => Number(a.price) - Number(b.price)).map((row, i) => {
                          const diff = Number(row.price) - bestPriceVal;
                          return (
                            <tr key={i} style={{ borderBottom: "1px solid #f8fafc", background: row.is_mine ? (isBest ? "#f0fdf4" : "#fef9f9") : "white" }}>
                              <td style={{ padding: "12px 20px", fontSize: "14px", color: "#0f172a" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  {row.is_mine && (
                                    <span style={{ background: "#22c55e", color: "white", fontSize: "10px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px" }}>
                                      {lang === "ar" ? "أنا" : "Me"}
                                    </span>
                                  )}
                                  {row.store_name}
                                </div>
                              </td>
                              <td style={{ padding: "12px 20px", fontSize: "15px", fontWeight: diff === 0 ? "700" : "400", color: diff === 0 ? "#16a34a" : "#0f172a" }}>
                                {row.price} ₪
                              </td>
                              <td style={{ padding: "12px 20px" }}>
                                {diff === 0
                                  ? <span style={{ color: "#22c55e", fontSize: "13px", fontWeight: "600" }}>✓ {lang === "ar" ? "الأرخص" : "Best"}</span>
                                  : <span style={{ color: "#ef4444", fontSize: "13px" }}>+{diff.toFixed(0)} ₪</span>
                                }
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default PriceCompetition;