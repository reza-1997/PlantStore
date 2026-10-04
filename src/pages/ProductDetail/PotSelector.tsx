import { Box, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, Typography, useTheme } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ScrollAnimate from "../../components/common/ScrollAnimate";
import CustomNumeralNumericFormat from "../../components/common/CustomNumber";
import type { PotOption, PotOptionColor } from "../../types";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";





interface PotSelectorProps {
    potOptions?: PotOption[];
    selectedPotType: string;
    setSelectedPotType: (type: string) => void;
    selectedColor: string;
    setSelectedColor: (color: string) => void;
    selectedPotColor?: PotOptionColor;
    currentPot?: PotOption;
}
const PotSelector = ({
    potOptions,
    selectedPotType,
    setSelectedPotType,
    selectedColor,
    setSelectedColor,
    selectedPotColor,
    currentPot,
}: PotSelectorProps) => {
    const theme = useTheme();
    const { lang } = useParams<{ lang: string }>()
    const { t } = useTranslation()

    return (
        <ScrollAnimate>
            <FormControl>
                <FormLabel>
                    <Typography variant="h5" sx={{ mt: 2 }}>
                        {t('productDetail.potType')}
                    </Typography>
                </FormLabel>
                <RadioGroup
                    row
                    value={selectedPotType}
                    onChange={(event) => {
                        setSelectedPotType(event.target.value);
                        setSelectedColor("");

                    }}
                >
                    {potOptions?.map((item) => (
                        <FormControlLabel key={item.value} value={item.value} control={<Radio />} label={item.name[lang || 'fa']} />
                    ))}
                </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 3 }}>
                <Typography variant="h5" sx={{ mb: 2, display: "flex", flexDirection: "row", alignItems: "center" }}>
                    {t("productDetail.potColor")}
                    <Typography component="span" variant="h6" sx={{ mr: 1, color: theme.palette.text.secondary }}>
                        {!selectedPotType && <Typography component="span">
                            {t("productDetail.errorPotColor")}
                        </Typography>}
                        {selectedPotColor?.name[lang || 'fa']}

                        {selectedColor &&
                            (selectedPotColor?.price === 0 ? (
                                t("productDetail.FreePot")
                            ) : (
                                <CustomNumeralNumericFormat
                                style={{fontWeight:900}}
                                    value={selectedPotColor?.price}
                                    prefix=" ("
                                    thousandSeparator=","
                                    suffix={t("productDetail.currency")}
                                />
                            ))}
                    </Typography>
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                    {currentPot?.colors.map((color) => (
                        <IconButton
                            key={color.value}
                            onClick={() => {
                                color?.value && setSelectedColor(color.value);
                            }}
                            sx={{
                                width: 42,
                                height: 42,
                                padding: "4px",
                                border: selectedColor === color.value ? `3px solid ${theme.palette.primary.main}` : "3px solid transparent",
                                borderRadius: "50%",
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%",
                                    backgroundColor: color.value,
                                    border: color.value === "#FFFFFF" ? "1px solid #ddd" : "none",
                                    boxShadow: 2,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {selectedColor === color.value && (
                                    <CheckIcon sx={{ color: color.value === "#FFFFFF" ? "#000" : "#fff" }} />
                                )}
                            </Box>
                        </IconButton>
                    ))}
                </Box>
            </Box>
        </ScrollAnimate>
    );
};

export default PotSelector