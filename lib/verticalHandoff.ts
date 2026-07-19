import type { AuthUser } from "@/lib/api";
import {
  persistAuthSession,
  setStoredDemoRole,
  setStoredHrisTier,
  setStoredTenantContext,
} from "@/lib/mobile/session";

type HandoffPayload = {
  version: 1;
  expiresAt: number;
  accessToken: string;
  user: AuthUser;
  tenantId: string | null;
  branchId: string | null;
  branchScope: "single" | "all";
  demoRole: string | null;
  hrisTier: string | null;
  portalTheme?: string;
  appShell?: boolean;
  destinationPath: string;
};

function decodePayload(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = window.atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as HandoffPayload;
}

export async function consumeVerticalHandoff(encoded: string) {
  const payload = decodePayload(encoded);
  if (payload.version !== 1 || payload.expiresAt < Date.now()) throw new Error("Tautan sesi sudah kedaluwarsa.");
  if (!payload.accessToken || !payload.user || !payload.destinationPath.startsWith("/portal/")) throw new Error("Data sesi tidak valid.");
  await persistAuthSession({ accessToken: payload.accessToken, user: payload.user });
  setStoredTenantContext({ tenantId: payload.tenantId, branchId: payload.branchId, branchScope: payload.branchScope === "all" ? "all" : "single" });
  if (payload.demoRole) setStoredDemoRole(payload.demoRole);
  if (payload.hrisTier) setStoredHrisTier(payload.hrisTier);
  if (payload.appShell) window.localStorage.setItem("omnia-native-app-shell", "1");
  return payload.destinationPath;
}
