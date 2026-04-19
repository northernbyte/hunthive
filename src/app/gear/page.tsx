"use client";

import { useState } from "react";
import {
  Search, TrendingDown, TrendingUp, Minus,
  ExternalLink, ChevronDown, ChevronRight, X,
  ShoppingCart, Bell, Bot, CheckCircle2, XCircle,
  Sparkles
} from "lucide-react";
import { GEAR_ITEMS, CATEGORIES, CATEGORY_ICONS, type GearItem, type GearCategory } from "@/lib/gear";

// ── Mini sparkline chart ──────────────────────────────────────────────────────
function PriceSparkline({ data }: { data: { date: string; price: number }[] }) {
  if (data.length < 2) return null;
  const prices = data.map((d) => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const w = 120;
  const h = 36;
  const pad = 3;

  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.price - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });

  const first = prices[0];
  const last = prices[prices.length - 1];
  const trend = last < first ? "down" : last > first ? "up" : "flat";

  return (
    <div className="flex items-center gap-2">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke={trend === "down" ? "#4ade80" : trend === "up" ? "#f87171" : "#6b7280"}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Last dot */}
        <circle
          cx={parseFloat(points[points.length - 1].split(",")[0])}
          cy={parseFloat(points[points.length - 1].split(",")[1])}
          r="2.5"
          fill={trend === "down" ? "#4ade80" : trend === "up" ? "#f87171" : "#6b7280"}
        />
      </svg>
      <span
        className="text-xs font-semibold flex items-center gap-0.5"
        style={{ color: trend === "down" ? "#4ade80" : trend === "up" ? "#f87171" : "#9A9A8A" }}
      >
        {trend === "down" && <TrendingDown size={11} />}
        {trend === "up" && <TrendingUp size={11} />}
        {trend === "flat" && <Minus size={11} />}
        {trend === "down"
          ? `-$${first - last}`
          : trend === "up"
          ? `+$${last - first}`
          : "Stable"}
      </span>
    </div>
  );
}

// ── Star row ──────────────────────────────────────────────────────────────────
function Stars({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <svg key={n} width="11" height="11" viewBox="0 0 12 12"
            fill={n <= Math.round(rating) ? "#E8763A" : "#2A2A2A"}>
            <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.1L6 8l-2.78 1.56.53-3.1L1.5 4.27l3.11-.45z" />
          </svg>
        ))}
      </div>
      <span className="text-xs" style={{ color: "#E8763A" }}>{rating.toFixed(1)}</span>
      <span className="text-xs" style={{ color: "#4A4A3A" }}>({count})</span>
    </div>
  );
}

// ── Price comparison bar ──────────────────────────────────────────────────────
function PriceBar({ item }: { item: GearItem }) {
  const sorted = [...item.retailers].sort((a, b) => a.price - b.price);
  const min = sorted[0].price;
  const max = sorted[sorted.length - 1].price;
  const range = max - min || 1;

  return (
    <div className="space-y-2">
      {sorted.map((r) => (
        <div key={r.name} className="flex items-center gap-3">
          <span className="text-xs w-28 truncate shrink-0" style={{ color: r.inStock ? "#C8C8B8" : "#4A4A3A" }}>
            {r.name}
          </span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${20 + ((r.price - min) / range) * 80}%`,
                background: r.price === min
                  ? "linear-gradient(90deg, #4ade80, #22c55e)"
                  : "rgba(196,90,26,0.4)",
              }}
            />
          </div>
          <span
            className="text-xs font-bold w-14 text-right shrink-0"
            style={{ color: r.price === min ? "#4ade80" : r.inStock ? "#C8C8B8" : "#4A4A3A" }}
          >
            ${r.price}
          </span>
          {!r.inStock && (
            <span className="text-xs shrink-0" style={{ color: "#4A4A3A" }}>OOS</span>
          )}
          {r.price === min && r.inStock && (
            <span className="text-xs px-1.5 py-0.5 rounded-md shrink-0"
              style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }}>
              Best
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Gear detail modal ─────────────────────────────────────────────────────────
function GearModal({ item, onClose }: { item: GearItem; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "prices" | "specs">("overview");
  const savings = item.msrp - item.lowestPrice;
  const savingsPct = Math.round((savings / item.msrp) * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }} />

      {/* Panel */}
      <div
        className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl"
        style={{
          background: "#111811",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.7)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 pt-6 pb-4"
          style={{ background: "#111811", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", color: "#8A8A7A" }}
          >
            <X size={15} />
          </button>

          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0"
              style={{ background: "rgba(196,90,26,0.1)", border: "1px solid rgba(196,90,26,0.15)" }}
            >
              {item.image}
            </div>
            <div className="flex-1 pr-8">
              {item.expertPick && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mb-1.5"
                  style={{ background: "rgba(196,90,26,0.15)", color: "#E8763A", border: "1px solid rgba(196,90,26,0.2)" }}>
                  <Sparkles size={10} /> Expert Pick
                </span>
              )}
              <h2 className="text-xl font-black text-white leading-tight">{item.name}</h2>
              <p className="text-sm mt-0.5" style={{ color: "#6A6A5A" }}>{item.brand} · {item.category}</p>
              <Stars rating={item.rating} count={item.reviewCount} />
            </div>
          </div>

          {/* Price highlight */}
          <div className="flex items-center gap-4 mt-4 p-4 rounded-xl"
            style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.12)" }}>
            <div>
              <p className="text-xs" style={{ color: "#4A6A4A" }}>Best Price Found</p>
              <p className="text-3xl font-black" style={{ color: "#4ade80" }}>${item.lowestPrice}</p>
            </div>
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }} className="pl-4">
              <p className="text-xs" style={{ color: "#4A6A4A" }}>MSRP</p>
              <p className="text-lg font-semibold line-through" style={{ color: "#4A4A3A" }}>${item.msrp}</p>
            </div>
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }} className="pl-4">
              <p className="text-xs" style={{ color: "#4A6A4A" }}>You Save</p>
              <p className="text-lg font-bold" style={{ color: "#E8763A" }}>${savings} ({savingsPct}%)</p>
            </div>
            <div className="ml-auto">
              <PriceSparkline data={item.priceHistory} />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {(["overview", "prices", "specs"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all"
                style={{
                  background: activeTab === tab ? "rgba(196,90,26,0.15)" : "transparent",
                  color: activeTab === tab ? "#E8763A" : "#6A6A5A",
                  border: activeTab === tab ? "1px solid rgba(196,90,26,0.25)" : "1px solid transparent",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {activeTab === "overview" && (
            <div className="space-y-5">
              <p className="text-sm leading-relaxed" style={{ color: "#9A9A8A" }}>{item.description}</p>

              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ background: "rgba(196,90,26,0.1)", color: "#E8763A", border: "1px solid rgba(196,90,26,0.2)" }}
              >
                Best For: {item.bestFor}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl p-4" style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.1)" }}>
                  <p className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: "#4ade80" }}>
                    <CheckCircle2 size={12} /> Pros
                  </p>
                  <ul className="space-y-1.5">
                    {item.pros.map((p) => (
                      <li key={p} className="text-xs flex items-start gap-1.5" style={{ color: "#8A8A7A" }}>
                        <span style={{ color: "#4ade80", flexShrink: 0 }}>✓</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl p-4" style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.1)" }}>
                  <p className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: "#f87171" }}>
                    <XCircle size={12} /> Cons
                  </p>
                  <ul className="space-y-1.5">
                    {item.cons.map((c) => (
                      <li key={c} className="text-xs flex items-start gap-1.5" style={{ color: "#8A8A7A" }}>
                        <span style={{ color: "#f87171", flexShrink: 0 }}>✗</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {item.tags.map((t) => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#6A6A5A" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === "prices" && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-white mb-1">Price Trend (6 months)</p>
                <p className="text-xs mb-4" style={{ color: "#5A5A4A" }}>
                  Current lowest is ${item.lowestPrice} — {item.lowestPrice < item.priceHistory[0].price ? "down" : "up"} from ${item.priceHistory[0].price} six months ago
                </p>
                {/* Full price chart */}
                <div
                  className="rounded-xl p-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <FullPriceChart data={item.priceHistory} />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-white mb-4">Compare Retailer Prices</p>
                <PriceBar item={item} />
              </div>

              <div className="space-y-2">
                {[...item.retailers].sort((a, b) => a.price - b.price).map((r, i) => (
                  <button
                    key={r.name}
                    disabled={!r.inStock}
                    className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left disabled:opacity-40"
                    style={{
                      background: i === 0 ? "rgba(74,222,128,0.07)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${i === 0 ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.06)"}`,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: "rgba(196,90,26,0.2)" }}
                    >
                      {r.logo}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{r.name}</p>
                      <p className="text-xs" style={{ color: r.inStock ? "#4ade80" : "#f87171" }}>
                        {r.inStock ? "In Stock" : "Out of Stock"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-base"
                        style={{ color: i === 0 && r.inStock ? "#4ade80" : "#C8C8B8" }}>
                        ${r.price}
                      </p>
                      {i === 0 && r.inStock && (
                        <p className="text-xs" style={{ color: "#4ade80" }}>Best price</p>
                      )}
                    </div>
                    <ExternalLink size={14} style={{ color: "#4A4A3A" }} />
                  </button>
                ))}
              </div>

              {/* Price alert */}
              <div
                className="rounded-xl p-4 flex items-center justify-between gap-4"
                style={{ background: "rgba(196,90,26,0.08)", border: "1px solid rgba(196,90,26,0.2)" }}
              >
                <div className="flex items-center gap-3">
                  <Bell size={18} style={{ color: "#E8763A" }} />
                  <div>
                    <p className="text-sm font-semibold text-white">Price Drop Alert</p>
                    <p className="text-xs" style={{ color: "#6A6A5A" }}>Get notified when the price drops further</p>
                  </div>
                </div>
                <button className="btn-orange px-4 py-2 text-xs rounded-lg shrink-0">
                  <span>Set Alert</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="space-y-2">
              {Object.entries(item.specs).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-3 px-4 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span className="text-sm" style={{ color: "#6A6A5A" }}>{key}</span>
                  <span className="text-sm font-medium text-white text-right ml-4">{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="sticky bottom-0 px-6 pb-6 pt-4"
          style={{ background: "#111811", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex gap-3">
            <button className="btn-orange flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2">
              <span className="flex items-center gap-2">
                <ShoppingCart size={16} />
                Buy for ${item.lowestPrice} →
              </span>
            </button>
            <button
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#8A8A7A" }}
            >
              <Bell size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Full price chart (modal) ──────────────────────────────────────────────────
function FullPriceChart({ data }: { data: { date: string; price: number }[] }) {
  const prices = data.map((d) => d.price);
  const min = Math.min(...prices) - 20;
  const max = Math.max(...prices) + 20;
  const range = max - min;
  const w = 500;
  const h = 100;
  const pad = { top: 10, right: 10, bottom: 24, left: 42 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;

  const pts = data.map((d, i) => {
    const x = pad.left + (i / (data.length - 1)) * innerW;
    const y = pad.top + (1 - (d.price - min) / range) * innerH;
    return { x, y, ...d };
  });

  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const fillD = `${pathD} L ${pts[pts.length - 1].x} ${h - pad.bottom} L ${pts[0].x} ${h - pad.bottom} Z`;

  const months = data.map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString("en-US", { month: "short" });
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ overflow: "visible" }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = pad.top + t * innerH;
        const price = Math.round(max - t * range);
        return (
          <g key={t}>
            <line x1={pad.left} y1={y} x2={w - pad.right} y2={y}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4,4" />
            <text x={pad.left - 5} y={y + 4} textAnchor="end"
              fontSize="9" fill="#4A4A3A">${price}</text>
          </g>
        );
      })}

      {/* Area fill */}
      <path d={fillD} fill="url(#areaGrad)" />
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8763A" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#E8763A" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Line */}
      <path d={pathD} fill="none" stroke="#E8763A" strokeWidth="2"
        strokeLinejoin="round" strokeLinecap="round" />

      {/* Dots + labels */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill="#E8763A" />
          <text x={p.x} y={h - pad.bottom + 14} textAnchor="middle"
            fontSize="9" fill="#4A4A3A">{months[i]}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Gear card ─────────────────────────────────────────────────────────────────
function GearCard({ item, onClick }: { item: GearItem; onClick: () => void }) {
  const savings = item.msrp - item.lowestPrice;
  const savingsPct = Math.round((savings / item.msrp) * 100);
  const trend = item.priceHistory[item.priceHistory.length - 1].price <
    item.priceHistory[0].price ? "down" : "up";

  return (
    <div
      className="card-hover rounded-2xl overflow-hidden cursor-pointer flex flex-col"
      style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.07)" }}
      onClick={onClick}
    >
      {/* Image area */}
      <div
        className="relative flex items-center justify-center h-36 text-6xl"
        style={{ background: "linear-gradient(135deg, #0C1A0C, #1A2A1A)" }}
      >
        {item.image}
        {item.expertPick && (
          <span
            className="absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{ background: "linear-gradient(135deg, #C45A1A, #E8763A)", color: "white" }}
          >
            <Sparkles size={9} /> Expert Pick
          </span>
        )}
        <span
          className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            background: trend === "down" ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)",
            color: trend === "down" ? "#4ade80" : "#f87171",
            border: `1px solid ${trend === "down" ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`,
          }}
        >
          {trend === "down" ? `↓ ${savingsPct}% off` : "↑ Rising"}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs mb-0.5" style={{ color: "#5A5A4A" }}>{item.brand}</p>
        <h3 className="font-bold text-white text-sm leading-tight mb-2">{item.name}</h3>
        <Stars rating={item.rating} count={item.reviewCount} />

        <p className="text-xs mt-2 line-clamp-2 leading-relaxed" style={{ color: "#5A5A4A" }}>
          {item.description}
        </p>

        {/* Sparkline */}
        <div className="mt-3">
          <PriceSparkline data={item.priceHistory} />
        </div>

        {/* Price row */}
        <div className="flex items-end justify-between mt-3 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <p className="text-xs" style={{ color: "#4A4A3A" }}>Best Price</p>
            <p className="text-xl font-black" style={{ color: "#4ade80" }}>${item.lowestPrice}</p>
            <p className="text-xs line-through" style={{ color: "#3A3A2A" }}>${item.msrp} MSRP</p>
          </div>
          <div className="text-right">
            <p className="text-xs mb-1" style={{ color: "#4A4A3A" }}>
              {item.retailers.filter((r) => r.inStock).length} stores
            </p>
            <button
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(196,90,26,0.12)", color: "#E8763A", border: "1px solid rgba(196,90,26,0.2)" }}
            >
              Compare <ChevronRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── AI Reco Banner ────────────────────────────────────────────────────────────
function AIRecoBanner({ onAsk }: { onAsk: () => void }) {
  const [query, setQuery] = useState("");

  return (
    <div
      className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1A2A0A 0%, #0F1A0F 60%, #1C2A10 100%)",
        border: "1px solid rgba(196,90,26,0.2)",
      }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #E8763A, transparent)", transform: "translate(30%, -30%)" }} />
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #C45A1A, #E8763A)" }}
        >
          <Bot size={26} color="white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-black text-white">HiveAI Gear Advisor</h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }}>
              Powered by GPT-4o
            </span>
          </div>
          <p className="text-sm mb-4" style={{ color: "#6A7A5A" }}>
            Describe your hunt and get personalized gear recommendations with price comparisons across all major retailers.
          </p>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 flex-1 max-w-md px-4 py-2.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <Search size={14} style={{ color: "#E8763A" }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onAsk()}
                placeholder="e.g. 6-day backcountry elk hunt in Colorado..."
                className="bg-transparent text-sm text-white outline-none flex-1 placeholder-gray-600"
              />
            </div>
            <button
              onClick={onAsk}
              className="btn-orange px-5 py-2.5 text-sm rounded-xl"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} /> Ask HiveAI
              </span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Best elk rifle under $1000", "Optics for mule deer", "Backcountry pack setup"].map((s) => (
              <button
                key={s}
                className="text-xs px-3 py-1 rounded-full transition-colors"
                style={{
                  background: "rgba(196,90,26,0.08)",
                  border: "1px solid rgba(196,90,26,0.2)",
                  color: "#9A7A5A",
                }}
                onClick={onAsk}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function GearPage() {
  const [activeCategory, setActiveCategory] = useState<GearCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "price_low" | "price_high" | "rating" | "discount">("popular");
  const [selectedItem, setSelectedItem] = useState<GearItem | null>(null);
  const [expertsOnly, setExpertsOnly] = useState(false);

  const filtered = GEAR_ITEMS.filter((item) => {
    if (activeCategory !== "All" && item.category !== activeCategory) return false;
    if (expertsOnly && !item.expertPick) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case "price_low": return a.lowestPrice - b.lowestPrice;
      case "price_high": return b.lowestPrice - a.lowestPrice;
      case "rating": return b.rating - a.rating;
      case "discount": return (b.msrp - b.lowestPrice) / b.msrp - (a.msrp - a.lowestPrice) / a.msrp;
      default: return b.reviewCount - a.reviewCount;
    }
  });

  // Open AI chat — scroll to chat button and simulate click
  const openAIChat = () => {
    const btn = document.querySelector<HTMLButtonElement>('[title="Ask HiveAI"]');
    btn?.click();
  };

  return (
    <div className="min-h-screen" style={{ background: "#0A0F0A" }}>

      {/* Page header */}
      <div
        className="pt-24 pb-8 px-4 sm:px-6"
        style={{ background: "linear-gradient(180deg, #0C1A0C 0%, #0A0F0A 100%)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-semibold mb-2 tracking-widest uppercase" style={{ color: "#E8763A" }}>
            Gear Hub
          </p>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                Gear Reviews & Price Tracker
              </h1>
              <p className="mt-2 text-sm" style={{ color: "#5A5A4A" }}>
                Expert reviews, real-time price comparisons, and AI-powered recommendations across {GEAR_ITEMS.length}+ products
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <div className="text-center">
                <p className="font-black text-xl" style={{ color: "#E8763A" }}>5</p>
                <p className="text-xs" style={{ color: "#4A4A3A" }}>Retailers tracked</p>
              </div>
              <div className="text-center">
                <p className="font-black text-xl" style={{ color: "#4ade80" }}>↓ 23%</p>
                <p className="text-xs" style={{ color: "#4A4A3A" }}>Avg savings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* AI Reco banner */}
        <AIRecoBanner onAsk={openAIChat} />

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("All")}
            className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              background: activeCategory === "All" ? "linear-gradient(135deg, #C45A1A, #E8763A)" : "rgba(255,255,255,0.05)",
              color: activeCategory === "All" ? "white" : "#6A6A5A",
              border: activeCategory === "All" ? "none" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            All Gear
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: activeCategory === cat ? "linear-gradient(135deg, #C45A1A, #E8763A)" : "rgba(255,255,255,0.05)",
                color: activeCategory === cat ? "white" : "#6A6A5A",
                border: activeCategory === cat ? "none" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* Filter/search bar */}
        <div className="flex items-center gap-3 flex-wrap">
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
              placeholder="Search gear..."
              className="bg-transparent text-sm text-white outline-none flex-1 placeholder-gray-600"
            />
            {search && <button onClick={() => setSearch("")}><X size={12} style={{ color: "#6A6A5A" }} /></button>}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm outline-none cursor-pointer"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#8A8A7A" }}
            >
              <option value="popular" style={{ background: "#111811", color: "white" }}>Most Popular</option>
              <option value="rating" style={{ background: "#111811", color: "white" }}>Highest Rated</option>
              <option value="discount" style={{ background: "#111811", color: "white" }}>Biggest Discount</option>
              <option value="price_low" style={{ background: "#111811", color: "white" }}>Price: Low → High</option>
              <option value="price_high" style={{ background: "#111811", color: "white" }}>Price: High → Low</option>
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#6A6A5A" }} />
          </div>

          {/* Expert picks toggle */}
          <button
            onClick={() => setExpertsOnly(!expertsOnly)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
            style={{
              background: expertsOnly ? "rgba(196,90,26,0.15)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${expertsOnly ? "rgba(196,90,26,0.35)" : "rgba(255,255,255,0.08)"}`,
              color: expertsOnly ? "#E8763A" : "#6A6A5A",
            }}
          >
            <Sparkles size={13} />
            Expert Picks
          </button>

          <span className="ml-auto text-xs hidden sm:block" style={{ color: "#4A4A3A" }}>
            <span style={{ color: "#E8763A", fontWeight: "700" }}>{filtered.length}</span> products
          </span>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎯</div>
            <p className="text-white font-bold mb-1">No gear found</p>
            <p className="text-sm" style={{ color: "#5A5A4A" }}>Try a different category or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((item) => (
              <GearCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
            ))}
          </div>
        )}

        {/* Tracker info bar */}
        <div
          className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <h3 className="font-bold text-white mb-1 flex items-center gap-2">
              <Bell size={16} style={{ color: "#E8763A" }} />
              Price Drop Alerts
            </h3>
            <p className="text-sm" style={{ color: "#5A5A4A" }}>
              Track any product and get notified the moment the price drops at any retailer.
            </p>
          </div>
          <button className="btn-orange px-6 py-3 text-sm rounded-xl shrink-0">
            <span className="flex items-center gap-2">
              <Bell size={14} />
              Set Up Alerts
            </span>
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <GearModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
