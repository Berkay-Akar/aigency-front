import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * Downloads a cross-origin URL (e.g. Cloudinary) as a file.
 * The browser ignores the `download` attribute on cross-origin <a> tags,
 * so we fetch the resource first, create a same-origin blob URL, then click.
 */
export async function downloadAsBlob(
  url: string,
  filename: string,
): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
}

/**
 * Downloads an image URL converted to the specified format via canvas.
 * Handles cross-origin URLs by fetching first.
 */
export async function downloadInFormat(
  url: string,
  basename: string,
  format: "jpg" | "png" | "webp",
): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = blobUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not available");

  if (format === "jpg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(blobUrl);

  const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`;
  const quality = format === "jpg" ? 0.92 : undefined;
  const ext = format === "jpg" ? "jpg" : format;

  await new Promise<void>((resolve) => {
    canvas.toBlob(
      (converted) => {
        if (!converted) {
          resolve();
          return;
        }
        const a = document.createElement("a");
        const objectUrl = URL.createObjectURL(converted);
        a.href = objectUrl;
        a.download = `${basename}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
        resolve();
      },
      mimeType,
      quality,
    );
  });
}
