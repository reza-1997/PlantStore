import { Box, Container, Grid, Skeleton, useTheme } from "@mui/material";

/**
 * Skeleton loading state for AccountLayout component including sidebar and main content layout.
 */
const AccountLayoutSkeleton = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                width: "100%",
                backgroundColor: theme.palette.background.paper,
                minHeight: "85vh",
                py: { xs: 2, md: 4 },
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    {/* Sidebar Skeleton */}
                    <Grid size={{ xs: 12, md: 3.5, lg: 3 }}>
                        <Box
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                borderRadius: 2,
                                p: { xs: 2.5, md: 3 },
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            {/* Greeting Header Skeleton */}
                            <Skeleton
                                variant="text"
                                width="60%"
                                height={36}
                                sx={{ mb: 1, bgcolor: "rgba(255, 255, 255, 0.2)" }}
                            />

                            {/* Sidebar Menu Items Skeleton */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                                    <Skeleton
                                        key={item}
                                        variant="rounded"
                                        height={44}
                                        sx={{
                                            borderRadius: 1.5,
                                            bgcolor: "rgba(255, 255, 255, 0.15)",
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Grid>

                    {/* Main Content Area Skeleton Placeholder */}
                    <Grid size={{ xs: 12, md: 8.5, lg: 9 }}>
                        <Box sx={{ pl: { md: 2 } }}>
                            <Skeleton variant="text" width="35%" height={48} sx={{ mb: 1 }} />
                            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 4 }} />
                            <Skeleton
                                variant="rounded"
                                height={320}
                                sx={{ borderRadius: 2 }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AccountLayoutSkeleton;