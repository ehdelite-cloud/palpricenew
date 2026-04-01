import { Navigate } from "react-router-dom";

/**
 * PrivateRoute — يحمي المسارات من الوصول غير المصرح به
 *   <PrivateRoute type="user">   ← يتحقق من userToken
 *   <PrivateRoute type="store">  ← يتحقق من storeId
 *
 * GuestRoute — يمنع المستخدم المسجّل من الوصول (login/register)
 *   <GuestRoute type="user">     ← يحوّل لـ / إذا كان مسجلاً
 *   <GuestRoute type="store">    ← يحوّل لـ /store/dashboard إذا كان متجراً مسجلاً
 */
export default function PrivateRoute({ children, type = "user", redirectTo }) {
  const isAuthorized = checkAuth(type);
  if (!isAuthorized) {
    return <Navigate to={redirectTo || getDefaultRedirect(type)} replace />;
  }
  return children;
}

export function GuestRoute({ children, type = "user", redirectTo }) {
  const isAuthorized = checkAuth(type);
  if (isAuthorized) {
    return <Navigate to={redirectTo || getLoggedInRedirect(type)} replace />;
  }
  return children;
}

function checkAuth(type) {
  switch (type) {
    case "user":  return !!localStorage.getItem("userToken");
    case "store": return !!localStorage.getItem("storeId");
    default:      return false;
  }
}

function getDefaultRedirect(type) {
  switch (type) {
    case "store": return "/store/login";
    default:      return "/login";
  }
}

function getLoggedInRedirect(type) {
  switch (type) {
    case "store": return "/store/dashboard";
    default:      return "/";
  }
}
