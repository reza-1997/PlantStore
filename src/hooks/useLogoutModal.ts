import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { signOut } from "../services/authService";
import { useAppDispatch } from "./redux";
import { showNotification } from "../api/uiSlice";
import { clearWishlist } from "../api/wishlistSlice";
import { handleAuthError } from "../utils/authErrorHandler";

//  Custom hook to manage user logout modal state and actions.
export const useLogoutModal = () => {
    const { lang = "fa" } = useParams<{ lang: string }>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [openLogoutModal, setOpenLogoutModal] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    // Open logout confirmation dialog
    const handleOpenLogoutModal = () => setOpenLogoutModal(true);

    // Close logout confirmation dialog
    const handleCloseLogoutModal = () => setOpenLogoutModal(false);

    // Execute user sign-out
    const handleConfirmLogout = async () => {
        setLogoutLoading(true);
        const { error } = await signOut();
        setLogoutLoading(false);

        if (!error) {
            dispatch(clearWishlist());
            setOpenLogoutModal(false);
            dispatch(showNotification({ message: t("account.logoutSuccess"), type: "success" }));
            navigate(`/${lang}`);
        } else {
            const translatedError = handleAuthError(error.message, t);
            dispatch(showNotification({ message: translatedError, type: "error" }));
        }
    };

    return {
        openLogoutModal,
        logoutLoading,
        handleOpenLogoutModal,
        handleCloseLogoutModal,
        handleConfirmLogout,
    };
};