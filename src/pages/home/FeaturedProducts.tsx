import { Box, Typography, useTheme } from "@mui/material";
import { useGetAllPlantsQuery } from "../../api/PlantApi";
import ProductSlider from "../../components/common/ProductsSlider";
import { t } from "i18next";







const FeaturedProducts = () => {
    const theme = useTheme();
    const { data: plants, isLoading } = useGetAllPlantsQuery();


    const featuredProducts = plants?.filter((plant) => plant.isFeatured) || [];


    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                py: { xs: 6, md: 12 },
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <Box sx={{ width: { xs: "93%", md: "85%" }, mb: 7, zIndex: 2 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 800,
                        color: theme.palette.text.primary,
                        borderLeft: `5px solid ${theme.palette.success.main}`,
                        pl: 2,
                        py:2
                    }}
                >
                    {t("home.FeaturedProductsLabel")}
                </Typography>
            </Box>

            <Box sx={{ width: { xs: "93%", md: "85%", zIndex: 2 } ,pb:1}} >
                <ProductSlider products={featuredProducts} loading={isLoading} />
            </Box>
        </Box>
    );
};

export default FeaturedProducts;