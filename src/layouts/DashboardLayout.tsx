import { NavLink, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 p-5">
        <h1 className="text-xl font-semibold mb-8">Tuition Tracker</h1>

        <nav className="space-y-1">
          <NavLink
            to="/"
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

          {/* <NavLink
            to="/classes"
            className={({ isActive }) =>
              `block px-3 py-2 text-sm ${
                isActive
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`
            }
          >
            Classes
          </NavLink> */}

          {/* <NavLink
            to="/attendance"
            className={({ isActive }) =>
              `block px-3 py-2 text-sm ${
                isActive
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`
            }
          >
            Attendance
          </NavLink> */}

          {/* <NavLink
            to="/payments"
            className={({ isActive }) =>
              `block px-3 py-2 text-sm ${
                isActive
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`
            }
          >
            Payments
          </NavLink> */}

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

          <div className="text-sm">Admin</div>
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
