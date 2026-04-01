import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, useLocation } from "react-router-dom"
import { useEffect } from "react"
import ErrorBoundary from "./components/ErrorBoundary.jsx"
import { ToastProvider } from "./components/Toast.jsx"
import "./index.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </ToastProvider>
  </ErrorBoundary>
)