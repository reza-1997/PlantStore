import { Accordion, AccordionDetails, AccordionSummary, Box, Typography, useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SunnyIcon from "@mui/icons-material/Sunny";
import HeightIcon from "@mui/icons-material/Height";
import WaterDrop from "@mui/icons-material/WaterDrop";
import { TbListDetails } from "react-icons/tb";
import { IoMdResize } from "react-icons/io";
import { PiPottedPlantFill } from "react-icons/pi";
import { SiLevelsdotfyi, SiMaterialformkdocs } from "react-icons/si";
import type { Accessory, Plant } from "../../types";
import ScrollAnimate from "../../components/common/ScrollAnimate";
import CustomNumeralNumericFormat from "../../components/common/CustomNumber";
import { Pets, Scale } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface ProductSpecsAccordionProps {
    product: Plant | Accessory;
}

export const ProductSpecsAccordion = ({ product }: ProductSpecsAccordionProps) => {
    const isPlant = (item: Plant | Accessory): item is Plant => {
        return "potSize" in item.specifications;
    };
    const isAccessory = (item: Plant | Accessory): item is Accessory => {
        return "material" in item.specifications;
    };

    const theme = useTheme();
    const { lang } = useParams<{ lang: 'fa' | 'en' }>();
    const { t } = useTranslation()


    return (
        <ScrollAnimate>
            <Box
                sx={{
                    width: "100%",
                    backgroundColor: theme.palette.primary.contrastText,
                    borderRadius: 1,
                    p: {xs:0,sm:2},
                    mt: 2,
                    color: theme.palette.text.primary,
                    display: "flex",
                    flexDirection: "column",
                    "& .MuiPaper-root": {
                        backgroundColor: "unset",
                        backgroundImage: "none",
                        boxShadow: "none",
                    },
                }}
            >
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }} variant="h5" component="span">
                            <TbListDetails />
                            {isPlant(product) ? t("ProductSpecsAccordion.titlePlant") : t("ProductSpecsAccordion.titleAccessory")}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                            {isPlant(product) && (
                                <>
                                    <SpecRow
                                        icon={<IoMdResize style={{ fontSize: 22 }} />}
                                        title={t("ProductSpecsAccordion.plantSize")}
                                        value={product.plantSize ? t(`plantSize.${product.plantSize}`) : "-"} />
                                    <SpecRow
                                        icon={<PiPottedPlantFill style={{ fontSize: 25 }} />}
                                        title={t("ProductSpecsAccordion.potSize")}
                                        value={<CustomNumeralNumericFormat value={product.specifications.potSize} thousandSeparator="," />}
                                    />
                                    <SpecRow
                                        icon={<SiLevelsdotfyi style={{ fontSize: 20 }} />}
                                        title={t("ProductSpecsAccordion.careLevel")}
                                        value={product.careLevel ? t(`careLevel.${product.careLevel}`) : "-"} />
                                    <SpecRow
                                        icon={<SunnyIcon />}
                                        title={t("ProductSpecsAccordion.light")}
                                        value={product.specifications.light[lang || 'fa']}
                                    />
                                    <SpecRow
                                        icon={<WaterDrop />}
                                        title={t("ProductSpecsAccordion.watering")}
                                        value={product.specifications.watering[lang || 'fa']}
                                    />
                                    <SpecRow
                                        icon={<HeightIcon sx={{ fontSize: 28 }} />}
                                        title={t("ProductSpecsAccordion.height")}
                                        value={product.specifications.height[lang || 'fa']}
                                    />
                                    <SpecRow
                                        icon={<Pets sx={{ fontSize: 28 }} />}
                                        title={t("ProductSpecsAccordion.petFriendly")}
                                        value={(product?.collectionIds.includes('col3')) ? t("ProductSpecsAccordion.petFriendlyYes") : t("ProductSpecsAccordion.petFriendlyNo")}
                                    />
                                </>
                            )}

                            {isAccessory(product) && (
                                <>
                                    <SpecRow
                                        icon={<SiMaterialformkdocs />}
                                        title={t("ProductSpecsAccordion.material")}
                                        value={product.specifications.material[lang || 'fa']}
                                    />
                                    <SpecRow
                                        icon={<Scale />}
                                        title={t("ProductSpecsAccordion.weight")}
                                        value={product.specifications.weight[lang || 'fa']}
                                    />
                                </>
                            )}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </ScrollAnimate>
    );
};

const SpecRow = ({ icon, title, value }: { icon: ReactNode; title: string; value: ReactNode }) => (
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", gap: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "center", width: 25 }}>{icon}</Box>
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 1 }}>
            <Typography sx={{fontSize:{xs:16,sm:21}}} >{title} : </Typography>
            <Typography sx={{fontSize:{xs:14,sm:18}}} component="div">{value}</Typography>
        </Box>
    </Box>
);