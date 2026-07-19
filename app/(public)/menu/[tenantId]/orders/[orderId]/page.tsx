import ReceiptClient from "./receipt-client";

export const dynamicParams = false;

export default async function ReceiptPage({ params }: { params: Promise<{ tenantId: string; orderId: string }> }) {
  const { tenantId, orderId } = await params;

  return (
    <div>
      <ReceiptClient tenantId={tenantId} orderId={orderId} />
    </div>
  );
}


export function generateStaticParams() {
  return [{ tenantId: "_mobile", orderId: "_mobile" }];
}
