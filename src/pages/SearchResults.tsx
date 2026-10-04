import { Box, Container, Divider, Grid, Typography, CircularProgress, useTheme, Chip } from "@mui/material";
import { useSearchParams, useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetSearchQuery } from "../api/PlantApi";
import ProductCard from "../components/common/ProductCard";
import { ImSearch } from "react-icons/im";


const SearchResults = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { lang = "fa" } = useParams<{ lang: string }>();
    const [searchParams] = useSearchParams();

    const query = searchParams.get("q") || "";

    const { data, isLoading, isFetching, isError, isSuccess } = useGetSearchQuery(query, { skip: !query });


    const products = [...(data?.plants ?? []), ...(data?.accessories ?? [])];
    const categories = data?.categories ?? [];
    const subCategories = data?.subCategories ?? [];
    const collections = data?.collections ?? [];

    const hasResults =
        products.length > 0 ||
        categories.length > 0 ||
        subCategories.length > 0 ||
        collections.length > 0;

    return (
        <Box sx={{ bgcolor: theme.palette.background.default, minHeight: "50vh", pt: 6, pb: 10 }}>
            <Container
                maxWidth={false}
                disableGutters
                sx={{
                    width: { xs: "95%", sm: "95%", md: "95%", lg: "93%", xl: "84%" },
                    mx: "auto",
                }}
            >
                {/* Header Section */}
                <Typography
                    variant="h3"
                    sx={{
                        color: theme.palette.primary.dark,
                        fontWeight: 600,
                        mb: 2,
                    }}
                >
                    {t("search.yourSearchResults")}
                </Typography>

                <Typography sx={{ color: theme.palette.text.primary, mb: 4, fontSize: "1.1rem" }}>
                    {t("search.searchedFor")}: <strong>{query}</strong>
                </Typography>

                <Divider sx={{ color: theme.palette.text.primary, mb: 4 }} />

                {/* Loading / Error States */}
                {(isLoading || isFetching) && <CircularProgress sx={{ display: "block", mx: "auto", my: 5, }} />}

                {isError || (isSuccess && !hasResults) ? (
                    <Box
                        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 10 }}>

                        <ImSearch size={50} />

                        <Typography variant="h6" sx={{ mt: 3 }} >
                            {t("search.NothingFound")}
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 1 }} >
                            {t("search.notFoundSearch")}
                        </Typography>

                    </Box>

                ) : null}

                {/* Categories & SubCategories & Collections Section */}
                {isSuccess && (categories.length > 0 || subCategories.length > 0 || collections.length > 0) && (
                    <Box sx={{ mb: 6, display: "flex", flexDirection: "column", gap: 3 }}>

                        {/* Categories */}
                        {categories.length > 0 && (
                            <Box>
                                <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 700, mb: 1 }}>
                                    {t("search.category")}
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                    {categories.map((cat) => (
                                        <Typography
                                            key={cat.id}
                                            component={Link}
                                            to={`/${lang}/products/category/${cat.id}`}
                                            sx={{
                                                color: theme.palette.primary.light,
                                                textDecoration: "underline",
                                                fontWeight: 600,
                                                "&:hover": { color: theme.palette.primary.dark }
                                            }}
                                        >
                                            {cat.name[lang as "fa" | "en"] || cat.name["fa"]}
                                        </Typography>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {/* SubCategories */}
                        {subCategories.length > 0 && (
                            <Box>
                                <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 700, mb: 1 }}>
                                    {t("search.subCategory")}
                                </Typography>
                                <Box sx={{
                                    display: "flex", flexWrap: "wrap", gap: 1,
                                }}>
                                    {subCategories.map((sub) => (
                                        <Chip
                                            key={sub.id}
                                            label={sub.name[lang as "fa" | "en"] || sub.name["fa"]}
                                            component={Link}
                                            to={`/${lang}/products/category/${sub.categoryId}/subCategory/${sub.id}`}
                                            clickable
                                            variant="outlined"
                                            sx={{
                                                borderColor: theme.palette.primary.light,
                                                color: theme.palette.primary.light,
                                                fontWeight: 500,
                                                "&:hover": {
                                                    bgcolor: `${theme.palette.primary.light} !important`,
                                                    color: "#fff",
                                                },
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {/* Collections */}
                        {collections.length > 0 && (
                            <Box>
                                <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 700, mb: 1 }}>
                                    {t("search.collection")}
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                                    {collections.map((col) => (
                                        <Box
                                            key={col.id}
                                            component={Link}
                                            to={`/${lang}/products/collection/${col.id}`}
                                            sx={{
                                                px: 2,
                                                py: 0.8,
                                                borderRadius: "3px",
                                                border: `1px solid ${theme.palette.primary.light}`,
                                                color: theme.palette.primary.light,
                                                textDecoration: "none",
                                                fontWeight: 600,
                                                transition: "all 0.2s ease",
                                                "&:hover": {
                                                    bgcolor: theme.palette.primary.light,
                                                    color: "#fff"
                                                }
                                            }}
                                        >
                                            {col.name[lang as "fa" | "en"] || col.name["fa"]}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        <Divider sx={{ borderColor: theme.palette.primary.light, opacity: 0.3, mt: 2 }} />
                    </Box>
                )}

                {/* Product Grid */}
                {isSuccess && products.length > 0 && (
                    <Grid container spacing={3}>
                        {products.map((product) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                                <ProductCard item={product} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box >
    );
};

export default SearchResults;