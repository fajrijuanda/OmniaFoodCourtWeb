import type { Metadata } from "next";
import Link from "next/link";
import { Home, ShoppingBag, Receipt, User } from "lucide-react";
import { CartProvider } from "./cart-context"; // we will create this

export const metadata: Metadata = {
  title: "Omnia Menu",
  description: "Self-order your favorite items",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default async function MenuLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenantId: string }>;
}) {
  return (
    <CartProvider tenantId={(await params).tenantId}>
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 pb-20">
        <main className="flex-1">{children}</main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-slate-200 bg-white/90 px-4 pb-safe backdrop-blur-md">
          <Link href={`/menu/${(await params).tenantId}`} className="flex flex-col items-center gap-1 text-slate-500 hover:text-orange-500">
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link href={`/menu/${(await params).tenantId}/orders`} className="flex flex-col items-center gap-1 text-slate-500 hover:text-orange-500">
            <Receipt className="h-5 w-5" />
            <span className="text-[10px] font-bold">Orders</span>
          </Link>
          <Link href={`/menu/${(await params).tenantId}/cart`} className="flex flex-col items-center gap-1 text-slate-500 hover:text-orange-500 relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="text-[10px] font-bold">Cart</span>
            {/* We will add a cart count badge here via client component later if needed, or inside the page */}
          </Link>
          <Link href={`/menu/${(await params).tenantId}/profile`} className="flex flex-col items-center gap-1 text-slate-500 hover:text-orange-500">
            <User className="h-5 w-5" />
            <span className="text-[10px] font-bold">Profile</span>
          </Link>
        </nav>
      </div>
    </CartProvider>
  );
}

export const dynamicParams = false;

export function generateStaticParams() { return [{ tenantId: "_mobile" }]; }
