import React from "react";
import { Box, Skeleton, List, ListItem, useTheme } from "@mui/material";

/**
 * Skeleton loading state for UserDrawer.
 */
const UserDrawerSkeleton: React.FC = () => {
    const theme = useTheme();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Header Banner Skeleton */}
            <Box sx={{ p: 2.5, pt: 8, backgroundColor: theme.palette.action.hover }}>
                <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="40%" height={20} />
            </Box>

            {/* Menu Items Skeleton */}
            <List sx={{ flexGrow: 1, py: 1 }}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <ListItem key={item} sx={{ py: 1.5, px: 3 }}>
                        <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
                        <Skeleton variant="text" width="70%" height={24} />
                    </ListItem>
                ))}
            </List>

            {/* Footer Support Skeleton */}
            <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Skeleton variant="rounded" width="100%" height={40} />
            </Box>
        </Box>
    );
};

export default UserDrawerSkeleton;