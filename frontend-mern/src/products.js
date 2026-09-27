// ---------------------------------------------
// UI constants only. Product data now lives in MongoDB
// and is fetched from the Express API (see App.jsx).
// ---------------------------------------------
export const CATEGORIES = ["Electronics", "Clothing", "Grocery", "Beauty", "Home & Kitchen", "Stationery"];

export const BRANDS = [
  "GlowRoot", "Harvestly", "Home Haus", "InkWell", "Northline",
  "PaperTrail", "PureLeaf", "StrideWear", "TechNova", "Urban Thread",
  "Velvet & Co", "Zolt"
];

export const RATING_OPTIONS = [
  { label: "All ratings", value: 0 },
  { label: "3★ & up", value: 3 },
  { label: "4★ & up", value: 4 },
];

export const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating: High to Low", value: "rating-desc" },
];

export const CATEGORY_TINT = {
  Electronics: { fg: "#3B82F6", bg: "#EFF5FF" },
  Clothing: { fg: "#D6409F", bg: "#FDF0F8" },
  Grocery: { fg: "#0C9D61", bg: "#EAFAF2" },
  Beauty: { fg: "#C2410C", bg: "#FFF3EC" },
  "Home & Kitchen": { fg: "#7C3AED", bg: "#F5F0FF" },
  Stationery: { fg: "#0891B2", bg: "#ECFAFD" },
};
