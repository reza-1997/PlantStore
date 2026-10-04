import { useState } from "react";
import {
    Box,
    Button,
    Divider,
    Grid,
    IconButton,
    Typography,
    useTheme,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
    decreaseCart,
    deleteFromCart,
    increaseCart,
    selectAllCartItems,
    selectCartTotalAmount,
    selectCartTotalAmountPaid,
    selectCartTotalProfit,
    selectCartTotalQty,
} from "../api/CartSlice";

import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CustomNumeralNumericFormat from "../components/common/CustomNumber";

import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { Celebration } from "@mui/icons-material";

import type { Accessory, Plant } from "../types";
import ScrollAnimate from "../components/common/ScrollAnimate";
import { showNotification } from "../api/uiSlice";
import RecentlyViewedProducts from "../components/common/RecentlyViewedProducts";
import { useAuth } from "../hooks/useAuth";
import GuestAuthStep from "./GuestAuthStep";
import { getImageUrl } from "../utils/imageUrl";

const Cart = () => {
    const theme = useTheme();
    const { lang = "fa" } = useParams<{ lang: string }>();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const { user } = useAuth();
    const [isAuthStep, setIsAuthStep] = useState(false);

    const cart = useAppSelector(selectAllCartItems);
    const totalQty = useAppSelector(selectCartTotalQty);
    const totalAmount = useAppSelector(selectCartTotalAmount);
    const totalAmountPaid = useAppSelector(selectCartTotalAmountPaid);
    const totalProfit = useAppSelector(selectCartTotalProfit);

    const isPlant = (item: Plant | Accessory): item is Plant => {
        return "potSize" in item.specifications;
    };

    const handleCheckoutClick = () => {
        if (!user) {
            setIsAuthStep(true);
        } else {
            // هدایت به آدرس دهی
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.paper,
                py: { xs: 3, md: 6 },
                width: "100%",
                display: "flex",
                flexDirection: 'column',
                alignItems: "center",
                minHeight: "70vh",
            }}
        >
            <Box sx={{ width: { xs: "95%", sm: "95%", md: "95%", lg: "93%", xl: "84%" }, mb: 7 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
                    {isAuthStep ? t("checkout.enterDetails") : t("cart.label")}
                </Typography>

                {cart.length === 0 ? (
                    <Box
                        sx={{
                            minHeight: 400,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 2,
                            textAlign: "center",
                        }}
                    >
                        <ShoppingCartOutlinedIcon sx={{ fontSize: 90, color: theme.palette.text.secondary }} />
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            {t("cart.emptyCart")}
                        </Typography>
                        <Button
                            component={Link}
                            to={`/${lang}/products`}
                            variant="contained"
                            sx={{ mt: 2, borderRadius: 2, px: 4 }}
                        >
                            {t("cart.continueShopping")}
                        </Button>
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {/* سمت چپ: نمایش لیست کالاها یا استپ ورود */}
                        <Grid size={{ xs: 12, md: 8 }}>
                            {isAuthStep ? (
                                <GuestAuthStep lang={lang} onBackToCart={() => setIsAuthStep(false)} />
                            ) : (
                                <Box sx={{ width: "100%", minHeight: { lg: "40vh" } }}>
                                    {cart.map((item, index) => {
                                        const price = item.finalPrice ?? item.discountPrice ?? item.price;
                                        const hasDiscount = Boolean(item.discountPrice);
                                        const isMaxStock = item.cartQty >= item.stock;

                                        return (
                                            <ScrollAnimate key={item.cartItemId || item.id}>
                                                <Box>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            gap: { xs: 1.5, sm: 2 },
                                                            p: { xs: 1, sm: 2 },
                                                            minHeight: { xs: 150, sm: 170 },
                                                            alignItems: "stretch",
                                                        }}
                                                    >
                                                        <Box
                                                            component={Link}
                                                            to={`/${lang}/product/${item.slug}`}
                                                            sx={{
                                                                flexShrink: 0,
                                                                width: { xs: 95, sm: 130, md: 150 },
                                                                height: { xs: 120, sm: 150 },
                                                                textDecoration: "none",
                                                            }}
                                                        >
                                                            <Box
                                                                component="img"
                                                                src={getImageUrl(item.images[0])}
                                                                alt={item.name[lang as "fa" | "en"]}
                                                                sx={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover",
                                                                    borderRadius: 1.5,
                                                                }}
                                                            />
                                                        </Box>

                                                        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                                            <Box>
                                                                <Typography
                                                                    component={Link}
                                                                    to={`/${lang}/product/${item.slug}`}
                                                                    sx={{
                                                                        color: "text.primary",
                                                                        textDecoration: "none",
                                                                        fontWeight: 700,
                                                                        fontSize: { xs: 15, sm: 18 },
                                                                        display: "-webkit-box",
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: "vertical",
                                                                        overflow: "hidden",
                                                                        "&:hover": { color: "primary.main" },
                                                                    }}
                                                                >
                                                                    {item.name[lang as "fa" | "en"]}
                                                                </Typography>

                                                                {isPlant(item) && (
                                                                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                                                                        {t("ProductSpecsAccordion.plantSize")} : {t(`plantSize.${item.plantSize}`)}
                                                                    </Typography>
                                                                )}

                                                                {isPlant(item) && (
                                                                    <>
                                                                        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                                                                            {t("cart.potType")} {item.potOption?.name[lang || 'fa']}
                                                                        </Typography>
                                                                        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                                                                            {t("cart.potColor")} {item.potOption?.colors.name[lang || 'fa']}
                                                                        </Typography>
                                                                        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                                                                            {t("cart.potPrice")}
                                                                            <CustomNumeralNumericFormat
                                                                                style={{ fontWeight: 900 }}
                                                                                value={item.potOption?.colors.price}
                                                                                thousandSeparator=","
                                                                                suffix={` ${t("common.currency")}`}
                                                                            />
                                                                        </Typography>
                                                                    </>
                                                                )}
                                                            </Box>

                                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        border: `1px solid ${theme.palette.divider}`,
                                                                        borderRadius: 1,
                                                                        overflow: "hidden",
                                                                        height: 40,
                                                                        flexShrink: 0,
                                                                        backgroundColor: theme.palette.background.default,
                                                                        direction: lang === 'fa' ? 'rtl' : 'ltr'
                                                                    }}
                                                                >
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => {
                                                                            dispatch(decreaseCart({ id: item.cartItemId }));
                                                                            dispatch(showNotification({ message: t("notification.quantityDecreased"), type: 'warning' }));
                                                                        }}
                                                                        disabled={item.cartQty <= 1}
                                                                        sx={{ borderRadius: 0 }}
                                                                    >
                                                                        <FaMinus size={12} />
                                                                    </IconButton>

                                                                    <Typography sx={{ minWidth: 35, textAlign: "center", fontWeight: 700 }}>
                                                                        {item.cartQty}
                                                                    </Typography>

                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => {
                                                                            dispatch(increaseCart(item.cartItemId));
                                                                            dispatch(showNotification({ message: t("notification.quantityIncreased"), type: "info" }));
                                                                        }}
                                                                        disabled={isMaxStock}
                                                                        sx={{ borderRadius: 0 }}
                                                                    >
                                                                        <FaPlus size={12} />
                                                                    </IconButton>
                                                                </Box>

                                                                {isMaxStock && (
                                                                    <Typography variant="caption" color="error">
                                                                        {t("productDetail.MaxStockAlert")}
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        </Box>

                                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", minWidth: { xs: 80, sm: 130 } }}>
                                                            <IconButton
                                                                onClick={() => {
                                                                    dispatch(deleteFromCart({ id: item.cartItemId }));
                                                                    dispatch(showNotification({ message: t("notification.removeFromCart"), type: 'error' }));
                                                                }}
                                                                sx={{ ":hover": { backgroundColor: 'unset', color: 'red' } }}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>

                                                            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-end", gap: { xs: 0, sm: 1 } }}>
                                                                {hasDiscount && (
                                                                    <Typography variant="body1" sx={{ color: "error.main", textDecoration: "line-through" }}>
                                                                        <CustomNumeralNumericFormat value={item.finalPricePaid} thousandSeparator="," />
                                                                    </Typography>
                                                                )}

                                                                <Typography sx={{ color: "success.main", fontWeight: 800, fontSize: { xs: 15, sm: 18 }, whiteSpace: "nowrap" }}>
                                                                    <CustomNumeralNumericFormat value={price} thousandSeparator="," suffix={` ${t("common.currency")}`} />
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>

                                                    <Divider sx={{ width: "95%", mx: "auto", display: index === (cart.length - 1) ? 'none' : 'block' }} />
                                                </Box>
                                            </ScrollAnimate>
                                        );
                                    })}
                                </Box>
                            )}

                            <Divider sx={{ width: "95%", mx: "auto", my: 2, border: 0.5 }} />
                        </Grid>

                        {/* سمت راست: خلاصه‌حساب ثابت */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box
                                sx={{
                                    position: { md: "sticky" },
                                    top: 100,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 2,
                                    p: { xs: 2, sm: 3 },
                                    backgroundColor: theme.palette.background.default,
                                }}
                            >
                                <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                                    {t("cart.paymentDetails")}
                                </Typography>

                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                    <Typography color="text.secondary">{t("cart.totalItems")}</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        <CustomNumeralNumericFormat value={totalQty} />
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                    <Typography color="text.secondary">{t("cart.totalAmount")}</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        <CustomNumeralNumericFormat value={totalAmount} thousandSeparator="," suffix={` ${t("common.currency")}`} />
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {totalProfit > 0 && (
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, color: theme.palette.success.dark }}>
                                        <Typography color="text.secondary" sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                                            <Celebration />
                                            {t("cart.totalDiscount")}
                                        </Typography>

                                        <Typography sx={{ fontWeight: 700 }}>
                                            <CustomNumeralNumericFormat value={totalProfit} thousandSeparator="," suffix={` ${t("common.currency")}`} />
                                        </Typography>
                                    </Box>
                                )}

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {t("cart.totalCart")}
                                    </Typography>

                                    <Typography variant="h6" color="success.main" sx={{ fontWeight: 800, whiteSpace: "nowrap" }}>
                                        <CustomNumeralNumericFormat value={totalAmountPaid} thousandSeparator="," suffix={` ${t("common.currency")}`} />
                                    </Typography>
                                </Box>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={handleCheckoutClick}
                                    sx={{ mt: 3, height: 52, borderRadius: 2, fontWeight: 700 }}
                                >
                                    {isAuthStep ? t("cart.continueToPayment") : t("cart.checkout")}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </Box>

            <RecentlyViewedProducts />
        </Box>
    );
};

export default Cart;