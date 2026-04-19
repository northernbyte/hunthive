"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, TrendingUp } from "lucide-react";
import { OUTFITTERS, ALL_SPECIES, PRICE_RANGES } from "@/lib/outfitters";
import OutfitterCard from "@/components/OutfitterCard";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured First" },
  { value: "rating", label: "Highest Rated" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "reviews", label: "Most Reviews" },
];

export default function OutfittersPage() {
  const [search, setSearch] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 99999 });
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [country, setCountry] = useState("");

  const filtered = OUTFITTERS.filter((o) => {
    if (selectedSpecies && !o.species.includes(selectedSpecies)) return false;
    if (o.pricePerDay < priceRange.min || o.pricePerDay > priceRange.max) return false;
    if (o.rating < minRating) return false;
    if (country && o.country !== country) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.name.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q) ||
        o.province.toLowerCase().includes(q) ||
        o.species.some((s) => s.toLowerCase().includes(q)) ||
        o.guide.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q)
      );
    }
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case "rating": return b.rating - a.rating;
      case "price_asc": return a.pricePerDay - b.pricePerDay;
      case "price_desc": return b.pricePerDay - a.pricePerDay;
      case "reviews": return b.reviewCount - a.reviewCount;
      default:
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
    }
  });

  const hasFilters = selectedSpecies || priceRange.min > 0 || priceRange.max < 99999 || minRating > 0 || country;

  return (
    <div className="min-h-screen" style={{ background: "#0A0F0A" }}>

      {/* Page header */}
      <div
        className="pt-24 pb-10 px-4 sm:px-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, rgba(5,10,5,0.6) 0%, rgba(10,15,10,0.98) 100%), url('/plains.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center 60%",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold mb-2 tracking-widest uppercase" style={{ color: "#E8763A" }}>
                Directory
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                Browse All Outfitters
              </h1>
              <p className="mt-2 text-sm" style={{ color: "#5A5A4A" }}>
                {OUTFITTERS.length} verified guides across North America
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-4">
              {[
                { label: "USA", count: OUTFITTERS.filter(o => o.country === "USA").length },
                { label: "Canada", count: OUTFITTERS.filter(o => o.country === "Canada").length },
                { label: "Featured", count: OUTFITTERS.filter(o => o.featured).length },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black" style={{ color: "#E8763A" }}>{s.count}</div>
                  <div className="text-xs" style={{ color: "#5A5A4A" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div
        className="sticky top-16 z-30 px-4 sm:px-6 py-3 border-b"
        style={{
          background: "rgba(10,15,10,0.95)",
          borderColor: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div
            className="flex items-center gap-2 flex-1 min-w-48 max-w-xs px-3 py-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Search size={14} style={{ color: "#E8763A" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides, locations..."
              className="bg-transparent text-sm text-white outline-none flex-1 placeholder-gray-600"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={12} style={{ color: "#6A6A5A" }} />
              </button>
            )}
          </div>

          {/* Species */}
          <div className="relative">
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm outline-none cursor-pointer"
              style={{
                background: selectedSpecies ? "rgba(196,90,26,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${selectedSpecies ? "rgba(196,90,26,0.4)" : "rgba(255,255,255,0.08)"}`,
                color: selectedSpecies ? "#E8763A" : "#8A8A7A",
              }}
            >
              <option value="">All Species</option>
              {ALL_SPECIES.map((s) => (
                <option key={s} value={s} style={{ background: "#111811", color: "white" }}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#6A6A5A" }} />
          </div>

          {/* Country */}
          <div className="relative">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm outline-none cursor-pointer"
              style={{
                background: country ? "rgba(196,90,26,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${country ? "rgba(196,90,26,0.4)" : "rgba(255,255,255,0.08)"}`,
                color: country ? "#E8763A" : "#8A8A7A",
              }}
            >
              <option value="">All Countries</option>
              <option value="USA" style={{ background: "#111811", color: "white" }}>USA</option>
              <option value="Canada" style={{ background: "#111811", color: "white" }}>Canada</option>
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#6A6A5A" }} />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm outline-none cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#8A8A7A",
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: "#111811", color: "white" }}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#6A6A5A" }} />
          </div>

          {/* Advanced filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors"
            style={{
              background: showFilters ? "rgba(196,90,26,0.15)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${showFilters ? "rgba(196,90,26,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: showFilters ? "#E8763A" : "#8A8A7A",
            }}
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">More</span>
          </button>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={() => {
                setSelectedSpecies("");
                setPriceRange({ min: 0, max: 99999 });
                setMinRating(0);
                setCountry("");
              }}
              className="flex items-center gap-1 text-xs px-3 py-2 rounded-xl"
              style={{ color: "#E8763A", background: "rgba(196,90,26,0.1)", border: "1px solid rgba(196,90,26,0.2)" }}
            >
              <X size={11} /> Clear
            </button>
          )}

          <span className="ml-auto text-xs hidden sm:block" style={{ color: "#4A4A3A" }}>
            <span style={{ color: "#E8763A", fontWeight: "700" }}>{filtered.length}</span> results
          </span>
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <div className="max-w-7xl mx-auto pt-3 flex flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "#8A8A7A" }}>Price Range</p>
              <div className="flex gap-2">
                {PRICE_RANGES.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => setPriceRange({ min: range.min, max: range.max })}
                    className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                    style={{
                      background: priceRange.min === range.min ? "rgba(196,90,26,0.2)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${priceRange.min === range.min ? "rgba(196,90,26,0.4)" : "rgba(255,255,255,0.08)"}`,
                      color: priceRange.min === range.min ? "#E8763A" : "#8A8A7A",
                    }}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "#8A8A7A" }}>Min Rating</p>
              <div className="flex gap-2">
                {[0, 4.0, 4.5, 4.8].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                    style={{
                      background: minRating === r ? "rgba(196,90,26,0.2)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${minRating === r ? "rgba(196,90,26,0.4)" : "rgba(255,255,255,0.08)"}`,
                      color: minRating === r ? "#E8763A" : "#8A8A7A",
                    }}
                  >
                    {r === 0 ? "Any" : `${r}+ ★`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">No outfitters found</h3>
            <p style={{ color: "#5A5A4A" }}>Try broadening your search or adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((o) => (
              <OutfitterCard key={o.id} outfitter={o} />
            ))}
          </div>
        )}

        {/* Load more placeholder */}
        {filtered.length > 0 && (
          <div className="text-center mt-12">
            <button
              className="px-8 py-3 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#8A8A7A",
              }}
            >
              Load More Outfitters
            </button>
            <p className="text-xs mt-3" style={{ color: "#3A3A2A" }}>
              Showing {filtered.length} of 2,400+ outfitters
            </p>
          </div>
        )}
      </div>

      {/* List your hunt CTA */}
      <div className="px-4 sm:px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{
              background: "linear-gradient(135deg, rgba(28,58,20,0.8), rgba(42,84,32,0.6))",
              border: "1px solid rgba(196,90,26,0.2)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(196,90,26,0.15)", color: "#E8763A" }}
              >
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white">Are you a hunting guide or outfitter?</h3>
                <p className="text-sm mt-0.5" style={{ color: "#6A8A5A" }}>
                  List your hunts and connect with thousands of motivated hunters
                </p>
              </div>
            </div>
            <button className="btn-orange px-7 py-3 text-sm rounded-xl shrink-0">
              <span>List Your Hunts Free</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
