import { Box, Button, Typography, useTheme } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { FaMinus, FaPlus } from "react-icons/fa";
import type { Accessory, LocalizedString, Plant, PotOptionColor } from "../../types";
import ScrollAnimate from "../../components/common/ScrollAnimate";
import CustomNumeralNumericFormat from "../../components/common/CustomNumber";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { addToCart, createCartItemId, selectCartEntities, type CartItem } from "../../api/CartSlice";
import { showNotification } from "../../api/uiSlice";
import { isPlant } from "../../utils/productFilters";
import { useParams } from "react-router-dom";




interface ProductQuantityProps {
    product: Plant | Accessory;
    qty: number;
    onIncrease: () => void;
    onDecrease: () => void;
    finalPrice: number;
    finalPricePaid: number
    noExistent: boolean;
    remainingStock: number;
    potOption: {
        name: LocalizedString
        value: string;
        colors: PotOptionColor
    } | null;
    toggleDrawer: (open: boolean) => void,



}

export const ProductQuantity = ({ product, qty, onIncrease, onDecrease, finalPrice, noExistent, remainingStock, finalPricePaid, potOption, toggleDrawer }: ProductQuantityProps) => {
    const { t } = useTranslation()
    const theme = useTheme()
    const { lang } = useParams<{ lang: 'fa' | 'en' }>();





    //  handle add to cart
    const dispatch = useAppDispatch()
    const cartEntities = useAppSelector(selectCartEntities);
    const handleAddToCart = () => {

        if (isPlant(product) && !potOption) {
            dispatch(
                showNotification({
                    message: t("productDetail.errorPot"),
                    type: "warning",
                })
            );
            return;
        }

        const itemToCart: CartItem = {
            ...product,
            cartQty: qty,
            finalPrice,
            finalPricePaid,
            potOption,
            cartItemId: ""
        };
        const cartItemId = createCartItemId(itemToCart)
        itemToCart.cartItemId = cartItemId

        const isAlreadyInCart = Boolean(cartEntities[cartItemId])

        dispatch(addToCart(itemToCart));

        dispatch(
            showNotification({
                message: isAlreadyInCart
                    ? t('cart.quantityIncreased')
                    : t('cart.addedSuccessfully'),
                type: isAlreadyInCart ? 'info' : 'success',
            })
        );

        // open CartDrawer
        toggleDrawer(true)

    };

    return (
        <>
            <ScrollAnimate>
                <Box sx={{ width: "100%", my: 2, display: "flex", flexDirection: "row", gap: 1, height: "45px" }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            border: 1,
                            borderRadius: 1,
                            alignItems: "center",
                            gap: 1,
                            boxShadow: 2,
                            backgroundColor: theme.palette.background.default,
                            direction: lang === 'fa' ? 'ltr' : 'rtl'

                        }}
                    >
                        <Button onClick={onIncrease} disabled={qty >= remainingStock || remainingStock === 0}>
                            <FaPlus />
                        </Button>
                        <Typography variant="h6">{qty}</Typography>
                        <Button onClick={onDecrease} disabled={qty <= 1}>
                            <FaMinus />
                        </Button>
                    </Box>

                    <Button
                        fullWidth
                        disabled={!product.inStock || noExistent || remainingStock === 0}
                        variant="contained"
                        endIcon={<ShoppingCartIcon />}
                        sx={{ borderRadius: "8px", fontWeight: 600, gap: 1 }}
                        onClick={handleAddToCart}
                    >
                        {product.inStock ? t("common.addToCart") : t("common.Non-existent")}
                    </Button>
                </Box>

                {(qty === product.stock || product.stock < 4) && (
                    <Box>
                        <Typography color="error" variant="subtitle1">
                            {t("productDetail.stock")}
                            <CustomNumeralNumericFormat value={product.stock} prefix=" " />
                        </Typography>
                    </Box>
                )}
            </ScrollAnimate>
        </>

    );
};