import { Box, Button, Card, CardMedia, Typography, useTheme } from "@mui/material"
import ScrollAnimate from "../../components/common/ScrollAnimate"
import { Link, useParams } from "react-router-dom"
import CustomNumeralNumericFormat from "../../components/common/CustomNumber"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import type { Accessory, Plant } from "../../types";
import { useTranslation } from "react-i18next";
import { addToCart, createCartItemId, selectCartEntities, type CartItem } from "../../api/CartSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { showNotification } from "../../api/uiSlice";
import { getImageUrl } from "../../utils/imageUrl";

interface ProductsSuggestedProps {
    product: Plant | Accessory;
    toggleDrawer: (open: boolean) => void,
}
const ProductsSuggested = ({ product, toggleDrawer }: ProductsSuggestedProps) => {

    const theme = useTheme()
    const { lang } = useParams<{ lang: string }>();
    const { t } = useTranslation()

    const dispatch = useAppDispatch()
    const cartEntities = useAppSelector(selectCartEntities);

    const cartItem = cartEntities[product.id];
    const qtyInCart = cartItem?.cartQty ?? 0;

    //  بررسی رسیدن به سقف موجودی
    const isMaxReached = qtyInCart >= product.stock;

    const handleAddToCart = () => {

        const itemToCart: CartItem = {
            ...product,
            cartQty: 1,
            finalPrice: product.price,
            finalPricePaid: product.discountPrice ?? product.price,
            potOption: null,
            cartItemId: ""
        };
        const cartItemId = createCartItemId(itemToCart)
        itemToCart.cartItemId = cartItemId

        const isAlreadyInCart = Boolean(cartEntities[cartItemId]);

        dispatch(
            addToCart(itemToCart)
        );

        dispatch(
            showNotification({
                message: isMaxReached ?
                    t("productDetail.MaxStockAlert") :
                    isAlreadyInCart
                        ? t('cart.quantityIncreased')
                        : t('cart.addedSuccessfully'),

                type: isAlreadyInCart ? 'info' : 'success',
            })
        );

        // open CartDrawer
        toggleDrawer(true)
    }

    return (
        <ScrollAnimate>
            <Card
                key={product.id}
                sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: 'space-between',
                    alignItems: "center",
                    borderRadius: 1,
                    minWidth: 0,
                    p: 1.5,
                    mb: 2,
                    backgroundColor: theme.palette.background.default,
                    transition: "all .25s ease",
                    border: `1px solid ${theme.palette.divider}`,
                    "&:hover": {
                        transform: "translateY(-4px)",
                        borderColor: theme.palette.primary.main,
                    },
                }}
            >
                {/* image */}
                <Box
                    sx={{
                        textDecoration: "none",
                        width: '70px',
                        height: '90px',
                        flexShrink: 0
                    }}>
                    <Box
                        component={Link}
                        to={`/${lang}/product/${product.slug}`}

                    >
                        <CardMedia
                            component="img"
                            image={getImageUrl(product.images[0])}
                            alt={product.name[lang || "fa"]}
                            sx={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 1,
                                objectFit: "cover",
                            }}
                        />
                    </Box>
                </Box>

                {/* information */}
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 1 }}>
                        <Typography
                            component={Link}
                            to={`/${lang}/product/${product.slug}`}
                            variant="subtitle1"
                            sx={{
                                fontWeight: 700,
                                color: "text.primary",
                                textDecoration: "none",
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                "&:hover": {
                                    color: "primary.main",
                                },
                                ml: 1,
                            }}
                        >
                            {product.name[lang || "fa"]}
                        </Typography>

                        {/* <Rating
                          value={product.rating}
                          precision={0.5}
                          size="small"
                          readOnly
                          sx={{ my: .5 }}
                        /> */}
                    </Box>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",

                        }}
                    >
                        {product.desc[lang || "fa"]}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 1,
                        }}
                    >
                        {product.discountPrice && (
                            <Typography
                                sx={{
                                    textDecoration: "line-through",
                                    color: "error.main",
                                    fontSize: 14,
                                }}
                            >
                                <CustomNumeralNumericFormat
                                    value={product.price}
                                    thousandSeparator=","
                                />
                            </Typography>
                        )}

                        <Typography
                            sx={{
                                color: "success.main",
                                fontWeight: 700,
                                fontSize: 18,
                            }}
                        >
                            <CustomNumeralNumericFormat
                                value={product.discountPrice ?? product.price}
                                thousandSeparator=","
                                suffix={` ${t("common.currency")}`} />
                        </Typography>
                    </Box>
                </Box>


                {/* button */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexShrink: 0,
                        mr: 1,
                        width: {
                            xs: 45,
                            sm: 85
                        },
                        height: 75
                    }}
                >
                    <Button
                        onClick={handleAddToCart}
                        variant="contained"
                        size="small"
                        endIcon={<ShoppingCartIcon />}
                        sx={{
                            borderRadius: 1,
                            height: 50,
                            textTransform: "none",
                            fontWeight: 700,
                            gap: 1,
                            width: '100%',
                            "& .MuiButton-endIcon": {
                                display: {
                                    xs: "none",
                                    sm: "flex"
                                }
                            }
                        }}
                    >
                        {t("productDetail.addToCartShort")}
                    </Button>
                </Box>

            </Card>
        </ScrollAnimate>
    )
}
export default ProductsSuggested