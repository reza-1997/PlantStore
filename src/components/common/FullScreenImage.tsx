import { Box, Dialog, DialogContent, IconButton, useTheme } from "@mui/material"
import { useState } from "react"
import { RiCloseLargeFill } from "react-icons/ri"
import { FreeMode, Navigation, Zoom } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper";


import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import 'swiper/css/zoom';
import type { Accessory, Plant } from "../../types"
import { getImageUrl } from "../../utils/imageUrl"

type prop = {
    item: Plant | Accessory,
    openImage: boolean,
    handleClose: () => void
}

const FullscreenImage = ({ item, openImage, handleClose }: prop) => {

    const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const theme = useTheme()


    return (
        <Dialog
            fullScreen
            open={openImage}
            onClose={handleClose}
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: "transparent",
                        boxShadow: "none",
                    },
                },
                backdrop: {
                    sx: {
                        backgroundColor: "rgba(0,0,0,0.8)",
                    },
                },
            }}
        >
            <IconButton onClick={handleClose}
                sx={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    zIndex: 10,
                    color: "white",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.7)"
                    }
                }} >
                <RiCloseLargeFill size={25} />
            </IconButton>


            <DialogContent
                sx={{
                    p: 0,
                    height: "100vh",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                }}>

                {/* main Swiper */}
                <Swiper
                    onSwiper={setMainSwiper}
                    onSlideChange={(Swiper) => setActiveIndex(Swiper.activeIndex)}
                    spaceBetween={10}
                    zoom={true}
                    navigation
                    modules={[FreeMode, Navigation, Zoom]}
                    className="mySwiper"
                    style={{
                        width: "100%",
                        height: "calc(100% - 130px)",
                        borderRadius: '16px',
                        overflow: 'hidden',
                    }}
                >
                    {item.images.map((image, index) => (
                        <SwiperSlide key={image}>
                            <Box
                                className="swiper-zoom-container"
                                sx={{
                                    height: '100%', width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <img
                                    src={getImageUrl(image)}
                                    alt={`${item.name}-${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        display: 'block',
                                        cursor: 'zoom-in',
                                    }}
                                />
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Thumbnail Swiper */}
                <Box sx={{
                    width: '100%',
                    height: 130,
                    mt: 2,
                }}>

                    <Swiper
                        spaceBetween={10}
                        slidesPerView={5}
                        slideToClickedSlide={true}
                        freeMode
                        watchSlidesProgress
                        modules={[FreeMode, Navigation]}
                    >
                        {item.images.map((image, index) => (
                            <SwiperSlide
                                key={image}
                                onClick={() => mainSwiper?.slideTo(index)}>
                                <Box
                                    component="img"
                                    src={getImageUrl(image)}
                                    alt={`${item.name}-thumbnail-${index + 1}`}
                                    sx={{
                                        width: '100%',
                                        height: 120,
                                        objectFit: 'cover',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        border: activeIndex === index
                                            ? `3px solid ${theme.palette.primary.main}`
                                            : '3px solid transparent',
                                        "&:hover": {
                                            opacity: 0.7,
                                        },
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                </Box>


            </DialogContent>
        </Dialog>


    )
}
export default FullscreenImage