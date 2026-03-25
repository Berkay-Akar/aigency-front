/** Yerel örnek kütüphane görselleri (harici istek yok). */

function svgDataUrl(label: string, hue: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:hsl(${hue},35%,12%)"/>
      <stop offset="100%" style="stop-color:hsl(${hue},45%,22%)"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <text x="50%" y="46%" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="system-ui,sans-serif" font-size="14">${label}</text>
  <text x="50%" y="56%" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-family="system-ui,sans-serif" font-size="11">Aigencys Library</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const STUDIO_LIBRARY_ITEMS = [
  { id: "lib-1", name: "Ürün flatlay", src: svgDataUrl("Flatlay", 280) },
  { id: "lib-2", name: "Model A", src: svgDataUrl("Model", 320) },
  { id: "lib-3", name: "Lifestyle", src: svgDataUrl("Lifestyle", 200) },
  { id: "lib-4", name: "Kozmetik", src: svgDataUrl("Beauty", 340) },
  { id: "lib-5", name: "Ayakkabı", src: svgDataUrl("Footwear", 210) },
  { id: "lib-6", name: "Mobilya", src: svgDataUrl("Interior", 150) },
];
