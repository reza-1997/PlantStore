import {
    Box,
    Drawer,
    IconButton,
    InputBase,
    Typography,
    useTheme,
    CircularProgress,
} from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import { RiCloseLargeFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import type { ChangeEvent } from "react";
import SearchProductItem from "../SearchProductItem";
import type { Accessory, Plant, Category, SubCategory, Collections } from "../../../types";

type SearchDrawerProps = {
    openDrawer: boolean;
    toggleDrawer: (open: boolean) => void;
    lang: string;
    searchText: string;
    onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onClearSearch: () => void;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    hasResults: boolean;
    productsResult: (Plant | Accessory)[];
    categoriesResult: Category[];
    subCategoriesResult: SubCategory[];
    collectionsResult: Collections[];
};

const SearchDrawer = ({
    openDrawer,
    toggleDrawer,
    lang,
    searchText,
    onSearchChange,
    onClearSearch,
    isLoading,
    isError,
    isSuccess,
    hasResults,
    productsResult,
    categoriesResult,
    subCategoriesResult,
    collectionsResult,
}: SearchDrawerProps) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleCloseDrawer = () => {
        onClearSearch();
        toggleDrawer(false);
    };


    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            handleCloseDrawer();
        }

        if (event.key === "Enter" && searchText.trim()) {
            event.preventDefault();

            const targetUrl = `/${lang}/search?q=${encodeURIComponent(searchText.trim())}`;

            handleCloseDrawer();
            navigate(targetUrl);
        }
    };

    const handleClickSearch = () => {
        if (searchText.trim()) {
            navigate(`/${lang}/search?q=${encodeURIComponent(searchText.trim())}`);
            handleCloseDrawer();
        }
    }

    return (
        <Drawer
            anchor={lang === "fa" ? "right" : "left"}
            dir={lang === "fa" ? "rtl" : "ltr"}
            open={openDrawer}
            onClose={() => handleCloseDrawer()}
            ModalProps={{ keepMounted: false }}
            slotProps={{
                paper: {
                    sx: {
                        width: { xs: "100%", sm: 500 },
                        borderRadius: lang === "fa" ? "16px 0 0 16px" : "0 16px 16px 0",
                        display: "flex",
                        flexDirection: "column",
                    },
                },
            }}
            sx={{ display: { xs: "flex", md: "none" } }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1.5,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                    {t("navbar.searchDrawerTitle")}
                </Typography>
                <IconButton onClick={() => handleCloseDrawer()}>
                    <RiCloseLargeFill size={22} />
                </IconButton>
            </Box>

            <Box sx={{ px: 2, pt: 2, pb: 1 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 1.5,
                        py: 0.5,
                        background: theme.palette.background.default,
                        borderRadius: "20px",
                        border: "1px solid transparent",
                        "&:focus-within": {
                            borderColor: theme.palette.primary.light,
                            background: theme.palette.action.focus,
                        },
                    }}
                >
                    <InputBase
                        autoFocus={openDrawer}
                        value={searchText}
                        onChange={onSearchChange}
                        onKeyDown={handleKeyDown}
                        placeholder={t("navbar.searchPlaceholder")}
                        sx={{ flex: 1, fontSize: "0.95rem", color: theme.palette.text.primary }}
                    />
                    <IconButton
                        size="small"
                        onClick={onClearSearch}
                        tabIndex={searchText ? 0 : -1}
                        sx={{
                            p: 0.5,
                            color: theme.palette.text.secondary,
                            opacity: searchText ? 1 : 0,
                            visibility: searchText ? "visible" : "hidden",
                        }}
                    >
                        <Close sx={{ fontSize: 18 }} />
                    </IconButton>

                    <IconButton
                        onClick={handleClickSearch}
                        sx={{ ":hover": { bgcolor: "unset" } }}>
                        <Search sx={{
                            color: theme.palette.text.secondary, fontSize: 22, ml: 1,
                            ":hover": {
                                color: theme.palette.secondary.main
                            }
                        }} />

                    </IconButton>

                </Box>
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1 }}>
                {isLoading && (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                        <CircularProgress size={28} />
                    </Box>
                )}

                {(isError || (isSuccess && !hasResults)) && !isLoading && Boolean(searchText.trim()) && (
                    <Typography sx={{ textAlign: "center", py: 3, color: "text.secondary" }}>
                        {t("search.notFoundSearch")}
                    </Typography>
                )}

                {isSuccess && hasResults && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {productsResult.length > 0 && (
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}>
                                    {t("search.products")}
                                </Typography>
                                {productsResult.map((product) => (
                                    <SearchProductItem key={product.id} product={product} lang={lang} onClose={handleCloseDrawer} />
                                ))}
                            </Box>
                        )}

                        {categoriesResult.length > 0 && (
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: "text.primary" }}>
                                    {t("search.category")}
                                </Typography>
                                {categoriesResult.map((cat) => (
                                    <Typography
                                        key={cat.id}
                                        component={Link}
                                        to={`/${lang}/products/category/${cat.id}`}
                                        onClick={handleCloseDrawer}
                                        sx={{
                                            display: "block",
                                            py: 0.75,
                                            px: 1,
                                            color: "text.primary",
                                            textDecoration: "none",
                                            fontSize: "0.9rem",
                                            "&:hover": { backgroundColor: theme.palette.action.selected, borderRadius: 0.5 },
                                        }}
                                    >
                                        {cat.name[lang as "fa" | "en"] || cat.name["fa"]}
                                    </Typography>
                                ))}
                            </Box>
                        )}

                        {subCategoriesResult.length > 0 && (
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: "text.primary" }}>
                                    {t("search.subCategory")}
                                </Typography>
                                {subCategoriesResult.map((sub) => (
                                    <Typography
                                        key={sub.id}
                                        component={Link}
                                        to={`/${lang}/products/category/${sub.categoryId}/subCategory/${sub.id}`}
                                        onClick={handleCloseDrawer}
                                        sx={{
                                            display: "block",
                                            py: 0.75,
                                            px: 1,
                                            color: "text.primary",
                                            textDecoration: "none",
                                            fontSize: "0.9rem",
                                            "&:hover": { backgroundColor: theme.palette.action.selected, borderRadius: 0.5 },
                                        }}
                                    >
                                        {sub.name[lang as "fa" | "en"] || sub.name["fa"]}
                                    </Typography>
                                ))}
                            </Box>
                        )}

                        {collectionsResult.length > 0 && (
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: "text.primary" }}>
                                    {t("search.collection")}
                                </Typography>
                                {collectionsResult.map((col) => (
                                    <Typography
                                        key={col.id}
                                        component={Link}
                                        to={`/${lang}/products/collection/${col.id}`}
                                        onClick={handleCloseDrawer}
                                        sx={{
                                            display: "block",
                                            py: 0.75,
                                            px: 1,
                                            color: "text.primary",
                                            textDecoration: "none",
                                            fontSize: "0.9rem",
                                            "&:hover": { backgroundColor: theme.palette.action.selected, borderRadius: 0.5 },
                                        }}
                                    >
                                        {col.name[lang as "fa" | "en"] || col.name["fa"]}
                                    </Typography>
                                ))}
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};

export default SearchDrawer;