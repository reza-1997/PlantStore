import { type FC, type ReactNode, type SyntheticEvent } from "react";
import {
    Alert,
    Slide,
    Snackbar,
    type AlertProps,
    type SlideProps,
    type SnackbarCloseReason,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface NotificationProps {
    content: ReactNode;
    open: boolean;
    type?: AlertProps["severity"];
    close: (event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => void;
}

const Notification: FC<NotificationProps> = ({ content, open, close, type }) => {

    const { i18n } = useTranslation();
    const isRtl = i18n.language === "fa";

    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={close}
            anchorOrigin={{ vertical: "top", horizontal: isRtl ? "right" : "left", }}
            slots={{ transition: Slide }}
            slotProps={{
                transition: {
                    direction: isRtl ? "left" : "right",
                    timeout: { enter: 800, exit: 800 },
                } as SlideProps,
            }}
            sx={{ mt: { xs: 7, sm: 8 } }}
        >
            <Alert
                onClose={close}
                severity={type}
                variant="filled"
                sx={{
                    width: "100%",
                    py: 1.5,
                    px: 2,
                    fontWeight: 700,
                    alignItems: "center",
                    "& .MuiAlert-icon": {
                        ml: 1.5,
                    },
                    "& .MuiAlert-message": {
                        px: 1,
                    },
                    "& .MuiAlert-action": {
                        mr: 1.5,
                        pl: 0,
                    },
                }}
            >
                {content}
            </Alert>
        </Snackbar >
    );
};

export default Notification;