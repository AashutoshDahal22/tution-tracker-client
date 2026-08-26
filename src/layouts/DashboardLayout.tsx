import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/store/hook";
import { logoutUser } from "@/features/auth/authSlice";

const DashboardLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();

      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 p-5">
        <h1 className="text-xl font-semibold mb-8">Tuition Tracker</h1>

        <nav className="space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-3 py-2 text-sm ${
                isActive
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/students"
            className={({ isActive }) =>
              `block px-3 py-2 text-sm ${
                isActive
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`
            }
          >
            Students
          </NavLink>

          <NavLink
            to="/sessions"
            className={({ isActive }) =>
              `block px-3 py-2 text-sm ${
                isActive
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`
            }
          >
            Sessions
          </NavLink>
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6">
          <div>
            <p className="text-sm text-stone-500">Tuition Tracker</p>
          </div>

          {/* User section */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-stone-900">{user?.name}</p>

              <p className="text-xs text-stone-500">{user?.email}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="px-3 py-2 text-sm border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </header>

        {/* Current page */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
