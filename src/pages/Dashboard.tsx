import { useState } from "react";

const stats = [
  { label: "Total sessions", value: "184", sub: "since you started" },
  { label: "Total earned", value: "$9,240", sub: "all time" },
  { label: "Sessions this month", value: "22", sub: "Aug 2026" },
  { label: "Active students", value: "11", sub: "currently enrolled" },
];

const sessions = [
  {
    student: "Aarav Mehta",
    subject: "Physics",
    date: "Aug 19",
    time: "4:00 PM",
    duration: "1h",
    status: "Upcoming",
    price: "$45",
  },
  {
    student: "Priya Shah",
    subject: "Calculus",
    date: "Aug 19",
    time: "6:00 PM",
    duration: "1.5h",
    status: "Upcoming",
    price: "$65",
  },
  {
    student: "Liam Chen",
    subject: "Chemistry",
    date: "Aug 18",
    time: "5:00 PM",
    duration: "1h",
    status: "Completed",
    price: "$45",
  },
  {
    student: "Sara Okafor",
    subject: "Physics",
    date: "Aug 17",
    time: "3:30 PM",
    duration: "1h",
    status: "Completed",
    price: "$45",
  },
  {
    student: "Noah Kim",
    subject: "Algebra",
    date: "Aug 16",
    time: "5:30 PM",
    duration: "1h",
    status: "Cancelled",
    price: "$0",
  },
  {
    student: "Emma Torres",
    subject: "Calculus",
    date: "Aug 15",
    time: "4:30 PM",
    duration: "1.5h",
    status: "Completed",
    price: "$65",
  },
];

const statusStyles: Record<string, string> = {
  Upcoming: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Completed: "bg-stone-100 text-stone-600 border-stone-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

const Dashboard = () => {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Upcoming", "Completed", "Cancelled"];
  const filtered =
    filter === "All" ? sessions : sessions.filter((s) => s.status === filter);

  return (
    <div className="w-full text-stone-900">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-emerald-800 mb-1">
              Tuition tracker
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl">
              Your sessions
            </h1>
          </div>
          <button
            type="button"
            className="w-full sm:w-auto text-base font-semibold text-stone-50 bg-emerald-800 border border-emerald-800 rounded-xl shadow-sm px-6 py-3.5 min-h-[52px] hover:bg-emerald-900 hover:border-emerald-900 transition-colors whitespace-nowrap"
          >
            + Start new session
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="border border-stone-200 rounded-2xl bg-white shadow-sm p-5"
            >
              <div className="text-sm font-medium text-stone-600">
                {s.label}
              </div>
              <div className="font-serif text-3xl mt-2">{s.value}</div>
              <div className="text-sm text-stone-500 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Two-column: monthly overview + top students */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="lg:col-span-2 border border-stone-200 rounded-2xl bg-white shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h2 className="font-serif text-lg sm:text-xl">This month</h2>
              <span className="text-sm text-stone-500 whitespace-nowrap">
                Aug 1 – Aug 31
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-stone-600">Sessions held</div>
                <div className="font-serif text-2xl mt-1">18</div>
              </div>
              <div>
                <div className="text-sm text-stone-600">Sessions upcoming</div>
                <div className="font-serif text-2xl mt-1">4</div>
              </div>
              <div>
                <div className="text-sm text-stone-600">Earned so far</div>
                <div className="font-serif text-2xl mt-1">$1,120</div>
              </div>
            </div>
            <div className="mt-6 h-2.5 rounded-full bg-cream-200 overflow-hidden">
              <div className="h-full bg-emerald-700 rounded-full" style={{ width: "72%" }} />
            </div>
            <div className="text-sm text-stone-500 mt-2">
              22 of 30 planned sessions this month
            </div>
          </div>

          <div className="border border-stone-200 rounded-2xl bg-white shadow-sm p-5 sm:p-6">
            <h2 className="font-serif text-lg sm:text-xl mb-4 sm:mb-5">
              Top students
            </h2>
            <div className="flex flex-col gap-4">
              {[
                { name: "Priya Shah", sessions: 14 },
                { name: "Aarav Mehta", sessions: 12 },
                { name: "Emma Torres", sessions: 9 },
              ].map((st) => (
                <div
                  key={st.name}
                  className="flex items-center justify-between gap-2 text-base"
                >
                  <span className="text-stone-800">{st.name}</span>
                  <span className="text-stone-500 whitespace-nowrap">{st.sessions} sessions</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sessions table */}
        <div className="border border-stone-200 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 pb-4">
            <h2 className="font-serif text-lg sm:text-xl">
              Recent &amp; upcoming
            </h2>
            <div className="flex gap-2 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-sm font-medium px-4 py-2.5 min-h-[44px] rounded-full border transition-colors ${
                    filter === f
                      ? "bg-emerald-800 text-stone-50 border-emerald-800"
                      : "bg-white text-stone-600 border-stone-300 hover:border-emerald-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-base">
              <thead>
                <tr className="border-t border-stone-200 text-left text-sm text-stone-500">
                  <th className="font-semibold px-6 py-3">Student</th>
                  <th className="font-semibold px-6 py-3">Subject</th>
                  <th className="font-semibold px-6 py-3">Date</th>
                  <th className="font-semibold px-6 py-3">Duration</th>
                  <th className="font-semibold px-6 py-3">Status</th>
                  <th className="font-semibold px-6 py-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={i} className="border-t border-stone-100">
                    <td className="px-6 py-4 text-stone-800">{s.student}</td>
                    <td className="px-6 py-4 text-stone-600">{s.subject}</td>
                    <td className="px-6 py-4 text-stone-600">
                      {s.date} &middot; {s.time}
                    </td>
                    <td className="px-6 py-4 text-stone-600">{s.duration}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium px-2.5 py-1 rounded-full border ${statusStyles[s.status]}`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-stone-800">
                      {s.price}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-stone-500"
                    >
                      No sessions in this view.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
