import { useEffect, useState, useCallback, useRef } from "react";

/**
 * useFetch — generic data fetching hook
 *
 * Usage:
 *   const { data, loading, error, refetch } = useFetch("/api/products/1");
 *   const { data } = useFetch(token ? "/api/users/me" : null, { token });
 *
 * @param {string|null} url  — null/undefined skips the fetch
 * @param {object} options
 *   @param {string}  options.token      — adds Authorization header
 *   @param {string}  options.method     — HTTP method (default "GET")
 *   @param {any}     options.body       — JSON body for POST/PUT
 *   @param {boolean} options.skip       — skip the fetch entirely
 *   @param {any}     options.fallback   — value to use when data is null (default null)
 */
export function useFetch(url, { token, method = "GET", body, skip = false, fallback = null } = {}) {
  const [data,    setData]    = useState(fallback);
  const [loading, setLoading] = useState(!skip && !!url);
  const [error,   setError]   = useState(null);
  const abortRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!url || skip) { setLoading(false); return; }

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: abortRef.current.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, token, method, JSON.stringify(body), skip]);

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, setData };
}
