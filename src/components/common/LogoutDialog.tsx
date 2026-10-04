import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface LogoutDialogProps {
    open: boolean;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/**
 * Reusable dialog component for confirming user logout.
 */
const LogoutDialog = ({ open, loading, onClose, onConfirm }: LogoutDialogProps) => {
    const theme = useTheme();
    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        backdropFilter: "blur(4px)",
                    },
                },
                paper: {
                    sx: {
                        borderRadius: 3,
                        p: 1.5,
                    },
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 800, fontSize: "1.25rem", color: theme.palette.text.primary }}>
                {t("account.logoutDialog.title")}
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" color="text.secondary">
                    {t("account.logoutDialog.message")}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    disabled={loading}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                    {t("account.logoutDialog.cancel")}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    disabled={loading}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                    {loading ? t("common.loading") : t("account.logoutDialog.confirm")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LogoutDialog;