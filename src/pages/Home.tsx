import { useNavigate } from "react-router-dom";

type Feature = {
  label: string;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    label: "Roster",
    title: "Students",
    description:
      "Keep every learner's contact details, grade, and status in one place.",
  },
  {
    label: "Clock",
    title: "Sessions",
    description: "Start, pause, and log tuition sessions with a running timer.",
  },
  {
    label: "Log",
    title: "Attendance",
    description:
      "Mark who showed up and spot patterns before they become problems.",
  },
];

const Home = () => {
  const navigate = useNavigate();

  // fetches the token
  const isAuthenticated = !!localStorage.getItem("token");

  const handleButtonClick = (): void => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <main className="min-h-screen bg-cream-100 text-stone-900 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl border border-stone-200 rounded-2xl bg-white shadow-sm p-6 sm:p-12">
        {/* Eyebrow */}
        <div className="text-sm font-semibold text-emerald-800 mb-4">
          Tuition management
        </div>

        {/* Hero */}
        <h1 className="font-serif text-3xl min-[420px]:text-4xl sm:text-5xl leading-tight max-w-xl break-words">
          Every student, session, and record in one ledger.
        </h1>

        <p className="mt-4 text-sm sm:text-base text-stone-500 max-w-md leading-relaxed">
          Tuition Tracker keeps your roster, session timers, and attendance
          organized, so you can spend less time on admin and more time teaching.
        </p>

        <button
          onClick={handleButtonClick}
          className="mt-8 w-full sm:w-auto text-base font-semibold text-stone-50 bg-emerald-800 border border-emerald-800 rounded-xl px-6 py-3.5 min-h-[52px] hover:bg-emerald-900 hover:border-emerald-900 transition-colors"
        >
          {isAuthenticated ? "Go to dashboard" : "Get started"}
        </button>

        {/* Feature strip */}
        <div className="mt-10 sm:mt-12 border-t border-stone-200 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl bg-cream-50 border border-stone-200 p-4">
              <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-sm font-semibold text-stone-50 mb-3">
                {feature.label.slice(0, 2).toUpperCase()}
              </div>

              <div className="font-serif text-xl mb-1">{feature.title}</div>

              <div className="text-base text-stone-600 leading-relaxed">
                {feature.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
