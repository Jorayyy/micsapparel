import type { Business, Category, Faq, Product, Review } from "@/lib/types";

const SEEDED_AT = "2024-04-01T00:00:00.000Z";

export const business: Business = {
  name: "MicsApparel",
  tagline: "Premium Streetwear from Tacloban City",
  description:
    "MicsApparel is a premium streetwear clothing brand based in Tacloban City, Philippines. We offer high-quality caps, hats, and streetwear accessories at affordable prices. Founded with a passion for fashion and faith, we believe in delivering style that speaks to everyone.",
  shortDescription:
    "Premium streetwear clothing brand based in Tacloban City, Philippines. Quality caps, hats, and accessories.",
  motto: "WHEN THE TIME IS RIGHT, I. THE LORD WILL MAKE IT HAPPEN. ISAIAH 60:22",
  mission:
    "To create premium streetwear that combines faith, fashion, and Filipino pride. Every piece is designed with purpose and built to last.",
  founded: "April 2024",
  logo: "https://graph.facebook.com/61575002625239/picture?type=large&width=400",
  location: {
    city: "Tacloban City",
    province: "Leyte",
    country: "Philippines",
    full: "Tacloban City, Leyte, Philippines",
  },
  contact: {
    phone: "+63 992 685 3803",
    phoneRaw: "639926853803",
    email: null,
    messenger: "https://m.me/profile.php?id=61575002625239",
    facebook: "https://www.facebook.com/profile.php?id=61575002625239",
    tiktok: "https://www.tiktok.com/@micko.badilla",
    tiktokHandle: "@micko.badilla",
    address: "Tacloban City, Leyte, Philippines",
    hours: "24/7 via Messenger",
    region: "Eastern Visayas",
  },
  hours: {
    status: "Always Open",
    description: "Available 24/7 via Facebook Messenger and TikTok",
  },
  owner: {
    name: "Micko Badilla",
    title: "CEO & Founder",
  },
  stats: {
    followers: "408+",
    rating: "100%",
    reviewCount: 5,
    yearsInBusiness: "1+",
  },
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61575002625239",
    tiktok: "https://www.tiktok.com/@micko.badilla",
    messenger: "https://m.me/profile.php?id=61575002625239",
  },
  values: [
    {
      title: "Quality",
      description: "Premium fabrics and meticulous craftsmanship in every piece we create.",
    },
    { title: "Faith", description: "Driven by purpose and faith. Every design carries meaning." },
    {
      title: "Affordability",
      description: "High-end streetwear that doesn't break the bank.",
    },
    { title: "Community", description: "Proudly supporting local talent in Tacloban City." },
  ],
  milestones: [
    {
      year: "Apr 2024",
      title: "Founded",
      description: "MicsApparel was born in Tacloban City with a vision for premium streetwear.",
    },
    {
      year: "2024",
      title: "First Collection",
      description:
        "Launched our first cap collection featuring Close Cap, Net Cap, and Tracker Cap.",
    },
    {
      year: "2025",
      title: "Growing Community",
      description: "Reached 400+ followers and established a loyal customer base.",
    },
  ],
};

export const categories: Category[] = [
  {
    id: "cat_caps",
    slug: "caps",
    name: "Caps",
    description: "Close-fit, net, tracker, snapback, and dad caps for everyday wear.",
    image: null,
    order: 1,
    status: "active",
  },
  {
    id: "cat_hats",
    slug: "hats",
    name: "Hats",
    description: "Bucket hats and wider silhouettes for sun, beach, and festivals.",
    image: null,
    order: 2,
    status: "active",
  },
  {
    id: "cat_accessories",
    slug: "accessories",
    name: "Accessories",
    description: "Streetwear extras to finish the fit.",
    image: null,
    order: 3,
    status: "active",
  },
];

export const products: Product[] = [
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
    images: ["https://picsum.photos/seed/cap1/600/750"],
    sku: null,
    status: "active",
    featured: true,
    isNew: false,
    badge: "Best Seller",
    stock: null,
    lowStockAt: 5,
    variants: [],
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
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
    images: ["https://picsum.photos/seed/cap2/600/750"],
    sku: null,
    status: "active",
    featured: true,
    isNew: false,
    badge: "Popular",
    stock: null,
    lowStockAt: 5,
    variants: [],
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
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
    images: ["https://picsum.photos/seed/cap3/600/750"],
    sku: null,
    status: "active",
    featured: true,
    isNew: true,
    badge: "New",
    stock: null,
    lowStockAt: 5,
    variants: [],
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
  },
  {
    id: "prod_classic-snapback",
    slug: "classic-snapback",
    name: "Classic Snapback",
    price: 350,
    compareAtPrice: null,
    description:
      "Timeless snapback silhouette with modern MicsApparel branding. A wardrobe essential.",
    features: [
      "Classic snapback fit",
      "Flat brim option",
      "Premium embroidery",
      "Unisex design",
    ],
    category: "caps",
    images: ["https://picsum.photos/seed/cap4/600/750"],
    sku: null,
    status: "active",
    featured: false,
    isNew: false,
    badge: null,
    stock: null,
    lowStockAt: 5,
    variants: [],
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
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
    images: ["https://picsum.photos/seed/cap5/600/750"],
    sku: null,
    status: "active",
    featured: false,
    isNew: false,
    badge: "Affordable",
    stock: null,
    lowStockAt: 5,
    variants: [],
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
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
    images: ["https://picsum.photos/seed/hat1/600/750"],
    sku: null,
    status: "active",
    featured: false,
    isNew: false,
    badge: null,
    stock: null,
    lowStockAt: 5,
    variants: [],
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
  },
];

export const reviews: Review[] = [
  {
    id: "rev_1",
    name: "Satisfied Customer",
    text: "Ang ganda ng caps! Super quality and worth the price. Recommended talaga ang MicsApparel!",
    rating: 5,
    source: "Facebook Review",
    status: "published",
    createdAt: SEEDED_AT,
  },
  {
    id: "rev_2",
    name: "Happy Buyer",
    text: "Fast delivery and the cap looks exactly like the photos. Will order again!",
    rating: 5,
    source: "Facebook Review",
    status: "published",
    createdAt: SEEDED_AT,
  },
  {
    id: "rev_3",
    name: "Streetwear Fan",
    text: "Finally a local brand that delivers quality streetwear. MicsApparel is the real deal!",
    rating: 5,
    source: "Facebook Review",
    status: "published",
    createdAt: SEEDED_AT,
  },
];

export const faqs: Faq[] = [
  {
    id: "faq_1",
    question: "How can I order from MicsApparel?",
    answer:
      "You can order directly through our Facebook page via Messenger or through our TikTok shop. Simply send us a message with the product you'd like to order and we'll guide you through the process.",
    order: 1,
  },
  {
    id: "faq_2",
    question: "What are your payment methods?",
    answer:
      "We accept GCash, Maya (PayMaya), bank transfers, and cash on delivery (COD) for select areas. Payment details will be provided upon order confirmation.",
    order: 2,
  },
  {
    id: "faq_3",
    question: "Do you ship nationwide in the Philippines?",
    answer:
      "Yes! We ship to all major cities and provinces across the Philippines. Shipping fees vary by location and will be calculated upon order.",
    order: 3,
  },
  {
    id: "faq_4",
    question: "How long does delivery take?",
    answer:
      "For Metro Manila and major cities, delivery typically takes 3-5 business days. Provincial areas may take 5-7 business days. Tacloban City local orders can be arranged for same-day or next-day delivery.",
    order: 4,
  },
  {
    id: "faq_5",
    question: "Are your products authentic MicsApparel items?",
    answer:
      "Absolutely! All MicsApparel products are 100% authentic and made with premium materials. We take pride in the quality of every item we sell.",
    order: 5,
  },
  {
    id: "faq_6",
    question: "Can I return or exchange an item?",
    answer:
      "We accept returns and exchanges within 7 days of delivery for items that are unused and in original packaging. Please contact us via Messenger for return requests.",
    order: 6,
  },
  {
    id: "faq_7",
    question: "Do you offer bulk or wholesale orders?",
    answer:
      "Yes, we offer special pricing for bulk and wholesale orders. Please message us on Facebook with your requirements and we'll provide a custom quote.",
    order: 7,
  },
  {
    id: "faq_8",
    question: "Where is MicsApparel based?",
    answer:
      "We are proudly based in Tacloban City, Leyte, Philippines. Our brand was founded here and we serve customers nationwide.",
    order: 8,
  },
];

export const services = [
  {
    title: "Retail Sales",
    description:
      "Browse and purchase our latest streetwear collection directly through our social media channels.",
    icon: "shopping-bag",
  },
  {
    title: "Custom Orders",
    description:
      "Looking for personalized caps or bulk orders? We offer custom designs for events, teams, and businesses.",
    icon: "paintbrush",
  },
  {
    title: "Nationwide Shipping",
    description:
      "We deliver across the Philippines. Fast and reliable shipping to your doorstep.",
    icon: "truck",
  },
  {
    title: "Wholesale",
    description:
      "Interested in reselling MicsApparel products? Contact us for wholesale pricing and partnership opportunities.",
    icon: "building-store",
  },
];
