export type GearCategory =
  | "Rifles"
  | "Optics"
  | "Bows"
  | "Clothing"
  | "Boots"
  | "Packs"
  | "Knives"
  | "Treestands"
  | "Calls"
  | "Trail Cameras";

export interface PricePoint {
  date: string; // YYYY-MM-DD
  price: number;
}

export interface RetailerPrice {
  name: string;
  price: number;
  url: string; // Replace with your affiliate link when available
  inStock: boolean;
  logo: string;
}

export interface GearItem {
  id: string;
  name: string;
  brand: string;
  category: GearCategory;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  tags: string[];
  msrp: number;
  lowestPrice: number;
  priceHistory: PricePoint[];
  retailers: RetailerPrice[];
  specs: Record<string, string>;
  pros: string[];
  cons: string[];
  expertPick: boolean;
  bestFor: string;
}

export const GEAR_ITEMS: GearItem[] = [
  {
    id: "1",
    name: "Browning X-Bolt Speed",
    brand: "Browning",
    category: "Rifles",
    image: "🔫",
    rating: 4.8,
    reviewCount: 412,
    description: "One of the most accurate factory rifles on the market. Threaded barrel, fluted bolt, and a crisp trigger make this the go-to elk and deer rifle.",
    tags: ["Bolt Action", "Threaded", "Elk", "Deer"],
    msrp: 1299,
    lowestPrice: 1049,
    priceHistory: [
      { date: "2025-10-01", price: 1199 },
      { date: "2025-11-01", price: 1149 },
      { date: "2025-12-01", price: 1099 },
      { date: "2026-01-01", price: 1049 },
      { date: "2026-02-01", price: 1099 },
      { date: "2026-03-01", price: 1079 },
      { date: "2026-04-01", price: 1049 },
    ],
    retailers: [
      { name: "Bass Pro Shops", price: 1049, url: "https://www.basspro.com/shop/SearchDisplay?searchTerm=browning+x-bolt+speed", inStock: true, logo: "BPS" },
      { name: "Cabela's", price: 1079, url: "https://www.cabelas.com/shop/SearchDisplay?searchTerm=browning+x-bolt+speed", inStock: true, logo: "CAB" },
      { name: "MidwayUSA", price: 1099, url: "https://www.midwayusa.com/find?userSearchTerm=browning+x-bolt+speed", inStock: true, logo: "MID" },
      { name: "Sportsman's Whs.", price: 1129, url: "https://www.sportsmanswarehouse.com/search?q=browning+x-bolt+speed", inStock: false, logo: "SWH" },
      { name: "GunBroker", price: 1199, url: "https://www.gunbroker.com/All/search?Keywords=browning+x-bolt+speed", inStock: true, logo: "GB" },
    ],
    specs: {
      Caliber: "6.5 Creedmoor / .308 Win / .300 Win Mag",
      "Barrel Length": '24"',
      Weight: "6 lbs 5 oz",
      Action: "Bolt",
      Stock: "Composite",
      "Magazine Capacity": "4+1",
    },
    pros: ["Sub-MOA accuracy guarantee", "Excellent trigger", "Lightweight composite stock", "Threaded barrel ready for suppressor"],
    cons: ["Stock feels plasticky", "Limited caliber availability in some models"],
    expertPick: true,
    bestFor: "Elk, Mule Deer, Long-Range",
  },
  {
    id: "2",
    name: "Leupold VX-5HD 3-15x44",
    brand: "Leupold",
    category: "Optics",
    image: "🔭",
    rating: 4.9,
    reviewCount: 688,
    description: "The gold standard in hunting scopes. Exceptional glass clarity, twilight performance that extends your shooting window, and rugged build quality built to last a lifetime.",
    tags: ["Scope", "3-15x", "Long Range", "Low Light"],
    msrp: 1299,
    lowestPrice: 979,
    priceHistory: [
      { date: "2025-10-01", price: 1149 },
      { date: "2025-11-01", price: 1099 },
      { date: "2025-12-01", price: 1049 },
      { date: "2026-01-01", price: 979 },
      { date: "2026-02-01", price: 999 },
      { date: "2026-03-01", price: 989 },
      { date: "2026-04-01", price: 979 },
    ],
    retailers: [
      { name: "Cabela's", price: 979, url: "https://www.cabelas.com/shop/SearchDisplay?searchTerm=leupold+vx-5hd+3-15x44", inStock: true, logo: "CAB" },
      { name: "OpticsPlanet", price: 999, url: "https://www.opticsplanet.com/search?q=leupold+vx-5hd+3-15x44", inStock: true, logo: "OPP" },
      { name: "Bass Pro Shops", price: 1049, url: "https://www.basspro.com/shop/SearchDisplay?searchTerm=leupold+vx-5hd", inStock: true, logo: "BPS" },
      { name: "MidwayUSA", price: 1079, url: "https://www.midwayusa.com/find?userSearchTerm=leupold+vx-5hd+3-15x44", inStock: true, logo: "MID" },
      { name: "EuroOptic", price: 1099, url: "https://www.eurooptic.com/Search.aspx?term=leupold+vx-5hd+3-15x44", inStock: false, logo: "EUR" },
    ],
    specs: {
      Magnification: "3-15x",
      "Objective Lens": "44mm",
      "Tube Diameter": '30mm',
      Reticle: "FireDot Duplex / CDS-ZL2",
      "Eye Relief": '3.7"',
      Weight: "17.5 oz",
    },
    pros: ["Best-in-class glass clarity", "Excellent low-light performance", "Lifetime guarantee", "Made in USA"],
    cons: ["Premium price point", "Turrets not as tactile as Vortex"],
    expertPick: true,
    bestFor: "All-Round, Long Range, Low Light",
  },
  {
    id: "3",
    name: "Sitka Kelvin Aerolite Jacket",
    brand: "Sitka",
    category: "Clothing",
    image: "🧥",
    rating: 4.7,
    reviewCount: 334,
    description: "The warmest jacket for its weight on the market. 850-fill goose down with a windproof shell. A must-have for cold-weather backcountry hunts.",
    tags: ["Down", "Lightweight", "Cold Weather", "Packable"],
    msrp: 549,
    lowestPrice: 439,
    priceHistory: [
      { date: "2025-10-01", price: 549 },
      { date: "2025-11-01", price: 499 },
      { date: "2025-12-01", price: 469 },
      { date: "2026-01-01", price: 439 },
      { date: "2026-02-01", price: 459 },
      { date: "2026-03-01", price: 449 },
      { date: "2026-04-01", price: 439 },
    ],
    retailers: [
      { name: "Sitka Gear", price: 439, url: "https://www.sitkagear.com/search?q=kelvin+aerolite+jacket", inStock: true, logo: "STK" },
      { name: "Cabela's", price: 469, url: "https://www.cabelas.com/shop/SearchDisplay?searchTerm=sitka+kelvin+aerolite+jacket", inStock: true, logo: "CAB" },
      { name: "Bass Pro Shops", price: 479, url: "https://www.basspro.com/shop/SearchDisplay?searchTerm=sitka+kelvin+aerolite", inStock: false, logo: "BPS" },
      { name: "MidwayUSA", price: 499, url: "https://www.midwayusa.com/find?userSearchTerm=sitka+kelvin+aerolite+jacket", inStock: true, logo: "MID" },
    ],
    specs: {
      Insulation: "850-fill goose down",
      Weight: "9.6 oz",
      Shell: "Pertex Quantum",
      "Wind Resistance": "Yes",
      Packable: "Yes — stuff sack included",
      Camo: "Optifade Open Country",
    },
    pros: ["Incredible warmth-to-weight", "Packs down tiny", "Windproof outer", "Best hunting camo pattern"],
    cons: ["Not waterproof (wet conditions need a shell over it)", "Expensive"],
    expertPick: false,
    bestFor: "Backcountry, Cold Weather, Elk",
  },
  {
    id: "4",
    name: "Kenetrek Mountain Extreme 400",
    brand: "Kenetrek",
    category: "Boots",
    image: "🥾",
    rating: 4.9,
    reviewCount: 892,
    description: "The benchmark mountain hunting boot. Stiff shank for steep terrain, 400g insulation for cold hunts, and full-grain leather that lasts decades.",
    tags: ["Mountain", "Insulated", "Leather", "Waterproof"],
    msrp: 699,
    lowestPrice: 629,
    priceHistory: [
      { date: "2025-10-01", price: 699 },
      { date: "2025-11-01", price: 669 },
      { date: "2025-12-01", price: 649 },
      { date: "2026-01-01", price: 629 },
      { date: "2026-02-01", price: 649 },
      { date: "2026-03-01", price: 639 },
      { date: "2026-04-01", price: 629 },
    ],
    retailers: [
      { name: "Kenetrek Direct", price: 629, url: "https://kenetrek.com/collections/mountain-boots", inStock: true, logo: "KNT" },
      { name: "Cabela's", price: 649, url: "https://www.cabelas.com/shop/SearchDisplay?searchTerm=kenetrek+mountain+extreme+400", inStock: true, logo: "CAB" },
      { name: "MidwayUSA", price: 669, url: "https://www.midwayusa.com/find?userSearchTerm=kenetrek+mountain+extreme+400", inStock: false, logo: "MID" },
      { name: "Sportsman's Whs.", price: 699, url: "https://www.sportsmanswarehouse.com/search?q=kenetrek+mountain+extreme", inStock: true, logo: "SWH" },
    ],
    specs: {
      Insulation: "400g Thinsulate",
      Upper: "Full-grain leather",
      Waterproofing: "GORE-TEX",
      Shank: "Full-length fiberglass",
      Outsole: "Vibram",
      Height: '8"',
    },
    pros: ["Unmatched ankle support", "Extremely durable", "Great crampon compatibility", "Made in USA"],
    cons: ["Heavy (4 lbs/pair)", "Long break-in period", "Price"],
    expertPick: true,
    bestFor: "Mountain Hunting, Sheep, Elk",
  },
  {
    id: "5",
    name: "Mystery Ranch Metcalf 50",
    brand: "Mystery Ranch",
    category: "Packs",
    image: "🎒",
    rating: 4.8,
    reviewCount: 521,
    description: "The pack that elk hunters trust for multi-day backcountry missions. Bomber construction, a seriously capable frame, and enough capacity to pack out your harvest.",
    tags: ["50L", "Frame", "Meat Hauler", "Multi-Day"],
    msrp: 595,
    lowestPrice: 499,
    priceHistory: [
      { date: "2025-10-01", price: 595 },
      { date: "2025-11-01", price: 549 },
      { date: "2025-12-01", price: 519 },
      { date: "2026-01-01", price: 499 },
      { date: "2026-02-01", price: 519 },
      { date: "2026-03-01", price: 509 },
      { date: "2026-04-01", price: 499 },
    ],
    retailers: [
      { name: "Mystery Ranch", price: 499, url: "https://www.mysteryranch.com/search?type=product&q=metcalf+50", inStock: true, logo: "MYR" },
      { name: "Cabela's", price: 519, url: "https://www.cabelas.com/shop/SearchDisplay?searchTerm=mystery+ranch+metcalf+50", inStock: true, logo: "CAB" },
      { name: "Bass Pro Shops", price: 539, url: "https://www.basspro.com/shop/SearchDisplay?searchTerm=mystery+ranch+metcalf", inStock: true, logo: "BPS" },
      { name: "REI", price: 549, url: "https://www.rei.com/search?q=mystery+ranch+metcalf+50", inStock: false, logo: "REI" },
    ],
    specs: {
      Volume: "50L",
      Weight: "5 lbs 1 oz",
      Frame: "Futura Yoke Suspension",
      "Load Range": "Up to 70 lbs",
      Hydration: "Compatible",
      Material: "500D CORDURA",
    },
    pros: ["Exceptional load transfer", "Ultra-durable CORDURA", "Great meat shelf system", "Comfortable at heavy loads"],
    cons: ["Heavy for the volume", "Expensive", "Dated aesthetic"],
    expertPick: false,
    bestFor: "Elk, Backcountry, Multi-Day",
  },
  {
    id: "6",
    name: "Vortex Diamondback HD 10x42",
    brand: "Vortex",
    category: "Optics",
    image: "🔭",
    rating: 4.6,
    reviewCount: 1204,
    description: "The best value binoculars in hunting. HD glass, phase-corrected prisms, and lifetime warranty at a price that doesn't break the bank.",
    tags: ["Binoculars", "10x42", "HD", "Budget-Friendly"],
    msrp: 329,
    lowestPrice: 259,
    priceHistory: [
      { date: "2025-10-01", price: 329 },
      { date: "2025-11-01", price: 299 },
      { date: "2025-12-01", price: 279 },
      { date: "2026-01-01", price: 259 },
      { date: "2026-02-01", price: 269 },
      { date: "2026-03-01", price: 265 },
      { date: "2026-04-01", price: 259 },
    ],
    retailers: [
      { name: "Vortex Direct", price: 259, url: "https://vortexoptics.com/binoculars/diamondback-hd-10x42.html", inStock: true, logo: "VTX" },
      { name: "Bass Pro Shops", price: 279, url: "https://www.basspro.com/shop/SearchDisplay?searchTerm=vortex+diamondback+hd+10x42", inStock: true, logo: "BPS" },
      { name: "Cabela's", price: 289, url: "https://www.cabelas.com/shop/SearchDisplay?searchTerm=vortex+diamondback+hd+10x42", inStock: true, logo: "CAB" },
      { name: "Amazon", price: 299, url: "https://www.amazon.com/s?k=vortex+diamondback+hd+10x42", inStock: true, logo: "AMZ" },
      { name: "OpticsPlanet", price: 309, url: "https://www.opticsplanet.com/search?q=vortex+diamondback+hd+10x42", inStock: true, logo: "OPP" },
    ],
    specs: {
      Magnification: "10x",
      "Objective Lens": "42mm",
      "Field of View": "330 ft @ 1000 yds",
      "Eye Relief": "15.5mm",
      Coating: "XR Anti-Reflective",
      Weight: "21.9 oz",
    },
    pros: ["Best glass per dollar", "VIP lifetime warranty", "Waterproof/fogproof", "Wide field of view"],
    cons: ["Not quite at Swarovski/Leica level", "Heavier than premium optics"],
    expertPick: false,
    bestFor: "All-Around, Value Pick, Deer, Elk",
  },
  {
    id: "7",
    name: "Mathews Phase 4 33",
    brand: "Mathews",
    category: "Bows",
    image: "🏹",
    rating: 4.9,
    reviewCount: 387,
    description: "Mathews' flagship bow. Dead-quiet, buttery-smooth draw cycle, and pinpoint accuracy. The choice of serious bowhunters chasing trophy animals.",
    tags: ["Compound", "Flagship", "Quiet", "Trophy"],
    msrp: 1299,
    lowestPrice: 1149,
    priceHistory: [
      { date: "2025-10-01", price: 1299 },
      { date: "2025-11-01", price: 1249 },
      { date: "2025-12-01", price: 1199 },
      { date: "2026-01-01", price: 1149 },
      { date: "2026-02-01", price: 1199 },
      { date: "2026-03-01", price: 1179 },
      { date: "2026-04-01", price: 1149 },
    ],
    retailers: [
      { name: "Bass Pro Shops", price: 1149, url: "https://www.basspro.com/shop/SearchDisplay?searchTerm=mathews+phase+4+33", inStock: true, logo: "BPS" },
      { name: "Cabela's", price: 1179, url: "https://www.cabelas.com/shop/SearchDisplay?searchTerm=mathews+phase+4+bow", inStock: true, logo: "CAB" },
      { name: "Scheels", price: 1199, url: "https://www.scheels.com/search?q=mathews+phase+4+33", inStock: false, logo: "SCH" },
      { name: "Lancaster Archery", price: 1249, url: "https://www.lancasterarchery.com/catalogsearch/result/?q=mathews+phase+4+33", inStock: true, logo: "LAN" },
    ],
    specs: {
      "Axle-to-Axle": '33"',
      "Brace Height": '6"',
      "Draw Length": '25.5" – 30.5"',
      "Draw Weight": "40–75 lbs",
      IBO: "335 fps",
      Weight: "4.63 lbs",
    },
    pros: ["Incredibly quiet", "Smooth draw cycle", "Excellent balance", "Solid back wall"],
    cons: ["Expensive", "Limited to Mathews dealers for tuning", "Shorter ATA for some"],
    expertPick: true,
    bestFor: "Whitetail, Elk, Trophy Bowhunting",
  },
  {
    id: "8",
    name: "KUIU Attack Pant",
    brand: "KUIU",
    category: "Clothing",
    image: "👖",
    rating: 4.6,
    reviewCount: 267,
    description: "Purpose-built hunting pants for aggressive terrain. Stretch-woven fabric, articulated knees, and silent movement make these ideal for stalking.",
    tags: ["Softshell", "Stretch", "Silent", "Articulated"],
    msrp: 199,
    lowestPrice: 149,
    priceHistory: [
      { date: "2025-10-01", price: 199 },
      { date: "2025-11-01", price: 179 },
      { date: "2025-12-01", price: 159 },
      { date: "2026-01-01", price: 149 },
      { date: "2026-02-01", price: 159 },
      { date: "2026-03-01", price: 155 },
      { date: "2026-04-01", price: 149 },
    ],
    retailers: [
      { name: "KUIU Direct", price: 149, url: "https://www.kuiu.com/search?type=product&q=attack+pant", inStock: true, logo: "KUI" },
      { name: "Cabela's", price: 169, url: "https://www.cabelas.com/shop/SearchDisplay?searchTerm=kuiu+attack+pant", inStock: true, logo: "CAB" },
      { name: "Bass Pro Shops", price: 179, url: "https://www.basspro.com/shop/SearchDisplay?searchTerm=kuiu+attack+pant", inStock: false, logo: "BPS" },
    ],
    specs: {
      Material: "Stretch-woven nylon",
      "Water Resistance": "DWR",
      Pockets: "6",
      Articulation: "Articulated knees",
      Camo: "KUIU Verde / Vias",
      Fit: "Athletic",
    },
    pros: ["Silent fabric", "Great stretch", "Multiple pocket layout", "Abrasion resistant"],
    cons: ["Not waterproof", "Sizing runs slim", "Limited retail availability"],
    expertPick: false,
    bestFor: "Stalking, Mountain, Mule Deer, Elk",
  },
];

export const CATEGORIES: GearCategory[] = [
  "Rifles", "Optics", "Bows", "Clothing", "Boots", "Packs", "Knives", "Treestands", "Calls", "Trail Cameras"
];

export const CATEGORY_ICONS: Record<GearCategory, string> = {
  Rifles: "🔫",
  Optics: "🔭",
  Bows: "🏹",
  Clothing: "🧥",
  Boots: "🥾",
  Packs: "🎒",
  Knives: "🔪",
  Treestands: "🌲",
  Calls: "📯",
  "Trail Cameras": "📷",
};
