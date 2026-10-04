import { Box, Fade, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { FaCircleInfo } from "react-icons/fa6";
import ScrollAnimate from "../../components/common/ScrollAnimate";
import CustomNumeralNumericFormat from "../../components/common/CustomNumber";
import type { Accessory, Plant } from "../../types";
import { useTranslation } from "react-i18next";

interface ProductPriceProps {
    product: Plant | Accessory;
    unitPrice: number;
}

const ProductPrice = ({ product, unitPrice }: ProductPriceProps) => {
    const theme = useTheme();
    const { t } = useTranslation();

    return (
        <ScrollAnimate>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    fontWeight: 700,
                    mt: "auto",
                    width: "100%",
                    mb: 1
                }}
            >
                {/* Price Label & Info Icon */}
                <Typography variant="h4" component="span" sx={{ color: "text.primary" }}>
                    {t("common.price")}
                    <Tooltip
                        describeChild
                        arrow
                        title={t("common.TooltipPrice")}
                        slots={{ transition: Fade }}
                        slotProps={{
                            transition: { timeout: 600 },
                            tooltip: {
                                sx: {
                                    bgcolor: theme.palette.background.default,
                                    color: theme.palette.text.primary,
                                    fontSize: 16,
                                    maxWidth: 300,
                                },
                            },
                        }}
                    >
                        <IconButton size="small">
                            <FaCircleInfo />
                        </IconButton>
                    </Tooltip>
                </Typography>

                {/* Pricing Values */}
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5 }}>
                    {/* Original / Strikethrough Price */}
                    <Typography
                        component="span"
                        variant="h4"
                        sx={{
                            textDecoration: product.discountPrice ? "line-through" : "none",
                            color: product.discountPrice ? "text.disabled" : "text.primary",
                            fontWeight: 700,
                            fontSize: product.discountPrice
                                ? { xs: "1.1rem", sm: "1.3rem", md: "1.4rem" }
                                : { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                        }}
                    >
                        <CustomNumeralNumericFormat
                            value={product.discountPrice ? product.price : unitPrice}
                            thousandSeparator=","
                            suffix={product.discountPrice ? "" : ` ${t("common.currency")}`}
                        />
                    </Typography>

                    {/* Discounted Price */}
                    {product.discountPrice && (
                        <Typography
                            component="span"
                            variant="h4"
                            sx={{
                                color: theme.palette.success.dark,
                                fontWeight: 700,
                                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                            }}
                        >
                            <CustomNumeralNumericFormat
                                value={unitPrice}
                                thousandSeparator=","
                                suffix={` ${t("common.currency")}`}
                            />
                        </Typography>
                    )}
                </Box>
            </Box>
        </ScrollAnimate>
    );
};

export default ProductPrice;