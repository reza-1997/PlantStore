
import { Box, useTheme } from "@mui/material"
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import ProductCard from "./ProductCard"
import type { Accessory, Plant } from "../../types"

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useParams } from "react-router-dom"
import ProductCardSkeleton from "./ProductCardSkeleton"


const ProductSlider = ({ products, loading = false }: { products: (Plant | Accessory)[], loading?: boolean }) => {

    const theme = useTheme()
    const { lang } = useParams<{ lang: string }>();


    return (

        <>
            {/* باکس نگه‌دارنده اسلایدر */}
            <Box
                sx={{
                    width: "100%",
                    "& .swiper-button-next, & .swiper-button-prev": {
                        color: theme.palette.success.main,
                    },
                    "& .swiper-pagination-bullet-active": {
                        backgroundColor: theme.palette.success.main,
                    }
                }}
            >
                <Swiper
                    modules={[Navigation, Pagination, A11y, Autoplay]}
                    spaceBetween={24}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    breakpoints={{
                        0: {
                            slidesPerView: 1.2,
                            spaceBetween: 10
                        },
                        480: {
                            slidesPerView: 2,
                            spaceBetween: 10
                        },
                        768: {
                            slidesPerView: 2.5,
                            spaceBetween: 18
                        },
                        1000: {
                            slidesPerView: 3,
                            spaceBetween: 15
                        },
                        1300: {
                            slidesPerView: 4.2,
                            spaceBetween: 17
                        }
                    }}
                    style={{
                        paddingBottom: '120px',
                        width: '100%',
                        direction: lang === 'fa' ? 'rtl' : 'ltr',

                    }}
                >
                    {loading
                        ? Array.from({ length: 6 }).map((_, index) => (
                            <SwiperSlide key={index}>
                                <ProductCardSkeleton />
                            </SwiperSlide>
                        ))
                        : products.map((item) => (
                            <SwiperSlide key={item.id}>
                                <ProductCard item={item} />
                            </SwiperSlide>
                        ))}
                </Swiper>
            </Box>
        </>
    )
}

export default ProductSlider