import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchUserWishlist,
  addToWishlistApi,
  removeFromWishlistApi,
} from "../services/wishlistService";

interface WishlistState {
  items: string[];
  loading: boolean;
  pendingWishlistProductId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  pendingWishlistProductId: null,
  status: 'idle',
};

// Async Thunks
export const loadWishlist = createAsyncThunk("wishlist/load", async () => {
  return await fetchUserWishlist();
});

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async (productId: string, { getState }) => {
    const state = getState() as { wishlist?: WishlistState };

    const currentItems = state.wishlist?.items || [];
    const exists = currentItems.includes(productId);

    if (exists) {
      await removeFromWishlistApi(productId);
      return { productId, action: "remove" };
    } else {
      await addToWishlistApi(productId);
      return { productId, action: "add" };
    }
  }
);
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setPendingWishlistProductId: (state, action: PayloadAction<string | null>) => {
      state.pendingWishlistProductId = action.payload;
    },
    clearWishlist: (state) => {
      state.items = [];
      state.pendingWishlistProductId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(loadWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadWishlist.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { productId, action: act } = action.payload;
        if (act === "add") {
          state.items.push(productId);
        } else {
          state.items = state.items.filter((id) => id !== productId);
        }
      })
  },
});

export const { clearWishlist, setPendingWishlistProductId } = wishlistSlice.actions;
export default wishlistSlice.reducer;