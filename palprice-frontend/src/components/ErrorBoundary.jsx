import { Component } from "react";

/**
 * ErrorBoundary — يمنع الشاشة البيضاء عند حدوث خطأ JavaScript في أي مكوّن
 *
 * الاستخدام:
 *   <ErrorBoundary>
 *     <SomeComponent />
 *   </ErrorBoundary>
 *
 *   أو مع fallback مخصص:
 *   <ErrorBoundary fallback={<p>حدث خطأ</p>}>
 *     <SomeComponent />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // في الإنتاج يمكن إرسال الخطأ لخدمة مثل Sentry
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "300px", padding: "40px 20px",
        textAlign: "center", fontFamily: "Tajawal, sans-serif",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px" }}>
          حدث خطأ غير متوقع
        </h2>
        <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 24px" }}>
          نعتذر عن الإزعاج. يمكنك تحديث الصفحة للمحاولة مجدداً.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 24px", background: "#22c55e", color: "white",
            border: "none", borderRadius: "10px", fontSize: "14px",
            fontWeight: "600", cursor: "pointer", fontFamily: "Tajawal, sans-serif",
          }}
        >
          تحديث الصفحة
        </button>
        {import.meta.env.DEV && this.state.error && (
          <details style={{ marginTop: "20px", textAlign: "left", maxWidth: "600px" }}>
            <summary style={{ cursor: "pointer", fontSize: "12px", color: "#94a3b8" }}>
              تفاصيل الخطأ (بيئة التطوير فقط)
            </summary>
            <pre style={{
              fontSize: "11px", color: "#ef4444", background: "#fef2f2",
              padding: "12px", borderRadius: "8px", marginTop: "8px",
              overflow: "auto", maxHeight: "200px",
            }}>
              {this.state.error.toString()}
            </pre>
          </details>
        )}
      </div>
    );
  }
}
