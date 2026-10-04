import {
    AppBar,
    Backdrop,
    Badge,
    Box,
    IconButton,
    Toolbar,
    Typography,
    useTheme,
} from "@mui/material";

import {
    FavoriteBorder,
    PersonOutlined,
    ShoppingCartOutlined,
    Search,
    Menu,
} from "@mui/icons-material";

import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState, type ChangeEvent } from "react";
import SearchDrawer from "./drawer/SearchDrawer";
import MenuBar from "./MenuBar";
import MenuDrawer from "./drawer/menuDrawer/MenuDrawer";
import { FaMoon, FaSun } from "react-icons/fa";
import { useColorMode } from "../../context/ThemeContext";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { useAppSelector } from "../../hooks/redux";
import { selectAllCartItems } from "../../api/CartSlice";
import CustomNumeralNumericFormat from "../common/CustomNumber";
import NavSearchBar from "./NavSearchBar";
import { useGetSearchQuery } from "../../api/PlantApi";
import UserDrawer from "./drawer/UserDrawer";
import { getCurrentUser } from "../../services/authService";
import { supabase } from "../../config/supabaseClient";
import { t } from "i18next";
import { getImageUrl } from "../../utils/imageUrl";

type NavbarProps = {
    toggleDrawer: (open: boolean) => void;
};

const Navbar = ({ toggleDrawer }: NavbarProps) => {
    const theme = useTheme();
    const { lang = 'fa' } = useParams<{ lang: "fa" | 'en' }>();
    const { pathname } = useLocation();

    const { mode, toggleTheme } = useColorMode();

    // Supabase User State
    const [user, setUser] = useState<any>(null);

    // Listen to Supabase auth state changes
    useEffect(() => {
        // Fetch initial user
        getCurrentUser().then((currentUser) => setUser(currentUser));

        // Subscribe to auth changes (login/logout)
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // Get display name or email prefix
    const userName =
        user?.user_metadata?.first_name ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split("@")[0];

    // Drawer state
    const [openSearchDrawer, setOpenSearchDrawer] = useState(false);
    const toggleSearchDrawer = (open: boolean) => {
        setOpenSearchDrawer(open);
    };
    const [openMenuDrawer, setOpenMenuDrawer] = useState(false);
    const toggleDrawerMenuDrawer = (newOpen: boolean) => () => setOpenMenuDrawer(newOpen);

    const cart = useAppSelector(selectAllCartItems);

    const [userDrawerOpen, setUserDrawerOpen] = useState(false);

    // Centralized search state & API query
    const [searchText, setSearchText] = useState<string>("");

    const { data: searchResult, isLoading, isSuccess, isError } = useGetSearchQuery(
        searchText.trim(),
        { skip: !searchText.trim() }
    );

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleClearSearch = () => {
        setSearchText("");
    };

    const showPopper = Boolean(searchText.trim()) && !openSearchDrawer;
    const isSearchActive = Boolean(searchText.trim());

    const productsResult = isSearchActive ? [...(searchResult?.plants ?? []), ...(searchResult?.accessories ?? [])] : [];
    const categoriesResult = isSearchActive ? (searchResult?.categories ?? []) : [];
    const subCategoriesResult = isSearchActive ? (searchResult?.subCategories ?? []) : [];
    const collectionsResult = isSearchActive ? (searchResult?.collections ?? []) : [];

    const hasResults = isSearchActive && (
        productsResult.length > 0 ||
        categoriesResult.length > 0 ||
        subCategoriesResult.length > 0 ||
        collectionsResult.length > 0
    );

    const searchProps = {
        lang,
        searchText,
        onSearchChange: handleSearchChange,
        onClearSearch: handleClearSearch,
        isLoading,
        isError,
        isSuccess,
        hasResults,
        productsResult,
        categoriesResult,
        subCategoriesResult,
        collectionsResult,
        showPopper
    };

    return (
        <>
            <Backdrop open={showPopper} onClick={handleClearSearch} sx={{ zIndex: 1200, backgroundColor: "rgba(0,0,0,0.5)" }} />

            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    background: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    zIndex: showPopper ? 1250 : undefined,
                    width: "100%",
                }}
            >
                <Toolbar
                    disableGutters
                    sx={{
                        height: { xs: 70, sm: 90 },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: { xs: "95%", sm: "95%", md: "95%", lg: "93%", xl: "84%" },
                        mx: "auto",
                        position: "relative",
                    }}
                >
                    {/* Left: Language switcher, theme & logo */}
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Typography
                            component={Link}
                            to={`/${lang}`}
                            sx={{
                                textDecoration: "none",
                                color: theme.palette.primary.main,
                                fontWeight: 800,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                fontSize: { xs: 14, sm: 15, md: 17 }
                            }}
                        >
                            <Box component={'img'} src={getImageUrl("flowerShop.png")} alt="logo"
                                sx={{ display: { xs: "none", lg: "inline" }, height: 55, width: 200, objectFit: 'contain', mt: -3 }} />
                            <Box component={'img'} src={getImageUrl("logo.svg")} alt="logo"
                                sx={{ display: { xs: "none", sm: "inline", md: "none" }, height: 60, width: 60, objectFit: 'contain' }} />
                        </Typography>

                        <LanguageSwitcher />

                        <IconButton
                            sx={{
                                ":hover": {
                                    color: theme.palette.primary.light
                                }
                            }}
                            onClick={toggleTheme} color="primary">
                            {mode === 'dark' ? <FaMoon /> : <FaSun />}
                        </IconButton>
                    </Box>

                    {/* Center: Desktop Search */}
                    <NavSearchBar {...searchProps} />

                    {/* Right: Actions */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1.5 }, marginLeft: { sm: 0, md: '2rem' } }}>
                        <IconButton
                            sx={{
                                color: theme.palette.text.primary, display: { xs: "flex", md: "none" },
                                ":hover": {
                                    backgroundColor: 'unset',
                                    color: theme.palette.primary.light
                                }
                            }}
                            onClick={() => toggleSearchDrawer(true)}
                        >
                            <Search />
                        </IconButton>

                        <IconButton component={Link} to={`/${lang}/account/wishlist`} sx={{
                            color: theme.palette.text.primary,
                            ":hover": {
                                backgroundColor: 'unset',
                                color: theme.palette.primary.light
                            }
                        }}>
                            <FavoriteBorder />
                        </IconButton>

                        <IconButton
                            sx={{
                                color: theme.palette.text.primary,
                                ":hover": {
                                    backgroundColor: 'unset',
                                    color: theme.palette.primary.light
                                }
                            }}
                            onClick={() => toggleDrawer(true)}
                            disabled={pathname === `/${lang}/cart`}
                        >
                            <Badge
                                badgeContent={cart.length === 0 ? null : <CustomNumeralNumericFormat value={cart.length} />}
                                sx={{ "& .MuiBadge-badge": { backgroundColor: theme.palette.secondary.main, color: "#fff" } }}
                            >
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>


                        <IconButton
                            onClick={() => setUserDrawerOpen(true)}
                            sx={{
                                color: theme.palette.text.primary,
                                gap: 0.5,
                                ":hover": {
                                    backgroundColor: 'unset',
                                    color: theme.palette.primary.light
                                }
                            }}
                        >
                            <PersonOutlined />
                            {user && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: "1rem",
                                        display: { xs: "none", sm: "inline" }
                                    }}
                                >
                                    {t("common.hi")} {userName}
                                </Typography>
                            )}
                        </IconButton>

                        <IconButton
                            sx={{
                                color: theme.palette.text.primary, display: { xs: "flex", md: "none" },
                                ":hover": {
                                    backgroundColor: 'unset',
                                    color: theme.palette.primary.light
                                }
                            }}
                            onClick={toggleDrawerMenuDrawer(true)}
                        >
                            <Menu />
                        </IconButton>
                    </Box>
                </Toolbar>

                {/*Drawers */}
                <SearchDrawer openDrawer={openSearchDrawer} toggleDrawer={toggleSearchDrawer} {...searchProps} />
                <MenuDrawer openDrawer={openMenuDrawer} toggleDrawer={toggleDrawerMenuDrawer} />
                <UserDrawer open={userDrawerOpen} onClose={() => setUserDrawerOpen(false)}
                />
            </AppBar>

            <MenuBar />
        </>
    );
};

export default Navbar;