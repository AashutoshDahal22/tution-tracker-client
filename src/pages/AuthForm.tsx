import { useState } from "react";

export default function AuthForm() {
  const [mode, setMode] = useState("login");
  const isSignup = mode === "signup";

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // hook up your submit logic here
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[920px] min-h-[560px] grid grid-cols-1 md:grid-cols-2 border border-stone-200 bg-white">
        {/* Left panel */}
        <aside className="hidden md:flex flex-col justify-between bg-stone-900 text-stone-50 p-8 lg:p-11">
          <div className="text-sm tracking-widest uppercase text-emerald-200/80">
            Tution Tracker
          </div>

          <div>
            <h1 className="font-serif text-3xl lg:text-4xl leading-tight max-w-[320px]">
              {isSignup
                ? "Join us to track all of your sessions."
                : "Login and Happy Tracking"}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-stone-400 max-w-[280px]">
              {isSignup
                ? "Just a few details and you're on the ledger."
                : "Sign in to pick up where you left off, or join us today."}
            </p>
          </div>

          <div className="flex items-center gap-2.5 text-[13px] text-stone-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-none" />
            <span></span>
          </div>
        </aside>

        {/* Right panel */}
        <section className="flex flex-col p-6 sm:p-9 lg:p-11">
          <div className="flex gap-6 sm:gap-7 border-b border-stone-200 mb-7 sm:mb-9">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`pb-3.5 text-sm font-medium transition-colors ${
                !isSignup
                  ? "text-stone-900 border-b-2 border-emerald-800"
                  : "text-stone-400"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`pb-3.5 text-sm font-medium transition-colors ${
                isSignup
                  ? "text-stone-900 border-b-2 border-emerald-800"
                  : "text-stone-400"
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex flex-col gap-4">
              {isSignup && (
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="text-xs font-medium text-stone-500"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Jordan Blake"
                    autoComplete="name"
                    className="text-sm bg-transparent border border-stone-300 px-3.5 py-3 outline-none focus:border-emerald-800 transition-colors"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-stone-500"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="text-sm bg-transparent border border-stone-300 px-3.5 py-3 outline-none focus:border-emerald-800 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-stone-500"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="text-sm bg-transparent border border-stone-300 px-3.5 py-3 outline-none focus:border-emerald-800 transition-colors"
                />
              </div>

              {isSignup && (
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="confirm"
                    className="text-xs font-medium text-stone-500"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirm"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="text-sm bg-transparent border border-stone-300 px-3.5 py-3 outline-none focus:border-emerald-800 transition-colors"
                  />
                </div>
              )}
            </div>

            {!isSignup && (
              <div className="flex items-center justify-between mt-3 text-[13px]">
                <label className="flex items-center gap-2 text-stone-500 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 accent-emerald-800"
                  />
                  Remember me
                </label>
                <a href="#" className="text-emerald-800 hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="mt-6 text-sm font-semibold text-stone-50 bg-stone-900 border border-stone-900 px-4 py-3.5 hover:bg-emerald-800 hover:border-emerald-800 transition-colors"
            >
              {isSignup ? "Create account" : "Login"}
            </button>
          </form>

          <p className="mt-auto pt-6 text-[13.5px] text-stone-500">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => setMode(isSignup ? "login" : "signup")}
              className="font-semibold text-emerald-800 hover:underline"
            >
              {isSignup ? "Login" : "Create one"}
            </button>
          </p>
        </section>
      </div>
    </div>
  );
}
