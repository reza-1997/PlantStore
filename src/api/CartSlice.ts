import { createEntityAdapter, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Accessory, LocalizedString, Plant, PotOptionColor, RootState } from "../types";

export type CartItem = (Plant | Accessory) & {
    cartItemId: string
    cartQty: number;
    finalPrice: number;
    finalPricePaid: number
    potOption: {
        name: LocalizedString;
        value: string;
        colors: PotOptionColor
    } | null;
};

export const createCartItemId = (item: CartItem) => {
    if (!item.potOption) {
        return item.id;
    }

    return `${item.id}-${item.potOption.value}-${item.potOption.colors.value}`;
};

const cartAdapter = createEntityAdapter<CartItem, string>({
    selectId: (item) => item.cartItemId
});

// Helper function to calculate the total number of orders for a physical product in the shopping cart (excluding the current item)
const getOtherVariationsQty = (
    entities: Record<string, CartItem | undefined>,
    productId: string,
    currentCartItemId: string
): number => {
    return Object.values(entities).reduce((total, item) => {
        if (item && item.id === productId && item.cartItemId !== currentCartItemId) {
            return total + item.cartQty;
        }
        return total;
    }, 0);
};

// Helper function to sync with localStorage and recalculate totals
const syncCartState = (state: ReturnType<typeof cartAdapter.getInitialState<{
    cartTotalQty: number; cartTotalAmount: number, cartTotalAmountPaid: number, cartTotalProfit: number
}>>) => {
    const items = Object.values(state.entities).filter((item): item is CartItem => Boolean(item));

    // Recalculate totals
    let totalAmount = 0;
    let totalProfit = 0
    let totalAmountPaid = 0
    let totalQty = 0;


    for (const item of items) {
        totalAmount += item.finalPrice * item.cartQty;
        totalProfit += (item.price - (item.discountPrice ?? item.price)) * item.cartQty;
        totalAmountPaid += item.finalPricePaid * item.cartQty;
        totalQty += item.cartQty;
    }

    state.cartTotalQty = totalQty;
    state.cartTotalAmount = Math.round(totalAmount);
    state.cartTotalAmountPaid = Math.round(totalAmountPaid)
    state.cartTotalProfit = totalProfit


    // Save array to localStorage
    localStorage.setItem("cartItem", JSON.stringify(items));
};

const initialState = cartAdapter.getInitialState({
    cartTotalQty: 0,
    cartTotalAmount: 0,
    cartTotalAmountPaid: 0,
    cartTotalProfit: 0
});

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        populateCart(state) {
            const savedCart = localStorage.getItem("cartItem");

            if (savedCart) {
                try {
                    const parsedCart: CartItem[] = JSON.parse(savedCart);
                    if (Array.isArray(parsedCart)) {
                        cartAdapter.setAll(state, parsedCart);
                        syncCartState(state);
                    }
                } catch (error) {
                    console.error("Failed to parse cart from localStorage:", error);
                }
            }
        },

        addToCart(state, action: PayloadAction<CartItem>) {
            const newItem = action.payload;
            const cartItemId = createCartItemId(newItem);
            const existingProduct = state.entities[cartItemId];

            const otherVariationsQty = getOtherVariationsQty(state.entities, newItem.id, cartItemId)
            const remainingStockForThisItem = Math.max(0, newItem.stock - otherVariationsQty)

            if (existingProduct) {

                const currentCartQty = existingProduct.cartQty;
                const requestedQty = newItem.cartQty || 1
                const newTotalQty = currentCartQty + requestedQty

                existingProduct.cartQty = Math.min(newTotalQty, remainingStockForThisItem)

            } else {
                const safeQty = Math.min(newItem.cartQty || 1, remainingStockForThisItem)

                if (safeQty > 0) {
                    cartAdapter.addOne(state, {
                        ...newItem,
                        cartQty: safeQty,
                        cartItemId: createCartItemId(newItem),
                    });
                }
            }

            syncCartState(state);
        },
        increaseCart(
            state,
            action: PayloadAction<string>
        ) {
            const cartItemId = action.payload;
            const product = state.entities[cartItemId];

            if (!product) return;

            const totalQtyInCart = Object.values(state.entities).reduce((total, item) => {
                if (item && item.id === product.id) {
                    return total + item.cartQty;
                }
                return total;
            }, 0);


            if (totalQtyInCart >= product.stock) return;

            product.cartQty += 1;

            syncCartState(state);

        },

        decreaseCart(state, action: PayloadAction<{ id: string }>) {
            const product = state.entities[action.payload.id];
            if (!product) return;

            if (product.cartQty > 1) {
                product.cartQty -= 1;
            } else {
                cartAdapter.removeOne(state, action.payload.id);
            }

            syncCartState(state);
        },

        deleteFromCart(state, action: PayloadAction<{ id: string }>) {
            cartAdapter.removeOne(state, action.payload.id);
            syncCartState(state);
        },

        clearCart(state) {
            cartAdapter.removeAll(state);
            syncCartState(state);
        },
    },
});

export const { addToCart, decreaseCart, deleteFromCart, populateCart, clearCart, increaseCart } = cartSlice.actions;

// Selectors
export const {
    selectAll: selectAllCartItems,
    selectById: selectCartItemById,
    selectTotal: selectCartTotalCount,
    selectEntities: selectCartEntities,
} = cartAdapter.getSelectors((state: RootState) => state.cart);

// Custom Selectors for Totals
export const selectCartTotalQty = (state: RootState) => state.cart.cartTotalQty;
export const selectCartTotalAmount = (state: RootState) => state.cart.cartTotalAmount;
export const selectCartTotalAmountPaid = (state: RootState) => state.cart.cartTotalAmountPaid;
export const selectCartTotalProfit = (state: RootState) => state.cart.cartTotalProfit;
export const selectTotalQtyByProductId = (productId: string) => (state: RootState) => {
    return Object.values(state.cart.entities).reduce((total, item) => {
        if (item && item.id === productId) {
            return total + item.cartQty;
        }
        return total;
    }, 0);
};


export default cartSlice.reducer;