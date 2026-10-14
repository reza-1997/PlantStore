
import { Box, Container, Typography, useTheme } from '@mui/material';
import { getImageUrl } from '../../utils/imageUrl';
import ProductSlider from '../../components/common/ProductsSlider';
import { useGetAllPlantsQuery } from '../../api/PlantApi';
import { useTranslation } from 'react-i18next';
import NewestPlantsSkeleton from './skeleton/NewestPlantsSkeleton';

const NewestPlantsSection = () => {
    const theme = useTheme();

    const { t } = useTranslation();

    const { data: plants, isLoading } = useGetAllPlantsQuery();
    const Houseplants = plants?.filter((plant) => plant.categoryId === 'c2') || [];

    // Render skeleton during API loading
    if (isLoading) {
        return <NewestPlantsSkeleton />;
    }

    return (
        <>
            {/* Dark Green Hero Banner with Curved Bottom Mask */}
            <Box
                sx={{
                    pt: { xs: 9, md: 12 },
                    pb: { xs: 16, md: 24 },
                    textAlign: 'center',
                    position: 'relative',
                    backgroundColor: theme.palette.background.paper,

                    backgroundImage: theme.palette.mode === 'dark' ? `url(${getImageUrl("wave-background-dark.svg")})` : `url(${getImageUrl("wave-background.svg")})`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    width: '100%',
                }}
            >
                <Container maxWidth="xl">
                    {/* Top Leaf Icon */}
                    <Typography
                        component="div"
                        sx={{
                            fontSize: '2rem',
                            mt: { xs: 30, sm: 30, md: 35, lg: 36 },
                            opacity: 0.9,
                        }}
                    >
                        🌱
                    </Typography>

                    {/* Section Main Title */}
                    <Typography
                        variant="h3"
                        component="h2"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
                            mb: 1.5,
                            color: '#ffffff',
                        }}
                    >
                        {t("newestPlants.title")}
                    </Typography>

                    {/* Section Subtitle */}
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontSize: { xs: '0.95rem', sm: '1.1rem' },
                            color: 'rgba(255, 255, 255, 0.85)',
                            maxWidth: 500,
                            mx: 'auto',
                        }}
                    >
                        {t("newestPlants.subtitle")}
                    </Typography>
                </Container>

                <Container
                    maxWidth="lg"
                    sx={{
                        mt: { xs: 3, md: 8 },
                        mb: { xs: 10, sm: 13, md: 15 },
                        position: 'relative',
                        zIndex: 10,
                    }}
                >

                    {/* Temporary Placeholder Box */}
                    <Box
                        sx={{
                            p: 4,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            boxShadow: theme.shadows[3],
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="body1" color="text.secondary">
                            <ProductSlider products={Houseplants} />
                        </Typography>
                    </Box>
                </Container >




            </Box >
        </>


    );
};

export default NewestPlantsSection




