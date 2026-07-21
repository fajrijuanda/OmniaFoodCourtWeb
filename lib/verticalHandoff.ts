import type { AuthUser } from "@/lib/api";
import { Capacitor } from "@capacitor/core";
import {
  getStoredAccessToken,
  getStoredActiveBranchId,
  getStoredActiveTenantId,
  getStoredBranchScope,
  getStoredDemoRole,
  getStoredHrisTier,
  getStoredUser,
  persistAuthSession,
  persistBranchContext,
} from "@/lib/mobile/session";

type Vertical = "cafe" | "restaurant" | "bakery" | "cloud-kitchen" | "food-court" | "hris" | "retail" | "clinic";

/** The vertical that THIS web app serves — handoff to this vertical is skipped to prevent redirect loops. */
const CURRENT_VERTICAL: Vertical = "food-court";

const verticalOrigins: Record<Vertical, string> = {
  cafe: process.env.NEXT_PUBLIC_CAFE_WEB_URL ?? "https://omnia-cafe-web.vercel.app",
  restaurant: process.env.NEXT_PUBLIC_RESTAURANT_WEB_URL ?? "https://omnia-restaurant-web.vercel.app",
  bakery: process.env.NEXT_PUBLIC_BAKERY_WEB_URL ?? "https://omnia-bakery-web.vercel.app",
  "cloud-kitchen": process.env.NEXT_PUBLIC_CLOUD_KITCHEN_WEB_URL ?? "https://omnia-cloud-kitchen-web.vercel.app",
  "food-court": process.env.NEXT_PUBLIC_FOOD_COURT_WEB_URL ?? "https://omnia-food-court-web.vercel.app",
  hris: process.env.NEXT_PUBLIC_HRIS_WEB_URL ?? "https://omnia-hris-web.vercel.app",
  retail: process.env.NEXT_PUBLIC_RETAIL_WEB_URL ?? "https://omnia-retail-web.vercel.app",
  clinic: process.env.NEXT_PUBLIC_CLINIC_WEB_URL ?? "https://omnia-clinic-web.vercel.app",
};

function encodePayload(value: unknown) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return window.btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function resolveVerticalTarget(pathname: string): { vertical: Vertical; path: string } | null {
  let result: { vertical: Vertical; path: string } | null = null;

  if (pathname === "/portal/fnb/cafe" || pathname.startsWith("/portal/fnb/cafe/")) result = { vertical: "cafe", path: pathname };
  else if (pathname === "/portal/fnb/restaurant" || pathname.startsWith("/portal/fnb/restaurant/")) result = { vertical: "restaurant", path: pathname };
  else if (pathname === "/portal/fnb/bakery" || pathname.startsWith("/portal/fnb/bakery/")) result = { vertical: "bakery", path: pathname };
  else if (pathname === "/portal/fnb/cloud-kitchen" || pathname.startsWith("/portal/fnb/cloud-kitchen/")) result = { vertical: "cloud-kitchen", path: pathname };
  else if (pathname === "/portal/fnb/food-court" || pathname.startsWith("/portal/fnb/food-court/")) result = { vertical: "food-court", path: pathname };
  else if (/^\/portal\/(?:professional-services|jasa-profesional|internal-operations)\/hris(?:\/|$)/.test(pathname) || pathname === "/portal/hris" || pathname.startsWith("/portal/hris/")) {
    result = { vertical: "hris", path: pathname };
  } else if (pathname === "/portal/retail-and-stores/retail-store" || pathname.startsWith("/portal/retail-and-stores/retail-store/")) {
    result = { vertical: "retail", path: pathname };
  } else if (/^\/portal\/(?:healthcare|kesehatan(?:-klinik)?)\/clinic(?:\/|$)/.test(pathname) || pathname === "/portal/clinic" || pathname.startsWith("/portal/clinic/")) {
    result = { vertical: "clinic", path: pathname };
  }

  // Don't redirect to ourselves — that causes an infinite handoff loop
  if (result && result.vertical === CURRENT_VERTICAL) return null;

  return result;
}

export function buildVerticalHandoffUrl(vertical: Vertical, destinationPath: string) {
  const accessToken = getStoredAccessToken();
  const user = getStoredUser<AuthUser>();
  if (!accessToken || !user) return `${verticalOrigins[vertical]}/login`;
  const payload = encodePayload({
    version: 1,
    expiresAt: Date.now() + 60_000,
    accessToken,
    user,
    tenantId: getStoredActiveTenantId(),
    branchId: getStoredActiveBranchId(),
    branchScope: getStoredBranchScope(),
    demoRole: getStoredDemoRole(),
    hrisTier: getStoredHrisTier(),
    appShell: Capacitor.isNativePlatform(),
    destinationPath,
  });
  return `${verticalOrigins[vertical]}/auth/handoff#session=${payload}`;
}

function decodePayload(encoded: string): any {
  let binary = window.atob(encoded.replace(/-/g, "+").replace(/_/g, "/"));
  let bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export async function consumeVerticalHandoff(encoded: string): Promise<string> {
  const payload = decodePayload(encoded);
  if (payload.expiresAt < Date.now()) {
    throw new Error("Sesi handoff sudah kedaluwarsa.");
  }
  
  if (payload.accessToken && payload.user) {
    await persistAuthSession({ accessToken: payload.accessToken, user: payload.user });
  }
  
  if (payload.tenantId || payload.branchId || payload.branchScope) {
    persistBranchContext({
      tenantId: payload.tenantId,
      branchId: payload.branchId,
      branchScope: payload.branchScope,
    });
  }
  
  return payload.destinationPath || "/portal";
}
