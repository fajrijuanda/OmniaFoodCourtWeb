import { create } from "zustand";
import type { CartItem } from "./usePosStore";

export type RestaurantTableStatus = "Available" | "Occupied" | "Reserved";
export type ReservationStatus = "Upcoming" | "Seated" | "Completed" | "Cancelled";

export interface RestaurantOpenBill {
  id: string;
  items: CartItem[];
  guestName: string | null;
  openedAt: string;
  updatedAt: string;
  kitchenSubmitted: boolean;
  submittedItemIds: string[];
}

export interface RestaurantTable {
  id: string;
  number: string;
  capacity: number;
  status: RestaurantTableStatus;
  guestName?: string;
  reservationId?: string;
  openBill?: RestaurantOpenBill;
}

export interface RestaurantReservation {
  id: string;
  guestName: string;
  pax: number;
  time: string;
  tableId: string;
  status: ReservationStatus;
  contact: string;
}

interface RestaurantState {
  tables: RestaurantTable[];
  reservations: RestaurantReservation[];
  saveOpenBill: (tableId: string, items: CartItem[], guestName?: string | null, submittedItemIds?: string[]) => void;
  closeOpenBill: (tableId: string) => void;
  createReservation: (data: Omit<RestaurantReservation, "id" | "status">) => void;
  checkInReservation: (reservationId: string) => RestaurantTable | null;
  cancelReservation: (reservationId: string) => void;
  completeReservationForTable: (tableId: string) => void;
}

const initialTables: RestaurantTable[] = [];

const initialReservations: RestaurantReservation[] = [];

const getAvailableStatusAfterReservation = (
  table: RestaurantTable,
  reservations: RestaurantReservation[],
): Pick<RestaurantTable, "status" | "guestName" | "reservationId"> => {
  const activeReservation = reservations.find(
    (reservation) => reservation.tableId === table.id && reservation.status === "Upcoming",
  );

  if (activeReservation) {
    return {
      status: "Reserved",
      guestName: activeReservation.guestName,
      reservationId: activeReservation.id,
    };
  }

  return {
    status: "Available",
    guestName: undefined,
    reservationId: undefined,
  };
};

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  tables: initialTables,
  reservations: initialReservations,

  saveOpenBill: (tableId, items, guestName = null, submittedItemIds) => {
    const now = new Date().toISOString();

    set((state) => ({
      tables: state.tables.map((table) => {
        if (table.id !== tableId) return table;

        return {
          ...table,
          status: "Occupied",
          guestName: guestName || table.guestName,
          openBill: {
            id: table.openBill?.id ?? crypto.randomUUID(),
            items,
            guestName: guestName || table.guestName || null,
            openedAt: table.openBill?.openedAt ?? now,
            updatedAt: now,
            kitchenSubmitted: true,
            submittedItemIds: submittedItemIds ?? items.map((item) => item.id),
          },
        };
      }),
    }));
  },

  closeOpenBill: (tableId) => {
    set((state) => ({
      tables: state.tables.map((table) => {
        if (table.id !== tableId) return table;

        const reservationPatch = getAvailableStatusAfterReservation(table, state.reservations);
        return {
          ...table,
          ...reservationPatch,
          openBill: undefined,
        };
      }),
    }));
    get().completeReservationForTable(tableId);
  },

  createReservation: (data) => {
    const reservation: RestaurantReservation = {
      ...data,
      id: crypto.randomUUID(),
      status: "Upcoming",
    };

    set((state) => ({
      reservations: [reservation, ...state.reservations],
      tables: state.tables.map((table) =>
        table.id === data.tableId && !table.openBill
          ? {
              ...table,
              status: "Reserved",
              guestName: data.guestName,
              reservationId: reservation.id,
            }
          : table,
      ),
    }));
  },

  checkInReservation: (reservationId) => {
    const { reservations, tables } = get();
    const reservation = reservations.find((item) => item.id === reservationId);
    if (!reservation) return null;

    let selectedTable: RestaurantTable | null = null;

    set((state) => ({
      reservations: state.reservations.map((item) =>
        item.id === reservationId ? { ...item, status: "Seated" } : item,
      ),
      tables: state.tables.map((table) => {
        if (table.id !== reservation.tableId) return table;

        selectedTable = {
          ...table,
          status: "Occupied",
          guestName: reservation.guestName,
          reservationId: reservation.id,
        };
        return selectedTable;
      }),
    }));

    return selectedTable ?? tables.find((table) => table.id === reservation.tableId) ?? null;
  },

  cancelReservation: (reservationId) => {
    set((state) => ({
      reservations: state.reservations.map((item) =>
        item.id === reservationId ? { ...item, status: "Cancelled" } : item,
      ),
      tables: state.tables.map((table) => {
        if (table.reservationId !== reservationId || table.openBill) return table;
        return {
          ...table,
          status: "Available",
          guestName: undefined,
          reservationId: undefined,
        };
      }),
    }));
  },

  completeReservationForTable: (tableId) => {
    set((state) => ({
      reservations: state.reservations.map((item) =>
        item.tableId === tableId && item.status === "Seated"
          ? { ...item, status: "Completed" }
          : item,
      ),
    }));
  },
}));
