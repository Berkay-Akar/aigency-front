export interface StudioTemplate {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
}

export const STUDIO_TEMPLATES: StudioTemplate[] = [
  {
    id: "fashion",
    title: "Fashion Drop",
    subtitle: "Lookbook + story set",
    accent: "from-fuchsia-500/20 to-violet-600/10",
  },
  {
    id: "beauty",
    title: "Beauty Launch",
    subtitle: "PDP + macro detay",
    accent: "from-rose-500/20 to-amber-500/10",
  },
  {
    id: "jewelry",
    title: "Jewelry Campaign",
    subtitle: "Parlaklık & makro",
    accent: "from-amber-400/20 to-yellow-600/10",
  },
  {
    id: "footwear",
    title: "Footwear Ads",
    subtitle: "Açı seti + lifestyle",
    accent: "from-slate-500/20 to-zinc-600/10",
  },
  {
    id: "furniture",
    title: "Furniture Showcase",
    subtitle: "Oda sahnesi + hero",
    accent: "from-emerald-500/20 to-teal-600/10",
  },
  {
    id: "food",
    title: "Food Product Promo",
    subtitle: "Editorial ışık + renk",
    accent: "from-orange-500/20 to-red-600/10",
  },
  {
    id: "pdp",
    title: "E-commerce PDP Pack",
    subtitle: "Beyaz fon + varyant",
    accent: "from-indigo-500/20 to-blue-600/10",
  },
  {
    id: "social",
    title: "Social Starter Set",
    subtitle: "1:1 · 4:5 · 9:16",
    accent: "from-cyan-500/20 to-sky-600/10",
  },
];
