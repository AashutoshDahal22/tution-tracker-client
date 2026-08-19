import DashboardLayout from "@/layouts/DashboardLayout";
import AuthForm from "@/pages/AuthForm";
import Dashboard from "@/pages/Dashboard";
import SessionTracker from "@/pages/SessionTracker";
import StudentDashboard from "@/pages/StudentDashboard";
import { Routes, Route } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthForm />} />

      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<StudentDashboard />} />
        <Route path="/sessions" element={<SessionTracker />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
