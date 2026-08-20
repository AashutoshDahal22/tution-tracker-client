import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hook";

export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
