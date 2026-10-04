import { Box, Typography, useTheme } from "@mui/material"
import type { Accessory, Plant } from "../../types";
import ScrollAnimate from "../../components/common/ScrollAnimate";
import ProductSlider from "../../components/common/ProductsSlider";
import { useTranslation } from "react-i18next";

interface ProductsRelatedProps {
    products: (Plant | Accessory)[];
}
const ProductsRelated = ({ products }: ProductsRelatedProps) => {
    const theme = useTheme()
    const { t } = useTranslation()


    return (
        <Box
            sx={{
                py: 4,
                width: { xs: "95%", sm: '95%', md: "85%", lg: '80%', xl: '80%' },
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center'
            }}
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
                    {t("productDetail.ProductsRelatedLabel")}
                </Typography>
            </Box>

            {products &&
                <ScrollAnimate>
                    <ProductSlider products={products} />
                </ScrollAnimate>
            }
        </Box>
    )
}
export default ProductsRelated