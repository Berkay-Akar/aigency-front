const TOKEN_KEY = "aigencys_token";
const REFRESH_KEY = "aigencys_refresh_token";
const USER_KEY = "aigencys_user";
const BRAND_SESSIONS_KEY = "brand-sessions";
const ACTIVE_WORKSPACE_KEY = "active-workspace-id";

export interface BrandSession {
  workspaceId: string;
  name: string;
  token: string;
  refreshToken?: string;
}

export function getBrandSessions(): BrandSession[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(BRAND_SESSIONS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function setBrandSessions(sessions: BrandSession[]): void {
  localStorage.setItem(BRAND_SESSIONS_KEY, JSON.stringify(sessions));
}

export function addOrUpdateBrandSession(session: BrandSession): void {
  const sessions = getBrandSessions();
  const idx = sessions.findIndex((s) => s.workspaceId === session.workspaceId);
  if (idx >= 0) {
    sessions[idx] = session;
  } else {
    sessions.push(session);
  }
  setBrandSessions(sessions);
}

export function clearBrandSessions(): void {
  localStorage.removeItem(BRAND_SESSIONS_KEY);
  localStorage.removeItem(ACTIVE_WORKSPACE_KEY);
}

export function getActiveBrandId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_WORKSPACE_KEY);
}

export function setActiveBrandId(id: string): void {
  localStorage.setItem(ACTIVE_WORKSPACE_KEY, id);
}

/** Returns the active brand's token, falling back to the legacy single token. */
export function getActiveToken(): string | null {
  const activeId = getActiveBrandId();
  if (activeId) {
    const session = getBrandSessions().find((s) => s.workspaceId === activeId);
    if (session?.token) return session.token;
  }
  return getToken();
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_KEY, token);
}

export function removeRefreshToken(): void {
  localStorage.removeItem(REFRESH_KEY);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  clearBrandSessions();
}

export function getStoredUser(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: Record<string, unknown>): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
