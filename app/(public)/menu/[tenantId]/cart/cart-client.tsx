"use client";

import { useState, useEffect, useMemo } from "react";
import { Bell, Calendar, ReceiptText, ShoppingBag, Users } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import {
  CartItemCard,
  CartSummaryCard,
  CustomerFlowHeader,
  EmptyState,
  OrderTypeSelector,
  PaymentMethodSelector,
  PortalButton
} from "@/components/portal/ui";
import { useCart } from "../cart-context";
import { useRouter } from "next/navigation";

export default function CartPageClient({ tenantId }: { tenantId: string }) {
  const { 
    items, updateQuantity, removeItem, clearCart, totalAmount, 
    tableNumber, setTableNumber,
    orderType, setOrderType,
    reservationTime, setReservationTime,
    pax, setPax,
    tableId, setTableId
  } = useCart();
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("QRIS");
  const [message, setMessage] = useState("");
  const [tables, setTables] = useState<any[]>([]);
  const [tenant, setTenant] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`${API_BASE_URL}/fnb/public/catalog/${tenantId}`)
      .then(res => res.json())
      .then(data => setTenant(data.tenant))
      .catch(() => {});
  }, [tenantId]);

  useEffect(() => {
    // Fetch tables when orderType is RESERVATION
    if (orderType === "RESERVATION" && reservationTime) {
      const fetchTables = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/fnb/public/tables/${tenantId}?reservationTime=${reservationTime}&pax=${pax}`);
          if (res.ok) {
            const data = await res.json();
            setTables(data);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchTables();
    }
  }, [orderType, reservationTime, pax, tenantId]);

  // Handle default order type when tenant data is loaded
  useEffect(() => {
    if (tenant) {
      const slug = tenant.subIndustry;
      if (slug === "bakery" && orderType === "DINE_IN") setOrderType("TAKEAWAY");
      if (slug === "cloud-kitchen" && orderType === "DINE_IN") setOrderType("TAKEAWAY");
    }
  }, [tenant, orderType, setOrderType]);

  const getOrderTypes = () => {
    const slug = tenant?.subIndustry || "cafe";
    if (slug === "bakery") return [
      { id: "TAKEAWAY", label: "Bawa Pulang / Pick-up" },
      { id: "RESERVATION", label: "Pre-order Custom" }
    ];
    if (slug === "cloud-kitchen") return [
      { id: "TAKEAWAY", label: "Bawa Pulang / Pick-up" }
    ];
    if (slug === "food-court") return [
      { id: "DINE_IN", label: "Makan di Area" },
      { id: "TAKEAWAY", label: "Bawa Pulang" }
    ];
    return [
      { id: "DINE_IN", label: "Makan di Sini" },
      { id: "TAKEAWAY", label: "Bawa Pulang" },
      { id: "RESERVATION", label: "Reservasi Meja & PO" }
    ];
  };

  const paymentOptions = useMemo(() => {
    const methods = tenant?.paymentSettings?.methods ?? { qris: true, eWallet: true, debit: true, cash: true, transfer: true };
    const provider = tenant?.paymentSettings?.provider;
    return [
      { id: "QRIS", enabled: methods.qris, label: provider === "BTN_QRIS" ? "QRIS BTN milik outlet" : "QRIS via Xendit" },
      { id: "E_WALLET", enabled: methods.eWallet, label: "Transfer E-Wallet" },
      { id: "DEBIT", enabled: methods.debit, label: "Kartu Debit / Kredit" },
      { id: "TRANSFER", enabled: methods.transfer, label: "Transfer Bank" },
      { id: "CASH", enabled: methods.cash, label: "Tunai (Bayar di Kasir)" },
    ].filter((method) => method.enabled);
  }, [tenant]);

  useEffect(() => {
    if (paymentOptions.length > 0 && !paymentOptions.some((method) => method.id === paymentMethod)) {
      setPaymentMethod(paymentOptions[0].id);
    }
  }, [paymentOptions, paymentMethod]);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (!customerName) {
      setMessage("Nama harus diisi.");
      return;
    }
    if (orderType === "DINE_IN" && !tableNumber && tenant?.subIndustry !== "food-court") {
      setMessage("Nomor Meja harus diisi untuk pesanan Makan di Sini.");
      return;
    }
    if (orderType === "RESERVATION" && !reservationTime) {
      setMessage("Waktu harus dipilih.");
      return;
    }
    if (orderType === "RESERVATION" && !tableId && !['bakery'].includes(tenant?.subIndustry)) {
      setMessage("Meja harus dipilih.");
      return;
    }
    
    setLoading(true);
    setMessage("");
    
    try {
      let finalNotes = `[Customer: ${customerName}]`;
      if (orderType === "DINE_IN") finalNotes = `[Table: ${tableNumber || 'Area Food Court'}] ` + finalNotes;
      if (orderType === "RESERVATION") finalNotes = `[${tenant?.subIndustry === 'bakery' ? 'Pre-order' : `Reservation for ${pax} pax`} at ${new Date(reservationTime).toLocaleString('id-ID')}] ` + finalNotes;
      if (orderType === "TAKEAWAY") finalNotes = `[Takeaway] ` + finalNotes;

      let dpAmount = 0;
      if (orderType === "RESERVATION" && reservationTime) {
        const resDate = new Date(reservationTime).toISOString().slice(0, 10);
        const todayDate = new Date().toISOString().slice(0, 10);
        if (resDate !== todayDate) {
          dpAmount = totalAmount / 2; // DP 50%
        }
      }

      const response = await fetch(`${API_BASE_URL}/fnb/public/orders/${tenantId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalAmount,
          paymentMethod,
          cashReceived: paymentMethod === "CASH" ? (dpAmount > 0 ? dpAmount : totalAmount) : 0,
          changeAmount: 0,
          orderType,
          tableId: orderType === "RESERVATION" && !['bakery'].includes(tenant?.subIndustry) ? tableId : undefined,
          reservationTime: orderType === "RESERVATION" ? reservationTime : undefined,
          pax: orderType === "RESERVATION" && !['bakery'].includes(tenant?.subIndustry) ? pax : 1,
          customerName,
          dpAmount: dpAmount > 0 ? dpAmount : undefined,
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtSale: item.priceAtSale,
            note: item.note,
          })),
          notes: finalNotes
        })
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal memproses pesanan.");
      }
      const order = await response.json();
      
      // Save order to history
      const savedOrdersStr = localStorage.getItem(`omnia_orders_${tenantId}`);
      const savedOrders = savedOrdersStr ? JSON.parse(savedOrdersStr) : [];
      savedOrders.push(order.id);
      localStorage.setItem(`omnia_orders_${tenantId}`, JSON.stringify(savedOrders));
      
      clearCart();
      router.push(`/menu/${tenantId}/orders/${order.id}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan.");
      setLoading(false);
    }
  };

  let displayDpAmount = 0;
  if (orderType === "RESERVATION" && reservationTime) {
    const resDate = new Date(reservationTime).toISOString().slice(0, 10);
    const todayDate = new Date().toISOString().slice(0, 10);
    if (resDate !== todayDate) {
      displayDpAmount = totalAmount / 2; // DP 50%
    }
  }

  const showTableService = !["bakery", "cloud-kitchen", "food-court"].includes(tenant?.subIndustry);

  return (
    <div>
      <CustomerFlowHeader title="Keranjang" backHref={`/menu/${tenantId}`} />

      <div className="px-4 py-6">
        {items.length === 0 ? (
          <EmptyState
            title="Keranjang masih kosong."
            icon={ShoppingBag}
            className="py-20"
            action={<PortalButton href={`/menu/${tenantId}`} className="bg-orange-100 text-orange-600 hover:bg-orange-200">Lihat Menu</PortalButton>}
          />
        ) : (
          <div className="grid gap-6">
            {showTableService && (
              <div className="flex gap-3">
                <button 
                  onClick={() => alert("Pelayan sedang menuju ke meja Anda!")}
                  className="flex-1 rounded-xl bg-orange-50 border border-orange-200 py-3 text-sm font-black text-orange-600 shadow-sm transition active:scale-95"
                >
                  <Bell className="mr-1 inline h-4 w-4" /> Panggil Pelayan
                </button>
                <button 
                  onClick={() => alert("Bill sedang dicetak dan akan diantarkan ke meja Anda.")}
                  className="flex-1 rounded-xl bg-slate-50 border border-slate-200 py-3 text-sm font-black text-slate-600 shadow-sm transition active:scale-95"
                >
                  <ReceiptText className="mr-1 inline h-4 w-4" /> Minta Bill
                </button>
              </div>
            )}

            <div className="grid gap-4">
              {items.map(item => (
                <CartItemCard
                  key={item.id}
                  title={item.name}
                  subtitle={item.variantSnapshot?.name}
                  note={item.note}
                  price={`Rp ${item.priceAtSale.toLocaleString("id-ID")}`}
                  quantity={item.quantity}
                  onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                  onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                />
              ))}
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
              <h3 className="font-black mb-4">Tipe Pesanan</h3>
              <OrderTypeSelector value={orderType} options={getOrderTypes().map((type) => ({ value: type.id, label: type.label }))} onChange={setOrderType} />

              <div className="mt-4 grid gap-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">Nama Pemesan</span>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-orange-500"
                    placeholder="Contoh: Budi"
                  />
                </label>

                {orderType === "DINE_IN" && tenant?.subIndustry !== "food-court" && (
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">Nomor Meja</span>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={e => setTableNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-orange-500"
                      placeholder="Contoh: 12"
                      readOnly={tableNumber !== "" && (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('table'))}
                    />
                  </label>
                )}

                {orderType === "RESERVATION" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`block ${tenant?.subIndustry === 'bakery' ? 'col-span-2' : ''}`}>
                        <span className="mb-2 flex items-center gap-1 text-xs font-black uppercase tracking-wider text-slate-400"><Calendar className="w-3 h-3"/> {tenant?.subIndustry === 'bakery' ? 'Tanggal & Waktu Pengambilan' : 'Tanggal & Waktu Kedatangan'}</span>
                        <input
                          type="datetime-local"
                          value={reservationTime}
                          onChange={e => setReservationTime(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-orange-500"
                        />
                        <p className="mt-1 text-[10px] text-slate-500 font-bold">*Mohon perhatikan jam dan menit dengan teliti.</p>
                      </label>
                      {tenant?.subIndustry !== 'bakery' && (
                        <label className="block">
                          <span className="mb-2 flex items-center gap-1 text-xs font-black uppercase tracking-wider text-slate-400"><Users className="w-3 h-3"/> Jumlah Orang (Pax)</span>
                          <input
                            type="number"
                            min={1}
                            value={pax}
                            onChange={e => setPax(parseInt(e.target.value) || 1)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-orange-500"
                          />
                        </label>
                      )}
                    </div>

                    {reservationTime && tenant?.subIndustry !== 'bakery' && (
                      <label className="block">
                        <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">Pilih Meja (Tersedia: {tables.filter(t => t.isAvailable).length})</span>
                        <select
                          value={tableId}
                          onChange={e => setTableId(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-orange-500"
                        >
                          <option value="">-- Pilih Meja --</option>
                          {tables.map(table => (
                            <option key={table.id} value={table.id} disabled={!table.isAvailable}>
                              {table.name} (Kap: {table.capacity}) {table.isAvailable ? '' : '- Tidak Tersedia'}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
              <h3 className="font-black mb-4">Metode Pembayaran</h3>
              <PaymentMethodSelector value={paymentMethod} options={paymentOptions.map((method) => ({ value: method.id, label: method.label }))} onChange={setPaymentMethod} />
              {tenant?.paymentSettings?.provider === "BTN_QRIS" && paymentMethod === "QRIS" && (
                <p className="mt-3 rounded-xl bg-blue-50 p-3 text-xs font-bold leading-5 text-blue-700">
                  QRIS menggunakan QR milik outlet dan rekonsiliasi disiapkan melalui API Bank BTN.
                </p>
              )}
            </div>

            {message && <p className="text-sm font-bold text-red-500 text-center">{message}</p>}

            <CartSummaryCard
              subtotal={`Rp ${totalAmount.toLocaleString("id-ID")}`}
              totalLabel={displayDpAmount > 0 ? "Total Tagihan Saat Ini" : "Total Pembayaran"}
              total={`Rp ${(displayDpAmount > 0 ? displayDpAmount : totalAmount).toLocaleString("id-ID")}`}
              actionLabel={loading ? "Memproses..." : "Pesan Sekarang"}
              loading={loading}
              onAction={handleCheckout}
            >
              {displayDpAmount > 0 && (
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                  <span className="font-bold text-orange-400 flex items-center gap-1">DP (50%) Wajib Dibayar</span>
                  <span className="text-orange-400 font-black">Rp {displayDpAmount.toLocaleString("id-ID")}</span>
                </div>
              )}
            </CartSummaryCard>
          </div>
        )}
      </div>
    </div>
  );
}
