import { create } from "zustand";

export interface PosProductVariant {
  id: string;
  name: string;
  priceAdjustment: number;
}

export interface PosModifierOption {
  id: string;
  name: string;
  priceAdjustment: number;
}

export interface PosModifierGroup {
  id: string;
  name: string;
  minSelection: number;
  maxSelection: number;
  options: PosModifierOption[];
}

export interface PosProduct {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isBestSeller?: boolean;
  isAvailable: boolean;
  variants: PosProductVariant[];
  modifierGroups: PosModifierGroup[];
}

export interface PosCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface PosPromoBanner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
}

export interface CartItem {
  id: string; // unique cart item id
  product: PosProduct;
  quantity: number;
  variant?: PosProductVariant;
  modifiers: PosModifierOption[];
  note?: string;
  priceAtSale: number; // calculated unit price including variant/modifiers
}

interface PosState {
  cart: CartItem[];
  taxRate: number; // e.g. 0.1 for 10%
  orderType: "dine-in" | "takeaway" | "delivery";
  tableId: string | null;
  guestName: string | null;
  // Actions
  addToCart: (
    product: PosProduct,
    quantity: number,
    variant?: PosProductVariant,
    modifiers?: PosModifierOption[],
    note?: string
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  resetCartOnly: () => void;
  setTaxRate: (rate: number) => void;
  setOrderInfo: (type: "dine-in" | "takeaway" | "delivery", tableId?: string | null, guestName?: string | null) => void;
  loadTableOrder: (tableId: string, guestName?: string | null, cart?: CartItem[]) => void;
  // Selectors/Computed
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
}

export const usePosStore = create<PosState>((set, get) => ({
  cart: [],
  taxRate: 0.1, // Default 10% PB1
  orderType: "dine-in",
  tableId: null,
  guestName: null,
  addToCart: (product, quantity, variant, modifiers = [], note) => {
    set((state) => {
      let unitPrice = product.price;
      if (variant) unitPrice += variant.priceAdjustment;
      modifiers.forEach((m) => {
        unitPrice += m.priceAdjustment;
      });

      const newItem: CartItem = {
        id: crypto.randomUUID(),
        product,
        quantity,
        variant,
        modifiers,
        note,
        priceAtSale: unitPrice,
      };
      
      // We could group identical items, but since they can have complex modifiers/notes, 
      // adding them as separate line items is often safer in F&B unless everything matches exactly.
      // For MVP, just append.
      return { cart: [...state.cart, newItem] };
    });
  },
  removeFromCart: (cartItemId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== cartItemId),
    }));
  },
  updateQuantity: (cartItemId, delta) => {
    set((state) => ({
      cart: state.cart
        .map((item) => {
          if (item.id === cartItemId) {
            const newQ = item.quantity + delta;
            return { ...item, quantity: Math.max(0, newQ) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    }));
  },
  clearCart: () => set({ cart: [], tableId: null, guestName: null, orderType: "dine-in" }),
  resetCartOnly: () => set({ cart: [] }),
  setTaxRate: (rate) => set({ taxRate: rate }),
  setOrderInfo: (type, tableId = null, guestName = null) => set({ orderType: type, tableId, guestName }),
  loadTableOrder: (tableId, guestName = null, cart = []) =>
    set({
      orderType: "dine-in",
      tableId,
      guestName,
      cart,
    }),
  getSubtotal: () => {
    const { cart } = get();
    return cart.reduce((sum, item) => sum + item.priceAtSale * item.quantity, 0);
  },
  getTax: () => {
    const { getSubtotal, taxRate } = get();
    return getSubtotal() * taxRate;
  },
  getTotal: () => {
    const { getSubtotal, getTax } = get();
    return getSubtotal() + getTax();
  },
}));
