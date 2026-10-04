import { useState } from "react";
import { Box, Chip, IconButton, useTheme } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { MdLocalOffer } from "react-icons/md";
import { BiFullscreen } from "react-icons/bi";
import type { Accessory, Plant } from "../../types";
import ScrollAnimate from "../../components/common/ScrollAnimate";
import FullscreenImage from "../../components/common/FullScreenImage";
import CustomNumeralNumericFormat from "../../components/common/CustomNumber";
import { useParams } from "react-router-dom";


import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import 'swiper/css/zoom';
import { getImageUrl } from "../../utils/imageUrl";



interface ProductGalleryProps {
    product: Plant | Accessory;
    discountPercentage: number;
}

const ProductGallery = ({ product, discountPercentage }: ProductGalleryProps) => {
    const theme = useTheme();
    const { lang } = useParams<{ lang: string }>()

    const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [openFullscreenImage, setOpenFullscreenImage] = useState(false);

    return (
        <Box sx={{ width: "90%", position: "sticky", top: 110, alignSelf: "flex-start" }}>
            <ScrollAnimate>

                {/* Main Swiper */}
                <Swiper
                    onSwiper={setMainSwiper}
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                    spaceBetween={10}
                    navigation
                    modules={[FreeMode, Navigation]}
                    style={{
                        width: "100%",
                        height: "630px",
                        borderRadius: '6px',
                        overflow: "hidden",
                        direction: lang === 'fa' ? 'rtl' : 'ltr',

                    }}
                >
                    {product.images.map((image, index) => (
                        <SwiperSlide key={image}>
                            <Box sx={{ height: "100%", width: "100%", position: "relative" }}>
                                <img
                                    src={getImageUrl(image)}
                                    alt={`${product.name[lang || 'fa']}-${index + 1}`}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",
                                        position: "absolute",
                                        right: 0,
                                        top: 0,
                                    }}
                                />

                                {/* icon OFF% */}
                                {product.discountPrice !== undefined && product.discountPrice !== null && (
                                    <Chip
                                        icon={<MdLocalOffer size={18} style={{ marginRight: 2 }} />}
                                        label={<CustomNumeralNumericFormat
                                            value={discountPercentage}
                                            prefix={lang === 'fa' ? "٪" : " - %"}
                                            suffix={lang === 'fa' ? " - " : ""}
                                        />}
                                        color="error"
                                        size="small"
                                        sx={{
                                            position: "absolute",
                                            bottom: 15,
                                            left: 0,
                                            height: 30,
                                            px: 0.5,
                                            fontWeight: 700,
                                            borderRadius: "0 6px 6px 0",
                                            boxShadow: 2,
                                            zIndex: 2,
                                        }}
                                    />
                                )}

                                {/* button fullscreen */}
                                <IconButton
                                    onClick={() => setOpenFullscreenImage(true)}
                                    sx={{
                                        position: "absolute",
                                        top: 12,
                                        right: 12,
                                        height: 30,
                                        px: 0.5,
                                        borderRadius: "999px",
                                        boxShadow: 10,
                                        zIndex: 2,
                                        backgroundColor: theme.palette.background.default,
                                    }}
                                >
                                    <BiFullscreen />
                                </IconButton>
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </ScrollAnimate>

            {/* component fullscreen image */}
            <FullscreenImage
                handleClose={() => setOpenFullscreenImage(false)}
                item={product}
                openImage={openFullscreenImage}
            />

            {/* Thumbnail Swiper */}
            <ScrollAnimate>
                <Box sx={{ width: "100%", mt: 2 }}>
                    <Swiper
                        spaceBetween={10}
                        slidesPerView={4}
                        freeMode
                        watchSlidesProgress
                        modules={[FreeMode, Navigation]}
                    >
                        {product.images.map((image, index) => (
                            <SwiperSlide key={image} onClick={() => mainSwiper?.slideTo(index)}>
                                <Box
                                    component="img"
                                    src={getImageUrl(image)}
                                    alt={`${product.name[lang || "fa"]}-thumbnail-${index + 1}`}
                                    sx={{
                                        width: "100%",
                                        height: 100,
                                        objectFit: "cover",
                                        borderRadius: '6px',
                                        cursor: "pointer",
                                        border: activeIndex === index ? `2px solid ${theme.palette.primary.main}` : "2px solid transparent",
                                        "&:hover": { opacity: 0.7 },
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </ScrollAnimate>
        </Box>
    );
};

export default ProductGallery