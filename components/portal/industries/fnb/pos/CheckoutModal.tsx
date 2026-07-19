import React, { useState } from "react";
import { usePosStore } from "../store/usePosStore";
import { useKdsStore } from "../store/useKdsStore";
import { useInventoryStore } from "../store/useInventoryStore";
import { useRestaurantStore } from "../store/useRestaurantStore";
import { X, Receipt, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch, OfflineQueuedError } from "@/lib/api";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  syncWithBackend?: boolean;
}

export function CheckoutModal({ isOpen, onClose, onSuccess, syncWithBackend = false }: CheckoutModalProps) {
  const { cart, tableId, getTotal, clearCart } = usePosStore();
  const { addTicket } = useKdsStore();
  const { deductStockForOrder } = useInventoryStore();
  const { tables, closeOpenBill } = useRestaurantStore();
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "QRIS">("CASH");
  const [cashReceived, setCashReceived] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const total = getTotal();
  const selectedTable = tables.find((table) => table.id === tableId);
  const submittedItemIds = selectedTable?.openBill?.submittedItemIds ?? [];
  const kitchenItems = cart.filter((item) => !submittedItemIds.includes(item.id));
  const cashAmount = parseInt(cashReceived.replace(/\D/g, "") || "0", 10);
  const change = cashAmount - total;
  const canCheckout = paymentMethod === "QRIS" || (paymentMethod === "CASH" && cashAmount >= total);

  const quickAmounts = [
    total,
    Math.ceil(total / 10000) * 10000,
    Math.ceil(total / 50000) * 50000,
    100000,
  ].filter((v, i, a) => a.indexOf(v) === i && v >= total);

  const finishCheckout = () => {
    setIsProcessing(false);
    setIsSuccess(true);
    const dateStr = new Date().toISOString().slice(0,10).replace(/-/g,"/");
    const invNumber = `INV/${dateStr}/${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
    if (kitchenItems.length > 0) {
      addTicket(invNumber, kitchenItems);
      deductStockForOrder(kitchenItems);
    }

    setTimeout(() => {
      if (tableId) {
        closeOpenBill(tableId);
      }
      clearCart();
      setIsSuccess(false);
      setCashReceived("");
      onSuccess();
      onClose();
    }, 2500);
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      if (syncWithBackend) {
        await apiFetch("/fnb/pos/orders", {
          method: "POST",
          allowOfflineQueue: true,
          headers: {
            "Idempotency-Key": crypto.randomUUID(),
          },
          body: JSON.stringify({
            totalAmount: total,
            paymentMethod,
            cashReceived: paymentMethod === "CASH" ? cashAmount : total,
            changeAmount: paymentMethod === "CASH" ? Math.max(0, change) : 0,
            items: cart.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              priceAtSale: item.priceAtSale,
              variantSnapshot: item.variant ?? undefined,
              modifiersSnapshot: item.modifiers,
              note: item.note,
            })),
          }),
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 900));
      }
      finishCheckout();
    } catch (error: any) {
      if (error instanceof OfflineQueuedError || error.name === "OfflineQueuedError") {
        alert("Koneksi terputus. Pesanan disimpan sebagai draf offline dan akan disinkronkan saat online.");
        finishCheckout();
      } else {
        console.error(error);
        setIsProcessing(false);
        alert("Checkout gagal tersinkron ke backend. Silakan coba lagi.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg overflow-hidden rounded-[24px] bg-white shadow-2xl relative"
        >
          {isSuccess ? (
            <div className="p-10 flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="grid h-24 w-24 place-items-center rounded-full bg-emerald-100 text-emerald-500 mb-6"
              >
                <CheckCircle2 className="h-12 w-12" />
              </motion.div>
              <h2 className="text-2xl font-black text-[#172033] mb-2">Pembayaran Berhasil!</h2>
              {paymentMethod === "CASH" && change > 0 && (
                <p className="text-lg font-bold text-slate-500">
                  Kembalian: <span className="text-[var(--portal-primary)]">Rp{change.toLocaleString("id-ID")}</span>
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <h2 className="text-xl font-black text-[#172033]">Checkout</h2>
                <button
                  onClick={onClose}
                  className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5">
                <div className="mb-6 rounded-[16px] bg-[var(--portal-primary-soft)] p-4 text-center">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--portal-primary)]">
                    Total Pembayaran
                  </p>
                  <p className="mt-1 text-3xl font-black text-[#172033]">
                    Rp{total.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod("CASH")}
                    className={`rounded-[16px] border-2 p-4 text-center font-bold transition ${
                      paymentMethod === "CASH"
                        ? "border-[var(--portal-primary)] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]"
                        : "border-slate-100 text-slate-500 hover:border-slate-200"
                    }`}
                  >
                    Uang Tunai
                  </button>
                  <button
                    onClick={() => setPaymentMethod("QRIS")}
                    className={`rounded-[16px] border-2 p-4 text-center font-bold transition ${
                      paymentMethod === "QRIS"
                        ? "border-[var(--portal-primary)] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]"
                        : "border-slate-100 text-slate-500 hover:border-slate-200"
                    }`}
                  >
                    QRIS
                  </button>
                </div>

                {paymentMethod === "CASH" && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-500">
                        Uang Diterima
                      </label>
                      <input
                        type="text"
                        value={cashReceived}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setCashReceived(val ? `Rp ${parseInt(val, 10).toLocaleString("id-ID")}` : "");
                        }}
                        className="w-full rounded-[14px] border border-slate-200 bg-slate-50 p-4 text-xl font-black outline-none focus:border-[var(--portal-primary)] focus:bg-white"
                        placeholder="Rp 0"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {quickAmounts.map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setCashReceived(`Rp ${amt.toLocaleString("id-ID")}`)}
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
                        >
                          Rp{amt.toLocaleString("id-ID")}
                        </button>
                      ))}
                    </div>
                    
                    {cashAmount > 0 && (
                      <div className="mt-4 flex items-center justify-between rounded-[14px] bg-slate-100 p-4">
                        <span className="font-bold text-slate-500">Kembalian</span>
                        <span className={`text-xl font-black ${change < 0 ? 'text-rose-500' : 'text-[#172033]'}`}>
                          Rp{change.toLocaleString("id-ID")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {paymentMethod === "QRIS" && (
                  <div className="rounded-[16px] border border-dashed border-slate-300 p-8 text-center bg-slate-50">
                    <div className="mx-auto h-32 w-32 bg-slate-200 rounded-[12px] flex items-center justify-center mb-4 border border-slate-300 shadow-sm">
                       <span className="text-slate-400 font-bold">QR CODE</span>
                    </div>
                    <p className="text-sm font-bold text-slate-500">
                      Minta pelanggan scan QRIS untuk menyelesaikan pembayaran.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 p-5 bg-slate-50">
                <button
                  disabled={!canCheckout || isProcessing}
                  onClick={handleProcess}
                  className={`flex w-full items-center justify-center gap-2 rounded-full py-4 font-black transition ${
                    canCheckout && !isProcessing
                      ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)] shadow-lg shadow-[var(--portal-primary-soft)] hover:opacity-90"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {isProcessing ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Receipt className="h-5 w-5" />
                      Proses Pembayaran
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
