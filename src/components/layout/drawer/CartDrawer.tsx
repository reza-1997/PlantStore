import { Box, Button, Chip, Divider, Drawer, Fade, IconButton, Tooltip, Typography, useTheme } from "@mui/material"
import { useTranslation } from "react-i18next";
import { RiCloseLargeFill } from "react-icons/ri";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { decreaseCart, deleteFromCart, increaseCart, selectAllCartItems, selectCartTotalAmount, selectCartTotalAmountPaid, selectCartTotalProfit, type CartItem } from "../../../api/CartSlice";
import ScrollAnimate from "../../common/ScrollAnimate";
import type { Accessory, Plant } from "../../../types";
import CustomNumeralNumericFormat from "../../common/CustomNumber";
import { FaArrowLeftLong, FaArrowRightLong, FaCircleInfo, FaMinus, FaPlus } from "react-icons/fa6";
import DeleteIcon from "@mui/icons-material/Delete";
import { Celebration } from "@mui/icons-material";
import { MdLocalOffer } from "react-icons/md";
import { useEffect } from "react";
import { showNotification } from "../../../api/uiSlice";
import { getImageUrl } from "../../../utils/imageUrl";

type Prop = {
    openDrawer: boolean,
    toggleDrawer: (open: boolean) => void,
}

const CartDrawer = ({ openDrawer, toggleDrawer }: Prop) => {
    const { t } = useTranslation();
    const { lang } = useParams<{ lang: 'fa' | 'en' }>();
    const isRtl = lang === 'fa';
    const isLtl = lang === 'en';

    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();

    const cart = useAppSelector(selectAllCartItems);
    const totalAmount = useAppSelector(selectCartTotalAmount);
    const totalAmountPaid = useAppSelector(selectCartTotalAmountPaid);
    const totalProfit = useAppSelector(selectCartTotalProfit);

    const isPlant = (item: Plant | Accessory): item is Plant => {
        return "potSize" in item.specifications;
    };

    // Memoize discount calculation helper to prevent unnecessary function re-creations
    const handleDiscountPercentage = (item: CartItem) => {
        if (!item || !item.discountPrice || !item.price) return 0;
        return Math.round(((item.price - item.discountPrice) / item.price) * 100);
    }

    // Close cart drawer automatically when user navigates to cart page
    useEffect(() => {
        if (pathname === `/${lang}/cart`) {
            toggleDrawer(false);
        }
    }, [pathname, lang, toggleDrawer]);

    return (
        <Drawer
            open={openDrawer}
            onClose={() => toggleDrawer(false)}
            anchor='right'
            dir={lang === 'fa' ? 'rtl' : 'ltr'}
            slotProps={{
                paper: {
                    sx: {
                        width: { xs: "90%", sm: 500 },
                        borderRadius: { xs: 0, sm: "10px 0 0 10px" },
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: theme.palette.background.paper
                    },
                },
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    pt: 2,
                    boxSizing: 'border-box'
                }}>

                {/* Header section */}
                <Box
                    sx={{
                        width: '100%',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        my: 2,
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            ml: 2,
                            color: theme.palette.primary.light
                        }}
                    >
                        {t("cart.label")}
                    </Typography>
                    <IconButton sx={{ mr: 1 }} onClick={() => toggleDrawer(false)}>
                        <RiCloseLargeFill size={22} />
                    </IconButton>
                </Box>

                <Divider sx={{ width: "98%", mx: "auto" }} />

                {cart.length === 0 ? (
                    /* Empty cart state */
                    <Box
                        sx={{
                            minHeight: 400,
                            display: "flex",
                            width: '100%',
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 2,
                            textAlign: "center",
                        }}
                    >
                        <ShoppingCartOutlinedIcon
                            sx={{
                                fontSize: 90,
                                color: theme.palette.text.secondary,
                            }}
                        />

                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 700 }}
                        >
                            {t("cart.emptyCart")}
                        </Typography>

                        <Button
                            component={Link}
                            to={`/${lang}/products`}
                            onClick={() => toggleDrawer(false)}
                            variant="contained"
                            sx={{
                                mt: 2,
                                borderRadius: 1,
                                px: 3,
                                gap: 1
                            }}
                        >
                            {isLtl && <FaArrowLeftLong />}
                            {isRtl && <FaArrowRightLong />}
                            {t("cart.continueShopping")}
                        </Button>
                    </Box>
                ) : (
                    <>
                        {/* Scrollable list of cart items */}
                        <Box sx={{
                            width: "98%",
                            '&::-webkit-scrollbar': { width: '4px' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: theme.palette.divider, borderRadius: '4px' },
                            flex: 1,
                            overflowY: 'auto',
                        }}>
                            {cart.map((item, index) => {
                                const price = item.finalPricePaid ?? item.discountPrice ?? item.price;
                                const hasDiscount = Boolean(item.discountPrice);
                                const isMaxStock = item.cartQty >= item.stock;

                                return (
                                    <ScrollAnimate key={item.cartItemId}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: { xs: 1.5, sm: 2 },
                                                p: { xs: 1, sm: 2 },
                                                minHeight: { xs: 150, sm: 170 },
                                                alignItems: "stretch",
                                            }}
                                        >
                                            {/* Product Thumbnail */}
                                            <Box
                                                component={Link}
                                                to={`/${lang}/product/${item.slug}`}
                                                onClick={() => toggleDrawer(false)}
                                                sx={{
                                                    flexShrink: 0,
                                                    width: 110,
                                                    height: 140,
                                                    textDecoration: "none",
                                                    position: "relative",
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
                                                        borderRadius: 1,
                                                    }}
                                                />
                                                {/* Discount Percentage Badge */}
                                                {item.discountPrice !== undefined && item.discountPrice !== null && (
                                                    <Chip
                                                        icon={<MdLocalOffer size={18} style={{ marginRight: 2 }} />}
                                                        label={<CustomNumeralNumericFormat
                                                            value={handleDiscountPercentage(item)}
                                                            prefix={lang === 'fa' ? "٪" : " - %"}
                                                            suffix={lang === 'fa' ? " - " : ""}
                                                        />}
                                                        color="error"
                                                        size="small"
                                                        sx={{
                                                            position: "absolute",
                                                            left: 0,
                                                            top: 14,
                                                            height: 30,
                                                            px: 0.5,
                                                            fontWeight: 700,
                                                            borderRadius: "0 3px 3px 0",
                                                            boxShadow: 2,
                                                            zIndex: 2,
                                                        }}
                                                    />
                                                )}
                                            </Box>

                                            {/* Item Information */}
                                            <Box
                                                sx={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <Box>
                                                    {/* Replaced fixed width with maxWidth for responsive layout */}
                                                    <Typography
                                                        component={Link}
                                                        to={`/${lang}/product/${item.slug}`}
                                                        onClick={() => toggleDrawer(false)}
                                                        sx={{
                                                            maxWidth: 250,
                                                            color: "text.primary",
                                                            textDecoration: "none",
                                                            fontWeight: 900,
                                                            fontSize: 18,
                                                            WebkitLineClamp: 1,
                                                            display: "-webkit-box",
                                                            WebkitBoxOrient: "vertical",
                                                            overflow: "hidden",
                                                            "&:hover": {
                                                                color: "primary.main",
                                                            },
                                                        }}
                                                    >
                                                        {item.name[lang as "fa" | "en"]}
                                                    </Typography>

                                                    {/* Plant Specs */}
                                                    {isPlant(item) && (
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{ mt: 2, maxWidth: 150 }}
                                                        >
                                                            {t("ProductSpecsAccordion.plantSize")}
                                                            {" : "}
                                                            {t(`plantSize.${item.plantSize}`)}
                                                        </Typography>
                                                    )}

                                                    {/* Pot Details */}
                                                    {isPlant(item) && (
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{ mt: 0.5, maxWidth: 250 }}
                                                        >
                                                            {t("cart.SelectedPot")}
                                                            {item.potOption?.colors.name[lang || 'fa']}
                                                            {' '}
                                                            {item.potOption?.name[lang || 'fa']}
                                                        </Typography>
                                                    )}

                                                    {/* Pot Price */}
                                                    {isPlant(item) && (
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{ mt: 0.5, maxWidth: 200 }}
                                                        >
                                                            {t("cart.potPrice")}
                                                            <CustomNumeralNumericFormat
                                                                style={{ fontWeight: 900 }}
                                                                value={item.potOption?.colors.price}
                                                                prefix="+ "
                                                                thousandSeparator=","
                                                                suffix={` ${t("common.currency")}`}
                                                            />
                                                        </Typography>
                                                    )}
                                                </Box>

                                                {/* Quantity Controls */}
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                        mt: 2,
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            border: `1px solid ${theme.palette.divider}`,
                                                            borderRadius: 1,
                                                            backgroundColor: theme.palette.background.paper,
                                                            overflow: "hidden",
                                                            height: 40,
                                                            flexShrink: 0,
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

                                                        <Typography
                                                            sx={{
                                                                minWidth: 35,
                                                                textAlign: "center",
                                                                fontWeight: 700,
                                                            }}
                                                        >
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

                                                    {/* Stock Limit Tooltip Alert */}
                                                    {isMaxStock && (
                                                        <Tooltip
                                                            describeChild
                                                            arrow
                                                            title={t("productDetail.MaxStockAlert")}
                                                            slots={{ transition: Fade }}
                                                            slotProps={{
                                                                transition: { timeout: 600 },
                                                                tooltip: {
                                                                    sx: {
                                                                        bgcolor: theme.palette.background.default,
                                                                        color: theme.palette.text.primary,
                                                                        fontSize: 20,
                                                                        maxWidth: 300,
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            <IconButton size="small">
                                                                <FaCircleInfo color="yellow" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </Box>

                                            {/* Price & Delete Action */}
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-end",
                                                    justifyContent: "space-between",
                                                    minWidth: { xs: 80, sm: 130 },
                                                }}
                                            >
                                                <IconButton
                                                    onClick={() => {
                                                        dispatch(deleteFromCart({ id: item.cartItemId }));
                                                        dispatch(showNotification({ message: t("notification.removeFromCart"), type: 'error' }));
                                                    }}
                                                    sx={{
                                                        pt: 0,
                                                        ":hover": {
                                                            backgroundColor: 'unset',
                                                            color: 'red'
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>

                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: { xs: "column", sm: "row" },
                                                        alignItems: "flex-end",
                                                        gap: { xs: 0, sm: 1 },
                                                    }}
                                                >
                                                    {hasDiscount && (
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                color: "error.main",
                                                                textDecoration: "line-through",
                                                            }}
                                                        >
                                                            <CustomNumeralNumericFormat
                                                                value={item.price}
                                                                thousandSeparator=","
                                                            />
                                                        </Typography>
                                                    )}

                                                    <Typography
                                                        sx={{
                                                            color: "success.main",
                                                            fontWeight: 800,
                                                            fontSize: { xs: 15, sm: 18 },
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        <CustomNumeralNumericFormat
                                                            value={price}
                                                            thousandSeparator=","
                                                            suffix={` ${t("common.currency")}`}
                                                        />
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ width: "95%", mx: "auto", display: index === (cart.length - 1) ? 'none' : 'block' }} />
                                    </ScrollAnimate>
                                );
                            })}
                        </Box>

                        {/* Sticky Payment Summary Footer */}
                        <Box sx={{
                            width: "100%",
                            backgroundColor: theme.palette.background.default,
                            position: "sticky",
                            bottom: 0,
                            px: 2,
                            py: 2
                        }}>
                            {/* Total Original Amount */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    my: 2,
                                }}
                            >
                                <Typography color="text.secondary">
                                    {t("cart.totalAmount")}
                                </Typography>

                                <Typography sx={{ fontWeight: 700 }}>
                                    <CustomNumeralNumericFormat
                                        value={totalAmount}
                                        thousandSeparator=","
                                        suffix={` ${t("common.currency")}`}
                                    />
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Total Discount Profit */}
                            {totalProfit > 0 && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 1,
                                        color: theme.palette.success.dark
                                    }}
                                >
                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: 0.5
                                        }}
                                    >
                                        <Celebration />
                                        {t("cart.totalDiscount")}
                                    </Typography>

                                    <Typography sx={{ fontWeight: 700 }}>
                                        <CustomNumeralNumericFormat
                                            value={totalProfit}
                                            thousandSeparator=","
                                            suffix={` ${t("common.currency")}`}
                                        />
                                    </Typography>
                                </Box>
                            )}

                            <Divider sx={{ my: 2 }} />

                            {/* Final Cart Total */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {t("cart.totalCart")}
                                </Typography>

                                <Typography
                                    variant="h6"
                                    color="success.main"
                                    sx={{ fontWeight: 800, whiteSpace: "nowrap" }}
                                >
                                    <CustomNumeralNumericFormat
                                        value={totalAmountPaid}
                                        thousandSeparator=","
                                        suffix={` ${t("common.currency")}`}
                                    />
                                </Typography>
                            </Box>

                            {/* Close drawer on checkout click before navigation */}
                            <Button
                                component={Link}
                                to={`/${lang}/cart`}
                                onClick={() => toggleDrawer(false)}
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{
                                    mt: 3,
                                    height: 52,
                                    borderRadius: 1,
                                    fontWeight: 700,
                                }}
                            >
                                {t("cart.saveOrder")}
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Drawer>
    );
};

export default CartDrawer;