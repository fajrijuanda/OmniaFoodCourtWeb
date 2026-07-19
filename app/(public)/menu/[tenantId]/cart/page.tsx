import { API_BASE_URL } from "@/lib/api";
import CartPageClient from "./cart-client";

export default async function CartPage({ params }: { params: Promise<{ tenantId: string }> }) {
  return <CartPageClient tenantId={(await params).tenantId} />;
}


export const dynamicParams = false;

export function generateStaticParams() { return [{ tenantId: "_mobile" }]; }
