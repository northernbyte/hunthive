"use client";

import { useState, use } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft, Star, Users, Shield, Calendar,
  Phone, Mail, MessageSquare, ChevronRight, Check,
  ThumbsUp, Clock, Award, Camera, AlertCircle,
  ChevronDown, X, Send, MapPin
} from "lucide-react";
import { OUTFITTERS, type Outfitter } from "@/lib/outfitters";
import { REVIEWS } from "@/lib/reviews";

const DynamicMap = dynamic(() => import("@/components/OutfitterMap"), { ssr: false });

// ── Sub-components ────────────────────────────────────────────────────────────

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width={size} height={size} viewBox="0 0 12 12"
          fill={n <= Math.round(rating) ? "#E8763A" : "#2A2A2A"}>
          <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.1L6 8l-2.78 1.56.53-3.1L1.5 4.27l3.11-.45z" />
        </svg>
      ))}
    </div>
  );
}

function BookingModal({ outfitter, onClose }: { outfitter: Outfitter; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    species: "", partySize: "2", month: "", message: "",
    experience: "intermediate"
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }} />
      <div
        className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 40px 80px rgba(0,0,0,0.7)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div>
            <h2 className="font-black text-white text-lg">Request a Hunt</h2>
            <p className="text-xs mt-0.5" style={{ color: "#5A5A4A" }}>
              {outfitter.name} · No payment required
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.05)", color: "#8A8A7A" }}>
            <X size={15} />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex px-6 py-3 gap-2">
          {[1, 2, 3].map(n => (
            <div key={n} className="flex-1 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: step >= n ? "linear-gradient(135deg, #C45A1A, #E8763A)" : "rgba(255,255,255,0.06)",
                  color: step >= n ? "white" : "#4A4A3A",
                }}>
                {step > n ? <Check size={12} /> : n}
              </div>
              <span className="text-xs hidden sm:inline" style={{ color: step >= n ? "#E8763A" : "#4A4A3A" }}>
                {n === 1 ? "Hunt Details" : n === 2 ? "Your Info" : "Message"}
              </span>
              {n < 3 && <div className="flex-1 h-px" style={{ background: step > n ? "rgba(196,90,26,0.4)" : "rgba(255,255,255,0.06)" }} />}
            </div>
          ))}
        </div>

        {/* Form body */}
        {!submitted ? (
          <div className="px-6 pb-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: "#8A8A7A" }}>Target Species</label>
                  <div className="relative">
                    <select value={form.species} onChange={e => update("species", e.target.value)}
                      className="w-full appearance-none px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: form.species ? "white" : "#4A4A4A" }}>
                      <option value="">Select a species...</option>
                      {outfitter.species.map(s => (
                        <option key={s} value={s} style={{ background: "#111811", color: "white" }}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#6A6A5A" }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "#8A8A7A" }}>Party Size</label>
                    <div className="relative">
                      <select value={form.partySize} onChange={e => update("partySize", e.target.value)}
                        className="w-full appearance-none px-4 py-3 rounded-xl text-sm outline-none text-white"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        {[1,2,3,4,5,6].map(n => (
                          <option key={n} value={n} style={{ background: "#111811" }}>{n} hunter{n > 1 ? "s" : ""}</option>
                        ))}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#6A6A5A" }} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "#8A8A7A" }}>Preferred Month</label>
                    <div className="relative">
                      <select value={form.month} onChange={e => update("month", e.target.value)}
                        className="w-full appearance-none px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: form.month ? "white" : "#4A4A4A" }}>
                        <option value="">Select...</option>
                        {["August","September","October","November","December"].map(m => (
                          <option key={m} value={m} style={{ background: "#111811", color: "white" }}>{m}</option>
                        ))}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#6A6A5A" }} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: "#8A8A7A" }}>Experience Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["beginner","intermediate","experienced"].map(level => (
                      <button key={level} onClick={() => update("experience", level)}
                        className="py-2.5 rounded-xl text-xs font-medium capitalize transition-all"
                        style={{
                          background: form.experience === level ? "rgba(196,90,26,0.15)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${form.experience === level ? "rgba(196,90,26,0.4)" : "rgba(255,255,255,0.07)"}`,
                          color: form.experience === level ? "#E8763A" : "#6A6A5A",
                        }}>
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setStep(2)}
                  className="btn-orange w-full py-3.5 rounded-xl text-sm font-semibold mt-2">
                  <span>Continue →</span>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[["firstName","First Name"],["lastName","Last Name"]].map(([k,label]) => (
                    <div key={k}>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#8A8A7A" }}>{label}</label>
                      <input type="text" value={(form as Record<string, string>)[k]}
                        onChange={e => update(k, e.target.value)}
                        placeholder={label}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none placeholder-gray-600"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: "#8A8A7A" }}>Email</label>
                  <input type="email" value={form.email} onChange={e => update("email", e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none placeholder-gray-600"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: "#8A8A7A" }}>Phone</label>
                  <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none placeholder-gray-600"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)}
                    className="flex-1 py-3.5 rounded-xl text-sm font-semibold"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#8A8A7A" }}>
                    ← Back
                  </button>
                  <button onClick={() => setStep(3)}
                    className="btn-orange flex-1 py-3.5 rounded-xl text-sm font-semibold">
                    <span>Continue →</span>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: "#8A8A7A" }}>Message to Outfitter</label>
                  <textarea value={form.message} onChange={e => update("message", e.target.value)}
                    placeholder="Tell the guide about your hunt goals, any physical limitations, specific trophy size targets, or questions you have..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none placeholder-gray-600 resize-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                <div className="rounded-xl p-3 flex items-start gap-2.5"
                  style={{ background: "rgba(196,90,26,0.07)", border: "1px solid rgba(196,90,26,0.15)" }}>
                  <AlertCircle size={14} style={{ color: "#E8763A", flexShrink: 0, marginTop: 1 }} />
                  <p className="text-xs" style={{ color: "#8A7A6A" }}>
                    This is an inquiry only — no payment is charged. The outfitter will contact you within 24 hours to discuss availability and pricing.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)}
                    className="flex-1 py-3.5 rounded-xl text-sm font-semibold"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#8A8A7A" }}>
                    ← Back
                  </button>
                  <button
                    onClick={() => setSubmitted(true)}
                    className="btn-orange flex-1 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                    <span className="flex items-center gap-2"><Send size={14} /> Send Inquiry</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="px-6 pb-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(74,222,128,0.15)", border: "2px solid rgba(74,222,128,0.3)" }}>
              <Check size={28} style={{ color: "#4ade80" }} />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Inquiry Sent!</h3>
            <p className="text-sm mb-6" style={{ color: "#6A6A5A" }}>
              {outfitter.guide} at {outfitter.name} will be in touch within 24 hours. Check your email at {form.email}.
            </p>
            <button onClick={onClose} className="btn-orange w-full py-3.5 rounded-xl text-sm">
              <span>Done</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function OutfitterProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const outfitter = OUTFITTERS.find(o => o.id === id);
  const reviews = REVIEWS.filter(r => r.outfitterId === id);
  const [showBooking, setShowBooking] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "location">("overview");
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  if (!outfitter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#0A0F0A" }}>
        <p className="text-white text-xl font-bold mb-2">Outfitter not found</p>
        <Link href="/outfitters" className="text-sm" style={{ color: "#E8763A" }}>← Browse all outfitters</Link>
      </div>
    );
  }

  const avgRating = outfitter.rating;
  const ratingDist = [5,4,3,2,1].map(n => ({
    stars: n,
    count: reviews.filter(r => Math.round(r.rating) === n).length,
    pct: reviews.length > 0
      ? Math.round((reviews.filter(r => Math.round(r.rating) === n).length / reviews.length) * 100)
      : (n === 5 ? 80 : n === 4 ? 15 : 5),
  }));

  return (
    <div className="min-h-screen" style={{ background: "#0A0F0A" }}>

      {/* Hero banner */}
      <div
        className="relative h-72 sm:h-96 flex items-end"
        style={{
          background: `
            linear-gradient(180deg, rgba(10,15,10,0.2) 0%, rgba(10,15,10,0.9) 100%),
            linear-gradient(135deg,
              hsl(${(parseInt(outfitter.id) * 37) % 60 + 100}, 45%, 10%) 0%,
              hsl(${(parseInt(outfitter.id) * 37) % 60 + 110}, 55%, 18%) 100%)
          `,
        }}
      >
        {/* Tree silhouette decoration */}
        <svg className="absolute bottom-0 left-0 right-0 w-full opacity-15" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,120 L0,60 L50,60 L50,20 L70,20 L70,0 L90,0 L90,20 L110,20 L110,40 L140,40 L140,10 L160,10 L160,30 L180,30 L180,50 L210,50 L210,15 L230,15 L230,0 L250,0 L250,15 L270,15 L270,35 L300,35 L300,55 L330,55 L330,25 L350,25 L350,5 L370,5 L370,25 L390,25 L390,45 L420,45 L420,60 L460,60 L460,30 L480,30 L480,10 L500,10 L500,30 L520,30 L520,50 L550,50 L550,20 L570,20 L570,40 L590,40 L590,60 L630,60 L630,35 L650,35 L650,15 L670,15 L670,35 L690,35 L690,55 L720,55 L720,30 L740,30 L740,50 L760,50 L760,60 L800,60 L800,25 L820,25 L820,5 L840,5 L840,25 L860,25 L860,45 L890,45 L890,60 L930,60 L930,35 L950,35 L950,15 L970,15 L970,35 L990,35 L990,55 L1020,55 L1020,30 L1040,30 L1040,50 L1060,50 L1060,60 L1100,60 L1100,40 L1120,40 L1120,20 L1140,20 L1140,40 L1160,40 L1160,60 L1200,60 L1200,120 Z"
            fill="white" />
        </svg>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-8 w-full">
          <Link href="/outfitters"
            className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-white"
            style={{ color: "#6A8A6A" }}>
            <ArrowLeft size={14} /> Back to outfitters
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              {outfitter.featured && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full mb-3"
                  style={{ background: "linear-gradient(135deg, #C45A1A, #E8763A)", color: "white" }}>
                  ★ Featured Outfitter
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">{outfitter.name}</h1>
              <div className="flex items-center gap-1.5 mt-2 text-sm" style={{ color: "#8A9A8A" }}>
                <MapPin size={13} />
                <span>{outfitter.location}, {outfitter.province}, {outfitter.country}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <Stars rating={avgRating} size={16} />
                  <span className="text-white font-bold text-lg">{avgRating.toFixed(1)}</span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: "#5A6A5A" }}>{outfitter.reviewCount} reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="sticky top-16 z-30 border-b"
        style={{ background: "rgba(10,15,10,0.95)", borderColor: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex gap-1">
            {(["overview","reviews","location"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all"
                style={{
                  background: activeTab === tab ? "rgba(196,90,26,0.15)" : "transparent",
                  color: activeTab === tab ? "#E8763A" : "#6A6A5A",
                  border: activeTab === tab ? "1px solid rgba(196,90,26,0.2)" : "1px solid transparent",
                }}>
                {tab}
              </button>
            ))}
          </div>
          <button onClick={() => setShowBooking(true)}
            className="btn-orange px-5 py-2.5 text-sm rounded-xl">
            <span className="flex items-center gap-1.5">
              <MessageSquare size={13} /> Request Hunt
            </span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left column — main content */}
          <div className="lg:col-span-2 space-y-8">

            {activeTab === "overview" && (
              <>
                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Price per Day", value: `$${outfitter.pricePerDay}`, icon: <Award size={16} /> },
                    { label: "Max Guests", value: `${outfitter.maxGuests} hunters`, icon: <Users size={16} /> },
                    { label: "Availability", value: outfitter.availability, icon: <Calendar size={16} /> },
                    { label: "Rating", value: `${avgRating.toFixed(1)} / 5.0`, icon: <Star size={16} /> },
                  ].map(s => (
                    <div key={s.label} className="rounded-2xl p-4"
                      style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="mb-2" style={{ color: "#E8763A" }}>{s.icon}</div>
                      <p className="font-bold text-white text-lg leading-tight">{s.value}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#4A4A3A" }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* About */}
                <div className="rounded-2xl p-6" style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <h2 className="text-lg font-black text-white mb-3">About This Hunt</h2>
                  <p className="text-sm leading-relaxed" style={{ color: "#8A8A7A" }}>{outfitter.description}</p>
                  <p className="text-sm leading-relaxed mt-3" style={{ color: "#8A8A7A" }}>
                    Located in {outfitter.location}, {outfitter.province}, this operation offers world-class guided hunting experiences in some of North America&apos;s most productive game country. All hunts are fully guided with a 1:1 or 2:1 hunter-to-guide ratio to maximize your success.
                  </p>
                </div>

                {/* Species */}
                <div className="rounded-2xl p-6" style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <h2 className="text-lg font-black text-white mb-4">Available Species</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {outfitter.species.map(s => (
                      <div key={s} className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                        style={{ background: "rgba(196,90,26,0.08)", border: "1px solid rgba(196,90,26,0.15)" }}>
                        <Check size={12} style={{ color: "#E8763A", flexShrink: 0 }} />
                        <span className="text-sm text-white">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hunt tags */}
                <div className="rounded-2xl p-6" style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <h2 className="text-lg font-black text-white mb-4">Hunt Style</h2>
                  <div className="flex flex-wrap gap-2">
                    {outfitter.tags.map(t => (
                      <span key={t} className="px-4 py-2 rounded-full text-sm"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#C8C8B8" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* What's included */}
                <div className="rounded-2xl p-6" style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <h2 className="text-lg font-black text-white mb-4">What&apos;s Included</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "Professional licensed guide", "All meals & camp food",
                      "Horses/equipment where needed", "Trophy care & field dressing",
                      "Camp accommodations", "License & tag assistance",
                      "Game retrieval & packing", "24/7 camp support",
                    ].map(item => (
                      <div key={item} className="flex items-center gap-2.5 text-sm" style={{ color: "#9A9A8A" }}>
                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: "rgba(74,222,128,0.15)" }}>
                          <Check size={9} style={{ color: "#4ade80" }} />
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photo gallery placeholder */}
                <div className="rounded-2xl p-6" style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <Camera size={18} style={{ color: "#E8763A" }} /> Gallery
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="aspect-square rounded-xl flex items-center justify-center text-3xl"
                        style={{
                          background: `linear-gradient(135deg,
                            hsl(${(parseInt(outfitter.id) * 37 + i * 20) % 60 + 100}, 40%, ${10 + i * 2}%) 0%,
                            hsl(${(parseInt(outfitter.id) * 37 + i * 20) % 60 + 110}, 50%, ${16 + i * 2}%) 100%)`,
                        }}>
                        {["🦌","🏔️","🌲","🔭","🎯","🌅"][i]}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Rating summary */}
                <div className="rounded-2xl p-6" style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-start gap-8">
                    <div className="text-center shrink-0">
                      <p className="text-6xl font-black" style={{ color: "#E8763A" }}>{avgRating.toFixed(1)}</p>
                      <Stars rating={avgRating} size={18} />
                      <p className="text-xs mt-1" style={{ color: "#4A4A3A" }}>{outfitter.reviewCount} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {ratingDist.map(r => (
                        <div key={r.stars} className="flex items-center gap-2 text-xs">
                          <span className="w-3 text-right shrink-0" style={{ color: "#6A6A5A" }}>{r.stars}</span>
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="#E8763A">
                            <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.1L6 8l-2.78 1.56.53-3.1L1.5 4.27l3.11-.45z"/>
                          </svg>
                          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${r.pct}%`, background: "linear-gradient(90deg, #C45A1A, #E8763A)" }} />
                          </div>
                          <span className="w-8 text-right shrink-0" style={{ color: "#5A5A4A" }}>{r.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review list */}
                {reviews.length === 0 ? (
                  <div className="text-center py-12 rounded-2xl" style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-white font-semibold">No reviews yet</p>
                    <p className="text-sm mt-1" style={{ color: "#4A4A3A" }}>Be the first to review this outfitter</p>
                  </div>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="rounded-2xl p-5"
                      style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                            style={{ background: "linear-gradient(135deg, #C45A1A, #9A4010)" }}>
                            {review.initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-white text-sm">{review.author}</p>
                              {review.verified && (
                                <span className="flex items-center gap-1 text-xs"
                                  style={{ color: "#4ade80" }}>
                                  <Shield size={9} /> Verified
                                </span>
                              )}
                            </div>
                            <p className="text-xs" style={{ color: "#4A4A3A" }}>
                              {review.species} · {new Date(review.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <Stars rating={review.rating} />
                      </div>
                      <p className="text-sm font-semibold text-white mb-1.5">{review.title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: "#7A7A6A" }}>
                        {expandedReview === review.id || review.body.length < 200
                          ? review.body
                          : `${review.body.slice(0, 200)}...`}
                      </p>
                      {review.body.length >= 200 && (
                        <button onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                          className="text-xs mt-1.5 transition-colors hover:text-white"
                          style={{ color: "#E8763A" }}>
                          {expandedReview === review.id ? "Show less" : "Read more"}
                        </button>
                      )}
                      <div className="flex items-center gap-4 mt-3 pt-3"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <button className="flex items-center gap-1.5 text-xs transition-colors hover:text-white"
                          style={{ color: "#4A4A3A" }}>
                          <ThumbsUp size={12} /> Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "location" && (
              <div className="space-y-6">
                <div className="rounded-2xl overflow-hidden" style={{ height: "360px", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <DynamicMap outfitters={[outfitter]} />
                </div>
                <div className="rounded-2xl p-5" style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <h3 className="font-bold text-white mb-3">Getting There</h3>
                  <div className="space-y-2 text-sm" style={{ color: "#7A7A6A" }}>
                    <p>📍 Base camp: {outfitter.location}, {outfitter.province}</p>
                    <p>✈️ Nearest major airport: varies by location — outfitter provides logistics on booking</p>
                    <p>🚗 Ground transport from airport typically arranged through outfitter</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right column — sticky booking card */}
          <div className="space-y-4">
            <div className="sticky top-32">
              {/* Guide card */}
              <div className="rounded-2xl p-5 mb-4"
                style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white"
                    style={{ background: "linear-gradient(135deg, #C45A1A, #E8763A)" }}>
                    {outfitter.guidePhoto}
                  </div>
                  <div>
                    <p className="font-bold text-white">{outfitter.guide}</p>
                    <p className="text-sm" style={{ color: "#5A5A4A" }}>Lead Guide & Owner</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Shield size={10} style={{ color: "#4ade80" }} />
                      <span className="text-xs" style={{ color: "#4ade80" }}>Licensed & Verified</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  {[
                    { icon: <Clock size={13} />, text: `Available: ${outfitter.availability}` },
                    { icon: <Users size={13} />, text: `Up to ${outfitter.maxGuests} hunters` },
                    { icon: <Award size={13} />, text: "Licensed & Insured" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2" style={{ color: "#7A7A6A" }}>
                      <span style={{ color: "#E8763A" }}>{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl text-center mb-4"
                  style={{ background: "rgba(196,90,26,0.08)", border: "1px solid rgba(196,90,26,0.15)" }}>
                  <p className="text-3xl font-black" style={{ color: "#E8763A" }}>${outfitter.pricePerDay}</p>
                  <p className="text-xs" style={{ color: "#5A5A4A" }}>per hunter per day</p>
                </div>

                <button onClick={() => setShowBooking(true)}
                  className="btn-orange w-full py-3.5 rounded-xl text-sm font-semibold mb-2">
                  <span className="flex items-center justify-center gap-2">
                    <MessageSquare size={15} /> Request This Hunt
                  </span>
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#8A8A7A" }}>
                    <Phone size={13} /> Call
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#8A8A7A" }}>
                    <Mail size={13} /> Email
                  </button>
                </div>
              </div>

              {/* Related outfitters */}
              <div className="rounded-2xl p-4" style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-sm font-bold text-white mb-3">Similar Hunts</p>
                {OUTFITTERS.filter(o => o.id !== outfitter.id && o.species.some(s => outfitter.species.includes(s))).slice(0, 3).map(o => (
                  <Link key={o.id} href={`/outfitters/${o.id}`}
                    className="flex items-center gap-3 py-2.5 group">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: "rgba(196,90,26,0.2)" }}>
                      {o.guidePhoto}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-orange-400 transition-colors">{o.name}</p>
                      <p className="text-xs" style={{ color: "#4A4A3A" }}>${o.pricePerDay}/day · {o.rating}★</p>
                    </div>
                    <ChevronRight size={14} style={{ color: "#4A4A3A" }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBooking && <BookingModal outfitter={outfitter} onClose={() => setShowBooking(false)} />}
    </div>
  );
}
