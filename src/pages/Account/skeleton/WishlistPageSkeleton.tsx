import React from "react";
import { Box, Grid, Skeleton } from "@mui/material";

/**
 * Skeleton loading state for WishlistPage component.
 */
const WishlistPageSkeleton: React.FC = () => {
    return (
        <Box>
            {/* Header Title Section Skeleton */}
            <Box sx={{ mb: 4 }}>
                <Skeleton variant="text" width="220px" height={48} sx={{ mb: 1.5 }} />
                <Skeleton variant="text" width="90%" height={24} />
                <Skeleton variant="text" width="60%" height={24} />
            </Box>

            {/* Products Grid Skeleton */}
            <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <Grid key={item} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {/* Product Image Placeholder */}
                            <Skeleton
                                variant="rounded"
                                height={260}
                                sx={{ borderRadius: 2 }}
                            />
                            {/* Product Title Placeholder */}
                            <Skeleton variant="text" width="80%" height={24} sx={{ mt: 1 }} />
                            {/* Product Category/Price Placeholder */}
                            <Skeleton variant="text" width="40%" height={20} />
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Pagination Footer Skeleton */}
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
                <Skeleton variant="text" width="180px" height={20} />
                <Skeleton variant="rounded" width={280} height={36} sx={{ borderRadius: 1.5 }} />
            </Box>
        </Box>
    );
};

export default WishlistPageSkeleton;