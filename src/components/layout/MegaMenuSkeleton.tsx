import {
    Box,
    Grid,
    Skeleton,
} from "@mui/material";

const MegaMenuSkeleton = () => {

    return (
        <Grid
            container
            spacing={4}
            sx={{
                maxWidth: "1200px",
                mx: "auto",
            }}
        >
            {/* Left - Category title + subcategories */}
            <Grid
                size={{ xs: 7, sm: 8 }}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                {/* Category title */}
                <Skeleton
                    variant="text"
                    animation="wave"
                    width={150}
                    height={36}
                />

                {/* Subcategories */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 2,
                    }}
                >
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            variant="text"
                            animation="wave"
                            width={`${65 + (index % 3) * 10}%`}
                            height={28}
                        />
                    ))}
                </Box>
            </Grid>

            {/* Right - Image + description + link */}
            <Grid size={{ xs: 5, sm: 4 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}
                >
                    {/* Image */}
                    <Skeleton
                        variant="rounded"
                        animation="wave"
                        sx={{
                            width: "100%",
                            height: 160,
                            borderRadius: "8px",
                        }}
                    />

                    {/* Description */}
                    <Box sx={{ mt: 1 }}>
                        <Skeleton
                            variant="text"
                            animation="wave"
                            width="100%"
                            height={24}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            width="90%"
                            height={24}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            width="65%"
                            height={24}
                        />
                    </Box>

                    {/* View all */}
                    <Skeleton
                        variant="text"
                        animation="wave"
                        width={120}
                        height={28}
                        sx={{ mt: 1 }}
                    />
                </Box>
            </Grid>
        </Grid>
    );
};

export default MegaMenuSkeleton;