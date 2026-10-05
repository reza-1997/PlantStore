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
  const theme = useTheme();

  return (
    <Box sx={{ overflow: 'hidden', width: '100%' }}>
      {/* background Image 1 */}
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
          display: { xs: "none", md: "block" }
        }}
      />

      {/* background Image 2 */}
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
          zIndex: 0,
          transform: isRtl ? "scaleY(-1)" : "scale(-1, -1)",
          display: { xs: "none", md: "block" }
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
    </Box>
  );
};

export default Home;