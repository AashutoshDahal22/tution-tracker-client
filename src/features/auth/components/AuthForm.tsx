import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  loginUser,
  signupUser,
  clearAuthError,
} from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [formError, setFormError] = useState("");

  const isSignup = mode === "signup";

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error: apiError } = useAppSelector(
    (state: any) => state.auth,
  );

  const error = formError || apiError;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormError("");
    dispatch(clearAuthError());

    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (isSignup) {
        const name = formData.get("name") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (!name || !email || !password || !confirmPassword) {
          setFormError("Please fill in all fields.");
          return;
        }

        if (password !== confirmPassword) {
          setFormError("Passwords do not match.");
          return;
        }

        await dispatch(
          signupUser({
            name,
            email,
            password,
          }),
        ).unwrap();

        form.reset();
        navigate("/dashboard");
      } else {
        if (!email || !password) {
          setFormError("Email and password are required.");
          return;
        }

        await dispatch(
          loginUser({
            email,
            password,
          }),
        ).unwrap();

        form.reset();
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    setFormError("");
    dispatch(clearAuthError());
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[920px] min-h-[560px] grid grid-cols-1 md:grid-cols-2 border border-stone-200 bg-white">
        {/* Left panel */}
        <aside className="hidden md:flex flex-col justify-between bg-stone-900 text-stone-50 p-8 lg:p-11">
          <div className="text-sm tracking-widest uppercase text-emerald-200/80">
            Tuition Tracker
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

            <span>{isSignup ? "Create your account" : "Welcome back"}</span>
          </div>
        </aside>

        {/* Right panel */}
        <section className="flex flex-col p-6 sm:p-9 lg:p-11">
          {/* Login / Signup tabs */}
          <div className="flex gap-6 sm:gap-7 border-b border-stone-200 mb-7 sm:mb-9">
            <button
              type="button"
              disabled={loading}
              onClick={() => switchMode("login")}
              className={`pb-3.5 text-sm font-medium transition-colors ${
                !isSignup
                  ? "text-stone-900 border-b-2 border-emerald-800"
                  : "text-stone-400"
              } disabled:opacity-50`}
            >
              Login
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => switchMode("signup")}
              className={`pb-3.5 text-sm font-medium transition-colors ${
                isSignup
                  ? "text-stone-900 border-b-2 border-emerald-800"
                  : "text-stone-400"
              } disabled:opacity-50`}
            >
              Create account
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex flex-col gap-4">
              {/* Name */}
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
                    name="name"
                    type="text"
                    placeholder="Jordan Blake"
                    autoComplete="name"
                    disabled={loading}
                    className="text-sm bg-transparent border border-stone-300 px-3.5 py-3 outline-none focus:border-emerald-800 transition-colors disabled:opacity-50"
                  />
                </div>
              )}

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-stone-500"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                  className="text-sm bg-transparent border border-stone-300 px-3.5 py-3 outline-none focus:border-emerald-800 transition-colors disabled:opacity-50"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-stone-500"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  disabled={loading}
                  className="text-sm bg-transparent border border-stone-300 px-3.5 py-3 outline-none focus:border-emerald-800 transition-colors disabled:opacity-50"
                />
              </div>

              {/* Confirm password */}
              {isSignup && (
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="confirmPassword"
                    className="text-xs font-medium text-stone-500"
                  >
                    Confirm password
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={loading}
                    className="text-sm bg-transparent border border-stone-300 px-3.5 py-3 outline-none focus:border-emerald-800 transition-colors disabled:opacity-50"
                  />
                </div>
              )}
            </div>

            {/* Login options */}
            {!isSignup && (
              <div className="flex items-center justify-between mt-3 text-[13px]">
                <label className="flex items-center gap-2 text-stone-500 cursor-pointer">
                  <input
                    name="rememberMe"
                    type="checkbox"
                    disabled={loading}
                    className="w-3.5 h-3.5 accent-emerald-800"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="text-emerald-800 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 text-sm font-semibold text-stone-50 bg-stone-900 border border-stone-900 px-4 py-3.5 hover:bg-emerald-800 hover:border-emerald-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? isSignup
                  ? "Creating account..."
                  : "Logging in..."
                : isSignup
                  ? "Create account"
                  : "Login"}
            </button>
          </form>

          {/* Bottom switch */}
          <p className="mt-auto pt-6 text-[13.5px] text-stone-500">
            {isSignup ? "Already have an account? " : "Don't have an account? "}

            <button
              type="button"
              disabled={loading}
              onClick={() => switchMode(isSignup ? "login" : "signup")}
              className="font-semibold text-emerald-800 hover:underline disabled:opacity-50"
            >
              {isSignup ? "Login" : "Create one"}
            </button>
          </p>
        </section>
      </div>
    </div>
  );
}
