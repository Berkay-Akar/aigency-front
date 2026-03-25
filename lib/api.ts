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
  (error: AxiosError) => Promise.reject(error)
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
  }
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
  getGoogleOAuthUrl: () =>
    api.get<{ url: string }>("/auth/google/url"),
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
  const x =
    b && typeof b === "object" ? (b as Record<string, unknown>) : {};
  const creditsRaw = x.credits;
  const credits =
    typeof creditsRaw === "number"
      ? creditsRaw
      : typeof creditsRaw === "string"
        ? Number(creditsRaw) || 0
        : 0;
  return {
    credits,
    plan: typeof x.plan === "string" ? x.plan : "—",
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
  checkoutFormContent: string;
}

export const billingApi = {
  getBalance: async () => {
    const res = await api.get<unknown>("/billing/balance");
    const inner = unwrapApiData<unknown>(res.data);
    return normalizeBillingBalancePayload(inner);
  },
  createPayment: async (packageId: string) => {
    const res = await api.post<unknown>("/billing/payment", { packageId });
    const inner = unwrapApiData<unknown>(res.data);
    return inner as PaymentResponse;
  },
};

// ─── AI Generation ───────────────────────────────────────────────────────────

export interface GeneratePayload {
  type: string;
  prompt?: string;
  platform?: string;
  tone?: string;
  options?: Record<string, unknown>;
}

export interface GenerateResponse {
  jobId: string;
  status: "queued";
}

export type JobStatus = "queued" | "processing" | "completed" | "failed";

export interface Job {
  id: string;
  status: JobStatus;
  progress?: number;
  result?: {
    images: string[];
    caption?: string;
    hashtags?: string[];
  };
  error?: string;
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
};

// ─── Posts ────────────────────────────────────────────────────────────────────

export interface SchedulePayload {
  caption: string;
  hashtags: string[];
  platform: string;
  scheduledAt: string;
  imageUrl?: string;
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
      `/posts/calendar?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
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
    if (Array.isArray(o.connections)) return o.connections as SocialConnection[];
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
