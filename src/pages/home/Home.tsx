import ScrollAnimate from "../../components/common/ScrollAnimate";
import Collections from "./Collections";
import HomeHero from "./HomeHero";
import ProductSlider from "./FeaturedProducts";
import { Box, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import PlantFinderSection from "./PlantFinderSection";
import { getImageUrl } from "../../utils/imageUrl";



const Home = () => {

  const { lang } = useParams<{ lang: string }>();
  const isRtl = lang === 'fa';

  const theme = useTheme()

  return (

    <>
      {/* background Image */}
      <Box component={"img"}
        src={getImageUrl("background1.png")}
        alt="backgroundImage"
        sx={{
          height: 800,
          width: 500,
          position: 'absolute',
          opacity: theme.palette.mode === 'dark' ? 0.3 : 0.6,
          bottom: 35,
          left: -100,
          zIndex: -1,
          transform: isRtl ? "none" : "scaleX(-1)",
          display: { sm: "none", md: "block" }
        }}
      />

      <Box component={"img"}
        src={getImageUrl("background1.png")}
        alt="backgroundImage"
        sx={{
          height: 800,
          width: 500,
          position: 'absolute',
          opacity: theme.palette.mode === 'dark' ? 0.3 : 0.6,
          bottom: -760,
          left: -100,
          zIndex: 1,
          transform: isRtl ? "scaleY(-1)" : "scale(-1, -1)",
          display: { sm: "none", md: "block" }
        }}
      />

      <Box component={"img"}
        src={getImageUrl("background.png")}
        alt="backgroundImage"
        sx={{
          position: 'absolute',
          opacity: theme.palette.mode === 'dark' ? 0.1 : 0.3,
          top: -120,
          right: -200,
          zIndex: -1,
          display: { sm: 'block', md: 'none' }
        }}
      />


      <HomeHero />
      <ScrollAnimate>
        <PlantFinderSection />
      </ScrollAnimate>

      <ScrollAnimate>
        <ProductSlider />
      </ScrollAnimate>

      <ScrollAnimate>
        <Collections />
      </ScrollAnimate>

    </>



  )

};

export default Home;



