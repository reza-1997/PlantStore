
import { Box, Container, Skeleton, Grid, useTheme } from '@mui/material';
import { getImageUrl } from '../../../utils/imageUrl';

const NewestPlantsSkeleton = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                pt: { xs: 6, md: 8 },
                pb: { xs: 16, md: 24 },
                textAlign: 'center',
                position: 'relative',
                backgroundColor: theme.palette.background.paper,
                backgroundImage: `url(${getImageUrl("wave-background.svg")})`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100%',
            }}
        >
            <Container maxWidth="xl">
                {/* Icon Skeleton */}
                <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    animation="wave"
                    sx={{
                        mx: 'auto',
                        mt: { xs: 20, md: 22 },
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                    }}
                />

                {/* Main Title Skeleton */}
                <Skeleton
                    variant="text"
                    width="280px"
                    height={60}
                    animation="wave"
                    sx={{
                        mx: 'auto',
                        mb: 1,
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                    }}
                />

                {/* Subtitle Skeleton */}
                <Skeleton
                    variant="text"
                    width="320px"
                    height={30}
                    animation="wave"
                    sx={{
                        mx: 'auto',
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                    }}
                />
            </Container>

            {/* Slider Container Skeleton */}
            <Container
                maxWidth="lg"
                sx={{
                    mt: { xs: 3, md: 8 },
                    mb: { xs: 5 },
                    position: 'relative',
                    zIndex: 10,
                }}
            >
                <Box
                    sx={{
                        p: 4,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: theme.shadows[3],
                    }}
                >
                    {/* Simulated Product Cards inside Slider */}
                    <Grid container spacing={2}>
                        {[1, 2, 3, 4].map((item) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
                                <Skeleton
                                    variant="rectangular"
                                    height={200}
                                    sx={{ borderRadius: 2, mb: 1.5 }}
                                    animation="wave"
                                />
                                <Skeleton variant="text" width="80%" animation="wave" />
                                <Skeleton variant="text" width="50%" animation="wave" />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default NewestPlantsSkeleton;