import { useEffect, useState } from "react";

function fixImg(url) {
  if (!url) return "";
  return url.startsWith("/") ? `/api${url}` : url;
}

/**
 * useProduct — fetches all data needed by ProductPage in a single hook
 *
 * Returns:
 *   product, siblings, offers, history, images, reviews, ratingInfo, similar,
 *   storeCoupons, storeCampaign, isFavorited, loading,
 *   setStoreCoupons, setStoreCampaign, setIsFavorited,
 *   setReviews, setRatingInfo, refresh
 */
export function useProduct(productId, userToken) {
  const [product,       setProduct]       = useState(null);
  const [siblings,      setSiblings]      = useState([]);
  const [offers,        setOffers]        = useState([]);
  const [history,       setHistory]       = useState([]);
  const [images,        setImages]        = useState([]);
  const [reviews,       setReviews]       = useState([]);
  const [ratingInfo,    setRatingInfo]    = useState(null);
  const [similar,       setSimilar]       = useState([]);
  const [storeCoupons,  setStoreCoupons]  = useState({});
  const [storeCampaign, setStoreCampaign] = useState(null);
  const [isFavorited,   setIsFavorited]   = useState(false);
  const [loading,       setLoading]       = useState(true);

  async function fetchAll() {
    if (!productId) return;
    setLoading(true);

    // Reset dependent state
    setStoreCampaign(null); setStoreCoupons({}); setSiblings([]); setProduct(null);

    try {
      // Core product data — fetch in parallel
      const [productData, imagesData, offersData, historyData, reviewsData, ratingData, similarData] = await Promise.all([
        fetch(`/api/products/${productId}`).then(r => r.json()),
        fetch(`/api/products/${productId}/images`).then(r => r.json()),
        fetch(`/api/prices/product/${productId}`).then(r => r.json()),
        fetch(`/api/prices/history/${productId}`).then(r => r.json()),
        fetch(`/api/products/${productId}/reviews`).then(r => r.json()),
        fetch(`/api/products/${productId}/rating`).then(r => r.json()),
        fetch(`/api/products/${productId}/similar`).then(r => r.json()),
      ]);

      setProduct(productData);
      setSiblings(productData.siblings || []);

      if (Array.isArray(imagesData)) setImages(imagesData);

      if (Array.isArray(offersData)) {
        setOffers(offersData);
        // Batch fetch coupons + campaigns
        const storeIds = [...new Set(offersData.map(o => o.store_id).filter(Boolean))];
        if (storeIds.length > 0) {
          fetch(`/api/coupons/batch?stores=${storeIds.join(",")}`)
            .then(r => r.json())
            .then(({ coupons = {}, campaigns = {} }) => {
              if (Object.keys(coupons).length > 0) setStoreCoupons(coupons);
              for (const sid of storeIds) {
                const arr = campaigns[String(sid)];
                if (arr && arr.length > 0) { setStoreCampaign({ ...arr[0], storeId: sid }); break; }
              }
            })
            .catch(() => {});
        }
      }

      if (Array.isArray(historyData)) {
        setHistory(historyData.map(item => ({
          price: Number(item.price),
          date: new Date(item.date).toLocaleDateString("ar-PS"),
        })));
      }

      if (Array.isArray(reviewsData)) setReviews(reviewsData);
      setRatingInfo(ratingData);
      if (Array.isArray(similarData)) setSimilar(similarData.slice(0, 8));
    } catch (err) {
      console.warn("[useProduct] fetch error:", err.message);
    }

    setLoading(false);
  }

  // Fetch user-specific data separately (favorites check)
  useEffect(() => {
    if (!userToken || !productId) return;
    fetch("/api/users/favorites", { headers: { Authorization: `Bearer ${userToken}` } })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setIsFavorited(data.some(p => String(p.id) === String(productId)));
      })
      .catch(() => {});
  }, [productId, userToken]);

  useEffect(() => {
    fetchAll();
  }, [productId, userToken]);

  return {
    product, siblings, offers, history, images,
    reviews, ratingInfo, similar,
    storeCoupons, storeCampaign,
    isFavorited, loading,
    setStoreCoupons, setStoreCampaign, setIsFavorited,
    setReviews, setRatingInfo,
    refresh: fetchAll,
    activeImage: product?.image ? fixImg(product.image) : "",
  };
}
