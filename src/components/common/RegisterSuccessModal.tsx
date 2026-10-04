import { Dialog, DialogContent, Typography, Button, Box, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

interface RegisterSuccessModalProps {
    open: boolean;
    firstName: string;
    onClose?: () => void;
}

const RegisterSuccessModal = ({ open, firstName, onClose }: RegisterSuccessModalProps) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { lang = "fa" } = useParams<{ lang: string }>();

    const handleLoginRedirect = () => {
        if (onClose) onClose();
        navigate(`/${lang}/account/overview`);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        p: 3,
                        boxShadow: theme.shadows[10],
                    },
                },
            }}
        >
            <DialogContent sx={{ p: 0 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 800,
                        color: theme.palette.primary.main,
                        mb: 1.5,
                    }}
                >
                    {t("registerSuccessModal.greeting", { name: firstName || t("registerSuccessModal.defaultName") })}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {t("registerSuccessModal.message")}
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Button
                        variant="contained"
                        onClick={handleLoginRedirect}
                        sx={{
                            borderRadius: 8,
                            px: 3.5,
                            py: 1,
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            textTransform: "none",
                            backgroundColor: theme.palette.primary.main,
                            "&:hover": {
                                backgroundColor: theme.palette.primary.dark,
                            },
                        }}
                    >
                        {t("registerSuccessModal.loginButton")}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default RegisterSuccessModal;