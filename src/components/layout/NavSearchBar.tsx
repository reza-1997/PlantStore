import {
    Box,
    CircularProgress,
    ClickAwayListener,
    IconButton,
    InputBase,
    Paper,
    Popper,
    Typography,
    useTheme,
} from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import { useRef, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SearchProductItem from "./SearchProductItem";
import type { Accessory, Plant, Category, SubCategory, Collections } from "../../types";

type NavSearchBarProps = {
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
    showPopper: boolean,
};

const NavSearchBar = ({
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
    showPopper,
}: NavSearchBarProps) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const searchInputRef = useRef<HTMLDivElement>(null);


    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") onClearSearch();
        if (event.key === "Enter" && searchText.trim()) {
            navigate(`/${lang}/search?q=${encodeURIComponent(searchText.trim())}`);
            onClearSearch();

        }
    };
    const handleClickSearch = () => {
        if (searchText.trim()) {
            navigate(`/${lang}/search?q=${encodeURIComponent(searchText.trim())}`);
            onClearSearch();
        }
    }

    return (
        <>
            <ClickAwayListener onClickAway={onClearSearch}>
                <Box
                    ref={searchInputRef}
                    sx={{
                        alignItems: "center",
                        background: theme.palette.background.paper,
                        borderRadius: "20px",
                        px: 1,
                        py: 0.5,
                        border: "1px solid transparent",
                        transition: "all 0.3s ease",
                        "&:focus-within": {
                            borderColor: theme.palette.primary.light,
                            background: theme.palette.action.focus,
                        },
                        display: { xs: "none", md: "flex" },
                        position: "absolute",
                        right: 0,
                        transform: "translateX(-50%)",
                        width: { md: 450, lg: 490 },
                    }}
                >
                    <InputBase
                        value={searchText}
                        onChange={onSearchChange}
                        onKeyDown={handleKeyDown}
                        placeholder={t("navbar.searchPlaceholder")}
                        sx={{ flex: 1, fontSize: "0.9rem", color: theme.palette.text.primary, ml: { md: 1 } }}
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
                            color: theme.palette.text.secondary, fontSize: 22,
                            ":hover": {
                                color: theme.palette.secondary.main
                            }
                        }} />
                    </IconButton>

                    <Popper
                        open={showPopper}
                        anchorEl={searchInputRef.current}
                        placement="bottom-start"
                        disablePortal
                        sx={{ width: searchInputRef.current?.clientWidth || 400, zIndex: 1300, marginTop: "8px" }}
                    >
                        <Paper
                            elevation={8}
                            sx={{
                                maxHeight: "65vh",
                                overflowY: "auto",
                                bgcolor: theme.palette.background.paper,
                                mt: 1,
                                px: 0.5,
                                py: 1,
                                width: "100%",
                                borderRadius: 1,

                            }}
                        >
                            {isLoading && (
                                <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                                    <CircularProgress size={24} />
                                </Box>
                            )}

                            {(isError || (isSuccess && !hasResults)) && !isLoading && (
                                <Typography sx={{ textAlign: "center", py: 1, color: "text.secondary" }}>
                                    {t("search.notFoundSearch")}
                                </Typography>
                            )}

                            {isSuccess && hasResults && (
                                <>
                                    {productsResult.length > 0 && (
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 0.5, ml: 1, color: theme.palette.text.primary }}>
                                                {t("search.products")}
                                            </Typography>
                                            {productsResult.map((product) => (
                                                <SearchProductItem key={product.id} product={product} lang={lang} onClose={onClearSearch} />
                                            ))}
                                        </Box>
                                    )}

                                    {categoriesResult.length > 0 && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, ml: 1, color: theme.palette.text.primary }}>
                                                {t("search.category")}
                                            </Typography>
                                            {categoriesResult.map((cat) => (
                                                <Typography
                                                    key={cat.id}
                                                    component={Link}
                                                    to={`/${lang}/products/category/${cat.id}`}
                                                    onClick={onClearSearch}
                                                    sx={{
                                                        display: "block",
                                                        color: "text.primary",
                                                        textDecoration: "none",
                                                        py: 0.75,
                                                        px: 1,
                                                        fontSize: "0.85rem",
                                                        "&:hover": { backgroundColor: theme.palette.action.selected, borderRadius: 0.5 },
                                                    }}
                                                >
                                                    {cat.name[lang as "fa" | "en"] || cat.name["fa"]}
                                                </Typography>
                                            ))}
                                        </Box>
                                    )}

                                    {subCategoriesResult.length > 0 && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, ml: 1, color: theme.palette.text.primary }}>
                                                {t("search.subCategory")}
                                            </Typography>
                                            {subCategoriesResult.map((sub) => (
                                                <Typography
                                                    key={sub.id}
                                                    component={Link}
                                                    to={`/${lang}/products/category/${sub.categoryId}/subCategory/${sub.id}`}
                                                    onClick={onClearSearch}
                                                    sx={{
                                                        display: "block",
                                                        color: "text.primary",
                                                        textDecoration: "none",
                                                        py: 0.75,
                                                        px: 1,
                                                        fontSize: "0.85rem",
                                                        "&:hover": { backgroundColor: theme.palette.action.selected, borderRadius: 0.5 },
                                                    }}
                                                >
                                                    {sub.name[lang as "fa" | "en"] || sub.name["fa"]}
                                                </Typography>
                                            ))}
                                        </Box>
                                    )}

                                    {collectionsResult.length > 0 && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, ml: 1, color: theme.palette.text.primary }}>
                                                {t("search.collection")}
                                            </Typography>
                                            {collectionsResult.map((col) => (
                                                <Typography
                                                    key={col.id}
                                                    component={Link}
                                                    to={`/${lang}/products/collection/${col.id}`}
                                                    onClick={onClearSearch}
                                                    sx={{
                                                        display: "block",
                                                        color: "text.primary",
                                                        textDecoration: "none",
                                                        py: 0.75,
                                                        px: 1,
                                                        fontSize: "0.85rem",
                                                        "&:hover": { backgroundColor: theme.palette.action.selected, borderRadius: 0.5 },
                                                    }}
                                                >
                                                    {col.name[lang as "fa" | "en"] || col.name["fa"]}
                                                </Typography>
                                            ))}
                                        </Box>
                                    )}
                                </>
                            )}
                        </Paper>
                    </Popper>
                </Box>
            </ClickAwayListener>
        </>
    );
};

export default NavSearchBar;