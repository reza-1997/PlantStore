import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Card,
    Grid,
    Skeleton,
    useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ProductCardSkeleton from "../../components/common/ProductCardSkeleton";

const ProductDetailSkeleton = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.paper,
                py: { xs: 4, md: 8 },
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            {/* Main Product Section*/}
            <Grid
                container
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-around",
                    width: {
                        xs: "95%",
                        sm: "95%",
                        md: "85%",
                        lg: "80%",
                        xl: "80%",
                    },
                }}
            >
                {/*Gallery*/}
                <Grid
                    size={{ xs: 12, sm: 12, md: 6 }}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: "90%",
                            position: "relative",
                        }}
                    >
                        {/* Main image */}
                        <Skeleton
                            variant="rounded"
                            animation="wave"
                            sx={{
                                width: "100%",
                                height: 530,
                                borderRadius: "16px",
                            }}
                        />

                        {/* Thumbnails */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: 1,
                                mt: 2,
                            }}
                        >
                            {[1, 2, 3, 4].map((item) => (
                                <Skeleton
                                    key={item}
                                    variant="rounded"
                                    animation="wave"
                                    sx={{
                                        width: "100%",
                                        height: 100,
                                        borderRadius: "20px",
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Grid>

                {/* Product Information*/}
                <Grid
                    size={{ xs: 12, sm: 12, md: 6 }}
                    sx={{
                        mt: { xs: 4, md: 0 },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "100%",
                        }}
                    >
                        {/* Product Header*/}
                        <Box
                            sx={{
                                mb: 3,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <Skeleton
                                variant="text"
                                animation="wave"
                                width="55%"
                                height={55}
                            />

                            <Skeleton
                                variant="circular"
                                animation="wave"
                                width={40}
                                height={40}
                            />
                        </Box>

                        {/* Rating */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 2,
                            }}
                        >
                            <Skeleton
                                variant="rounded"
                                animation="wave"
                                width={110}
                                height={24}
                            />

                            <Skeleton
                                variant="text"
                                animation="wave"
                                width={25}
                                height={24}
                            />
                        </Box>

                        {/* Collections */}
                        <Box
                            sx={{
                                display: "flex",
                                gap: 1,
                                mb: 3,
                            }}
                        >
                            <Skeleton
                                variant="rounded"
                                animation="wave"
                                width={80}
                                height={32}
                            />

                            <Skeleton
                                variant="rounded"
                                animation="wave"
                                width={100}
                                height={32}
                            />

                            <Skeleton
                                variant="rounded"
                                animation="wave"
                                width={70}
                                height={32}
                            />
                        </Box>

                        {/* Description*/}
                        <Box sx={{ width: "100%", mb: 1 }}>
                            <Skeleton
                                variant="text"
                                animation="wave"
                                width="100%"
                                height={28}
                            />

                            <Skeleton
                                variant="text"
                                animation="wave"
                                width="95%"
                                height={28}
                            />

                            <Skeleton
                                variant="text"
                                animation="wave"
                                width="70%"
                                height={28}
                            />
                        </Box>

                        <Skeleton
                            variant="rectangular"
                            animation="wave"
                            width="100%"
                            height={1}
                            sx={{ my: 3 }}
                        />

                        {/* Price*/}
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: {
                                    xs: "column",
                                    sm: "row",
                                },
                                justifyContent: "space-between",
                                alignItems: {
                                    xs: "flex-start",
                                    sm: "center",
                                },
                            }}
                        >
                            <Skeleton
                                variant="text"
                                animation="wave"
                                width={130}
                                height={50}
                            />

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    mt: { xs: 1, sm: 0 },
                                }}
                            >
                                <Skeleton
                                    variant="text"
                                    animation="wave"
                                    width={110}
                                    height={50}
                                />

                                <Skeleton
                                    variant="text"
                                    animation="wave"
                                    width={120}
                                    height={50}
                                />
                            </Box>
                        </Box>

                        {/* Pot Selector */}
                        <Box sx={{ width: "100%", mt: 2 }}>
                            <Skeleton
                                variant="text"
                                animation="wave"
                                width={120}
                                height={40}
                            />

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    mt: 1,
                                }}
                            >
                                {[1, 2, 3].map((item) => (
                                    <Skeleton
                                        key={item}
                                        variant="rounded"
                                        animation="wave"
                                        width={75}
                                        height={35}
                                    />
                                ))}
                            </Box>

                            <Skeleton
                                variant="text"
                                animation="wave"
                                width={180}
                                height={40}
                                sx={{ mt: 2 }}
                            />

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    mt: 1,
                                }}
                            >
                                {[1, 2, 3, 4].map((item) => (
                                    <Skeleton
                                        key={item}
                                        variant="circular"
                                        animation="wave"
                                        width={42}
                                        height={42}
                                    />
                                ))}
                            </Box>
                        </Box>

                        {/* Quantity + Cart */}
                        <Box
                            sx={{
                                width: "100%",
                                my: 2,
                                display: "flex",
                                flexDirection: "row",
                                gap: 1,
                                height: 45,
                            }}
                        >
                            <Skeleton
                                variant="rounded"
                                animation="wave"
                                width={130}
                                height={45}
                            />

                            <Skeleton
                                variant="rounded"
                                animation="wave"
                                sx={{
                                    flex: 1,
                                    height: 45,
                                    borderRadius: "8px",
                                }}
                            />
                        </Box>

                        {/* Stock */}
                        <Skeleton
                            variant="text"
                            animation="wave"
                            width={130}
                            height={30}
                        />

                        <Skeleton
                            variant="rectangular"
                            animation="wave"
                            width="100%"
                            height={1}
                            sx={{ my: 2 }}
                        />

                        {/* Specifications Accordion*/}
                        <Card
                            sx={{
                                width: "100%",
                                borderRadius: 1,
                                p: 1,
                                backgroundColor:
                                    theme.palette.primary.contrastText,
                                boxShadow: "none",
                            }}
                        >
                            <Accordion defaultExpanded>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Skeleton
                                        variant="text"
                                        animation="wave"
                                        width={200}
                                        height={35}
                                    />
                                </AccordionSummary>

                                <AccordionDetails>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1.5,
                                        }}
                                    >
                                        {[1, 2, 3, 4, 5, 6].map((item) => (
                                            <Box
                                                key={item}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                <Skeleton
                                                    variant="circular"
                                                    animation="wave"
                                                    width={25}
                                                    height={25}
                                                />

                                                <Skeleton
                                                    variant="text"
                                                    animation="wave"
                                                    width={100}
                                                    height={28}
                                                />

                                                <Skeleton
                                                    variant="text"
                                                    animation="wave"
                                                    width={120}
                                                    height={28}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Card>

                        {/* Suggested Products*/}
                        <Box sx={{ width: "100%", mt: 5 }}>
                            <Skeleton
                                variant="text"
                                animation="wave"
                                width={250}
                                height={55}
                            />

                            <Box sx={{ mt: 3 }}>
                                {[1, 2, 3].map((item) => (
                                    <SuggestedProductSkeleton key={item} />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Divider
             */}<Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                    width: {
                        xs: "95%",
                        sm: "95%",
                        md: "85%",
                        lg: "80%",
                        xl: "80%",
                    },
                    height: 1,
                    mt: 3,
                }}
            />

            {/* Related Products*/}
            <Box
                sx={{
                    py: { xs: 4, md: 6 },
                    width: {
                        xs: "95%",
                        sm: "95%",
                        md: "85%",
                        lg: "80%",
                        xl: "80%",
                    },
                }}
            >
                <Skeleton
                    variant="text"
                    animation="wave"
                    width={280}
                    height={55}
                    sx={{ mb: 5 }}
                />

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "repeat(1, 1fr)",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                            lg: "repeat(4, 1fr)",
                        },
                        gap: 2,
                    }}
                >
                    {[1, 2, 3, 4].map((item) => (
                        <ProductCardSkeleton key={item} />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};


// Suggested Product Skeleton

const SuggestedProductSkeleton = () => {
    return (
        <Card
            sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                borderRadius: 1,
                minWidth: 0,
                p: 1.5,
                mb: 2,
                boxShadow: "none",
            }}
        >
            {/* Image */}
            <Skeleton
                variant="rounded"
                animation="wave"
                sx={{
                    width: 70,
                    height: 90,
                    flexShrink: 0,
                    borderRadius: 1,
                }}
            />

            {/* Information */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minWidth: 0,
                }}
            >
                <Skeleton
                    variant="text"
                    animation="wave"
                    width="50%"
                    height={30}
                />

                <Skeleton
                    variant="text"
                    animation="wave"
                    width="90%"
                    height={25}
                />

                <Skeleton
                    variant="text"
                    animation="wave"
                    width={120}
                    height={28}
                />
            </Box>

            {/* Button */}
            <Skeleton
                variant="rounded"
                animation="wave"
                sx={{
                    width: {
                        xs: 45,
                        sm: 85,
                    },
                    height: 50,
                    borderRadius: 1,
                    flexShrink: 0,
                }}
            />
        </Card >
    );
};

export default ProductDetailSkeleton;