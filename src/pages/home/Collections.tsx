import { Box, Grid, Typography, useTheme } from "@mui/material";
import { useGetAllCollectionsQuery } from "../../api/PlantApi"
import { Link, useParams } from "react-router-dom";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import ScrollAnimate from "../../components/common/ScrollAnimate";

import ErrorPage from "../../components/common/ErrorPage";
import { t } from "i18next";
import CollectionsSkeleton from "./skeleton/CollectionsSkeleton";
import { getImageUrl } from "../../utils/imageUrl";


const Collections = () => {

    const theme = useTheme()
    const { lang } = useParams<{ lang: string }>()
    const isRtl = lang === 'fa';


    const { data: Collections, isLoading, isSuccess, isError } = useGetAllCollectionsQuery();

    let content;
    if (isLoading) {
        content = <CollectionsSkeleton />
    } else if (isError) {
        content = <ErrorPage />

    } else if (isSuccess) {
        content =

            <Box sx={{
                backgroundColor: theme.palette.background.paper,
                py: { xs: 4, md: 12 },
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
            }}>
                {/* background Image */}
                <Box component={"img"}
                    src={getImageUrl("background4.png")}
                    alt="backgroundImage"
                    sx={{
                        height: 800,
                        width: 500,
                        position: 'absolute',
                        opacity: 0.6,
                        top: 3260,
                        right: -200,
                        zIndex: 0,
                        transform: isRtl ? "none" : "scaleX(-1)",
                        display: { xs: "none", sm: 'none', md: 'none', lg: "none", xl: "block" }
                    }}
                />

                <Box sx={{ textAlign: 'start', width: { xs: "93%", sm: '92%', md: "85%", lg: '88%', xl: '85%' }, mb: 7 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            color: theme.palette.text.primary,
                            borderLeft: `5px solid ${theme.palette.success.main}`,
                            pl: 2
                        }}>
                        {t("home.collectionLabel")}
                    </Typography>

                </Box>

                <Box sx={{ width: { xs: "93%", sm: '100%', md: "100%", lg: '88%', xl: '85%' }, textAlign: 'center', zIndex: 1 }}>
                    <Grid container sx={{
                        width: '100%',
                        gap: { xs: 5, md: 4, lg: 3 }, overflow: "hidden", justifyContent: 'center'
                    }}>

                        {Collections.map((Collection) => (


                            <Grid key={Collection.id} size={{ xs: 12, sm: 5, md: 3, lg: 2.8 }}  >
                                <ScrollAnimate>
                                    <Box component={Link}
                                        to={`/${lang}/products/collection/${Collection.id}`}
                                        sx={{
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            '&:hover img': {
                                                transform: 'scale(1.08)',
                                            },
                                            '&:hover .MuiTypography-root': {
                                                transform: 'translateX(5px)',
                                                color: theme.palette.success.main
                                            }
                                        }}

                                    >
                                        <Box sx={{ overflow: 'hidden', borderRadius: 2, width: '100%', height: 400 }}>
                                            <Box component="img"
                                                src={getImageUrl(Collection.image)}
                                                alt={Collection.name[lang || 'fa']}
                                                sx={{
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                    height: '100%',
                                                    transition: 'transform 0.5s ease'
                                                }}
                                            />
                                        </Box>

                                        <Typography
                                            sx={{
                                                display: 'flex', alignItems: 'center',
                                                mt: 3, fontWeight: 700,
                                                transition: 'all 0.3s ease',
                                                gap: 1
                                            }}
                                        >
                                            {Collection.name[lang || 'fa']}
                                            {lang === 'fa' ? <FaArrowLeftLong /> : <FaArrowRightLong />}
                                        </Typography>
                                    </Box>
                                </ScrollAnimate>
                            </Grid>
                        )
                        )}
                    </Grid>
                </Box>
            </Box>
    }

    return content
}

export default Collections