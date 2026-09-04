import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/store/hook";
import { logoutUser } from "@/features/auth/authSlice";

const sidebarLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block px-4 py-3.5 text-base rounded-xl transition-colors ${
    isActive
      ? "bg-emerald-800 text-white font-semibold"
      : "text-stone-700 hover:bg-cream-100"
  }`;

const tabLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center justify-center gap-1 py-2.5 min-h-[64px] text-sm transition-colors ${
    isActive ? "text-emerald-800 font-semibold" : "text-stone-500"
  }`;

const HomeIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 10.5 12 3l9 7.5V21H3z"
    />
  </svg>
);

const StudentsIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 20v-1.5a3.5 3.5 0 0 0-3.5-3.5H10A3.5 3.5 0 0 0 6.5 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7 2.5a2.5 2.5 0 1 0-2-4M17.5 15A3.5 3.5 0 0 1 20 18.5V20"
    />
  </svg>
);

const SessionsIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" d="M12 7v5l3.5 2" />
  </svg>
);

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
    <div className="min-h-screen bg-cream-100 text-stone-900 flex">
      {/* Sidebar — desktop only, always visible */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-stone-200 p-5">
        <h1 className="text-2xl font-semibold mb-2">Tuition Tracker</h1>
        <p className="text-sm text-stone-500 mb-8">Your teaching companion</p>

        <nav className="space-y-2">
          <NavLink to="/dashboard" className={sidebarLinkClass}>
            Home
          </NavLink>

          <NavLink to="/students" className={sidebarLinkClass}>
            Students
          </NavLink>

          <NavLink to="/sessions" className={sidebarLinkClass}>
            Sessions
          </NavLink>
        </nav>

        <div className="mt-auto pt-6 border-t border-stone-200">
          <p className="text-base font-medium text-stone-900 truncate">
            {user?.name}
          </p>
          <p className="text-sm text-stone-500 truncate">{user?.email}</p>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="min-h-[72px] bg-white border-b border-stone-200 flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-base font-semibold text-stone-900 truncate lg:hidden">
              Tuition Tracker
            </p>
            <p className="text-sm text-stone-500 truncate hidden lg:block">
              {user ? `Hello, ${user.name}` : "Tuition Tracker"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="px-5 py-3 min-h-[48px] text-base font-semibold rounded-xl border border-stone-300 text-stone-700 hover:border-emerald-700 hover:text-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </header>

        {/* Current page — extra bottom padding clears the mobile tab bar */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8 w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Bottom tab bar — mobile / tablet, always visible, big targets */}
      <nav
        aria-label="Main navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-stone-200 grid grid-cols-3 pb-[env(safe-area-inset-bottom)]"
      >
        <NavLink to="/dashboard" className={tabLinkClass}>
          <HomeIcon />
          Home
        </NavLink>

        <NavLink to="/students" className={tabLinkClass}>
          <StudentsIcon />
          Students
        </NavLink>

        <NavLink to="/sessions" className={tabLinkClass}>
          <SessionsIcon />
          Sessions
        </NavLink>
      </nav>
    </div>
  );
};

export default DashboardLayout;
