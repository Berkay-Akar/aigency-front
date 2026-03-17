export const MOCK_ASSETS = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    type: "image" as "image" | "video",
    platform: "instagram",
    createdAt: new Date("2024-01-15"),
    caption: "Luxury timepiece that defines moments. ✨",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
    type: "image" as "image" | "video",
    platform: "instagram",
    createdAt: new Date("2024-01-14"),
    caption: "Elevate your beauty ritual. 🌿",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop",
    type: "image" as "image" | "video",
    platform: "tiktok",
    createdAt: new Date("2024-01-13"),
    caption: "Performance meets style. 👟",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=500&fit=crop",
    type: "image" as "image" | "video",
    platform: "instagram",
    createdAt: new Date("2024-01-12"),
    caption: "Step into the future of fashion. 🔥",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
    type: "image" as "image" | "video",
    platform: "facebook",
    createdAt: new Date("2024-01-11"),
    caption: "Your wardrobe, reimagined.",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    type: "image" as "image" | "video",
    platform: "instagram",
    createdAt: new Date("2024-01-10"),
    caption: "Bold moves. Bold shoes. 🚀",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    type: "image" as "image" | "video",
    platform: "tiktok",
    createdAt: new Date("2024-01-09"),
    caption: "Time is your most valuable asset.",
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=450&fit=crop",
    type: "image" as "image" | "video",
    platform: "instagram",
    createdAt: new Date("2024-01-08"),
    caption: "Skincare that works while you sleep. 🌙",
  },
];

export const MOCK_CALENDAR_POSTS = [
  {
    id: "p1",
    date: new Date(2024, 0, 15),
    time: "09:00",
    platform: "instagram",
    caption: "Luxury timepiece that defines moments. ✨",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
    status: "scheduled" as const,
  },
  {
    id: "p2",
    date: new Date(2024, 0, 15),
    time: "18:00",
    platform: "tiktok",
    caption: "Performance meets style. 👟",
    imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&h=200&fit=crop",
    status: "scheduled" as const,
  },
  {
    id: "p3",
    date: new Date(2024, 0, 17),
    time: "12:00",
    platform: "facebook",
    caption: "Your wardrobe, reimagined.",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop",
    status: "scheduled" as const,
  },
  {
    id: "p4",
    date: new Date(2024, 0, 19),
    time: "20:00",
    platform: "instagram",
    caption: "Bold moves. Bold shoes. 🚀",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
    status: "draft" as const,
  },
  {
    id: "p5",
    date: new Date(2024, 0, 22),
    time: "11:00",
    platform: "instagram",
    caption: "Skincare that works while you sleep. 🌙",
    imageUrl: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200&h=200&fit=crop",
    status: "published" as const,
  },
];

export const STUDIO_RESULTS = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop",
];

export const ANALYTICS = {
  engagement: { value: "8.4%", change: "+2.1%", trend: "up" },
  posts: { value: "142", change: "+18", trend: "up" },
  reach: { value: "284K", change: "+12.3%", trend: "up" },
  savedHours: { value: "96h", change: "+24h", trend: "up" },
};

export const PLATFORMS = [
  { id: "instagram", label: "Instagram", color: "#E1306C" },
  { id: "tiktok", label: "TikTok", color: "#ffffff" },
  { id: "facebook", label: "Facebook", color: "#1877F2" },
  { id: "twitter", label: "X / Twitter", color: "#ffffff" },
];
