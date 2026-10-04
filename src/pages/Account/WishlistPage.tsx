import React, { useState, useMemo, useEffect } from "react";
import {
    Box,
    Grid,
    Typography,
    Pagination,
    useTheme,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { loadWishlist, toggleWishlist } from "../../api/wishlistSlice";
import { showNotification } from "../../api/uiSlice";
import { Trans, useTranslation } from "react-i18next";
import type { Plant, Accessory } from "../../types";
import { useGetAllAccessoriesQuery, useGetAllPlantsQuery } from "../../api/PlantApi";
import ProductCard from "../../components/common/ProductCard";
import CustomNumeralNumericFormat from "../../components/common/CustomNumber";
import WishlistPageSkeleton from "./skeleton/WishlistPageSkeleton";
import ScrollAnimate from "../../components/common/ScrollAnimate";

const ITEMS_PER_PAGE = 8;

/**
 * User wishlist page view displaying saved products with pagination.
 */
const WishlistPage: React.FC = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    // Fetch wishlist item IDs and loading status from Redux
    const { items: wishlistIds = [], status: wishlistStatus } = useAppSelector((state) => state.wishlist);

    // Fetch all plants and accessories using RTK Query
    const { data: plants = [], isLoading: isPlantsLoading } = useGetAllPlantsQuery();
    const { data: accessories = [], isLoading: isAccessoriesLoading } = useGetAllAccessoriesQuery();

    const [page, setPage] = useState(1);

    // Filter products present in the wishlist
    const wishlistProducts = useMemo(() => {
        const allProducts: (Plant | Accessory)[] = [...plants, ...accessories];
        return allProducts.filter((product) => wishlistIds.includes(product.id));
    }, [plants, accessories, wishlistIds]);

    // Pagination calculations
    const totalItems = wishlistProducts.length;
    const pageCount = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const currentProducts = wishlistProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Remove item handler
    const handleRemoveFromWishlist = async (id: string | number) => {
        try {
            await dispatch(toggleWishlist(String(id))).unwrap();
            dispatch(
                showNotification({
                    message: t("wishlist.removedSuccess"),
                    type: "warning",
                })
            );
        } catch (error) {
            dispatch(showNotification({ message: t("errors.default"), type: "error" }));
        }
    };

    // Ensure wishlist is fully fetched/initialized before stopping skeleton
    const isWishlistLoading = wishlistStatus === "loading" || wishlistStatus === "idle";
    const isLoading = isPlantsLoading || isAccessoriesLoading || isWishlistLoading;

    useEffect(() => {
        if (wishlistStatus === "idle") {
            dispatch(loadWishlist());
        }
    }, [wishlistStatus, dispatch]);

    return (
        <Box>
            {/* Header Title Section */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        fontFamily: theme.typography.fontFamily,
                        color: theme.palette.text.primary,
                        mb: 1.5,
                    }}
                >
                    {t('wishlist.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, lineHeight: 1.7 }}>
                    {t("wishlist.subtitle")}
                </Typography>
            </Box>

            {/* Content Display */}
            {isLoading ? (
                <WishlistPageSkeleton />
            ) : totalItems > 0 ? (
                <>
                    {/* Products Grid */}
                    <Grid container spacing={3}>
                        {currentProducts.map((product) => (
                            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} >
                                <ScrollAnimate>
                                    <ProductCard
                                        item={product}
                                        isWishlistPage={true}
                                        onRemoveFromWishlist={handleRemoveFromWishlist}
                                    />
                                </ScrollAnimate>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination Footer */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1.5,
                            mt: 6,
                            mb: 2,
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            <Trans
                                i18nKey="wishlist.showingResults"
                                components={{
                                    start: <CustomNumeralNumericFormat value={startIndex + 1} />,
                                    end: <CustomNumeralNumericFormat value={Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} />,
                                    total: <CustomNumeralNumericFormat value={totalItems} />,
                                }}
                            />
                        </Typography>

                        {pageCount > 1 && (
                            <Pagination
                                count={pageCount}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                size="medium"
                                shape="rounded"
                                sx={{
                                    "& .MuiPaginationItem-root": {
                                        fontWeight: 600,
                                    },
                                }}
                            />
                        )}
                    </Box>
                </>
            ) : (
                /* Empty Wishlist */
                <Box sx={{ py: 8, textAlign: "center" }}>
                    <Typography variant="h6" color="text.secondary">
                        {t("wishlist.empty")}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default WishlistPage;