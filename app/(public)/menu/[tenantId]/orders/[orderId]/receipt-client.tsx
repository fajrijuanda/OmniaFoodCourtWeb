"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { ChevronLeft, ReceiptText, QrCode, CreditCard, Banknote, CheckCircle, Clock, CookingPot, Wallet } from "lucide-react";
import Link from "next/link";

export default function ReceiptClient({ tenantId, orderId }: { tenantId: string; orderId: string }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Use polling for real-time kitchen status updates
  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/fnb/public/orders/${tenantId}/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
    const interval = setInterval(fetchReceipt, 10000); // poll every 10 seconds
    return () => clearInterval(interval);
  }, [tenantId, orderId]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold animate-pulse">Memuat struk pesanan...</div>;
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="font-bold text-slate-500">Pesanan tidak ditemukan.</p>
        <Link href={`/menu/${tenantId}`} className="mt-4 inline-block rounded-full bg-orange-100 px-6 py-2 text-sm font-bold text-orange-600">
          Kembali ke Menu
        </Link>
      </div>
    );
  }

  const PaymentIcon = {
    CASH: Banknote,
    QRIS: QrCode,
    DEBIT: CreditCard,
    E_WALLET: Wallet,
    TRANSFER: Banknote,
  }[order.paymentMethod as string] || Banknote;

  const paymentLabels: Record<string, string> = {
    CASH: "Tunai",
    QRIS: order.paymentSettings?.provider === "BTN_QRIS" ? "QRIS BTN" : "QRIS",
    DEBIT: "Kartu Debit",
    E_WALLET: "E-Wallet",
    TRANSFER: "Transfer Bank",
  };

  const kitchenStatuses = ["PENDING", "PREPARING", "READY", "DELIVERED"];
  const currentStatusIndex = kitchenStatuses.indexOf(order.kitchenStatus) !== -1 ? kitchenStatuses.indexOf(order.kitchenStatus) : (order.kitchenStatus === 'COOKING' ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="sticky top-0 z-40 flex items-center gap-3 bg-white/90 px-4 py-4 backdrop-blur-md shadow-sm">
        <Link href={`/menu/${tenantId}/orders`} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-black text-slate-900">Detail Pesanan</h1>
      </header>

      <div className="px-4 py-6 grid gap-6">
        {order.paymentStatus === "UNPAID" && order.paymentMethod === "QRIS" && (
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 text-center">
            <h2 className="font-black text-slate-900 mb-2">Selesaikan Pembayaran</h2>
            <p className="text-sm font-bold text-slate-500 mb-6">
              {order.paymentSettings?.provider === "BTN_QRIS"
                ? "Scan QRIS milik outlet. Pembayaran akan direkonsiliasi melalui koneksi Bank BTN."
                : "Scan kode QRIS di bawah menggunakan aplikasi E-Wallet atau M-Banking Anda."}
            </p>
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 inline-block mb-4">
              {order.paymentSettings?.btnQris?.qrisImageUrl ? (
                <img
                  src={order.paymentSettings.btnQris.qrisImageUrl}
                  alt="QRIS pembayaran"
                  className="h-48 w-48 rounded-xl bg-white object-contain"
                />
              ) : (
                <div className="relative grid h-48 w-48 place-items-center border border-slate-200 bg-white">
                  <QrCode className="h-32 w-32 text-slate-300" />
                  <span className="absolute text-xs font-bold text-slate-400">{order.paymentSettings?.provider === "BTN_QRIS" ? "QRIS BTN" : "MOCKUP QRIS"}</span>
                </div>
              )}
            </div>
            <p className="font-black text-xl text-slate-900">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
            {order.paymentSettings?.btnQris?.merchantId && (
              <p className="mt-2 text-xs font-bold text-slate-500">Merchant: {order.paymentSettings.btnQris.merchantId}</p>
            )}
          </div>
        )}

        {order.paymentStatus === "UNPAID" && order.paymentMethod === "TRANSFER" && (
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <h2 className="font-black text-slate-900 mb-2">Instruksi Transfer</h2>
            <p className="text-sm font-bold text-slate-500 mb-4">Transfer sesuai total tagihan ke rekening penerima berikut.</p>
            <div className="grid gap-3">
              {(order.paymentSettings?.receiverAccounts ?? []).map((account: any) => (
                <div key={account.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-slate-900">{account.label}</p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500">{account.percentage}%</span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-slate-600">{account.bankName} - {account.accountNumber || "Nomor rekening belum diatur"}</p>
                  <p className="text-sm font-bold text-slate-500">a.n. {account.accountHolder || "Nama penerima belum diatur"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
          <h3 className="font-black mb-4 flex items-center gap-2">
            <CookingPot className="w-5 h-5 text-orange-500" /> Status Dapur
          </h3>
          <div className="relative pl-6 border-l-2 border-slate-100 grid gap-6">
            {[
              { id: 'PENDING', label: 'Menunggu Konfirmasi', icon: Clock },
              { id: 'PREPARING', label: 'Sedang Dimasak', icon: CookingPot },
              { id: 'READY', label: 'Siap Disajikan', icon: CheckCircle },
              { id: 'DELIVERED', label: 'Selesai', icon: CheckCircle },
            ].map((step, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isActive = index === currentStatusIndex;
              const StepIcon = step.icon;
              return (
                <div key={step.id} className={`relative ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`absolute -left-[35px] top-0 grid h-6 w-6 place-items-center rounded-full border-4 border-white ${isActive ? 'bg-orange-500' : isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                  <h4 className={`font-bold ${isActive ? 'text-orange-600' : 'text-slate-700'}`}>{step.label}</h4>
                </div>
              );
            })}
          </div>
        </div>

        {order.orderType === 'RESERVATION' && (
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <h3 className="font-black mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" /> Detail Reservasi
            </h3>
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-500">Nama Pemesan</span>
                <span className="font-black text-slate-900">{order.customerName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-500">Waktu Kedatangan</span>
                <span className="font-black text-slate-900">
                  {order.reservationTime ? new Date(order.reservationTime).toLocaleString('id-ID') : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-500">Jumlah Orang</span>
                <span className="font-black text-slate-900">{order.pax} Orang</span>
              </div>
            </div>
            <p className="mt-4 text-xs font-bold text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
              Mohon datang tepat waktu. Pesanan Anda akan disiapkan sesuai jam kedatangan.
            </p>
          </div>
        )}

        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black flex items-center gap-2">
              <ReceiptText className="w-5 h-5 text-slate-400" /> Struk Pesanan
            </h3>
            <span className="text-sm font-bold text-slate-400">#{order.invoiceNumber.split('/').pop()}</span>
          </div>

          <div className="grid gap-4 mb-6">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-bold text-slate-800">{item.quantity}x {item.product?.name}</h4>
                  {item.note && <p className="text-xs font-bold text-slate-400 mt-0.5">Catatan: {item.note}</p>}
                </div>
                <span className="font-bold text-slate-700 whitespace-nowrap">
                  Rp {(item.quantity * item.priceAtSale).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-slate-200 pt-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-slate-500">Subtotal</span>
              <span className="font-bold text-slate-700">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-black text-slate-900">Total Tagihan</span>
              <span className="font-black text-slate-900 text-lg">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <PaymentIcon className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Metode Bayar</p>
                <p className="font-bold text-slate-700">{paymentLabels[order.paymentMethod] || order.paymentMethod}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-black ${order.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {order.paymentStatus}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
