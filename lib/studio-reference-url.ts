/** Max kenar (px); gövde boyutu ve bellek için sınır. */
const MAX_EDGE = 2048;
const JPEG_QUALITY = 0.88;

function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("IMAGE_LOAD_FAILED"));
    };
    img.src = objectUrl;
  });
}

function imageToJpegDataUrl(
  img: HTMLImageElement,
  maxEdge: number,
  quality: number
): string {
  let w = img.naturalWidth || img.width;
  let h = img.naturalHeight || img.height;
  const scale = Math.min(1, maxEdge / Math.max(w, h, 1));
  w = Math.max(1, Math.round(w * scale));
  h = Math.max(1, Math.round(h * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("NO_2D_CONTEXT");
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

/**
 * `imageUrls` için değer: http(s) aynen; blob: / data: sıkıştırılmış JPEG data URL.
 * (Backend’in `imageUrls` içinde data URI kabul etmesi gerekir.)
 */
export async function resolveReferenceUrlForGenerate(
  url: string
): Promise<string | null> {
  const u = url.trim();
  if (!u) return null;
  if (u.startsWith("https://") || u.startsWith("http://")) return u;

  if (!u.startsWith("blob:") && !u.startsWith("data:")) return null;

  let blob: Blob;
  try {
    const res = await fetch(u);
    blob = await res.blob();
  } catch {
    return null;
  }

  try {
    const img = await loadImageFromBlob(blob);
    return imageToJpegDataUrl(img, MAX_EDGE, JPEG_QUALITY);
  } catch {
    return null;
  }
}

export async function buildResolvedReferenceImageUrls(
  slots: (string | null)[]
): Promise<string[]> {
  const out: string[] = [];
  for (const s of slots) {
    if (!s) continue;
    const r = await resolveReferenceUrlForGenerate(s);
    if (r) out.push(r);
  }
  return out;
}
