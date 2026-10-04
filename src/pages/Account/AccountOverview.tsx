import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Button, Typography, useTheme } from "@mui/material";

// Icons
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { getCurrentUser } from "../../services/authService";
import RecentlyViewedProducts from "../../components/common/RecentlyViewedProducts";
import AccountOverviewSkeleton from "./skeleton/AccountOverviewSkeleton";

/**
 * User account profile information view.
 */
const AccountOverview = () => {
    const theme = useTheme();
    const { lang = "fa" } = useParams<{ lang: string }>();
    const { t } = useTranslation();
    const isRtl = lang === "fa";
    const [loading, setLoading] = useState(true);

    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        birthdate: "-",
        subscribedNewsletter: false,
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getCurrentUser();
                if (user) {
                    setUserData({
                        firstName: user.user_metadata?.first_name || "",
                        lastName: user.user_metadata?.last_name || "",
                        email: user.email || "",
                        birthdate: user.user_metadata?.birthdate || "-",
                        subscribedNewsletter: Boolean(user.user_metadata?.subscribe_newsletter),
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        <AccountOverviewSkeleton />
    }

    return (
        <Box>
            {/* Header Section */}
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                {t("account.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                {t("account.subtitle")}
            </Typography>

            {/* Personal Details */}
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: theme.palette.primary.main }}>
                {t("account.basics.title")}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
                <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 700 }}>
                        {t("account.basics.name")}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {`${userData.firstName} ${userData.lastName}`}
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 700 }}>
                        {t("account.basics.email")}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {userData.email}
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 700 }}>
                        {t("account.basics.birthdate")}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {userData.birthdate}
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 700 }}>
                        {t("account.basics.newsletter")}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {userData.subscribedNewsletter ? t("common.yes") : t("common.no")}
                    </Typography>
                </Box>

                <Button
                    component={Link}
                    to={`/${lang}/account/edit`}
                    variant="text"
                    endIcon={isRtl ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                    sx={{
                        alignSelf: "flex-start",
                        p: 0,
                        textDecoration: "underline",
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        "&:hover": { backgroundColor: "transparent", color: theme.palette.primary.main },
                    }}
                >
                    {t("account.basics.updateDetails")}
                </Button>
            </Box>

            {/* Recent Orders Section */}
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: theme.palette.primary.main }}>
                {t("account.orders.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                {t("account.orders.empty")}
            </Typography>

            {/* Wishlist Summary Section */}
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: theme.palette.primary.main }}>
                {t("account.wishlist.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                {t("account.wishlist.empty")}
            </Typography>

            {/* Recently Viewed Carousel */}
            <RecentlyViewedProducts />
        </Box>
    );
};

export default AccountOverview;