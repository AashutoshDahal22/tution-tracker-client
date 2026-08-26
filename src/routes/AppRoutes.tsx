import DashboardLayout from "@/layouts/DashboardLayout";
import AuthForm from "@/features/auth/components/AuthForm";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import SessionTracker from "@/features/sessions/pages/SessionDashboard";
import StudentDashboard from "@/features/students/pages/StudentDashboard";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<PublicRoute />}>
        <Route path="/auth" element={<AuthForm />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<StudentDashboard />} />
          <Route path="/sessions" element={<SessionTracker />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
