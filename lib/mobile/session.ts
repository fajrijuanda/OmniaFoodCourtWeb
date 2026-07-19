import type { AuthUser } from "@/lib/api";
import { SecureToken } from "./secureToken";
import { Capacitor } from '@capacitor/core';

export const MOBILE_SESSION_KEYS = {
  accessToken: "omnia-access-token",
  user: "omnia-user",
  demoRole: "omnia-demo-role",
  hrisTier: "omnia-hris-tier",
  portalLoaded: "omnia-portal-loaded",
  activeTenantId: "omnia-active-tenant-id",
  activeBranchId: "omnia-active-branch-id",
  branchScope: "omnia-branch-scope"
} as const;

export type BranchScope = "single" | "all";

// --- In-Memory Cache ---
const sessionCache: Record<string, string> = {};

function isDeveloperAccount(user: Pick<AuthUser, "email" | "role">) {
  const email = typeof user?.email === "string" ? user.email.toLowerCase() : "";
  return user.role === "super_admin" || email === "admin@omnia.local" || email === "dev@omnia.demo";
}

function getWindowStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function getSessionStorage() {
  if (typeof window === "undefined") return null;
  return window.sessionStorage;
}

/**
 * Initializes the in-memory cache by reading from Native Secure Storage (if Capacitor)
 * or LocalStorage (if Web).
 * This MUST be called asynchronously before the React application renders.
 */
export async function initSecureSession() {
  if (typeof window === "undefined") return;

  const isNative = Capacitor.isNativePlatform();
  const keys = Object.values(MOBILE_SESSION_KEYS);

  if (isNative) {
    for (const key of keys) {
      const val = await SecureToken.get(key);
      if (val !== null) {
        sessionCache[key] = val;
      }
    }
  } else {
    const storage = getWindowStorage();
    if (storage) {
      for (const key of keys) {
        const val = storage.getItem(key);
        if (val !== null) {
          sessionCache[key] = val;
        }
      }
    }
  }
}

/**
 * Helper to write to Memory + Native Storage + LocalStorage
 */
async function setKey(key: string, value: string) {
  sessionCache[key] = value;
  
  if (Capacitor.isNativePlatform()) {
    await SecureToken.set(key, value);
  } else {
    getWindowStorage()?.setItem(key, value);
  }
}

/**
 * Helper to remove from Memory + Native Storage + LocalStorage
 */
async function removeKey(key: string) {
  delete sessionCache[key];
  
  if (Capacitor.isNativePlatform()) {
    await SecureToken.remove(key);
  } else {
    getWindowStorage()?.removeItem(key);
  }
}

// --- Synchronous Getters (Reads from Cache) ---

export function getStoredAccessToken() {
  return sessionCache[MOBILE_SESSION_KEYS.accessToken] ?? null;
}

export function getStoredUser<TUser extends AuthUser = AuthUser>() {
  const stored = sessionCache[MOBILE_SESSION_KEYS.user];
  if (!stored) return null;

  try {
    return JSON.parse(stored) as TUser;
  } catch {
    return null;
  }
}

export function getStoredDemoRole() {
  return sessionCache[MOBILE_SESSION_KEYS.demoRole] ?? null;
}

export function getStoredHrisTier() {
  return sessionCache[MOBILE_SESSION_KEYS.hrisTier] ?? null;
}

export function getStoredActiveTenantId() {
  return sessionCache[MOBILE_SESSION_KEYS.activeTenantId] ?? null;
}

export function getStoredActiveBranchId() {
  return sessionCache[MOBILE_SESSION_KEYS.activeBranchId] ?? null;
}

export function getStoredBranchScope() {
  return sessionCache[MOBILE_SESSION_KEYS.branchScope] ?? "single";
}

// Note: portalLoaded is generally kept in sessionStorage as it is ephemeral
export function isPortalLoaded() {
  const storage = getSessionStorage();
  return storage?.getItem(MOBILE_SESSION_KEYS.portalLoaded) === "true";
}

export function setPortalLoaded(isLoaded: boolean) {
  const storage = getSessionStorage();
  if (!storage) return;
  if (isLoaded) storage.setItem(MOBILE_SESSION_KEYS.portalLoaded, "true");
  else storage.removeItem(MOBILE_SESSION_KEYS.portalLoaded);
}

// --- Asynchronous Setters (Writes to Cache & Storage) ---

export function setStoredHrisTier(tier: string) {
  setKey(MOBILE_SESSION_KEYS.hrisTier, tier);
}

export function setStoredDemoRole(role: string) {
  setKey(MOBILE_SESSION_KEYS.demoRole, role);
}

export function setStoredTenantContext(context: { tenantId: string | null; branchId: string | null; branchScope: BranchScope }) {
  if (context.tenantId) setKey(MOBILE_SESSION_KEYS.activeTenantId, context.tenantId);
  else removeKey(MOBILE_SESSION_KEYS.activeTenantId);

  if (context.branchId) setKey(MOBILE_SESSION_KEYS.activeBranchId, context.branchId);
  else removeKey(MOBILE_SESSION_KEYS.activeBranchId);

  setKey(MOBILE_SESSION_KEYS.branchScope, context.branchScope);
}

export async function persistAuthSession(data: { accessToken: string; user: AuthUser }) {
  const writes = [
    setKey(MOBILE_SESSION_KEYS.accessToken, data.accessToken),
    setKey(MOBILE_SESSION_KEYS.user, JSON.stringify(data.user)),
  ];
  
  const demoRole = isDeveloperAccount(data.user) ? "developer" : data.user.role;
  writes.push(setKey(MOBILE_SESSION_KEYS.demoRole, demoRole));
  
  if (isDeveloperAccount(data.user)) {
    writes.push(setKey(MOBILE_SESSION_KEYS.hrisTier, "enterprise"));
  }
  
  getSessionStorage()?.removeItem(MOBILE_SESSION_KEYS.portalLoaded);
  await Promise.all(writes);
}

export function clearAuthSession() {
  removeKey(MOBILE_SESSION_KEYS.accessToken);
  removeKey(MOBILE_SESSION_KEYS.user);
  removeKey(MOBILE_SESSION_KEYS.demoRole);
  removeKey(MOBILE_SESSION_KEYS.hrisTier);
  
  getSessionStorage()?.removeItem(MOBILE_SESSION_KEYS.portalLoaded);
}

export function persistBranchContext(context: { tenantId?: string | null; branchId?: string | null; branchScope?: "single" | "all" | null }) {
  if (context.tenantId) setKey(MOBILE_SESSION_KEYS.activeTenantId, context.tenantId);
  else if (context.tenantId === null) removeKey(MOBILE_SESSION_KEYS.activeTenantId);

  if (context.branchId) setKey(MOBILE_SESSION_KEYS.activeBranchId, context.branchId);
  else if (context.branchId === null) removeKey(MOBILE_SESSION_KEYS.activeBranchId);

  if (context.branchScope) setKey(MOBILE_SESSION_KEYS.branchScope, context.branchScope);
}
