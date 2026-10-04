import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Accessory, Plant, RootState } from "../types";


interface RecentlyViewedState {
    items: (Plant | Accessory)[];
}

const getInitialState = (): RecentlyViewedState => {
    const saved = localStorage.getItem("recentlyViewed");
    return {
        items: saved ? JSON.parse(saved) : [],
    };
};

const recentlyViewedSlice = createSlice({
    name: "recentlyViewed",
    initialState: getInitialState(),
    reducers: {
        addRecentlyViewed(state, action: PayloadAction<Plant | Accessory>) {
            const newItem = action.payload;
            
            const filteredItems = state.items.filter((item) => item.id !== newItem.id);

            const updatedItems = [newItem, ...filteredItems].slice(0, 10); 

            state.items = updatedItems;
            localStorage.setItem("recentlyViewed", JSON.stringify(updatedItems));
        },
    },
});

export const { addRecentlyViewed } = recentlyViewedSlice.actions;

export const selectRecentlyViewed = (state: RootState) => state.recentlyViewed.items;

export default recentlyViewedSlice.reducer;