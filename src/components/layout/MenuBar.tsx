import {
    Box,
    Paper,
    Popper,
    Typography,
    useTheme,
    Grid,
} from '@mui/material';
import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetCategoriesQuery, useGetSubCategoryByCategoryIdQuery } from '../../api/PlantApi';
import { useTranslation } from 'react-i18next';
import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import MegaMenuSkeleton from './MegaMenuSkeleton';
import { getImageUrl } from '../../utils/imageUrl';
interface ActiveMenu {
    id: string,
    name: string,
    image: string,
    desc: string
}

const MenuBar = () => {
    const theme = useTheme();
    const { lang } = useParams<{ lang: 'fa' | 'en' }>();
    const { t } = useTranslation()

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [activeMenu, setActiveMenu] = useState<ActiveMenu | null>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const {
        data: categories
    } = useGetCategoriesQuery()

    const {
        data: subCategories,
        isLoading: subCategoriesLoading
    } = useGetSubCategoryByCategoryIdQuery(
        activeMenu?.id || '',
        { skip: !activeMenu?.id }
    );


    const handleEnter = (event: React.MouseEvent<HTMLElement>, item: ActiveMenu) => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setAnchorEl(event.currentTarget);
        setActiveMenu(item);
    };

    const handleLeave = () => {
        closeTimer.current = setTimeout(() => {
            setAnchorEl(null);
            setActiveMenu(null);
        }, 200);
    };

    const open = Boolean(anchorEl);

    return (
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            {/* نوار اصلی منو */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5, py: 3, backgroundColor: theme.palette.background.paper }}>
                {categories?.map((category) => (
                    <Typography
                        key={category.id}
                        onMouseEnter={(e) => handleEnter(e, { id: category.id, name: category.name[lang || 'fa'], image: category.image, desc: category.desc[lang || 'fa'] })}
                        onMouseLeave={handleLeave}
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            color: activeMenu?.id === category.id ? theme.palette.success.main : theme.palette.text.primary,
                            position: 'relative',
                            transition: 'color 0.2s',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                width: activeMenu?.id === category.id ? '100%' : '0%',
                                height: '2px',
                                bottom: '-4px',
                                right: 0,
                                backgroundColor: theme.palette.primary.main,
                                transition: 'width 0.2s ease-in-out',
                            },
                        }}
                    >
                        {category.name[lang || 'fa']}
                    </Typography>
                ))}
            </Box>

            {/* بخش کشویی مگامنو (MEGA MENU) */}
            <Popper
                open={open}
                anchorEl={anchorEl}
                placement="bottom"
                disablePortal
                sx={{
                    zIndex: 1300,
                    width: '100vw',
                }}
            >
                <Paper
                    onMouseEnter={() => {
                        if (closeTimer.current) clearTimeout(closeTimer.current);
                    }}
                    onMouseLeave={handleLeave}
                    elevation={3}
                    sx={{
                        backgroundColor: theme.palette.background.default,
                        borderTop: `1px solid ${theme.palette.divider}`,
                        boxShadow: '0px 10px 30px rgba(0,0,0,0.06)',
                        p: { md: 5, lg: 6 },
                        mt: '1rem'

                    }}
                >
                    {subCategoriesLoading ? (

                        // Skeleton
                        <MegaMenuSkeleton />)

                        : (
                            <Grid container spacing={4} sx={{ maxWidth: '1200px', mx: 'auto' }}>
                                <Grid size={{ xs: 7, sm: 8 }} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Typography
                                        component={Link}
                                        to={`/${lang}/products/category/${activeMenu?.id}`}
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            color: theme.palette.primary.main,
                                            mb: 1,
                                            textDecoration: 'none',
                                            '&:hover': {
                                                color: theme.palette.primary.light,
                                            },
                                        }}>
                                        {activeMenu?.name}
                                    </Typography>

                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                                        {activeMenu &&
                                            subCategories?.map((subItem) =>
                                                <Typography
                                                    key={subItem.id}
                                                    component={Link}
                                                    to={`/${lang}/products/category/${activeMenu.id}/subCategory/${subItem.id}`}
                                                    sx={{
                                                        textDecoration: 'none',
                                                        color: 'text.secondary',
                                                        fontSize: '0.95rem',
                                                        fontWeight: 500,
                                                        py: 0.5,
                                                        '&:hover': {
                                                            color: theme.palette.secondary.main,
                                                            paddingRight: '6px',
                                                        },
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                >
                                                    {subItem.name[lang || 'fa']}
                                                </Typography>
                                            )}
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 5, sm: 4 }} >
                                    {activeMenu && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Box
                                                component="img"
                                                src={getImageUrl(activeMenu?.image)}
                                                alt={activeMenu?.name}
                                                sx={{
                                                    width: '100%',
                                                    height: '160px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ fontWeight: 600, mt: 1, color: 'text.primary' }}>
                                                {activeMenu?.desc}
                                            </Typography>
                                            <Typography
                                                component={Link}
                                                to={`/${lang}/products/category/${activeMenu?.id}`}
                                                variant="caption"
                                                sx={{
                                                    color: theme.palette.primary.main, fontWeight: 700, textDecoration: 'underline', cursor: 'pointer',
                                                    display: "flex", alignItems: 'center', gap: 1
                                                }}
                                            >
                                                {t("menuBar.viewAll")}
                                                {lang === 'fa' ? <FaArrowLeftLong /> : <FaArrowRightLong />}
                                            </Typography>
                                        </Box>
                                    )}


                                </Grid>

                            </Grid>
                        )
                    }
                </Paper>
            </Popper>
        </Box>
    );
}

export default MenuBar

