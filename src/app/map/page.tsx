"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import {
  Search, SlidersHorizontal, X, MapPin, Star, ChevronDown
} from "lucide-react";
import { OUTFITTERS, ALL_SPECIES, PRICE_RANGES, type Outfitter } from "@/lib/outfitters";
import OutfitterCard from "@/components/OutfitterCard";

const DynamicMap = dynamic(() => import("@/components/OutfitterMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: "#0F1A0F" }}
    >
      <div className="text-center">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3"
          style={{ borderColor: "#E8763A", borderTopColor: "transparent" }}
        />
        <p style={{ color: "#5A5A4A" }}>Loading map...</p>
      </div>
    </div>
  ),
});

function MapPageContent() {
  const searchParams = useSearchParams();
  const [selectedSpecies, setSelectedSpecies] = useState<string>(
    searchParams.get("species") || ""
  );
  const [priceRange, setPriceRange] = useState({ min: 0, max: 99999 });
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedOutfitter, setSelectedOutfitter] = useState<Outfitter | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "map" | "list">("split");
  const [minRating, setMinRating] = useState(0);

  const filtered = OUTFITTERS.filter((o) => {
    if (selectedSpecies && !o.species.includes(selectedSpecies)) return false;
    if (o.pricePerDay < priceRange.min || o.pricePerDay > priceRange.max) return false;
    if (o.rating < minRating) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.name.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q) ||
        o.province.toLowerCase().includes(q) ||
        o.species.some((s) => s.toLowerCase().includes(q)) ||
        o.guide.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col h-screen" style={{ background: "#0A0F0A" }}>

      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b shrink-0"
        style={{
          background: "#0F1A0F",
          borderColor: "rgba(255,255,255,0.06)",
          paddingTop: "calc(64px + 12px)",
        }}
      >
        {/* Search */}
        <div
          className="flex items-center gap-2 flex-1 max-w-sm px-3 py-2 rounded-xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Search size={14} style={{ color: "#E8763A" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search outfitters, locations..."
            className="bg-transparent text-sm text-white outline-none flex-1 placeholder-gray-600"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X size={12} style={{ color: "#6A6A5A" }} />
            </button>
          )}
        </div>

        {/* Species filter */}
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
          <ChevronDown
            size={12}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "#6A6A5A" }}
          />
        </div>

        {/* Filter button */}
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
          <span className="hidden sm:inline">Filters</span>
        </button>

        {/* View toggle */}
        <div
          className="hidden sm:flex rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {(["split", "map", "list"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="px-3 py-2 text-xs font-medium capitalize transition-colors"
              style={{
                background: viewMode === mode ? "rgba(196,90,26,0.2)" : "rgba(255,255,255,0.03)",
                color: viewMode === mode ? "#E8763A" : "#6A6A5A",
              }}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Count badge */}
        <div className="hidden sm:flex items-center gap-1 text-xs" style={{ color: "#5A5A4A" }}>
          <span style={{ color: "#E8763A", fontWeight: "700" }}>{filtered.length}</span>
          <span>outfitters</span>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div
          className="px-4 py-4 border-b flex flex-wrap items-center gap-4 shrink-0"
          style={{
            background: "#0F1A0F",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "#8A8A7A" }}>
              Price Range
            </p>
            <div className="flex gap-2">
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.label}
                  onClick={() => setPriceRange({ min: range.min, max: range.max })}
                  className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                  style={{
                    background:
                      priceRange.min === range.min
                        ? "rgba(196,90,26,0.2)"
                        : "rgba(255,255,255,0.05)",
                    border: `1px solid ${
                      priceRange.min === range.min
                        ? "rgba(196,90,26,0.4)"
                        : "rgba(255,255,255,0.08)"
                    }`,
                    color: priceRange.min === range.min ? "#E8763A" : "#8A8A7A",
                  }}
                >
                  {range.label}
                </button>
              ))}
              <button
                onClick={() => setPriceRange({ min: 0, max: 99999 })}
                className="px-3 py-1.5 rounded-lg text-xs"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#6A6A5A",
                }}
              >
                Any
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "#8A8A7A" }}>
              Min Rating
            </p>
            <div className="flex gap-2">
              {[0, 4.0, 4.5, 4.8].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                  style={{
                    background:
                      minRating === r ? "rgba(196,90,26,0.2)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${
                      minRating === r ? "rgba(196,90,26,0.4)" : "rgba(255,255,255,0.08)"
                    }`,
                    color: minRating === r ? "#E8763A" : "#8A8A7A",
                  }}
                >
                  {r === 0 ? "Any" : `${r}+ ★`}
                </button>
              ))}
            </div>
          </div>

          {(selectedSpecies || priceRange.min > 0 || priceRange.max < 99999 || minRating > 0) && (
            <button
              onClick={() => {
                setSelectedSpecies("");
                setPriceRange({ min: 0, max: 99999 });
                setMinRating(0);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
              style={{ color: "#E8763A", background: "rgba(196,90,26,0.1)", border: "1px solid rgba(196,90,26,0.2)" }}
            >
              <X size={11} /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">

        {/* List panel */}
        {viewMode !== "map" && (
          <div
            className={`${viewMode === "split" ? "w-full sm:w-96" : "w-full"} overflow-y-auto shrink-0`}
            style={{
              background: "#0A0F0A",
              borderRight: viewMode === "split" ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <div className="p-3 space-y-3">
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <MapPin size={32} className="mx-auto mb-3 opacity-30" style={{ color: "#E8763A" }} />
                  <p className="text-white font-medium mb-1">No outfitters found</p>
                  <p className="text-sm" style={{ color: "#5A5A4A" }}>
                    Try adjusting your filters
                  </p>
                </div>
              ) : (
                filtered.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => setSelectedOutfitter(o)}
                    className={`cursor-pointer transition-all rounded-2xl ${
                      selectedOutfitter?.id === o.id ? "ring-2 ring-orange-500/50" : ""
                    }`}
                  >
                    <OutfitterCard outfitter={o} compact={viewMode === "split"} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Map panel */}
        {viewMode !== "list" && (
          <div className="flex-1 relative">
            <DynamicMap
              outfitters={filtered}
              selectedSpecies={selectedSpecies}
              onSelect={setSelectedOutfitter}
            />

            {/* Selected outfitter panel */}
            {selectedOutfitter && viewMode === "map" && (
              <div
                className="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:w-80 rounded-2xl p-4 z-10"
                style={{
                  background: "#111811",
                  border: "1px solid rgba(196,90,26,0.3)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                }}
              >
                <button
                  onClick={() => setSelectedOutfitter(null)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#8A8A7A" }}
                >
                  <X size={13} />
                </button>
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: "linear-gradient(135deg, #C45A1A, #E8763A)" }}
                  >
                    {selectedOutfitter.guidePhoto}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">{selectedOutfitter.name}</h3>
                    <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: "#8A8A7A" }}>
                      <MapPin size={10} />
                      <span className="truncate">{selectedOutfitter.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs flex items-center gap-0.5" style={{ color: "#E8763A" }}>
                        <Star size={10} fill="#E8763A" />
                        {selectedOutfitter.rating}
                      </span>
                      <span className="text-xs font-bold" style={{ color: "#E8763A" }}>
                        ${selectedOutfitter.pricePerDay}/day
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {selectedOutfitter.species.slice(0, 3).map((s) => (
                    <span key={s} className="species-badge">{s}</span>
                  ))}
                </div>
                <button
                  className="btn-orange w-full mt-3 py-2.5 text-sm rounded-xl"
                >
                  <span>View Full Profile</span>
                </button>
              </div>
            )}

            {/* Floating result count */}
            <div
              className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl text-xs font-medium"
              style={{
                background: "rgba(10,15,10,0.9)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#8A8A7A",
                backdropFilter: "blur(8px)",
              }}
            >
              <span style={{ color: "#E8763A" }}>{filtered.length}</span> outfitters shown
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center" style={{ background: "#0A0F0A" }}>
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#E8763A", borderTopColor: "transparent" }} />
      </div>
    }>
      <MapPageContent />
    </Suspense>
  );
}
