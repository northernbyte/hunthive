"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check, ChevronRight, Shield, TrendingUp, Users,
  Camera, DollarSign, ArrowLeft, Sparkles
} from "lucide-react";

const STEPS = ["Your Info", "Hunt Details", "Species & Location", "Pricing", "Review"];

const BENEFITS = [
  { icon: <TrendingUp size={20} />, title: "Reach 12,000+ hunters", desc: "Active hunters searching for exactly what you offer" },
  { icon: <Shield size={20} />, title: "Verified badge", desc: "HuntHive verification builds trust with new clients" },
  { icon: <DollarSign size={20} />, title: "No upfront cost", desc: "Free to list — we only succeed when you succeed" },
  { icon: <Users size={20} />, title: "Booking management", desc: "Manage inquiries, messaging, and calendars in one place" },
];

export default function ListPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    businessName: "", yearsGuiding: "", licenseNumber: "",
    huntName: "", description: "", huntStyle: "",
    province: "", country: "USA",
    species: [] as string[],
    pricePerDay: "", maxGuests: "4", availability: "",
  });

  const update = (k: string, v: string | string[]) => setForm(f => ({ ...f, [k]: v }));
  const toggleSpecies = (s: string) => {
    setForm(f => ({
      ...f,
      species: f.species.includes(s) ? f.species.filter(x => x !== s) : [...f.species, s],
    }));
  };

  const SPECIES_LIST = [
    "Elk", "Whitetail Deer", "Mule Deer", "Moose", "Black Bear",
    "Brown Bear", "Grizzly Bear", "Caribou", "Bighorn Sheep",
    "Dall Sheep", "Mountain Goat", "Antelope", "Wild Hog",
    "Turkey", "Axis Deer", "Blackbuck", "Waterfowl",
  ];

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-white outline-none placeholder-gray-600";
  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" };
  const labelClass = "text-xs font-semibold block mb-1.5";
  const labelStyle = { color: "#8A8A7A" };

  return (
    <div className="min-h-screen" style={{ background: "#0A0F0A" }}>

      {/* Header */}
      <div className="pt-24 pb-12 px-4 sm:px-6 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0C1A0C 0%, #0A0F0A 100%)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="absolute inset-0 opacity-5"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(196,90,26,0.8) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-white"
            style={{ color: "#5A6A5A" }}>
            <ArrowLeft size={13} /> Back to HuntHive
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ background: "rgba(196,90,26,0.12)", border: "1px solid rgba(196,90,26,0.25)", color: "#E8763A" }}>
            <Sparkles size={13} /> Free for the first 5 bookings
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">List Your Hunts on HuntHive</h1>
          <p className="text-base" style={{ color: "#6A6A5A" }}>
            Join 2,400+ outfitters. Set up your profile in under 10 minutes.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left — benefits */}
          <div className="space-y-5">
            <h2 className="font-black text-white text-lg">Why list with HuntHive?</h2>
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(196,90,26,0.12)", color: "#E8763A" }}>
                  {b.icon}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{b.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#5A5A4A" }}>{b.desc}</p>
                </div>
              </div>
            ))}

            <div className="rounded-2xl p-5 mt-6" style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-sm font-bold text-white mb-3">What you get:</p>
              {[
                "Public outfitter profile page",
                "Photo gallery upload",
                "Review & rating system",
                "Direct messaging with hunters",
                "Availability calendar",
                "Price tracking tools",
                "Analytics dashboard",
              ].map(item => (
                <div key={item} className="flex items-center gap-2 py-1.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(74,222,128,0.15)" }}>
                    <Check size={9} style={{ color: "#4ade80" }} />
                  </div>
                  <span className="text-sm" style={{ color: "#9A9A8A" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-2">
            {/* Step indicator */}
            <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => i < step && setStep(i)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: step === i ? "rgba(196,90,26,0.15)" : step > i ? "rgba(74,222,128,0.08)" : "transparent",
                      color: step === i ? "#E8763A" : step > i ? "#4ade80" : "#4A4A3A",
                      border: step === i ? "1px solid rgba(196,90,26,0.25)" : "1px solid transparent",
                      cursor: i < step ? "pointer" : "default",
                    }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0"
                      style={{
                        background: step > i ? "rgba(74,222,128,0.2)" : step === i ? "rgba(196,90,26,0.3)" : "rgba(255,255,255,0.06)",
                        fontSize: "10px",
                      }}>
                      {step > i ? <Check size={10} /> : i + 1}
                    </span>
                    {s}
                  </button>
                  {i < STEPS.length - 1 && (
                    <ChevronRight size={12} style={{ color: "#2A2A2A" }} />
                  )}
                </div>
              ))}
            </div>

            {!submitted ? (
              <div className="rounded-2xl p-6" style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.07)" }}>

                {/* Step 0: Your Info */}
                {step === 0 && (
                  <div className="space-y-4">
                    <h3 className="font-black text-white text-xl mb-5">Tell us about yourself</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {([["firstName","First Name"],["lastName","Last Name"]] as [keyof typeof form, string][]).map(([k,l]) => (
                        <div key={k as string}>
                          <label className={labelClass} style={labelStyle}>{l}</label>
                          <input type="text" value={form[k] as string}
                            onChange={e => update(k as string, e.target.value)}
                            placeholder={l} className={inputClass} style={inputStyle} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Email</label>
                      <input type="email" value={form.email} onChange={e => update("email", e.target.value)}
                        placeholder="your@email.com" className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Phone</label>
                      <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)}
                        placeholder="+1 (555) 000-0000" className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Business / Outfitter Name</label>
                      <input type="text" value={form.businessName} onChange={e => update("businessName", e.target.value)}
                        placeholder="Rocky Mountain Trophy Hunts" className={inputClass} style={inputStyle} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass} style={labelStyle}>Years Guiding</label>
                        <input type="number" value={form.yearsGuiding} onChange={e => update("yearsGuiding", e.target.value)}
                          placeholder="e.g. 12" className={inputClass} style={inputStyle} />
                      </div>
                      <div>
                        <label className={labelClass} style={labelStyle}>Guide License #</label>
                        <input type="text" value={form.licenseNumber} onChange={e => update("licenseNumber", e.target.value)}
                          placeholder="State/province license #" className={inputClass} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Hunt Details */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="font-black text-white text-xl mb-5">Describe your hunt</h3>
                    <div>
                      <label className={labelClass} style={labelStyle}>Hunt Name</label>
                      <input type="text" value={form.huntName} onChange={e => update("huntName", e.target.value)}
                        placeholder="e.g. 7-Day Rocky Mountain Elk Archery Hunt" className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Description</label>
                      <textarea value={form.description} onChange={e => update("description", e.target.value)}
                        placeholder="Describe the terrain, camp style, success rates, what makes your hunt unique..."
                        rows={5} className={`${inputClass} resize-none`} style={inputStyle} />
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Hunt Style</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {["Spot & Stalk","Rifle","Archery","Horseback","Pack-in","Tree Stand","Float Plane","High Fence","Free Range","Night Hunt"].map(style => (
                          <button key={style}
                            onClick={() => update("huntStyle", style)}
                            className="py-2 px-3 rounded-xl text-xs font-medium transition-all text-left"
                            style={{
                              background: form.huntStyle === style ? "rgba(196,90,26,0.15)" : "rgba(255,255,255,0.04)",
                              border: `1px solid ${form.huntStyle === style ? "rgba(196,90,26,0.4)" : "rgba(255,255,255,0.07)"}`,
                              color: form.huntStyle === style ? "#E8763A" : "#6A6A5A",
                            }}>
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Species & Location */}
                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-black text-white text-xl mb-5">Species & Location</h3>
                    <div>
                      <label className={labelClass} style={labelStyle}>Target Species (select all that apply)</label>
                      <div className="flex flex-wrap gap-2">
                        {SPECIES_LIST.map(s => (
                          <button key={s}
                            onClick={() => toggleSpecies(s)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                            style={{
                              background: form.species.includes(s) ? "rgba(196,90,26,0.15)" : "rgba(255,255,255,0.04)",
                              border: `1px solid ${form.species.includes(s) ? "rgba(196,90,26,0.4)" : "rgba(255,255,255,0.07)"}`,
                              color: form.species.includes(s) ? "#E8763A" : "#6A6A5A",
                            }}>
                            {form.species.includes(s) && <span className="mr-1">✓</span>}{s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass} style={labelStyle}>Country</label>
                        <select value={form.country} onChange={e => update("country", e.target.value)}
                          className={`${inputClass} appearance-none`} style={inputStyle}>
                          <option value="USA" style={{ background: "#111811" }}>United States</option>
                          <option value="Canada" style={{ background: "#111811" }}>Canada</option>
                          <option value="Mexico" style={{ background: "#111811" }}>Mexico</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass} style={labelStyle}>State / Province</label>
                        <input type="text" value={form.province} onChange={e => update("province", e.target.value)}
                          placeholder="e.g. Montana" className={inputClass} style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Availability Season</label>
                      <input type="text" value={form.availability} onChange={e => update("availability", e.target.value)}
                        placeholder="e.g. September–November" className={inputClass} style={inputStyle} />
                    </div>
                  </div>
                )}

                {/* Step 3: Pricing */}
                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="font-black text-white text-xl mb-5">Pricing & Capacity</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass} style={labelStyle}>Price per Hunter per Day ($)</label>
                        <input type="number" value={form.pricePerDay} onChange={e => update("pricePerDay", e.target.value)}
                          placeholder="e.g. 650" className={inputClass} style={inputStyle} />
                      </div>
                      <div>
                        <label className={labelClass} style={labelStyle}>Max Guests per Hunt</label>
                        <select value={form.maxGuests} onChange={e => update("maxGuests", e.target.value)}
                          className={`${inputClass} appearance-none`} style={inputStyle}>
                          {[1,2,3,4,5,6,8,10,12].map(n => (
                            <option key={n} value={n} style={{ background: "#111811" }}>{n} hunters</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {form.pricePerDay && (
                      <div className="rounded-xl p-4" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.12)" }}>
                        <p className="text-sm font-semibold" style={{ color: "#4ade80" }}>Estimated revenue per hunt</p>
                        <p className="text-2xl font-black text-white mt-1">
                          ${(parseInt(form.pricePerDay) * parseInt(form.maxGuests) * 5).toLocaleString()}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "#4A6A4A" }}>
                          Based on {form.maxGuests} hunters × 5 days @ ${form.pricePerDay}/day
                        </p>
                      </div>
                    )}
                    <div className="rounded-xl p-4" style={{ background: "rgba(196,90,26,0.07)", border: "1px solid rgba(196,90,26,0.15)" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Camera size={14} style={{ color: "#E8763A" }} />
                        <p className="text-sm font-semibold text-white">Photo Gallery</p>
                      </div>
                      <p className="text-xs mb-3" style={{ color: "#6A6A5A" }}>
                        Profiles with 6+ photos get 3x more inquiries. You can add photos after setup.
                      </p>
                      <button className="text-xs px-4 py-2 rounded-lg font-medium"
                        style={{ background: "rgba(196,90,26,0.12)", border: "1px solid rgba(196,90,26,0.2)", color: "#E8763A" }}>
                        + Upload Photos (after signup)
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {step === 4 && (
                  <div className="space-y-4">
                    <h3 className="font-black text-white text-xl mb-5">Review & Submit</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Name", value: `${form.firstName} ${form.lastName}` },
                        { label: "Business", value: form.businessName },
                        { label: "Email", value: form.email },
                        { label: "Hunt Name", value: form.huntName },
                        { label: "Location", value: `${form.province}, ${form.country}` },
                        { label: "Species", value: form.species.join(", ") || "Not set" },
                        { label: "Price / Day", value: form.pricePerDay ? `$${form.pricePerDay}` : "Not set" },
                        { label: "Availability", value: form.availability || "Not set" },
                      ].map(row => (
                        <div key={row.label} className="flex items-start justify-between gap-4 py-2 px-4 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <span className="text-xs shrink-0" style={{ color: "#5A5A4A" }}>{row.label}</span>
                          <span className="text-sm font-medium text-white text-right">{row.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl p-3 flex items-start gap-2.5"
                      style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.12)" }}>
                      <Check size={14} style={{ color: "#4ade80", flexShrink: 0, marginTop: 1 }} />
                      <p className="text-xs" style={{ color: "#5A8A5A" }}>
                        Your profile will go live after a quick 24-hour review by the HuntHive team. We&apos;ll email you as soon as it&apos;s approved.
                      </p>
                    </div>
                  </div>
                )}

                {/* Nav buttons */}
                <div className="flex gap-3 mt-6">
                  {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)}
                      className="flex-1 py-3.5 rounded-xl text-sm font-semibold"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#8A8A7A" }}>
                      ← Back
                    </button>
                  )}
                  {step < STEPS.length - 1 ? (
                    <button onClick={() => setStep(s => s + 1)}
                      className="btn-orange flex-1 py-3.5 rounded-xl text-sm font-semibold">
                      <span>Continue →</span>
                    </button>
                  ) : (
                    <button onClick={() => setSubmitted(true)}
                      className="btn-orange flex-1 py-3.5 rounded-xl text-sm font-semibold">
                      <span>Submit for Review ✓</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl p-10 text-center" style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(74,222,128,0.15)", border: "2px solid rgba(74,222,128,0.3)" }}>
                  <Check size={36} style={{ color: "#4ade80" }} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Application Submitted!</h3>
                <p className="mb-6" style={{ color: "#6A6A5A" }}>
                  We&apos;ll review your profile within 24 hours and email you at <span style={{ color: "#E8763A" }}>{form.email}</span> once you&apos;re approved.
                </p>
                <Link href="/" className="btn-orange inline-block px-8 py-3.5 rounded-xl text-sm">
                  <span>Back to HuntHive</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
