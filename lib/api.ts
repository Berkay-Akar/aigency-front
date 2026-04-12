import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getToken, removeToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000,
});

// Attach JWT on every request (skip auth endpoints that use body-only credentials)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const path = `${config.baseURL ?? ""}${config.url ?? ""}`;
    const skipAuth =
      /\/auth\/(login|register|refresh)(\/|$|\?)/.test(path) ||
      /\/auth\/(login|register|refresh)(\/|$|\?)/.test(config.url ?? "");
    const token = getToken();
    if (token && config.headers && !skipAuth) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Global 401 handler — clear auth and redirect to /login
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  workspaceName: string;
}

/** Flat auth payload (legacy or direct). */
export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

/** Backend wrapper: { success, data: { token, refreshToken, user } } */
export interface WrappedAuthResponse {
  success?: boolean;
  data: AuthResponse;
}

export interface AuthUserPayload {
  id: string;
  name: string;
  email: string;
}

/**
 * Normalizes login/register responses whether the API returns
 * `{ token, user }` or `{ success, data: { token, refreshToken, user } }`.
 */
export function normalizeAuthResponse(data: unknown): AuthResponse {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid auth response");
  }
  const root = data as Record<string, unknown>;

  const inner =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;

  const token = inner.token;
  const user = inner.user;
  if (typeof token !== "string" || !user || typeof user !== "object") {
    throw new Error("Invalid auth response: missing token or user");
  }

  return {
    token,
    refreshToken:
      typeof inner.refreshToken === "string" ? inner.refreshToken : undefined,
    user: user as AuthUserPayload,
  };
}

export const authApi = {
  login: async (data: LoginPayload) => {
    const res = await api.post<unknown>("/auth/login", data);
    return normalizeAuthResponse(res.data);
  },
  register: async (data: RegisterPayload) => {
    const res = await api.post<unknown>("/auth/register", data);
    return normalizeAuthResponse(res.data);
  },
  /** Exchange refresh token for a new access token (after JWT expires). */
  refresh: async (refreshToken: string) => {
    const res = await api.post<unknown>("/auth/refresh", { refreshToken });
    return normalizeAuthResponse(res.data);
  },
  /**
   * Backend returns `{ url }` for Google OAuth start (optional pattern).
   * If you only use full-page redirect, use `getGoogleOAuthStartUrl()` instead.
   */
  getGoogleOAuthUrl: () => api.get<{ url: string }>("/auth/google/url"),
};

/**
 * Browser redirect URL to start Google sign-in.
 * Default path `/auth/google` — override with `NEXT_PUBLIC_GOOGLE_AUTH_PATH` if your API differs.
 */
export function getGoogleOAuthStartUrl(): string {
  const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
  if (!base) return "";
  const path = process.env.NEXT_PUBLIC_GOOGLE_AUTH_PATH ?? "/auth/google";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

// ─── Response envelope (backend: { success?, data: T }) ───────────────────────

/**
 * Many endpoints return `{ success: true, data: ... }`. Unwraps one level.
 * If `raw` is already the inner payload (no `data` key), returns as-is.
 */
export function unwrapApiData<T>(raw: unknown): T {
  if (raw !== null && typeof raw === "object" && "data" in raw) {
    return (raw as { data: T }).data;
  }
  return raw as T;
}

/** Billing balance shape (declared early for normalizers). */
export interface BillingBalance {
  credits: number;
  plan: string;
  renewsAt?: string;
  totalUsed?: number;
}

export type PostStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "FAILED";

export interface Post {
  id: string;
  caption: string;
  hashtags: string[];
  platform: string;
  scheduledAt?: string;
  publishedAt?: string;
  status: PostStatus;
  imageUrl?: string;
  createdAt: string;
}

function normalizeBillingBalancePayload(b: unknown): BillingBalance {
  const x = b && typeof b === "object" ? (b as Record<string, unknown>) : {};
  const creditsRaw = x.credits;
  const credits =
    typeof creditsRaw === "number"
      ? creditsRaw
      : typeof creditsRaw === "string"
        ? Number(creditsRaw) || 0
        : 0;
  return {
    credits,
    plan: typeof x.plan === "string" ? x.plan : "Free",
    renewsAt: typeof x.renewsAt === "string" ? x.renewsAt : undefined,
    totalUsed:
      typeof x.totalUsed === "number"
        ? x.totalUsed
        : typeof x.totalUsed === "string"
          ? Number(x.totalUsed) || undefined
          : undefined,
  };
}

/** GET /posts and calendar may return `{ posts: Post[] }` inside `data`. */
export function normalizePostsPayload(raw: unknown): Post[] {
  const once = unwrapApiData<unknown>(raw);
  if (Array.isArray(once)) return once as Post[];
  if (once && typeof once === "object") {
    const o = once as Record<string, unknown>;
    if (Array.isArray(o.posts)) return o.posts as Post[];
    if (Array.isArray(o.items)) return o.items as Post[];
  }
  return [];
}

// ─── Workspace ───────────────────────────────────────────────────────────────

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  industry?: string;
  website?: string;
  description?: string;
  logoUrl?: string;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

function normalizeMembersPayload(raw: unknown): WorkspaceMember[] {
  const once = unwrapApiData<unknown>(raw);
  if (Array.isArray(once)) return once;
  if (once && typeof once === "object") {
    const o = once as Record<string, unknown>;
    if (Array.isArray(o.members)) return o.members as WorkspaceMember[];
  }
  return [];
}

export const workspaceApi = {
  get: async () => {
    const res = await api.get<unknown>("/workspace");
    return unwrapApiData<Workspace>(res.data) as Workspace;
  },
  update: async (data: Partial<Workspace>) => {
    const res = await api.patch<unknown>("/workspace", data);
    return unwrapApiData<Workspace>(res.data) as Workspace;
  },
  getMembers: async () => {
    const res = await api.get<unknown>("/workspace/members");
    return normalizeMembersPayload(res.data);
  },
  inviteMember: (email: string) =>
    api.post("/workspace/members/invite", { email }),
};

// ─── Billing ─────────────────────────────────────────────────────────────────

export interface PaymentResponse {
  conversationId: string;
  checkoutFormContent: string;
  creditAmount: number;
}

/** Body for POST /billing/payment (iyzico checkout). */
export interface CreatePaymentPayload {
  creditAmount: number;
  price: number;
  currency?: string;
  callbackUrl: string;
  buyerName: string;
  buyerSurname: string;
  buyerEmail: string;
  buyerIp: string;
  buyerCity: string;
  buyerCountry: string;
  buyerAddress: string;
  buyerZip: string;
  buyerPhone: string;
  buyerIdentityNumber: string;
}

export const billingApi = {
  getBalance: async () => {
    const res = await api.get<unknown>("/billing/balance");
    const inner = unwrapApiData<unknown>(res.data);
    return normalizeBillingBalancePayload(inner);
  },
  createPayment: async (payload: CreatePaymentPayload) => {
    const res = await api.post<unknown>("/billing/payment", payload);
    const inner = unwrapApiData<unknown>(res.data);
    return inner as PaymentResponse;
  },
};

// ─── AI Generation ───────────────────────────────────────────────────────────

export type AiGenerationMode =
  | "text-to-image"
  | "image-to-image"
  | "image-to-video";

export type ModelTier = "fast" | "standard" | "premium";

export type AiAspectRatio = "portrait" | "landscape" | "square" | "custom";

export type OutputFormat = "png" | "jpeg" | "webp";

export type AiPlatform = "instagram" | "tiktok" | "general";

export type AiTone = "professional" | "casual" | "humorous" | "inspirational";

export interface GeneratePayload {
  mode: AiGenerationMode;
  modelTier?: ModelTier;
  /** Tam fal.ai model yolu; backend destekliyorsa bu alan önceliklidir. */
  modelId?: string;
  prompt: string;
  enhancePrompt?: boolean;
  aspectRatio?: AiAspectRatio;
  customWidth?: number;
  customHeight?: number;
  outputFormat?: OutputFormat;
  imageUrls?: string[];
  duration?: 5 | 10;
  platform?: AiPlatform;
  tone?: AiTone;
}

export interface GenerateResponse {
  jobId: string;
  status: "queued";
  creditsCost: number;
  modelId: string;
}

export type JobStatus = "queued" | "processing" | "completed" | "failed";

export interface Job {
  id: string;
  status: JobStatus;
  progress?: number;
  result?: {
    url: string;
    assetId: string;
  };
  failedReason?: string;
  error?: string;
}

export interface PresetPromptsResponse {
  presets: Record<string, unknown>;
}

export const aiApi = {
  generate: async (data: GeneratePayload) => {
    const res = await api.post<unknown>("/ai/generate", data);
    return unwrapApiData<GenerateResponse>(res.data) as GenerateResponse;
  },
  getJob: async (jobId: string) => {
    const res = await api.get<unknown>(`/jobs/${jobId}`);
    return unwrapApiData<Job>(res.data) as Job;
  },
  getPresetPrompts: async () => {
    const res = await api.get<unknown>("/ai/preset-prompts");
    return unwrapApiData<PresetPromptsResponse>(
      res.data,
    ) as PresetPromptsResponse;
  },
  enhancePrompt: async (prompt: string, mode: AiGenerationMode) => {
    const res = await api.post<unknown>("/ai/enhance-prompt", { prompt, mode });
    return unwrapApiData<{ enhancedPrompt: string }>(res.data) as {
      enhancedPrompt: string;
    };
  },
};

// ─── Product AI Generation ────────────────────────────────────────────────────

export interface ModelPhotoOptions {
  genders: string[];
  ethnicities: string[];
  ageRanges: string[];
  skinColors: string[];
  faceTypes: string[];
  eyeColors: string[];
  expressions: string[];
  hairColors: string[];
  hairstyles: string[];
  bodySizes: string[];
  shotTypes: string[];
  resolutions: string[];
  resolutionCredits: Record<string, number>;
}

export interface ModelDetails {
  gender?: string;
  ethnicity?: string;
  age?: string;
  skinColor?: string;
  faceType?: string;
  eyeColor?: string;
  expression?: string;
}

export interface ModelCustomization {
  bodySize?: string;
  height?: number;
  hairColor?: string;
  hairstyle?: string;
  shotType?: string;
}

export type ProductStyleMode = "with-model" | "product-only";
export type ProductResolution = "1K" | "2K";
export type GhostMannequinQuality = "standard" | "premium";
export type VideoPlatform = "instagram" | "tiktok" | "general";

export interface ModelPhotoPayload {
  productImageUrls: string[];
  styleMode: ProductStyleMode;
  modelDetails?: ModelDetails;
  customization?: ModelCustomization;
  shotType?: string;
  resolution?: ProductResolution;
  modelTier?: ModelTier;
  outputFormat?: OutputFormat;
  customPrompt?: string;
}

export interface ProductAnglesPayload {
  productImageUrl: string;
  count: 1 | 2 | 3;
  resolution?: ProductResolution;
  modelTier?: ModelTier;
  outputFormat?: OutputFormat;
  customPrompt?: string;
}

export interface ProductReferencePayload {
  productImageUrl: string;
  referenceImageUrl: string;
  styleMode: "minimal" | "bold";
  resolution?: ProductResolution;
  modelTier?: ModelTier;
  outputFormat?: OutputFormat;
  customPrompt?: string;
}

export interface ProductSwapPayload {
  productImageUrl: string;
  sceneImageUrl: string;
  resolution?: ProductResolution;
  modelTier?: ModelTier;
  outputFormat?: OutputFormat;
  customPrompt?: string;
}

export interface GhostMannequinPayload {
  productImageUrl: string;
  quality?: GhostMannequinQuality;
  backgroundColor?: string;
  outputFormat?: OutputFormat;
  customPrompt?: string;
}

export interface PhotoToVideoPayload {
  imageUrl: string;
  platform?: VideoPlatform;
  duration?: 5 | 10;
  modelTier?: ModelTier;
  customPrompt?: string;
}

export interface SingleProductJobResponse {
  jobId: string;
  status: "queued";
  creditsCost: number;
  modelId: string;
}

export interface MultiProductJobResponse {
  jobIds: string[];
  status: "queued";
  totalCredits: number;
  modelId: string;
}

export const productApi = {
  getModelPhotoOptions: async (): Promise<ModelPhotoOptions> => {
    const res = await api.get<unknown>("/ai/model-photo/options");
    const inner = unwrapApiData<{ options: ModelPhotoOptions }>(res.data);
    return inner.options;
  },
  generateModelPhoto: async (
    data: ModelPhotoPayload,
  ): Promise<SingleProductJobResponse> => {
    const res = await api.post<unknown>("/ai/model-photo", data);
    return unwrapApiData<SingleProductJobResponse>(
      res.data,
    ) as SingleProductJobResponse;
  },
  generateProductAngles: async (
    data: ProductAnglesPayload,
  ): Promise<MultiProductJobResponse> => {
    const res = await api.post<unknown>("/ai/product-angles", data);
    return unwrapApiData<MultiProductJobResponse>(
      res.data,
    ) as MultiProductJobResponse;
  },
  generateProductReference: async (
    data: ProductReferencePayload,
  ): Promise<SingleProductJobResponse> => {
    const res = await api.post<unknown>("/ai/product-reference", data);
    return unwrapApiData<SingleProductJobResponse>(
      res.data,
    ) as SingleProductJobResponse;
  },
  generateProductSwap: async (
    data: ProductSwapPayload,
  ): Promise<SingleProductJobResponse> => {
    const res = await api.post<unknown>("/ai/product-swap", data);
    return unwrapApiData<SingleProductJobResponse>(
      res.data,
    ) as SingleProductJobResponse;
  },
  generateGhostMannequin: async (
    data: GhostMannequinPayload,
  ): Promise<SingleProductJobResponse> => {
    const res = await api.post<unknown>("/ai/ghost-mannequin", data);
    return unwrapApiData<SingleProductJobResponse>(
      res.data,
    ) as SingleProductJobResponse;
  },
  generatePhotoToVideo: async (
    data: PhotoToVideoPayload,
  ): Promise<SingleProductJobResponse> => {
    const res = await api.post<unknown>("/ai/photo-to-video", data);
    return unwrapApiData<SingleProductJobResponse>(
      res.data,
    ) as SingleProductJobResponse;
  },
};

// ─── Posts ────────────────────────────────────────────────────────────────────

export type SchedulePlatform = "INSTAGRAM" | "TIKTOK";

export interface SchedulePayload {
  assetId: string;
  platform: SchedulePlatform;
  caption: string;
  hashtags: string[];
  scheduledAt: string;
}

export const postsApi = {
  list: async () => {
    const res = await api.get<unknown>("/posts");
    return normalizePostsPayload(res.data);
  },
  delete: (id: string) => api.delete(`/posts/${id}`),
  schedule: async (data: SchedulePayload) => {
    const res = await api.post<unknown>("/posts/schedule", data);
    return unwrapApiData<Post>(res.data) as Post;
  },
  calendar: async (from: string, to: string) => {
    const res = await api.get<unknown>(
      `/posts/calendar?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    );
    return normalizePostsPayload(res.data);
  },
};

// ─── Social Connections ───────────────────────────────────────────────────────

export interface SocialConnection {
  platform: string;
  connected: boolean;
  username?: string;
  connectedAt?: string;
}

export interface OAuthRedirect {
  url: string;
}

function normalizeConnectionsPayload(raw: unknown): SocialConnection[] {
  const once = unwrapApiData<unknown>(raw);
  if (Array.isArray(once)) return once;
  if (once && typeof once === "object") {
    const o = once as Record<string, unknown>;
    if (Array.isArray(o.connections))
      return o.connections as SocialConnection[];
  }
  return [];
}

export const socialApi = {
  getConnections: async () => {
    const res = await api.get<unknown>("/social/connections");
    return normalizeConnectionsPayload(res.data);
  },
  getConnectUrl: async (platform: string) => {
    const res = await api.get<unknown>(`/social/connect/${platform}`);
    return unwrapApiData<OAuthRedirect>(res.data) as OAuthRedirect;
  },
};

// ─── Assets ───────────────────────────────────────────────────────────────────

export interface Asset {
  id: string;
  url: string;
  type: "image" | "video";
  platform?: string;
  caption?: string;
  createdAt?: string;
}

export interface AssetsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AssetsResponse {
  assets: Asset[];
  pagination: AssetsPagination;
}

export const assetsApi = {
  list: async (page = 1, limit = 20) => {
    const res = await api.get<unknown>(`/assets?page=${page}&limit=${limit}`);
    const data = unwrapApiData<AssetsResponse>(res.data);
    return data as AssetsResponse;
  },
};

// ─── Health ───────────────────────────────────────────────────────────────────

export interface HealthStatus {
  status: "ok" | "degraded" | "down";
  version?: string;
}

export const healthApi = {
  check: async () => {
    const res = await api.get<unknown>("/health");
    return unwrapApiData<HealthStatus>(res.data) as HealthStatus;
  },
};
