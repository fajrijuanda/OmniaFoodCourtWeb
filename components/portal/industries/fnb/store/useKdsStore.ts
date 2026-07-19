import { create } from "zustand";
import { CartItem } from "./usePosStore";

export type KitchenStatus = "NEW" | "PREPARING" | "COMPLETED";

export interface KitchenTicket {
  id: string;
  invoiceNumber: string;
  items: CartItem[];
  status: KitchenStatus;
  createdAt: string; // ISO string
  notes?: string;
}

interface KdsState {
  tickets: KitchenTicket[];
  addTicket: (invoiceNumber: string, items: CartItem[], notes?: string) => void;
  updateTicketStatus: (ticketId: string, status: KitchenStatus) => void;
  removeTicket: (ticketId: string) => void;
}

export const useKdsStore = create<KdsState>((set) => ({
  tickets: [],
  addTicket: (invoiceNumber, items, notes) => {
    set((state) => {
      const newTicket: KitchenTicket = {
        id: crypto.randomUUID(),
        invoiceNumber,
        items,
        status: "NEW",
        createdAt: new Date().toISOString(),
        notes,
      };
      return { tickets: [newTicket, ...state.tickets] };
    });
  },
  updateTicketStatus: (ticketId, status) => {
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId ? { ...t, status } : t
      ),
    }));
  },
  removeTicket: (ticketId) => {
    set((state) => ({
      tickets: state.tickets.filter((t) => t.id !== ticketId),
    }));
  },
}));
