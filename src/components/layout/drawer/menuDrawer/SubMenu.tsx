import React from "react";
import {
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Skeleton,
    Typography,
    useTheme,
} from "@mui/material";
import { RiArrowLeftLongLine, RiArrowRightLongLine } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import type { SelectedMenu } from "./MenuDrawer";
import { useGetCategoryQuery, useGetSubCategoryByCategoryIdQuery } from "../../../../api/PlantApi";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { getImageUrl } from "../../../../utils/imageUrl";

type prop = {
    toggleDrawer: (open: boolean) => () => void;
    selectedMenu: SelectedMenu;
    setSelectedMenu: React.Dispatch<React.SetStateAction<SelectedMenu | null>>;
};

const SubMenu = ({ selectedMenu, setSelectedMenu, toggleDrawer }: prop) => {
    const theme = useTheme();
    const { lang } = useParams<{ lang: 'fa' | 'en' }>();
    const currentLang = lang || 'fa';
    const { t } = useTranslation();

    // Fetch subcategories for the selected menu item
    const { data: subCategories, isLoading: isSubCategoriesLoading } =
        useGetSubCategoryByCategoryIdQuery(selectedMenu.id, { skip: !selectedMenu.id });

    // Fetch category details to get the image URL
    const { data: categoryData, isLoading: isCategoryLoading } =
        useGetCategoryQuery(selectedMenu.id, { skip: !selectedMenu.id });

    const currentMenu = selectedMenu && subCategories ? subCategories : null;
    const categoryImageUrl = getImageUrl(categoryData?.image!);

    return (
        <Box role="presentation">
            {/* Back to main menu button */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                    pr: 0.8,
                    pl: 3,
                    pt: 0,
                    mt: 2,
                    width: '100%',
                    height: '5vh',
                    backgroundColor: theme.palette.background.default,
                    cursor: 'pointer',
                }}
                onClick={() => setSelectedMenu(null)}
            >
                <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                    {currentLang === "fa" ? <RiArrowRightLongLine size={20} /> : <RiArrowLeftLongLine size={20} />}
                </IconButton>
                <Box
                    sx={{
                        textDecoration: "none",
                        color: theme.palette.primary.main,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: 'center',
                        gap: 1,
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 700,
                            color: theme.palette.text.secondary,
                        }}
                    >
                        {selectedMenu.name}
                    </Typography>
                </Box>
            </Box>

            {/* Subcategories list with skeleton loading state */}
            {isSubCategoriesLoading ? (
                <Box sx={{ p: 2 }}>
                    {[...Array(4)].map((_, index) => (
                        <Box key={index} sx={{ my: 1.5 }}>
                            <Skeleton animation="wave" variant="text" width="60%" height={30} />
                            <Divider sx={{ mt: 1 }} />
                        </Box>
                    ))}
                </Box>
            ) : (
                <List
                    sx={{
                        p: 0,
                        "& .MuiListItem-root": {
                            p: 0,
                            minHeight: 45,
                            mt: 0,
                        },
                    }}
                >
                    {currentMenu?.map((subCategory, index) => (
                        <ListItem
                            sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start' }}
                            key={subCategory.id}
                        >
                            <ListItemButton
                                component={Link}
                                to={`/${currentLang}/products/category/${selectedMenu.id}/subCategory/${subCategory.id}`}
                                onClick={toggleDrawer(false)}
                                sx={{ width: '100%', height: '100%' }}
                            >
                                <ListItemText
                                    sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', height: '100%' }}
                                    primary={subCategory.name[currentLang]}
                                />
                            </ListItemButton>

                            <Divider sx={{ width: '100%', p: 0, m: 0, display: currentMenu.length - 1 === index ? "none" : "block" }} />
                        </ListItem>
                    ))}
                </List>
            )}

            {/* Category image banner and view all link */}
            <Box sx={{ p: 2 }}>
                {isCategoryLoading ? (
                    <Skeleton variant="rounded" width="100%" height={140} animation="wave" sx={{ borderRadius: 2 }} />
                ) : categoryImageUrl ? (
                    <Box
                        component={Link}
                        to={`/${currentLang}/products/category/${selectedMenu?.id}`}
                        onClick={toggleDrawer(false)}
                        sx={{
                            position: 'relative',
                            display: 'block',
                            width: '100%',
                            height: 200,
                            borderRadius: 1,
                            overflow: 'hidden',
                            textDecoration: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            '&:hover img': {
                                transform: 'scale(1.05)',
                            },
                            '&:hover .category-overlay': {
                                backgroundColor: 'rgba(0,0,0,0.45)',
                            },
                            '&:hover .MuiTypography-root': {
                                color: theme.palette.secondary.main,
                            },
                        }}
                    >
                        {/* Category image */}
                        <Box
                            component="img"
                            src={categoryImageUrl}
                            alt={selectedMenu.name}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.4s ease',
                            }}
                        />

                        {/* Text overlay */}
                        <Box
                            className="category-overlay"
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                p: 2,
                                transition: 'background-color 0.3s ease',
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.85)',
                                    fontWeight: 500,
                                    fontSize: '0.75rem',
                                }}
                            >
                                {selectedMenu.name}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mt: 0.5,
                                }}
                            >
                                {t("menuBar.viewAll")}
                                {currentLang === 'fa' ? <FaArrowLeftLong /> : <FaArrowRightLong />}
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    /* Fallback link if no category image is provided */
                    <Typography
                        component={Link}
                        to={`/${currentLang}/products/category/${selectedMenu?.id}`}
                        onClick={toggleDrawer(false)}
                        variant="body2"
                        sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1,
                            ":hover": {
                                color: theme.palette.primary.light,
                            },
                        }}
                    >
                        {t("menuBar.viewAll")}
                        {currentLang === 'fa' ? <FaArrowLeftLong /> : <FaArrowRightLong />}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default SubMenu;