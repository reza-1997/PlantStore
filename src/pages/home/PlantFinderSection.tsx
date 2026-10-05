import React from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    Avatar,
    Button,
    useTheme,
    Grid,
} from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ScrollAnimate from '../../components/common/ScrollAnimate';
import { getImageUrl } from '../../utils/imageUrl';

const FINDER_ITEMS = [
    {
        id: 'low-light',
        titleKey: 'plantFinder.items.lowLight.title',
        subtitleKey: 'plantFinder.items.lowLight.subtitle',
        icon: WbSunnyOutlinedIcon,
        image: getImageUrl("low-light.jpg"),
        CollectionId: `col7`,
    },
    {
        id: 'pet-friendly',
        titleKey: 'plantFinder.items.petFriendly.title',
        subtitleKey: 'plantFinder.items.petFriendly.subtitle',
        icon: PetsOutlinedIcon,
        image: getImageUrl("pet-friendly-plants.jpg"),
        CollectionId: `col3`,
    },
    {
        id: 'statement',
        titleKey: 'plantFinder.items.statement.title',
        subtitleKey: 'plantFinder.items.statement.subtitle',
        icon: AutoAwesomeOutlinedIcon,
        image: getImageUrl("giant-plants.jpg"),
        CollectionId: `col6`,
    },
    {
        id: 'easy-care',
        titleKey: 'plantFinder.items.easyCare.title',
        subtitleKey: 'plantFinder.items.easyCare.subtitle',
        icon: SpaOutlinedIcon,
        image: getImageUrl("mini-succulent.jpg"),
        CollectionId: `col4`,

    },
];

const PlantFinderSection: React.FC = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { lang } = useParams<{ lang: string }>();
    const isRtl = lang === 'fa';
    return (
        <Box
            component="section"
            sx={{
                backgroundColor: theme.palette.background.paper,
                py: { xs: 8, md: 15 },
                px: 2,
            }}
        >
            <Container maxWidth="xl">
                {/* Header Section */}
                <ScrollAnimate>
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography
                            variant="overline"
                            sx={{
                                fontWeight: 700,
                                letterSpacing: 2,
                                color: theme.palette.primary.light,
                                textTransform: 'uppercase',
                                fontSize: '0.875rem',
                                display: 'block',
                                mb: 1,
                            }}
                        >
                            {t('plantFinder.tagline')}
                        </Typography>

                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 700,
                                fontFamily: theme.typography.fontFamily,
                                color: 'text.primary',
                                fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
                                lineHeight: 1.2,
                                mb: 2,
                            }}
                        >
                            {t('plantFinder.title')}
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '1rem', md: '1.125rem' },
                                maxWidth: 600,
                                mx: 'auto',
                            }}
                        >
                            {t('plantFinder.subtitle')}
                        </Typography>
                    </Box>
                </ScrollAnimate>

                {/* Cards */}
                <Grid container spacing={2}>
                    {FINDER_ITEMS.map((item) => {
                        const IconComponent = item.icon;
                        const itemLink = `/${lang}/products/collection/${item.CollectionId}`;
                        return (
                            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 3 }}>
                                <ScrollAnimate>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            backgroundColor: theme.palette.background.default,
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-6px)',
                                                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
                                                '& .card-image': {
                                                    transform: 'scale(1.05)',
                                                },
                                                '& .arrow-icon': {
                                                    fontWeight: 900,
                                                    color: 'black'
                                                },
                                                "& .MuiAvatar-root": {
                                                    bgcolor: theme.palette.primary.dark,
                                                    color: theme.palette.primary.contrastText,
                                                    transform: "translateY(-2px)",
                                                }
                                            },
                                        }}
                                    >
                                        <CardActionArea
                                            component={RouterLink}
                                            to={itemLink}
                                            sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                                        >
                                            {/* Image Box */}
                                            <Box sx={{ overflow: 'hidden', height: 260, position: 'relative' }}>
                                                <CardMedia
                                                    component="img"
                                                    className="card-image"
                                                    image={item.image}
                                                    alt={t(item.titleKey)}
                                                    sx={{
                                                        height: '100%',
                                                        width: '100%',
                                                        objectFit: 'cover',
                                                        transition: 'transform 0.5s ease',
                                                    }}
                                                />
                                            </Box>

                                            {/* Card Content Footer */}
                                            <CardContent
                                                sx={{
                                                    p: 2.5,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justify: 'space-between',
                                                    gap: 2,
                                                    backgroundColor: theme.palette.background.default
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    {/* Circle Icon Badge */}
                                                    <Avatar
                                                        sx={{
                                                            width: 44,
                                                            height: 44,
                                                            color: theme.palette.primary.main,
                                                            bgcolor: theme.palette.action.disabled,
                                                        }}
                                                    >
                                                        <IconComponent fontSize="small" />
                                                    </Avatar>

                                                    {/* Text */}
                                                    <Box>
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{
                                                                fontWeight: 700,
                                                                lineHeight: 1.2,
                                                                color: 'text.primary',
                                                            }}
                                                        >
                                                            {t(item.titleKey)}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: 'text.secondary',
                                                                display: 'block',
                                                                mt: 0.5,
                                                            }}
                                                        >
                                                            {t(item.subtitleKey)}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/*  Arrow Icon */}
                                                <ArrowForwardIcon
                                                    className="arrow-icon"
                                                    sx={{
                                                        color: theme.palette.text.disabled,
                                                        fontSize: 20,
                                                        transition: 'transform 0.3s ease',
                                                        flexShrink: 0,
                                                        transform: isRtl ? 'rotate(180deg) translateX(4px)' : 'translateX(4px)',

                                                    }}
                                                />
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </ScrollAnimate>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* Bottom CTA Button */}
                <Box sx={{ textAlign: 'center', mt: 6 }}>
                    <Button
                        component={RouterLink}
                        to={`/${lang}/products`}
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                            fontWeight: 600,
                            fontSize: '1rem',
                            color: 'text.primary',
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3,
                            py: 3,
                            '&:hover': {
                                backgroundColor: 'unset',
                                color: theme.palette.primary.light
                            },
                            '& .MuiButton-endIcon': {
                                transition: 'transform 0.2s ease',
                                transform: isRtl ? 'rotate(180deg) translateX(4px)' : 'translateX(4px)',
                            },
                        }}
                    >
                        {t('plantFinder.browseAll')}
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default PlantFinderSection;