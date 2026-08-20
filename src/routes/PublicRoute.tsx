import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hook";

export default function PublicRoute() {
  const isAuthenticated = useAppSelector(
    (state: any) => state.auth.isAuthenticated,
  );

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
