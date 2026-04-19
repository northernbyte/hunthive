"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Check, ArrowRight, Target, ExternalLink, Sparkles } from "lucide-react";
import { GEAR_ITEMS, type GearItem } from "@/lib/gear";

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuizAnswers {
  experience: string;
  huntingStyles: string[];
  species: string[];
  budget: number;
  location: string;
  frequency: string;
}

// ── Step config ───────────────────────────────────────────────────────────────

const STEPS = [
  "Experience",
  "Hunt Style",
  "Species",
  "Budget",
  "Location",
  "Frequency",
];

// ── Recommendation logic ──────────────────────────────────────────────────────

function getRecommendations(answers: QuizAnswers): GearItem[] {
  const scored = GEAR_ITEMS.map((item) => {
    let score = 0;

    // Budget fit
    if (item.lowestPrice <= answers.budget) score += 3;
    else if (item.lowestPrice <= answers.budget * 1.2) score += 1;

    // Experience level alignment
    const premiumBrands = ["Leupold", "Sitka", "Kenetrek", "Mathews", "Mystery Ranch"];
    const isPremium = premiumBrands.includes(item.brand);
    if (answers.experience === "beginner" && !isPremium) score += 2;
    if (answers.experience === "novice" && !isPremium) score += 1;
    if (answers.experience === "advanced" && isPremium) score += 2;
    if (answers.experience === "intermediate") score += 1;

    // Hunting style fit
    if (answers.huntingStyles.includes("Big Game") &&
      ["Rifles", "Optics", "Packs", "Boots", "Clothing"].includes(item.category)) score += 2;
    if (answers.huntingStyles.includes("Bow Hunting") && item.category === "Bows") score += 3;
    if (answers.huntingStyles.includes("Waterfowl") && item.category === "Clothing") score += 1;
    if (answers.huntingStyles.includes("Backcountry") &&
      ["Packs", "Boots", "Clothing"].includes(item.category)) score += 2;

    // Species fit
    if (answers.species.includes("Elk") &&
      ["Rifles", "Optics", "Packs", "Boots"].includes(item.category)) score += 2;
    if (answers.species.includes("Whitetail Deer") &&
      ["Bows", "Treestands", "Rifles"].includes(item.category)) score += 2;
    if (answers.species.includes("Bear") && item.category === "Rifles") score += 1;

    // Expert picks bonus
    if (item.expertPick) score += 1;

    // Frequency — frequent hunters get durability/premium
    if (answers.frequency === "dedicated" && isPremium) score += 2;
    if (answers.frequency === "casual" && !isPremium) score += 1;

    return { item, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((s) => s.item);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RadioOption({
  label, desc, selected, onClick,
}: { label: string; desc: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 sm:p-5 rounded-2xl text-left transition-all duration-150"
      style={{
        background: selected ? "rgba(196,90,26,0.12)" : "rgba(255,255,255,0.04)",
        border: `1.5px solid ${selected ? "#E8763A" : "rgba(255,255,255,0.1)"}`,
      }}
    >
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all"
        style={{
          border: `2px solid ${selected ? "#E8763A" : "rgba(255,255,255,0.2)"}`,
          background: selected ? "#E8763A" : "transparent",
        }}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-white text-sm sm:text-base">{label}</p>
        {desc && <p className="text-xs sm:text-sm mt-0.5" style={{ color: "#6A8A6A" }}>{desc}</p>}
      </div>
    </button>
  );
}

function CheckboxOption({
  label, desc, selected, onClick,
}: { label: string; desc: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 sm:p-5 rounded-2xl text-left transition-all duration-150"
      style={{
        background: selected ? "rgba(196,90,26,0.12)" : "rgba(255,255,255,0.04)",
        border: `1.5px solid ${selected ? "#E8763A" : "rgba(255,255,255,0.1)"}`,
      }}
    >
      <div
        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all"
        style={{
          border: `2px solid ${selected ? "#E8763A" : "rgba(255,255,255,0.2)"}`,
          background: selected ? "#E8763A" : "transparent",
        }}
      >
        {selected && <Check size={13} color="white" strokeWidth={3} />}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-white text-sm sm:text-base">{label}</p>
        {desc && <p className="text-xs sm:text-sm mt-0.5" style={{ color: "#6A8A6A" }}>{desc}</p>}
      </div>
    </button>
  );
}

function GearResultCard({ item, rank }: { item: GearItem; rank: number }) {
  const savings = item.msrp - item.lowestPrice;
  const savingsPct = Math.round((savings / item.msrp) * 100);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
      style={{
        background: "#111811",
        border: rank === 0 ? "1.5px solid rgba(196,90,26,0.4)" : "1px solid rgba(255,255,255,0.07)",
        boxShadow: rank === 0 ? "0 8px 30px rgba(196,90,26,0.12)" : "none",
      }}
    >
      {rank === 0 && (
        <div className="px-4 py-2 flex items-center gap-1.5"
          style={{ background: "linear-gradient(135deg, #C45A1A, #E8763A)" }}>
          <Sparkles size={12} color="white" />
          <span className="text-white text-xs font-bold">Top Recommendation</span>
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: "rgba(196,90,26,0.08)", border: "1px solid rgba(196,90,26,0.12)" }}>
            {item.image}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs mb-0.5" style={{ color: "#5A5A4A" }}>{item.brand} · {item.category}</p>
            <h3 className="font-bold text-white text-sm leading-tight">{item.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              {[1,2,3,4,5].map(n => (
                <svg key={n} width="10" height="10" viewBox="0 0 12 12"
                  fill={n <= Math.round(item.rating) ? "#E8763A" : "#2A2A2A"}>
                  <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.1L6 8l-2.78 1.56.53-3.1L1.5 4.27l3.11-.45z" />
                </svg>
              ))}
              <span className="text-xs" style={{ color: "#E8763A" }}>{item.rating}</span>
              <span className="text-xs" style={{ color: "#3A3A3A" }}>({item.reviewCount})</span>
            </div>
          </div>
          {item.expertPick && (
            <span className="text-xs px-2 py-0.5 rounded-full shrink-0"
              style={{ background: "rgba(196,90,26,0.12)", color: "#E8763A", border: "1px solid rgba(196,90,26,0.2)" }}>
              Expert Pick
            </span>
          )}
        </div>

        <p className="text-xs mt-3 leading-relaxed line-clamp-2" style={{ color: "#5A5A4A" }}>
          {item.description}
        </p>

        <div className="flex items-center justify-between mt-4 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <span className="text-xl font-black" style={{ color: "#4ade80" }}>${item.lowestPrice}</span>
            <span className="text-xs ml-2 line-through" style={{ color: "#3A3A2A" }}>${item.msrp}</span>
            {savingsPct > 0 && (
              <span className="text-xs ml-1.5 px-1.5 py-0.5 rounded-md"
                style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.15)" }}>
                Save {savingsPct}%
              </span>
            )}
          </div>
          <Link href="/gear"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(196,90,26,0.12)", color: "#E8763A", border: "1px solid rgba(196,90,26,0.2)" }}>
            Compare Prices <ExternalLink size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main quiz page ────────────────────────────────────────────────────────────

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>({
    experience: "",
    huntingStyles: [],
    species: [],
    budget: 1500,
    location: "",
    frequency: "",
  });

  const totalSteps = STEPS.length;
  const progress = ((step) / totalSteps) * 100;

  const goNext = () => {
    if (step === totalSteps - 1) { setDone(true); return; }
    setAnimating(true);
    setTimeout(() => { setStep(s => s + 1); setAnimating(false); }, 150);
  };
  const goPrev = () => {
    if (step === 0) return;
    setAnimating(true);
    setTimeout(() => { setStep(s => s - 1); setAnimating(false); }, 150);
  };

  const toggle = (key: "huntingStyles" | "species", val: string) => {
    setAnswers(a => ({
      ...a,
      [key]: a[key].includes(val) ? a[key].filter(x => x !== val) : [...a[key], val],
    }));
  };

  // Can advance?
  const canAdvance = (() => {
    if (step === 0) return !!answers.experience;
    if (step === 1) return answers.huntingStyles.length > 0;
    if (step === 2) return answers.species.length > 0;
    if (step === 3) return true;
    if (step === 4) return !!answers.location;
    if (step === 5) return !!answers.frequency;
    return true;
  })();

  const recommendations = done ? getRecommendations(answers) : [];

  // ── Results page ────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen" style={{ background: "#0A0F0A" }}>
        {/* Header */}
        <div className="pt-24 pb-8 px-4 sm:px-6 text-center"
          style={{ background: "linear-gradient(180deg, #0C1A0C 0%, #0A0F0A 100%)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #C45A1A, #E8763A)" }}>
            <Target size={28} color="white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Your Personalized Gear List</h1>
          <p style={{ color: "#5A6A5A" }} className="text-sm sm:text-base max-w-xl mx-auto">
            Based on your{" "}
            <span style={{ color: "#E8763A" }}>{answers.experience}</span> experience,{" "}
            <span style={{ color: "#E8763A" }}>${answers.budget.toLocaleString()}</span> budget, and{" "}
            <span style={{ color: "#E8763A" }}>{answers.huntingStyles[0]}</span>{" "}focus — here&apos;s what we recommend.
          </p>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-4">
          {/* Profile summary */}
          <div className="rounded-2xl p-4 flex flex-wrap gap-2 mb-2"
            style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { label: "Experience", value: answers.experience },
              { label: "Budget", value: `$${answers.budget.toLocaleString()}` },
              { label: "Frequency", value: answers.frequency },
              { label: "Location", value: answers.location || "Not set" },
            ].map(item => (
              <div key={item.label} className="px-3 py-1.5 rounded-lg"
                style={{ background: "rgba(196,90,26,0.08)", border: "1px solid rgba(196,90,26,0.15)" }}>
                <span className="text-xs" style={{ color: "#6A6A5A" }}>{item.label}: </span>
                <span className="text-xs font-semibold capitalize" style={{ color: "#E8763A" }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Gear cards */}
          {recommendations.map((item, i) => (
            <GearResultCard key={item.id} item={item} rank={i} />
          ))}

          {/* CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link href="/gear"
              className="btn-orange py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2">
              <span className="flex items-center gap-2">
                Browse Full Gear Hub <ArrowRight size={15} />
              </span>
            </Link>
            <Link href="/map"
              className="py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              style={{ background: "#111811", border: "1px solid rgba(255,255,255,0.08)", color: "#C8C8B8" }}>
              Find Outfitters <ArrowRight size={15} />
            </Link>
          </div>

          <div className="text-center pt-2">
            <button onClick={() => { setDone(false); setStep(0); setAnswers({ experience: "", huntingStyles: [], species: [], budget: 1500, location: "", frequency: "" }); }}
              className="text-sm transition-colors hover:text-white" style={{ color: "#4A4A3A" }}>
              ← Retake quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz layout ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0A0F0A" }}>

      {/* Top bar */}
      <div className="sticky top-0 z-40 pt-16"
        style={{ background: "rgba(12,26,12,0.97)", borderBottom: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-0.5" style={{ color: "#4A6A4A" }}>
              Getting to Know You
            </p>
            <h2 className="font-black text-white text-lg leading-tight">{STEPS[step]}</h2>
          </div>
          <span className="text-sm font-bold tabular-nums" style={{ color: "#4A6A4A" }}>
            {step + 1} <span style={{ color: "#2A3A2A" }}>of</span> {totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${progress + (100 / totalSteps)}%`,
              background: "linear-gradient(90deg, #C45A1A, #E8763A)",
            }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-4 sm:px-6 py-8">
        <div
          className="flex-1 rounded-3xl p-6 sm:p-8 mb-6 transition-opacity duration-150"
          style={{
            background: "linear-gradient(160deg, #0F1F0F 0%, #111811 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            opacity: animating ? 0 : 1,
          }}
        >

          {/* ── Step 0: Experience ── */}
          {step === 0 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                What&apos;s your hunting experience level?
              </h2>
              <p className="text-sm mb-6" style={{ color: "#5A8A5A" }}>
                This helps us recommend appropriate gear complexity and price points.
              </p>
              <div className="space-y-3">
                {[
                  { value: "beginner", label: "Complete Beginner", desc: "Never been hunting, need to learn everything from scratch" },
                  { value: "novice", label: "Novice", desc: "Been hunting a few times, have basic knowledge" },
                  { value: "intermediate", label: "Intermediate", desc: "Hunt regularly, comfortable with most gear and techniques" },
                  { value: "advanced", label: "Advanced", desc: "Very experienced, looking for specialized or premium gear" },
                ].map(opt => (
                  <RadioOption key={opt.value}
                    label={opt.label} desc={opt.desc}
                    selected={answers.experience === opt.value}
                    onClick={() => setAnswers(a => ({ ...a, experience: opt.value }))}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 1: Hunting Styles ── */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                What styles of hunting do you do?
              </h2>
              <p className="text-sm mb-6" style={{ color: "#5A8A5A" }}>
                Select all that apply. We&apos;ll tailor recommendations to your preferred hunting styles.
              </p>
              <div className="space-y-3">
                {[
                  { value: "Big Game", label: "Big Game Hunting", desc: "Deer, elk, moose, bear" },
                  { value: "Waterfowl", label: "Waterfowl Hunting", desc: "Ducks, geese, and other water birds" },
                  { value: "Upland Game", label: "Upland Game", desc: "Pheasant, quail, grouse, turkey" },
                  { value: "Bow Hunting", label: "Bow Hunting", desc: "Traditional and compound bow hunting" },
                  { value: "Predator", label: "Predator Hunting", desc: "Coyotes, wolves, and other predators" },
                  { value: "Small Game", label: "Small Game", desc: "Rabbits, squirrels, and similar" },
                  { value: "Backcountry", label: "Backcountry / Pack-In", desc: "Remote wilderness, multi-day pack hunts" },
                ].map(opt => (
                  <CheckboxOption key={opt.value}
                    label={opt.label} desc={opt.desc}
                    selected={answers.huntingStyles.includes(opt.value)}
                    onClick={() => toggle("huntingStyles", opt.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Species ── */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                What species do you target?
              </h2>
              <p className="text-sm mb-6" style={{ color: "#5A8A5A" }}>
                Select all that apply — we&apos;ll match gear to your primary quarry.
              </p>
              <div className="space-y-3">
                {[
                  { value: "Elk", label: "Elk", desc: "Rocky Mountain and Roosevelt elk" },
                  { value: "Whitetail Deer", label: "Whitetail Deer", desc: "The most popular big game in North America" },
                  { value: "Mule Deer", label: "Mule Deer", desc: "Western open country hunting" },
                  { value: "Moose", label: "Moose", desc: "Canada, Alaska, and northern US" },
                  { value: "Bear", label: "Black / Grizzly Bear", desc: "Spring or fall bear hunts" },
                  { value: "Turkey", label: "Wild Turkey", desc: "Spring and fall turkey hunting" },
                  { value: "Waterfowl", label: "Ducks & Geese", desc: "Wetland and field waterfowl" },
                  { value: "Wild Hog", label: "Wild Hog", desc: "Year-round hog hunting across the South" },
                ].map(opt => (
                  <CheckboxOption key={opt.value}
                    label={opt.label} desc={opt.desc}
                    selected={answers.species.includes(opt.value)}
                    onClick={() => toggle("species", opt.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Budget ── */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                What&apos;s your gear budget?
              </h2>
              <p className="text-sm mb-8" style={{ color: "#5A8A5A" }}>
                This helps us show you options within your price range. You can always adjust later.
              </p>

              {/* Big budget display */}
              <div className="text-center mb-8">
                <p className="text-5xl font-black mb-1" style={{ color: "#E8763A" }}>
                  {answers.budget >= 10000 ? "$10,000+" : `$${answers.budget.toLocaleString()}`}
                </p>
                <p className="text-sm" style={{ color: "#4A6A4A" }}>Total gear budget</p>
              </div>

              {/* Slider */}
              <div className="mb-6">
                <input
                  type="range"
                  min={200}
                  max={10000}
                  step={100}
                  value={answers.budget}
                  onChange={(e) => setAnswers(a => ({ ...a, budget: parseInt(e.target.value) }))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #E8763A ${((answers.budget - 200) / 9800) * 100}%, rgba(255,255,255,0.08) ${((answers.budget - 200) / 9800) * 100}%)`,
                    accentColor: "#E8763A",
                  }}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs" style={{ color: "#4A4A3A" }}>$200</span>
                  <span className="text-xs" style={{ color: "#4A4A3A" }}>$10,000+</span>
                </div>
              </div>

              {/* Preset buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[500, 1500, 3000, 5000].map(preset => (
                  <button key={preset}
                    onClick={() => setAnswers(a => ({ ...a, budget: preset }))}
                    className="py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: answers.budget === preset ? "rgba(196,90,26,0.18)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${answers.budget === preset ? "rgba(196,90,26,0.5)" : "rgba(255,255,255,0.08)"}`,
                      color: answers.budget === preset ? "#E8763A" : "#5A5A4A",
                    }}>
                    ${preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>

              {/* Context hint */}
              <div className="mt-6 rounded-2xl p-4"
                style={{ background: "rgba(196,90,26,0.06)", border: "1px solid rgba(196,90,26,0.12)" }}>
                <p className="text-xs" style={{ color: "#7A6A5A" }}>
                  {answers.budget < 600
                    ? "💡 Great starter budget — we'll focus on the best value gear for new hunters."
                    : answers.budget < 2000
                    ? "💡 Solid budget — you can get quality mid-range gear across all the essentials."
                    : answers.budget < 5000
                    ? "💡 Strong budget — premium brands like Sitka, Leupold, and Kenetrek are in range."
                    : "💡 Premium budget — the best gear on the market is available to you."}
                </p>
              </div>
            </div>
          )}

          {/* ── Step 4: Location ── */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Where do you primarily hunt?
              </h2>
              <p className="text-sm mb-6" style={{ color: "#5A8A5A" }}>
                Location affects gear recommendations for terrain, weather, and regulations.
              </p>

              <div className="space-y-3">
                {[
                  { value: "Rocky Mountains", label: "Rocky Mountains", desc: "Colorado, Montana, Wyoming, Idaho — steep terrain, cold weather" },
                  { value: "Pacific Northwest", label: "Pacific Northwest", desc: "Oregon, Washington, BC — wet, dense timber" },
                  { value: "Great Plains", label: "Great Plains", desc: "Kansas, Nebraska, Dakotas — open country, whitetail, antelope" },
                  { value: "Eastern Woodlands", label: "Eastern Woodlands", desc: "Midwest and East — hardwood forests, whitetail country" },
                  { value: "Deep South", label: "Deep South", desc: "Texas, Louisiana, Mississippi — hot climate, hogs, whitetail" },
                  { value: "Alaska / Northern Canada", label: "Alaska / Northern Canada", desc: "Extreme cold, remote terrain, mega fauna" },
                  { value: "Canadian Prairies", label: "Canadian Prairies", desc: "Saskatchewan, Alberta, Manitoba — giant whitetail, mule deer" },
                  { value: "Multiple Regions", label: "Multiple Regions", desc: "I hunt in several different areas" },
                ].map(opt => (
                  <RadioOption key={opt.value}
                    label={opt.label} desc={opt.desc}
                    selected={answers.location === opt.value}
                    onClick={() => setAnswers(a => ({ ...a, location: opt.value }))}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 5: Frequency ── */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                How often do you plan to hunt?
              </h2>
              <p className="text-sm mb-6" style={{ color: "#5A8A5A" }}>
                This helps us recommend gear durability and investment level.
              </p>
              <div className="space-y-3">
                {[
                  { value: "casual", label: "Casual (1–5 days/year)", desc: "Occasional hunting, budget-friendly gear focus" },
                  { value: "regular", label: "Regular (6–15 days/year)", desc: "Moderate hunting, balance of quality and value" },
                  { value: "serious", label: "Serious (16–30 days/year)", desc: "Frequent hunting, prioritize quality and durability" },
                  { value: "dedicated", label: "Dedicated (30+ days/year)", desc: "Hunting lifestyle, premium gear investment" },
                ].map(opt => (
                  <RadioOption key={opt.value}
                    label={opt.label} desc={opt.desc}
                    selected={answers.frequency === opt.value}
                    onClick={() => setAnswers(a => ({ ...a, frequency: opt.value }))}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={goPrev}
            disabled={step === 0}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold transition-all disabled:opacity-25"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#9A9A8A",
            }}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <button
            onClick={goNext}
            disabled={!canAdvance}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all disabled:opacity-30"
            style={{
              background: canAdvance ? "linear-gradient(135deg, #C45A1A, #E8763A)" : "rgba(255,255,255,0.06)",
              color: canAdvance ? "white" : "#4A4A3A",
              border: "none",
            }}
          >
            {step === totalSteps - 1 ? "See My Gear" : "Next"} <ChevronRight size={16} />
          </button>
        </div>

        {/* Skip */}
        {!canAdvance && step !== 3 && (
          <p className="text-center text-xs mt-4" style={{ color: "#3A3A2A" }}>
            Make a selection above to continue
          </p>
        )}
      </div>

      {/* Subtle style override for range input */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #E8763A;
          cursor: pointer;
          border: 3px solid #0A0F0A;
          box-shadow: 0 0 0 2px #E8763A;
        }
        input[type=range]::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #E8763A;
          cursor: pointer;
          border: 3px solid #0A0F0A;
        }
      `}</style>
    </div>
  );
}
