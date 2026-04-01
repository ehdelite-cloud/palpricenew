import { useEffect, useState } from "react";

/**
 * useStore — fetches all data needed by StorePage
 *
 * Returns:
 *   store, products, rating, tree, loading,
 *   setRating, refresh
 */
export function useStore(storeId) {
  const [store,    setStore]    = useState(null);
  const [products, setProducts] = useState([]);
  const [rating,   setRating]   = useState(null);
  const [tree,     setTree]     = useState([]);
  const [loading,  setLoading]  = useState(true);

  async function fetchAll() {
    if (!storeId) return;
    setLoading(true);
    try {
      const [storeData, productsData, ratingData, treeData] = await Promise.all([
        fetch(`/api/stores/${storeId}`).then(r => r.json()),
        fetch(`/api/stores/${storeId}/products`).then(r => r.json()),
        fetch(`/api/stores/${storeId}/rating`).then(r => r.json()),
        fetch("/api/categories/tree").then(r => r.json()),
      ]);
      setStore(storeData);
      setProducts(Array.isArray(productsData) ? productsData.filter(p => p.status === "approved") : []);
      setRating(ratingData);
      if (Array.isArray(treeData)) setTree(treeData);
    } catch (err) {
      console.warn("[useStore] fetch error:", err.message);
    }
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, [storeId]);

  return { store, products, rating, tree, loading, setRating, refresh: fetchAll };
}
