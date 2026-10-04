import { Box, Typography, useTheme } from "@mui/material"
import { selectRecentlyViewed } from "../../api/recentlyViewedSlice"
import { useAppSelector } from "../../hooks/redux"
import ScrollAnimate from "./ScrollAnimate"
import ProductSlider from "./ProductsSlider"
import { useTranslation } from "react-i18next"
import { useLocation, useParams } from "react-router-dom"
import { selectAllCartItems } from "../../api/CartSlice"
import { useMemo } from "react"


const RecentlyViewedProducts = () => {

    const theme = useTheme();
    const { t } = useTranslation();
    const { pathname } = useLocation()
    const { lang = "fa", slug } = useParams<{
        lang: "fa" | "en";
        slug?: string;
    }>();


    const recentlyViewedProducts = useAppSelector(selectRecentlyViewed)
    const cart = useAppSelector(selectAllCartItems);


    const visibleRecentlyViewed = useMemo(() => {

        // Product detail page
        if (pathname === `/${lang}/product/${slug}`) {
            return recentlyViewedProducts.filter(
                (product) => product.slug !== slug
            );
        }

        // Cart page
        if (pathname === `/${lang}/cart`) {
            const cartProductIds = new Set(cart.map((item) => item.id));

            return recentlyViewedProducts.filter(
                (product) => !cartProductIds.has(product.id)
            );
        }

        // Other pages
        return recentlyViewedProducts;

    }, [pathname, recentlyViewedProducts, cart, lang, slug]);



    if (visibleRecentlyViewed.length > 0)
        return (

            <Box
                sx={{ width: { xs: "94%", sm: "92%", md: "90%", lg: "85%", xl: "80%", } }}
            >
                <Box sx={{ width: '100%', mb: 7 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            color: theme.palette.text.primary,
                            borderLeft: `5px solid ${theme.palette.success.main}`,
                            px: 2
                        }}
                    >
                        {t("cart.RecentlyViewed")}
                    </Typography>
                </Box>

                <ScrollAnimate>
                    <ProductSlider products={visibleRecentlyViewed} />
                </ScrollAnimate>


            </Box>
        )
}

export default RecentlyViewedProducts