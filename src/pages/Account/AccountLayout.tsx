import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Box,
    Container,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme,
} from "@mui/material";

// Icons
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useLogoutModal } from "../../hooks/useLogoutModal";
import { getCurrentUser } from "../../services/authService";
import LogoutDialog from "../../components/common/LogoutDialog";
import AccountLayoutSkeleton from "./skeleton/AccountLayoutSkeleton";

/**
 * Shared layout component for account pages containing a persistent sidebar.
 */
const AccountLayout = () => {
    const theme = useTheme();
    const { lang = "fa" } = useParams<{ lang: string }>();
    const { t } = useTranslation();
    const location = useLocation();

    // Logout modal state handler
    const {
        openLogoutModal,
        logoutLoading,
        handleOpenLogoutModal,
        handleCloseLogoutModal,
        handleConfirmLogout,
    } = useLogoutModal();

    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch user info for greeting header
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getCurrentUser();
                if (user) {
                    setUserName(user.user_metadata?.first_name || user.email?.split("@")[0] || "");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // show skeleton if loading
    if (loading) {
        return <AccountLayoutSkeleton />;
    }

    // Account sidebar navigation items
    const menuItems = [
        { text: t("account.menu.overview"), icon: <PersonOutlinedIcon />, disable: false, path: `/${lang}/account/overview` },
        { text: t("account.menu.addressBook"), icon: <HomeOutlinedIcon />, disable: true, path: `/${lang}/account/addresses` },
        { text: t("account.menu.myOrders"), icon: <ShoppingCartOutlinedIcon />, disable: true, path: `/${lang}/account/orders` },
        { text: t("account.menu.wishlist"), icon: <FavoriteBorderOutlinedIcon />, disable: false, path: `/${lang}/account/wishlist` },
        { text: t("account.menu.restockNotifications"), icon: <NotificationsNoneOutlinedIcon />, disable: true, path: `/${lang}/account/notifications` },
        { text: t("account.menu.privacy"), icon: <SecurityOutlinedIcon />, disable: true, path: `/${lang}/account/privacy` },
    ];

    return (
        <Box sx={{ width: "100%", backgroundColor: theme.palette.background.paper, minHeight: "85vh", py: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    {/* Fixed Account Sidebar */}
                    <Grid size={{ xs: 12, md: 3.5, lg: 3 }}>
                        <Box
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                color: "#ffffff",
                                borderRadius: 2,
                                p: { xs: 2.5, md: 3 },
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                sticky: "top",
                                top: 20,
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: "#ffffff" }}>
                                {t("account.greeting", { name: userName })}
                            </Typography>

                            <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                {menuItems.map((item, index) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <ListItem key={index} disablePadding>
                                            <ListItemButton
                                                component={Link}
                                                to={item.path}
                                                sx={{
                                                    borderRadius: 1.5,
                                                    px: 1.5,
                                                    py: 1,
                                                    backgroundColor: isActive ? "rgba(255, 255, 255, 0.15)" : "transparent",
                                                    "&:hover": {
                                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                                    },
                                                }}
                                                disabled={item.disable}
                                            >
                                                <ListItemIcon sx={{ color: "#ffffff", minWidth: 36 }}>
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item.text}
                                                    slotProps={{
                                                        primary: {
                                                            sx: {
                                                                fontSize: "0.95rem",
                                                                fontWeight: isActive ? 700 : 500,
                                                                color: "#ffffff",
                                                            },
                                                        },
                                                    }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}

                                {/* Logout Button */}
                                <ListItem disablePadding sx={{ mt: 1 }}>
                                    <ListItemButton
                                        onClick={handleOpenLogoutModal}
                                        sx={{
                                            borderRadius: 1.5,
                                            px: 1.5,
                                            py: 1,
                                            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: "#ffffff", minWidth: 36 }}>
                                            <LogoutOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={t("account.menu.logout")}
                                            slotProps={{
                                                primary: { sx: { fontSize: "0.95rem", fontWeight: 500, color: "#ffffff" } },
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Box>
                    </Grid>

                    {/* Main Content Area Rendered via Router Outlet */}
                    <Grid size={{ xs: 12, md: 8.5, lg: 9 }}>
                        <Box sx={{ pl: { md: 2 } }}>
                            <Outlet />
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Shared Logout Confirmation Modal */}
            <LogoutDialog
                open={openLogoutModal}
                loading={logoutLoading}
                onClose={handleCloseLogoutModal}
                onConfirm={handleConfirmLogout}
            />
        </Box>
    );
};

export default AccountLayout;