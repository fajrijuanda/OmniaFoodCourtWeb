import React from "react";
import { usePosStore } from "../store/usePosStore";
import { Trash2, Plus, Minus, FileEdit, User, MapPin } from "lucide-react";
import { useInventoryStore } from "../store/useInventoryStore";
import { useKdsStore } from "../store/useKdsStore";
import { useRestaurantStore } from "../store/useRestaurantStore";

interface CartSidebarProps {
  onCheckout: () => void;
  hideHeader?: boolean;
}

export function CartSidebar({ onCheckout, hideHeader = false }: CartSidebarProps) {
  const { cart, removeFromCart, updateQuantity, getSubtotal, getTax, getTotal } = usePosStore();
  const { addTicket } = useKdsStore();
  const { deductStockForOrder } = useInventoryStore();
  const { tables, saveOpenBill } = useRestaurantStore();

  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal();
  const { tableId, guestName, orderType, clearCart } = usePosStore();
  const selectedTable = tables.find((table) => table.id === tableId);

  const handleSaveToTable = () => {
    if (!tableId || cart.length === 0) return;

    const submittedItemIds = selectedTable?.openBill?.submittedItemIds ?? [];
    const newKitchenItems = cart.filter((item) => !submittedItemIds.includes(item.id));

    if (newKitchenItems.length > 0) {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "/");
      const ticketNumber = `OPEN/${tableId.toUpperCase()}/${dateStr}/${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
      addTicket(ticketNumber, newKitchenItems, `Open bill meja ${selectedTable?.number ?? tableId}`);
      deductStockForOrder(newKitchenItems);
    }

    saveOpenBill(tableId, cart, guestName, cart.map((item) => item.id));
    alert(`Pesanan disimpan ke meja ${selectedTable?.number ?? tableId}${guestName ? ` (a.n. ${guestName})` : ""}`);
    clearCart();
  };

  return (
    <div className="flex h-full w-full flex-col border-l border-slate-100 bg-white shadow-[-10px_0_30px_rgba(15,23,42,0.03)]">
      {!hideHeader ? (
      <div className="flex flex-col border-b border-slate-100 p-3 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black text-[#172033] sm:text-xl">Order Anda</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
            {cart.length} item
          </span>
        </div>
        {tableId && (
          <div className="flex flex-col gap-1.5 rounded-[16px] bg-[var(--portal-primary-soft)] p-3">
            <div className="flex items-center gap-2 text-xs font-black text-[var(--portal-primary)] uppercase tracking-wider">
              <MapPin className="h-3.5 w-3.5" /> Meja {tableId} • {orderType}
            </div>
            {guestName && (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <User className="h-3.5 w-3.5" /> {guestName}
              </div>
            )}
          </div>
        )}
      </div>
      ) : null}

      <div className="flex-1 space-y-3 overflow-y-auto p-3 sm:space-y-4 sm:p-4">
        {cart.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center opacity-60">
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-slate-100">
              <FileEdit className="h-6 w-6 text-slate-400" />
            </div>
            <p className="font-bold text-slate-500">Belum ada pesanan.</p>
            <p className="mt-1 text-xs font-bold text-slate-400">Pilih menu untuk memulai.</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="rounded-[14px] border border-slate-100 bg-white p-3 shadow-sm sm:rounded-[16px] sm:p-4">
              <div className="flex gap-3 items-start justify-between">
                {item.product.imageUrl ? (
                  <img src={item.product.imageUrl} alt={item.product.name} className="h-16 w-16 shrink-0 rounded-[12px] object-cover border border-slate-100" />
                ) : (
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[12px] bg-slate-100 border border-slate-100">
                    <FileEdit className="h-6 w-6 text-slate-300" />
                  </div>
                )}
                <div className="min-w-0 flex-1 pr-1">
                  {item.product.categoryId && (
                    <p className="mb-0.5 text-[10px] font-black uppercase tracking-wider text-[var(--portal-primary)]">
                      {item.product.categoryId.replace(/-/g, ' ')}
                    </p>
                  )}
                  <h4 className="font-black text-[#172033] line-clamp-2 leading-snug">
                    {item.product.name}
                  </h4>
                  {(item.variant || item.modifiers.length > 0 || item.note) && (
                    <div className="mt-1.5 space-y-0.5 text-[11px] font-bold text-slate-500">
                      {item.variant && <p>• {item.variant.name}</p>}
                      {item.modifiers.map((m) => (
                        <p key={m.id}>+ {m.name}</p>
                      ))}
                      {item.note && <p className="italic">&quot;{item.note}&quot;</p>}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between sm:mt-4">
                <p className="font-black text-[var(--portal-primary)]">
                  Rp{(item.priceAtSale * item.quantity).toLocaleString("id-ID")}
                </p>
                <div className="flex h-8 items-center rounded-full bg-slate-50 px-1 border border-slate-200">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="grid h-6 w-6 place-items-center rounded-full hover:bg-white hover:shadow-sm"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-black text-[#172033]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="grid h-6 w-6 place-items-center rounded-full hover:bg-white hover:shadow-sm"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-slate-100 bg-slate-50 p-3 pb-5 sm:p-5">
        <div className="mb-3 space-y-2 sm:mb-4">
          <div className="flex justify-between text-sm font-bold text-slate-500">
            <span>Subtotal</span>
            <span>Rp{subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-slate-500">
            <span>Pajak (PB1)</span>
            <span>Rp{tax.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-black text-[#172033] sm:text-lg">
            <span>Total</span>
            <span className="text-[var(--portal-primary)]">Rp{total.toLocaleString("id-ID")}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {tableId && (
            <button
              disabled={cart.length === 0}
              onClick={handleSaveToTable}
              className="flex min-h-[42px] w-full items-center justify-center rounded-full border-2 border-[var(--portal-primary)] bg-white py-2.5 text-sm font-black text-[var(--portal-primary)] transition hover:bg-[var(--portal-primary-soft)] disabled:cursor-not-allowed disabled:opacity-50 sm:py-3 sm:text-base"
            >
              Simpan ke Meja (Pay Later)
            </button>
          )}
          <button
            disabled={cart.length === 0}
            onClick={onCheckout}
            className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-[var(--portal-primary)] py-3 text-sm font-black text-[var(--portal-on-primary)] shadow-lg shadow-[var(--portal-primary-soft)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:py-4 sm:text-base"
          >
            Checkout & Bayar
          </button>
        </div>
      </div>
    </div>
  );
}
