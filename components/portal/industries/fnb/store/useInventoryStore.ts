import { create } from "zustand";
import { CartItem } from "./usePosStore";

export interface PosIngredient {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minStockAlert: number;
}

export interface PosRecipeItem {
  ingredientId: string;
  quantityRequired: number;
}

export interface PosRecipe {
  id: string;
  productId: string;
  items: PosRecipeItem[];
}

export interface PosStockLog {
  id: string;
  ingredientId: string;
  changeAmount: number;
  finalStock: number;
  movementType: "IN" | "OUT";
  reason: "SALES" | "PURCHASE" | "ADJUSTMENT" | "WASTE";
  createdAt: string;
}

interface InventoryState {
  ingredients: PosIngredient[];
  recipes: PosRecipe[];
  stockLogs: PosStockLog[];
  adjustStock: (ingredientId: string, amount: number, reason: PosStockLog["reason"]) => void;
  deductStockForOrder: (items: CartItem[]) => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  ingredients: [],
  recipes: [],
  stockLogs: [],

  adjustStock: (ingredientId, amount, reason) => {
    set((state) => {
      const ingredient = state.ingredients.find(i => i.id === ingredientId);
      if (!ingredient) return state;

      const finalStock = ingredient.currentStock + amount;
      const log: PosStockLog = {
        id: crypto.randomUUID(),
        ingredientId,
        changeAmount: amount,
        finalStock,
        movementType: amount > 0 ? "IN" : "OUT",
        reason,
        createdAt: new Date().toISOString(),
      };

      return {
        ingredients: state.ingredients.map(i => 
          i.id === ingredientId ? { ...i, currentStock: finalStock } : i
        ),
        stockLogs: [log, ...state.stockLogs]
      };
    });
  },

  deductStockForOrder: (cartItems) => {
    const { recipes, adjustStock } = get();
    
    // Group required ingredients
    const deductionMap: Record<string, number> = {};

    cartItems.forEach(item => {
      const recipe = recipes.find(r => r.productId === item.product.id);
      if (recipe) {
        recipe.items.forEach(ri => {
          if (!deductionMap[ri.ingredientId]) deductionMap[ri.ingredientId] = 0;
          deductionMap[ri.ingredientId] += (ri.quantityRequired * item.quantity);
        });
      }
    });

    // Execute deductions
    Object.entries(deductionMap).forEach(([ingredientId, amountToDeduct]) => {
       adjustStock(ingredientId, -amountToDeduct, "SALES");
    });
  }
}));
