import { Box, Chip, Rating, Typography, useTheme } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import type { Accessory, Collections, Plant } from "../../types";
import ScrollAnimate from "../../components/common/ScrollAnimate";
import { Link, useParams } from "react-router-dom";

import { useGetCategoryQuery, useGetSubCategoryQuery } from "../../api/PlantApi";
import WishlistButton from "../../components/common/WishlistButton";
import BreadCrumb from "../../components/common/BreadCrumb";


interface ProductHeaderProps {
    product: Plant | Accessory;
    collections: Collections[]
}
const ProductHeader = ({ product, collections, }: ProductHeaderProps) => {
    const { lang } = useParams<{ lang: string }>()
    const theme = useTheme();

    const { data: category } = useGetCategoryQuery(product.categoryId ?? "", { skip: !product.categoryId });
    const { data: subCategory } = useGetSubCategoryQuery(product.subCategoryId ?? "", { skip: !product.subCategoryId });


    return (
        <>
            <ScrollAnimate>
                {/* breadcrumb */}
                <Box
                    sx={{
                        mb: 1,
                        mt: { xs: 1, sm: 1, md: 0 }
                    }}
                >
                    <BreadCrumb
                        category={category}
                        categoryId={product.categoryId}
                        subCategory={subCategory}
                        subCategoryId={product.subCategoryId}
                        productName={product.name}
                    />

                </Box>
                {/* Rating */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                    <Rating
                        name="product-rating"
                        value={product.rating}
                        readOnly
                        precision={0.5}
                        size="small"
                        emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
                        sx={{
                            color: theme.palette.text.primary,
                            '& .MuiRating-iconFilled': {
                                color: theme.palette.text.primary,
                            }
                        }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        ({product.rating})
                    </Typography>
                </Box>

                <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: 'center', width: "100%" }}>
                    <Typography sx={{ fontSize: { xs: 22, sm: 28, md: 33 }, mt: { xs: 2, md: 0 } }}  >{product.name[lang || 'fa']}</Typography>

                    {/* Wishlist Button */}
                    <WishlistButton
                        item={product}
                    />
                </Box>
            </ScrollAnimate>

            <ScrollAnimate>
                <Box sx={{ mb: 2 }}>
                    {collections?.map((collection) => (
                        <Chip component={Link}
                            to={`/${lang}/products/collection/${collection.id}`}
                            sx={{
                                mr: 0.5, cursor: 'pointer', "&:hover": {
                                    bgcolor: theme.palette.primary.light,
                                    color: "#fff",
                                },
                            }} label={collection.name[lang || "fa"]}
                            key={collection.id} />
                    ))}
                </Box>
            </ScrollAnimate>
        </>
    );
};

export default ProductHeader