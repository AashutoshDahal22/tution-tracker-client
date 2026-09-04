import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/store/hook";
import { logoutUser } from "@/features/auth/authSlice";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block px-3 py-2.5 text-sm rounded-sm transition-colors ${
    isActive
      ? "bg-stone-900 text-white"
      : "text-stone-600 hover:bg-stone-100"
  }`;

const DashboardLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    if (sidebarOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [sidebarOpen]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

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
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-stone-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — drawer on mobile, static on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] bg-white border-r border-stone-200 p-5 flex flex-col transform transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-64 lg:max-w-none lg:shrink-0 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold">Tuition Tracker</h1>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="lg:hidden text-2xl leading-none text-stone-400 hover:text-stone-900 px-2 py-1"
          >
            ×
          </button>
        </div>

        <nav className="space-y-1" onClick={() => setSidebarOpen(false)}>
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/students" className={navLinkClass}>
            Students
          </NavLink>

          <NavLink to="/sessions" className={navLinkClass}>
            Sessions
          </NavLink>
        </nav>

        {/* Mobile-only user + logout at bottom of drawer */}
        <div className="mt-auto pt-6 border-t border-stone-200 lg:hidden">
          <p className="text-sm font-medium text-stone-900 truncate">
            {user?.name}
          </p>
          <p className="text-xs text-stone-500 truncate">{user?.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="mt-3 w-full px-3 py-2.5 text-sm border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="min-h-16 bg-white border-b border-stone-200 flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-2 -ml-2 text-stone-700 hover:bg-stone-100 rounded-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            </button>
            <p className="text-sm text-stone-500 truncate">Tuition Tracker</p>
          </div>

          {/* User section */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="text-right min-w-0 hidden sm:block">
              <p className="text-sm font-medium text-stone-900 truncate max-w-[140px] sm:max-w-none">
                {user?.name}
              </p>

              <p className="text-xs text-stone-500 truncate max-w-[140px] sm:max-w-none">
                {user?.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="hidden lg:block px-3 py-2 text-sm border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </header>

        {/* Current page */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
