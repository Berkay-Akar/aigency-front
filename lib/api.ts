import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {
  getActiveToken,
  removeToken,
  getActiveBrandId,
  getBrandSessions,
  addOrUpdateBrandSession,
  setToken,
} from "./auth";

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
    const token = getActiveToken();
    if (token && config.headers && !skipAuth) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// 401 handler — try per-brand refresh first; redirect to /login only on failure
let _isRefreshing = false;
let _pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(token: string | null, err: unknown) {
  _pendingQueue.forEach((p) => (token ? p.resolve(token) : p.reject(err)));
  _pendingQueue = [];
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Prevent infinite loop on refresh endpoint itself
    const isRefreshEndpoint = /\/auth\/refresh/.test(originalRequest.url ?? "");
    if (isRefreshEndpoint) {
      removeToken();
      if (typeof window !== "undefined") window.location.href = "/login";
      return Promise.reject(error);
    }

    const activeId = getActiveBrandId();
    const session = activeId
      ? getBrandSessions().find((s) => s.workspaceId === activeId)
      : null;
    const refreshToken = session?.refreshToken;

    if (!refreshToken) {
      removeToken();
      if (typeof window !== "undefined") window.location.href = "/login";
      return Promise.reject(error);
    }

    if (_isRefreshing) {
      return new Promise((resolve, reject) => {
        _pendingQueue.push({
          resolve: (newToken) => {
            if (originalRequest.headers)
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    _isRefreshing = true;
    originalRequest._retry = true;

    try {
      const res = await api.post<unknown>("/auth/refresh", { refreshToken });
      const { token: newToken, refreshToken: newRefresh } = (
        res.data as Record<string, unknown>
      ).data
        ? (res.data as { data: { token: string; refreshToken?: string } }).data
        : (res.data as { token: string; refreshToken?: string });

      setToken(newToken);
      if (session) {
        addOrUpdateBrandSession({
          ...session,
          token: newToken,
          refreshToken: newRefresh ?? session.refreshToken,
        });
      }
      if (originalRequest.headers)
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      processQueue(newToken, null);
      return api(originalRequest);
    } catch (refreshErr) {
      processQueue(null, refreshErr);
      removeToken();
      if (typeof window !== "undefined") window.location.href = "/login";
      return Promise.reject(refreshErr);
    } finally {
      _isRefreshing = false;
    }
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

// ─── Roles & Permissions ──────────────────────────────────────────────────────

export const PERMISSIONS = [
  "MANAGE_MEMBERS",
  "MANAGE_ROLES",
  "MANAGE_BRAND_KIT",
  "MANAGE_SOCIAL",
  "MANAGE_POSTS",
  "RUN_AI_GENERATION",
  "CREATE_TASKS",
  "ASSIGN_TASKS",
  "MANAGE_TASKS",
  "VIEW_ALL_TASKS",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export interface CustomRole {
  id: string;
  workspaceId: string;
  name: string;
  color: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export const rolesApi = {
  list: async (): Promise<CustomRole[]> => {
    const res = await api.get<unknown>("/workspace/roles");
    const data = unwrapApiData<{ roles: CustomRole[] }>(res.data);
    return data?.roles ?? [];
  },
  create: async (payload: {
    name: string;
    color?: string;
    permissions: Permission[];
  }): Promise<CustomRole> => {
    const res = await api.post<unknown>("/workspace/roles", payload);
    return unwrapApiData<CustomRole>(res.data) as CustomRole;
  },
  update: async (
    id: string,
    payload: { name?: string; color?: string; permissions?: Permission[] },
  ): Promise<CustomRole> => {
    const res = await api.patch<unknown>(`/workspace/roles/${id}`, payload);
    return unwrapApiData<CustomRole>(res.data) as CustomRole;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/workspace/roles/${id}`);
  },
  assignToMember: async (
    memberId: string,
    customRoleId: string | null,
  ): Promise<WorkspaceMember> => {
    const res = await api.patch<unknown>(
      `/workspace/members/${memberId}/role`,
      { customRoleId },
    );
    const data = unwrapApiData<{ member: WorkspaceMember }>(res.data);
    return data.member;
  },
};

// ─── Tasks ────────────────────────────────────────────────────────────────────

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE"
  | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface TaskMember {
  id: string;
  role: string;
  user: { id: string; name: string; email: string };
}

export interface Task {
  id: string;
  workspaceId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: TaskMember;
  assignedTo?: TaskMember | null;
  _count?: { notes: number };
}

export interface TaskNote {
  id: string;
  taskId: string;
  memberId: string;
  content: string;
  editedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  member: TaskMember;
}

export interface TasksListResponse {
  tasks: Task[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export interface TaskNotesListResponse {
  notes: TaskNote[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

function normalizeTasksPayload(raw: unknown): TasksListResponse {
  const data = unwrapApiData<unknown>(raw);
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.tasks)) {
      return {
        tasks: o.tasks as Task[],
        pagination: (o.pagination as TasksListResponse["pagination"]) ?? {
          page: 1,
          limit: 20,
          total: 0,
          pages: 1,
        },
      };
    }
  }
  return { tasks: [], pagination: { page: 1, limit: 20, total: 0, pages: 1 } };
}

export const tasksApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    status?: TaskStatus;
  }): Promise<TasksListResponse> => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.status) qs.set("status", params.status);
    const res = await api.get<unknown>(
      `/tasks${qs.toString() ? `?${qs}` : ""}`,
    );
    return normalizeTasksPayload(res.data);
  },
  get: async (id: string): Promise<Task> => {
    const res = await api.get<unknown>(`/tasks/${id}`);
    return unwrapApiData<Task>(res.data) as Task;
  },
  create: async (payload: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: string;
    assignedToMemberId?: string;
  }): Promise<Task> => {
    const res = await api.post<unknown>("/tasks", payload);
    return unwrapApiData<Task>(res.data) as Task;
  },
  update: async (
    id: string,
    payload: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: string | null;
    },
  ): Promise<Task> => {
    const res = await api.patch<unknown>(`/tasks/${id}`, payload);
    return unwrapApiData<Task>(res.data) as Task;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
  assign: async (
    id: string,
    assignedToMemberId: string | null,
  ): Promise<Task> => {
    const res = await api.patch<unknown>(`/tasks/${id}/assign`, {
      assignedToMemberId,
    });
    return unwrapApiData<Task>(res.data) as Task;
  },
};

export const taskNotesApi = {
  list: async (
    taskId: string,
    params?: { page?: number; limit?: number },
  ): Promise<TaskNotesListResponse> => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    const res = await api.get<unknown>(
      `/tasks/${taskId}/notes${qs.toString() ? `?${qs}` : ""}`,
    );
    const data = unwrapApiData<{
      notes: TaskNote[];
      pagination: TaskNotesListResponse["pagination"];
    }>(res.data);
    return {
      notes: data?.notes ?? [],
      pagination: data?.pagination ?? {
        page: 1,
        limit: 50,
        total: 0,
        pages: 1,
      },
    };
  },
  create: async (taskId: string, content: string): Promise<TaskNote> => {
    const res = await api.post<unknown>(`/tasks/${taskId}/notes`, { content });
    return unwrapApiData<TaskNote>(res.data) as TaskNote;
  },
  update: async (
    taskId: string,
    noteId: string,
    content: string,
  ): Promise<TaskNote> => {
    const res = await api.patch<unknown>(`/tasks/${taskId}/notes/${noteId}`, {
      content,
    });
    return unwrapApiData<TaskNote>(res.data) as TaskNote;
  },
  delete: async (taskId: string, noteId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}/notes/${noteId}`);
  },
};

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_STATUS_UPDATED"
  | "TASK_COMMENTED"
  | "MEMBER_INVITED"
  | "MEMBER_JOINED";

export interface AppNotification {
  id: string;
  userId: string;
  workspaceId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: { taskId?: string } & Record<string, unknown>;
  isRead: boolean;
  readAt?: string | null;
  taskId?: string | null;
  createdAt: string;
}

export interface NotificationsListResponse {
  notifications: AppNotification[];
  unreadCount: number;
  pagination: { page: number; limit: number; total: number; pages: number };
}

export const notificationsApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<NotificationsListResponse> => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.unreadOnly) qs.set("unreadOnly", "true");
    const res = await api.get<unknown>(
      `/notifications${qs.toString() ? `?${qs}` : ""}`,
    );
    const data = unwrapApiData<NotificationsListResponse>(res.data);
    return data as NotificationsListResponse;
  },
  markRead: async (id: string): Promise<AppNotification> => {
    const res = await api.patch<unknown>(`/notifications/${id}/read`);
    return unwrapApiData<AppNotification>(res.data) as AppNotification;
  },
  markAllRead: async (): Promise<void> => {
    await api.patch("/notifications/read-all");
  },
  registerDeviceToken: async (
    token: string,
    platform: "ios" | "android" | "web",
  ): Promise<void> => {
    await api.post("/notifications/device-token", { token, platform });
  },
  removeDeviceToken: async (token: string): Promise<void> => {
    await api.delete("/notifications/device-token", { data: { token } });
  },
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

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  customRoleId?: string | null;
  customRole?: Pick<CustomRole, "id" | "name" | "color" | "permissions"> | null;
  // Backend may return nested user object; normalized at client boundary
  user?: { name?: string; email?: string };
}

/** Flatten { user: { name, email } } into top-level name/email fields. */
function normalizeSingleMember(raw: unknown): WorkspaceMember {
  const m = raw as Record<string, unknown>;
  const nested = m.user as { name?: string; email?: string } | undefined;
  return {
    ...(raw as unknown as WorkspaceMember),
    name: ((nested?.name ?? m.name ?? "") as string) || "",
    email: ((nested?.email ?? m.email ?? "") as string) || "",
  };
}

function normalizeMembersPayload(raw: unknown): WorkspaceMember[] {
  const once = unwrapApiData<unknown>(raw);
  if (Array.isArray(once)) return once.map(normalizeSingleMember);
  if (once && typeof once === "object") {
    const o = once as Record<string, unknown>;
    if (Array.isArray(o.members))
      return (o.members as unknown[]).map(normalizeSingleMember);
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
  inviteMember: (email: string, customRoleId?: string | null) =>
    api.post("/workspace/members/invite", {
      email,
      ...(customRoleId ? { customRoleId } : {}),
    }),
};

// ─── Brands (Multi-workspace) ─────────────────────────────────────────────────

export interface Brand {
  workspaceId: string;
  name: string;
  slug: string;
  role: string;
  joinedAt: string;
}

export interface CreateBrandResponse {
  brand: Brand;
  token: string;
}

export const brandsApi = {
  list: async (): Promise<Brand[]> => {
    const res = await api.get<unknown>("/brands");
    const data = unwrapApiData<unknown>(res.data);
    if (Array.isArray(data)) return data as Brand[];
    return [];
  },
  create: async (name: string): Promise<CreateBrandResponse> => {
    const res = await api.post<unknown>("/brands", { name });
    return unwrapApiData<CreateBrandResponse>(res.data) as CreateBrandResponse;
  },
};

// ─── Brand Kit ────────────────────────────────────────────────────────────────

export type BrandKitTone =
  | "PROFESSIONAL"
  | "LUXURY"
  | "CASUAL"
  | "BOLD"
  | "MINIMALIST"
  | "PLAYFUL";

export interface BrandKit {
  id: string;
  workspaceId: string;
  brandName: string | null;
  tagline: string | null;
  industry: string | null;
  website: string | null;
  description: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  tone: BrandKitTone | null;
  createdAt: string;
  updatedAt: string;
}

export interface BrandKitUpdatePayload {
  brandName?: string;
  tagline?: string;
  industry?: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  tone?: BrandKitTone;
}

export interface LogoUploadResponse {
  logoUrl: string;
  brandKit: BrandKit;
}

export const brandKitApi = {
  get: async (): Promise<BrandKit | null> => {
    const res = await api.get<unknown>("/brand-kit");
    const data = unwrapApiData<{ brandKit: BrandKit } | null>(res.data);
    return data?.brandKit ?? null;
  },
  update: async (payload: BrandKitUpdatePayload): Promise<BrandKit> => {
    const res = await api.patch<unknown>("/brand-kit", payload);
    const data = unwrapApiData<{ brandKit: BrandKit }>(res.data);
    return data.brandKit;
  },
  uploadLogo: async (file: File): Promise<LogoUploadResponse> => {
    const form = new FormData();
    form.append("logo", file);
    const res = await api.post<unknown>("/brand-kit/logo", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapApiData<LogoUploadResponse>(res.data) as LogoUploadResponse;
  },
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
  | "image-to-video"
  | "seedream-model-dressing"
  | "seedream-product-scene"
  | "upscale";

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
  useBrandKit?: boolean;
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
  generation?: {
    status?: string;
    resultUrl?: string;
  };
}

export interface PresetPromptsResponse {
  presets: Record<string, unknown>;
}

// ─── Seedream Multi-Image Edit + Upscale ──────────────────────────────────────

export interface SeedreamImageSlot {
  key: string;
  label: string;
  required: boolean;
}

export interface SeedreamPreset {
  id: string;
  title: string;
  useCase: string;
  imageSlots: SeedreamImageSlot[];
  backgroundOptions?: string[];
}

export interface SeedreamPresetsResponse {
  presets: SeedreamPreset[];
}

export interface AssetUploadResponse {
  url: string;
  storageKey: string;
}

export interface SeedreamEditPayload {
  useCase: "model-dressing" | "product-scene";
  imageUrls: string[];
  backgroundPrompt?: string;
  outputFormat?: "png" | "jpeg" | "webp";
}

export interface UpscaleImagePayload {
  imageUrl: string;
}

export interface UpscaleVideoPayload {
  videoUrl: string;
}

export interface AsyncJobStartResponse {
  jobId: string;
  status: string;
  creditsCost: number;
  modelId: string;
}

// ─── Creative AI Generation ────────────────────────────────────────────────────

export const aiApi = {
  generate: async (data: GeneratePayload) => {
    const res = await api.post<unknown>("/ai/generate", data);
    return unwrapApiData<GenerateResponse>(res.data) as GenerateResponse;
  },
  getJob: async (jobId: string) => {
    const res = await api.get<unknown>(`/jobs/${jobId}`);
    const job = unwrapApiData<Job>(res.data) as Job;
    // Backend may return status in uppercase (e.g. "FAILED", "COMPLETED").
    // Normalize to lowercase and fall back to the nested generation.status.
    const rawStatus = (
      job.status ??
      job.generation?.status ??
      ""
    ).toLowerCase();
    job.status = (rawStatus || "queued") as JobStatus;
    return job;
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
  getSeedreamPresets: async () => {
    const res = await api.get<unknown>("/ai/seedream-presets");
    return unwrapApiData<SeedreamPresetsResponse>(
      res.data,
    ) as SeedreamPresetsResponse;
  },
  seedreamEdit: async (data: SeedreamEditPayload) => {
    const res = await api.post<unknown>("/ai/seedream-edit", data);
    return unwrapApiData<AsyncJobStartResponse>(
      res.data,
    ) as AsyncJobStartResponse;
  },
  upscaleImage: async (data: UpscaleImagePayload) => {
    const res = await api.post<unknown>("/ai/upscale/image", data);
    return unwrapApiData<AsyncJobStartResponse>(
      res.data,
    ) as AsyncJobStartResponse;
  },
  upscaleVideo: async (data: UpscaleVideoPayload) => {
    const res = await api.post<unknown>("/ai/upscale/video", data);
    return unwrapApiData<AsyncJobStartResponse>(
      res.data,
    ) as AsyncJobStartResponse;
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
  useBrandKit?: boolean;
}

export interface ProductAnglesPayload {
  productImageUrl: string;
  count: 1 | 2 | 3;
  resolution?: ProductResolution;
  modelTier?: ModelTier;
  outputFormat?: OutputFormat;
  customPrompt?: string;
  useBrandKit?: boolean;
}

export interface ProductReferencePayload {
  productImageUrl: string;
  referenceImageUrl: string;
  styleMode: "minimal" | "bold";
  resolution?: ProductResolution;
  modelTier?: ModelTier;
  outputFormat?: OutputFormat;
  customPrompt?: string;
  useBrandKit?: boolean;
}

export interface ProductSwapPayload {
  productImageUrl: string;
  sceneImageUrl: string;
  resolution?: ProductResolution;
  modelTier?: ModelTier;
  outputFormat?: OutputFormat;
  customPrompt?: string;
  useBrandKit?: boolean;
}

export interface GhostMannequinPayload {
  productImageUrl: string;
  quality?: GhostMannequinQuality;
  backgroundColor?: string;
  outputFormat?: OutputFormat;
  customPrompt?: string;
  useBrandKit?: boolean;
}

export interface PhotoToVideoPayload {
  imageUrl: string;
  platform?: VideoPlatform;
  duration?: 5 | 10;
  modelTier?: ModelTier;
  customPrompt?: string;
  useBrandKit?: boolean;
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

export interface GenerationJob {
  id: string;
  mode: string;
  jobType: string;
  modelTier: string;
  modelId: string;
  falModelId: string | null;
  prompt: string | null;
  promptFinal?: string | null;
  enhancePrompt: boolean;
  aspectRatio: string | null;
  customWidth: number | null;
  customHeight: number | null;
  outputFormat: string | null;
  imageUrls?: string[];
  duration: number | null;
  platform: string | null;
  tone: string | null;
  modelDetails: unknown | null;
  customization: Record<string, unknown> | null;
  creditsCost: number;
  status: string;
}

export interface Asset {
  id: string;
  url: string;
  type: "image" | "video";
  platform?: string;
  caption?: string;
  createdAt?: string;
  generationJob?: GenerationJob;
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
  upload: async (file: File): Promise<AssetUploadResponse> => {
    const form = new FormData();
    form.append("file", file);
    const res = await api.post<unknown>("/assets/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapApiData<AssetUploadResponse>(res.data) as AssetUploadResponse;
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
