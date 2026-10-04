import { Box, Card, CardContent, CardMedia, Chip, IconButton, Rating, Typography, useTheme } from "@mui/material";
import type { Plant, Accessory } from "../../types";
import { Link, useParams } from "react-router-dom";
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import CustomNumeralNumericFormat from "./CustomNumber";
import { useTranslation } from "react-i18next";
import { MdLocalOffer } from "react-icons/md";
import WishlistButton from "./WishlistButton";
import { getImageUrl } from "../../utils/imageUrl";

interface ProductCardProps {
    item: Plant | Accessory;
    isWishlistPage?: boolean;
    onRemoveFromWishlist?: (id: string | number) => void;
}

const ProductCard = ({ item, isWishlistPage = false, onRemoveFromWishlist }: ProductCardProps) => {
    const theme = useTheme();
    const { lang } = useParams<{ lang: string }>();
    const { t } = useTranslation();

    const isPlant = (item: Plant | Accessory): item is Plant => {
        return "specifications" in item && "potSize" in item.specifications;
    };
    const isAccessory = (item: Plant | Accessory): item is Accessory => {
        return "specifications" in item && "material" in item.specifications;
    };

    // Calculate discount percentage
    const discountPercentage = item.discountPrice
        ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
        : 0;

    // remove from Wishlist
    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onRemoveFromWishlist) {
            onRemoveFromWishlist(item.id);
        }
    };

    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'transparent',
                borderRadius: 0,
                opacity: item.inStock ? 1 : 0.7,
                "&:hover .main-image": {
                    opacity: 0,
                },
                "&:hover .hover-image": {
                    opacity: 1,
                }
            }}
        >
            {/* Image Container */}
            <Box
                sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderRadius: '5px',
                    height: { xs: 280, sm: 330, md: 380 },
                    width: '100%',
                    textDecoration: "none",
                    bgcolor: theme.palette.action.hover,
                }}
                component={Link}
                to={`/${lang || 'fa'}/product/${item.slug}`}
            >
                <CardMedia
                    component="img"
                    loading="lazy"
                    image={getImageUrl(item.images[0])}
                    alt={item.slug}
                    className="main-image"
                    sx={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        objectFit: 'cover',
                        transition: 'opacity 0.5s ease-in-out',
                    }}
                />
                {item.images[1] && (
                    <CardMedia
                        component="img"
                        image={getImageUrl(item.images[1])}
                        alt={item.slug}
                        className="hover-image"
                        sx={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            objectFit: 'cover',
                            opacity: 0,
                            transition: 'opacity 0.5s ease-in-out',
                        }}
                    />
                )}

                {/* Show Close Icon on Wishlist Page, otherwise show Wishlist Heart Button */}
                {isWishlistPage ? (
                    <IconButton
                        onClick={handleRemove}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            backgroundColor: '#ffffff',
                            color: '#333333',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                            },
                            zIndex: 3,
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                ) : (
                    <WishlistButton
                        item={item}
                        sx={{ position: 'absolute', top: 12, right: 12 }}
                    />
                )}

                {/* Discount Badge */}
                {item.discountPrice !== undefined && item.discountPrice !== null && (
                    <Chip
                        icon={<MdLocalOffer size={18} style={{ marginRight: 2 }} />}
                        label={<CustomNumeralNumericFormat
                            value={discountPercentage}
                            prefix={lang === 'fa' ? "٪" : " - %"}
                            suffix={lang === 'fa' ? " - " : ""}
                        />}
                        color="error"
                        size="small"
                        sx={{
                            position: "absolute",
                            bottom: 12,
                            left: 0,
                            height: 32,
                            px: 1,
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            borderRadius: '0 3px 3px 0',
                            bgcolor: theme.palette.error.main,
                            color: '#fff',
                            zIndex: 2,
                        }}
                    />
                )}
            </Box>

            {/* Product Info */}
            <CardContent sx={{ px: 0, pt: 1.5, pb: '0 !important', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {/* Title */}
                <Typography
                    component={Link}
                    to={`/${lang || 'fa'}/product/${item.slug}`}
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        color: theme.palette.text.primary,
                        textDecoration: 'none',
                        lineHeight: 1.3,
                        '&:hover': {
                            color: theme.palette.primary.main,
                        }
                    }}
                >
                    {item.name[lang || 'fa']}
                </Typography>

                {/* Subtitle */}
                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 20 }}>
                    {isPlant(item) && (
                        <CustomNumeralNumericFormat
                            value={item.specifications.potSize}
                            prefix={`${t('common.potSize')}: `}
                        />
                    )}
                    {isAccessory(item) && item.specifications.material[lang || 'fa']}
                </Typography>

                {/* Pricing */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    {item.discountPrice ? (
                        <>
                            <Typography
                                component="span"
                                sx={{
                                    textDecoration: "line-through",
                                    color: "text.disabled",
                                    fontSize: "0.95rem",
                                }}
                            >
                                <CustomNumeralNumericFormat
                                    value={item.price}
                                    thousandSeparator=","
                                />
                            </Typography>
                            <Typography
                                component="span"
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.success.dark,
                                    fontSize: "1.1rem",
                                }}
                            >
                                <CustomNumeralNumericFormat
                                    value={item.discountPrice}
                                    thousandSeparator=","
                                    suffix={` ${t("common.currency")}`}
                                />
                            </Typography>
                        </>
                    ) : (
                        <Typography
                            component="span"
                            sx={{
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                                fontSize: "1.05rem",
                            }}
                        >
                            <CustomNumeralNumericFormat
                                value={item.price}
                                thousandSeparator=","
                                suffix={` ${t("common.currency")}`}
                            />
                        </Typography>
                    )}
                </Box>

                {/* Rating */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                    <Rating
                        name="product-rating"
                        value={item.rating}
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
                        ({item.rating})
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProductCard;