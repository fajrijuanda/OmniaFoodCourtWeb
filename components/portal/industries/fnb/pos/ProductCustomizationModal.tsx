import React, { useState, useEffect } from "react";
import { PosProduct, PosProductVariant, PosModifierOption } from "../store/usePosStore";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCustomizationModalProps {
  product: PosProduct | null;
  onClose: () => void;
  onConfirm: (
    product: PosProduct,
    quantity: number,
    variant?: PosProductVariant,
    modifiers?: PosModifierOption[],
    note?: string
  ) => void;
}

export function ProductCustomizationModal({ product, onClose, onConfirm }: ProductCustomizationModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<PosProductVariant | undefined>();
  const [selectedModifiers, setSelectedModifiers] = useState<PosModifierOption[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setNote("");
      setSelectedVariant(product.variants.length > 0 ? product.variants[0] : undefined);
      setSelectedModifiers([]);
    }
  }, [product]);

  if (!product) return null;

  const toggleModifier = (groupOptionIds: string[], option: PosModifierOption, max: number) => {
    setSelectedModifiers((prev) => {
      const exists = prev.find((m) => m.id === option.id);
      if (exists) {
        return prev.filter((m) => m.id !== option.id);
      }
      const groupSelectionCount = prev.filter((item) => groupOptionIds.includes(item.id)).length;
      if (groupSelectionCount < max) {
        return [...prev, option];
      }
      return prev;
    });
  };

  const unmetRequiredGroups = product.modifierGroups.filter((group) => {
    const currentGroupSelections = selectedModifiers.filter((sm) =>
      group.options.some((option) => option.id === sm.id)
    );
    return currentGroupSelections.length < group.minSelection;
  });
  const canConfirm = unmetRequiredGroups.length === 0;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm(product, quantity, selectedVariant, selectedModifiers, note);
    onClose();
  };

  let currentPrice = product.price;
  if (selectedVariant) currentPrice += selectedVariant.priceAdjustment;
  selectedModifiers.forEach((m) => {
    currentPrice += m.priceAdjustment;
  });
  const subtotal = currentPrice * quantity;

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
          className="w-full max-w-lg overflow-hidden rounded-[24px] bg-white shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="text-xl font-black text-[#172033]">{product.name}</h2>
              <p className="text-sm font-bold text-slate-500">Rp{product.price.toLocaleString("id-ID")}</p>
            </div>
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Variants */}
            {product.variants.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-black text-[#172033]">Varian</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((variant) => {
                    const active = selectedVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`flex items-center justify-between rounded-[14px] border p-3 transition ${
                          active
                            ? "border-[var(--portal-primary)] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span className="font-bold text-sm">{variant.name}</span>
                        {variant.priceAdjustment > 0 && (
                          <span className="text-xs">+Rp{variant.priceAdjustment.toLocaleString("id-ID")}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modifiers */}
            {product.modifierGroups.map((group) => {
              const currentGroupSelections = selectedModifiers.filter((sm) =>
                group.options.find((o) => o.id === sm.id)
              );
              return (
                <div key={group.id}>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#172033]">{group.name}</h3>
                    <span className="text-xs font-bold text-slate-400">
                      {group.minSelection > 0 ? `Wajib ${group.minSelection}` : "Opsional"} · max {group.maxSelection}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {group.options.map((option) => {
                      const isSelected = !!selectedModifiers.find((m) => m.id === option.id);
                      const groupOptionIds = group.options.map((item) => item.id);
                      const isMaxReached = currentGroupSelections.length >= group.maxSelection && !isSelected;
                      return (
                        <button
                          key={option.id}
                          onClick={() => toggleModifier(groupOptionIds, option, group.maxSelection)}
                          disabled={isMaxReached}
                          className={`flex w-full items-center justify-between rounded-[12px] border border-slate-100 p-3 hover:bg-slate-50 ${
                            isMaxReached ? "opacity-50" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`grid h-5 w-5 place-items-center rounded-[6px] border ${
                                isSelected
                                  ? "border-[var(--portal-primary)] bg-[var(--portal-primary)] text-white"
                                  : "border-slate-300"
                              }`}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5" />}
                            </div>
                            <span className="text-sm font-bold text-[#172033]">{option.name}</span>
                          </div>
                          {option.priceAdjustment > 0 && (
                            <span className="text-xs font-bold text-slate-500">
                              +Rp{option.priceAdjustment.toLocaleString("id-ID")}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {currentGroupSelections.length < group.minSelection ? (
                    <p className="mt-2 text-xs font-bold text-rose-500">
                      Pilih minimal {group.minSelection} opsi.
                    </p>
                  ) : null}
                </div>
              );
            })}

            {/* Note */}
            <div>
              <h3 className="mb-3 text-sm font-black text-[#172033]">Catatan Khusus</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Contoh: Jangan pakai daun bawang..."
                className="w-full rounded-[14px] border border-slate-200 bg-slate-50 p-3 text-sm font-semibold outline-none focus:border-[var(--portal-primary)] focus:bg-white"
                rows={2}
              />
            </div>
          </div>

          <div className="border-t border-slate-100 p-5 bg-slate-50 flex items-center gap-4">
            <div className="flex h-12 items-center rounded-full bg-white px-2 border border-slate-200 shadow-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100 font-bold"
              >
                -
              </button>
              <span className="w-8 text-center font-black text-[#172033]">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100 font-bold"
              >
                +
              </button>
            </div>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="flex-1 rounded-full bg-[var(--portal-primary)] px-6 py-3 font-black text-[var(--portal-on-primary)] shadow-lg shadow-[var(--portal-primary-soft)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 flex justify-between items-center"
            >
              <span>{canConfirm ? "Tambah ke Keranjang" : "Lengkapi Opsi"}</span>
              <span>Rp{subtotal.toLocaleString("id-ID")}</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
