import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export function PrivateRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  const needsOnboarding =
    !user?.companyId && user?.systemRole === "CompanyAdmin";
  if (needsOnboarding && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
