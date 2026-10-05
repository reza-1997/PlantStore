import { useState, useEffect } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    TextField,
    Button,
    InputAdornment,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
} from "@mui/material";

// Icons
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";

import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "../../../hooks/redux";
import { getCurrentUser, signInWithEmail } from "../../../services/authService";
import { getLoginSchema, type LoginFormData } from "../../../utils/loginSchema";
import { handleAuthError } from "../../../utils/authErrorHandler";
import { showNotification } from "../../../api/uiSlice";
import LogoutDialog from "../../common/LogoutDialog";
import { useLogoutModal } from "../../../hooks/useLogoutModal";
import UserDrawerSkeleton from "./UserDrawerSkeleton"; // Import skeleton
import { getImageUrl } from "../../../utils/imageUrl";

interface UserDrawerProps {
    open: boolean;
    onClose: () => void;
}

/**
 * Slide-out user drawer handling guest authentication and logged-in navigation.
 */
const UserDrawer = ({ open, onClose }: UserDrawerProps) => {
    const theme = useTheme();
    const { lang = "fa" } = useParams<{ lang: string }>();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [user, setUser] = useState<any>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch user details when drawer opens
    useEffect(() => {
        const checkUser = async () => {
            setIsCheckingAuth(true);
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } finally {
                setIsCheckingAuth(false); // Finish checking state
            }
        };
        if (open) {
            checkUser();
        }
    }, [open]);

    // Login form configuration
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(getLoginSchema(t)),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // Handle user login
    const onLoginSubmit = async (data: LoginFormData) => {
        setLoading(true);
        const { data: resData, error } = await signInWithEmail(data.email, data.password);
        setLoading(false);

        if (error) {
            const message = handleAuthError(error.message, t);
            dispatch(showNotification({ message, type: "error" }));
        } else {
            dispatch(showNotification({ message: t("login.success"), type: "success" }));
            setUser(resData?.user || null);
            reset();
        }
    };

    // Hook for managing logout modal state
    const {
        openLogoutModal,
        logoutLoading,
        handleOpenLogoutModal,
        handleCloseLogoutModal,
        handleConfirmLogout,
    } = useLogoutModal();

    // Confirm logout and close drawer
    const handleConfirmLogoutAndClose = async () => {
        await handleConfirmLogout();
        setUser(null);
        onClose(); // Close drawer after logout
    };

    // Account sidebar menu items
    const menuItems = [
        { text: t("account.menu.overview"), icon: <PersonOutlinedIcon />, disable: false, path: `/${lang}/account/overview` },
        { text: t("account.menu.addressBook"), icon: <HomeOutlinedIcon />, disable: true, path: `/${lang}/account/addresses` },
        { text: t("account.menu.myOrders"), icon: <ShoppingCartOutlinedIcon />, disable: true, path: `/${lang}/account/orders` },
        { text: t("account.menu.wishlist"), icon: <FavoriteBorderOutlinedIcon />, disable: false, path: `/${lang}/account/wishlist` },
        { text: t("account.menu.restockNotifications"), icon: <NotificationsNoneOutlinedIcon />, disable: true, path: `/${lang}/account/notifications` },
        { text: t("account.menu.privacy"), icon: <SecurityOutlinedIcon />, disable: true, path: `/${lang}/account/privacy` },
    ];

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            slotProps={{
                backdrop: {
                    sx: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
                },
                paper: {
                    sx: {
                        width: { xs: "100%", sm: 380 },
                        backgroundColor: theme.palette.background.paper,
                        display: "flex",
                        flexDirection: "column",
                    },
                },
            }}
        >
            {/* Close Button */}
            <IconButton
                onClick={onClose}
                sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 10,
                    color: user && !isCheckingAuth ? "#ffffff" : theme.palette.text.primary,
                    backgroundColor: user && !isCheckingAuth ? "rgba(0,0,0,0.2)" : "transparent",
                    "&:hover": {
                        backgroundColor: user && !isCheckingAuth ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.05)",
                    },
                }}
            >
                <CloseIcon />
            </IconButton>

            {/* Conditional Rendering Based on Auth State */}
            {isCheckingAuth ? (
                /* 1. Loading Skeleton State */
                <UserDrawerSkeleton />
            ) : user ? (
                /* 2. Authenticated User View */
                <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    {/* Top Header Banner */}
                    <Box
                        sx={{
                            position: "relative",
                            height: 160,
                            backgroundImage: `url(${getImageUrl("clematis-armandii-snowdrift2.jpg")})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            display: "flex",
                            alignItems: "flex-end",
                            p: 2.5,
                            "&::after": {
                                content: '""',
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 70%)",
                            },
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                color: "#ffffff",
                                fontWeight: 800,
                                zIndex: 1,
                                fontFamily: theme.typography.fontFamily,
                            }}
                        >
                            {t("common.hi")} {user.user_metadata?.first_name || user.email?.split("@")[0]}
                        </Typography>
                    </Box>

                    {/* Account Navigation List */}
                    <List sx={{ flexGrow: 1, py: 0 }}>
                        {menuItems.map((item, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    onClick={onClose}
                                    sx={{
                                        py: 1.5,
                                        px: 3,
                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                        "&:hover": { backgroundColor: theme.palette.action.hover },
                                    }}
                                    disabled={item.disable}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.primary }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        slotProps={{
                                            primary: { sx: { fontSize: "0.95rem", fontWeight: 500 } },
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}

                        {/* Logout Trigger */}
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleOpenLogoutModal}
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    px: 3,
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    "&:hover": { backgroundColor: theme.palette.action.hover },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: theme.palette.error.main }}>
                                    <LogoutOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={t("account.menu.logout")}
                                    slotProps={{
                                        primary: {
                                            sx: {
                                                fontSize: "0.95rem",
                                                fontWeight: 600,
                                                color: theme.palette.error.main,
                                            },
                                        },
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>

                    {/* Customer Support Footer */}
                    <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                        <Button
                            fullWidth
                            startIcon={<SupportAgentOutlinedIcon />}
                            sx={{
                                justifyContent: "flex-start",
                                color: theme.palette.text.secondary,
                                fontWeight: 600,
                            }}
                        >
                            {t("common.customerService") || "Customer service"}
                        </Button>
                    </Box>
                </Box>
            ) : (
                /* 3. Guest Login Form View */
                <Box sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, mt: 2 }}>
                        {t("common.hi")}!
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>
                        {t("login.title") || "Log in with email"}
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit(onLoginSubmit)}
                        noValidate
                        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                    >
                        {/* Email Field */}
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={t("login.email")}
                                    type="email"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    error={Boolean(errors.email)}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />

                        {/* Password Field */}
                        <Box>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t("login.password")}
                                        type={showPassword ? "text" : "password"}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        error={Boolean(errors.password)}
                                        helperText={errors.password?.message}
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                            size="small"
                                                        >
                                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />
                                )}
                            />

                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                                <Typography
                                    component={Link}
                                    to={`/${lang}/forgot-password`}
                                    onClick={onClose}
                                    variant="caption"
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        textDecoration: "underline",
                                        fontWeight: 600,
                                        "&:hover": { color: theme.palette.primary.main },
                                    }}
                                >
                                    {t("login.forgotPassword")}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading}
                            sx={{
                                mt: 1,
                                height: 48,
                                borderRadius: 8,
                                fontWeight: 700,
                                backgroundColor: theme.palette.primary.main,
                                "&:hover": { backgroundColor: theme.palette.primary.dark },
                            }}
                        >
                            {loading ? t("common.loading") : t("login.submitButton")}
                        </Button>
                    </Box>

                    {/* Registration Link */}
                    <Box sx={{ mt: 3, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                            {t("login.noAccount") || "No account yet?"}{" "}
                            <Typography
                                component={Link}
                                to={`/${lang}/register`}
                                onClick={onClose}
                                variant="body2"
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontWeight: 800,
                                    textDecoration: "underline",
                                    "&:hover": { color: theme.palette.primary.main },
                                }}
                            >
                                {t("login.createOneHere") || "Create one here!"}
                            </Typography>
                        </Typography>
                    </Box>
                </Box>
            )}

            {/* Logout Confirmation Dialog */}
            <LogoutDialog
                open={openLogoutModal}
                loading={logoutLoading}
                onClose={handleCloseLogoutModal}
                onConfirm={handleConfirmLogoutAndClose}
            />
        </Drawer>
    );
};

export default UserDrawer;