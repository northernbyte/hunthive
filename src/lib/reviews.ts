export interface Review {
  id: string;
  outfitterId: string;
  author: string;
  initials: string;
  date: string;
  rating: number;
  title: string;
  body: string;
  species: string;
  verified: boolean;
  helpful: number;
}

export const REVIEWS: Review[] = [
  {
    id: "r1", outfitterId: "1",
    author: "Travis M.", initials: "TM", date: "2025-10-14", rating: 5,
    title: "Best elk hunt I've ever had",
    body: "Jake put us on bull elk every single day. We had 3 bulls down by day 4. The camp was top-notch, food was incredible, and the horses were well-trained. I've hunted with 8 different outfitters over the years — Glacier Peak is the best, no contest.",
    species: "Elk", verified: true, helpful: 34,
  },
  {
    id: "r2", outfitterId: "1",
    author: "Derek L.", initials: "DL", date: "2025-09-22", rating: 5,
    title: "Tagged a 360\" bull on day 3",
    body: "Shot a 6x7 bull at 340 yards on the third day. Jake glassed him up the evening before and we made the stalk at first light. He genuinely knows the country like the back of his hand. 100% will be back next year.",
    species: "Elk", verified: true, helpful: 28,
  },
  {
    id: "r3", outfitterId: "1",
    author: "Chris A.", initials: "CA", date: "2025-08-10", rating: 4,
    title: "Excellent operation, minor logistics hiccup",
    body: "Great guides, killer country. We had a pack horse go lame on day 2 which slowed us down, but the team handled it professionally. Ended the week with 2 bulls and a mule deer. Would absolutely recommend.",
    species: "Elk", verified: true, helpful: 19,
  },
  {
    id: "r4", outfitterId: "2",
    author: "Ray T.", initials: "RT", date: "2025-09-05", rating: 5,
    title: "60\" moose — hunt of a lifetime",
    body: "Mike flew us into a remote lake I'd never find on my own. By day 2 we were watching a giant bull work a cow. He let us get to 180 yards and the rest is history. The float plane access alone is worth the price.",
    species: "Moose", verified: true, helpful: 41,
  },
  {
    id: "r5", outfitterId: "2",
    author: "Brandon S.", initials: "BS", date: "2025-08-28", rating: 5,
    title: "Brown bear of a lifetime in Alaska",
    body: "Came for the bear, left with memories I'll never forget. Mike knows the salmon streams and exactly where the big boars spend their time. Incredible guide, incredible country. Already booked for next year.",
    species: "Brown Bear", verified: true, helpful: 37,
  },
  {
    id: "r6", outfitterId: "3",
    author: "Paul H.", initials: "PH", date: "2025-11-20", rating: 5,
    title: "Shot a 170\" Boone & Crockett whitetail",
    body: "Buck was the biggest deer I've ever seen in person. The stand placement on this property is exceptional — Buck obviously knows where the big deer move. Had 4 Pope & Young caliber bucks in front of me over 3 days.",
    species: "Whitetail Deer", verified: true, helpful: 52,
  },
  {
    id: "r7", outfitterId: "3",
    author: "Sam O.", initials: "SO", date: "2025-10-01", rating: 4,
    title: "Great exotic hunts",
    body: "Hunted axis deer and blackbuck. Both are incredible animals — axis in velvet is stunning. The lodging is first class and the food is better than most restaurants. Knocked 20\" off my bucket list.",
    species: "Axis Deer", verified: true, helpful: 22,
  },
  {
    id: "r8", outfitterId: "5",
    author: "Kevin R.", initials: "KR", date: "2025-11-12", rating: 5,
    title: "Saskatchewan whitetail — 190\" giant",
    body: "Dale put me in a stand overlooking a pinch point between two food plots. On the morning of day 2, the biggest buck I'd ever seen walked out at 60 yards. The genetics up here are unreal. This is the real promised land for whitetail hunting.",
    species: "Whitetail Deer", verified: true, helpful: 67,
  },
  {
    id: "r9", outfitterId: "7",
    author: "Nathan P.", initials: "NP", date: "2025-10-18", rating: 5,
    title: "Wyoming elk — 350\" bull on a public land hunt",
    body: "Seth got us into wilderness units I had no idea existed. Packed in 12 miles on horseback and spent 7 days in the most beautiful country on earth. My son and I both tagged out. Worth every penny.",
    species: "Elk", verified: true, helpful: 48,
  },
  {
    id: "r10", outfitterId: "8",
    author: "Aaron W.", initials: "AW", date: "2025-09-30", rating: 5,
    title: "BC grizzly bear — once in a lifetime",
    body: "Ryan took us deep into the Kootenays on horseback. We spotted a massive grizzly on a berry slope on day 3 and made a perfect stalk to 220 yards. The country is absolutely stunning and the horses are exceptional. Top-shelf operation.",
    species: "Grizzly Bear", verified: true, helpful: 59,
  },
];
