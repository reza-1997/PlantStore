import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "./redux";
import { getCurrentUser } from "../services/authService";
import { showNotification } from "../api/uiSlice";
import { loadWishlist, setPendingWishlistProductId, toggleWishlist } from "../api/wishlistSlice";
import type { Plant, Accessory } from "../types";

export const useWishlist = (item: Plant | Accessory) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [authModalOpen, setAuthModalOpen] = useState(false);

    const wishlistItems = useAppSelector((state) => state.wishlist.items || []);
    const isFavorite = wishlistItems.some((id) => String(id) === String(item.id));

    const handleWishlistClick = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const currentUser = await getCurrentUser();

        if (!currentUser) {
            dispatch(setPendingWishlistProductId(item.id));
            setAuthModalOpen(true);
            return;
        }

        try {
            const res = await dispatch(
                toggleWishlist(item.id)
            ).unwrap();

            const message =
                res.action === "add"
                    ? t("wishlist.addedSuccess")
                    : t("wishlist.removedSuccess");

            dispatch(
                showNotification({
                    message,
                    type: res.action === "add" ? "success" : "warning",
                })
            );
        } catch (error) {
            dispatch(
                showNotification({
                    message: t("errors.default"),
                    type: "error",
                })
            );
            dispatch(loadWishlist());
            console.error(error);
        }
    };

    return {
        isFavorite,
        handleWishlistClick,
        authModalOpen,
        setAuthModalOpen,
    };
};