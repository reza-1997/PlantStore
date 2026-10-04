import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Grid,
    Skeleton,
    useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ProductCardSkeleton from "../components/common/ProductCardSkeleton";


const ProductsSkeleton = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                py: { xs: 4, md: 8 },
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: { xs: "center", md: "space-between" },
                    alignItems: { xs: "stretch", md: "center" },
                    width: {
                        xs: "95%",
                        sm: "95%",
                        md: "95%",
                        lg: "93%",
                        xl: "84%",
                    },
                    mb: 3,
                }}
            >
                {/* Title */}
                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        width: { xs: 220, md: 300 },
                        height: 55,
                    }}
                />

                {/* Mobile filter */}
                <Skeleton
                    variant="rounded"
                    animation="wave"
                    sx={{
                        display: { xs: "block", md: "none" },
                        width: "100%",
                        height: 50,
                        mt: 1,
                    }}
                />

                {/* Desktop sort */}
                <Skeleton
                    variant="rounded"
                    animation="wave"
                    sx={{
                        display: { xs: "none", md: "block" },
                        width: 150,
                        height: 56,
                    }}
                />
            </Box>

            {/* Main layout */}
            <Box
                sx={{
                    width: {
                        xs: "93%",
                        sm: "95%",
                        md: "95%",
                        lg: "93%",
                        xl: "84%",
                    },
                }}
            >
                <Grid container spacing={2} sx={{ width: "100%" }}>

                    {/* Desktop filters */}
                    <Grid
                        size={{ md: 3, lg: 2, xl: 2 }}
                        sx={{
                            display: { xs: "none", md: "block" },
                        }}
                    >
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Accordion
                                key={index}
                                disableGutters
                                sx={{
                                    backgroundColor: "transparent",
                                    backgroundImage: "none",
                                    boxShadow: "none",
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Skeleton
                                        variant="text"
                                        animation="wave"
                                        width="65%"
                                        height={30}
                                    />
                                </AccordionSummary>

                                <AccordionDetails>
                                    {Array.from({ length: 3 }).map(
                                        (_, optionIndex) => (
                                            <Box
                                                key={optionIndex}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    mb: 1,
                                                }}
                                            >
                                                <Skeleton
                                                    variant="rounded"
                                                    animation="wave"
                                                    width={20}
                                                    height={20}
                                                />

                                                <Skeleton
                                                    variant="text"
                                                    animation="wave"
                                                    width="60%"
                                                    height={25}
                                                />
                                            </Box>
                                        )
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        ))}

                        {/* Reset button */}
                        <Skeleton
                            variant="rounded"
                            animation="wave"
                            width="100%"
                            height={40}
                            sx={{
                                mt: 2,
                            }}
                        />
                    </Grid>

                    {/* Product cards */}
                    <Grid
                        size={{ xs: 12, md: 9, lg: 10, xl: 10 }}
                    >
                        <Grid
                            container
                            spacing={3}
                            sx={{
                                width: "100%",
                            }}
                        >
                            {Array.from({ length: 6 }).map((_, index) => (
                                <Grid
                                    key={index}
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                        md: 6,
                                        lg: 4,
                                    }}
                                >
                                    <ProductCardSkeleton />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default ProductsSkeleton;