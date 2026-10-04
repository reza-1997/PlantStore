import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import Typed from "typed.js";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { useGetBannerQuery } from "../../api/PlantApi";
import { Link, useParams } from "react-router-dom";
import { useCallback, useRef } from "react";
import ErrorPage from "../../components/common/ErrorPage";
import HomeHeroSkeleton from "./skeleton/HomeHeroSkeleton";
import { getImageUrl } from "../../utils/imageUrl";


const HomeHero = () => {
    const theme = useTheme();
    const { lang } = useParams<{ lang: string }>();

    const currentLang = (lang === 'en' || lang === 'fa') ? lang : 'fa';
    const isRtl = currentLang === 'fa';
    const isLtl = currentLang === 'en';


    const { data: banners, isLoading, isError } = useGetBannerQuery();

    const typedInstance = useRef<Typed | null>(null);

    const titleRef = useCallback((node: HTMLSpanElement | null) => {
        if (typedInstance.current) {
            typedInstance.current.destroy();
            typedInstance.current = null;
        }

        if (node !== null && Array.isArray(banners?.title)) {
            // استخراج رشته‌های متنی بر اساس زبان جاری
            const titleStrings = banners.title
                .map((item) => item[currentLang])
                .filter(Boolean); // حذف مقادیر خالی یا undefined

            if (titleStrings.length > 0) {
                node.innerHTML = "";
                typedInstance.current = new Typed(node, {
                    strings: titleStrings,
                    typeSpeed: 60,
                    backSpeed: 40,
                    backDelay: 2000,
                    loop: true,
                    showCursor: true,
                    cursorChar: '|',
                });
            }
        }
    }, [banners, currentLang]);

    if (isLoading) return <HomeHeroSkeleton />;
    if (isError || !banners) return <ErrorPage />;

    return (
        <Box
            sx={{
                minHeight: { xs: 'auto', md: '80vh' },
                width: '85%',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'center',
                alignItems: 'center',
                gap: { xs: 3, md: 5 },
                mx: 'auto',
                py: { xs: 2, md: 0 },
                zIndex: 2
            }}
        >
            {/* Text banner */}
            <Grid
                sx={{
                    width: { xs: '100%', md: '40%' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: { xs: 'center', md: isRtl ? 'flex-end' : 'flex-start' },
                    textAlign: { xs: 'center', md: isRtl ? 'right' : 'left' },
                    direction: isRtl ? 'rtl' : 'ltr',

                }}
            >
                <Typography variant="h3" sx={{ fontWeight: 900, minHeight: '80px', color: theme.palette.text.primary }}>
                    <span ref={titleRef}
                    ></span>
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        mt: 2,
                        color: theme.palette.text.secondary,
                        lineHeight: 1.6
                    }}
                >
                    {banners.subtitle?.[currentLang] || ""}
                </Typography>

                <Button
                    component={Link}
                    to={`/${currentLang}/${banners.link || ""}`}
                    variant="contained"
                    size="large"
                    sx={{
                        mt: 4,
                        borderRadius: 1,
                        gap: 1,
                        px: 4
                    }}
                >
                    {isRtl && <FaArrowLeftLong />}
                    {banners.ctaText?.[currentLang] || ""}
                    {isLtl && <FaArrowRightLong />}

                </Button>
            </Grid>

            {/* Image banner */}
            <Grid
                sx={{
                    width: {
                        xs: "100%",
                        md: "60%",
                        "& .swiper-button-next, & .swiper-button-prev": {
                            color: theme.palette.primary.contrastText
                        },
                        "& .swiper-pagination-bullet-active": {
                            backgroundColor: theme.palette.primary.contrastText
                        }
                    },
                    height: { xs: '40vh', md: '55vh' },
                    my: { xs: 2, md: 'auto' },
                    px: { xs: 2, md: 0 }
                }}
            >
                <Swiper
                    key={currentLang}
                    modules={[Navigation, Pagination, Autoplay, EffectFade]}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    effect="fade"
                    speed={1000}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    style={{
                        width: '100%',
                        height: '100%',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                        borderRadius: '10px',
                        direction: isRtl ? 'rtl' : 'ltr',

                    }}
                >
                    {banners?.images?.map((image, index) => (
                        <SwiperSlide key={index}>
                            <Box
                                component={Link}
                                to={`/${lang}/products`}>
                                <Box
                                    component={'img'}
                                    src={getImageUrl(image)}
                                    alt={`banner-${index}`}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block',
                                    }}
                                />
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Grid>
        </Box >
    );
};

export default HomeHero;