import { Box, CardMedia, Rating, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CustomNumeralNumericFormat from "../common/CustomNumber";
import type { Accessory, Plant } from "../../types";
import { getImageUrl } from "../../utils/imageUrl";

type SearchProductItemProps = {
    product: Plant | Accessory;
    lang: string;
    onClose: () => void;
};

// Component for rendering individual product items inside search results
const SearchProductItem = ({ product, lang, onClose }: SearchProductItemProps) => {
    const theme = useTheme();
    const { t } = useTranslation();

    // Type guard to check if item is a Plant
    const isPlant = (item: Plant | Accessory): item is Plant => {
        return "potSize" in item.specifications;
    };

    return (
        <Box
            component={Link}
            to={`/${lang}/product/${product.slug}`}
            onClick={onClose}
            sx={{
                width: '100%',
                display: "flex",
                gap: 1,
                alignItems: "start",
                minWidth: 0,
                py: 0.5,
                px: 1,
                textDecoration: "none",
                transition: "0.2s",
                "&:hover": {
                    backgroundColor: theme.palette.action.selected,
                    borderRadius: 0.5
                },
            }}
        >
            {/* Product image */}
            <Box sx={{ width: '70px', height: '90px', flexShrink: 0 }}>
                <CardMedia
                    component="img"
                    image={getImageUrl(product.images[0])}
                    alt={product.name[lang as "fa" | "en"] || product.name["fa"]}
                    sx={{ width: "100%", height: "100%", borderRadius: 0.5, objectFit: "cover" }}
                />
            </Box>

            {/* Product info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, height: 90, alignItems: "start", justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {product.name[lang as "fa" | "en"] || product.name["fa"]}
                    </Typography>
                    <Rating value={product.rating} precision={0.5} readOnly sx={{ fontSize: 11 }} />
                </Box>

                {isPlant(product) ? (
                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                        {t("ProductSpecsAccordion.plantSize")}: {t(`plantSize.${product.plantSize}`)}
                    </Typography>
                ) : (
                    <Typography
                        variant="subtitle2"
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            color: theme.palette.text.secondary,
                            mb: 1
                        }}
                    >
                        {product.desc[lang as "fa" | "en"] || product.desc["fa"]}
                    </Typography>
                )}

                {/* Pricing section */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {product.discountPrice && (
                        <Typography sx={{ textDecoration: "line-through", color: "error.main", fontSize: 15 }}>
                            <CustomNumeralNumericFormat value={product.price} thousandSeparator="," />
                        </Typography>
                    )}

                    <Typography sx={{ color: "success.main", fontWeight: 700 }}>
                        <CustomNumeralNumericFormat
                            value={product.discountPrice ?? product.price}
                            thousandSeparator=","
                            suffix={` ${t("common.currency")}`}
                        />
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default SearchProductItem;