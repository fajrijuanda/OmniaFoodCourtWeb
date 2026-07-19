import OrdersClient from "./orders-client";

export default async function OrdersPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params;
  return (
    <div>
      <header className="sticky top-0 z-40 bg-white/90 px-4 py-4 backdrop-blur-md shadow-sm">
        <h1 className="text-xl font-black text-slate-900">Riwayat Pesanan</h1>
      </header>
      <OrdersClient tenantId={tenantId} />
    </div>
  );
}


export const dynamicParams = false;

export function generateStaticParams() { return [{ tenantId: "_mobile" }]; }
