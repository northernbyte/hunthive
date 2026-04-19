"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, Target, Loader2 } from "lucide-react";

export default function SignInPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState<"hunter" | "outfitter">("hunter");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-white outline-none placeholder-gray-600 transition-all focus:border-orange-500/50";
  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" };

  return (
    <div className="min-h-screen flex" style={{ background: "#0A0F0A" }}>
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0C1A0C 0%, #1C3A14 50%, #0A1A08 100%)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}>
        {/* Background decoration */}
        <div className="absolute inset-0">
          <svg className="absolute bottom-0 left-0 right-0 w-full opacity-10" viewBox="0 0 800 400" preserveAspectRatio="none">
            <path d="M0,400 L0,200 L40,200 L40,120 L60,120 L60,80 L80,80 L80,100 L100,100 L100,60 L120,60 L120,90 L140,90 L140,140 L160,140 L160,70 L180,70 L180,40 L200,40 L200,70 L220,70 L220,110 L250,110 L250,80 L270,80 L270,100 L290,100 L290,60 L310,60 L310,30 L330,30 L330,60 L350,60 L350,80 L380,80 L380,130 L410,130 L410,90 L430,90 L430,60 L450,60 L450,90 L470,90 L470,120 L500,120 L500,80 L520,80 L520,50 L540,50 L540,80 L560,80 L560,100 L590,100 L590,60 L610,60 L610,90 L630,90 L630,120 L660,120 L660,80 L680,80 L680,100 L700,100 L700,140 L720,140 L720,90 L740,90 L740,110 L760,110 L760,160 L800,160 L800,400 Z"
              fill="white" />
          </svg>
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, #E8763A, transparent)", transform: "translate(30%, -30%)" }} />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #C45A1A, #E8763A)" }}>
              <Target size={18} color="white" />
            </div>
            <span className="text-xl font-bold text-white">Hunt<span style={{ color: "#E8763A" }}>Hive</span></span>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Your next great hunt starts here.
          </h2>
          <p style={{ color: "#6A8A6A" }}>
            Join 12,000+ hunters who use HuntHive to find elite outfitters, track gear prices, and plan unforgettable adventures.
          </p>
          <div className="flex gap-6 mt-8">
            {[
              { value: "2,400+", label: "Outfitters" },
              { value: "48", label: "States & Provinces" },
              { value: "95%", label: "Satisfaction" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-black" style={{ color: "#E8763A" }}>{s.value}</p>
                <p className="text-xs" style={{ color: "#4A6A4A" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex -space-x-2">
            {["TM","JH","BW","DL","KR"].map((i, idx) => (
              <div key={idx} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2"
                style={{ background: `hsl(${idx * 30 + 20}, 60%, 30%)`, borderColor: "#0C1A0C" }}>
                {i}
              </div>
            ))}
          </div>
          <p className="text-sm mt-2" style={{ color: "#5A7A5A" }}>
            Hunters who booked this season
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-8 lg:hidden transition-colors hover:text-white"
            style={{ color: "#5A6A5A" }}>
            <ArrowLeft size={13} /> Back to HuntHive
          </Link>

          {/* Mode tabs */}
          <div className="flex rounded-xl p-1 mb-8" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {(["signin", "signup"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all"
                style={{
                  background: mode === m ? "linear-gradient(135deg, #C45A1A, #E8763A)" : "transparent",
                  color: mode === m ? "white" : "#6A6A5A",
                }}>
                {m === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <h1 className="text-2xl font-black text-white mb-1">
            {mode === "signin" ? "Welcome back" : "Join HuntHive"}
          </h1>
          <p className="text-sm mb-6" style={{ color: "#5A5A4A" }}>
            {mode === "signin"
              ? "Sign in to access your bookings and saved hunts"
              : "Create your free account to start booking hunts"}
          </p>

          {/* Account type (signup only) */}
          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-3 mb-5">
              {(["hunter", "outfitter"] as const).map(type => (
                <button key={type} onClick={() => setAccountType(type)}
                  className="py-3 px-4 rounded-xl text-sm font-medium capitalize transition-all text-left"
                  style={{
                    background: accountType === type ? "rgba(196,90,26,0.12)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${accountType === type ? "rgba(196,90,26,0.4)" : "rgba(255,255,255,0.08)"}`,
                    color: accountType === type ? "#E8763A" : "#6A6A5A",
                  }}>
                  <div className="text-lg mb-0.5">{type === "hunter" ? "🦌" : "🎯"}</div>
                  <div className="font-semibold capitalize">{type}</div>
                  <div className="text-xs opacity-60">{type === "hunter" ? "Find & book hunts" : "List your hunts"}</div>
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#8A8A7A" }}>Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="John Smith" required
                  className={inputClass} style={inputStyle} />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "#8A8A7A" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required
                className={inputClass} style={inputStyle} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold" style={{ color: "#8A8A7A" }}>Password</label>
                {mode === "signin" && (
                  <button type="button" className="text-xs transition-colors hover:text-white" style={{ color: "#E8763A" }}>
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "Min. 8 characters" : "Enter your password"}
                  required
                  className={`${inputClass} pr-12`} style={inputStyle} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center"
                  style={{ color: "#5A5A4A" }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-orange w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-2 disabled:opacity-70">
              <span className="flex items-center gap-2">
                {loading && <Loader2 size={15} className="animate-spin" />}
                {mode === "signin" ? "Sign In" : "Create Account"} →
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span className="text-xs" style={{ color: "#3A3A2A" }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Social logins */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Google", icon: "G" },
              { label: "Apple", icon: "" },
            ].map(provider => (
              <button key={provider.label}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-white/8"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#C8C8B8" }}>
                <span className="font-bold">{provider.icon}</span>
                {provider.label}
              </button>
            ))}
          </div>

          <p className="text-center text-xs mt-6" style={{ color: "#3A3A2A" }}>
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-semibold transition-colors hover:text-white" style={{ color: "#E8763A" }}>
              {mode === "signin" ? "Sign up free" : "Sign in"}
            </button>
          </p>

          {mode === "signup" && accountType === "outfitter" && (
            <div className="mt-4 text-center">
              <p className="text-xs" style={{ color: "#4A4A3A" }}>
                Want to list your hunts now?{" "}
                <Link href="/list" className="font-semibold" style={{ color: "#E8763A" }}>
                  Go to outfitter signup →
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
