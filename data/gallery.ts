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
    image: "https://placehold.co/800x600/111118/D6A84F?text=Corporate+Gala",
    location: "JW Marriott Marquis, Dubai",
    year: 2025,
    tags: ["LED Wall", "Stage", "Lighting"],
  },
  {
    id: "g2",
    title: "Luxury Wedding — Atlantis The Palm",
    category: "wedding",
    image: "https://placehold.co/800x600/111118/D6A84F?text=Wedding+Setup",
    location: "Atlantis The Palm, Dubai",
    year: 2025,
    tags: ["Lighting", "Sound", "LED"],
  },
  {
    id: "g3",
    title: "Outdoor Concert — Dubai Media City",
    category: "concert",
    image: "https://placehold.co/800x600/111118/D6A84F?text=Concert+Production",
    location: "Dubai Media City Amphitheatre",
    year: 2024,
    tags: ["Line Array", "Stage", "Rigging"],
  },
  {
    id: "g4",
    title: "Private Villa Party",
    category: "private-party",
    image: "https://placehold.co/800x600/111118/D6A84F?text=Private+Party",
    location: "Palm Jumeirah Villa",
    year: 2025,
    tags: ["DJ Equipment", "Lighting", "Sound"],
  },
  {
    id: "g5",
    title: "P4 LED Backdrop — Awards Night",
    category: "led-setup",
    image: "https://placehold.co/800x600/111118/D6A84F?text=LED+Backdrop",
    location: "Dubai World Trade Centre",
    year: 2025,
    tags: ["LED Wall", "Awards"],
  },
  {
    id: "g6",
    title: "Festival Stage — Global Village",
    category: "stage-setup",
    image: "https://placehold.co/800x600/111118/D6A84F?text=Festival+Stage",
    location: "Global Village, Dubai",
    year: 2024,
    tags: ["Stage", "Rigging", "Truss", "PA"],
  },
  {
    id: "g7",
    title: "Corporate Product Launch",
    category: "corporate",
    image: "https://placehold.co/800x600/111118/D6A84F?text=Product+Launch",
    location: "DIFC, Dubai",
    year: 2025,
    tags: ["Projection", "Sound", "Stage"],
  },
  {
    id: "g8",
    title: "Desert Wedding Ceremony",
    category: "wedding",
    image: "https://placehold.co/800x600/111118/D6A84F?text=Desert+Wedding",
    location: "Dubai Desert Conservation Reserve",
    year: 2025,
    tags: ["Outdoor Lighting", "PA", "Wireless Mic"],
  },
  {
    id: "g9",
    title: "New Year's Eve Concert",
    category: "concert",
    image: "https://placehold.co/800x600/111118/D6A84F?text=NYE+Concert",
    location: "Downtown Dubai",
    year: 2025,
    tags: ["Full Production", "LED", "PA", "Lighting"],
  },
  {
    id: "g10",
    title: "Rooftop Pool Party",
    category: "private-party",
    image: "https://placehold.co/800x600/111118/D6A84F?text=Pool+Party",
    location: "Downtown Dubai Hotel",
    year: 2025,
    tags: ["DJ", "Outdoor Sound", "Uplighting"],
  },
  {
    id: "g11",
    title: "Curved LED Backdrop — Fashion Show",
    category: "led-setup",
    image: "https://placehold.co/800x600/111118/D6A84F?text=Fashion+Show+LED",
    location: "Mall of the Emirates",
    year: 2024,
    tags: ["Curved LED", "Fashion", "Lighting"],
  },
  {
    id: "g12",
    title: "Concert Stage — 3000-Seat Arena",
    category: "stage-setup",
    image: "https://placehold.co/800x600/111118/D6A84F?text=Arena+Stage",
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
