"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Search, ChevronRight, Shield,
  TrendingUp, Crosshair, Map, Compass, ArrowRight, Users
} from "lucide-react";
import OutfitterCard from "@/components/OutfitterCard";
import { OUTFITTERS } from "@/lib/outfitters";

const DynamicMap = dynamic(() => import("@/components/OutfitterMap"), { ssr: false });

const HERO_STATS = [
  { value: "2,400+", label: "Verified Outfitters" },
  { value: "48", label: "States & Provinces" },
  { value: "95%", label: "Hunter Satisfaction" },
  { value: "12K+", label: "Hunts Booked" },
];

const FEATURES = [
  {
    icon: <Search size={22} />,
    title: "AI-Powered Search",
    description:
      "Describe your dream hunt and our AI matches you with the perfect outfitter. Filter by species, budget, location, and experience level.",
  },
  {
    icon: <Map size={22} />,
    title: "Interactive Hunt Map",
    description:
      "Explore outfitters across North America on an interactive map. View territories, species ranges, and hunting units at a glance.",
  },
  {
    icon: <Shield size={22} />,
    title: "Verified Guides",
    description:
      "Every guide is licensed, insured, and background-checked. Read real reviews from verified hunters before you book.",
  },
  {
    icon: <Compass size={22} />,
    title: "Hunt Planning Tools",
    description:
      "Plan your entire trip — from licenses and tags to gear checklists and travel logistics. One platform, every detail.",
  },
];

const SPECIES_GRID = [
  { name: "Elk", emoji: "🦌", count: 312 },
  { name: "Whitetail Deer", emoji: "🦌", count: 580 },
  { name: "Mule Deer", emoji: "🦌", count: 244 },
  { name: "Moose", emoji: "🫎", count: 167 },
  { name: "Black Bear", emoji: "🐻", count: 289 },
  { name: "Wild Turkey", emoji: "🦃", count: 198 },
  { name: "Wild Hog", emoji: "🐗", count: 143 },
  { name: "Waterfowl", emoji: "🦆", count: 221 },
];

const SEARCH_SUGGESTIONS = [
  "Trophy elk in Colorado",
  "Moose hunt in Alaska",
  "Whitetail deer Saskatchewan",
  "Black bear in British Columbia",
  "Hog hunting Texas",
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [placeholder, setPlaceholder] = useState("");
  const [typing, setTyping] = useState(true);

  // Animated placeholder effect
  useEffect(() => {
    const current = SEARCH_SUGGESTIONS[suggestionIdx];
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    if (typing) {
      const type = () => {
        if (i <= current.length) {
          setPlaceholder(current.slice(0, i));
          i++;
          timer = setTimeout(type, 60);
        } else {
          setTimeout(() => setTyping(false), 1800);
        }
      };
      type();
    } else {
      const erase = () => {
        if (i >= 0) {
          setPlaceholder(current.slice(0, i));
          i--;
          timer = setTimeout(erase, 30);
        } else {
          setSuggestionIdx((prev) => (prev + 1) % SEARCH_SUGGESTIONS.length);
          setTyping(true);
        }
      };
      i = current.length;
      erase();
    }

    return () => clearTimeout(timer);
  }, [suggestionIdx, typing]);

  const featuredOutfitters = OUTFITTERS.filter((o) => o.featured);

  return (
    <main className="min-h-screen" style={{ background: "#0A0F0A" }}>

      {/* ========== HERO ========== */}
      <section
        className="relative min-h-screen flex flex-col justify-end pb-24 pt-28 overflow-hidden"
        style={{
          background: `
            linear-gradient(180deg,
              rgba(5,10,5,0.35) 0%,
              rgba(5,10,5,0.55) 55%,
              rgba(5,10,5,0.97) 100%
            ),
            radial-gradient(ellipse at 20% 60%, rgba(28,58,20,0.45) 0%, transparent 55%),
            url('/hero-mountains.jpg')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      >
        {/* Vignette */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,10,5,0.5) 100%)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 animate-fade-in"
            style={{
              background: "rgba(196,90,26,0.12)",
              border: "1px solid rgba(196,90,26,0.25)",
              color: "#E8763A",
            }}
          >
            <Crosshair size={13} />
            North America&apos;s Premier Hunting Platform
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mb-6 animate-fade-in-up">
            Find Your Perfect
            <br />
            <span className="text-gradient">Hunting Adventure</span>
          </h1>

          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-100"
            style={{ color: "#9A9A8A" }}
          >
            Connect with elite outfitters, discover prime hunting locations, and get
            AI-powered gear recommendations — all in one place.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-12 animate-fade-in-up delay-200">
            <div
              className="flex items-center gap-3 p-2 pl-5 rounded-2xl shadow-2xl"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Search size={18} style={{ color: "#E8763A", flexShrink: 0 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholder || "Search hunts..."}
                className="flex-1 bg-transparent text-white outline-none text-base"
                style={{ caretColor: "#E8763A" }}
              />
              <Link
                href={`/map${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}
                className="btn-orange px-6 py-3 text-sm rounded-xl"
              >
                <span>Find Hunts</span>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3 text-xs" style={{ color: "#5A5A4A" }}>
              <span>Popular:</span>
              {["Elk", "Whitetail", "Moose", "Bear"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSearchQuery(s)}
                  className="hover:text-orange-400 transition-colors"
                  style={{ color: "#7A7A6A" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in-up delay-300 mb-12">
            {HERO_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl py-3 px-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="text-2xl font-black" style={{ color: "#E8763A" }}>
                  {stat.value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#6A6A5A" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── Three entry-point cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto animate-fade-in-up delay-400">
            {/* Card 1 — Know what you want */}
            <Link href="/gear"
              className="group rounded-2xl p-6 flex flex-col items-center text-center gap-3 transition-all duration-200 hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
              }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                style={{ background: "linear-gradient(135deg, #C45A1A, #E8763A)" }}>
                <Search size={22} color="white" />
              </div>
              <div>
                <p className="font-bold text-white text-base leading-tight mb-1">Know what you&apos;re looking for?</p>
                <p className="text-xs leading-relaxed" style={{ color: "#6A8A6A" }}>
                  Search our comprehensive database of outdoor gear with AI-powered filtering and price comparison.
                </p>
              </div>
              <span className="text-xs font-semibold flex items-center gap-1 mt-auto pt-1" style={{ color: "#E8763A" }}>
                Browse Gear <ChevronRight size={12} />
              </span>
            </Link>

            {/* Card 2 — Going on an epic hunt */}
            <Link href="/map"
              className="group rounded-2xl p-6 flex flex-col items-center text-center gap-3 transition-all duration-200 hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
              }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                style={{ background: "linear-gradient(135deg, #1C4A14, #2A6A1C)" }}>
                <Map size={22} color="white" />
              </div>
              <div>
                <p className="font-bold text-white text-base leading-tight mb-1">Going on an epic hunt?</p>
                <p className="text-xs leading-relaxed" style={{ color: "#6A8A6A" }}>
                  Get personalized gear recommendations based on your hunting location, season, and game type.
                </p>
              </div>
              <span className="text-xs font-semibold flex items-center gap-1 mt-auto pt-1" style={{ color: "#E8763A" }}>
                Find Outfitters <ChevronRight size={12} />
              </span>
            </Link>

            {/* Card 3 — Don't know where to start */}
            <Link href="/quiz"
              className="group rounded-2xl p-6 flex flex-col items-center text-center gap-3 transition-all duration-200 hover:-translate-y-1"
              style={{
                background: "rgba(196,90,26,0.06)",
                border: "1px solid rgba(196,90,26,0.2)",
                backdropFilter: "blur(8px)",
              }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                style={{ background: "linear-gradient(135deg, #C45A1A, #E8763A)" }}>
                <Compass size={22} color="white" />
              </div>
              <div>
                <p className="font-bold text-white text-base leading-tight mb-1">Don&apos;t have an idea where to start?</p>
                <p className="text-xs leading-relaxed" style={{ color: "#6A8A6A" }}>
                  Take our guided questionnaire to discover gear recommendations tailored to your experience level.
                </p>
              </div>
              <span className="text-xs font-semibold flex items-center gap-1 mt-auto pt-1" style={{ color: "#E8763A" }}>
                Start Quiz <ChevronRight size={12} />
              </span>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce opacity-40">
          <div className="w-0.5 h-8 rounded-full" style={{ background: "#E8763A" }} />
        </div>
      </section>

      {/* ========== HUNT BY SPECIES ========== */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold mb-2 tracking-widest uppercase" style={{ color: "#E8763A" }}>
                Browse by Species
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                What Are You Hunting?
              </h2>
            </div>
            <Link
              href="/map"
              className="hidden sm:flex items-center gap-1 text-sm font-medium hover:text-white transition-colors"
              style={{ color: "#E8763A" }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SPECIES_GRID.map((species, i) => (
              <Link
                key={species.name}
                href={`/map?species=${encodeURIComponent(species.name)}`}
                className="card-hover rounded-2xl p-5 flex flex-col gap-2 group"
                style={{
                  background: "#111811",
                  border: "1px solid rgba(255,255,255,0.07)",
                  animationDelay: `${i * 50}ms`,
                }}
              >
                <span className="text-4xl">{species.emoji}</span>
                <div>
                  <p className="font-semibold text-white text-sm group-hover:text-orange-400 transition-colors">
                    {species.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#5A5A4A" }}>
                    {species.count} outfitters
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURED OUTFITTERS ========== */}
      <section className="py-20 px-4 sm:px-6" style={{ background: "#0C130C" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold mb-2 tracking-widest uppercase" style={{ color: "#E8763A" }}>
                Hand-Picked
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Featured Outfitters
              </h2>
            </div>
            <Link
              href="/outfitters"
              className="hidden sm:flex items-center gap-1 text-sm font-medium hover:text-white transition-colors"
              style={{ color: "#E8763A" }}
            >
              Browse all guides <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredOutfitters.slice(0, 6).map((o) => (
              <OutfitterCard key={o.id} outfitter={o} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== MAP PREVIEW ========== */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold mb-2 tracking-widest uppercase" style={{ color: "#E8763A" }}>
              Interactive Map
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Explore Hunts Near You
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: "#6A6A5A" }}>
              Browse outfitters across North America. Filter by species, price, and season to find your perfect hunt.
            </p>
          </div>

          <div
            className="relative rounded-3xl overflow-hidden"
            style={{ height: "480px", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <DynamicMap outfitters={OUTFITTERS} />

            {/* CTA overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
              <Link
                href="/map"
                className="btn-orange flex items-center gap-2 px-7 py-3.5 text-sm rounded-xl shadow-2xl"
                style={{ boxShadow: "0 8px 30px rgba(196,90,26,0.4)" }}
              >
                <span className="flex items-center gap-2">
                  <Map size={16} />
                  Open Full Map
                  <ArrowRight size={14} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-20 px-4 sm:px-6" style={{ background: "#0C130C" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold mb-2 tracking-widest uppercase" style={{ color: "#E8763A" }}>
              Simple Process
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Book Your Hunt in Minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Search & Filter",
                description:
                  "Use our AI assistant or search tools to find outfitters matching your species, location, budget, and experience level.",
                icon: <Search size={24} />,
              },
              {
                step: "02",
                title: "Connect with Guides",
                description:
                  "Browse verified guide profiles, read authentic hunter reviews, and message outfitters directly through the platform.",
                icon: <Users size={24} />,
              },
              {
                step: "03",
                title: "Book & Hunt",
                description:
                  "Secure your booking, receive a complete trip itinerary, and show up ready. We handle the coordination.",
                icon: <Crosshair size={24} />,
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div
                  className="rounded-2xl p-7"
                  style={{
                    background: "#111811",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="text-6xl font-black mb-4 leading-none" style={{ color: "rgba(196,90,26,0.12)" }}>
                    {step.step}
                  </div>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(196,90,26,0.12)", color: "#E8763A" }}
                  >
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6A6A5A" }}>
                    {step.description}
                  </p>
                </div>
                {i < 2 && (
                  <div
                    className="hidden md:block absolute top-1/2 -right-5 z-10"
                    style={{ color: "#C45A1A", opacity: 0.4 }}
                  >
                    <ChevronRight size={28} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold mb-2 tracking-widest uppercase" style={{ color: "#E8763A" }}>
              Why HuntHive
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Everything You Need to Hunt Smarter
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((feat, i) => (
              <div
                key={i}
                className="card-hover rounded-2xl p-7 flex gap-5"
                style={{
                  background: "#111811",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(196,90,26,0.12)", color: "#E8763A" }}
                >
                  {feat.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1.5">{feat.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6A6A5A" }}>
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(10,20,8,0.88) 0%, rgba(28,58,20,0.82) 50%, rgba(10,20,8,0.88) 100%), url('/forest-mist.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "1px solid rgba(196,90,26,0.25)",
            }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(196,90,26,0.6) 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10">
              <TrendingUp size={40} className="mx-auto mb-5" style={{ color: "#E8763A" }} />
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Are You a Hunting Outfitter?
              </h2>
              <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "#9ABF8A" }}>
                Join 2,400+ guides on HuntHive. List your hunts, manage bookings, and reach
                thousands of motivated hunters across North America.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/list" className="btn-orange px-8 py-4 text-base rounded-xl w-full sm:w-auto">
                  <span>List Your Hunts — Free</span>
                </Link>
                <Link
                  href="/outfitters"
                  className="px-8 py-4 text-base rounded-xl w-full sm:w-auto font-semibold transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "white",
                  }}
                >
                  Learn More
                </Link>
              </div>
              <p className="text-xs mt-6" style={{ color: "#5A7A4A" }}>
                No commission on your first 5 bookings · Setup in under 10 minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer
        className="py-12 px-4 sm:px-6 border-t"
        style={{ borderColor: "rgba(255,255,255,0.05)", background: "#080D08" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #C45A1A, #E8763A)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" fill="white"/>
                    <line x1="12" y1="2" x2="12" y2="8" stroke="white" strokeWidth="2"/>
                    <line x1="12" y1="16" x2="12" y2="22" stroke="white" strokeWidth="2"/>
                    <line x1="2" y1="12" x2="8" y2="12" stroke="white" strokeWidth="2"/>
                    <line x1="16" y1="12" x2="22" y2="12" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <span className="font-bold text-white">
                  Hunt<span style={{ color: "#E8763A" }}>Hive</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#4A4A3A" }}>
                Connecting hunters with premier outfitters across North America.
              </p>
            </div>

            {[
              {
                title: "Platform",
                links: ["Find Outfitters", "Browse Guides", "Gear Reviews", "Hunt Planning"],
              },
              {
                title: "Species",
                links: ["Elk Hunting", "Deer Hunting", "Bear Hunting", "Moose Hunting"],
              },
              {
                title: "Company",
                links: ["About Us", "List Your Hunt", "Blog", "Contact"],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold text-white mb-3">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm transition-colors hover:text-white"
                        style={{ color: "#4A4A3A" }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-xs" style={{ color: "#3A3A2A" }}>
              © 2025 HuntHive. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs" style={{ color: "#3A3A2A" }}>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Licenses</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
