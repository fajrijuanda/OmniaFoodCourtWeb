import { getStoredAccessToken, getStoredActiveBranchId, getStoredActiveTenantId, getStoredBranchScope } from "@/lib/mobile/session";
import { OfflineQueue } from "@/lib/mobile/offlineQueue";
import { cacheApiResponse, getCachedApiResponse } from "@/lib/mobile/apiCache";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
export const LANDING_URL = process.env.NEXT_PUBLIC_LANDING_URL ?? "http://localhost:3000";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string | null;
  phoneVerifiedAt?: string | null;
  mustChangePassword?: boolean;
  role: "super_admin" | "owner" | "employee";
  tenantRole?: "owner" | "admin" | "employee" | null;
  permissions?: string[];
  employeeId?: string | null;
  status: "active" | "inactive";
  subscriptionStatus?: "trial" | "subscribed" | "unsubscribed";
  effectiveSubscriptionStatus?: "trial" | "subscribed" | "unsubscribed";
  trialExpired?: boolean;
  trialStartedAt?: string | null;
  trialEndsAt?: string | null;
  trialSubIndustry?: {
    id: string;
    name: string;
    industry?: { id: string; name: string };
  } | null;
  trialTier?: {
    id: string;
    name: string;
  } | null;
  tenants?: PortalTenantContext[];
};

export type PortalTenantContext = {
  id: string;
  name: string;
  role: "owner" | "admin" | "employee";
  permissions?: string[];
  roleProfile?: { id: string; name: string; slug: string; permissions?: string[] } | null;
  allowedBranchIds?: string[];
  branches: Array<{
    id: string;
    name: string;
    code: string;
    status: string;
    address?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
  }>;
  subscriptions?: Array<{
    id: string;
    status: string;
    tier?: { id: string; name: string; slug: string } | null;
    subIndustry?: { id: string; name: string; slug: string; industry?: { id: string; name: string; slug: string } | null } | null;
  }>;
};

export type TenantContextResponse = {
  activeTenantId: string | null;
  activeBranchId: string | null;
  branchScope: "single" | "all";
  tenants: PortalTenantContext[];
};

export function isSuperAdminUser(user: Pick<AuthUser, "role" | "email"> | null | undefined) {
  if (!user || typeof user.email !== "string") return false;
  const email = user.email.toLowerCase();
  return user.role === "super_admin" || email === "admin@omnia.local" || email === "dev@omnia.demo";
}

export type PublicCatalogIndustry = {
  id: string;
  name: string;
  slug: string;
  iconKey?: string | null;
  colorKey?: string | null;
  pain?: string | null;
  solution?: string | null;
  subIndustries: Array<{
    id: string;
    name: string;
    slug: string;
    need: string;
    offer: string;
    tiers?: Array<{ id: string; name: string; slug: string }>;
  }>;
};

export type PortalSummary = {
  reports: Array<{ value: string; label: string; caption: string }>;
  quickAccess: Array<{ name: string; category: string; badge: string; path: string }>;
  activity: string[];
  reportCharts: Array<{ title: string; values: number[] }>;
  hrisModules: Array<{ name: string; caption: string; active: boolean }>;
  access: { employees: number; activeSubscriptions: number };
};

export function getToken() {
  return getStoredAccessToken();
}

export function getPortalContextHeaders() {
  const tenantId = getStoredActiveTenantId();
  const branchId = getStoredActiveBranchId();
  const branchScope = getStoredBranchScope();
  return {
    ...(tenantId ? { "x-tenant-id": tenantId } : {}),
    ...(branchId && branchScope !== "all" ? { "x-branch-id": branchId } : {}),
    "x-branch-scope": branchScope
  };
}

export interface ApiFetchOptions extends RequestInit {
  allowOfflineQueue?: boolean;
}

export class OfflineQueuedError extends Error {
  constructor(message: string = "No internet connection. Request queued for offline sync.") {
    super(message);
    this.name = "OfflineQueuedError";
  }
}

export function unwrapApiResponse<T>(payload: T | { data: T; meta?: unknown }): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const token = getToken();
  const url = `${API_BASE_URL}${path}`;
  const isReadRequest = !options.method || options.method.toUpperCase() === "GET";
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...getPortalContextHeaders(),
    ...options.headers
  };

  if (isReadRequest) {
    const cached = await getCachedApiResponse<T>(path, token);
    if (cached !== null) {
      void fetch(url, { ...options, headers })
        .then(async (response) => {
          if (response.ok && response.status !== 204) {
            await cacheApiResponse(path, token, unwrapApiResponse(await response.json()));
          }
        })
        .catch(() => undefined);
      return cached;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const message = await response.text();
      let parsedMessage: string | undefined;
      try {
        const parsed = JSON.parse(message);
        const rawValue = parsed.error?.message ?? parsed.message;
        const nestedValue = rawValue && typeof rawValue === "object" ? rawValue.message : rawValue;
        const value = Array.isArray(nestedValue) ? nestedValue.join(", ") : nestedValue;
        parsedMessage = typeof value === "string" ? value.trim() : undefined;
      } catch {
        parsedMessage = undefined;
      }
      throw new Error(parsedMessage || message || `Request failed: ${response.status}`);
    }

    if (response.status === 204) return undefined as T;
    const data = unwrapApiResponse<T>(await response.json());
    if (isReadRequest) await cacheApiResponse(path, token, data);
    return data;
  } catch (error: any) {
    // Deteksi jika error adalah TypeError (biasanya "Failed to fetch" karena offline/network down)
    const isNetworkError = error instanceof TypeError || error.message.includes('Failed to fetch') || error.message.includes('Network request failed');
    
    if (isNetworkError && options.allowOfflineQueue) {
      // Masukkan ke antrean offline
      await OfflineQueue.enqueue({
        url,
        method: options.method || 'GET',
        headers: headers as Record<string, string>,
        body: options.body ? JSON.parse(options.body as string) : undefined
      });
      
      throw new OfflineQueuedError();
    }
    if (isNetworkError && isReadRequest) {
      const cached = await getCachedApiResponse<T>(path, token);
      if (cached !== null) return cached;
    }
    
    throw error;
  }
}
