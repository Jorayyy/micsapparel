import type { Product } from "@/lib/types";

const SEEDED_AT = "2024-04-01T00:00:00.000Z";

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;

const capImg = {
  close: u("photo-1620327467532-6ebaca6273ed"),
  net: u("photo-1678721938524-1a3ee398de2a"),
  tracker: u("photo-1536785696345-3ed1adce6bb6"),
  snapback: u("photo-1547907482-85987509d74a"),
  dad: u("photo-1550314124-301ca0b773ae"),
  baseball: u("photo-1611692370244-aebb15c17941"),
  washed: u("photo-1521369909029-2afed882baee"),
  rear: u("photo-1534215754734-18e55d13e346"),
  rope: u("photo-1556306535-0f09a537f0a3"),
  tan: u("photo-1575428652377-a2d80e2277fc"),
  truckerWhite: u("photo-1588850561407-ed78c282e89b"),
  whiteOn: u("photo-1622445275576-721325763afe"),
};

const hatImg = {
  bucket: u("photo-1553762869-cbb606f987b5"),
  wideBlack: u("photo-1543087903-1ac2ec7aa8c5"),
  wideBlue: u("photo-1514327605112-b887c0e61c0a"),
  straw: u("photo-1572307480813-ceb0e59d8325"),
  felt: u("photo-1533055640609-24b498dfd74c"),
};

const accImg = {
  tote: u("photo-1544816155-12df9643f363"),
  backpack: u("photo-1553062407-98eeb64c6a62"),
  miniPack: u("photo-1622560480605-d83c853bc5c3"),
  drawstring: u("photo-1581605405669-fcdf81165afa"),
  sling: u("photo-1548036328-c9fa89d128fa"),
  socksLips: u("photo-1586350977771-b3b0abd50c82"),
  socksPattern: u("photo-1582966772680-860e372bb558"),
  redBag: u("photo-1584917865442-de89df76afd3"),
  crescent: u("photo-1506152983158-b4a74a01c721"),
  tie: u("photo-1589756823695-278bc923f962"),
};

type Seed = {
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  description: string;
  features: string[];
  category: "caps" | "hats" | "accessories";
  images: string[];
  featured?: boolean;
  isNew?: boolean;
  badge?: string | null;
  id?: string;
  createdAt?: string;
};

const addDays = (days: number) =>
  new Date(new Date("2025-09-15T00:00:00.000Z").getTime() + days * 86400000).toISOString();

const originals: Seed[] = [
  {
    id: "prod_close-cap",
    slug: "close-cap",
    name: "Close Cap",
    price: 350,
    compareAtPrice: null,
    description:
      "Premium close-fit cap with the iconic MicsApparel logo. Perfect for everyday streetwear styling.",
    features: ["Premium quality fabric", "Adjustable fit", "Iconic MA logo", "Comfortable wear"],
    category: "caps",
    images: [capImg.close],
    badge: "Best Seller",
    featured: true,
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_net-cap",
    slug: "net-cap",
    name: "Net Cap",
    price: 300,
    compareAtPrice: null,
    description:
      "Stylish net cap design combining breathability with streetwear aesthetics. Ideal for the Philippine climate.",
    features: [
      "Breathable mesh back",
      "Durable construction",
      "MA branding",
      "Lightweight design",
    ],
    category: "caps",
    images: [capImg.net],
    badge: "Popular",
    featured: true,
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_tracker-cap",
    slug: "tracker-cap",
    name: "Tracker Cap",
    price: 300,
    compareAtPrice: null,
    description:
      "Outdoor-ready tracker cap built for adventure. Rugged style meets urban fashion.",
    features: [
      "Adventure-ready design",
      "UV protection",
      "Quick-dry material",
      "Versatile styling",
    ],
    category: "caps",
    images: [capImg.tracker],
    badge: "New",
    featured: true,
    isNew: true,
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_classic-snapback",
    slug: "classic-snapback",
    name: "Classic Snapback",
    price: 350,
    compareAtPrice: null,
    description:
      "Timeless snapback silhouette with modern MicsApparel branding. A wardrobe essential.",
    features: ["Classic snapback fit", "Flat brim option", "Premium embroidery", "Unisex design"],
    category: "caps",
    images: [capImg.snapback],
    badge: null,
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_dad-cap",
    slug: "dad-cap",
    name: "Dad Cap",
    price: 280,
    compareAtPrice: null,
    description:
      "Relaxed-fit dad cap for effortless style. Comfortable, casual, and unmistakably MicsApparel.",
    features: ["Relaxed fit", "Soft crown", "Vintage wash", "Adjustable strap"],
    category: "caps",
    images: [capImg.dad],
    badge: "Affordable",
    createdAt: SEEDED_AT,
  },
  {
    id: "prod_bucket-hat",
    slug: "bucket-hat",
    name: "Bucket Hat",
    price: 320,
    compareAtPrice: null,
    description:
      "Versatile bucket hat perfect for beach days, festivals, or casual streetwear looks.",
    features: ["Wide brim coverage", "Reversible option", "Lightweight fabric", "Packable design"],
    category: "hats",
    images: [hatImg.bucket],
    badge: null,
    createdAt: SEEDED_AT,
  },
];

const newCaps: Seed[] = [
  {
    slug: "washed-logo-cap",
    name: "Washed Logo Cap",
    price: 350,
    description:
      "Sun-faded wash with a low-key embroidered mark. Broken-in feel from day one.",
    features: ["Garment-washed cotton", "Embroidered MA logo", "Adjustable strap", "Unstructured crown"],
    category: "caps",
    images: [capImg.washed],
  },
  {
    slug: "five-panel-camp-cap",
    name: "Five-Panel Camp Cap",
    price: 395,
    description:
      "Trail-ready five-panel with a flat brim and clean camp-profile fit.",
    features: ["Lightweight five-panel build", "Curved brim", "Moisture-wicking band", "Snap closure"],
    category: "caps",
    images: [capImg.tan],
    featured: true,
  },
  {
    slug: "classic-trucker-cap",
    name: "Classic Trucker Cap",
    price: 320,
    description:
      "The staple mesh-back trucker in crisp white. Breathable, adjustable, always in style.",
    features: ["Mesh back panels", "Foam front panel", "Snapback closure", "Structured fit"],
    category: "caps",
    images: [capImg.truckerWhite],
  },
  {
    slug: "rope-snapback",
    name: "Rope Snapback",
    price: 420,
    compareAtPrice: 480,
    description:
      "Rope-trim snapback with a raised crown — vintage detail, modern shape.",
    features: ["Rope accent trim", "Flat brim", "Snapback closure", "Woven label"],
    category: "caps",
    images: [capImg.rope],
    badge: "Sale",
  },
  {
    slug: "low-profile-cap",
    name: "Low Profile Cap",
    price: 330,
    description:
      "Minimal six-panel that sits low and close. No logos screaming — just clean lines.",
    features: ["Six-panel construction", "Low crown profile", "Adjustable metal clasp", "Tonal stitching"],
    category: "caps",
    images: [capImg.rear],
  },
  {
    slug: "monogram-trucker",
    name: "Monogram Trucker",
    price: 360,
    description:
      "White-on-white monogram trucker. Fresh drop energy for everyday fits.",
    features: ["Tonal MA monogram", "Breathable mesh back", "Snap closure", "Water-repellent front"],
    category: "caps",
    images: [capImg.whiteOn],
    isNew: true,
    badge: "New",
  },
  {
    slug: "distress-wash-cap",
    name: "Distress Wash Cap",
    price: 370,
    description:
      "Naturally faded wash with raw-edge details for that lived-in look.",
    features: ["Distressed cotton", "Raw brim edge", "Snap closure", "Washed MA embroidery"],
    category: "caps",
    images: [capImg.close],
  },
  {
    slug: "flat-brim-pro",
    name: "Flat Brim Pro",
    price: 450,
    description:
      "Structured flat brim with a deep crown — built for clean streetwear stacking.",
    features: ["Deep crown fit", "Flat brim", "Snapback closure", "3D embroidery"],
    category: "caps",
    images: [capImg.snapback],
    badge: "Pro Fit",
  },
  {
    slug: "everyday-curved-cap",
    name: "Everyday Curved Cap",
    price: 300,
    description:
      "Curved brim, soft crown, zero fuss. The cap you grab without thinking.",
    features: ["Soft curved brim", "Unstructured fit", "Adjustable strap", "Breathable inner band"],
    category: "caps",
    images: [capImg.dad],
  },
  {
    slug: "mesh-runner-cap",
    name: "Mesh Runner Cap",
    price: 310,
    description:
      "Airflow mesh panels keep you cool through Tacloban afternoons.",
    features: ["Full mesh back", "Quick-dry sweatband", "Snap closure", "Featherweight build"],
    category: "caps",
    images: [capImg.net],
  },
  {
    slug: "two-tone-trucker",
    name: "Two-Tone Trucker",
    price: 340,
    description:
      "Contrast two-tone panels with a mesh back for breathable everyday wear.",
    features: ["Two-tone panels", "Mesh back", "Snapback closure", "Pre-curved brim"],
    category: "caps",
    images: [capImg.tracker],
  },
  {
    slug: "sunday-best-cap",
    name: "Sunday Best Cap",
    price: 385,
    description:
      "A dressier take on the MA cap — tidy embroidery, crisp brim, clean finish.",
    features: ["Structured crown", "Crisp curved brim", "Metal buckle", "Tonal MA embroidery"],
    category: "caps",
    images: [capImg.baseball],
    badge: "Limited",
  },
  {
    slug: "embroidered-crown-cap",
    name: "Embroidered Crown Cap",
    price: 400,
    description:
      "All-over crown embroidery with an adjustable back tab.",
    features: ["Full crown embroidery", "Adjustable tab", "Soft cotton build", "Moisture band"],
    category: "caps",
    images: [capImg.washed],
  },
  {
    slug: "shadow-peak-cap",
    name: "Shadow Peak Cap",
    price: 365,
    description:
      "Deep peak and dark hardware for a sharper silhouette.",
    features: ["Deep visor", "Matte black hardware", "Six-panel fit", "Inner comfort band"],
    category: "caps",
    images: [capImg.rope],
    isNew: true,
    badge: "New",
  },
  {
    slug: "heritage-logo-cap",
    name: "Heritage Logo Cap",
    price: 415,
    description:
      "Classic six-panel with heritage-script MA branding and a brass clasp.",
    features: ["Heritage script logo", "Brass clasp", "Six-panel build", "Pre-curved brim"],
    category: "caps",
    images: [capImg.tan],
    badge: "Best Seller",
  },
];

const newHats: Seed[] = [
  {
    slug: "packable-bucket-hat",
    name: "Packable Bucket Hat",
    price: 349,
    description:
      "Crushable bucket that lives in your bag. UPF-friendly daily shade.",
    features: ["Packable quick-dry fabric", "UPF 50+ brim", "Inner sweatband", "Unisex fit"],
    category: "hats",
    images: [hatImg.bucket],
  },
  {
    slug: "wide-brim-sun-hat",
    name: "Wide Brim Sun Hat",
    price: 475,
    description:
      "Wide brim with easy comfort for city heat and long outdoor days.",
    features: ["Wide sun brim", "Lightweight shell", "Breathable crown", "Packable shape"],
    category: "hats",
    images: [hatImg.wideBlue],
    featured: true,
  },
  {
    slug: "straw-beach-hat",
    name: "Straw Beach Hat",
    price: 425,
    description:
      "Handwoven straw brim for beach days and fiesta afternoons.",
    features: ["Natural straw weave", "Breathable open crown", "Comfort sweatband", "Travel-friendly"],
    category: "hats",
    images: [hatImg.straw],
    badge: "Beach Ready",
  },
  {
    slug: "felt-fedora",
    name: "Felt Fedora",
    price: 599,
    description:
      "Structured felt fedora with a classic pinch crown.",
    features: ["Premium wool felt", "Pinch crown", "Grosgrain band", "Structured brim"],
    category: "hats",
    images: [hatImg.felt],
    badge: "Premium",
  },
  {
    slug: "black-wide-brim",
    name: "Black Wide Brim",
    price: 499,
    description:
      "All-black wide brim — sharp over tees, sharper over fits.",
    features: ["Matte black finish", "Wide brim", "Lightweight", "Comfort band"],
    category: "hats",
    images: [hatImg.wideBlack],
    isNew: true,
    badge: "New",
  },
  {
    slug: "double-layer-bucket",
    name: "Double-Layer Bucket",
    price: 379,
    description:
      "Reversible double-layer bucket: solid out, tonal in.",
    features: ["Reversible design", "Double-layer fabric", "Packable", "Unisex fit"],
    category: "hats",
    images: [hatImg.bucket],
  },
  {
    slug: "lifeguard-bucket",
    name: "Lifeguard Bucket",
    price: 359,
    description:
      "Wide-coverage summer bucket with a crushable shell for beach duty.",
    features: ["Extra-wide brim", "Crushable shell", "Quick-dry fabric", "Inner tie cord"],
    category: "hats",
    images: [hatImg.straw],
  },
  {
    slug: "festival-floppy-hat",
    name: "Festival Floppy Hat",
    price: 445,
    description:
      "Soft floppy brim that moves with the crowd — festival ready.",
    features: ["Soft flexible brim", "Breathable crown", "Packable", "Comfort band"],
    category: "hats",
    images: [hatImg.wideBlue],
    badge: "Limited",
  },
  {
    slug: "charcoal-brim-hat",
    name: "Charcoal Brim Hat",
    price: 469,
    description:
      "Charcoal felt with a clean, level brim. Dress it up or down.",
    features: ["Charcoal felt", "Level brim", "Woven band", "Structured crown"],
    category: "hats",
    images: [hatImg.felt],
  },
  {
    slug: "city-bucket-hat",
    name: "City Bucket Hat",
    price: 389,
    description:
      "Everyday bucket in blackout. Pairs with everything you own.",
    features: ["Blackout colorway", "Soft crown", "Packable", "Adjustable inner"],
    category: "hats",
    images: [hatImg.wideBlack],
  },
  {
    slug: "packable-sun-hat",
    name: "Packable Sun Hat",
    price: 299,
    description:
      "Flat-pack sun hat that bounces back to shape straight from your bag.",
    features: ["Shape-memory brim", "Ultralight", "Packable", "Moisture band"],
    category: "hats",
    images: [hatImg.straw],
    badge: "Affordable",
  },
  {
    slug: "beach-rope-bucket",
    name: "Beach Rope Bucket",
    price: 369,
    description:
      "Rope-wrapped crown bucket for salty days and long drives.",
    features: ["Rope-wrapped crown", "Quick-dry fabric", "Wide brim", "Unisex fit"],
    category: "hats",
    images: [hatImg.bucket],
  },
  {
    slug: "alpine-felt-hat",
    name: "Alpine Felt Hat",
    price: 575,
    compareAtPrice: 650,
    description:
      "Cool-weather felt with a weather-ready band. Baguio trips approved.",
    features: ["Wool-blend felt", "Weather band", "Structured brim", "Pinch crown"],
    category: "hats",
    images: [hatImg.felt],
    badge: "Sale",
  },
  {
    slug: "cream-brim-boater",
    name: "Cream Brim Boater",
    price: 415,
    description:
      "Cream boater with a stiff brim and grosgrain band.",
    features: ["Stiff flat brim", "Grosgrain band", "Light cream tone", "Structured fit"],
    category: "hats",
    images: [hatImg.straw],
    isNew: true,
    badge: "New",
  },
  {
    slug: "night-out-wide-brim",
    name: "Night Out Wide Brim",
    price: 520,
    description:
      "Evening silhouette with a dramatic brim and clean black finish.",
    features: ["Dramatic brim", "Matte finish", "Comfort band", "Lightweight build"],
    category: "hats",
    images: [hatImg.wideBlack],
  },
  {
    slug: "trail-bucket-hat",
    name: "Trail Bucket Hat",
    price: 355,
    description:
      "Quick-dry trail bucket with a secure fit for hikes and rides.",
    features: ["Quick-dry fabric", "Chin cord", "UPF brim", "Ventilated crown"],
    category: "hats",
    images: [hatImg.bucket],
  },
  {
    slug: "straw-trilby",
    name: "Straw Trilby",
    price: 385,
    description:
      "Short-brim trilby woven from lightweight straw.",
    features: ["Short brim", "Lightweight straw", "Woven band", "Breathable crown"],
    category: "hats",
    images: [hatImg.straw],
  },
  {
    slug: "rainy-day-brim",
    name: "Rainy Day Brim",
    price: 435,
    description:
      "Water-resistant brim that holds shape through sudden showers.",
    features: ["Water-resistant shell", "Shape-holding brim", "Lightweight", "Comfort band"],
    category: "hats",
    images: [hatImg.wideBlue],
  },
  {
    slug: "corduroy-bucket",
    name: "Corduroy Bucket Hat",
    price: 395,
    description:
      "Soft corduroy bucket with a textured hand-feel for cooler days.",
    features: ["Corduroy shell", "Soft crown", "Packable", "Inner sweatband"],
    category: "hats",
    images: [hatImg.bucket],
    badge: "New",
    isNew: true,
  },
];

const newAccessories: Seed[] = [
  {
    slug: "everyday-tote",
    name: "Everyday Tote",
    price: 299,
    description:
      "Sturdy carry-all for class, gym, and market runs.",
    features: ["Heavyweight canvas", "Reinforced straps", "Inner pocket", "Fits a 15-inch laptop"],
    category: "accessories",
    images: [accImg.tote],
    featured: true,
  },
  {
    slug: "city-daypack",
    name: "City Daypack",
    price: 599,
    description:
      "Streamlined navy daypack with a padded laptop sleeve.",
    features: ["Padded laptop sleeve", "Water-resistant shell", "Breathable back panel", "Front organizer"],
    category: "accessories",
    images: [accImg.backpack],
  },
  {
    slug: "mini-daypack",
    name: "Mini Daypack",
    price: 549,
    description:
      "Compact daypack in dusty rose for light-carry days.",
    features: ["Compact 12L size", "Smooth zip pulls", "Interior pocket", "Padded straps"],
    category: "accessories",
    images: [accImg.miniPack],
    isNew: true,
    badge: "New",
  },
  {
    slug: "drawstring-gym-sack",
    name: "Drawstring Gym Sack",
    price: 249,
    description:
      "Featherweight drawstring sack for gym and court days.",
    features: ["Ripstop fabric", "Reinforced corners", "Double drawstrings", "Water-resistant base"],
    category: "accessories",
    images: [accImg.drawstring],
    featured: true,
  },
  {
    slug: "quilted-sling-bag",
    name: "Quilted Sling Bag",
    price: 699,
    description:
      "Quilted crossbody with chain strap — hands-free, head-turning.",
    features: ["Quilted shell", "Chain crossbody strap", "Magnetic flap", "Interior card slot"],
    category: "accessories",
    images: [accImg.sling],
    badge: "Premium",
  },
  {
    slug: "printed-crew-socks",
    name: "Printed Crew Socks",
    price: 149,
    description:
      "Soft cotton crew with an all-over print. The detail that finishes a fit.",
    features: ["Combed cotton blend", "Cushioned sole", "Ribbed cuff", "One size"],
    category: "accessories",
    images: [accImg.socksLips],
    featured: true,
  },
  {
    slug: "patterned-crew-socks",
    name: "Patterned Crew Socks",
    price: 159,
    description:
      "Woven pattern crews with a snug elastic hold.",
    features: ["Jacquard pattern", "Snug elastic", "Cushioned heel", "One size"],
    category: "accessories",
    images: [accImg.socksPattern],
  },
  {
    slug: "cherry-top-handle",
    name: "Cherry Top Handle Bag",
    price: 799,
    description:
      "Structured top-handle in cherry red for statement fits.",
    features: ["Structured silhouette", "Top handle + strap", "Secure clasp", "Lined interior"],
    category: "accessories",
    images: [accImg.redBag],
    badge: "Limited",
  },
  {
    slug: "mini-crescent-bag",
    name: "Mini Crescent Bag",
    price: 649,
    description:
      "Curved mini bag with a smooth finish and adjustable strap.",
    features: ["Crescent shape", "Adjustable strap", "Smooth finish", "Zip closure"],
    category: "accessories",
    images: [accImg.crescent],
  },
  {
    slug: "graphic-tie",
    name: "Graphic Tie",
    price: 249,
    description:
      "Printed tie that breaks up uniforms and plain shirts.",
    features: ["All-over print", "Slim cut", "Woven fabric", "Slip-resistant keeper"],
    category: "accessories",
    images: [accImg.tie],
  },
  {
    slug: "heavy-canvas-tote",
    name: "Heavy Canvas Tote",
    price: 379,
    description:
      "Upgraded double-stitched tote for heavier loads.",
    features: ["16oz canvas", "Double-stitched seams", "Reinforced base", "Internal zip pocket"],
    category: "accessories",
    images: [accImg.tote],
  },
  {
    slug: "camera-sling-pouch",
    name: "Camera Sling Pouch",
    price: 579,
    description:
      "Compact camera-style sling for phone, wallet, and keys.",
    features: ["Padded main slot", "Adjustable webbing strap", "Front zip pocket", "Quilted back"],
    category: "accessories",
    images: [accImg.sling],
  },
  {
    slug: "gym-sack-pro",
    name: "Gym Sack Pro",
    price: 279,
    description:
      "Reinforced gym sack with a water-resistant lining.",
    features: ["Water-resistant lining", "Bar-tacked corners", "Dual drawstrings", "Lightweight"],
    category: "accessories",
    images: [accImg.drawstring],
  },
  {
    slug: "crew-socks-3-pack",
    name: "Crew Socks 3-Pack",
    price: 349,
    compareAtPrice: 399,
    description:
      "Three patterned crews so you're always stocked.",
    features: ["3 pairs per pack", "Mixed patterns", "Cushioned sole", "One size"],
    category: "accessories",
    images: [accImg.socksPattern],
    badge: "Sale",
  },
  {
    slug: "weekend-backpack",
    name: "Weekend Backpack",
    price: 749,
    description:
      "Overnight-ready pack with room for two days of gear.",
    features: ["28L capacity", "Padded straps", "Shoe compartment", "Luggage pass-through"],
    category: "accessories",
    images: [accImg.backpack],
    badge: "Best Seller",
  },
  {
    slug: "packable-tote",
    name: "Packable Tote",
    price: 199,
    description:
      "Folds into its own pocket. Never caught without a spare bag.",
    features: ["Folds into pocket", "Ripstop nylon", "Double handles", "Holds up to 10kg"],
    category: "accessories",
    images: [accImg.tote],
    badge: "Affordable",
  },
  {
    slug: "sling-pouch",
    name: "Sling Pouch",
    price: 229,
    description:
      "Quick-pouch for chargers, cards, and daily carry.",
    features: ["Compact organizer", "Internal mesh slot", "Quick-release buckle", "Water-resistant shell"],
    category: "accessories",
    images: [accImg.drawstring],
  },
  {
    slug: "no-show-socks-pack",
    name: "No-Show Socks 3-Pack",
    price: 179,
    description:
      "Low-cut socks that disappear under your kicks.",
    features: ["3 pairs per pack", "Silicone heel grip", "Breathable mesh", "One size"],
    category: "accessories",
    images: [accImg.socksLips],
  },
  {
    slug: "street-crossbody",
    name: "Street Crossbody",
    price: 629,
    description:
      "Low-profile crossbody that sits flat against the body.",
    features: ["Slim profile", "Adjustable strap", "Two-way zip", "RFID inner pocket"],
    category: "accessories",
    images: [accImg.crescent],
    isNew: true,
    badge: "New",
  },
  {
    slug: "travel-wash-bag",
    name: "Travel Wash Bag",
    price: 219,
    description:
      "Compact wash bag with wipe-clean lining.",
    features: ["Wipe-clean lining", "Mesh drainage panel", "Hook for hanging", "Water-resistant shell"],
    category: "accessories",
    images: [accImg.tote],
  },
];

const seeds = [...originals, ...newCaps, ...newHats, ...newAccessories];

export const products: Product[] = seeds.map((seed, index) => ({
  id: seed.id ?? `prod_${seed.slug}`,
  slug: seed.slug,
  name: seed.name,
  price: seed.price,
  compareAtPrice: seed.compareAtPrice ?? null,
  description: seed.description,
  features: seed.features,
  category: seed.category,
  images: seed.images,
  sku: null,
  status: "active",
  featured: seed.featured ?? false,
  isNew: seed.isNew ?? false,
  badge: seed.badge ?? null,
  stock: null,
  lowStockAt: 5,
  variants: [],
  createdAt: seed.createdAt ?? addDays(index - originals.length),
  updatedAt: seed.createdAt ?? addDays(index - originals.length),
}));
