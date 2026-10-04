import { configureStore } from "@reduxjs/toolkit";
import { PlantsApi } from "../api/PlantApi";
import cartReducer, { populateCart } from "../api/CartSlice"
import uiReducer from '../api/uiSlice';
import recentlyViewedReducer from "../api/recentlyViewedSlice"
import wishlistSliceReducer, { loadWishlist } from "../api/wishlistSlice"

export const store = configureStore({
    reducer: {
        [PlantsApi.reducerPath]: PlantsApi.reducer,
        cart: cartReducer,
        ui: uiReducer,
        recentlyViewed: recentlyViewedReducer,
        wishlist: wishlistSliceReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(PlantsApi.middleware)
});

store.dispatch(populateCart())
// store.dispatch(getTotals())
store.dispatch(loadWishlist())