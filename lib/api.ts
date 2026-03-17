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

// Attach JWT on every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
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

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const authApi = {
  login: (data: LoginPayload) =>
    api.post<AuthResponse>("/auth/login", data),
  register: (data: RegisterPayload) =>
    api.post<AuthResponse>("/auth/register", data),
};

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

export const workspaceApi = {
  get: () => api.get<Workspace>("/workspace"),
  update: (data: Partial<Workspace>) => api.patch<Workspace>("/workspace", data),
  getMembers: () => api.get<WorkspaceMember[]>("/workspace/members"),
  inviteMember: (email: string) =>
    api.post("/workspace/members/invite", { email }),
};

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

// ─── Billing ─────────────────────────────────────────────────────────────────

export interface BillingBalance {
  credits: number;
  plan: string;
  renewsAt?: string;
  totalUsed?: number;
}

export interface PaymentResponse {
  checkoutFormContent: string;
}

export const billingApi = {
  getBalance: () => api.get<BillingBalance>("/billing/balance"),
  createPayment: (packageId: string) =>
    api.post<PaymentResponse>("/billing/payment", { packageId }),
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
  generate: (data: GeneratePayload) =>
    api.post<GenerateResponse>("/ai/generate", data),
  getJob: (jobId: string) => api.get<Job>(`/jobs/${jobId}`),
};

// ─── Posts ────────────────────────────────────────────────────────────────────

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

export interface SchedulePayload {
  caption: string;
  hashtags: string[];
  platform: string;
  scheduledAt: string;
  imageUrl?: string;
}

export const postsApi = {
  list: () => api.get<Post[]>("/posts"),
  delete: (id: string) => api.delete(`/posts/${id}`),
  schedule: (data: SchedulePayload) => api.post<Post>("/posts/schedule", data),
  calendar: (from: string, to: string) =>
    api.get<Post[]>(`/posts/calendar?from=${from}&to=${to}`),
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

export const socialApi = {
  getConnections: () =>
    api.get<SocialConnection[]>("/social/connections"),
  getConnectUrl: (platform: string) =>
    api.get<OAuthRedirect>(`/social/connect/${platform}`),
};

// ─── Health ───────────────────────────────────────────────────────────────────

export interface HealthStatus {
  status: "ok" | "degraded" | "down";
  version?: string;
}

export const healthApi = {
  check: () => api.get<HealthStatus>("/health"),
};
