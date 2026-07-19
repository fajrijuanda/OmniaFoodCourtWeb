import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type CustomerProduct = {
  id: string;
  name: string;
  price: number;
  variants: any[];
  modifierGroups: any[];
};

interface CustomerCustomizationModalProps {
  product: CustomerProduct | null;
  onClose: () => void;
  onConfirm: (
    product: CustomerProduct,
    quantity: number,
    variant?: any,
    modifiers?: any[],
    note?: string
  ) => void;
}

export function CustomerCustomizationModal({ product, onClose, onConfirm }: CustomerCustomizationModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any | undefined>();
  const [selectedModifiers, setSelectedModifiers] = useState<any[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setNote("");
      setSelectedVariant(product.variants?.length > 0 ? product.variants[0] : undefined);
      setSelectedModifiers([]);
    }
  }, [product]);

  if (!product) return null;

  const toggleModifier = (option: any, max: number) => {
    setSelectedModifiers((prev) => {
      const exists = prev.find((m) => m.id === option.id);
      if (exists) {
        return prev.filter((m) => m.id !== option.id);
      }
      if (prev.length < max) {
        return [...prev, option];
      }
      return prev;
    });
  };

  const handleConfirm = () => {
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
              <h2 className="text-xl font-black text-slate-900">{product.name}</h2>
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
            {product.variants?.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-black text-slate-900">Pilih Varian</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((variant) => {
                    const active = selectedVariant?.id === variant.id;
                    return (
                      <button
                         key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`flex items-center justify-between rounded-[14px] border p-3 transition ${
                          active
                            ? "border-orange-500 bg-orange-50 text-orange-600"
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
            {product.modifierGroups?.map((group) => {
              return (
                <div key={group.id}>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900">{group.name}</h3>
                    <span className="text-xs font-bold text-slate-400">
                      Pilih max {group.maxSelection}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {group.options.map((option: any) => {
                      const isSelected = !!selectedModifiers.find((m) => m.id === option.id);
                      return (
                        <button
                          key={option.id}
                          onClick={() => toggleModifier(option, group.maxSelection)}
                          className="flex w-full items-center justify-between rounded-[12px] border border-slate-100 p-3 hover:bg-slate-50"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`grid h-5 w-5 place-items-center rounded-[6px] border ${
                                isSelected
                                  ? "border-orange-500 bg-orange-500 text-white"
                                  : "border-slate-300"
                              }`}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5" />}
                            </div>
                            <span className="text-sm font-bold text-slate-900">{option.name}</span>
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
                </div>
              );
            })}

            {/* Note */}
            <div>
              <h3 className="mb-3 text-sm font-black text-slate-900">Catatan Khusus (Opsional)</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Contoh: Jangan pakai daun bawang, pedas dikit..."
                className="w-full rounded-[14px] border border-slate-200 bg-slate-50 p-3 text-sm font-semibold outline-none focus:border-orange-500 focus:bg-white"
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
              <span className="w-8 text-center font-black text-slate-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100 font-bold"
              >
                +
              </button>
            </div>
            <button
              onClick={handleConfirm}
              className="flex-1 rounded-full bg-orange-500 px-6 py-3 font-black text-white shadow-lg shadow-orange-500/20 transition hover:opacity-90 flex justify-between items-center"
            >
              <span>Tambah</span>
              <span>Rp{subtotal.toLocaleString("id-ID")}</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
