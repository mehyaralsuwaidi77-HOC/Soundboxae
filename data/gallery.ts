export type GalleryCategory =
  | "all"
  | "corporate"
  | "wedding"
  | "concert"
  | "private-party"
  | "led-setup"
  | "stage-setup";

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  image: string;
  location?: string;
  year?: number;
  tags: string[];
}

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    title: "Grand Corporate Gala — JW Marriott",
    category: "corporate",
    image: "/Category%20BG/Corporate%20Events%20BG.png",
    location: "JW Marriott Marquis, Dubai",
    year: 2025,
    tags: ["LED Wall", "Stage", "Lighting"],
  },
  {
    id: "g2",
    title: "Luxury Wedding — Atlantis The Palm",
    category: "wedding",
    image: "/Category%20BG/Wedding%20Setup%20BG.png",
    location: "Atlantis The Palm, Dubai",
    year: 2025,
    tags: ["Lighting", "Sound", "LED"],
  },
  {
    id: "g3",
    title: "Outdoor Concert — Dubai Media City",
    category: "concert",
    image: "/Category%20BG/Concert%20Setup%20BG.png",
    location: "Dubai Media City Amphitheatre",
    year: 2024,
    tags: ["Line Array", "Stage", "Rigging"],
  },
  {
    id: "g4",
    title: "Private Villa Party",
    category: "private-party",
    image: "/Category%20BG/Event%20Production%20BG.png",
    location: "Palm Jumeirah Villa",
    year: 2025,
    tags: ["DJ Equipment", "Lighting", "Sound"],
  },
  {
    id: "g5",
    title: "P4 LED Backdrop — Awards Night",
    category: "led-setup",
    image: "/Category%20BG/LED%20Screens%20BG.png",
    location: "Dubai World Trade Centre",
    year: 2025,
    tags: ["LED Wall", "Awards"],
  },
  {
    id: "g6",
    title: "Festival Stage — Global Village",
    category: "stage-setup",
    image: "/Category%20BG/Stages%20BG.png",
    location: "Global Village, Dubai",
    year: 2024,
    tags: ["Stage", "Rigging", "Truss", "PA"],
  },
  {
    id: "g7",
    title: "Corporate Product Launch",
    category: "corporate",
    image: "/Category%20BG/Corporate%20Events%20BG.png",
    location: "DIFC, Dubai",
    year: 2025,
    tags: ["Projection", "Sound", "Stage"],
  },
  {
    id: "g8",
    title: "Desert Wedding Ceremony",
    category: "wedding",
    image: "/Category%20BG/Wedding%20Setup%20BG.png",
    location: "Dubai Desert Conservation Reserve",
    year: 2025,
    tags: ["Outdoor Lighting", "PA", "Wireless Mic"],
  },
  {
    id: "g9",
    title: "New Year's Eve Concert",
    category: "concert",
    image: "/Category%20BG/Concert%20Setup%20BG.png",
    location: "Downtown Dubai",
    year: 2025,
    tags: ["Full Production", "LED", "PA", "Lighting"],
  },
  {
    id: "g10",
    title: "Rooftop Pool Party",
    category: "private-party",
    image: "/Category%20BG/DJ%20Equipment%20BG.png",
    location: "Downtown Dubai Hotel",
    year: 2025,
    tags: ["DJ", "Outdoor Sound", "Uplighting"],
  },
  {
    id: "g11",
    title: "Curved LED Backdrop — Fashion Show",
    category: "led-setup",
    image: "/Category%20BG/LED%20Screens%20BG.png",
    location: "Mall of the Emirates",
    year: 2024,
    tags: ["Curved LED", "Fashion", "Lighting"],
  },
  {
    id: "g12",
    title: "Concert Stage — 3000-Seat Arena",
    category: "stage-setup",
    image: "/Category%20BG/Rigging%20BG.png",
    location: "Coca-Cola Arena, Dubai",
    year: 2025,
    tags: ["Stage", "Truss", "Rigging", "Roof"],
  },
];

export const galleryCategories: { value: GalleryCategory; label: string }[] = [
  { value: "all", label: "All Events" },
  { value: "corporate", label: "Corporate" },
  { value: "wedding", label: "Weddings" },
  { value: "concert", label: "Concerts" },
  { value: "private-party", label: "Private Parties" },
  { value: "led-setup", label: "LED Setups" },
  { value: "stage-setup", label: "Stage Setups" },
];
