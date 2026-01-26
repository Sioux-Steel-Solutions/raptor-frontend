"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

type AuthTab = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthTab>("signin");

  // Sign In state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Sign Up state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just navigate to dashboard
    router.push("/dashboard");
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just navigate to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-raptor-dark flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="mb-6 sm:mb-8">
        <Image
          src="/raptor_logo_yellow.svg"
          alt="Raptor"
          width={280}
          height={80}
          className="w-48 sm:w-64 md:w-72 h-auto"
          priority
        />
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md">
        {/* Tab Toggle */}
        <div className="flex bg-raptor-lightgray rounded-t-lg overflow-hidden">
          <button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-3 sm:py-4 text-center font-semibold transition-all text-sm sm:text-base ${
              activeTab === "signin"
                ? "bg-raptor-yellow text-raptor-dark"
                : "bg-raptor-lightgray text-slate-300 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-3 sm:py-4 text-center font-semibold transition-all text-sm sm:text-base ${
              activeTab === "signup"
                ? "bg-raptor-yellow text-raptor-dark"
                : "bg-raptor-lightgray text-slate-300 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-raptor-gray rounded-b-lg p-5 sm:p-8">
          {/* Sign In Form */}
          {activeTab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-5 sm:space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  Welcome to Raptor
                </h2>
                <p className="text-slate-400 text-sm sm:text-base">
                  Enter your credentials to access your dashboard
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Email
                </label>
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none placeholder:text-slate-400 text-sm sm:text-base"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showSignInPassword ? "text" : "password"}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none placeholder:text-slate-400 pr-12 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showSignInPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-raptor-lightgray text-raptor-yellow focus:ring-raptor-yellow focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-slate-300 text-sm">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-raptor-yellow text-sm hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full py-3 sm:py-4 bg-raptor-yellow text-raptor-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors text-sm sm:text-base"
              >
                Sign In
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4 sm:space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  Create Account
                </h2>
                <p className="text-slate-400 text-sm sm:text-base">
                  Enter your information to create a new account
                </p>
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">
                    First name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none placeholder:text-slate-400 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none placeholder:text-slate-400 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Email
                </label>
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none placeholder:text-slate-400 text-sm sm:text-base"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showSignUpPassword ? "text" : "password"}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none placeholder:text-slate-400 pr-12 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showSignUpPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none placeholder:text-slate-400 pr-12 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Agreement */}
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-600 bg-raptor-lightgray text-raptor-yellow focus:ring-raptor-yellow focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-slate-300 text-sm">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-raptor-yellow hover:underline"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-raptor-yellow hover:underline"
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>

              {/* Create Account Button */}
              <button
                type="submit"
                className="w-full py-3 sm:py-4 bg-raptor-yellow text-raptor-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors text-sm sm:text-base"
              >
                Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
