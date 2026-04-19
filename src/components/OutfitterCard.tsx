"use client";

import Link from "next/link";
import { MapPin, Users, Calendar, ChevronRight } from "lucide-react";
import type { Outfitter } from "@/lib/outfitters";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill={n <= Math.round(rating) ? "#E8763A" : "#2A2A2A"}
        >
          <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.1L6 8l-2.78 1.56.53-3.1L1.5 4.27l3.11-.45z" />
        </svg>
      ))}
      <span className="text-xs text-gray-400 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

interface Props {
  outfitter: Outfitter;
  compact?: boolean;
}

export default function OutfitterCard({ outfitter, compact }: Props) {
  const priceColor = outfitter.pricePerDay > 700 ? "#E8763A" : outfitter.pricePerDay > 400 ? "#D4A056" : "#7DC87D";

  return (
    <Link
      href={`/outfitters/${outfitter.id}`}
      className="card-hover rounded-2xl overflow-hidden cursor-pointer group block"
      style={{
        background: "#111811",
        border: "1px solid rgba(255,255,255,0.07)",
        textDecoration: "none",
      }}
    >
      {/* Header image area */}
      <div
        className="relative h-40 flex items-end justify-start p-4 overflow-hidden"
        style={{
          background: `linear-gradient(135deg,
            hsl(${(parseInt(outfitter.id) * 37) % 60 + 90}, 40%, 12%) 0%,
            hsl(${(parseInt(outfitter.id) * 37) % 60 + 100}, 50%, 18%) 100%)`,
        }}
      >
        {/* Decorative trees silhouette */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full opacity-20"
          viewBox="0 0 400 80"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 L0,40 L20,40 L20,20 L30,20 L30,0 L40,0 L40,20 L50,20 L50,10 L60,10 L60,30 L70,30 L70,15 L80,15 L80,35 L90,35 L90,20 L100,20 L100,40 L120,40 L120,25 L130,25 L130,5 L140,5 L140,25 L150,25 L150,15 L160,15 L160,35 L180,35 L180,20 L190,20 L190,40 L200,40 L200,30 L210,30 L210,10 L220,10 L220,30 L230,30 L230,15 L240,15 L240,35 L250,35 L250,40 L270,40 L270,20 L280,20 L280,0 L290,0 L290,20 L300,20 L300,30 L310,30 L310,15 L320,15 L320,35 L330,35 L330,25 L340,25 L340,40 L360,40 L360,20 L370,20 L370,35 L380,35 L380,40 L400,40 L400,80 Z"
            fill="currentColor"
          />
        </svg>

        {outfitter.featured && (
          <span
            className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "linear-gradient(135deg, #C45A1A, #E8763A)", color: "white" }}
          >
            Featured
          </span>
        )}

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "rgba(196,90,26,0.7)" }}
            >
              {outfitter.guidePhoto}
            </div>
            <span className="text-white text-sm font-medium">{outfitter.guide}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-white text-base leading-tight group-hover:text-orange-400 transition-colors">
            {outfitter.name}
          </h3>
          <span className="text-sm font-bold shrink-0" style={{ color: priceColor }}>
            ${outfitter.pricePerDay}/day
          </span>
        </div>

        <div className="flex items-center gap-1 text-gray-400 text-xs mb-2.5">
          <MapPin size={11} />
          <span>{outfitter.location}, {outfitter.province}</span>
        </div>

        <Stars rating={outfitter.rating} />
        <span className="text-xs text-gray-500 ml-1">({outfitter.reviewCount} reviews)</span>

        {!compact && (
          <p className="text-gray-400 text-xs mt-2.5 line-clamp-2 leading-relaxed">
            {outfitter.description}
          </p>
        )}

        {/* Species tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {outfitter.species.slice(0, 3).map((s) => (
            <span key={s} className="species-badge">{s}</span>
          ))}
          {outfitter.species.length > 3 && (
            <span className="species-badge">+{outfitter.species.length - 3}</span>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar size={10} />
              {outfitter.availability}
            </span>
            <span className="flex items-center gap-1">
              <Users size={10} />
              {outfitter.maxGuests} max
            </span>
          </div>
          <span
            className="flex items-center gap-1 text-xs font-medium transition-colors"
            style={{ color: "#E8763A" }}
          >
            View Hunt <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
