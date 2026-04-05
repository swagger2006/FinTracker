import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initialTransactions } from "../data/mockData";

const defaultFilters = {
  query: "",
  type: "all",
  category: "all",
  sortBy: "newest",
};

export const useFinanceStore = create(
  persist(
    (set) => ({
      role: "Viewer",
      theme: "light",
      filters: defaultFilters,
      transactions: initialTransactions,

      setRole: (role) => set({ role }),
      setTheme: (theme) => set({ theme }),

      setFilter: (key, value) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value,
          },
        })),

      clearFilters: () => set({ filters: defaultFilters }),

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [tx, ...state.transactions],
        })),

      updateTransaction: (updatedTx) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === updatedTx.id ? updatedTx : tx,
          ),
        })),

      resetTransactions: () =>
        set({
          transactions: initialTransactions,
          filters: defaultFilters,
        }),
    }),
    {
      name: "fintracker-dashboard",
      partialize: (state) => ({
        role: state.role,
        theme: state.theme,
        filters: state.filters,
        transactions: state.transactions,
      }),
    },
  ),
);
