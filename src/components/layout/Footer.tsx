import {
    Box,
    Container,
    Grid,
    Typography,
    TextField,
    Button,
    IconButton,
    Divider,
    useTheme,
} from "@mui/material";
import {
    Facebook,
    Pinterest,
    YouTube,
    Instagram,
} from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaTiktok } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/authService";
import { supabase } from "../../config/supabaseClient";
import { useLogoutModal } from "../../hooks/useLogoutModal";
import LogoutDialog from "../common/LogoutDialog";
import { getImageUrl } from "../../utils/imageUrl";

const Footer = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { lang = "fa" } = useParams<{ lang: string }>();


    // Supabase User State
    const [user, setUser] = useState<any>(null);

    // Listen to Supabase auth state changes
    useEffect(() => {
        getCurrentUser().then((currentUser) => setUser(currentUser));

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // Hook for managing logout modal state
    const {
        openLogoutModal,
        logoutLoading,
        handleOpenLogoutModal,
        handleCloseLogoutModal,
        handleConfirmLogout,
    } = useLogoutModal();

    // Common style for links with hover effect (Color change + Underline)
    const linkStyle = {
        color: "inherit",
        textDecoration: "none",
        opacity: 0.85,
        fontSize: "0.9rem",
        transition: "all 0.2s ease-in-out",
        cursor: 'pointer',

        "&:hover": {
            opacity: 1,
            color: theme.palette.secondary.main,
            textDecoration: "underline",
            textUnderlineOffset: "4px",
        },
    };

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                pt: 8,
                pb: 3,
                width: '100%',
                zIndex:1
            }}
        >
            <Container
                maxWidth={false}
                disableGutters
                sx={{
                    width: { xs: "95%", sm: "95%", md: "95%", lg: "93%", xl: "84%" },
                    mx: "auto",
                }}>
                {/* Main Footer Links & Newsletter */}
                <Grid container spacing={4} sx={{ justifyContent: "space-between" }}>
                    {/* Brand Logo */}
                    <Grid size={{ md: 2 }}
                        sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-start' }}
                    >
                        <Typography
                            component={Link}
                            to={`/${lang}`}
                            sx={{
                                display: "flex",
                                mb: 3,
                            }}
                        >
                            <Box
                                component={'img'}
                                src={getImageUrl("flowerShopFooter.png")}
                                alt="flowerShop"
                                sx={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </Typography>
                    </Grid>

                    {/* Shop & Account Links */}
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                            {t("footer.shop")}
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
                            <Box component={Link} to={`/${lang}/products`} sx={linkStyle}>
                                {t("footer.allPlants")}
                            </Box>
                            <Box component={Link} to={`/${lang}/accessories`} sx={linkStyle}>
                                {t("footer.babyPlants")}
                            </Box>
                        </Box>

                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                            {t("footer.myAccount")}
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {user ? (
                                    <>
                                        <Box component={Link} to={`/${lang}/account/overview`} sx={linkStyle}>
                                            {t("footer.accountOverview")}
                                        </Box>
                                        <Box component={Link} to={`/${lang}/account/orders`} sx={linkStyle}>
                                            {t("footer.myOrders")}
                                        </Box>
                                        <Box onClick={handleOpenLogoutModal}
                                            sx={linkStyle}>
                                            {t("footer.logout")}
                                        </Box>
                                    </>
                                ) : (
                                    <Box component={Link} to={`/${lang}/login`} sx={linkStyle}>
                                        {t("footer.login")}
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    {/* Customer Service Links */}
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                            {t("footer.customerService")}
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Box component={Link} to={`/${lang}/faq`} sx={linkStyle}>
                                {t("footer.faq")}
                            </Box>
                            <Box component={Link} to={`/${lang}/contact`} sx={linkStyle}>
                                {t("footer.contact")}
                            </Box>
                            <Box component={Link} to={`/${lang}/payments`} sx={linkStyle}>
                                {t("footer.payments")}
                            </Box>
                            <Box component={Link} to={`/${lang}/shipping`} sx={linkStyle}>
                                {t("footer.shipping")}
                            </Box>
                            <Box component={Link} to={`/${lang}/guarantee`} sx={linkStyle}>
                                {t("footer.guarantee",)}
                            </Box>
                            <Box component={Link} to={`/${lang}/returns`} sx={linkStyle}>
                                {t("footer.returns")}
                            </Box>
                        </Box>
                    </Grid>

                    {/* About Brand Links */}
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                            {t("footer.about")}
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Box component={Link} to={`/${lang}/about`} sx={linkStyle}>
                                {t("footer.aboutUs",)}
                            </Box>
                            <Box component={Link} to={`/${lang}/sustainability`} sx={linkStyle}>
                                {t("footer.sustainability")}
                            </Box>
                            <Box component={Link} to={`/${lang}/collaborations`} sx={linkStyle}>
                                {t("footer.collaborations")}
                            </Box>
                            <Box component={Link} to={`/${lang}/jobs`} sx={linkStyle}>
                                {t("footer.jobs")}
                            </Box>
                        </Box>
                    </Grid>

                    {/* Social Icons & Newsletter Subscription */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        {/* Social Media Links */}
                        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                            {[
                                { icon: <Instagram />, href: "#" },
                                { icon: <Facebook />, href: "#" },
                                { icon: <Pinterest />, href: "#" },
                                { icon: <YouTube />, href: "#" },
                                { icon: <FaTiktok size={18} />, href: "#" },
                            ].map((item, idx) => (
                                <IconButton
                                    key={idx}
                                    component="a"
                                    href={item.href}
                                    sx={{
                                        color: theme.palette.primary.main,
                                        bgcolor: theme.palette.primary.contrastText,
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            bgcolor: theme.palette.primary.light,
                                            color: theme.palette.primary.contrastText,
                                            transform: "translateY(-2px)",
                                        },
                                        width: 36,
                                        height: 36,
                                    }}
                                >
                                    {item.icon}
                                </IconButton>
                            ))}
                        </Box>

                        {/* Newsletter Form */}
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                            {t("footer.newsletterTitle")}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                            {t("footer.newsletterSub")}
                        </Typography>

                        <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                            <TextField
                                placeholder={t("footer.emailPlaceholder")}
                                size="small"
                                variant="outlined"
                                sx={{
                                    bgcolor: theme.palette.background.paper,
                                    borderRadius: 1,
                                    input: { color: theme.palette.text.primary },
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                sx={{
                                    py: 1,
                                    fontWeight: 700,
                                    borderRadius: 1,
                                    boxShadow: "none",
                                    "&:hover": {
                                        boxShadow: theme.shadows[2],
                                    },
                                }}
                            >
                                {t("footer.subscribeBtn")}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Bottom Bar: Payment Methods, Legal Links & Copyright */}
            <Box
                sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.secondary,
                    mt: 6,
                    pt: 2,
                    pb: 2,
                }}
            >
                <Container maxWidth={false} sx={{
                    width: { xs: "95%", sm: "95%", md: "95%", lg: "93%", xl: "84%" },
                    px: "0 !important",
                    mx: "auto",
                }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        {/* Accepted Payment Badges */}
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            {["Visa", "MasterCard", "PayPal", "ApplePay"].map((pay, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 1,
                                        px: 1.5,
                                        py: 0.5,
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                    }}
                                >
                                    {pay}
                                </Box>
                            ))}
                        </Box>

                        {/* Legal & Policy Links */}
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Box component={Link} to={`/${lang}/terms`} sx={{ ...linkStyle, fontSize: "0.85rem" }}>
                                {t("footer.terms")}
                            </Box>
                            <Box component={Link} to={`/${lang}/privacy`} sx={{ ...linkStyle, fontSize: "0.85rem" }}>
                                {t("footer.privacy")}
                            </Box>
                            <Box component={Link} to={`/${lang}/cookies`} sx={{ ...linkStyle, fontSize: "0.85rem" }}>
                                {t("footer.cookies")}
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Copyright Note */}
                    <Typography variant="body2" sx={{ textAlign: "center", opacity: 0.7, fontSize: "0.8rem" }}>
                        © {new Date().getFullYear()} - REZA Plant Shop. All rights reserved.
                    </Typography>
                </Container>
            </Box>

            {/* Logout Confirmation Dialog */}
            <LogoutDialog
                open={openLogoutModal}
                loading={logoutLoading}
                onClose={handleCloseLogoutModal}
                onConfirm={handleConfirmLogout}
            />
        </Box>
    );
};

export default Footer;