import { Box, Grid, Skeleton, useTheme } from "@mui/material";

const CollectionsSkeleton = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                py: { xs: 4, md: 8 },
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            {/* Title Skeleton */}
            <Box
                sx={{
                    width: {
                        xs: "93%",
                        sm: "92%",
                        md: "85%",
                        lg: "88%",
                        xl: "85%",
                    },
                    mb: 7,
                }}
            >
                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        width: { xs: 220, sm: 280, md: 330 },
                        height: 55,
                        borderRadius: 1,
                    }}
                />
            </Box>

            {/* Collections */}
            <Box
                sx={{
                    width: {
                        xs: "93%",
                        sm: "100%",
                        md: "100%",
                        lg: "88%",
                        xl: "85%",
                    },
                }}
            >
                <Grid
                    container
                    sx={{
                        width: "100%",
                        gap: { xs: 5, md: 4, lg: 3 },
                        justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Grid
                            key={index}
                            size={{
                                xs: 12,
                                sm: 5,
                                md: 3,
                                lg: 2.8,
                            }}
                        >
                            {/* Image */}
                            <Skeleton
                                variant="rounded"
                                animation="wave"
                                sx={{
                                    width: "100%",
                                    height: 400,
                                    borderRadius: 2,
                                }}
                            />

                            {/* Collection title */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mt: 3,
                                    gap: 1,
                                }}
                            >
                                <Skeleton
                                    variant="text"
                                    animation="wave"
                                    sx={{
                                        width: {
                                            xs: "55%",
                                            md: "65%",
                                        },
                                        height: 30,
                                    }}
                                />

                                <Skeleton
                                    variant="circular"
                                    animation="wave"
                                    width={20}
                                    height={20}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default CollectionsSkeleton;