import React from "react";
import { Box, Skeleton, useTheme } from "@mui/material";

/**
 * Skeleton loading state for AccountOverview component.
 */
const AccountOverviewSkeleton: React.FC = () => {
    const theme = useTheme();

    return (
        <Box>
            {/* Header Section Skeleton */}
            <Skeleton variant="text" width="40%" height={48} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="70%" height={24} sx={{ mb: 4 }} />

            {/* Personal Details Title Skeleton */}
            <Skeleton
                variant="text"
                width="30%"
                height={36}
                sx={{ mb: 2, bgcolor: theme.palette.action.hover }}
            />

            {/* Fields List Skeleton */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 4 }}>
                {[1, 2, 3, 4].map((item) => (
                    <Box key={item}>
                        <Skeleton variant="text" width="20%" height={18} sx={{ mb: 0.5 }} />
                        <Skeleton variant="text" width="45%" height={26} />
                    </Box>
                ))}

                {/* Edit Button Link Skeleton */}
                <Skeleton variant="text" width="160px" height={28} sx={{ mt: 1 }} />
            </Box>

            {/* Recent Orders Section Skeleton */}
            <Skeleton variant="text" width="25%" height={36} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="50%" height={24} sx={{ mb: 4 }} />

            {/* Wishlist Section Skeleton */}
            <Skeleton variant="text" width="25%" height={36} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="50%" height={24} sx={{ mb: 4 }} />

            {/* Recently Viewed Carousel Skeleton */}
            <Box sx={{ mt: 6 }}>
                <Skeleton variant="text" width="30%" height={36} sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", gap: 2, overflow: "hidden" }}>
                    {[1, 2, 3, 4].map((item) => (
                        <Skeleton
                            key={item}
                            variant="rounded"
                            width={220}
                            height={280}
                            sx={{ borderRadius: 2, flexShrink: 0 }}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default AccountOverviewSkeleton;