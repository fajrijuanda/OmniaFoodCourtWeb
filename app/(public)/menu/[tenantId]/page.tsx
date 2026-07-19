import { API_BASE_URL } from "@/lib/api";
import MenuPageClient from "./menu-client";

export default async function MenuPage({ params }: { params: Promise<{ tenantId: string }> }) {
  // We can fetch data server-side or pass to client
  // But wait, API_BASE_URL might be localhost:4000
  // For simplicity, we will fetch client-side in MenuPageClient 
  // because the API might not be reachable from the Next.js server container if it's Docker,
  // but let's just use client-side fetching for now to guarantee it works.
  
  return <MenuPageClient tenantId={(await params).tenantId} />;
}


export const dynamicParams = false;

export function generateStaticParams() { return [{ tenantId: "_mobile" }]; }
