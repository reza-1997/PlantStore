import { Box, Card, CardActions, CardContent, Skeleton, useTheme } from "@mui/material";

const ProductCardSkeleton = () => {
    const theme = useTheme();

    return (
        <Card
            sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: "16px",
                boxShadow: "0 7px 22px rgba(0,0,0,0.04)",
                overflow: "hidden",
                backgroundColor: theme.palette.background.default,
            }}
        >
            {/* Image */}
            <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                    width: "100%",
                    height: { xs: 220, md: 300 },
                }}
            />

            {/* Content */}
            <CardContent
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                {/* Product name */}
                <Box sx={{ minHeight: "70px" }}>
                    <Skeleton
                        variant="text"
                        animation="wave"
                        width="75%"
                        height={32}
                    />
                    <Skeleton
                        variant="text"
                        animation="wave"
                        width="50%"
                        height={28}
                    />
                </Box>

                {/* Rating */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Skeleton
                        variant="rounded"
                        animation="wave"
                        width={100}
                        height={24}
                    />

                    <Skeleton
                        variant="text"
                        animation="wave"
                        width={25}
                        height={24}
                    />
                </Box>

                {/* Details */}
                <Box sx={{ height: 30, my: 1, width: "100%" }}>
                    <Skeleton
                        variant="text"
                        animation="wave"
                        width="45%"
                        height={28}
                    />
                </Box>

                {/* Price */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: "auto",
                    }}
                >
                    <Skeleton
                        variant="text"
                        animation="wave"
                        width={45}
                        height={28}
                    />

                    <Skeleton
                        variant="text"
                        animation="wave"
                        width={90}
                        height={32}
                    />
                </Box>
            </CardContent>

            {/* Button */}
            <CardActions sx={{ p: 2, pt: 0 }}>
                <Skeleton
                    variant="rounded"
                    animation="wave"
                    width="100%"
                    height={50}
                    sx={{
                        borderRadius: "8px",
                    }}
                />
            </CardActions>
        </Card>
    );
};

export default ProductCardSkeleton;