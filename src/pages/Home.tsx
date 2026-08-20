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
    <main className="min-h-screen bg-stone-50 text-stone-900 flex items-center justify-center p-5 sm:p-8">
      <div className="w-full max-w-3xl border border-stone-200 bg-white p-8 sm:p-12">
        {/* Eyebrow */}
        <div className="text-xs tracking-widest uppercase text-emerald-800 mb-4">
          Tuition management
        </div>

        {/* Hero */}
        <h1 className="font-serif text-4xl sm:text-5xl leading-tight max-w-xl">
          Every student, session, and record in one ledger.
        </h1>

        <p className="mt-4 text-stone-500 max-w-md">
          Tuition Tracker keeps your roster, session timers, and attendance
          organized, so you can spend less time on admin and more time teaching.
        </p>

        <button
          onClick={handleButtonClick}
          className="mt-8 text-sm font-semibold text-stone-50 bg-stone-900 border border-stone-900 px-6 py-3.5 hover:bg-emerald-800 hover:border-emerald-800 transition-colors"
        >
          {isAuthenticated ? "Go to dashboard" : "Get started"}
        </button>

        {/* Feature strip */}
        <div className="mt-12 border-t border-stone-200 pt-8 grid sm:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title}>
              <div className="w-9 h-9 border border-stone-200 flex items-center justify-center text-xs font-semibold text-stone-500 mb-3">
                {feature.label.slice(0, 2).toUpperCase()}
              </div>

              <div className="font-serif text-lg mb-1">{feature.title}</div>

              <div className="text-sm text-stone-500 leading-relaxed">
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
