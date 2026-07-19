import { create } from "zustand";

export type BakeryPreOrderStatus = "New" | "Confirmed" | "In Production" | "Ready" | "Completed" | "Cancelled";
export type WholesaleOrderStatus = "Draft" | "Confirmed" | "Packed" | "Delivered" | "Invoiced";

export interface BakeryPreOrder {
  id: string;
  customerName: string;
  contact: string;
  productName: string;
  pickupDate: string;
  pickupTime: string;
  quantity: number;
  depositPaid: number;
  totalAmount: number;
  status: BakeryPreOrderStatus;
  notes: string;
}

export interface WholesaleCustomer {
  id: string;
  name: string;
  channel: "Hotel" | "Cafe" | "Reseller" | "Corporate";
  priceTier: "Silver" | "Gold" | "Platinum";
  paymentTerms: string;
}

export interface WholesaleOrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface WholesaleOrder {
  id: string;
  customerId: string;
  deliveryDate: string;
  status: WholesaleOrderStatus;
  items: WholesaleOrderItem[];
}

interface BakeryState {
  preOrders: BakeryPreOrder[];
  wholesaleCustomers: WholesaleCustomer[];
  wholesaleOrders: WholesaleOrder[];
  createPreOrder: (data: Omit<BakeryPreOrder, "id" | "status">) => void;
  updatePreOrderStatus: (id: string, status: BakeryPreOrderStatus) => void;
  createWholesaleOrder: (data: Omit<WholesaleOrder, "id" | "status">) => void;
  updateWholesaleOrderStatus: (id: string, status: WholesaleOrderStatus) => void;
}

const preOrders: BakeryPreOrder[] = [];

const wholesaleCustomers: WholesaleCustomer[] = [];

const wholesaleOrders: WholesaleOrder[] = [];

export const useBakeryStore = create<BakeryState>((set) => ({
  preOrders,
  wholesaleCustomers,
  wholesaleOrders,

  createPreOrder: (data) => {
    const order: BakeryPreOrder = {
      ...data,
      id: `po-${Math.floor(Math.random() * 9000) + 1000}`,
      status: "New",
    };

    set((state) => ({ preOrders: [order, ...state.preOrders] }));
  },

  updatePreOrderStatus: (id, status) => {
    set((state) => ({
      preOrders: state.preOrders.map((order) => (order.id === id ? { ...order, status } : order)),
    }));
  },

  createWholesaleOrder: (data) => {
    const order: WholesaleOrder = {
      ...data,
      id: `wo-${Math.floor(Math.random() * 9000) + 1000}`,
      status: "Draft",
    };

    set((state) => ({ wholesaleOrders: [order, ...state.wholesaleOrders] }));
  },

  updateWholesaleOrderStatus: (id, status) => {
    set((state) => ({
      wholesaleOrders: state.wholesaleOrders.map((order) => (order.id === id ? { ...order, status } : order)),
    }));
  },
}));
