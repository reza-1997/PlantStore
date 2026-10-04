import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

const ErrorPage = () => {
    const { t } = useTranslation()

    return (

        < Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }} >
            <Typography variant="h5" color="error">
                {t("common.errorLabel")}
            </Typography>
        </Box >
    )
}

export default ErrorPage